import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";
import Alert, {
  AlertType,
} from "@/models/Alert";
import Device from "@/models/Device";

// =====================================================
// ALERT TYPES
// =====================================================

const ALERT_TYPES = [
  "DEVICE_OFFLINE",
  "HIGH_TEMPERATURE",
  "LOW_TEMPERATURE",
  "HIGH_HUMIDITY",
  "LOW_HUMIDITY",
  "HIGH_CURRENT",
  "LOW_RSSI",
] as const;

function isAlertType(
  value: string
): value is AlertType {
  return ALERT_TYPES.includes(
    value as AlertType
  );
}

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

    const limitParam = Number(
      searchParams.get("limit") ||
        "100"
    );

    const limit = Math.min(
      Math.max(
        Number.isFinite(limitParam)
          ? Math.floor(limitParam)
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
    // VALIDATE DEVICE ID
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

    // =================================================
    // VALIDATE ALERT TYPE
    // =================================================

    if (
      typeof type !== "string" ||
      !isAlertType(type)
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Invalid alert type",

          allowedTypes:
            ALERT_TYPES,
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // VALIDATE TITLE
    // =================================================

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

    // =================================================
    // VALIDATE MESSAGE
    // =================================================

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

    const cleanDeviceId =
      deviceId.trim();

    const device =
      await Device.findOne({
        deviceId:
          cleanDeviceId,
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
        cleanDeviceId,

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
    // NORMALIZE SEVERITY
    // =================================================

    const normalizedSeverity =
      severity === "critical" ||
      severity === "info"
        ? severity
        : "warning";

    // =================================================
    // NORMALIZE SENSOR DATA
    // =================================================

    const normalizedSlot =
      typeof slot === "number"
        ? slot
        : undefined;

    const normalizedSensorType =
      typeof sensorType ===
      "string"
        ? sensorType.trim()
        : undefined;

    const normalizedSensorName =
      typeof sensorName ===
      "string"
        ? sensorName.trim()
        : undefined;

    const normalizedValue =
      typeof value === "number"
        ? value
        : null;

    const normalizedThreshold =
      typeof threshold ===
      "number"
        ? threshold
        : null;

    const normalizedUnit =
      typeof unit === "string"
        ? unit.trim()
        : "";

    // =================================================
    // CREATE ALERT
    // =================================================

    const alert =
      await Alert.create({
        deviceId:
          cleanDeviceId,

        deviceName:
          device.name ||
          device.deviceId,

        type,

        title:
          title.trim(),

        message:
          message.trim(),

        severity:
          normalizedSeverity,

        slot:
          normalizedSlot,

        sensorType:
          normalizedSensorType,

        sensorName:
          normalizedSensorName,

        value:
          normalizedValue,

        threshold:
          normalizedThreshold,

        unit:
          normalizedUnit,

        status: "active",

        triggeredAt:
          new Date(),
      });

    // =================================================
    // RESPONSE
    // =================================================

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