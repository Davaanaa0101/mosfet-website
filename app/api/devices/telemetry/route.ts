import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";

const DEVICE_TYPES = [
  "esp32",
  "plc",
  "modbus",
  "camera",
] as const;

type DeviceType = (typeof DEVICE_TYPES)[number];

function normalizeDeviceType(
  value: unknown
): DeviceType {
  if (
    typeof value === "string" &&
    DEVICE_TYPES.includes(
      value.trim().toLowerCase() as DeviceType
    )
  ) {
    return value.trim().toLowerCase() as DeviceType;
  }

  return "esp32";
}

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
        {
          status: 400,
        }
      );
    }

    const normalizedDeviceId =
      deviceId.trim();

    if (!normalizedDeviceId) {
      return NextResponse.json(
        {
          success: false,
          error: "deviceId cannot be empty",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // NORMALIZE DEVICE TYPE
    // -----------------------------------------

    const normalizedType =
      normalizeDeviceType(type);

    // -----------------------------------------
    // FIND DEVICE
    // -----------------------------------------

    let device = await Device.findOne({
      deviceId: normalizedDeviceId,
    });

    // -----------------------------------------
    // CREATE DEVICE
    // -----------------------------------------

    if (!device) {
      device = await Device.create({
        deviceId: normalizedDeviceId,

        name:
          typeof name === "string" &&
          name.trim()
            ? name.trim()
            : normalizedDeviceId,

        type: normalizedType,

        location:
          typeof location === "string"
            ? location.trim()
            : "",

        macAddress:
          typeof macAddress === "string"
            ? macAddress.trim()
            : "",

        firmware:
          typeof firmware === "string"
            ? firmware.trim()
            : "",

        ipAddress:
          typeof ipAddress === "string"
            ? ipAddress.trim()
            : "",

        status: "online",

        lastSeen: new Date(),
      });

      console.log(
        `[telemetry] Registered new device: ${normalizedDeviceId}`
      );
    }

    // -----------------------------------------
    // UPDATE EXISTING DEVICE
    // -----------------------------------------

    else {
      device.status = "online";
      device.lastSeen = new Date();

      if (
        typeof name === "string" &&
        name.trim()
      ) {
        device.name =
          name.trim();
      }

      device.type =
        normalizedType;

      if (
        typeof location === "string" &&
        location.trim()
      ) {
        device.location =
          location.trim();
      }

      if (
        typeof macAddress === "string" &&
        macAddress.trim()
      ) {
        device.macAddress =
          macAddress.trim();
      }

      if (
        typeof firmware === "string" &&
        firmware.trim()
      ) {
        device.firmware =
          firmware.trim();
      }

      if (
        typeof ipAddress === "string" &&
        ipAddress.trim()
      ) {
        device.ipAddress =
          ipAddress.trim();
      }

      await device.save();
    }

    // -----------------------------------------
    // SAVE TELEMETRY
    // -----------------------------------------

    await DeviceLog.create({
      deviceId: normalizedDeviceId,

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
      deviceId: normalizedDeviceId,
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
      {
        status: 500,
      }
    );
  }
}