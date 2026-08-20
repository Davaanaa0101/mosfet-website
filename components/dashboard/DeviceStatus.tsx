"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircleOff,
  Cpu,
  Loader2,
  Radio,
  Server,
  ShieldAlert,
  WifiOff,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// =====================================================
// DEVICE STATUS
// =====================================================

type DeviceStatusType =
  | "NOT_REGISTERED"
  | "REGISTERED"
  | "RUNNING"
  | "WARNING"
  | "ERROR"
  | "OFFLINE";

// =====================================================
// DEVICE
// =====================================================

interface DeviceItem {
  _id?: string;

  deviceId: string;

  serialId?: string;

  deviceName: string;

  status: DeviceStatusType;

  ipAddress?: string;

  location?: string;

  type?: string;

  lastSeen?: string | null;

  registeredAt?: string | null;

  telemetry?: Record<string, unknown> | null;
}

// =====================================================
// API RESPONSE
// =====================================================

interface DashboardResponse {
  success: boolean;

  devices?: DeviceItem[];

  error?: string;
}

// =====================================================
// STATUS CONFIG
// =====================================================

const STATUS_CONFIG: Record<
  DeviceStatusType,
  {
    label: string;
    className: string;
    dotClass: string;
    icon: typeof Activity;
  }
> = {
  NOT_REGISTERED: {
    label: "Not Registered",

    className:
      "border-slate-200 bg-slate-50 text-slate-600",

    dotClass:
      "bg-slate-400",
      
    icon: CircleOff,
  },

  REGISTERED: {
    label: "Registered",

    className:
      "border-blue-200 bg-blue-50 text-blue-700",

    dotClass:
      "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]",

    icon: CheckCircle2,
  },

  RUNNING: {
    label: "Running",

    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    dotClass:
      "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]",

    icon: Activity,
  },

  WARNING: {
    label: "Warning",

    className:
      "border-amber-200 bg-amber-50 text-amber-700",

    dotClass:
      "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]",

    icon: AlertTriangle,
  },

  ERROR: {
    label: "Error",

    className:
      "border-red-200 bg-red-50 text-red-700",

    dotClass:
      "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]",

    icon: ShieldAlert,
  },

  OFFLINE: {
    label: "Offline",

    className:
      "border-slate-200 bg-slate-100 text-slate-600",

    dotClass:
      "bg-slate-400",

    icon: WifiOff,
  },
};

// =====================================================
// COMPONENT
// =====================================================

