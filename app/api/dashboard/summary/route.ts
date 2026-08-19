import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";

const ONLINE_THRESHOLD_MS = 30_000;

export async function GET() {
  try {
    await connectDB();

    // =====================================================
    // CURRENT TIME
    // =====================================================

    const now = Date.now();

    // =====================================================
    // LOAD DEVICES
    // =====================================================

    const devices = await Device.find()
      .sort({
        lastSeen: -1,
      })
      .lean();

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
            now - lastSeen <=
              ONLINE_THRESHOLD_MS
          );
        }
      );

    const onlineIds =
      new Set(
        onlineDevices.map(
          (device) =>
            String(device._id)
        )
      );

    const offlineDevices =
      devices.filter(
        (device) =>
          !onlineIds.has(
            String(device._id)
          )
      );

    // =====================================================
    // GET LATEST TELEMETRY FOR ALL DEVICES
    //
    // ONE DATABASE QUERY
    // =====================================================

    const latestTelemetry =
      devices.length > 0
        ? await DeviceLog.aggregate([
            // ---------------------------------------------
            // Sort newest first
            // ---------------------------------------------

            {
              $sort: {
                createdAt: -1,
              },
            },

            // ---------------------------------------------
            // First record for each device is newest
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
    // CREATE TELEMETRY MAP
    // =====================================================

    const telemetryMap =
      new Map<
        string,
        Record<string, unknown>
      >();

    for (
      const item of latestTelemetry
    ) {
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
    // BUILD DEVICE DATA
    // =====================================================

    const dashboardDevices =
      devices.map(
        (device) => {
          const telemetry =
            telemetryMap.get(
              device.deviceId
            ) || null;

          return {
            deviceId:
              device.deviceId,

            // IMPORTANT:
            // Configuration/database owns name.
            deviceName:
              device.name ||
              device.deviceId,

            status:
              onlineIds.has(
                String(
                  device._id
                )
              )
                ? "online"
                : "offline",

            ipAddress:
              device.ipAddress ||
              "",

            location:
              device.location ||
              "",

            type:
              device.type ||
              "esp32",

            lastSeen:
              device.lastSeen ||
              null,

            telemetry,
          };
        }
      );

    // =====================================================
    // RECENT ACTIVITY
    //
    // Only 10 records required.
    // =====================================================

    const rawActivity =
      await DeviceLog.find()
        .sort({
          createdAt: -1,
        })
        .limit(10)
        .lean();

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

      stats: {
        totalDevices:
          devices.length,

        onlineDevices:
          onlineDevices.length,

        offlineDevices:
          offlineDevices.length,
      },

      devices:
        dashboardDevices,

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