"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowUpRight, Calculator, Clock3, Loader2 } from "lucide-react";
import { calculateElectricityTariff, type ElectricityTariffInput } from "@/lib/electricity-tariff";

interface Sample { createdAt: string; power: number | null; voltage?: number | null; current?: number | null; sensors?: { type: string; value: number | null }[] }
interface UsageResponse { success: boolean; month: string; sampleCount: number; data: Sample[]; error?: string }
const money = (n: number) => `${Math.round(n).toLocaleString("mn-MN")} ₮`;
const currentMonth = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; };
const localHour = (date: Date) => Number(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Ulaanbaatar", hour: "2-digit", hourCycle: "h23" }).format(date));

function getPower(sample: Sample): number | null {
  if (typeof sample.power === "number" && Number.isFinite(sample.power) && sample.power >= 0) return sample.power;
  const sensor = sample.sensors?.find((s) => s.type?.toUpperCase() === "POWER");
  return typeof sensor?.value === "number" && Number.isFinite(sensor.value) && sensor.value >= 0 ? sensor.value : null;
}

function calculateUsage(samples: Sample[], profile: ElectricityTariffInput) {
  const buckets = { total: 0, day: 0, evening: 0, night: 0 };
  let coveredMs = 0;
  let skipped = 0;
  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1]; const b = samples[i];
    const pa = getPower(a); const pb = getPower(b);
    const ta = new Date(a.createdAt).getTime(); const tb = new Date(b.createdAt).getTime();
    const elapsed = tb - ta;
    if (pa === null || pb === null || !Number.isFinite(elapsed) || elapsed <= 0) continue;
    // Avoid extrapolating across long outages; only integrate reasonably continuous samples.
    if (elapsed > 30 * 60 * 1000) { skipped++; continue; }
    const midpoint = new Date(ta + elapsed / 2);
    const kwh = ((pa + pb) / 2) * (elapsed / 3600000) / 1000;
    buckets.total += kwh; coveredMs += elapsed;
    const hour = localHour(midpoint);
    if (profile.meterType === "single") buckets.day += kwh;
    else if (profile.meterType === "two") {
      if (hour >= 6 && hour < 21) buckets.day += kwh; else buckets.night += kwh;
    } else {
      const eveningEnd = profile.customerType === "business" ? 22 : 21;
      if (hour >= 6 && hour < 17) buckets.day += kwh;
      else if (hour >= 17 && hour < eveningEnd) buckets.evening += kwh;
      else buckets.night += kwh;
    }
  }
  return { ...buckets, coveredHours: coveredMs / 3600000, skipped };
}

