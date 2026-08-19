"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Telemetry {
  deviceId: string;

  temperature?: number;
  humidity?: number;
  current?: number;
  voltage?: number;
  power?: number;
  rssi?: number;

  createdAt: string;
}

interface SummaryResponse {
  success?: boolean;
  devices?: Array<{
    deviceId: string;
    deviceName?: string;
    status?: string;
    telemetry?: Telemetry | null;
  }>;
  error?: string;
}

export default function LatestTelemetry() {
  const [devices, setDevices] = useState<
    SummaryResponse["devices"]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadTelemetry = useCallback(
    async () => {
      try {
        const response = await fetch(
          "/api/dashboard/summary",
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
          (await response.json()) as SummaryResponse;

        if (result.error) {
          throw new Error(result.error);
        }

        setDevices(
          result.devices ?? []
        );

        setError(null);
      } catch (err) {
        console.error(
          "[LatestTelemetry]",
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
    []
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Latest Telemetry
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading && (
          <p className="text-sm text-muted-foreground">
            Loading telemetry...
          </p>
        )}

        {!loading && error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          (!devices ||
            devices.length === 0) && (
            <p className="text-sm text-muted-foreground">
              No telemetry available.
            </p>
          )}

        {!loading &&
          !error &&
          devices &&
          devices.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {devices.map((device) => {
                const telemetry =
                  device.telemetry;

                return (
                  <div
                    key={device.deviceId}
                    className="rounded-lg border p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {device.deviceName ||
                            device.deviceId}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {device.deviceId}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          device.status ===
                          "online"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {device.status ||
                          "unknown"}
                      </span>
                    </div>

                    {telemetry ? (
                      <div className="grid grid-cols-2 gap-3">
                        <Metric
                          title="Temperature"
                          value={
                            telemetry.temperature !=
                            null
                              ? `${telemetry.temperature.toFixed(
                                  1
                                )} °C`
                              : "--"
                          }
                        />

                        <Metric
                          title="Humidity"
                          value={
                            telemetry.humidity !=
                            null
                              ? `${telemetry.humidity.toFixed(
                                  1
                                )} %`
                              : "--"
                          }
                        />

                        <Metric
                          title="Current"
                          value={
                            telemetry.current !=
                            null
                              ? `${telemetry.current.toFixed(
                                  2
                                )} A`
                              : "--"
                          }
                        />

                        <Metric
                          title="RSSI"
                          value={
                            telemetry.rssi !=
                            null
                              ? `${telemetry.rssi} dBm`
                              : "--"
                          }
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No telemetry received.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
    <div className="rounded-md bg-muted/50 p-3">
      <p className="text-xs text-muted-foreground">
        {title}
      </p>

      <p className="mt-1 text-lg font-semibold">
        {value}
      </p>
    </div>
  );
}