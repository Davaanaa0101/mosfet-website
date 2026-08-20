"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Loader2,
  Mail,
  Save,
  Shield,
  User,
  UserRound,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

// =====================================================
// TYPES
// =====================================================

interface ProfileData {
  name: string;
  email: string;
  role: string;
}

interface ProfileResponse {
  success: boolean;
  data?: ProfileData;
  error?: string;
}

// =====================================================
// DEFAULT PROFILE
// =====================================================

const DEFAULT_PROFILE: ProfileData = {
  name: "",
  email: "",
  role: "User",
};

// =====================================================
// COMPONENT
// =====================================================

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<ProfileData>(
      DEFAULT_PROFILE
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/profile",
            {
              cache: "no-store",
              headers: {
                Accept:
                  "application/json",
              },
            }
          );

        const result =
          (await response.json()) as ProfileResponse;

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Failed to load profile"
          );
        }

        if (
          !result.success ||
          !result.data
        ) {
          throw new Error(
            result.error ||
              "Failed to load profile"
          );
        }

        setProfile({
          ...DEFAULT_PROFILE,
          ...result.data,
        });

        setError(null);
      } catch (err) {
        console.error(
          "[ProfilePage] Load error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  async function saveProfile() {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response =
        await fetch(
          "/api/profile",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            body: JSON.stringify({
              name:
                profile.name.trim(),
            }),
          }
        );

      const result =
        (await response.json()) as ProfileResponse;

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to save profile"
        );
      }

      if (!result.success) {
        throw new Error(
          result.error ||
            "Failed to save profile"
        );
      }

      if (result.data) {
        setProfile({
          ...DEFAULT_PROFILE,
          ...result.data,
        });
      }

      setSuccess(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "[ProfilePage] Save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save profile"
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // HELPERS
  // =====================================================

  function getInitials(
    name: string,
    email: string
  ) {
    const value =
      name.trim() ||
      email.trim() ||
      "U";

    const parts =
      value.split(/\s+/);

    if (parts.length >= 2) {
      return (
        parts[0][0] +
        parts[1][0]
      ).toUpperCase();
    }

    return value
      .slice(0, 2)
      .toUpperCase();
  }

  function formatRole(
    role: string
  ) {
    if (!role) {
      return "User";
    }

    return role
      .replace(
        /[_-]/g,
        " "
      )
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header */}

        <div className="space-y-2">
          <div className="h-9 w-32 animate-pulse rounded-lg bg-muted" />

          <div className="h-5 w-72 animate-pulse rounded-lg bg-muted" />
        </div>

        {/* Profile skeleton */}

        <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          <div className="h-32 animate-pulse bg-muted" />

          <div className="px-6 pb-8">
            <div className="-mt-12 h-24 w-24 animate-pulse rounded-2xl bg-muted ring-4 ring-card" />

            <div className="mt-5 space-y-3">
              <div className="h-7 w-48 animate-pulse rounded bg-muted" />

              <div className="h-4 w-64 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />

              Loading profile...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Account
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Profile
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Manage your personal information
          and account details.
        </p>
      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
          <div className="mt-0.5 rounded-full bg-destructive/10 p-1.5">
            <Shield className="h-4 w-4 text-destructive" />
          </div>

          <div>
            <p className="font-medium text-destructive">
              Something went wrong
            </p>

            <p className="mt-1 text-sm text-destructive/80">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* SUCCESS */}
      {/* ================================================= */}

      {success && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="rounded-full bg-emerald-500/10 p-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>

          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            {success}
          </p>
        </div>
      )}

      {/* ================================================= */}
      {/* PROFILE HERO */}
      {/* ================================================= */}

      <div className="relative overflow-hidden rounded-3xl border bg-card shadow-sm">
        {/* Background */}

        <div className="absolute inset-x-0 top-0 h-36 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

          <div className="absolute -left-20 -top-40 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

          {/* Grid */}

          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(
                  to right,
                  currentColor 1px,
                  transparent 1px
                ),
                linear-gradient(
                  to bottom,
                  currentColor 1px,
                  transparent 1px
                )
              `,
              backgroundSize:
                "32px 32px",
              color:
                "hsl(var(--primary))",
            }}
          />
        </div>

        {/* Profile content */}

        <div className="relative px-6 pb-8 pt-20 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {/* User */}

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              {/* Avatar */}

              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-xl shadow-primary/20 ring-4 ring-card">
                {getInitials(
                  profile.name,
                  profile.email
                )}
              </div>

              {/* Info */}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="truncate text-2xl font-bold text-foreground">
                    {profile.name ||
                      "Unnamed User"}
                  </h2>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <Shield className="h-3.5 w-3.5" />

                    {formatRole(
                      profile.role
                    )}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />

                  <span className="truncate">
                    {profile.email ||
                      "No email"}
                  </span>
                </div>
              </div>
            </div>

            {/* Account status */}

            <div className="flex items-center gap-2 rounded-xl border bg-background/70 px-4 py-3 backdrop-blur">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>

              <span className="text-sm font-medium">
                Active account
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* ================================================= */}
        {/* PERSONAL INFORMATION */}
        {/* ================================================= */}

        <Card className="overflow-hidden rounded-3xl border shadow-sm">
          {/* Header */}

          <div className="border-b bg-muted/20 px-6 py-5 md:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold text-foreground">
                  Personal Information
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Update your account information.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="space-y-7 p-6 md:p-8">
            {/* NAME */}

            <div className="space-y-2">
              <label
                htmlFor="profile-name"
                className="text-sm font-semibold text-foreground"
              >
                Full Name
              </label>

              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="profile-name"
                  type="text"
                  value={
                    profile.name
                  }
                  onChange={(
                    event
                  ) => {
                    setProfile(
                      (
                        current
                      ) => ({
                        ...current,
                        name: event
                          .target
                          .value,
                      })
                    );

                    setSuccess(
                      null
                    );
                  }}
                  placeholder="Enter your full name"
                  disabled={saving}
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-background
                    pl-11
                    pr-4
                    text-sm
                    outline-none
                    transition-all
                    duration-200
                    placeholder:text-muted-foreground
                    hover:border-primary/40
                    focus:border-primary
                    focus:ring-4
                    focus:ring-primary/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />
              </div>

              <p className="text-xs text-muted-foreground">
                This name will be displayed
                throughout your account.
              </p>
            </div>

            {/* EMAIL */}

            <div className="space-y-2">
              <label
                htmlFor="profile-email"
                className="text-sm font-semibold text-foreground"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="profile-email"
                  type="email"
                  value={
                    profile.email
                  }
                  disabled
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-muted/50
                    pl-11
                    pr-4
                    text-sm
                    text-muted-foreground
                    outline-none
                  "
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Email address changes are
                disabled for now.
              </p>
            </div>

            {/* ROLE */}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Account Role
              </label>

              <div className="flex h-12 items-center justify-between rounded-xl border border-border bg-muted/30 px-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>

                  <span className="text-sm font-medium">
                    {formatRole(
                      profile.role
                    )}
                  </span>
                </div>

                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Access level
                </span>
              </div>
            </div>

            {/* SAVE */}

            <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Changes are saved to your
                account immediately.
              </p>

              <button
                type="button"
                onClick={
                  saveProfile
                }
                disabled={
                  saving ||
                  !profile.name.trim()
                }
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-primary
                  px-6
                  text-sm
                  font-semibold
                  text-primary-foreground
                  shadow-lg
                  shadow-primary/20
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-xl
                  hover:shadow-primary/25
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  disabled:hover:translate-y-0
                "
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />

                    Save Changes
                  </>
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* ================================================= */}
        {/* ACCOUNT CARD */}
        {/* ================================================= */}

        <div className="space-y-6">
          {/* Account */}

          <Card className="rounded-3xl border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Account
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    Access information
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {/* Role */}

                <div className="rounded-2xl border bg-muted/20 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Role
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {formatRole(
                      profile.role
                    )}
                  </p>
                </div>

                {/* Status */}

                <div className="rounded-2xl border bg-muted/20 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                    <span className="font-semibold text-emerald-600">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}

          <Card className="rounded-3xl border shadow-sm">
            <CardContent className="p-6">
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <Shield className="h-5 w-5" />
                </div>

                <h3 className="mt-4 font-semibold">
                  Account Security
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Your account is protected
                  by the MOSFET Smart
                  Building authentication
                  system.
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />

                  Authentication active
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}