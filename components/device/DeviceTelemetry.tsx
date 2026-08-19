"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import TelemetryChart from "@/components/device/TelemetryChart";

// =====================================================
// TYPES
// =====================================================

interface TelemetryData {
  createdAt: string;

  temperature?: number | null;

  humidity?: number | null;

  voltage?: number | null;

  current?: number | null;

  power?: number | null;

  energy?: number | null;
}

interface TelemetryResponse {
  success: boolean;

  deviceId: string;

  deviceName?: string;

  range?: string;

  count?: number;

  data: TelemetryData[];

  error?: string;
}

type Range =
  | "1h"
  | "6h"
  | "24h"
  | "7d"
  | "30d";

// =====================================================
// PROPS
// =====================================================

interface Props {
  deviceId: string;
}

// =====================================================
// RANGE OPTIONS
// =====================================================

const RANGE_OPTIONS: {
  value: Range;
  label: string;
}[] = [
  {
    value: "1h",
    label: "1H",
  },
  {
    value: "6h",
    label: "6H",
  },
  {
    value: "24h",
    label: "24H",
  },
  {
    value: "7d",
    label: "7D",
  },
  {
    value: "30d",
    label: "30D",
  },
];

// =====================================================
// COMPONENT
// =====================================================

export default function DeviceTelemetry({
  deviceId,
}: Props) {
  const [range, setRange] =
    useState<Range>("24h");

  const [data, setData] =
    useState<TelemetryData[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ===================================================
  // LOAD TELEMETRY
  // ===================================================

  const loadTelemetry =
    useCallback(
      async () => {
        try {
          const response =
            await fetch(
              `/api/devices/${encodeURIComponent(
                deviceId
              )}/telemetry?range=${range}&limit=1000`,
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
            (await response.json()) as TelemetryResponse;

          if (!response.ok) {
            throw new Error(
              result.error ||
                "Failed to load telemetry"
            );
          }

          if (
            !result.success
          ) {
            throw new Error(
              result.error ||
                "Failed to load telemetry"
            );
          }

          setData(
            result.data ?? []
          );

          setError(null);
        } catch (err) {
          console.error(
            "[DeviceTelemetry]",
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
      [deviceId, range]
    );

  // ===================================================
  // LOAD + AUTO REFRESH
  // ===================================================

  useEffect(() => {
    setLoading(true);

    loadTelemetry();

    const interval =
      setInterval(
        loadTelemetry,
        10000
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, [
    loadTelemetry,
  ]);

  // ===================================================
  // CHART DATA
  // ===================================================

  const chartData =
    useMemo(() => {
      return data.map(
        (item) => ({
          ...item,

          time: formatChartTime(
            item.createdAt,
            range
          ),
        })
      );
    }, [data, range]);

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="space-y-6">
      {/* =========================================== */}
      {/* HEADER */}
      {/* =========================================== */}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>
                Historical Telemetry
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Device sensor history
              </p>
            </div>

            {/* RANGE SELECTOR */}

            <div className="flex flex-wrap gap-2">
              {RANGE_OPTIONS.map(
                (option) => {
                  const active =
                    range ===
                    option.value;

                  return (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      onClick={() =>
                        setRange(
                          option.value
                        )
                      }
                      className={[
                        "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-muted",
                      ].join(" ")}
                    >
                      {
                        option.label
                      }
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading &&
            data.length ===
              0 && (
              <p className="text-sm text-muted-foreground">
                Loading telemetry...
              </p>
            )}

          {!loading &&
            error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}

          {!loading &&
            !error &&
            data.length ===
              0 && (
              <p className="text-sm text-muted-foreground">
                No telemetry data available for this period.
              </p>
            )}

          {data.length >
            0 && (
            <p className="text-xs text-muted-foreground">
              {data.length} telemetry
              records ·{" "}
              {range.toUpperCase()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* =========================================== */}
      {/* TEMPERATURE */}
      {/* =========================================== */}

      <TelemetryChart
        title="Temperature"
        data={chartData}
        dataKey="temperature"
        unit="°C"
      />

      {/* =========================================== */}
      {/* HUMIDITY */}
      {/* =========================================== */}

      <TelemetryChart
        title="Humidity"
        data={chartData}
        dataKey="humidity"
        unit="%"
      />

      {/* =========================================== */}
      {/* CURRENT */}
      {/* =========================================== */}

      <TelemetryChart
        title="Current"
        data={chartData}
        dataKey="current"
        unit="A"
      />

      {/* =========================================== */}
      {/* VOLTAGE */}
      {/* =========================================== */}

      <TelemetryChart
        title="Voltage"
        data={chartData}
        dataKey="voltage"
        unit="V"
      />

      {/* =========================================== */}
      {/* POWER */}
      {/* =========================================== */}

      <TelemetryChart
        title="Power"
        data={chartData}
        dataKey="power"
        unit="W"
      />
    </div>
  );
}

// =====================================================
// CHART TIME
// =====================================================

function formatChartTime(
  timestamp: string,
  range: Range
): string {
  const date =
    new Date(timestamp);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  if (
    range === "1h" ||
    range === "6h"
  ) {
    return date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  if (
    range === "24h"
  ) {
    return date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  return date.toLocaleDateString(
    [],
    {
      month: "short",
      day: "numeric",
    }
  );
}