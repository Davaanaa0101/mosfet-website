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
  const pathname = usePathname();

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  // =====================================================
  // LOGOUT
  // =====================================================

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

  // =====================================================
  // ACTIVE ROUTE
  // =====================================================

  function isItemActive(
    href: string
  ): boolean {
    /*
     * Dashboard is a special case.
     *
     * /dashboard       -> Dashboard ACTIVE
     * /dashboard/alerts -> Dashboard NOT ACTIVE
     * /dashboard/devices -> Dashboard NOT ACTIVE
     *
     * Other menu items can still
     * match their nested routes.
     */

    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname.startsWith(
        `${href}/`
      )
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <aside
      className="
        fixed
        inset-y-0
        left-0
        z-50
        flex
        h-screen
        w-64
        min-w-64
        flex-col
        border-r
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* ================================================= */}
      {/* LOGO */}
      {/* ================================================= */}

      <div
        className="
          flex
          h-20
          shrink-0
          items-center
          border-b
          border-slate-100
          px-5
        "
      >
        <Link
          href="/dashboard"
          className="
            flex
            items-center
            gap-3
          "
        >
          {/* Logo mark */}

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-primary
              text-sm
              font-black
              text-primary-foreground
              shadow-md
              shadow-primary/20
            "
          >
            M
          </div>

          {/* Logo text */}

          <div>
            <p
              className="
                text-lg
                font-black
                tracking-tight
                text-slate-900
              "
            >
              MOSFET
            </p>

            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-slate-400
              "
            >
              Smart Building
            </p>
          </div>
        </Link>
      </div>

      {/* ================================================= */}
      {/* NAVIGATION */}
      {/* ================================================= */}

      <nav
        className="
          min-h-0
          flex-1
          overflow-y-auto
          px-3
          py-5
        "
      >
        <p
          className="
            mb-3
            px-3
            text-[10px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-slate-400
          "
        >
          Main Menu
        </p>

        <div className="space-y-1">
          {sidebarItems.map(
            (item) => {
              const Icon =
                item.icon;

              const isActive =
                isItemActive(
                  item.href
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
                      group
                      relative
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-3
                      text-sm
                      font-medium
                      transition-all
                      duration-200
                    `,
                    isActive
                      ? `
                        bg-primary
                        text-primary-foreground
                        shadow-md
                        shadow-primary/20
                      `
                      : `
                        text-slate-500
                        hover:bg-slate-50
                        hover:text-slate-900
                      `
                  )}
                >
                  {/* Active indicator */}

                  {isActive && (
                    <span
                      className="
                        absolute
                        -left-3
                        top-1/2
                        h-6
                        w-1
                        -translate-y-1/2
                        rounded-r-full
                        bg-primary
                      "
                    />
                  )}

                  {/* Icon */}

                  <Icon
                    className={cn(
                      `
                        h-5
                        w-5
                        shrink-0
                        transition-transform
                        duration-200
                      `,
                      !isActive &&
                        `
                          group-hover:scale-110
                        `
                    )}
                  />

                  {/* Title */}

                  <span className="truncate">
                    {item.title}
                  </span>
                </Link>
              );
            }
          )}
        </div>
      </nav>

      {/* ================================================= */}
      {/* BOTTOM SECTION */}
      {/* ================================================= */}

      <div
        className="
          shrink-0
          border-t
          border-slate-100
          bg-white
          p-3
        "
      >
        {/* Logout */}

        <button
          type="button"
          onClick={
            handleLogout
          }
          disabled={
            loggingOut
          }
          className="
            group
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-3
            text-sm
            font-medium
            text-slate-500
            transition-all
            duration-200
            hover:bg-red-50
            hover:text-red-600
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {/* Icon */}

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-slate-100
              transition-colors
              group-hover:bg-red-100
            "
          >
            {loggingOut ? (
              <Loader2
                className="
                  h-4
                  w-4
                  animate-spin
                "
              />
            ) : (
              <LogOut
                className="
                  h-4
                  w-4
                "
              />
            )}
          </div>

          {/* Text */}

          <span>
            {loggingOut
              ? "Signing out..."
              : "Logout"}
          </span>
        </button>

        {/* Footer label */}

        <p
          className="
            mt-3
            text-center
            text-[9px]
            text-slate-400
          "
        >
          MOSFET Smart Building Platform
        </p>
      </div>
    </aside>
  );
}