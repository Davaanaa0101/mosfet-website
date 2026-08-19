import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import DeviceLog from "@/models/DeviceLog";
import Device from "@/models/Device";

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

    // -----------------------------------------
    // FIND DEVICE
    // -----------------------------------------

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
    // QUERY PARAMETERS
    // -----------------------------------------

    const { searchParams } =
      new URL(request.url);

    const limitParam =
      searchParams.get("limit");

    const limit = Math.min(
      Math.max(
        Number(limitParam) || 100,
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

    // -----------------------------------------
    // RETURN OLDEST → NEWEST
    // -----------------------------------------

    logs.reverse();

    return NextResponse.json({
      deviceId: device.deviceId,
      data: logs,
    });
  } catch (error) {
    console.error(
      "[device-telemetry] Error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load telemetry",
      },
      {
        status: 500,
      }
    );
  }
}