import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";

// =====================================================
// OFFLINE TIMEOUT
//
// If a registered device has not sent telemetry within
// this amount of time, the dashboard displays OFFLINE.
//
// Your ESP32 currently sends approximately every 10 sec.
// 30 sec gives us a reasonable tolerance.
// =====================================================

const OFFLINE_TIMEOUT_MS =
  30 * 1000;

// =====================================================
// GET DEVICES
//
// IMPORTANT:
//
// Only devices registered to the currently logged-in
// user are returned.
//
// Unregistered devices are NEVER returned here.
//
// =====================================================

export async function GET(
  request: NextRequest
) {
  try {
    // =================================================
    // AUTHENTICATION
    // =================================================

    const session =
      await auth.api.getSession({
        headers: request.headers,
      });

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // =================================================
    // DATABASE
    // =================================================

    await connectDB();

    // =================================================
    // LOAD ONLY THIS USER'S DEVICES
    // =================================================
    //
    // This is the important change.
    //
    // Previously:
    //
    // Device.find()
    //
    // That returned EVERY device.
    //
    // Now:
    //
    // Device.find({
    //   userId: session.user.id,
    // })
    //
    // =================================================

    const devices =
      await Device.find({
        userId:
          session.user.id,
      })
        .sort({
          lastSeen: -1,
        })
        .lean();

    // =================================================
    // CURRENT TIME
    // =================================================

    const now =
      Date.now();

    // =================================================
    // FORMAT DEVICES
    // =================================================

    const result =
      devices.map(
        (device) => {
          // -------------------------------------------
          // LAST SEEN
          // -------------------------------------------

          const lastSeen =
            device.lastSeen
              ? new Date(
                  device.lastSeen
                ).getTime()
              : 0;

          const hasValidLastSeen =
            lastSeen > 0 &&
            !Number.isNaN(
              lastSeen
            );

          // -------------------------------------------
          // OFFLINE
          // -------------------------------------------

          const isOffline =
            !hasValidLastSeen ||
            now - lastSeen >
              OFFLINE_TIMEOUT_MS;

          // -------------------------------------------
          // STATUS
          // -------------------------------------------
          //
          // A registered device with no telemetry yet
          // remains REGISTERED.
          //
          // A device that was previously running but
          // stopped sending telemetry becomes OFFLINE.
          //
          // WARNING / ERROR from telemetry are preserved
          // while the device is still communicating.
          //
          // -------------------------------------------

          let status =
            device.status;

          if (
            isOffline
          ) {
            status =
              "OFFLINE";
          } else if (
            device.status ===
              "NOT_REGISTERED"
          ) {
            // This should normally never happen because
            // unregistered devices are excluded above.
            status =
              "REGISTERED";
          }

          // -------------------------------------------
          // RESPONSE OBJECT
          // -------------------------------------------

          return {
            _id: String(
              device._id
            ),

            deviceId:
              device.deviceId,

            serialId:
              device.serialId,

            name:
              device.name ||
              device.deviceId,

            type:
              device.type,

            location:
              device.location ||
              "",

            macAddress:
              device.macAddress ||
              "",

            firmware:
              device.firmware ||
              "",

            ipAddress:
              device.ipAddress ||
              "",

            status,

            lastSeen:
              device.lastSeen,

            registeredAt:
              device.registeredAt,

            createdAt:
              device.createdAt,
          };
        }
      );

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,

      devices: result,
    });
  } catch (error) {
    console.error(
      "[devices] GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to load devices",
      },
      {
        status: 500,
      }
    );
  }
}