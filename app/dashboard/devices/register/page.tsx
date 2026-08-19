"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Cpu,
  Copy,
} from "lucide-react";

import Link from "next/link";

export default function RegisterDevicePage() {
  const [serialId, setSerialId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<{
      serialId: string;
      deviceId: string;
      name: string;
      apiKey?: string;
    } | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    const cleanSerialId =
      serialId.trim();

    if (!cleanSerialId) {
      setError(
        "Please enter the device Serial ID."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/devices/register",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
              serialId:
                cleanSerialId,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setError(
          result.error ||
            "Failed to register device."
        );

        return;
      }

      setSuccess({
        serialId:
          result.data.serialId,

        deviceId:
          result.data.deviceId,

        name:
          result.data.name,

        apiKey:
          result.data.apiKey,
      });

      setSerialId("");
    } catch (error) {
      console.error(
        "[RegisterDevice] Error:",
        error
      );

      setError(
        "Unable to register device. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyApiKey() {
    if (!success?.apiKey) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        success.apiKey
      );
    } catch {
      console.error(
        "Failed to copy API key"
      );
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* HEADER */}

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/devices"
          className="flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold">
            Register Device
          </h1>

          <p className="text-sm text-muted-foreground">
            Connect an ESP32 device to your account.
          </p>
        </div>
      </div>

      {/* CARD */}

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        {!success ? (
          <>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Cpu className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Device Registration
                </h2>

                <p className="text-sm text-muted-foreground">
                  Enter the Serial ID printed on your ESP32.
                </p>
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
                <p className="text-sm text-destructive">
                  {error}
                </p>
              </div>
            )}

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-5"
            >
              <div className="space-y-2">
                <label
                  htmlFor="serialId"
                  className="text-sm font-medium"
                >
                  Serial ID
                </label>

                <input
                  id="serialId"
                  value={serialId}
                  onChange={(event) =>
                    setSerialId(
                      event.target.value
                    )
                  }
                  placeholder="MOSFET-ESP32-000001"
                  disabled={loading}
                  autoComplete="off"
                  className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />

                <p className="text-xs text-muted-foreground">
                  Example: MOSFET-ESP32-000001
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    Registering...
                  </>
                ) : (
                  "Register Device"
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* SUCCESS */}

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Device Registered
                </h2>

                <p className="text-sm text-muted-foreground">
                  Your ESP32 is now connected to your account.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* SERIAL */}

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">
                  Serial ID
                </p>

                <p className="mt-1 font-medium">
                  {success.serialId}
                </p>
              </div>

              {/* DEVICE ID */}

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">
                  Device ID
                </p>

                <p className="mt-1 font-medium">
                  {success.deviceId}
                </p>
              </div>

              {/* API KEY */}

              {success.apiKey && (
                <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Device API Key
                      </p>

                      <p className="mt-1 break-all font-mono text-xs">
                        {success.apiKey}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        copyApiKey
                      }
                      className="flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
                    >
                      <Copy className="h-4 w-4" />

                      Copy
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-yellow-700 dark:text-yellow-400">
                    Save this API key. It is used by the ESP32 to authenticate with MOSFET.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Link
                  href="/dashboard/devices"
                  className="flex-1 rounded-md border px-4 py-2.5 text-center text-sm font-medium hover:bg-muted"
                >
                  View Devices
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    setSuccess(null)
                  }
                  className="flex-1 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Register Another
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}