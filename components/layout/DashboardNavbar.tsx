"use client";

export default function Navbar() {
  return (
    <header className="h-16 border-b bg-background px-6 flex items-center justify-between">
      <h2 className="font-semibold text-lg">
        Dashboard
      </h2>

      <div className="flex items-center gap-3">
        Welcome
      </div>
    </header>
  );
}