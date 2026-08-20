"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  Cpu,
  Gauge,
  HardDrive,
  MapPin,
  MemoryStick,
  Network,
  Radio,
  Thermometer,
  Timer,
  Wifi,
  Zap,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

// =====================================================
// TELEMETRY TYPES
// =====================================================

interface TelemetryData {
  _id?: string;

  deviceId?: string;

  createdAt: string;

  temperature?: number | null;
  humidity?: number | null;

  voltage?: number | null;
  current?: number | null;
  power?: number | null;
  energy?: number | null;

  rssi?: number | null;

  freeHeap?: number | null;
  uptime?: number | null;

  wifiSSID?: string | null;
  ipAddress?: string | null;
}

// =====================================================
// API RESPONSE
// =====================================================

interface TelemetryResponse {
  success: boolean;

  deviceId: string;

  data: TelemetryData[];

  error?: string;
}

// =====================================================
// PROPS
// =====================================================

interface Props {
  deviceId: string;
}

// =====================================================
// TELEMETRY FRESHNESS
// =====================================================

function getTelemetryState(
  createdAt: string
): {
  label: string;
  dot: string;
  badge: string;
  isLive: boolean;
} {
  const timestamp =
    new Date(createdAt).getTime();

  if (Number.isNaN(timestamp)) {
    return {
      label: "Unknown",
      dot: "bg-slate-400",
      badge:
        "border-slate-200 bg-slate-50 text-slate-600",
      isLive: false,
    };
  }

  const age =
    Date.now() - timestamp;

  // Less than 30 seconds
  if (age <= 30_000) {
    return {
      label: "Live",
      dot: "bg-emerald-500",
      badge:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
      isLive: true,
    };
  }

  // Less than 2 minutes
  if (age <= 120_000) {
    return {
      label: "Delayed",
      dot: "bg-amber-500",
      badge:
        "border-amber-200 bg-amber-50 text-amber-700",
      isLive: false,
    };
  }

  return {
    label: "Offline",
    dot: "bg-red-500",
    badge:
      "border-red-200 bg-red-50 text-red-700",
    isLive: false,
  };
}

// =====================================================
// COMPONENT
// =====================================================

