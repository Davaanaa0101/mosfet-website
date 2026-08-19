import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // The ESP32 sends its deviceId, for example:
    // esp32_1
    //
    // The dashboard uses MongoDB _id.
    // Therefore support both.

    let device = await Device.findOne({
      deviceId: id,
    }).lean();

    if (!device) {
      device = await Device.findById(id).lean();
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

    return NextResponse.json({
      deviceId: device.deviceId,

      deviceName: device.name || device.deviceId,

      // Default telemetry interval.
      // We will make this editable from the dashboard later.
      sendInterval: 10000,

      sensors: [
        {
          slot: 1,
          type: "TEMPERATURE",
        },
        {
          slot: 2,
          type: "TEMPERATURE",
        },
        {
          slot: 3,
          type: "TEMPERATURE",
        },
        {
          slot: 4,
          type: "TEMPERATURE",
        },
        {
          slot: 5,
          type: "TEMPERATURE",
        },
        {
          slot: 6,
          type: "TEMPERATURE",
        },
        {
          slot: 7,
          type: "DHT_HUMIDITY",
        },
        {
          slot: 8,
          type: "N/A",
        },
      ],
    });
  } catch (error) {
    console.error("Device config error:", error);

    return NextResponse.json(
      {
        error: "Failed to load device configuration",
      },
      {
        status: 500,
      }
    );
  }
}