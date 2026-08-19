"use client";

import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";

import { signOut } from "@/lib/auth-client";

export default function LogoutButton() {
  const [loading, setLoading] =
    useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

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
        "[Logout] Error:",
        error
      );

      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}

      <span>
        {loading
          ? "Signing out..."
          : "Logout"}
      </span>
    </button>
  );
}