import {
  NextRequest,
  NextResponse,
} from "next/server";

import crypto from "crypto";

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
// HELPERS
// =====================================================

function getBearerToken(
  request: NextRequest
): string | null {
  const authorization =
    request.headers.get(
      "authorization"
    );

  if (!authorization) {
    return null;
  }

  const [scheme, token] =
    authorization.split(" ");

  if (
    scheme?.toLowerCase() !==
      "bearer" ||
    !token
  ) {
    return null;
  }

  return token.trim() || null;
}

// =====================================================
// SAFE API KEY COMPARISON
// =====================================================

function safeCompare(
  a: string,
  b: string
): boolean {
  if (!a || !b) {
    return false;
  }

  const aBuffer =
    Buffer.from(a);

  const bBuffer =
    Buffer.from(b);

  if (
    aBuffer.length !==
    bBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    aBuffer,
    bBuffer
  );
}

// =====================================================
// FIND DEVICE
//
// Supports:
//
// /api/devices/esp32_1/config
//
// and:
//
// /api/devices/<mongodb-object-id>/config
// =====================================================

async function findDevice(
  id: string
) {
  let device =
    await Device.findOne({
      deviceId: id,
    });

  if (device) {
    return device;
  }

  try {
    device =
      await Device.findById(id);
  } catch {
    // Invalid MongoDB ObjectId.
  }

  return device;
}

// =====================================================
// GET CONFIGURATION
//
// ESP32:
//
// Authorization:
// Bearer DEVICE_API_KEY
//
// Dashboard:
//
// Better Auth session cookie
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
    // DATABASE
    // =================================================

    await connectDB();

    // =================================================
    // PARAMETER
    // =================================================

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
    // FIND DEVICE
    // =================================================

    const device =
      await findDevice(id);

    if (!device) {
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

    // =================================================
    // CHECK FOR DEVICE API KEY
    // =================================================

    const bearerToken =
      getBearerToken(request);

    // =================================================
    // ESP32 AUTHENTICATION
    // =================================================

    if (bearerToken) {
      if (
        !device.apiKey ||
        !safeCompare(
          bearerToken,
          device.apiKey
        )
      ) {
        console.warn(
          "[device-config] Invalid device API key:",
          {
            deviceId:
              device.deviceId,

            serialId:
              device.serialId,
          }
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Unauthorized",
          },
          {
            status: 401,
          }
        );
      }

      console.log(
        "[device-config] ESP32 authenticated:",
        device.deviceId
      );
    }

    // =================================================
    // DASHBOARD AUTHENTICATION
    // =================================================

    else {
      const session =
        await auth.api.getSession({
          headers:
            request.headers,
        });

      if (!session?.user) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Unauthorized",
          },
          {
            status: 401,
          }
        );
      }

      // =================================================
      // OWNERSHIP CHECK
      // =================================================

      if (
        !device.userId ||
        device.userId !==
          session.user.id
      ) {
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

      console.log(
        "[device-config] Dashboard authenticated:",
        {
          deviceId:
            device.deviceId,

          userId:
            session.user.id,
        }
      );
    }

    // =================================================
    // DEVICE MUST BE REGISTERED
    // =================================================

    if (
      !device.userId ||
      !device.apiKey
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Device is not registered",
        },
        {
          status: 403,
        }
      );
    }

    // =================================================
    // SEND INTERVAL
    // =================================================

    const sendInterval =
      typeof device.sendInterval ===
        "number" &&
      device.sendInterval >= 1000
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
        ? device.sensors
            .map(
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
            .sort(
              (a, b) =>
                a.slot -
                b.slot
            )
        : DEFAULT_CONFIG.sensors;

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,

      deviceId:
        device.deviceId,

      serialId:
        device.serialId,

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
//
// Dashboard only.
//
// Requires Better Auth session.
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
    // USER AUTHENTICATION
    // =================================================

    const session =
      await auth.api.getSession({
        headers:
          request.headers,
      });

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized",
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

    // =================================================
    // PARAMETER
    // =================================================

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
    // FIND DEVICE
    // =================================================

    const device =
      await findDevice(id);

    if (!device) {
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

    // =================================================
    // OWNERSHIP CHECK
    // =================================================

    if (
      !device.userId ||
      device.userId !==
        session.user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You do not have access to this device",
        },
        {
          status: 403,
        }
      );
    }

    // =================================================
    // READ BODY
    // =================================================

    let body: Record<
      string,
      unknown
    >;

    try {
      body =
        await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid JSON body",
        },
        {
          status: 400,
        }
      );
    }

    const deviceName =
      body.deviceName;

    const sendInterval =
      body.sendInterval;

    const sensors =
      body.sensors;

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
      normalizedInterval < 1000
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
        .map(
          (sensor) => {
            const item =
              sensor as Record<
                string,
                unknown
              >;

            return {
              slot: Number(
                item.slot
              ),

              type:
                typeof item.type ===
                "string"
                  ? item.type.trim()
                  : "N/A",

              name:
                typeof item.name ===
                "string"
                  ? item.name.trim()
                  : "",

              unit:
                typeof item.unit ===
                "string"
                  ? item.unit.trim()
                  : "",
            };
          }
        )
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
    // SORT SENSORS
    // =================================================

    normalizedSensors.sort(
      (a, b) =>
        a.slot -
        b.slot
    );

    // =================================================
    // UPDATE
    // =================================================

    const updatedDevice =
      await Device.findOneAndUpdate(
        {
          _id:
            device._id,

          userId:
            session.user.id,
        },
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
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,

      message:
        "Device configuration updated",

      deviceId:
        updatedDevice.deviceId,

      serialId:
        updatedDevice.serialId,

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