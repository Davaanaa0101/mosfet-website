import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Device ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // Find by ESP32 deviceId first
    let device = await Device.findOne({
      deviceId: id,
    }).lean();

    // Also support MongoDB _id
    if (!device) {
      try {
        device = await Device.findById(id).lean();
      } catch {
        // Ignore invalid MongoDB ObjectId
      }
    }

    if (!device) {
      return NextResponse.json(
        {
          error: "Device not found",
        },
        {
          status: 404,
        }
      );
    }

    // -----------------------------------------
    // LIMIT
    // -----------------------------------------

    const searchParams =
      request.nextUrl.searchParams;

    const requestedLimit =
      Number(
        searchParams.get("limit") || "100"
      );

    const limit = Math.min(
      Math.max(
        Number.isFinite(requestedLimit)
          ? requestedLimit
          : 100,
        1
      ),
      1000
    );

    // -----------------------------------------
    // LOAD TELEMETRY
    // -----------------------------------------

    const logs = await DeviceLog.find({
      deviceId: device.deviceId,
    })
      .sort({
        createdAt: -1,
      })
      .limit(limit)
      .lean();

    // Chart needs oldest → newest
    logs.reverse();

    return NextResponse.json({
      success: true,

      deviceId: device.deviceId,

      data: logs,
    });
  } catch (error) {
    console.error(
      "[device-telemetry] GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load telemetry",
      },
      {
        status: 500,
      }
    );
  }
}