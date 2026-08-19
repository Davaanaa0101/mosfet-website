import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";

const DEFAULT_CONFIG = {
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
};

export async function GET(
  _request: NextRequest,
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
    // FIND BY DEVICE ID
    // -----------------------------------------

    let device = await Device.findOne({
      deviceId: id,
    }).lean();

    // -----------------------------------------
    // ALSO SUPPORT MONGODB _id
    // -----------------------------------------

    if (!device) {
      try {
        device = await Device.findById(id).lean();
      } catch {
        // The id isn't a valid MongoDB ObjectId.
        // That's okay because it may simply be
        // an ESP32 deviceId.
      }
    }

    // -----------------------------------------
    // DEVICE DOESN'T EXIST YET
    // -----------------------------------------
    //
    // This happens on the first ESP32 boot.
    //
    // Do NOT return 500.
    //
    // Return a default configuration so the ESP32
    // can continue working.
    //

    if (!device) {
      return NextResponse.json({
        deviceId: id,

        deviceName: id,

        sendInterval:
          DEFAULT_CONFIG.sendInterval,

        sensors:
          DEFAULT_CONFIG.sensors,
      });
    }

    // -----------------------------------------
    // EXISTING DEVICE
    // -----------------------------------------

    return NextResponse.json({
      deviceId:
        device.deviceId,

      deviceName:
        device.name ||
        device.deviceId,

      sendInterval:
        DEFAULT_CONFIG.sendInterval,

      sensors:
        DEFAULT_CONFIG.sensors,
    });
  } catch (error) {
    console.error(
      "[device-config] Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load device configuration",
      },
      {
        status: 500,
      }
    );
  }
}