export default function DeviceStatus() {
  const [devices, setDevices] =
    useState<DeviceItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // =====================================================
  // LOAD DEVICES
  // =====================================================

  const loadDevices =
    useCallback(async () => {
      try {
        const response =
          await fetch(
            "/api/dashboard/summary",
            {
              cache: "no-store",
            }
          );

        const result =
          (await response.json()) as DashboardResponse;

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.error ||
              "Failed to load devices"
          );
        }

        setDevices(
          result.devices ?? []
        );

        setError(null);
      } catch (err) {
        console.error(
          "[DeviceStatus]",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load devices"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  // =====================================================
  // INITIAL LOAD + AUTO REFRESH
  // =====================================================

  useEffect(() => {
    loadDevices();

    const interval =
      setInterval(
        loadDevices,
        10_000
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, [loadDevices]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Card
      className="
        overflow-hidden
        rounded-3xl
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <CardHeader
        className="
          border-b
          border-slate-100
          px-6
          py-5
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
          "
        >
          <div>
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                "
              >
                <Server
                  className="
                    h-4
                    w-4
                    text-blue-600
                  "
                />
              </div>

              <CardTitle
                className="
                  text-base
                  font-bold
                  text-slate-900
                "
              >
                Device Status
              </CardTitle>
            </div>

            <p
              className="
                mt-2
                text-xs
                text-slate-400
              "
            >
              Live device connection status
            </p>
          </div>

          {/* Live indicator */}

          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-emerald-200
              bg-emerald-50
              px-3
              py-1.5
              text-[11px]
              font-semibold
              text-emerald-700
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                animate-pulse
                rounded-full
                bg-emerald-500
              "
            />

            Live
          </div>
        </div>
      </CardHeader>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <CardContent className="p-0">
        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading && (
          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              px-6
              py-12
              text-sm
              text-slate-500
            "
          >
            <Loader2
              className="
                h-4
                w-4
                animate-spin
                text-blue-500
              "
            />

            Loading devices...
          </div>
        )}

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {!loading && error && (
          <div className="px-6 py-8">
            <div
              className="
                flex
                items-start
                gap-3
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-4
              "
            >
              <ShieldAlert
                className="
                  mt-0.5
                  h-5
                  w-5
                  shrink-0
                  text-red-500
                "
              />

              <div>
                <p
                  className="
                    text-sm
                    font-semibold
                    text-red-700
                  "
                >
                  Unable to load devices
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-red-600
                  "
                >
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* EMPTY */}
        {/* ================================================= */}

        {!loading &&
          !error &&
          devices.length === 0 && (
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                px-6
                py-12
                text-center
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-100
                "
              >
                <Cpu
                  className="
                    h-5
                    w-5
                    text-slate-400
                  "
                />
              </div>

              <p
                className="
                  mt-4
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                No devices registered
              </p>

              <p
                className="
                  mt-1
                  max-w-xs
                  text-xs
                  leading-5
                  text-slate-400
                "
              >
                Register an ESP32 device
                to start monitoring telemetry.
              </p>
            </div>
          )}

        {/* ================================================= */}
        {/* DEVICE LIST */}
        {/* ================================================= */}

        {!loading &&
          !error &&
          devices.length > 0 && (
            <div>
              {devices.map(
                (device, index) => {
                  const status =
                    STATUS_CONFIG[
                      device.status
                    ] ??
                    STATUS_CONFIG.OFFLINE;

                  const StatusIcon =
                    status.icon;

                  return (
                    <Link
                      key={
                        device.deviceId
                      }
                      href={`/devices/${encodeURIComponent(
                        device.deviceId
                      )}`}
                      className="
                        group
                        block
                        border-b
                        border-slate-100
                        last:border-b-0
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          px-6
                          py-4
                          transition-colors
                          duration-200
                          group-hover:bg-slate-50
                        "
                      >
                        {/* DEVICE INFO */}

                        <div
                          className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                          "
                        >
                          {/* Device icon */}

                          <div
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              border
                              border-slate-200
                              bg-slate-50
                              transition-all
                              duration-200
                              group-hover:border-blue-200
                              group-hover:bg-blue-50
                            "
                          >
                            <Radio
                              className="
                                h-4
                                w-4
                                text-slate-500
                                group-hover:text-blue-600
                              "
                            />
                          </div>

                          {/* Text */}

                          <div className="min-w-0">
                            <p
                              className="
                                truncate
                                text-sm
                                font-semibold
                                text-slate-800
                              "
                            >
                              {
                                device.deviceName
                              }
                            </p>

                            <div
                              className="
                                mt-1
                                flex
                                flex-wrap
                                items-center
                                gap-x-2
                                gap-y-1
                              "
                            >
                              <span
                                className="
                                  font-mono
                                  text-[11px]
                                  text-slate-400
                                "
                              >
                                {
                                  device.deviceId
                                }
                              </span>

                              {device.location && (
                                <>
                                  <span className="text-slate-300">
                                    •
                                  </span>

                                  <span
                                    className="
                                      max-w-[140px]
                                      truncate
                                      text-[11px]
                                      text-slate-400
                                    "
                                  >
                                    {
                                      device.location
                                    }
                                  </span>
                                </>
                              )}
                            </div>

                            {/* SERIAL */}

                            {device.serialId && (
                              <p
                                className="
                                  mt-1
                                  truncate
                                  font-mono
                                  text-[10px]
                                  text-slate-300
                                "
                              >
                                S/N{" "}
                                {
                                  device.serialId
                                }
                              </p>
                            )}
                          </div>
                        </div>

                        {/* STATUS */}

                        <div
                          className="
                            flex
                            shrink-0
                            items-center
                            gap-2
                          "
                        >
                          <span
                            className={`
                              hidden
                              items-center
                              gap-1.5
                              rounded-full
                              border
                              px-2.5
                              py-1.5
                              text-[11px]
                              font-semibold
                              sm:inline-flex
                              ${status.className}
                            `}
                          >
                            <span
                              className={`
                                h-1.5
                                w-1.5
                                rounded-full
                                ${status.dotClass}
                              `}
                            />

                            <StatusIcon
                              className="
                                h-3.5
                                w-3.5
                              "
                            />

                            {
                              status.label
                            }
                          </span>

                          {/* Mobile status */}

                          <span
                            className={`
                              h-2
                              w-2
                              rounded-full
                              sm:hidden
                              ${status.dotClass}
                            `}
                            title={
                              status.label
                            }
                          />

                          <span
                            className="
                              hidden
                              text-slate-300
                              transition-transform
                              duration-200
                              group-hover:translate-x-1
                              sm:inline
                            "
                          >
                            →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          )}
      </CardContent>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      {!loading &&
        !error &&
        devices.length > 0 && (
          <div
            className="
              flex
              items-center
              justify-between
              border-t
              border-slate-100
              bg-slate-50/50
              px-6
              py-3
            "
          >
            <span
              className="
                text-[11px]
                text-slate-400
              "
            >
              {devices.length}{" "}
              {devices.length === 1
                ? "device"
                : "devices"}
            </span>

            <div
              className="
                flex
                items-center
                gap-1.5
                text-[11px]
                text-slate-400
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-emerald-500
                "
              />

              Refreshes every 10s
            </div>
          </div>
        )}
    </Card>
  );
}