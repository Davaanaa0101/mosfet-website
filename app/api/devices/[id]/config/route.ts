import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";

const DEFAULT_CONFIG = {
  sendInterval: 10000,

  sensors: [
    {
      slot: 1,
      type: "TEMPERATURE",
      name: "DS18B20 #1",
      unit: "°C",
    },
    {
      slot: 2,
      type: "TEMPERATURE",
      name: "DS18B20 #2",
      unit: "°C",
    },
    {
      slot: 3,
      type: "TEMPERATURE",
      name: "DS18B20 #3",
      unit: "°C",
    },
    {
      slot: 4,
      type: "TEMPERATURE",
      name: "DS18B20 #4",
      unit: "°C",
    },
    {
      slot: 5,
      type: "TEMPERATURE",
      name: "DS18B20 #5",
      unit: "°C",
    },
    {
      slot: 6,
      type: "TEMPERATURE",
      name: "DS18B20 #6",
      unit: "°C",
    },
    {
      slot: 7,
      type: "DHT_HUMIDITY",
      name: "AM2302 Humidity",
      unit: "%",
    },
    {
      slot: 8,
      type: "N/A",
      name: "Unused",
      unit: "",
    },
  ],
};

export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Device ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // FIND DEVICE BY DEVICE ID
    // -----------------------------------------

    let device = await Device.findOne({
      deviceId: id,
    }).lean();

    // -----------------------------------------
    // ALSO SUPPORT MONGODB _id
    // -----------------------------------------

    if (!device) {
      try {
        device = await Device.findById(id).lean();
      } catch {
        // Not a valid MongoDB ObjectId.
      }
    }

    // -----------------------------------------
    // DEVICE DOES NOT EXIST
    // -----------------------------------------

    if (!device) {
      return NextResponse.json({
        success: true,

        deviceId: id,

        deviceName: id,

        sendInterval:
          DEFAULT_CONFIG.sendInterval,

        sensors:
          DEFAULT_CONFIG.sensors,
      });
    }

    // -----------------------------------------
    // DATABASE CONFIG
    // -----------------------------------------

    const sendInterval =
      typeof device.sendInterval ===
        "number" &&
      device.sendInterval >= 1000
        ? device.sendInterval
        : DEFAULT_CONFIG.sendInterval;

    const sensors =
      Array.isArray(device.sensors) &&
      device.sensors.length > 0
        ? device.sensors.map(
            (sensor) => ({
              slot: sensor.slot,

              type: sensor.type,

              name:
                sensor.name ||
                `Sensor #${sensor.slot}`,

              unit:
                sensor.unit || "",
            })
          )
        : DEFAULT_CONFIG.sensors;

    // -----------------------------------------
    // RESPONSE
    // -----------------------------------------

    return NextResponse.json({
      success: true,

      deviceId:
        device.deviceId,

      deviceName:
        device.name ||
        device.deviceId,

      sendInterval,

      sensors,
    });
  } catch (error) {
    console.error(
      "[device-config] Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load device configuration",
      },
      {
        status: 500,
      }
    );
  }
}