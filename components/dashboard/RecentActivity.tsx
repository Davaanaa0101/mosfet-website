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

type DeviceStatus =
  | "NOT_REGISTERED"
  | "REGISTERED"
  | "RUNNING"
  | "WARNING"
  | "ERROR"
  | "OFFLINE";

interface Activity {
  _id?: string;
  deviceId: string;
  createdAt: string;

  temperature?: number;
  humidity?: number;
  current?: number;
  voltage?: number;
  power?: number;
  energy?: number;
  rssi?: number;
}

interface Device {
  deviceId: string;
  deviceName: string;
  status: DeviceStatus;
}

interface DashboardResponse {
  success: boolean;
  recentActivity?: Activity[];
  devices?: Device[];
  error?: string;
}

export default function RecentActivity() {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [devices, setDevices] =
    useState<Device[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadActivity = useCallback(
    async () => {
      try {
        const response = await fetch(
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
              "Failed to load activity"
          );
        }

        setActivities(
          result.recentActivity ?? []
        );

        setDevices(
          result.devices ?? []
        );

        setError(null);
      } catch (err) {
        console.error(
          "[RecentActivity]",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load activity"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadActivity();

    const interval = setInterval(
      loadActivity,
      10000
    );

    return () => {
      clearInterval(interval);
    };
  }, [loadActivity]);

  const getDeviceStatus = (
    deviceId: string
  ): DeviceStatus => {
    const device =
      devices.find(
        (item) =>
          item.deviceId ===
          deviceId
      );

    return (
      device?.status ??
      "OFFLINE"
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Recent Activity
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading && (
          <p className="text-sm text-muted-foreground">
            Loading activity...
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
          activities.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No recent activity.
            </p>
          )}

        {!loading &&
          !error &&
          activities.length > 0 && (
            <div className="space-y-3">
              {activities.map(
                (
                  activity,
                  index
                ) => {
                  const status =
                    getDeviceStatus(
                      activity.deviceId
                    );

                  return (
                    <div
                      key={
                        activity._id ??
                        `${activity.deviceId}-${activity.createdAt}-${index}`
                      }
                      className="rounded-lg border p-3"
                    >
                      {/* HEADER */}

                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">
                            {
                              activity.deviceId
                            }
                          </p>

                          <p className="text-xs text-muted-foreground">
                            Telemetry
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <StatusBadge
                            status={
                              status
                            }
                          />

                          <span className="text-xs text-muted-foreground">
                            {formatTime(
                              activity.createdAt
                            )}
                          </span>
                        </div>
                      </div>

                      {/* TELEMETRY */}

                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                        <Telemetry
                          label="Temperature"
                          value={formatValue(
                            activity.temperature,
                            1,
                            "°C"
                          )}
                        />

                        <Telemetry
                          label="Humidity"
                          value={formatValue(
                            activity.humidity,
                            1,
                            "%"
                          )}
                        />

                        <Telemetry
                          label="Current"
                          value={formatValue(
                            activity.current,
                            2,
                            "A"
                          )}
                        />

                        <Telemetry
                          label="Voltage"
                          value={formatValue(
                            activity.voltage,
                            1,
                            "V"
                          )}
                        />

                        <Telemetry
                          label="Power"
                          value={formatValue(
                            activity.power,
                            1,
                            "W"
                          )}
                        />

                        <Telemetry
                          label="RSSI"
                          value={formatValue(
                            activity.rssi,
                            0,
                            "dBm"
                          )}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
      </CardContent>
    </Card>
  );
}

interface TelemetryProps {
  label: string;
  value: string;
}

function Telemetry({
  label,
  value,
}: TelemetryProps) {
  return (
    <div className="rounded-md bg-muted/40 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}

interface StatusBadgeProps {
  status: DeviceStatus;
}

function StatusBadge({
  status,
}: StatusBadgeProps) {
  let label = "Offline";

  let className =
    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";

  if (status === "RUNNING") {
    label = "Running";

    className =
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";
  } else if (
    status === "WARNING"
  ) {
    label = "Warning";

    className =
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400";
  } else if (
    status === "ERROR"
  ) {
    label = "Error";

    className =
      "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";
  } else if (
    status === "REGISTERED"
  ) {
    label = "Registered";

    className =
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400";
  } else if (
    status ===
    "NOT_REGISTERED"
  ) {
    label = "Not Registered";

    className =
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${className}`}
    >
      {label}
    </span>
  );
}

function formatValue(
  value: number | undefined,
  decimals: number,
  unit: string
): string {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(value)
  ) {
    return "--";
  }

  return `${value.toFixed(
    decimals
  )} ${unit}`;
}

function formatTime(
  timestamp: string
): string {
  const date =
    new Date(timestamp);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "--";
  }

  return date.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}