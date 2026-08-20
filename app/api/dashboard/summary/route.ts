import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";

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

    const devices = await Device.find({
      userId: session.user.id,
    })
      .sort({
        lastSeen: -1,
      })
      .lean();

    // =====================================================
    // DEVICE IDS
    // =====================================================

    const deviceIds = devices.map(
      (device) => device.deviceId
    );

    // =====================================================
    // LATEST TELEMETRY
    //
    // Only load telemetry for the current user's devices.
    // =====================================================

    const latestTelemetry =
      deviceIds.length > 0
        ? await DeviceLog.aggregate([
            {
              $match: {
                deviceId: {
                  $in: deviceIds,
                },
              },
            },

            {
              $sort: {
                createdAt: -1,
              },
            },

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
    // CURRENT TIME
    // =====================================================

    const now = Date.now();

    // =====================================================
    // BUILD DEVICE DATA
    // =====================================================

    const dashboardDevices = devices.map(
      (device) => {
        const telemetry =
          telemetryMap.get(
            device.deviceId
          ) || null;

        // -------------------------------------------------
        // TELEMETRY TIME
        //
        // IMPORTANT:
        // Use DeviceLog.createdAt instead of Device.lastSeen
        // because DeviceLog is the actual telemetry source.
        // -------------------------------------------------

        let telemetryTime = 0;

        if (telemetry?.createdAt) {
          telemetryTime = new Date(
            telemetry.createdAt
          ).getTime();
        }

        const hasTelemetry =
          telemetryTime > 0 &&
          !Number.isNaN(
            telemetryTime
          );

        const hasRecentTelemetry =
          hasTelemetry &&
          now - telemetryTime <=
            ONLINE_THRESHOLD_MS;

        // -------------------------------------------------
        // PREVIOUS TELEMETRY
        //
        // If telemetry exists but is stale, the device
        // is OFFLINE.
        //
        // If there has never been telemetry, it remains
        // REGISTERED.
        // -------------------------------------------------

        let status: string;

        if (!hasTelemetry) {
          status = "REGISTERED";
        } else if (!hasRecentTelemetry) {
          status = "OFFLINE";
        } else {
          // Device is currently communicating.
          //
          // Preserve WARNING / ERROR from the device model.
          // Otherwise consider it RUNNING.

          const deviceStatus =
            String(
              device.status || ""
            ).toUpperCase();

          if (
            deviceStatus ===
            "ERROR"
          ) {
            status = "ERROR";
          } else if (
            deviceStatus ===
            "WARNING"
          ) {
            status = "WARNING";
          } else {
            status = "RUNNING";
          }
        }

        // -------------------------------------------------
        // LAST SEEN
        //
        // Prefer actual telemetry time.
        // This prevents the dashboard from showing
        // OFFLINE while telemetry is actively arriving.
        // -------------------------------------------------

        const effectiveLastSeen =
          hasTelemetry
            ? telemetry.createdAt
            : device.lastSeen || null;

        return {
          // -----------------------------------------------
          // IDENTITY
          // -----------------------------------------------

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

          // -----------------------------------------------
          // STATUS
          // -----------------------------------------------

          status,

          // -----------------------------------------------
          // NETWORK
          // -----------------------------------------------

          ipAddress:
            device.ipAddress || "",

          location:
            device.location || "",

          type:
            device.type || "esp32",

          // -----------------------------------------------
          // TIMESTAMPS
          // -----------------------------------------------

          lastSeen:
            effectiveLastSeen,

          registeredAt:
            device.registeredAt ||
            null,

          // -----------------------------------------------
          // TELEMETRY
          // -----------------------------------------------

          telemetry,
        };
      }
    );

    // =====================================================
    // USER DEVICE STATISTICS
    // =====================================================

    const totalDevices =
      dashboardDevices.length;

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
    //
    // Only current user's devices.
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
      // USER ACTIVITY ONLY
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