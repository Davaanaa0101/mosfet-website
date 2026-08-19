"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  User,
  Mail,
  Shield,
  Save,
} from "lucide-react";

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

const DEFAULT_PROFILE: ProfileData = {
  name: "",
  email: "",
  role: "User",
};

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

      if (
        !result.success
      ) {
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
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Profile
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage your account information.
          </p>
        </div>

        <Card>
          <CardContent className="py-12">
            <p className="text-center text-sm text-muted-foreground">
              Loading profile...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="space-y-8">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div>
        <h1 className="text-3xl font-bold">
          Profile
        </h1>

        <p className="mt-1 text-muted-foreground">
          Manage your account information.
        </p>
      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            {error}
          </p>
        </div>
      )}

      {/* ================================================= */}
      {/* SUCCESS */}
      {/* ================================================= */}

      {success && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
          <p className="text-sm text-green-700 dark:text-green-400">
            {success}
          </p>
        </div>
      )}

      {/* ================================================= */}
      {/* PROFILE */}
      {/* ================================================= */}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <User className="h-5 w-5" />
            </div>

            <div>
              <CardTitle>
                Personal Information
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Update your account information.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* NAME */}

          <div className="space-y-2">
            <label
              htmlFor="profile-name"
              className="text-sm font-medium"
            >
              Name
            </label>

            <input
              id="profile-name"
              type="text"
              value={profile.name}
              onChange={(event) =>
                setProfile(
                  (current) => ({
                    ...current,
                    name:
                      event.target
                        .value,
                  })
                )
              }
              placeholder="Your name"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* EMAIL */}

          <div className="space-y-2">
            <label
              htmlFor="profile-email"
              className="text-sm font-medium"
            >
              Email
            </label>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />

              <input
                id="profile-email"
                type="email"
                value={
                  profile.email
                }
                disabled
                className="w-full rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Email changes are disabled for now.
            </p>
          </div>

          {/* ROLE */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Role
            </label>

            <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
              <Shield className="h-4 w-4 text-muted-foreground" />

              <span className="text-sm">
                {profile.role ||
                  "User"}
              </span>
            </div>
          </div>

          {/* SAVE */}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={
                saveProfile
              }
              disabled={
                saving ||
                !profile.name.trim()
              }
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />

              {saving
                ? "Saving..."
                : "Save Profile"}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* ================================================= */}
      {/* ACCOUNT */}
      {/* ================================================= */}

      <Card>
        <CardHeader>
          <CardTitle>
            Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">
                Account Role
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Your current access level.
              </p>
            </div>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {profile.role ||
                "User"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}