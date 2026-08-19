import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";

export async function GET() {
  try {
    await connectDB();

    const devices = await Device.find()
      .sort({ lastSeen: -1 })
      .lean();

    const now = Date.now();

    const onlineDevices = devices.filter(
      (device) => {
        if (!device.lastSeen) {
          return false;
        }

        const lastSeen =
          new Date(
            device.lastSeen
          ).getTime();

        return (
          !Number.isNaN(lastSeen) &&
          now - lastSeen <= 30_000
        );
      }
    );

    const offlineDevices =
      devices.filter(
        (device) =>
          !onlineDevices.some(
            (online) =>
              String(online._id) ===
              String(device._id)
          )
      );

    // Get latest telemetry for each device
    const latestTelemetry =
      await Promise.all(
        devices.map(async (device) => {
          const telemetry =
            await DeviceLog.findOne({
              deviceId:
                device.deviceId,
            })
              .sort({
                createdAt: -1,
              })
              .lean();

          return {
            deviceId:
              device.deviceId,

            deviceName:
              device.name ||
              device.deviceId,

            status:
              onlineDevices.some(
                (online) =>
                  String(
                    online._id
                  ) ===
                  String(device._id)
              )
                ? "online"
                : "offline",

            ipAddress:
              device.ipAddress || "",

            lastSeen:
              device.lastSeen,

            telemetry,
          };
        })
      );

    // Latest activity
    const recentActivity =
      await DeviceLog.find()
        .sort({
          createdAt: -1,
        })
        .limit(10)
        .lean();

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

      devices: latestTelemetry,

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