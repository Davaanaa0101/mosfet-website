import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";

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
    // FIRST: FIND BY DEVICE ID
    // -----------------------------------------

    let device = await Device.findOne({
      deviceId: id,
    }).lean();

    // -----------------------------------------
    // SECOND: SUPPORT MONGODB _id
    // -----------------------------------------

    if (!device) {
      try {
        device = await Device.findById(id).lean();
      } catch {
        // id is not a valid MongoDB ObjectId.
        // That's okay because it may be deviceId.
      }
    }

    // -----------------------------------------
    // NOT FOUND
    // -----------------------------------------

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
    // RETURN DEVICE
    // -----------------------------------------

    return NextResponse.json(device);
  } catch (error) {
    console.error(
      "[device] Failed to load device:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load device",
      },
      {
        status: 500,
      }
    );
  }
}