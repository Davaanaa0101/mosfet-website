"use client";

import Sidebar from "./Sidebar";
import Navbar from "./DashboardNavbar";
import "./premium-glass.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-shell min-h-screen w-full text-slate-100">
      <Sidebar />
      <div className="dashboard-main ml-64 flex min-h-screen min-w-0 flex-col">
        <Navbar />
        <main className="dashboard-content min-w-0 flex-1 p-5 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
