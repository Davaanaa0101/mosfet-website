"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Loader2,
  LogOut,
} from "lucide-react";

import { sidebarItems } from "@/lib/sidebar";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";

import { useState } from "react";

export default function Sidebar() {
  const pathname =
    usePathname();

  const [loggingOut, setLoggingOut] =
    useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href =
              "/login";
          },
        },
      });
    } catch (error) {
      console.error(
        "[Sidebar] Logout error:",
        error
      );

      setLoggingOut(false);
    }
  }

  return (
    <aside className="hidden w-64 flex-col border-r bg-background md:flex">

      {/* ================================================= */}
      {/* LOGO */}
      {/* ================================================= */}

      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">
          MOSFET
        </h1>
      </div>

      {/* ================================================= */}
      {/* NAVIGATION */}
      {/* ================================================= */}

      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map(
          (item) => {
            const Icon =
              item.icon;

            const isActive =
              pathname ===
                item.href ||
              pathname.startsWith(
                `${item.href}/`
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />

                <span>
                  {item.title}
                </span>
              </Link>
            );
          }
        )}
      </nav>

      {/* ================================================= */}
      {/* LOGOUT */}
      {/* ================================================= */}

      <div className="border-t p-4">
        <button
          type="button"
          onClick={
            handleLogout
          }
          disabled={
            loggingOut
          }
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            "text-muted-foreground",
            "hover:bg-muted hover:text-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {loggingOut ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogOut className="h-5 w-5" />
          )}

          <span>
            {loggingOut
              ? "Signing out..."
              : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
}