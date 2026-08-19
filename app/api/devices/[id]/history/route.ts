import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";

// =====================================================
// GET TELEMETRY HISTORY
//
// Dashboard authentication.
//
// User must own the device.
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
    // GET DEVICE ID
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
    // IMPORTANT:
    // Ownership is checked here.
    // =================================================

    let device =
      await Device.findOne({
        deviceId: id,

        userId:
          session.user.id,
      }).lean();

    // =================================================
    // SUPPORT MONGODB _ID
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
    // LOAD TELEMETRY HISTORY
    //
    // DeviceLog uses the ESP32 deviceId.
    // =================================================

    const history =
      await DeviceLog.find({
        deviceId:
          device.deviceId,
      })
        .sort({
          createdAt: -1,
        })
        .limit(500)
        .lean();

    // =================================================
    // OLDEST → NEWEST
    // =================================================

    history.reverse();

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

      count:
        history.length,

      data: history,
    });
  } catch (error) {
    console.error(
      "[telemetry-history] GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load telemetry history",
      },
      {
        status: 500,
      }
    );
  }
}