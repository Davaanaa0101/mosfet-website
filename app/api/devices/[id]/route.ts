import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@/lib/auth";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";

// =====================================================
// GET DEVICE
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
    // FIND BY DEVICE ID
    // =================================================

    let device =
      await Device.findOne({
        deviceId: id,
      }).lean();

    // =================================================
    // FIND BY MONGODB _ID
    // =================================================

    if (!device) {
      try {
        device =
          await Device.findById(
            id
          ).lean();
      } catch {
        // Invalid MongoDB ObjectId.
        // Continue to not-found response.
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
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,

      device: {
        ...device,

        _id: String(
          device._id
        ),
      },
    });
  } catch (error) {
    console.error(
      "[device] GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load device",
      },
      {
        status: 500,
      }
    );
  }
}