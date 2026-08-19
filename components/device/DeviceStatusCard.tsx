"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TelemetryData {
  createdAt: string;

  temperature?: number;
  humidity?: number;
  voltage?: number;
  current?: number;
  power?: number;
  energy?: number;

  rssi?: number;
  freeHeap?: number;
  uptime?: number;

  wifiSSID?: string;
  ipAddress?: string;
}

interface TelemetryResponse {
  success: boolean;
  deviceId: string;
  data: TelemetryData[];
  error?: string;
}

interface Props {
  deviceId: string;
}

export default function DeviceStatusCard({
  deviceId,
}: Props) {
  const [latest, setLatest] =
    useState<TelemetryData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadTelemetry = useCallback(
    async () => {
      try {
        const response = await fetch(
          `/api/devices/${encodeURIComponent(
            deviceId
          )}/telemetry?limit=1`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load telemetry"
          );
        }

        const result =
          (await response.json()) as TelemetryResponse;

        if (!result.success) {
          throw new Error(
            result.error ||
              "Failed to load telemetry"
          );
        }

        const latestData =
          result.data?.[result.data.length - 1] ??
          null;

        setLatest(latestData);
        setError(null);
      } catch (err) {
        console.error(
          "[DeviceStatusCard]",
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

  useEffect(() => {
    loadTelemetry();

    const interval = setInterval(
      loadTelemetry,
      10000
    );

    return () => {
      clearInterval(interval);
    };
  }, [loadTelemetry]);

  if (loading) {
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

  if (error || !latest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Live Status
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error ||
              "No telemetry available."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Live Status
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Metric
            title="Temperature"
            value={
              latest.temperature != null
                ? `${latest.temperature.toFixed(
                    1
                  )} °C`
                : "--"
            }
          />

          <Metric
            title="Humidity"
            value={
              latest.humidity != null
                ? `${latest.humidity.toFixed(
                    1
                  )} %`
                : "--"
            }
          />

          <Metric
            title="Current"
            value={
              latest.current != null
                ? `${latest.current.toFixed(
                    2
                  )} A`
                : "--"
            }
          />

          <Metric
            title="Voltage"
            value={
              latest.voltage != null
                ? `${latest.voltage.toFixed(
                    1
                  )} V`
                : "--"
            }
          />

          <Metric
            title="Power"
            value={
              latest.power != null
                ? `${latest.power.toFixed(
                    1
                  )} W`
                : "--"
            }
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

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          <Metric
            title="Free Heap"
            value={
              latest.freeHeap != null
                ? `${(
                    latest.freeHeap / 1024
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
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          Last telemetry:{" "}
          {new Date(
            latest.createdAt
          ).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}

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

function formatUptime(
  seconds: number
): string {
  const totalSeconds =
    Math.max(0, Math.floor(seconds));

  const days = Math.floor(
    totalSeconds / 86400
  );

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
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