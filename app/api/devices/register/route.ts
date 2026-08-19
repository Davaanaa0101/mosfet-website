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
    // BODY
    // =================================================

    const body =
      await request.json();

    const serialId =
      typeof body.serialId ===
      "string"
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