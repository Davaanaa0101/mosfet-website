"use client";

import { useEffect, useState } from "react";

import TelemetryChart, {
  TelemetryChartData,
} from "@/components/charts/TelemetryChart";

interface DeviceTelemetryProps {
  deviceId: string;
}

interface TelemetryResponse {
  success: boolean;
  deviceId: string;
  data: TelemetryChartData[];
  error?: string;
}

export default function DeviceTelemetry({
  deviceId,
}: DeviceTelemetryProps) {
  const [data, setData] = useState<
    TelemetryChartData[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  async function loadTelemetry() {
    try {
      const response = await fetch(
        `/api/devices/${encodeURIComponent(
          deviceId
        )}/telemetry?limit=100`,
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

      setData(result.data);
      setError(null);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load telemetry"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTelemetry();

    // ESP32 currently sends every 10 seconds.
    // Refresh dashboard every 10 seconds.
    const interval = setInterval(
      loadTelemetry,
      10000
    );

    return () => {
      clearInterval(interval);
    };
  }, [deviceId]);

  if (loading) {
    return (
      <div className="rounded-xl border p-6">
        <p className="text-muted-foreground">
          Loading telemetry...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive p-6">
        <p className="font-medium text-destructive">
          Failed to load telemetry
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TelemetryChart
        title="Temperature"
        data={data}
        dataKey="temperature"
        unit="°C"
      />

      <TelemetryChart
        title="Humidity"
        data={data}
        dataKey="humidity"
        unit="%"
      />

      <TelemetryChart
        title="Current"
        data={data}
        dataKey="current"
        unit="A"
      />
    </div>
  );
}