import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import DeviceLog from "@/models/DeviceLog";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const history = await DeviceLog.find({
      deviceId: id,
    })
      .sort({
        createdAt: -1,
      })
      .limit(500)
      .lean();

    return NextResponse.json(history.reverse());
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to load history",
      },
      {
        status: 500,
      }
    );
  }
}