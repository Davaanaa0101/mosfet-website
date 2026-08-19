import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@/lib/auth";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";

// =====================================================
// DEFAULT CONFIGURATION
// =====================================================

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
      type: "DHT_TEMPERATURE",
      name: "AM2302 Temperature",
      unit: "°C",
    },
    {
      slot: 8,
      type: "DHT_HUMIDITY",
      name: "AM2302 Humidity",
      unit: "%",
    },
  ],
};

// =====================================================
// GET CONFIGURATION
// =====================================================

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    // =================================================
    // AUTHENTICATION
    // =================================================

    const session =
      await auth.api.getSession({
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

    // =================================================
    // DATABASE
    // =================================================

    await connectDB();

    const { id } =
      await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Device ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // FIND BY DEVICE ID
    // =================================================

    let device =
      await Device.findOne({
        deviceId: id,
      }).lean();

    // =================================================
    // ALSO SUPPORT MONGODB _ID
    // =================================================

    if (!device) {
      try {
        device =
          await Device.findById(
            id
          ).lean();
      } catch {
        // Invalid MongoDB ObjectId.
      }
    }

    // =================================================
    // DEVICE DOES NOT EXIST
    // =================================================

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

    // =================================================
    // SEND INTERVAL
    // =================================================

    const sendInterval =
      typeof device.sendInterval ===
        "number" &&
      device.sendInterval >=
        1000
        ? device.sendInterval
        : DEFAULT_CONFIG.sendInterval;

    // =================================================
    // SENSORS
    // =================================================

    const sensors =
      Array.isArray(
        device.sensors
      ) &&
      device.sensors.length > 0
        ? device.sensors.map(
            (sensor) => ({
              slot:
                sensor.slot,

              type:
                sensor.type ||
                "N/A",

              name:
                sensor.name ||
                `Sensor #${sensor.slot}`,

              unit:
                sensor.unit ||
                "",
            })
          )
        : DEFAULT_CONFIG.sensors;

    // =================================================
    // RESPONSE
    // =================================================

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
// PUT CONFIGURATION
// =====================================================

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    // =================================================
    // AUTHENTICATION
    // =================================================

    const session =
      await auth.api.getSession({
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

    // =================================================
    // DATABASE
    // =================================================

    await connectDB();

    const { id } =
      await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Device ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // READ BODY
    // =================================================

    const body =
      await request.json();

    const {
      deviceName,
      sendInterval,
      sensors,
    } = body;

    console.log(
      "[device-config] PUT request:",
      {
        id,
        deviceName,
        sendInterval,
        sensorCount:
          Array.isArray(sensors)
            ? sensors.length
            : 0,
      }
    );

    // =================================================
    // VALIDATE DEVICE NAME
    // =================================================

    if (
      typeof deviceName !==
        "string" ||
      !deviceName.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Device name is required",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedDeviceName =
      deviceName.trim();

    if (
      normalizedDeviceName.length >
      100
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Device name cannot exceed 100 characters",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // VALIDATE SEND INTERVAL
    // =================================================

    const normalizedInterval =
      Number(sendInterval);

    if (
      !Number.isFinite(
        normalizedInterval
      ) ||
      normalizedInterval <
        1000
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Send interval must be at least 1000 ms",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // VALIDATE SENSORS
    // =================================================

    if (
      !Array.isArray(sensors)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Sensors must be an array",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // NORMALIZE SENSORS
    // =================================================

    const normalizedSensors =
      sensors
        .filter(
          (sensor) =>
            sensor !== null &&
            typeof sensor ===
              "object"
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

    // =================================================
    // REQUIRE ALL 8 SLOTS
    // =================================================

    if (
      normalizedSensors.length !==
      8
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Exactly 8 sensor slots are required",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // CHECK DUPLICATE SLOTS
    // =================================================

    const slots =
      normalizedSensors.map(
        (sensor) =>
          sensor.slot
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

    // =================================================
    // FIND EXISTING DEVICE
    // =================================================

    let device =
      await Device.findOne({
        deviceId: id,
      }).lean();

    let query:
      | {
          deviceId: string;
        }
      | {
          _id: string;
        };

    if (device) {
      query = {
        deviceId:
          device.deviceId,
      };
    } else {
      // ===============================================
      // TRY MONGODB OBJECT ID
      // ===============================================

      try {
        const byMongoId =
          await Device.findById(
            id
          ).lean();

        if (!byMongoId) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Device not found",
            },
            {
              status: 404,
            }
          );
        }

        device =
          byMongoId;

        query = {
          _id: id,
        };
      } catch {
        return NextResponse.json(
          {
            success: false,
            error:
              "Device not found",
          },
          {
            status: 404,
          }
        );
      }
    }

    // =================================================
    // UPDATE DATABASE ATOMICALLY
    // =================================================

    const updatedDevice =
      await Device.findOneAndUpdate(
        query,

        {
          $set: {
            name:
              normalizedDeviceName,

            sendInterval:
              normalizedInterval,

            sensors:
              normalizedSensors,
          },
        },

        {
          new: true,

          runValidators: true,
        }
      ).lean();

    // =================================================
    // VERIFY UPDATE
    // =================================================

    if (!updatedDevice) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Failed to update device",
        },
        {
          status: 500,
        }
      );
    }

    // =================================================
    // LOG
    // =================================================

    console.log(
      "[device-config] DATABASE UPDATED:",
      {
        deviceId:
          updatedDevice.deviceId,

        name:
          updatedDevice.name,

        sendInterval:
          updatedDevice.sendInterval,

        sensors:
          updatedDevice.sensors,
      }
    );

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,

      message:
        "Device configuration updated",

      deviceId:
        updatedDevice.deviceId,

      deviceName:
        updatedDevice.name,

      sendInterval:
        updatedDevice.sendInterval,

      sensors:
        updatedDevice.sensors ??
        [],
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