"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, ReceiptText, Save, Zap } from "lucide-react";
import { calculateElectricityTariff, type ElectricityTariffInput } from "@/lib/electricity-tariff";

const currentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};
const initial: ElectricityTariffInput = {
  month: currentMonth(), customerType: "household", businessCategory: "other", meterType: "single",
  monthlyKwh: 180, dayKwh: 0, eveningKwh: 0, nightKwh: 0, includeBaseFee: false,
};
const money = (value: number) => `${Math.round(value).toLocaleString("mn-MN")} ₮`;
const field = "mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#071a2b]/80 px-3.5 text-sm text-slate-100 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10";
const label = "block text-xs font-semibold tracking-wide text-slate-300";

export default function ElectricityTariffPage() {
  const [form, setForm] = useState<ElectricityTariffInput>(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const result = useMemo(() => calculateElectricityTariff(form), [form]);

  useEffect(() => {
    fetch("/api/electricity-tariff", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Мэдээлэл ачаалж чадсангүй.");
        if (data.configured && data.profile) setForm({ ...initial, ...data.profile });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof ElectricityTariffInput>(key: K, value: ElectricityTariffInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true); setError(""); setSaved(false);
    try {
      const response = await fetch("/api/electricity-tariff", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Хадгалах үед алдаа гарлаа.");
      setForm({ ...form, ...data.profile }); setSaved(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Алдаа гарлаа."); }
    finally { setSaving(false); }
  }

  const isSingle = form.meterType === "single";
  const isSupported = form.customerType === "supported";
  const isBusiness = form.customerType === "business";
  const totalKwh = isSingle ? form.monthlyKwh : form.dayKwh + form.eveningKwh + form.nightKwh;

  return (
    <div className="mosfet-glass-page mx-auto max-w-6xl space-y-7 rounded-3xl p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-cyan-200"><ArrowLeft className="h-3.5 w-3.5" /> Хяналтын самбар</Link>
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"><Zap className="h-5 w-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-cyan-300">MOSFET · ENERGY</p><h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Цахилгааны төлбөрийн тооцоолуур</h1></div></div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Өөрийн хэрэглэгчийн ангилал, тоолуурын төрөл болон тарифыг сонгож сарын төлбөрөө урьдчилан тооцоолно.</p>
        </div>
        <div className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-3.5 py-2 text-xs text-cyan-200">Тарифыг хэрэглэгч өөрөө сонгоно</div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-3xl border border-white/10 bg-[#0b2033]/75 p-5 shadow-[0_18px_60px_rgba(0,0,0,.18)] backdrop-blur-xl sm:p-7">
          <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5"><ReceiptText className="h-5 w-5 text-cyan-300" /><div><h2 className="font-semibold text-slate-100">Тарифын тохиргоо</h2><p className="mt-1 text-xs text-slate-400">Тооцоолох мэдээллээ оруулна уу.</p></div></div>
          {loading ? <div className="flex items-center gap-2 py-12 text-sm text-slate-400"><Loader2 className="h-4 w-4 animate-spin" /> Мэдээлэл ачаалж байна...</div> : <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={label}>Тооцооны сар<input className={field} type="month" value={form.month} onChange={(e) => update("month", e.target.value)} /></label>
              <label className={label}>Хэрэглэгчийн ангилал<select className={field} value={form.customerType} onChange={(e) => { const customerType = e.target.value as ElectricityTariffInput["customerType"]; setForm((v) => ({ ...v, customerType, meterType: customerType === "supported" ? "single" : customerType === "business" && v.meterType === "two" ? "single" : v.meterType, includeBaseFee: customerType === "household" ? v.includeBaseFee : false })); setSaved(false); }}><option value="household">Айл өрх</option><option value="business">Үйлдвэр, ААН байгууллага</option><option value="supported">Нийгмийн халамжийн дэмжлэгтэй хэрэглэгч</option></select></label>
            </div>
            {isBusiness && <label className={label}>ААН байгууллагын тарифын ангилал<select className={field} value={form.businessCategory} onChange={(e) => update("businessCategory", e.target.value as ElectricityTariffInput["businessCategory"])}><option value="industrial">Уул уурхай, олборлох, боловсруулах үйлдвэрлэл</option><option value="telecom">Үүрэн холбооны үйлчилгээ</option><option value="budget">Төсвийн байгууллага</option><option value="other">Бусад үйлдвэр, ААН</option></select></label>}
            <label className={label}>Тоолуурын төрөл<select className={field} value={form.meterType} onChange={(e) => update("meterType", e.target.value as ElectricityTariffInput["meterType"])}><option value="single">Энгийн тоолуур</option>{!isSupported && !isBusiness && <option value="two">2 тарифт тоолуур</option>}{!isSupported && <option value="three">3 тарифт тоолуур</option>}</select></label>
            {isSingle ? <label className={label}>Сарын нийт хэрэглээ (кВт.ц)<input className={field} type="number" min="0" step="0.1" value={form.monthlyKwh} onChange={(e) => update("monthlyKwh", Math.max(0, Number(e.target.value)))} placeholder="Жишээ: 250" /></label> : <div className="grid gap-4 sm:grid-cols-3">
              <label className={label}>Өдрийн хэрэглээ (кВт.ц)<input className={field} type="number" min="0" step="0.1" value={form.dayKwh} onChange={(e) => update("dayKwh", Math.max(0, Number(e.target.value)))} /></label>
              {form.meterType === "three" && <label className={label}>Оройн хэрэглээ (кВт.ц)<input className={field} type="number" min="0" step="0.1" value={form.eveningKwh} onChange={(e) => update("eveningKwh", Math.max(0, Number(e.target.value)))} /></label>}
              <label className={label}>Шөнийн хэрэглээ (кВт.ц)<input className={field} type="number" min="0" step="0.1" value={form.nightKwh} onChange={(e) => update("nightKwh", Math.max(0, Number(e.target.value)))} /></label>
            </div>}
            {form.customerType === "household" && form.meterType === "three" && <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[.025] p-4"><input type="checkbox" className="mt-0.5 h-4 w-4 accent-cyan-400" checked={form.includeBaseFee} onChange={(e) => update("includeBaseFee", e.target.checked)} /><span><span className="block text-sm font-medium text-slate-200">Сарын суурь тариф нэмэх</span><span className="mt-1 block text-xs text-slate-400">Эх сурвалжийн хүснэгтэд заасан 3,360 ₮ суурь тариф.</span></span></label>}
            <div className="rounded-xl border border-cyan-300/15 bg-cyan-300/[.05] px-4 py-3 text-xs leading-5 text-slate-300"><strong className="text-cyan-200">Нийт хэрэглээ: {totalKwh.toLocaleString("mn-MN")} кВт.ц</strong><br />Өдрийн болон оройн тарифын цагийн хуваарийг таны сонгосон тарифын хүснэгтийн дагуу тооцно.</div>
            {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
            <div className="flex flex-wrap items-center gap-3"><button type="button" onClick={save} disabled={saving || loading} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 px-5 text-sm font-bold text-[#061827] shadow-lg shadow-cyan-500/15 transition hover:-translate-y-0.5 hover:shadow-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Тооцоог хадгалах</button>{saved && <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-300"><CheckCircle2 className="h-4 w-4" /> Хадгалагдлаа</span>}</div>
          </div>}
        </section>

        <section className="h-fit overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-[#102c42] via-[#0b2033] to-[#091a2b] shadow-[0_20px_70px_rgba(0,0,0,.24)]">
          <div className="border-b border-white/10 p-6"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-cyan-300">Estimated monthly bill</p><p className="mt-3 text-sm text-slate-300">Тооцоолсон төлбөр</p><div className="mt-2 text-4xl font-black tracking-tight text-white sm:text-[42px]">{money(result.total)}</div><p className="mt-2 text-xs text-slate-400">{form.month} · {totalKwh.toLocaleString("mn-MN")} кВт.ц</p></div>
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Цахилгаан хэрэглээ</span><strong className="text-slate-100">{money(result.energyCharge)}</strong></div>
            {result.rateDetails.map((row) => <div key={row.label} className="rounded-xl border border-white/[.07] bg-white/[.025] p-3"><div className="flex justify-between gap-3 text-xs"><span className="text-slate-300">{row.label}</span><span className="whitespace-nowrap font-semibold text-slate-100">{money(row.amount)}</span></div><p className="mt-2 text-[11px] text-slate-500">{row.kwh.toLocaleString("mn-MN")} кВт.ц × {row.rate.toLocaleString("mn-MN")} ₮</p></div>)}
            {result.baseFee > 0 && <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Сарын суурь тариф</span><strong className="text-slate-100">{money(result.baseFee)}</strong></div>}
            <div className="border-t border-white/10 pt-4"><div className="flex items-center justify-between"><span className="font-semibold text-slate-200">Нийт төлбөр</span><strong className="text-xl font-extrabold text-cyan-200">{money(result.total)}</strong></div><p className="mt-2 text-[10px] text-slate-500">{result.bandLabel} · НӨАТ ороогүй</p></div>
            <div className="rounded-xl bg-black/15 p-3 text-[11px] leading-5 text-slate-400">{result.notes.map((note) => <p key={note}>• {note}</p>)}</div>
          </div>
        </section>
      </div>
      <p className="text-[11px] leading-5 text-slate-500">Анхааруулга: Энэ нь таны оруулсан хэрэглээ болон сонгосон тариф дээр үндэслэсэн урьдчилсан тооцоо бөгөөд албан ёсны нэхэмжлэх биш. Тарифын дүнг хавсаргасан тарифын хүснэгтээс авсан.</p>
    </div>
  );
}
