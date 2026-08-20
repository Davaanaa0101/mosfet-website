import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";

// =====================================================
// CONFIGURATION
// =====================================================

// Device is considered online when telemetry was received
// within the last 30 seconds.
const ONLINE_THRESHOLD_MS = 30_000;

export async function GET(request: NextRequest) {
  try {
    // =====================================================
    // AUTHENTICATION
    // =====================================================

    const session = await auth.api.getSession({
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

    // =====================================================
    // DATABASE
    // =====================================================

    await connectDB();

    // =====================================================
    // LOAD ONLY DEVICES BELONGING TO LOGGED-IN USER
    // =====================================================
    //
    // IMPORTANT:
    //
    // We MUST NOT use:
    //
    //   Device.find()
    //
    // because that would return every user's devices.
    //
    // Only devices registered to the current logged-in
    // user's userId are returned.
    // =====================================================

    const devices = await Device.find({
      userId: session.user.id,
    })
      .sort({
        lastSeen: -1,
      })
      .lean();

    // =====================================================
    // CURRENT TIME
    // =====================================================

    const now = Date.now();

    // =====================================================
    // DEVICE IDS
    // =====================================================

    const deviceIds = devices.map(
      (device) => device.deviceId
    );

    // =====================================================
    // LATEST TELEMETRY
    // =====================================================
    //
    // Get only the newest telemetry record for each
    // device belonging to the logged-in user.
    // =====================================================

    const latestTelemetry =
      deviceIds.length > 0
        ? await DeviceLog.aggregate([
            // ---------------------------------------------
            // ONLY USER'S DEVICES
            // ---------------------------------------------

            {
              $match: {
                deviceId: {
                  $in: deviceIds,
                },
              },
            },

            // ---------------------------------------------
            // NEWEST TELEMETRY FIRST
            // ---------------------------------------------

            {
              $sort: {
                createdAt: -1,
              },
            },

            // ---------------------------------------------
            // LATEST RECORD PER DEVICE
            // ---------------------------------------------

            {
              $group: {
                _id: "$deviceId",

                telemetry: {
                  $first: "$$ROOT",
                },
              },
            },
          ])
        : [];

    // =====================================================
    // TELEMETRY MAP
    // =====================================================

    const telemetryMap = new Map<
      string,
      Record<string, any>
    >();

    for (const item of latestTelemetry) {
      if (
        item?._id &&
        item?.telemetry
      ) {
        telemetryMap.set(
          String(item._id),
          item.telemetry
        );
      }
    }

    // =====================================================
    // BUILD DASHBOARD DEVICES
    // =====================================================

    const dashboardDevices = devices.map(
      (device) => {
        // -----------------------------------------------
        // FIND LATEST TELEMETRY
        // -----------------------------------------------

        const telemetry =
          telemetryMap.get(
            device.deviceId
          ) || null;

        // -----------------------------------------------
        // TELEMETRY CREATED AT
        //
        // IMPORTANT:
        //
        // Use optional chaining here so TypeScript knows
        // telemetry can safely be null.
        // -----------------------------------------------

        const telemetryCreatedAt =
          telemetry?.createdAt || null;

        // -----------------------------------------------
        // TELEMETRY TIMESTAMP
        // -----------------------------------------------

        const telemetryTime =
          telemetryCreatedAt
            ? new Date(
                telemetryCreatedAt
              ).getTime()
            : 0;

        // -----------------------------------------------
        // HAS TELEMETRY
        // -----------------------------------------------

        const hasTelemetry =
          telemetryTime > 0 &&
          !Number.isNaN(
            telemetryTime
          );

        // -----------------------------------------------
        // RECENT TELEMETRY
        // -----------------------------------------------

        const hasRecentTelemetry =
          hasTelemetry &&
          now - telemetryTime <=
            ONLINE_THRESHOLD_MS;

        // -----------------------------------------------
        // DETERMINE STATUS
        // -----------------------------------------------

        let status: string;

        // -------------------------------------------------
        // NO TELEMETRY EVER RECEIVED
        // -------------------------------------------------

        if (!hasTelemetry) {
          status = "REGISTERED";
        }

        // -------------------------------------------------
        // TELEMETRY EXISTS BUT IS TOO OLD
        // -------------------------------------------------

        else if (!hasRecentTelemetry) {
          status = "OFFLINE";
        }

        // -------------------------------------------------
        // DEVICE IS CURRENTLY ONLINE
        // -------------------------------------------------

        else {
          const deviceStatus =
            String(
              device.status || ""
            ).toUpperCase();

          // -----------------------------------------------
          // ERROR
          // -----------------------------------------------

          if (
            deviceStatus ===
            "ERROR"
          ) {
            status = "ERROR";
          }

          // -----------------------------------------------
          // WARNING
          // -----------------------------------------------

          else if (
            deviceStatus ===
            "WARNING"
          ) {
            status = "WARNING";
          }

          // -----------------------------------------------
          // NORMAL
          // -----------------------------------------------

          else {
            status = "RUNNING";
          }
        }

        // -----------------------------------------------
        // EFFECTIVE LAST SEEN
        //
        // Prefer actual telemetry timestamp.
        //
        // This prevents the dashboard from showing
        // OFFLINE when telemetry is actively arriving
        // but Device.lastSeen was not updated correctly.
        // -----------------------------------------------

        const effectiveLastSeen =
          telemetryCreatedAt ||
          device.lastSeen ||
          null;

        // -----------------------------------------------
        // RETURN DEVICE
        // -----------------------------------------------

        return {
          // ---------------------------------------------
          // IDENTITY
          // ---------------------------------------------

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

          // ---------------------------------------------
          // STATUS
          // ---------------------------------------------

          status,

          // ---------------------------------------------
          // NETWORK
          // ---------------------------------------------

          ipAddress:
            device.ipAddress ||
            "",

          location:
            device.location ||
            "",

          type:
            device.type ||
            "esp32",

          // ---------------------------------------------
          // TIMESTAMPS
          // ---------------------------------------------

          lastSeen:
            effectiveLastSeen,

          registeredAt:
            device.registeredAt ||
            null,

          // ---------------------------------------------
          // TELEMETRY
          // ---------------------------------------------

          telemetry,
        };
      }
    );

    // =====================================================
    // USER DEVICE STATISTICS
    // =====================================================

    const totalDevices =
      dashboardDevices.length;

    // RUNNING / WARNING / ERROR are all considered
    // currently online because telemetry is recent.

    const onlineDevices =
      dashboardDevices.filter(
        (device) =>
          device.status ===
            "RUNNING" ||
          device.status ===
            "WARNING" ||
          device.status ===
            "ERROR"
      );

    const offlineDevices =
      dashboardDevices.filter(
        (device) =>
          device.status ===
          "OFFLINE"
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
    // =====================================================
    //
    // Only activity belonging to the current user's
    // devices is returned.
    // =====================================================

    const rawActivity =
      deviceIds.length > 0
        ? await DeviceLog.find({
            deviceId: {
              $in: deviceIds,
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
          // ---------------------------------------------
          // ID
          // ---------------------------------------------

          _id:
            activity._id,

          // ---------------------------------------------
          // DEVICE
          // ---------------------------------------------

          deviceId:
            activity.deviceId,

          deviceName:
            deviceNameMap.get(
              activity.deviceId
            ) ||
            activity.deviceId,

          // ---------------------------------------------
          // SENSOR DATA
          // ---------------------------------------------

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

          // ---------------------------------------------
          // NETWORK
          // ---------------------------------------------

          wifiSSID:
            activity.wifiSSID,

          ipAddress:
            activity.ipAddress,

          rssi:
            activity.rssi,

          // ---------------------------------------------
          // SYSTEM
          // ---------------------------------------------

          freeHeap:
            activity.freeHeap,

          uptime:
            activity.uptime,

          // ---------------------------------------------
          // SENSORS
          // ---------------------------------------------

          sensors:
            activity.sensors,

          // ---------------------------------------------
          // TIMESTAMP
          // ---------------------------------------------

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
        totalDevices,

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
    // =====================================================
    // ERROR
    // =====================================================

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