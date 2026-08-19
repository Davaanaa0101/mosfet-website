import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@/lib/auth";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";

// =====================================================
// GET DEVICES
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
    // LOAD DEVICES
    // =================================================

    const devices =
      await Device.find()
        .sort({
          lastSeen: -1,
        })
        .lean();

    // =================================================
    // ONLINE STATUS
    // =================================================

    const now =
      Date.now();

    const result =
      devices.map(
        (device) => {
          const lastSeen =
            device.lastSeen
              ? new Date(
                  device.lastSeen
                ).getTime()
              : 0;

          const isOnline =
            lastSeen > 0 &&
            !Number.isNaN(
              lastSeen
            ) &&
            now - lastSeen <=
              30_000;

          return {
            _id: String(
              device._id
            ),

            deviceId:
              device.deviceId,

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

            status:
              isOnline
                ? "online"
                : "offline",

            lastSeen:
              device.lastSeen,

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