export default function DeviceElectricityCost({ deviceId }: { deviceId: string }) {
  const [month, setMonth] = useState(currentMonth());
  const [profile, setProfile] = useState<ElectricityTariffInput | null>(null);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setRefreshTick((v) => v + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    Promise.all([
      fetch("/api/electricity-tariff", { cache: "no-store" }).then(async r => { const j = await r.json(); if (!r.ok) throw new Error(j.error || "Тарифын тохиргоо уншиж чадсангүй."); return j; }),
      fetch(`/api/devices/${encodeURIComponent(deviceId)}/electricity-usage?month=${encodeURIComponent(month)}`, { cache: "no-store" }).then(async r => { const j = await r.json(); if (!r.ok) throw new Error(j.error || "Төхөөрөмжийн хэрэглээ уншиж чадсангүй."); return j as UsageResponse; }),
    ]).then(([tariff, usage]) => {
      if (!active) return;
      if (!tariff.configured || !tariff.profile) throw new Error("Эхлээд Цахилгааны төлбөр хэсэгт хэрэглэгчийн тарифын тохиргоогоо хадгална уу.");
      setProfile({ ...tariff.profile, month }); setSamples(usage.data || []);
    }).catch(err => { if (active) setError(err instanceof Error ? err.message : "Мэдээлэл авахад алдаа гарлаа."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [deviceId, month, refreshTick]);

  const usage = useMemo(() => profile ? calculateUsage(samples, profile) : null, [samples, profile]);
  const result = useMemo(() => {
    if (!profile || !usage) return null;
    return calculateElectricityTariff({ ...profile, month, monthlyKwh: usage.total, dayKwh: usage.day, eveningKwh: usage.evening, nightKwh: usage.night });
  }, [profile, usage, month]);
  const latest = samples.length ? samples[samples.length - 1] : null;
  const latestPower = latest ? getPower(latest) : null;
  const latestVoltage = latest?.voltage ?? latest?.sensors?.find((s) => s.type?.toUpperCase() === "VOLTAGE")?.value ?? null;
  const latestCurrent = latest?.current ?? latest?.sensors?.find((s) => s.type?.toUpperCase() === "CURRENT")?.value ?? null;

  return <section className="overflow-hidden rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-[#102b40]/90 via-[#0b2033]/90 to-[#081827]/95 shadow-[0_18px_55px_rgba(0,0,0,.2)]">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
      <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"><Calculator className="h-5 w-5" /></span><div><h2 className="font-semibold text-slate-100">Цахилгааны хэрэглээ ба төлбөр</h2><p className="mt-1 text-xs text-slate-400">Төхөөрөмжийн бодит чадлын өгөгдлөөр тооцсон дүн</p></div></div>
      <Link href="/dashboard/electricity" className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/20 bg-cyan-300/[.07] px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-300/15">Тариф тохируулах <ArrowUpRight className="h-3.5 w-3.5" /></Link>
    </div>
    <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-5">
      <div className="rounded-2xl border border-white/[.08] bg-white/[.035] p-4"><p className="text-[11px] font-semibold text-slate-400">Сарын хэрэглээ</p><p className="mt-2 text-2xl font-bold text-white">{loading ? "—" : `${(usage?.total ?? 0).toFixed(2)} kWh`}</p><p className="mt-1 text-[10px] text-slate-500">Power (W)-ийн хугацааны интеграл</p></div>
      <div className="rounded-2xl border border-white/[.08] bg-white/[.035] p-4"><p className="text-[11px] font-semibold text-slate-400">Тооцоолсон төлбөр</p><p className="mt-2 text-2xl font-bold text-cyan-200">{loading ? "—" : result ? money(result.total) : "—"}</p><p className="mt-1 text-[10px] text-slate-500">Сонгосон тариф · НӨАТ ороогүй</p></div>
      <div className="rounded-2xl border border-white/[.08] bg-white/[.035] p-4"><p className="text-[11px] font-semibold text-slate-400">Хүчдэл</p><p className="mt-2 text-2xl font-bold text-white">{latestVoltage === null ? "—" : `${Number(latestVoltage).toFixed(1)} V`}</p><p className="mt-1 text-[10px] text-slate-500">Сүүлийн telemetry</p></div>
      <div className="rounded-2xl border border-white/[.08] bg-white/[.035] p-4"><p className="text-[11px] font-semibold text-slate-400">Гүйдэл</p><p className="mt-2 text-2xl font-bold text-white">{latestCurrent === null ? "—" : `${Number(latestCurrent).toFixed(2)} A`}</p><p className="mt-1 text-[10px] text-slate-500">Сүүлийн telemetry</p></div>
      <div className="rounded-2xl border border-white/[.08] bg-white/[.035] p-4"><p className="text-[11px] font-semibold text-slate-400">Одоогийн чадал</p><p className="mt-2 text-2xl font-bold text-white">{latestPower === null ? "—" : `${latestPower.toFixed(1)} W`}</p><p className="mt-1 text-[10px] text-slate-500">Сүүлийн telemetry</p></div>
      <div className="rounded-2xl border border-white/[.08] bg-white/[.035] p-4"><label className="text-[11px] font-semibold text-slate-400" htmlFor={`device-bill-month-${deviceId}`}>Тооцооны сар</label><input id={`device-bill-month-${deviceId}`} type="month" value={month} onChange={e => setMonth(e.target.value)} className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#071a2b] px-3 text-sm text-slate-100 outline-none focus:border-cyan-300/50" /><p className="mt-1 text-[10px] text-slate-500">{samples.length.toLocaleString("mn-MN")} telemetry бичлэг</p></div>
    </div>
    {loading && <div className="flex items-center gap-2 px-6 pb-5 text-xs text-slate-400"><Loader2 className="h-4 w-4 animate-spin" /> Хэрэглээ тооцоолж байна...</div>}
    {error && <div role="alert" className="mx-5 mb-5 rounded-xl border border-amber-300/20 bg-amber-300/[.06] p-4 text-xs leading-5 text-amber-100 sm:mx-6">{error}</div>}
    {!loading && !error && usage && result && <div className="grid gap-3 border-t border-white/[.07] px-5 py-4 sm:grid-cols-3 sm:px-6">
      {profile?.meterType !== "single" && <><div className="text-xs text-slate-400">Өдөр: <strong className="text-slate-200">{usage.day.toFixed(2)} kWh</strong></div>{profile?.meterType === "three" && <div className="text-xs text-slate-400">Орой: <strong className="text-slate-200">{usage.evening.toFixed(2)} kWh</strong></div>}<div className="text-xs text-slate-400">Шөнө: <strong className="text-slate-200">{usage.night.toFixed(2)} kWh</strong></div></>}
      <div className="flex items-center gap-2 text-[10px] text-slate-500"><Clock3 className="h-3.5 w-3.5" /> Хэмжилтээр хамрагдсан хугацаа: {usage.coveredHours.toFixed(1)} цаг</div>
      {usage.skipped > 0 && <p className="text-[10px] leading-4 text-amber-300 sm:col-span-3">{usage.skipped} урт завсартай интервал тооцоонд ороогүй (30 минутаас их). Төхөөрөмжийн offline хугацаанд хэрэглээг дутуу тооцож болзошгүй.</p>}
      {samples.length < 2 && <p className="text-[10px] text-amber-300 sm:col-span-3">Тооцоолол хийхэд дор хаяж 2 чадлын хэмжилт шаардлагатай.</p>}
    </div>}
    <div className="flex items-start gap-2 border-t border-white/[.06] px-5 py-3 text-[10px] leading-5 text-slate-500 sm:px-6"><Activity className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-300/70" /> Хэрэглээг хөрш хоёр хэмжилтийн дундаж чадал × хугацаагаар тооцно. 30 минутаас урт тасалдлыг автоматаар алгасна. Цахилгаан тоолуурын хуримтлагдсан kWh утга биш тул тасалдалтай үед бодит нэхэмжлэхээс зөрж болно.</div>
  </section>;
}
