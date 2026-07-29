import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";

export async function GET() {
  try {
    await connectDB();

    const totalDevices = await Device.countDocuments();

    const onlineDevices = await Device.countDocuments({
      status: "online",
    });

    const offlineDevices = totalDevices - onlineDevices;

    const stats = await DeviceLog.aggregate([
        {
            $sort: {
            createdAt: -1,
            },
        },
        {
            $group: {
            _id: "$deviceId",
            temperature: {
                $first: "$temperature",
            },
            humidity: {
                $first: "$humidity",
            },
            },
        },
        {
            $group: {
            _id: null,
            avgTemperature: {
                $avg: "$temperature",
            },
            avgHumidity: {
                $avg: "$humidity",
            },
            },
        },
    ]);

    const latestDevices = await Device.find()
      .sort({ updatedAt: -1 })
      .limit(5);

    return NextResponse.json({
      totalDevices,
      onlineDevices,
      offlineDevices,
      alerts: 0,
      avgTemperature: stats[0]?.avgTemperature ?? 0,
      avgHumidity: stats[0]?.avgHumidity ?? 0,
      latestDevices,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to load dashboard",
      },
      {
        status: 500,
      }
    );
  }
}