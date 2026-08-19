import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";

// =====================================================
// GET DEVICE
//
// Browser/dashboard authentication:
//
// Better Auth session
//        ↓
// session.user.id
//        ↓
// device.userId
//
// Only the owner can access the device.
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
        headers:
          request.headers,
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
    // FIND DEVICE
    //
    // First try deviceId.
    // IMPORTANT:
    // Ownership is included in the query.
    // =================================================

    let device =
      await Device.findOne({
        deviceId: id,

        userId:
          session.user.id,
      }).lean();

    // =================================================
    // FIND BY MONGODB _ID
    //
    // Ownership is ALSO included here.
    // =================================================

    if (!device) {
      try {
        device =
          await Device.findOne({
            _id: id,

            userId:
              session.user.id,
          }).lean();
      } catch {
        // Invalid MongoDB ObjectId.
      }
    }

    // =================================================
    // NOT FOUND / NOT OWNER
    //
    // We intentionally return the same response.
    //
    // This prevents exposing whether a device belongs
    // to another user.
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

        // Never expose the device API key
        // to the browser.
        apiKey:
          undefined,
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