export default function DeviceStatusCard({
  deviceId,
}: Props) {
  const [latest, setLatest] =
    useState<TelemetryData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ===================================================
  // LOAD LATEST TELEMETRY
  // ===================================================

  const loadTelemetry =
    useCallback(
      async () => {
        try {
          const response =
            await fetch(
              `/api/devices/${encodeURIComponent(
                deviceId
              )}/telemetry?limit=1`,
              {
                method: "GET",

                cache: "no-store",

                headers: {
                  Accept:
                    "application/json",
                },
              }
            );

          const result =
            (await response.json()) as
              | TelemetryResponse
              | {
                  success?: false;
                  error?: string;
                };

          if (!response.ok) {
            throw new Error(
              "error" in result &&
              result.error
                ? result.error
                : `Failed to load telemetry (${response.status})`
            );
          }

          if (
            !("success" in result) ||
            !result.success
          ) {
            throw new Error(
              "error" in result &&
              result.error
                ? result.error
                : "Failed to load telemetry"
            );
          }

          const telemetry =
            result.data ?? [];

          const newest =
            telemetry.length > 0
              ? telemetry[
                  telemetry.length - 1
                ]
              : null;

          setLatest(newest);
          setError(null);
        } catch (err) {
          console.error(
            "[DeviceStatusCard] telemetry error:",
            err
          );

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load telemetry"
          );
        } finally {
          setLoading(false);
        }
      },
      [deviceId]
    );

  // ===================================================
  // INITIAL LOAD + AUTO REFRESH
  // ===================================================

  useEffect(() => {
    loadTelemetry();

    const interval =
      setInterval(
        loadTelemetry,
        10_000
      );

    return () => {
      clearInterval(interval);
    };
  }, [loadTelemetry]);

  // ===================================================
  // TELEMETRY STATUS
  // ===================================================

  const telemetryStatus =
    useMemo(() => {
      if (!latest) {
        return {
          label: "Offline",
          dot: "bg-slate-400",
          badge:
            "border-slate-200 bg-slate-50 text-slate-600",
          isLive: false,
        };
      }

      return getTelemetryState(
        latest.createdAt
      );
    }, [latest]);

  // ===================================================
  // LOADING
  // ===================================================

  if (
    loading &&
    !latest
  ) {
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
        <div className="p-6">
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                h-10
                w-10
                animate-pulse
                rounded-xl
                bg-slate-100
              "
            />

            <div className="space-y-2">
              <div
                className="
                  h-4
                  w-32
                  animate-pulse
                  rounded
                  bg-slate-100
                "
              />

              <div
                className="
                  h-3
                  w-48
                  animate-pulse
                  rounded
                  bg-slate-100
                "
              />
            </div>
          </div>

          <div
            className="
              mt-6
              grid
              grid-cols-2
              gap-3
              md:grid-cols-3
              lg:grid-cols-6
            "
          >
            {Array.from({
              length: 6,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="
                    h-24
                    animate-pulse
                    rounded-2xl
                    bg-slate-50
                  "
                />
              )
            )}
          </div>
        </div>
      </Card>
    );
  }

  // ===================================================
  // NO DATA
  // ===================================================

  if (!latest) {
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
        <CardContent className="p-6">
          <div
            className="
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-5
            "
          >
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-slate-200
              "
            >
              <Radio
                className="
                  h-5
                  w-5
                  text-slate-500
                "
              />
            </div>

            <div>
              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                No telemetry available
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-400
                "
              >
                {error ||
                  "This device has not sent telemetry yet."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ===================================================
  // LIVE DATA
  // ===================================================

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

      <div
        className="
          relative
          overflow-hidden
          border-b
          border-slate-100
          p-5
          sm:p-6
        "
      >
        {/* Background glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-24
            h-56
            w-56
            rounded-full
            bg-primary/5
            blur-3xl
          "
        />

        <div
          className="
            relative
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* TITLE */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-primary/10
              "
            >
              <Activity
                className="
                  h-5
                  w-5
                  text-primary
                "
              />
            </div>

            <div>
              <h2
                className="
                  text-base
                  font-bold
                  text-slate-900
                "
              >
                Live Telemetry
              </h2>

              <p
                className="
                  mt-0.5
                  font-mono
                  text-[10px]
                  text-slate-400
                "
              >
                {deviceId}
              </p>
            </div>
          </div>

          {/* STATUS */}

          <div
            className={`
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              px-3
              py-1.5
              text-[11px]
              font-bold
              ${telemetryStatus.badge}
            `}
          >
            <span className="relative flex h-2 w-2">
              {telemetryStatus.isLive && (
                <span
                  className={`
                    absolute
                    inline-flex
                    h-full
                    w-full
                    animate-ping
                    rounded-full
                    opacity-50
                    ${telemetryStatus.dot}
                  `}
                />
              )}

              <span
                className={`
                  relative
                  h-2
                  w-2
                  rounded-full
                  ${telemetryStatus.dot}
                `}
              />
            </span>

            {telemetryStatus.label}
          </div>
        </div>
      </div>

      <CardContent className="p-5 sm:p-6">
        {/* ================================================= */}
        {/* MAIN METRICS */}
        {/* ================================================= */}

        <div
          className="
            grid
            grid-cols-2
            gap-3
            md:grid-cols-3
            lg:grid-cols-6
          "
        >
          <Metric
            title="Temperature"
            value={formatNumber(
              latest.temperature,
              "°C",
              1
            )}
            icon={Thermometer}
            accent="orange"
          />

          <Metric
            title="Humidity"
            value={formatNumber(
              latest.humidity,
              "%",
              1
            )}
            icon={Activity}
            accent="blue"
          />

          <Metric
            title="Current"
            value={formatNumber(
              latest.current,
              "A",
              2
            )}
            icon={Zap}
            accent="yellow"
          />

          <Metric
            title="Voltage"
            value={formatNumber(
              latest.voltage,
              "V",
              1
            )}
            icon={Activity}
            accent="purple"
          />

          <Metric
            title="Power"
            value={formatNumber(
              latest.power,
              "W",
              1
            )}
            icon={Gauge}
            accent="emerald"
          />

          <Metric
            title="RSSI"
            value={
              latest.rssi != null
                ? `${latest.rssi} dBm`
                : "--"
            }
            icon={Wifi}
            accent="cyan"
          />
        </div>

        {/* ================================================= */}
        {/* SYSTEM INFORMATION */}
        {/* ================================================= */}

        <div className="mt-6">
          <div
            className="
              mb-3
              flex
              items-center
              gap-2
            "
          >
            <Cpu
              className="
                h-4
                w-4
                text-slate-400
              "
            />

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-widest
                text-slate-400
              "
            >
              System Information
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-3
              md:grid-cols-4
            "
          >
            <SystemMetric
              title="Free Heap"
              value={
                latest.freeHeap !=
                null
                  ? `${(
                      latest.freeHeap /
                      1024
                    ).toFixed(1)} KB`
                  : "--"
              }
              icon={MemoryStick}
            />

            <SystemMetric
              title="Uptime"
              value={
                latest.uptime !=
                null
                  ? formatUptime(
                      latest.uptime
                    )
                  : "--"
              }
              icon={Timer}
            />

            <SystemMetric
              title="Wi-Fi"
              value={
                latest.wifiSSID ||
                "--"
              }
              icon={Wifi}
            />

            <SystemMetric
              title="IP Address"
              value={
                latest.ipAddress ||
                "--"
              }
              icon={Network}
              mono
            />
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div
          className="
            mt-5
            flex
            flex-col
            gap-2
            border-t
            border-slate-100
            pt-4
            text-[10px]
            text-slate-400
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <span>
            Last telemetry:{" "}
            <span
              className="
                font-medium
                text-slate-500
              "
            >
              {formatDate(
                latest.createdAt
              )}
            </span>
          </span>

          {error && (
            <span
              className="
                font-medium
                text-amber-600
              "
            >
              Temporary connection issue
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// METRIC
// =====================================================

function Metric({
  title,
  value,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  icon: typeof Activity;
  accent:
    | "orange"
    | "blue"
    | "yellow"
    | "purple"
    | "emerald"
    | "cyan";
}) {
  const accentClasses = {
    orange:
      "bg-orange-50 text-orange-500",
    blue:
      "bg-blue-50 text-blue-500",
    yellow:
      "bg-yellow-50 text-yellow-500",
    purple:
      "bg-purple-50 text-purple-500",
    emerald:
      "bg-emerald-50 text-emerald-500",
    cyan:
      "bg-cyan-50 text-cyan-500",
  };

  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-slate-100
        bg-white
        p-4
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-slate-200
        hover:shadow-sm
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-2
        "
      >
        <p
          className="
            text-[10px]
            font-semibold
            text-slate-400
          "
        >
          {title}
        </p>

        <div
          className={`
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-lg
            ${accentClasses[accent]}
          `}
        >
          <Icon
            className="
              h-3.5
              w-3.5
            "
          />
        </div>
      </div>

      <p
        className="
          mt-3
          truncate
          text-lg
          font-bold
          tracking-tight
          text-slate-800
        "
      >
        {value}
      </p>
    </div>
  );
}

// =====================================================
// SYSTEM METRIC
// =====================================================

function SystemMetric({
  title,
  value,
  icon: Icon,
  mono = false,
}: {
  title: string;
  value: string;
  icon: typeof Cpu;
  mono?: boolean;
}) {
  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-3
        rounded-xl
        bg-slate-50
        px-3
        py-3
      "
    >
      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-white
          shadow-sm
        "
      >
        <Icon
          className="
            h-3.5
            w-3.5
            text-slate-400
          "
        />
      </div>

      <div className="min-w-0">
        <p
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-wide
            text-slate-400
          "
        >
          {title}
        </p>

        <p
          className={`
            mt-0.5
            truncate
            text-xs
            font-semibold
            text-slate-600
            ${
              mono
                ? "font-mono"
                : ""
            }
          `}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// =====================================================
// FORMAT NUMBER
// =====================================================

function formatNumber(
  value:
    | number
    | null
    | undefined,
  unit: string,
  decimals: number
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "--";
  }

  return `${value.toFixed(
    decimals
  )} ${unit}`;
}

// =====================================================
// FORMAT UPTIME
// =====================================================

function formatUptime(
  seconds: number
): string {
  if (
    !Number.isFinite(seconds)
  ) {
    return "--";
  }

  const totalSeconds =
    Math.max(
      0,
      Math.floor(seconds)
    );

  const days =
    Math.floor(
      totalSeconds /
        86400
    );

  const hours =
    Math.floor(
      (totalSeconds %
        86400) /
        3600
    );

  const minutes =
    Math.floor(
      (totalSeconds %
        3600) /
        60
    );

  const secs =
    totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }

  return `${secs}s`;
}

// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(
  value: string
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "--";
  }

  return date.toLocaleString(
    [],
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  );
}