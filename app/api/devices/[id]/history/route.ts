import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // The URL contains MongoDB's _id.
    const device = await Device.findById(id).lean();

    if (!device) {
      return NextResponse.json(
        { error: "Device not found" },
        { status: 404 }
      );
    }

    // DeviceLog uses the ESP32's deviceId.
    const history = await DeviceLog.find({
      deviceId: device.deviceId,
    })
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    return NextResponse.json(history.reverse());
  } catch (error) {
    console.error("Telemetry history error:", error);

    return NextResponse.json(
      { error: "Failed to load telemetry history" },
      { status: 500 }
    );
  }
}