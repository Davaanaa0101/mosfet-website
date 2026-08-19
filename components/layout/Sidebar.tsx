"use client";

import { useState } from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  Loader2,
  LogOut,
} from "lucide-react";

import {
  sidebarItems,
} from "@/lib/sidebar";

import { cn } from "@/lib/utils";

import {
  signOut,
} from "@/lib/auth-client";

export default function Sidebar() {
  const pathname =
    usePathname();

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await signOut();

      window.location.href =
        "/login";
    } catch (error) {
      console.error(
        "[Sidebar] Logout error:",
        error
      );

      setLoggingOut(false);
    }
  }

  return (
    <aside
      className="
        flex
        h-screen
        w-64
        min-w-64
        shrink-0
        flex-col
        border-r
        bg-background
      "
    >
      {/* ======================================= */}
      {/* LOGO */}
      {/* ======================================= */}

      <div
        className="
          flex
          h-16
          shrink-0
          items-center
          border-b
          px-6
        "
      >
        <h1
          className="
            text-xl
            font-bold
          "
        >
          MOSFET
        </h1>
      </div>

      {/* ======================================= */}
      {/* NAVIGATION */}
      {/* ======================================= */}

      <nav
        className="
          flex-1
          overflow-y-auto
          p-4
        "
      >
        <div
          className="
            space-y-1
          "
        >
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
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  className={cn(
                    `
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      transition-colors
                    `,
                    isActive
                      ? `
                        bg-primary
                        text-primary-foreground
                      `
                      : `
                        text-muted-foreground
                        hover:bg-muted
                        hover:text-foreground
                      `
                  )}
                >
                  <Icon
                    className="
                      h-5
                      w-5
                      shrink-0
                    "
                  />

                  <span>
                    {
                      item.title
                    }
                  </span>
                </Link>
              );
            }
          )}
        </div>
      </nav>

      {/* ======================================= */}
      {/* LOGOUT */}
      {/* ======================================= */}

      <div
        className="
          shrink-0
          border-t
          p-4
        "
      >
        <button
          type="button"
          onClick={
            handleLogout
          }
          disabled={
            loggingOut
          }
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-lg
            px-3
            py-2.5
            text-sm
            font-medium
            text-muted-foreground
            transition-colors
            hover:bg-muted
            hover:text-foreground
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loggingOut ? (
            <Loader2
              className="
                h-5
                w-5
                animate-spin
              "
            />
          ) : (
            <LogOut
              className="
                h-5
                w-5
              "
            />
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