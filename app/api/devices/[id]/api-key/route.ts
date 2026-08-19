import {
  NextRequest,
  NextResponse,
} from "next/server";

import crypto from "crypto";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";

// =====================================================
// GENERATE API KEY
// =====================================================

function generateApiKey(): string {
  return crypto
    .randomBytes(32)
    .toString("hex");
}

// =====================================================
// POST
//
// Generates or regenerates a device API key.
//
// IMPORTANT:
// The API key is returned ONLY from this endpoint.
// It is never returned from the normal device APIs.
// =====================================================

export async function POST(
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
    // FIND DEVICE
    //
    // Support both:
    // /api/devices/ESP32_001/api-key
    //
    // and:
    // /api/devices/MONGODB_OBJECT_ID/api-key
    // =================================================

    let device =
      await Device.findOne({
        deviceId: id,
      });

    if (!device) {
      try {
        device =
          await Device.findById(
            id
          );
      } catch {
        // Invalid MongoDB ObjectId.
      }
    }

    // =================================================
    // NOT FOUND
    // =================================================

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
    // GENERATE KEY
    // =================================================

    const apiKey =
      generateApiKey();

    // =================================================
    // SAVE KEY
    // =================================================

    device.apiKey =
      apiKey;

    await device.save();

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,

      message:
        "Device API key generated successfully",

      data: {
        deviceId:
          device.deviceId,

        deviceName:
          device.name,

        apiKey,
      },
    });
  } catch (error) {
    console.error(
      "[device-api-key] POST error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to generate device API key",
      },
      {
        status: 500,
      }
    );
  }
}