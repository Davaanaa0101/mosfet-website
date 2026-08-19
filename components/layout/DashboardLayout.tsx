"use client";

import Sidebar from "./Sidebar";
import Navbar from "./DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      {/* ========================================= */}
      {/* SIDEBAR */}
      {/* ========================================= */}

      <div className="block w-64 shrink-0">
        <Sidebar />
      </div>

      {/* ========================================= */}
      {/* RIGHT SIDE */}
      {/* ========================================= */}

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />

        <main className="min-w-0 flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}