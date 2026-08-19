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
      energy,

      rssi,
      freeHeap,
      uptime,
    } = body;

    // -----------------------------------------
    // VALIDATE DEVICE ID
    // -----------------------------------------

    if (
      !deviceId ||
      typeof deviceId !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "deviceId is required",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // FIND DEVICE
    // -----------------------------------------

    let device = await Device.findOne({
      deviceId,
    });

    // -----------------------------------------
    // CREATE DEVICE
    // -----------------------------------------

    if (!device) {
      device = await Device.create({
        deviceId,

        name:
          typeof name === "string" && name.trim()
            ? name.trim()
            : deviceId,

        type:
          typeof type === "string" && type.trim()
            ? type.trim()
            : "esp32",

        location:
          typeof location === "string"
            ? location
            : "",

        macAddress:
          typeof macAddress === "string"
            ? macAddress
            : "",

        firmware:
          typeof firmware === "string"
            ? firmware
            : "",

        ipAddress:
          typeof ipAddress === "string"
            ? ipAddress
            : "",

        status: "online",

        lastSeen: new Date(),
      });

      console.log(
        `[telemetry] Registered new device: ${deviceId}`
      );
    }

    // -----------------------------------------
    // UPDATE EXISTING DEVICE
    // -----------------------------------------

    else {
      device.status = "online";
      device.lastSeen = new Date();

      if (name) {
        device.name = name;
      }

      if (type) {
        device.type = type;
      }

      if (location) {
        device.location = location;
      }

      if (macAddress) {
        device.macAddress = macAddress;
      }

      if (firmware) {
        device.firmware = firmware;
      }

      if (ipAddress) {
        device.ipAddress = ipAddress;
      }

      await device.save();
    }

    // -----------------------------------------
    // SAVE TELEMETRY
    // -----------------------------------------

    await DeviceLog.create({
      deviceId,

      temperature:
        typeof temperature === "number"
          ? temperature
          : undefined,

      humidity:
        typeof humidity === "number"
          ? humidity
          : undefined,

      voltage:
        typeof voltage === "number"
          ? voltage
          : undefined,

      current:
        typeof current === "number"
          ? current
          : undefined,

      power:
        typeof power === "number"
          ? power
          : undefined,

      energy:
        typeof energy === "number"
          ? energy
          : undefined,

      wifiSSID:
        typeof wifiSSID === "string"
          ? wifiSSID
          : undefined,

      ipAddress:
        typeof ipAddress === "string"
          ? ipAddress
          : undefined,

      rssi:
        typeof rssi === "number"
          ? rssi
          : undefined,

      freeHeap:
        typeof freeHeap === "number"
          ? freeHeap
          : undefined,

      uptime:
        typeof uptime === "number"
          ? uptime
          : undefined,
    });

    // -----------------------------------------
    // RESPONSE
    // -----------------------------------------

    return NextResponse.json({
      success: true,
      message: "Telemetry received",
      deviceId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "[telemetry] Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}