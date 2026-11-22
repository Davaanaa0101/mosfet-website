import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";

const MONGOLIA_OFFSET_MS = 8 * 60 * 60 * 1000;

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const month = request.nextUrl.searchParams.get("month") || "";
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return NextResponse.json({ success: false, error: "Сарыг YYYY-MM хэлбэрээр сонгоно уу." }, { status: 400 });
    }

    await connectDB();
    let device = await Device.findOne({ deviceId: id, userId: session.user.id }).lean();
    if (!device) {
      try { device = await Device.findOne({ _id: id, userId: session.user.id }).lean(); } catch { /* invalid ObjectId */ }
    }
    if (!device) return NextResponse.json({ success: false, error: "Device not found" }, { status: 404 });

    // The tariff month is a Mongolia-local calendar month (UTC+08:00).
    const [year, monthNumber] = month.split("-").map(Number);
    const startLocalAsUtc = Date.UTC(year, monthNumber - 1, 1);
    const endLocalAsUtc = Date.UTC(year, monthNumber, 1);
    const start = new Date(startLocalAsUtc - MONGOLIA_OFFSET_MS);
    const end = new Date(endLocalAsUtc - MONGOLIA_OFFSET_MS);
    const query: Record<string, unknown> = {
      deviceId: device.deviceId,
      createdAt: { $gte: start, $lt: end },
    };
    if (device.serialId) query.serialId = device.serialId;

    const logs = await DeviceLog.find(query)
      .select({ createdAt: 1, power: 1, voltage: 1, current: 1, sensors: 1 })
      .sort({ createdAt: 1 })
      .limit(12000)
      .lean();

    return NextResponse.json({
      success: true,
      deviceId: device.deviceId,
      month,
      sampleCount: logs.length,
      data: logs.map((log: any) => ({
        createdAt: log.createdAt,
        power: typeof log.power === "number" ? log.power : null,
        voltage: typeof log.voltage === "number" ? log.voltage : null,
        current: typeof log.current === "number" ? log.current : null,
        sensors: Array.isArray(log.sensors) ? log.sensors : [],
      })),
    });
  } catch (error) {
    console.error("[device-electricity-usage]", error);
    return NextResponse.json({ success: false, error: "Цахилгааны хэрэглээний мэдээлэл авахад алдаа гарлаа." }, { status: 500 });
  }
}
