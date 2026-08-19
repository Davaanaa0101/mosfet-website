import {
  NextRequest,
  NextResponse,
} from "next/server";

import crypto from "crypto";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";

// =====================================================
// GENERATE DEVICE API KEY
// =====================================================

function generateApiKey(): string {
  return crypto
    .randomBytes(32)
    .toString("hex");
}

// =====================================================
// POST
//
// Register a physical device to the logged-in user.
//
// Request:
//
// {
//   "serialId": "MOSFET-ESP32-000001"
// }
//
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
    // READ BODY
    // =================================================

    let body: unknown;

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

    // =================================================
    // SERIAL ID
    // =================================================

    const serialId =
      typeof body ===
        "object" &&
      body !== null &&
      "serialId" in body &&
      typeof (
        body as {
          serialId?: unknown;
        }
      ).serialId ===
        "string"
        ? (
            body as {
              serialId: string;
            }
          ).serialId.trim()
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
    // SERIAL ID VALIDATION
    // =================================================

    if (
      serialId.length >
      100
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Serial ID is too long",
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
    // FIND DEVICE
    // =================================================

    const device =
      await Device.findOne({
        serialId,
      });

    if (!device) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Device not found. Please check the Serial ID.",
        },
        {
          status: 404,
        }
      );
    }

    // =================================================
    // ALREADY REGISTERED
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

            message:
              "Device is already registered to your account.",

            data: {
              id:
                String(
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

              // IMPORTANT:
              // Do NOT return the API key again.
              //
              // The user already received it when
              // the device was first registered.
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
    // GENERATE API KEY
    // =================================================

    const apiKey =
      generateApiKey();

    // =================================================
    // REGISTER DEVICE
    // =================================================

    device.userId =
      session.user.id;

    device.registeredAt =
      new Date();

    device.apiKey =
      apiKey;

    device.status =
      "REGISTERED";

    await device.save();

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json(
      {
        success: true,

        message:
          "Device registered successfully.",

        data: {
          id:
            String(
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
          // This is the ONLY response where we return
          // the generated API key.
          //
          // Save it to the ESP32.
          // =========================================

          apiKey,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "[device-register] POST error:",
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
      }).code ===
        11000
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