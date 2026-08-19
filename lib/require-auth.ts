import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

// =====================================================
// GET CURRENT USER
// =====================================================

export async function getCurrentUser() {
  const session =
    await auth.api.getSession({
      headers: await headers(),
    });

  return session?.user ?? null;
}

// =====================================================
// REQUIRE USER
//
// Use this inside API routes.
// =====================================================

export async function requireUser() {
  const session =
    await auth.api.getSession({
      headers: await headers(),
    });

  if (!session?.user) {
    return {
      session: null,
      user: null,
      unauthorized: true,
    };
  }

  return {
    session,
    user: session.user,
    unauthorized: false,
  };
}