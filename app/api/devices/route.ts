import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";

export async function GET() {
  try {
    await connectDB();

    const devices = await Device.find()
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json(devices);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load devices" },
      { status: 500 }
    );
  }
}