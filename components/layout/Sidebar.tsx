"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  ChevronDown,
  Cpu,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings2,
  ShieldCheck,
  UserRound,
  Loader2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";

type NavLink = { label: string; href: string; icon?: React.ElementType };
type SidebarDevice = {
  _id: string;
  deviceId: string;
  name: string;
};

const deviceListLink: NavLink = {
  label: "Бүх төхөөрөмж",
  href: "/dashboard/devices",
  icon: Cpu,
};

const registerDeviceLink: NavLink = {
  label: "Төхөөрөмж бүртгэх",
  href: "/dashboard/devices/register",
  icon: Plus,
};

function routeIsActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [devices, setDevices] = useState<SidebarDevice[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [devicesOpen, setDevicesOpen] = useState(
    pathname.startsWith("/dashboard/devices"),
  );

  const loadDevices = useCallback(async () => {
    try {
      const response = await fetch("/api/devices", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Device request failed: ${response.status}`);
      const result = await response.json();
      if (result.success && Array.isArray(result.devices)) {
        setDevices(
          result.devices.map((device: SidebarDevice) => ({
            _id: String(device._id),
            deviceId: String(device.deviceId),
            name: String(device.name || device.deviceId),
          })),
        );
      }
    } catch (error) {
      console.error("[Sidebar] Failed to load devices:", error);
    } finally {
      setDevicesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pathname.startsWith("/dashboard/devices")) setDevicesOpen(true);
  }, [pathname]);

  // Load on mount, refresh after registration, on tab focus, and periodically
  // so devices registered elsewhere appear without a manual page refresh.
  useEffect(() => {
    void loadDevices();
    const handleDeviceUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ deviceId?: string; name?: string }>).detail;
      if (detail?.deviceId && typeof detail.name === "string") {
        setDevices((current) =>
          current.map((device) =>
            device.deviceId === detail.deviceId || device._id === detail.deviceId
              ? { ...device, name: detail.name!.trim() || device.name }
              : device,
          ),
        );
      }
      // Re-fetch the canonical list as well, keeping all device metadata in sync.
      void loadDevices();
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") void loadDevices();
    };
    window.addEventListener("mosfet:devices-updated", handleDeviceUpdate);
    window.addEventListener("focus", handleDeviceUpdate);
    document.addEventListener("visibilitychange", handleVisibility);
    const interval = window.setInterval(() => void loadDevices(), 15000);
    return () => {
      window.removeEventListener("mosfet:devices-updated", handleDeviceUpdate);
      window.removeEventListener("focus", handleDeviceUpdate);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.clearInterval(interval);
    };
  }, [loadDevices]);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("[Sidebar] Logout error:", error);
      setLoggingOut(false);
    }
  }

  const dashboardActive = routeIsActive(pathname, "/dashboard");
  const devicesActive = pathname.startsWith("/dashboard/devices");
  const alertsActive = routeIsActive(pathname, "/dashboard/alerts");
  const settingsActive = routeIsActive(pathname, "/dashboard/settings");
  const profileActive = routeIsActive(pathname, "/dashboard/profile");

  return (
    <aside className="mosfet-sidebar fixed inset-y-0 left-0 z-50 flex h-dvh w-64 min-w-64 flex-col overflow-hidden">
      <div className="sidebar-brand flex h-[94px] shrink-0 items-center border-b px-5">
        <Link href="/dashboard" className="group flex min-w-0 items-center gap-3">
          <span className="brand-mark relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-sm font-black text-cyan-100">
            <span className="absolute inset-0 bg-gradient-to-br from-cyan-300/25 via-sky-500/10 to-indigo-500/25" />
            <Zap className="relative h-5 w-5 text-cyan-200 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]" />
          </span>
          <span className="min-w-0">
            <span className="block text-[17px] font-extrabold tracking-[0.04em] text-slate-100">MOSFET</span>
            <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.22em] text-cyan-200/55">Smart Building</span>
          </span>
        </Link>
      </div>

      <nav className="sidebar-nav min-h-0 flex-1 overflow-y-auto px-3.5 py-6">
        <p className="sidebar-section-label mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.22em]">Workspace</p>

        <Link
          href="/dashboard"
          className={cn("sidebar-link group mb-2", dashboardActive && "is-active")}
        >
          <LayoutDashboard className="sidebar-icon" />
          <span className="min-w-0 flex-1">Хяналтын самбар</span>
          {dashboardActive && <span className="sidebar-active-dot" />}
        </Link>

        <div className={cn("sidebar-group mb-2", devicesActive && "is-current")}>
          <button
            type="button"
            aria-expanded={devicesOpen}
            aria-controls="sidebar-devices-submenu"
            onClick={() => setDevicesOpen((open) => !open)}
            className={cn("sidebar-link group w-full", devicesActive && "is-active")}
          >
            <Cpu className="sidebar-icon" />
            <span className="min-w-0 flex-1 text-left">Төхөөрөмжүүд</span>
            <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-500 transition-transform duration-300", devicesOpen && "rotate-180 text-cyan-200")} />
          </button>
          <div
            id="sidebar-devices-submenu"
            className={cn("sidebar-submenu grid transition-[grid-template-rows,opacity] duration-300 ease-out", devicesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="ml-[26px] mt-1 space-y-1 border-l border-cyan-300/15 pl-3">
                <Link
                  href={deviceListLink.href}
                  className={cn("sidebar-sub-link", routeIsActive(pathname, deviceListLink.href) && pathname === deviceListLink.href && "is-active")}
                >
                  <Cpu className="h-3.5 w-3.5 shrink-0" />
                  <span>{deviceListLink.label}</span>
                </Link>

                <div className="my-2 border-t border-white/[0.06]" />
                {devicesLoading && devices.length === 0 ? (
                  <div className="flex items-center gap-2 px-2 py-2 text-[11px] text-slate-500">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Төхөөрөмж ачаалж байна...
                  </div>
                ) : devices.length > 0 ? (
                  <div className="space-y-1">
                    {devices.map((device) => {
                      const href = `/dashboard/devices/${encodeURIComponent(device.deviceId)}`;
                      const active = pathname === href || pathname === `/dashboard/devices/${encodeURIComponent(device._id)}`;
                      return (
                        <Link
                          key={device._id || device.deviceId}
                          href={href}
                          title={`${device.name} · ${device.deviceId}`}
                          className={cn("sidebar-sub-link group/device min-w-0", active && "is-active")}
                        >
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300/70 transition-colors group-hover/device:bg-cyan-200" />
                          <span className="min-w-0 truncate">{device.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="px-2 py-2 text-[10px] text-slate-600">Бүртгэлтэй төхөөрөмж алга</p>
                )}

                <Link
                  href={registerDeviceLink.href}
                  className={cn("sidebar-sub-link mt-2 border-t border-white/[0.06] pt-3", routeIsActive(pathname, registerDeviceLink.href) && "is-active")}
                >
                  <Plus className="h-3.5 w-3.5 shrink-0" />
                  <span>{registerDeviceLink.label}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <p className="sidebar-section-label mb-3 mt-7 px-3 text-[9px] font-bold uppercase tracking-[0.22em]">Monitoring</p>
        <Link href="/dashboard/alerts" className={cn("sidebar-link group mb-2", alertsActive && "is-active")}>
          <Bell className="sidebar-icon" />
          <span className="min-w-0 flex-1">Дохиолол</span>
          {alertsActive && <span className="sidebar-active-dot" />}
        </Link>
        <div className="sidebar-info-card mt-5 rounded-2xl p-3.5">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300"><Activity className="h-3.5 w-3.5" /></span>
            <span className="text-[11px] font-semibold text-slate-200">Системийн төлөв</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Monitoring active
          </div>
        </div>

        <p className="sidebar-section-label mb-3 mt-7 px-3 text-[9px] font-bold uppercase tracking-[0.22em]">Account</p>
        <Link href="/dashboard/settings" className={cn("sidebar-link group mb-2", settingsActive && "is-active")}>
          <Settings2 className="sidebar-icon" />
          <span className="min-w-0 flex-1">Тохиргоо</span>
          {settingsActive && <span className="sidebar-active-dot" />}
        </Link>
        <Link href="/dashboard/profile" className={cn("sidebar-link group", profileActive && "is-active")}>
          <UserRound className="sidebar-icon" />
          <span className="min-w-0 flex-1">Профайл</span>
          {profileActive && <span className="sidebar-active-dot" />}
        </Link>
      </nav>

      <div className="sidebar-footer shrink-0 border-t p-3.5">
        <button type="button" onClick={handleLogout} disabled={loggingOut} className="sidebar-logout group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left disabled:cursor-not-allowed disabled:opacity-50">
          <span className="logout-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"><LogOut className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" /></span>
          <span className="flex-1 text-[12px] font-medium">{loggingOut ? "Signing out..." : "Гарах"}</span>
          {loggingOut && <Loader2 className="h-4 w-4 animate-spin" />}
        </button>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] tracking-wide text-slate-600">
          <ShieldCheck className="h-3 w-3" /> MOSFET Smart Building Platform
        </div>
      </div>
    </aside>
  );
}
