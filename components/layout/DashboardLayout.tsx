"use client";

import Sidebar from "./Sidebar";
import Navbar from "./DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-muted/30">
      {/* ========================================= */}
      {/* FIXED SIDEBAR */}
      {/* ========================================= */}

      <Sidebar />

      {/* ========================================= */}
      {/* RIGHT SIDE */}
      {/* ========================================= */}

      <div className="ml-64 flex min-h-screen min-w-0 flex-col">
        {/* ======================================= */}
        {/* NAVBAR */}
        {/* ======================================= */}

        <Navbar />

        {/* ======================================= */}
        {/* MAIN CONTENT */}
        {/* ======================================= */}

        <main className="min-w-0 flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}