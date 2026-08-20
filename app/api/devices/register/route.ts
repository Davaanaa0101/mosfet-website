import {
  NextRequest,
  NextResponse,
} from "next/server";

import crypto from "crypto";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";

// =====================================================
// GENERATE PERMANENT DEVICE API KEY
// =====================================================

function generateApiKey(): string {
  return crypto
    .randomBytes(32)
    .toString("hex");
}

// =====================================================
// POST
//
// Register a bootstrapped physical device to the
// currently authenticated user.
//
// Request:
//
// {
//   "serialId": "MOSFET-ESP32-000002"
// }
//
// IMPORTANT:
//
// The device must already exist in MongoDB through:
//
// POST /api/devices/bootstrap
//
// The device must have:
// - serialId
// - deviceId
// - provisioningKey
// - status = NOT_REGISTERED
// - no userId
// - no permanent apiKey
// =====================================================

export async function POST(
  request: NextRequest
) {
  try {
    // =================================================
    // AUTHENTICATED USER
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
    // READ BODY
    // =================================================

    let body: unknown;

    try {
      body = await request.json();
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
      typeof body === "object" &&
      body !== null &&
      "serialId" in body &&
      typeof (
        body as {
          serialId?: unknown;
        }
      ).serialId === "string"
        ? (
            body as {
              serialId: string;
            }
          ).serialId.trim()
        : "";

    // =================================================
    // VALIDATE SERIAL ID
    // =================================================

    if (!serialId) {
      return NextResponse.json(
        {
          success: false,
          error: "Serial ID is required",
        },
        {
          status: 400,
        }
      );
    }

    if (serialId.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Serial ID is too long",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // DATABASE
    // =================================================

    await connectDB();

    // =================================================
    // FIND BOOTSTRAPPED DEVICE
    // =================================================

    const device =
      await Device.findOne({
        serialId,
      });

    // =================================================
    // DEVICE DOES NOT EXIST
    // =================================================

    if (!device) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Device has not been activated yet. Please power on the ESP32 and connect it to the MOSFET server first.",
        },
        {
          status: 404,
        }
      );
    }

    // =================================================
    // DEVICE ALREADY BELONGS TO A USER
    // =================================================

    if (device.userId) {
      // -----------------------------------------------
      // SAME USER
      // -----------------------------------------------

      if (
        device.userId ===
        session.user.id
      ) {
        return NextResponse.json(
          {
            success: true,

            alreadyRegistered: true,

            message:
              "Device is already registered to your account.",

            data: {
              id: String(
                device._id
              ),

              serialId:
                device.serialId,

              deviceId:
                device.deviceId,

              name:
                device.name,

              type:
                device.type,

              location:
                device.location,

              status:
                device.status,

              registeredAt:
                device.registeredAt,
            },
          },
          {
            status: 200,
          }
        );
      }

      // -----------------------------------------------
      // DIFFERENT USER
      // -----------------------------------------------

      return NextResponse.json(
        {
          success: false,

          error:
            "This device is already registered to another user.",
        },
        {
          status: 409,
        }
      );
    }

    // =================================================
    // DEVICE MUST HAVE PROVISIONING KEY
    // =================================================

    if (!device.provisioningKey) {
      return NextResponse.json(
        {
          success: false,

          error:
            "This device has not completed provisioning. Please restart the ESP32 and try again.",
        },
        {
          status: 409,
        }
      );
    }

    // =================================================
    // DEVICE MUST BE UNREGISTERED
    // =================================================

    if (
      device.status !==
      "NOT_REGISTERED"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "This device is not available for registration.",
        },
        {
          status: 409,
        }
      );
    }

    // =================================================
    // GENERATE PERMANENT API KEY
    // =================================================

    const apiKey =
      generateApiKey();

    // =================================================
    // ASSIGN DEVICE TO USER
    // =================================================

    device.userId =
      session.user.id;

    device.registeredAt =
      new Date();

    // Permanent credential
    device.apiKey =
      apiKey;

    // Device is now registered
    device.status =
      "REGISTERED";

    // =================================================
    // IMPORTANT
    //
    // DO NOT REMOVE provisioningKey YET.
    //
    // ESP32 still needs it to authenticate against
    // /api/devices/<deviceId>/config and receive the
    // permanent API key.
    //
    // It will be removed after provisioning completes.
    // =================================================

    await device.save();

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json(
      {
        success: true,

        registered: true,

        provisioningPending: true,

        message:
          "Device registered successfully. Waiting for the ESP32 to receive its permanent API key.",

        data: {
          id: String(
            device._id
          ),

          serialId:
            device.serialId,

          deviceId:
            device.deviceId,

          name:
            device.name,

          type:
            device.type,

          location:
            device.location,

          status:
            device.status,

          registeredAt:
            device.registeredAt,

          // =========================================
          // IMPORTANT
          //
          // This API key is returned to the logged-in
          // user only once.
          //
          // The ESP32 receives the same key separately
          // through the provisioning flow.
          // =========================================

          apiKey,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    // =================================================
    // ERROR LOG
    // =================================================

    console.error(
      "[device-register] POST error:",
      error
    );

    // =================================================
    // DUPLICATE KEY
    // =================================================

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (
        error as {
          code?: number;
        }
      ).code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Device registration conflict. The device may already be registered.",
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
            : "Failed to register device",
      },
      {
        status: 500,
      }
    );
  }
}