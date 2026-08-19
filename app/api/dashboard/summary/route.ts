import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@/lib/auth";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";

const ONLINE_THRESHOLD_MS =
  30_000;

export async function GET(
  request: NextRequest
) {
  try {
    // =====================================================
    // AUTHENTICATION
    // =====================================================

    const session =
      await auth.api.getSession({
        headers:
          request.headers,
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

    // =====================================================
    // DATABASE
    // =====================================================

    await connectDB();

    // =====================================================
    // LOAD ONLY REGISTERED DEVICES BELONGING TO USER
    // =====================================================
    //
    // IMPORTANT:
    //
    // Before:
    //
    // Device.find()
    //
    // This returned EVERY device in MongoDB.
    //
    // Now:
    //
    // userId = logged-in user
    //
    // Therefore:
    //
    // NOT_REGISTERED devices
    // other users' devices
    //
    // are excluded.
    // =====================================================

    const devices =
      await Device.find({
        userId:
          session.user.id,
      })
        .sort({
          lastSeen: -1,
        })
        .lean();

    // =====================================================
    // CURRENT TIME
    // =====================================================

    const now =
      Date.now();

    // =====================================================
    // ONLINE / OFFLINE
    // =====================================================

    const onlineDevices =
      devices.filter(
        (device) => {
          if (!device.lastSeen) {
            return false;
          }

          const lastSeen =
            new Date(
              device.lastSeen
            ).getTime();

          return (
            !Number.isNaN(
              lastSeen
            ) &&
            now -
              lastSeen <=
              ONLINE_THRESHOLD_MS
          );
        }
      );

    // =====================================================
    // ONLINE DEVICE IDS
    // =====================================================

    const onlineIds =
      new Set(
        onlineDevices.map(
          (device) =>
            String(
              device._id
            )
        )
      );

    // =====================================================
    // OFFLINE DEVICES
    // =====================================================

    const offlineDevices =
      devices.filter(
        (device) =>
          !onlineIds.has(
            String(
              device._id
            )
          )
      );

    // =====================================================
    // LATEST TELEMETRY
    //
    // Only telemetry belonging to the user's devices
    // is loaded.
    // =====================================================

    const deviceIds =
      devices.map(
        (device) =>
          device.deviceId
      );

    const latestTelemetry =
      deviceIds.length > 0
        ? await DeviceLog.aggregate(
            [
              // -----------------------------------------
              // ONLY USER'S DEVICES
              // -----------------------------------------

              {
                $match: {
                  deviceId: {
                    $in:
                      deviceIds,
                  },
                },
              },

              // -----------------------------------------
              // NEWEST FIRST
              // -----------------------------------------

              {
                $sort: {
                  createdAt: -1,
                },
              },

              // -----------------------------------------
              // LATEST RECORD PER DEVICE
              // -----------------------------------------

              {
                $group: {
                  _id:
                    "$deviceId",

                  telemetry: {
                    $first:
                      "$$ROOT",
                  },
                },
              },
            ]
          )
        : [];

    // =====================================================
    // TELEMETRY MAP
    // =====================================================

    const telemetryMap =
      new Map<
        string,
        Record<
          string,
          unknown
        >
      >();

    for (
      const item of
        latestTelemetry
    ) {
      if (
        item?._id &&
        item?.telemetry
      ) {
        telemetryMap.set(
          String(
            item._id
          ),
          item.telemetry
        );
      }
    }

    // =====================================================
    // BUILD DEVICE DATA
    // =====================================================

    const dashboardDevices =
      devices.map(
        (device) => {
          const telemetry =
            telemetryMap.get(
              device.deviceId
            ) || null;

          // ---------------------------------------------
          // DETERMINE STATUS
          // ---------------------------------------------

          let status =
            device.status;

          const lastSeen =
            device.lastSeen
              ? new Date(
                  device.lastSeen
                ).getTime()
              : 0;

          const hasRecentTelemetry =
            lastSeen > 0 &&
            !Number.isNaN(
              lastSeen
            ) &&
            now -
              lastSeen <=
              ONLINE_THRESHOLD_MS;

          if (
            !hasRecentTelemetry
          ) {
            status =
              "OFFLINE";
          }

          return {
            // -------------------------------------------
            // IDENTITY
            // -------------------------------------------

            _id: String(
              device._id
            ),

            deviceId:
              device.deviceId,

            serialId:
              device.serialId,

            deviceName:
              device.name ||
              device.deviceId,

            // -------------------------------------------
            // STATUS
            // -------------------------------------------

            status,

            // -------------------------------------------
            // NETWORK
            // -------------------------------------------

            ipAddress:
              device.ipAddress ||
              "",

            location:
              device.location ||
              "",

            type:
              device.type ||
              "esp32",

            // -------------------------------------------
            // TIMESTAMPS
            // -------------------------------------------

            lastSeen:
              device.lastSeen ||
              null,

            registeredAt:
              device.registeredAt ||
              null,

            // -------------------------------------------
            // TELEMETRY
            // -------------------------------------------

            telemetry,
          };
        }
      );

    // =====================================================
    // DEVICE NAME MAP
    // =====================================================

    const deviceNameMap =
      new Map(
        devices.map(
          (device) => [
            device.deviceId,
            device.name ||
              device.deviceId,
          ]
        )
      );

    // =====================================================
    // RECENT ACTIVITY
    //
    // IMPORTANT:
    //
    // Before:
    //
    // DeviceLog.find()
    //
    // That returned activity from EVERY device.
    //
    // Now we only query the user's devices.
    // =====================================================

    const rawActivity =
      deviceIds.length > 0
        ? await DeviceLog.find({
            deviceId: {
              $in:
                deviceIds,
            },
          })
            .sort({
              createdAt: -1,
            })
            .limit(10)
            .lean()
        : [];

    // =====================================================
    // FORMAT RECENT ACTIVITY
    // =====================================================

    const recentActivity =
      rawActivity.map(
        (activity) => ({
          _id:
            activity._id,

          deviceId:
            activity.deviceId,

          deviceName:
            deviceNameMap.get(
              activity.deviceId
            ) ||
            activity.deviceId,

          temperature:
            activity.temperature,

          humidity:
            activity.humidity,

          voltage:
            activity.voltage,

          current:
            activity.current,

          power:
            activity.power,

          energy:
            activity.energy,

          wifiSSID:
            activity.wifiSSID,

          ipAddress:
            activity.ipAddress,

          rssi:
            activity.rssi,

          freeHeap:
            activity.freeHeap,

          uptime:
            activity.uptime,

          sensors:
            activity.sensors,

          createdAt:
            activity.createdAt,
        })
      );

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,

      // =================================================
      // USER STATS
      // =================================================

      stats: {
        totalDevices:
          devices.length,

        onlineDevices:
          onlineDevices.length,

        offlineDevices:
          offlineDevices.length,
      },

      // =================================================
      // USER DEVICES ONLY
      // =================================================

      devices:
        dashboardDevices,

      // =================================================
      // USER DEVICE ACTIVITY ONLY
      // =================================================

      recentActivity,
    });
  } catch (error) {
    console.error(
      "[dashboard] Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to load dashboard",
      },
      {
        status: 500,
      }
    );
  }
}