"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
// COMPONENT
// =====================================================

export default function DeviceStatusCard({
  deviceId,
}: Props) {
  const [latest, setLatest] =
    useState<TelemetryData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ===================================================
  // LOAD LATEST TELEMETRY
  // ===================================================

  const loadTelemetry = useCallback(
    async () => {
      try {
        const response = await fetch(
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

        // -------------------------------------------
        // GET NEWEST RECORD
        // -------------------------------------------

        const telemetry =
          result.data ?? [];

        const newest =
          telemetry.length > 0
            ? telemetry[
                telemetry.length - 1
              ]
            : null;

        // -------------------------------------------
        // UPDATE STATE
        // -------------------------------------------

        setLatest(newest);

        setError(null);
      } catch (err) {
        console.error(
          "[DeviceStatusCard] telemetry error:",
          err
        );

        // -------------------------------------------
        // DON'T DESTROY PREVIOUS DATA
        // -------------------------------------------

        if (!latest) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load telemetry"
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [deviceId, latest]
  );

  // ===================================================
  // INITIAL LOAD + AUTO REFRESH
  // ===================================================

  useEffect(() => {
    loadTelemetry();

    const interval =
      setInterval(
        loadTelemetry,
        10000
      );

    return () => {
      clearInterval(interval);
    };
  }, [loadTelemetry]);

  // ===================================================
  // LOADING
  // ===================================================

  if (
    loading &&
    !latest
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Live Status
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Loading telemetry...
          </p>
        </CardContent>
      </Card>
    );
  }

  // ===================================================
  // ERROR / NO DATA
  // ===================================================

  if (
    !latest
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Live Status
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-destructive">
            {error ||
              "No telemetry available."}
          </p>
        </CardContent>
      </Card>
    );
  }

  // ===================================================
  // LIVE DATA
  // ===================================================

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Live Status
        </CardTitle>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          Online
        </span>
      </CardHeader>

      <CardContent>
        {/* ----------------------------------------- */}
        {/* MAIN METRICS */}
        {/* ----------------------------------------- */}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Metric
            title="Temperature"
            value={formatNumber(
              latest.temperature,
              "°C",
              1
            )}
          />

          <Metric
            title="Humidity"
            value={formatNumber(
              latest.humidity,
              "%",
              1
            )}
          />

          <Metric
            title="Current"
            value={formatNumber(
              latest.current,
              "A",
              2
            )}
          />

          <Metric
            title="Voltage"
            value={formatNumber(
              latest.voltage,
              "V",
              1
            )}
          />

          <Metric
            title="Power"
            value={formatNumber(
              latest.power,
              "W",
              1
            )}
          />

          <Metric
            title="RSSI"
            value={
              latest.rssi != null
                ? `${latest.rssi} dBm`
                : "--"
            }
          />
        </div>

        {/* ----------------------------------------- */}
        {/* SYSTEM INFORMATION */}
        {/* ----------------------------------------- */}

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          <Metric
            title="Free Heap"
            value={
              latest.freeHeap != null
                ? `${(
                    latest.freeHeap /
                    1024
                  ).toFixed(1)} KB`
                : "--"
            }
          />

          <Metric
            title="Uptime"
            value={
              latest.uptime != null
                ? formatUptime(
                    latest.uptime
                  )
                : "--"
            }
          />

          <Metric
            title="Wi-Fi"
            value={
              latest.wifiSSID ||
              "--"
            }
          />

          <Metric
            title="IP Address"
            value={
              latest.ipAddress ||
              "--"
            }
          />
        </div>

        {/* ----------------------------------------- */}
        {/* LAST UPDATE */}
        {/* ----------------------------------------- */}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            Last telemetry:{" "}
            {formatDate(
              latest.createdAt
            )}
          </span>

          {error && (
            <span className="text-yellow-600">
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
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-muted-foreground">
        {title}
      </div>

      <div className="mt-1 break-words text-xl font-semibold">
        {value}
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
      totalSeconds / 86400
    );

  const hours =
    Math.floor(
      (totalSeconds % 86400) /
        3600
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) /
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

  return date.toLocaleString();
}