"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Cpu,
  KeyRound,
  Loader2,
  Radio,
  ShieldCheck,
  Wifi,
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

  const [copied, setCopied] =
    useState(false);

  // =====================================================
  // REGISTER DEVICE
  // =====================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);
    setSuccess(null);
    setCopied(false);

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

  // =====================================================
  // COPY API KEY
  // =====================================================

  async function copyApiKey() {
    if (!success?.apiKey) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        success.apiKey
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy API key",
        error
      );
    }
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div className="flex items-start gap-4">
        <Link
          href="/dashboard/devices"
          className="
            mt-1
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            bg-card
            text-muted-foreground
            shadow-sm
            transition-all
            duration-200
            hover:-translate-x-0.5
            hover:border-primary/40
            hover:bg-primary/5
            hover:text-primary
          "
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Device Management
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Register Device
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Connect an ESP32 device to your
            MOSFET Smart Building account.
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      {!success ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* ================================================= */}
          {/* REGISTRATION CARD */}
          {/* ================================================= */}

          <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            {/* Card header */}

            <div className="relative overflow-hidden border-b px-6 py-8 md:px-8">
              {/* Background */}

              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />

              <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

              <div
                className="absolute inset-0 opacity-20"
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

              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <Cpu className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    Device Registration
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Enter the Serial ID printed
                    on your ESP32 device to
                    connect it to MOSFET.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}

            <div className="p-6 md:p-8">
              {/* ERROR */}

              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                  <div className="mt-0.5 rounded-full bg-destructive/10 p-1.5">
                    <ShieldCheck className="h-4 w-4 text-destructive" />
                  </div>

                  <div>
                    <p className="font-medium text-destructive">
                      Registration failed
                    </p>

                    <p className="mt-1 text-sm text-destructive/80">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              <form
                onSubmit={
                  handleSubmit
                }
                className="space-y-6"
              >
                {/* SERIAL ID */}

                <div className="space-y-2">
                  <label
                    htmlFor="serialId"
                    className="text-sm font-semibold"
                  >
                    Device Serial ID
                  </label>

                  <div className="relative">
                    <Cpu className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="serialId"
                      value={
                        serialId
                      }
                      onChange={(
                        event
                      ) =>
                        setSerialId(
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="MOSFET-ESP32-000001"
                      disabled={
                        loading
                      }
                      autoComplete="off"
                      className="
                        h-14
                        w-full
                        rounded-xl
                        border
                        border-border
                        bg-background
                        pl-12
                        pr-4
                        font-mono
                        text-sm
                        outline-none
                        transition-all
                        duration-200
                        placeholder:font-sans
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

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Radio className="h-3.5 w-3.5" />

                    <span>
                      Example:
                    </span>

                    <code className="rounded-md bg-muted px-2 py-1 font-mono">
                      MOSFET-ESP32-000001
                    </code>
                  </div>
                </div>

                {/* INFORMATION */}

                <div className="rounded-2xl border bg-muted/20 p-4">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <ClipboardCheck className="h-4 w-4 text-primary" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Before registering
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Make sure the Serial ID
                        matches the ID configured
                        on your ESP32 device.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !serialId.trim()
                  }
                  className="
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-primary
                    px-4
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
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />

                      Registering Device...
                    </>
                  ) : (
                    <>
                      <Cpu className="h-4 w-4" />

                      Register Device
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ================================================= */}
          {/* SIDE INFORMATION */}
          {/* ================================================= */}

          <div className="space-y-6">
            {/* How it works */}

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <h3 className="font-bold">
                How it works
              </h3>

              <div className="mt-6 space-y-5">
                <Step
                  number="01"
                  icon={Cpu}
                  title="Enter Serial ID"
                  description="Use the Serial ID assigned to your ESP32."
                />

                <Step
                  number="02"
                  icon={ShieldCheck}
                  title="Verify Device"
                  description="MOSFET verifies the device registration."
                />

                <Step
                  number="03"
                  icon={Wifi}
                  title="Connect"
                  description="The device can begin sending telemetry."
                />
              </div>
            </div>

            {/* Security */}

            <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <KeyRound className="h-5 w-5" />
              </div>

              <h3 className="mt-4 font-semibold">
                Secure Device Access
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                After registration, your device
                may receive a unique API key for
                authenticated communication with
                the MOSFET platform.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ================================================= */
        /* SUCCESS */
        /* ================================================= */

        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            {/* Success header */}

            <div className="relative overflow-hidden border-b px-6 py-10 text-center md:px-8">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent" />

              <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

              <div className="relative">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-8 ring-emerald-500/5">
                  <CheckCircle2 className="h-9 w-9" />
                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  Device Registered
                </h2>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                  Your ESP32 has been successfully
                  registered and connected to your
                  MOSFET account.
                </p>
              </div>
            </div>

            <div className="space-y-6 p-6 md:p-8">
              {/* DEVICE SUMMARY */}

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoBox
                  label="Device Name"
                  value={
                    success.name ||
                    "ESP32 Device"
                  }
                />

                <InfoBox
                  label="Device ID"
                  value={
                    success.deviceId
                  }
                  mono
                />

                <InfoBox
                  label="Serial ID"
                  value={
                    success.serialId
                  }
                  mono
                />

                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                      <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                    </span>

                    <span className="font-semibold text-emerald-600">
                      Registered
                    </span>
                  </div>
                </div>
              </div>

              {/* API KEY */}

              {success.apiKey && (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                      <KeyRound className="h-5 w-5 text-amber-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold">
                            Device API Key
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Use this key to authenticate
                            your ESP32.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={
                            copyApiKey
                          }
                          className="
                            inline-flex
                            shrink-0
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            bg-background
                            px-4
                            py-2
                            text-sm
                            font-medium
                            transition-all
                            hover:border-primary/40
                            hover:bg-primary/5
                            hover:text-primary
                          "
                        >
                          {copied ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />

                              Copy
                            </>
                          )}
                        </button>
                      </div>

                      <div className="mt-4 rounded-xl border bg-background p-3">
                        <code className="block break-all font-mono text-xs leading-6">
                          {
                            success.apiKey
                          }
                        </code>
                      </div>

                      <div className="mt-4 flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                        <p className="text-xs leading-5 text-amber-700 dark:text-amber-400">
                          Save this API key securely.
                          It is used by the ESP32
                          to authenticate with
                          MOSFET.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIONS */}

              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <Link
                  href="/dashboard/devices"
                  className="
                    flex
                    h-12
                    items-center
                    justify-center
                    rounded-xl
                    border
                    bg-background
                    px-4
                    text-sm
                    font-semibold
                    transition-all
                    hover:border-primary/40
                    hover:bg-primary/5
                    hover:text-primary
                  "
                >
                  View Devices
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSuccess(
                      null
                    );
                    setError(
                      null
                    );
                    setCopied(
                      false
                    );
                  }}
                  className="
                    flex
                    h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-primary
                    px-4
                    text-sm
                    font-semibold
                    text-primary-foreground
                    shadow-lg
                    shadow-primary/20
                    transition-all
                    hover:-translate-y-0.5
                    hover:shadow-xl
                  "
                >
                  <Cpu className="h-4 w-4" />

                  Register Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================
// STEP COMPONENT
// =====================================================

function Step({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: string;
  icon: typeof Cpu;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-primary">
            {number}
          </span>

          <p className="text-sm font-semibold">
            {title}
          </p>
        </div>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

// =====================================================
// INFO BOX
// =====================================================

function InfoBox({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-muted/20 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      <p
        className={`mt-2 break-all text-sm font-semibold ${
          mono
            ? "font-mono"
            : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}