import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";

// =====================================================
// DEVICE TYPES
// =====================================================

const DEVICE_TYPES = [
  "esp32",
  "plc",
  "modbus",
  "camera",
] as const;

type DeviceType =
  (typeof DEVICE_TYPES)[number];

// =====================================================
// SENSOR TYPE
// =====================================================

interface IncomingSensor {
  slot: number;
  type: string;
  value: number | null;
}

// =====================================================
// NORMALIZE DEVICE TYPE
// =====================================================

function normalizeDeviceType(
  value: unknown
): DeviceType {
  if (
    typeof value === "string" &&
    DEVICE_TYPES.includes(
      value.trim().toLowerCase() as DeviceType
    )
  ) {
    return value
      .trim()
      .toLowerCase() as DeviceType;
  }

  return "esp32";
}

// =====================================================
// NORMALIZE SENSORS
// =====================================================

function normalizeSensors(
  value: unknown
): IncomingSensor[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((sensor) => {
      if (
        sensor === null ||
        typeof sensor !== "object"
      ) {
        return false;
      }

      const item =
        sensor as Record<string, unknown>;

      return (
        typeof item.slot === "number" &&
        typeof item.type === "string"
      );
    })
    .map((sensor) => {
      const item =
        sensor as Record<string, unknown>;

      return {
        slot: Number(item.slot),

        type:
          typeof item.type === "string"
            ? item.type.trim()
            : "N/A",

        value:
          typeof item.value === "number"
            ? item.value
            : null,
      };
    })
    .filter(
      (sensor) =>
        Number.isInteger(sensor.slot) &&
        sensor.slot >= 1 &&
        sensor.slot <= 8
    );
}

// =====================================================
// POST TELEMETRY
// =====================================================

export async function POST(
  req: NextRequest
) {
  try {
    // -----------------------------------------
    // CONNECT DATABASE
    // -----------------------------------------

    await connectDB();

    // -----------------------------------------
    // READ REQUEST
    // -----------------------------------------

    const body =
      await req.json();

    const {
      deviceId,

      // Device information sent by ESP32.
      // IMPORTANT:
      // "name" is NOT used to update an
      // existing configured device name.
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

      sensors,
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
          error:
            "deviceId is required",
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
          error:
            "deviceId cannot be empty",
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
    // NORMALIZE SENSOR DATA
    // -----------------------------------------

    const normalizedSensors =
      normalizeSensors(sensors);

    // -----------------------------------------
    // FIND DEVICE
    // -----------------------------------------

    let device =
      await Device.findOne({
        deviceId:
          normalizedDeviceId,
      });

    // =================================================
    // CREATE NEW DEVICE
    // =================================================

    if (!device) {
      device =
        await Device.create({
          deviceId:
            normalizedDeviceId,

          // Only use ESP32 name when the
          // device is being registered
          // for the first time.
          name:
            typeof name === "string" &&
            name.trim()
              ? name.trim()
              : normalizedDeviceId,

          type:
            normalizedType,

          location:
            typeof location === "string"
              ? location.trim()
              : "",

          macAddress:
            typeof macAddress ===
            "string"
              ? macAddress.trim()
              : "",

          firmware:
            typeof firmware ===
            "string"
              ? firmware.trim()
              : "",

          ipAddress:
            typeof ipAddress ===
            "string"
              ? ipAddress.trim()
              : "",

          status:
            "online",

          lastSeen:
            new Date(),
        });

      console.log(
        `[telemetry] Registered new device: ${normalizedDeviceId}`
      );
    }

    // =================================================
    // UPDATE EXISTING DEVICE
    // =================================================

    else {
      // -----------------------------------------
      // ONLINE STATUS
      // -----------------------------------------

      device.status =
        "online";

      // -----------------------------------------
      // LAST SEEN
      // -----------------------------------------

      device.lastSeen =
        new Date();

      // -----------------------------------------
      // IMPORTANT:
      //
      // DO NOT UPDATE device.name HERE.
      //
      // The website configuration owns
      // the device name.
      //
      // ESP32 may continue sending:
      //
      // name: "ESP32 Device"
      //
      // but that value must NOT overwrite:
      //
      // name: "Monitoring Device Test 1"
      // -----------------------------------------

      // NO:
      //
      // device.name = name.trim();
      //
      // -----------------------------------------

      // -----------------------------------------
      // UPDATE DEVICE TYPE
      // -----------------------------------------

      device.type =
        normalizedType;

      // -----------------------------------------
      // UPDATE LOCATION
      // -----------------------------------------

      if (
        typeof location ===
          "string" &&
        location.trim()
      ) {
        device.location =
          location.trim();
      }

      // -----------------------------------------
      // UPDATE MAC ADDRESS
      // -----------------------------------------

      if (
        typeof macAddress ===
          "string" &&
        macAddress.trim()
      ) {
        device.macAddress =
          macAddress.trim();
      }

      // -----------------------------------------
      // UPDATE FIRMWARE
      // -----------------------------------------

      if (
        typeof firmware ===
          "string" &&
        firmware.trim()
      ) {
        device.firmware =
          firmware.trim();
      }

      // -----------------------------------------
      // UPDATE IP ADDRESS
      // -----------------------------------------

      if (
        typeof ipAddress ===
          "string" &&
        ipAddress.trim()
      ) {
        device.ipAddress =
          ipAddress.trim();
      }

      // -----------------------------------------
      // SAVE DEVICE
      // -----------------------------------------

      await device.save();
    }

    // =================================================
    // SAVE TELEMETRY
    // =================================================

    await DeviceLog.create({
      deviceId:
        normalizedDeviceId,

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

      sensors:
        normalizedSensors,
    });

    // =================================================
    // LOG
    // =================================================

    console.log(
      `[telemetry] ${normalizedDeviceId}`
    );

    console.log(
      `  configured name: ${device.name}`
    );

    console.log(
      `  sensors: ${normalizedSensors.length}`
    );

    console.log(
      `  IP: ${device.ipAddress || "-"}`
    );

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,

      message:
        "Telemetry received",

      deviceId:
        normalizedDeviceId,

      deviceName:
        device.name,

      sensorCount:
        normalizedSensors.length,

      timestamp:
        new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "[telemetry] Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}