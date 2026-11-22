"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2, ReceiptText, Zap } from "lucide-react";

type BillData = { configured: boolean; profile?: { month: string; monthlyKwh: number; dayKwh: number; eveningKwh: number; nightKwh: number }; calculation?: { total: number; energyCharge: number; baseFee: number } };
const money = (value: number) => `${Math.round(value).toLocaleString("mn-MN")} ₮`;

export default function ElectricityBillCard() {
  const [data, setData] = useState<BillData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/electricity-tariff", { cache: "no-store" }).then((r) => r.json()).then(setData).catch(() => setData(null)).finally(() => setLoading(false));
  }, []);
  const totalKwh = data?.profile ? (data.profile.monthlyKwh || data.profile.dayKwh + data.profile.eveningKwh + data.profile.nightKwh) : 0;
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-300/15 bg-gradient-to-r from-[#0d2b40] via-[#10283c] to-[#0b2033] p-5 shadow-[0_16px_50px_rgba(0,0,0,.18)] sm:p-6">
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-cyan-400/[.08] blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"><ReceiptText className="h-5 w-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300">Energy cost overview</p><h2 className="mt-1 text-lg font-bold text-white">Цахилгааны төлбөр</h2><p className="mt-1 text-xs text-slate-400">Сонгосон тарифаар сарын төлбөрөө хянах</p></div></div>
        <div className="sm:text-right">{loading ? <Loader2 className="ml-auto h-5 w-5 animate-spin text-cyan-300" /> : data?.configured && data.calculation ? <><p className="text-xs text-slate-400">{data.profile?.month} · {totalKwh.toLocaleString("mn-MN")} кВт.ц</p><p className="mt-1 text-3xl font-black text-white">{money(data.calculation.total)}</p><p className="mt-1 text-[10px] text-slate-500">Урьдчилсан тооцоо · НӨАТ ороогүй</p></> : <><p className="text-sm font-semibold text-slate-200">Тариф тохируулаагүй байна</p><p className="mt-1 text-xs text-slate-400">Тариф болон хэрэглээгээ оруулж тооцоолно уу.</p></>}</div>
      </div>
      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4"><span className="inline-flex items-center gap-2 text-[11px] text-slate-400"><Zap className="h-3.5 w-3.5 text-cyan-300" /> {data?.configured ? "Сүүлд хадгалсан тарифын тооцоо" : "Төлбөрийн тооцооллыг эхлүүлэх"}</span><Link href="/dashboard/electricity" className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3.5 py-2 text-xs font-semibold text-cyan-100 transition hover:border-cyan-200/40 hover:bg-cyan-300/15">{data?.configured ? "Тооцоог шинэчлэх" : "Тариф тохируулах"}<ArrowUpRight className="h-3.5 w-3.5" /></Link></div>
    </section>
  );
}
