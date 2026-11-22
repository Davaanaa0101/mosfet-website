import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import ElectricityTariff from "@/models/ElectricityTariff";
import { calculateElectricityTariff, type ElectricityTariffInput } from "@/lib/electricity-tariff";

async function getUser(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    await connectDB();
    const saved = await ElectricityTariff.findOne({ userId: user.id }).lean();
    if (!saved) return NextResponse.json({ success: true, configured: false, profile: null, calculation: null });
    const { _id, userId, createdAt, updatedAt, __v, ...profile } = saved as any;
    return NextResponse.json({ success: true, configured: true, profile, calculation: calculateElectricityTariff(profile as ElectricityTariffInput) });
  } catch (error) {
    console.error("[electricity-tariff:GET]", error);
    return NextResponse.json({ success: false, error: "Тарифын мэдээлэл авахад алдаа гарлаа." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const body = await request.json() as Partial<ElectricityTariffInput>;
    const customerTypes = ["household", "business", "supported"];
    const meterTypes = ["single", "two", "three"];
    const businessCategories = ["industrial", "telecom", "budget", "other"];
    const values = [body.monthlyKwh, body.dayKwh, body.eveningKwh, body.nightKwh];
    if (!body.month || !/^\d{4}-\d{2}$/.test(body.month) || !customerTypes.includes(String(body.customerType)) || !meterTypes.includes(String(body.meterType)) || !businessCategories.includes(String(body.businessCategory ?? "other")) || values.some((value) => value !== undefined && (!Number.isFinite(Number(value)) || Number(value) < 0))) {
      return NextResponse.json({ success: false, error: "Оруулсан мэдээллээ шалгана уу." }, { status: 400 });
    }
    if (body.customerType === "supported" && body.meterType !== "single") {
      return NextResponse.json({ success: false, error: "Нийгмийн халамжийн тариф нь энгийн тоолуурт хамаарна." }, { status: 400 });
    }
    if (body.customerType === "business" && body.meterType === "two") {
      return NextResponse.json({ success: false, error: "ААН байгууллагын хүснэгтэд энгийн болон 3 тарифт тоолуурын үнэ байна." }, { status: 400 });
    }
    const profile: ElectricityTariffInput = {
      month: body.month,
      customerType: body.customerType as ElectricityTariffInput["customerType"],
      businessCategory: (body.businessCategory ?? "other") as ElectricityTariffInput["businessCategory"],
      meterType: body.meterType as ElectricityTariffInput["meterType"],
      monthlyKwh: Number(body.monthlyKwh ?? 0),
      dayKwh: Number(body.dayKwh ?? 0),
      eveningKwh: Number(body.eveningKwh ?? 0),
      nightKwh: Number(body.nightKwh ?? 0),
      includeBaseFee: Boolean(body.includeBaseFee),
    };
    if (profile.meterType === "single" && profile.monthlyKwh <= 0) return NextResponse.json({ success: false, error: "Сарын хэрэглээг 0-ээс их оруулна уу." }, { status: 400 });
    if (profile.meterType !== "single" && profile.dayKwh + profile.eveningKwh + profile.nightKwh <= 0) return NextResponse.json({ success: false, error: "Цагийн бүсийн хэрэглээг оруулна уу." }, { status: 400 });
    if (profile.customerType === "supported" && profile.includeBaseFee) profile.includeBaseFee = false;
    await connectDB();
    await ElectricityTariff.findOneAndUpdate({ userId: user.id }, { $set: profile, $setOnInsert: { userId: user.id } }, { new: true, upsert: true, runValidators: true });
    return NextResponse.json({ success: true, profile, calculation: calculateElectricityTariff(profile) });
  } catch (error) {
    console.error("[electricity-tariff:PUT]", error);
    return NextResponse.json({ success: false, error: "Тооцооллыг хадгалахад алдаа гарлаа." }, { status: 500 });
  }
}
