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

// =====================================================
// GET DEVICE CONFIGURATION
// =====================================================

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
    // FIND BY DEVICE ID
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
      typeof device.sendInterval === "number" &&
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
      "[device-config] GET error:",
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

// =====================================================
// PUT DEVICE CONFIGURATION
// =====================================================

export async function PUT(
  request: NextRequest,
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
    // READ REQUEST BODY
    // -----------------------------------------

    const body = await request.json();

    const {
      deviceName,
      sendInterval,
      sensors,
    } = body;

    // -----------------------------------------
    // VALIDATE DEVICE NAME
    // -----------------------------------------

    if (
      deviceName !== undefined &&
      typeof deviceName !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "deviceName must be a string",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // VALIDATE SEND INTERVAL
    // -----------------------------------------

    const normalizedInterval =
      Number(sendInterval);

    if (
      !Number.isFinite(
        normalizedInterval
      ) ||
      normalizedInterval < 1000
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "sendInterval must be at least 1000 ms",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // VALIDATE SENSOR ARRAY
    // -----------------------------------------

    if (!Array.isArray(sensors)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "sensors must be an array",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // NORMALIZE SENSORS
    // -----------------------------------------

    const normalizedSensors =
      sensors
        .filter(
          (sensor) =>
            sensor !== null &&
            typeof sensor === "object"
        )
        .map((sensor) => ({
          slot: Number(
            sensor.slot
          ),

          type:
            typeof sensor.type ===
            "string"
              ? sensor.type.trim()
              : "N/A",

          name:
            typeof sensor.name ===
            "string"
              ? sensor.name.trim()
              : "",

          unit:
            typeof sensor.unit ===
            "string"
              ? sensor.unit.trim()
              : "",
        }))
        .filter(
          (sensor) =>
            Number.isInteger(
              sensor.slot
            ) &&
            sensor.slot >= 1 &&
            sensor.slot <= 8
        );

    // -----------------------------------------
    // CHECK DUPLICATE SLOTS
    // -----------------------------------------

    const slots =
      normalizedSensors.map(
        (sensor) => sensor.slot
      );

    const uniqueSlots =
      new Set(slots);

    if (
      uniqueSlots.size !==
      slots.length
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Sensor slots must be unique",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // FIND DEVICE BY DEVICE ID
    // -----------------------------------------

    let device =
      await Device.findOne({
        deviceId: id,
      });

    // -----------------------------------------
    // ALSO SUPPORT MONGODB _id
    // -----------------------------------------

    if (!device) {
      try {
        device =
          await Device.findById(id);
      } catch {
        // Not a valid MongoDB ObjectId.
      }
    }

    // -----------------------------------------
    // DEVICE NOT FOUND
    // -----------------------------------------

    if (!device) {
      return NextResponse.json(
        {
          success: false,
          error: "Device not found",
        },
        {
          status: 404,
        }
      );
    }

    // -----------------------------------------
    // UPDATE DEVICE NAME
    // -----------------------------------------

    if (
      typeof deviceName ===
        "string" &&
      deviceName.trim()
    ) {
      device.name =
        deviceName.trim();
    }

    // -----------------------------------------
    // UPDATE SEND INTERVAL
    // -----------------------------------------

    device.sendInterval =
      normalizedInterval;

    // -----------------------------------------
    // UPDATE SENSOR CONFIGURATION
    // -----------------------------------------

    device.sensors =
      normalizedSensors;

    // -----------------------------------------
    // SAVE
    // -----------------------------------------

    await device.save();

    console.log(
      `[device-config] Updated configuration for ${device.deviceId}`
    );

    // -----------------------------------------
    // RESPONSE
    // -----------------------------------------

    return NextResponse.json({
      success: true,

      message:
        "Device configuration updated",

      deviceId:
        device.deviceId,

      deviceName:
        device.name,

      sendInterval:
        device.sendInterval,

      sensors:
        device.sensors,
    });
  } catch (error) {
    console.error(
      "[device-config] PUT error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to update device configuration",
      },
      {
        status: 500,
      }
    );
  }
}