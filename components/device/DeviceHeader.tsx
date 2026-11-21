"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MapPin, Radio, Pencil, Save, X, Fingerprint, Loader2 } from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import { updateDevice } from "@/services/device-detail";

interface Props { deviceId: string }

function statusPresentation(status?: string) {
  switch (status) {
    case "RUNNING": case "online":
      return { label: "Running", dot: "bg-emerald-400", pill: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" };
    case "WARNING":
      return { label: "Warning", dot: "bg-amber-400", pill: "border-amber-400/20 bg-amber-400/10 text-amber-300" };
    case "ERROR":
      return { label: "Error", dot: "bg-rose-400", pill: "border-rose-400/20 bg-rose-400/10 text-rose-300" };
    case "REGISTERED":
      return { label: "Registered", dot: "bg-sky-400", pill: "border-sky-400/20 bg-sky-400/10 text-sky-300" };
    case "OFFLINE": case "offline":
      return { label: "Offline", dot: "bg-slate-400", pill: "border-slate-400/20 bg-slate-400/10 text-slate-300" };
    default:
      return { label: "Unknown", dot: "bg-slate-400", pill: "border-slate-400/20 bg-slate-400/10 text-slate-300" };
  }
}

export default function DeviceHeader({ deviceId }: Props) {
  const { data, isLoading, error } = useDevice(deviceId);
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [identifier, setIdentifier] = useState("");

  useEffect(() => {
    if (!data) return;
    setName(data.name || "");
    setLocation(data.location || "");
    setIdentifier(data.identifier || data.serialId || "");
  }, [data]);

  function startEditing() {
    if (!data) return;
    setName(data.name || "");
    setLocation(data.location || "");
    setIdentifier(data.identifier || data.serialId || "");
    setSaveError("");
    setEditing(true);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaveError("");
    try {
      await updateDevice(deviceId, { name, location, identifier });
      await queryClient.invalidateQueries({ queryKey: ["device", deviceId] });
      await queryClient.invalidateQueries({ queryKey: ["devices"] });
      // Notify the persistent sidebar immediately so its device label is
      // updated without waiting for the sidebar's background polling cycle.
      window.dispatchEvent(
        new CustomEvent("mosfet:devices-updated", {
          detail: { deviceId, name: name.trim() },
        }),
      );
      setEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save device details.");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) return <div className="h-48 animate-pulse rounded-3xl border border-white/10 bg-slate-900/70" />;
  if (error || !data) return <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-5 text-sm text-rose-300">Device could not be loaded.</div>;

  const status = statusPresentation(data.status);
  const displayIdentifier = data.identifier || data.serialId || "Not assigned";

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-[0_20px_70px_-35px_rgba(6,182,212,0.35)]">
      <div className="relative overflow-hidden px-5 py-6 sm:px-7 sm:py-7">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-200">
              <Radio className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">{data.name || "Unnamed Device"}</h1>
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${status.pill}`}>
                  <span className={`h-2 w-2 rounded-full ${status.dot}`} />{status.label}
                </span>
              </div>
              <p className="mt-2 font-mono text-xs text-slate-400">Device ID · {data.deviceId}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400"><MapPin className="h-3.5 w-3.5 text-cyan-300" />{data.location || "Location not specified"}</p>
            </div>
          </div>
          <button type="button" onClick={startEditing} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2.5 text-xs font-semibold text-cyan-100 transition hover:border-cyan-200/40 hover:bg-cyan-300/15">
            <Pencil className="h-3.5 w-3.5" /> Edit device details
          </button>
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="border-t border-white/10 bg-slate-900/80 p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><h2 className="text-sm font-semibold text-white">Device details</h2><p className="mt-1 text-xs text-slate-400">These labels are shown in your MOSFET dashboard only.</p></div>
            <button type="button" onClick={() => { setEditing(false); setSaveError(""); }} className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white" aria-label="Close editor"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block"><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Device name</span><input required maxLength={80} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Main Building Controller" className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10" /></label>
            <label className="block"><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Location</span><input maxLength={100} value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Living room, Storage room" className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10" /></label>
            <label className="block"><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Device identifier</span><input maxLength={80} value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="e.g. HVAC-CTRL-01" className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10" /></label>
          </div>
          {saveError && <p role="alert" className="mt-3 text-xs text-rose-300">{saveError}</p>}
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => setEditing(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={saving || !name.trim()} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50">{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}{saving ? "Saving..." : "Save changes"}</button>
          </div>
        </form>
      ) : (
        <div className="grid border-t border-white/10 bg-white/[0.025] sm:grid-cols-2 lg:grid-cols-3">
          <div className="border-b border-white/10 px-5 py-4 sm:border-r lg:border-b-0"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Device identifier</p><p className="mt-2 flex items-center gap-2 break-all font-mono text-xs font-medium text-slate-200"><Fingerprint className="h-3.5 w-3.5 shrink-0 text-cyan-300" />{displayIdentifier}</p></div>
          <div className="border-b border-white/10 px-5 py-4 lg:border-b-0 lg:border-r"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Location</p><p className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-200"><MapPin className="h-3.5 w-3.5 shrink-0 text-cyan-300" />{data.location || "Not specified"}</p></div>
          <div className="px-5 py-4"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Hardware serial</p><p className="mt-2 break-all font-mono text-xs font-medium text-slate-200">{data.serialId || "Not available"}</p></div>
        </div>
      )}
    </section>
  );
}
