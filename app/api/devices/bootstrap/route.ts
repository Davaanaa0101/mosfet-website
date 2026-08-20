import {
  NextRequest,
  NextResponse,
} from "next/server";

import crypto from "crypto";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";

// =====================================================
// GENERATE TEMPORARY PROVISIONING KEY
// =====================================================

function generateProvisioningKey(): string {
  return (
    "mosfet_prov_" +
    crypto.randomBytes(32).toString("hex")
  );
}

// =====================================================
// REQUEST BODY
//
// {
//   "serialId": "MOSFET-ESP32-000002",
//   "deviceId": "esp32_2",
//   "name": "ESP32 Device",
//   "type": "esp32",
//   "macAddress": "...",
//   "firmware": "...",
//   "ipAddress": "..."
// }
// =====================================================

interface BootstrapBody {
  serialId?: unknown;
  deviceId?: unknown;
  name?: unknown;
  type?: unknown;
  macAddress?: unknown;
  firmware?: unknown;
  ipAddress?: unknown;
}

// =====================================================
// POST
//
// Called by a physical ESP32 when it needs to be
// provisioned.
//
// IMPORTANT:
// This endpoint creates an UNREGISTERED device.
//
// It does NOT assign a user.
//
// It does NOT create the permanent apiKey.
// =====================================================

export async function POST(
  request: NextRequest
) {
  try {
    // =================================================
    // DATABASE
    // =================================================

    await connectDB();

    // =================================================
    // READ BODY
    // =================================================

    let body: BootstrapBody;

    try {
      body =
        (await request.json()) as BootstrapBody;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON body",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // SERIAL ID
    // =================================================

    const serialId =
      typeof body.serialId === "string"
        ? body.serialId.trim()
        : "";

    if (!serialId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Serial ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // DEVICE ID
    // =================================================

    const deviceId =
      typeof body.deviceId === "string"
        ? body.deviceId.trim()
        : "";

    if (!deviceId) {
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
    // OPTIONAL DEVICE INFORMATION
    // =================================================

    const name =
      typeof body.name === "string" &&
      body.name.trim()
        ? body.name.trim()
        : "ESP32 Device";

    const type =
      body.type === "esp32" ||
      body.type === "plc" ||
      body.type === "modbus" ||
      body.type === "camera"
        ? body.type
        : "esp32";

    const macAddress =
      typeof body.macAddress ===
      "string"
        ? body.macAddress.trim()
        : "";

    const firmware =
      typeof body.firmware ===
      "string"
        ? body.firmware.trim()
        : "";

    const ipAddress =
      typeof body.ipAddress ===
      "string"
        ? body.ipAddress.trim()
        : "";

    // =================================================
    // FIND BY SERIAL ID
    // =================================================

    let device =
      await Device.findOne({
        serialId,
      });

    // =================================================
    // DEVICE ALREADY EXISTS
    // =================================================

    if (device) {
      // -----------------------------------------------
      // SECURITY CHECK
      //
      // Serial ID must belong to the same physical
      // deviceId.
      // -----------------------------------------------

      if (
        device.deviceId !==
        deviceId
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Serial ID is already assigned to another device.",
          },
          {
            status: 409,
          }
        );
      }

      // -----------------------------------------------
      // UPDATE DEVICE NETWORK INFORMATION
      // -----------------------------------------------

      if (macAddress) {
        device.macAddress =
          macAddress;
      }

      if (firmware) {
        device.firmware =
          firmware;
      }

      if (ipAddress) {
        device.ipAddress =
          ipAddress;
      }

      // -----------------------------------------------
      // IF DEVICE IS NOT REGISTERED
      // -----------------------------------------------

      if (
        !device.userId &&
        device.status ===
          "NOT_REGISTERED"
      ) {
        // Generate provisioning key
        // if one does not exist.

        if (
          !device.provisioningKey
        ) {
          device.provisioningKey =
            generateProvisioningKey();
        }

        await device.save();

        return NextResponse.json(
          {
            success: true,

            registered: false,

            message:
              "Device found and waiting for registration.",

            data: {
              serialId:
                device.serialId,

              deviceId:
                device.deviceId,

              name:
                device.name,

              type:
                device.type,

              provisioningKey:
                device.provisioningKey,

              sendInterval:
                device.sendInterval,

              sensors:
                device.sensors,
            },
          },
          {
            status: 200,
          }
        );
      }

      // -----------------------------------------------
      // DEVICE IS ALREADY REGISTERED
      // -----------------------------------------------

      if (device.userId) {
        await device.save();

        return NextResponse.json(
          {
            success: true,

            registered: true,

            message:
              "Device is already registered.",

            data: {
              serialId:
                device.serialId,

              deviceId:
                device.deviceId,

              name:
                device.name,

              type:
                device.type,

              apiKey:
                device.apiKey,

              sendInterval:
                device.sendInterval,

              sensors:
                device.sensors,
            },
          },
          {
            status: 200,
          }
        );
      }

      // -----------------------------------------------
      // FALLBACK
      // -----------------------------------------------

      await device.save();

      return NextResponse.json(
        {
          success: true,

          registered: false,

          data: {
            serialId:
              device.serialId,

            deviceId:
              device.deviceId,

            name:
              device.name,

            type:
              device.type,

            provisioningKey:
              device.provisioningKey,

            sendInterval:
              device.sendInterval,

            sensors:
              device.sensors,
          },
        },
        {
          status: 200,
        }
      );
    }

    // =================================================
    // CHECK DEVICE ID
    //
    // Prevent duplicate device IDs.
    // =================================================

    const existingDevice =
      await Device.findOne({
        deviceId,
      });

    if (existingDevice) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Device ID is already registered with another device.",
        },
        {
          status: 409,
        }
      );
    }

    // =================================================
    // GENERATE PROVISIONING KEY
    // =================================================

    const provisioningKey =
      generateProvisioningKey();

    // =================================================
    // CREATE DEVICE
    //
    // IMPORTANT:
    //
    // userId       = undefined
    // apiKey       = undefined
    // status       = NOT_REGISTERED
    //
    // This device now exists in MongoDB.
    // =================================================

    device =
      await Device.create({
        serialId,

        deviceId,

        name,

        type,

        location: "",

        macAddress,

        firmware,

        ipAddress,

        status:
          "NOT_REGISTERED",

        provisioningKey,

        // Permanent API key is NOT created yet.

        apiKey: undefined,

        // User is NOT assigned yet.

        userId: undefined,

        registeredAt:
          undefined,
      });

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json(
      {
        success: true,

        registered: false,

        message:
          "Device created and waiting for user registration.",

        data: {
          serialId:
            device.serialId,

          deviceId:
            device.deviceId,

          name:
            device.name,

          type:
            device.type,

          provisioningKey:
            device.provisioningKey,

          sendInterval:
            device.sendInterval,

          sensors:
            device.sensors,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "[device-bootstrap] POST error:",
      error
    );

    // =================================================
    // DUPLICATE KEY
    // =================================================

    if (
      error &&
      typeof error ===
        "object" &&
      "code" in error &&
      (error as {
        code?: number;
      }).code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Device already exists. Please try again.",
        },
        {
          status: 409,
        }
      );
    }

    // =================================================
    // GENERAL ERROR
    // =================================================

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Failed to bootstrap device",
      },
      {
        status: 500,
      }
    );
  }
}