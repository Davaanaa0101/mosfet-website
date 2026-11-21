"use client";

import Sidebar from "./Sidebar";
import Navbar from "./DashboardNavbar";
import "./premium-glass.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-shell min-h-screen w-full bg-[#06101d] text-slate-100">
      {/* ========================================= */}
      {/* FIXED SIDEBAR */}
      {/* ========================================= */}

      <Sidebar />

      {/* ========================================= */}
      {/* RIGHT SIDE */}
      {/* ========================================= */}

      <div className="dashboard-main ml-64 flex min-h-screen min-w-0 flex-col">
        {/* ======================================= */}
        {/* NAVBAR */}
        {/* ======================================= */}

        <Navbar />

        {/* ======================================= */}
        {/* MAIN CONTENT */}
        {/* ======================================= */}

        <main className="min-w-0 flex-1 overflow-auto p-5 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}