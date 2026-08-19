import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";
import Alert from "@/models/Alert";
import Device from "@/models/Device";

// =====================================================
// GET ALERTS
// =====================================================

export async function GET(
  request: NextRequest
) {
  try {
    await connectDB();

    const searchParams =
      request.nextUrl.searchParams;

    const status =
      searchParams.get("status");

    const limitParam =
      Number(
        searchParams.get("limit") ||
          "100"
      );

    const limit = Math.min(
      Math.max(
        Number.isFinite(
          limitParam
        )
          ? Math.floor(
              limitParam
            )
          : 100,
        1
      ),
      500
    );

    // =================================================
    // BUILD QUERY
    // =================================================

    const query: Record<
      string,
      unknown
    > = {};

    if (
      status === "active" ||
      status === "resolved"
    ) {
      query.status = status;
    }

    // =================================================
    // LOAD ALERTS
    // =================================================

    const alerts =
      await Alert.find(query)
        .sort({
          triggeredAt: -1,
        })
        .limit(limit)
        .lean();

    // =================================================
    // COUNTS
    // =================================================

    const [
      activeCount,
      resolvedCount,
    ] = await Promise.all([
      Alert.countDocuments({
        status: "active",
      }),

      Alert.countDocuments({
        status: "resolved",
      }),
    ]);

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,

      stats: {
        active:
          activeCount,

        resolved:
          resolvedCount,

        total:
          activeCount +
          resolvedCount,
      },

      data: alerts,
    });
  } catch (error) {
    console.error(
      "[alerts] GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to load alerts",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// CREATE ALERT
// =====================================================

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body =
      await request.json();

    const {
      deviceId,
      type,
      title,
      message,
      severity,
      slot,
      sensorType,
      sensorName,
      value,
      threshold,
      unit,
    } = body;

    // =================================================
    // VALIDATION
    // =================================================

    if (
      !deviceId ||
      typeof deviceId !==
        "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "deviceId is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !type ||
      typeof type !==
        "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Alert type is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !title ||
      typeof title !==
        "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Alert title is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !message ||
      typeof message !==
        "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Alert message is required",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // FIND DEVICE
    // =================================================

    const device =
      await Device.findOne({
        deviceId:
          deviceId.trim(),
      }).lean();

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
    // CHECK EXISTING ACTIVE ALERT
    // =================================================

    const existingQuery: Record<
      string,
      unknown
    > = {
      deviceId:
        deviceId.trim(),

      type,

      status: "active",
    };

    if (
      typeof slot ===
      "number"
    ) {
      existingQuery.slot =
        slot;
    }

    const existing =
      await Alert.findOne(
        existingQuery
      ).lean();

    if (existing) {
      return NextResponse.json({
        success: true,

        message:
          "Alert already active",

        data: existing,
      });
    }

    // =================================================
    // CREATE ALERT
    // =================================================

    const alert =
      await Alert.create({
        deviceId:
          deviceId.trim(),

        deviceName:
          device.name ||
          device.deviceId,

        type,

        title:
          title.trim(),

        message:
          message.trim(),

        severity:
          severity ===
            "critical" ||
          severity === "info"
            ? severity
            : "warning",

        slot:
          typeof slot ===
          "number"
            ? slot
            : undefined,

        sensorType:
          typeof sensorType ===
          "string"
            ? sensorType
            : undefined,

        sensorName:
          typeof sensorName ===
          "string"
            ? sensorName
            : undefined,

        value:
          typeof value ===
          "number"
            ? value
            : null,

        threshold:
          typeof threshold ===
          "number"
            ? threshold
            : null,

        unit:
          typeof unit ===
          "string"
            ? unit
            : "",

        status: "active",

        triggeredAt:
          new Date(),
      });

    return NextResponse.json(
      {
        success: true,

        message:
          "Alert created",

        data: alert,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "[alerts] POST error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to create alert",
      },
      {
        status: 500,
      }
    );
  }
}