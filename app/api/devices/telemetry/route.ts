import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      deviceId,
      name,
      type,
      location,
      macAddress,
      firmware,
      ipAddress,
      wifiSSID,
      temperature,
      humidity,
      voltage,
      current,
      power,
      rssi,
      freeHeap,
      uptime,
    } = body;

    if (!deviceId) {
      return NextResponse.json(
        { error: "deviceId is required" },
        { status: 400 }
      );
    }

    let device = await Device.findOne({
      deviceId,
    });

    if (!device) {
      device = await Device.create({
        deviceId,
        name: name || deviceId,
        type: type || "esp32",
        location: location || "",
        macAddress,
        firmware,
        ipAddress,
        status: "online",
        lastSeen: new Date(),
      });
    } else {
      device.status = "online";
      device.lastSeen = new Date();

      if (firmware) device.firmware = firmware;
      if (ipAddress) device.ipAddress = ipAddress;
      if (macAddress) device.macAddress = macAddress;

      await device.save();
    }

    await DeviceLog.create({
      deviceId,
      temperature,
      humidity,
      voltage,
      current,
      power,
      wifiSSID,
      ipAddress,
      rssi,
      freeHeap,
      uptime,
    });

    return NextResponse.json({
      success: true,
      message: "Telemetry received",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}