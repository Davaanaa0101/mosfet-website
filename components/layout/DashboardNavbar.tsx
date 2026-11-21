"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronRight, LayoutDashboard } from "lucide-react";

const routeTitles: Record<string, string> = {
  "/dashboard": "Хяналтын самбар",
  "/dashboard/devices": "Төхөөрөмжүүд",
  "/dashboard/devices/register": "Төхөөрөмж бүртгэх",
  "/dashboard/alerts": "Дохиолол",
  "/dashboard/settings": "Тохиргоо",
  "/dashboard/profile": "Профайл",
};

export default function Navbar() {
  const pathname = usePathname();
  const title = routeTitles[pathname] ?? (pathname.startsWith("/dashboard/devices/") ? "Төхөөрөмжийн мэдээлэл" : "Dashboard");

  return (
    <header className="dashboard-topbar sticky top-0 z-30 flex h-[68px] shrink-0 items-center justify-between px-5 sm:px-7 lg:px-8">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="topbar-icon flex h-8 w-8 items-center justify-center rounded-xl"><LayoutDashboard className="h-4 w-4" /></span>
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <span className="hidden text-slate-500 sm:inline">MOSFET</span>
          <ChevronRight className="hidden h-3.5 w-3.5 text-slate-600 sm:block" />
          <h2 className="truncate font-semibold text-slate-100">{title}</h2>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-slate-400 sm:inline">Тавтай морил</span>
        <span className="topbar-bell relative flex h-9 w-9 items-center justify-center rounded-xl"><Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,.9)]" /></span>
      </div>
    </header>
  );
}
