import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@/lib/auth";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";

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
    // =====================================================
    // AUTHENTICATION
    // =====================================================

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

    // =====================================================
    // DATABASE
    // =====================================================

    await connectDB();

    // =====================================================
    // GET DEVICE ID
    // =====================================================

    const { id } = await params;

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

    // =====================================================
    // FIND DEVICE BY MONGODB _ID
    // =====================================================

    let device;

    try {
      device =
        await Device.findById(
          id
        ).lean();
    } catch {
      // Invalid MongoDB ObjectId
      device = null;
    }

    // =====================================================
    // DEVICE NOT FOUND
    // =====================================================

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

    // =====================================================
    // LOAD TELEMETRY HISTORY
    //
    // DeviceLog uses the ESP32 deviceId,
    // not MongoDB _id.
    // =====================================================

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

    // =====================================================
    // OLDEST → NEWEST
    // =====================================================

    history.reverse();

    // =====================================================
    // RESPONSE
    // =====================================================

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