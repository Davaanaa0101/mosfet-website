import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";

const MAX_LIMIT = 5000;

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
          success: false,
          error: "Device ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // FIND DEVICE
    // =====================================================

    let device = await Device.findOne({
      deviceId: id,
    }).lean();

    // Also support MongoDB _id
    if (!device) {
      try {
        device =
          await Device.findById(id).lean();
      } catch {
        // Invalid MongoDB ObjectId.
      }
    }

    if (!device) {
      return NextResponse.json(
        {
          success: false,
          error: "Device not found",
        },
        {
          status: 404,
        }
      );
    }

    // =====================================================
    // QUERY PARAMETERS
    // =====================================================

    const searchParams =
      request.nextUrl.searchParams;

    const requestedLimit =
      Number(
        searchParams.get("limit") ||
          "100"
      );

    const limit = Math.min(
      Math.max(
        Number.isFinite(
          requestedLimit
        )
          ? Math.floor(
              requestedLimit
            )
          : 100,
        1
      ),
      MAX_LIMIT
    );

    // =====================================================
    // TIME RANGE
    //
    // Supported:
    //
    // 1h
    // 6h
    // 24h
    // 7d
    // 30d
    // all
    //
    // =====================================================

    const range =
      searchParams
        .get("range")
        ?.toLowerCase() ||
      null;

    let fromDate:
      | Date
      | undefined;

    const now =
      Date.now();

    switch (range) {
      case "1h":
        fromDate = new Date(
          now -
            60 * 60 * 1000
        );
        break;

      case "6h":
        fromDate = new Date(
          now -
            6 *
              60 *
              60 *
              1000
        );
        break;

      case "24h":
        fromDate = new Date(
          now -
            24 *
              60 *
              60 *
              1000
        );
        break;

      case "7d":
        fromDate = new Date(
          now -
            7 *
              24 *
              60 *
              60 *
              1000
        );
        break;

      case "30d":
        fromDate = new Date(
          now -
            30 *
              24 *
              60 *
              60 *
              1000
        );
        break;

      case "all":
      case null:
        fromDate =
          undefined;
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid range. Use 1h, 6h, 24h, 7d, 30d, or all.",
          },
          {
            status: 400,
          }
        );
    }

    // =====================================================
    // BUILD QUERY
    // =====================================================

    const query: {
      deviceId: string;
      createdAt?: {
        $gte: Date;
      };
    } = {
      deviceId:
        device.deviceId,
    };

    if (fromDate) {
      query.createdAt = {
        $gte: fromDate,
      };
    }

    // =====================================================
    // LOAD TELEMETRY
    //
    // Newest first from MongoDB.
    // Reverse afterward for charts.
    // =====================================================

    const logs =
      await DeviceLog.find(
        query
      )
        .sort({
          createdAt: -1,
        })
        .limit(limit)
        .lean();

    // Oldest → newest
    logs.reverse();

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

      range:
        range || "all",

      count:
        logs.length,

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
        error:
          "Failed to load telemetry",
      },
      {
        status: 500,
      }
    );
  }
}