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

interface Activity {
  _id?: string;

  deviceId: string;

  deviceName?: string;

  temperature?: number;

  humidity?: number;

  current?: number;

  voltage?: number;

  power?: number;

  createdAt: string;
}

interface SummaryResponse {
  success?: boolean;

  recentActivity?: Activity[];

  error?: string;
}

// =====================================================
// TIME
// =====================================================

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
    return "Unknown time";
  }

  return date.toLocaleString();
}

// =====================================================
// VALUE
// =====================================================

function formatValue(
  value:
    | number
    | undefined,
  unit: string,
  decimals = 1
): string {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return "--";
  }

  return `${value.toFixed(
    decimals
  )} ${unit}`;
}

// =====================================================
// COMPONENT
// =====================================================

export default function RecentActivity() {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ===================================================
  // LOAD
  // ===================================================

  const loadActivity =
    useCallback(
      async () => {
        try {
          const response =
            await fetch(
              "/api/dashboard/summary",
              {
                cache: "no-store",
              }
            );

          if (!response.ok) {
            throw new Error(
              "Failed to load recent activity"
            );
          }

          const result =
            (await response.json()) as SummaryResponse;

          if (
            result.success ===
            false
          ) {
            throw new Error(
              result.error ||
                "Failed to load activity"
            );
          }

          setActivities(
            result.recentActivity ??
              []
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

  // ===================================================
  // REFRESH
  // ===================================================

  useEffect(() => {
    loadActivity();

    const interval =
      setInterval(
        loadActivity,
        10000
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, [loadActivity]);

  // ===================================================
  // RENDER
  // ===================================================

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
          activities.length ===
            0 && (
            <p className="text-sm text-muted-foreground">
              No recent activity.
            </p>
          )}

        {!loading &&
          !error &&
          activities.length >
            0 && (
            <div className="space-y-3">
              {activities.map(
                (
                  activity,
                  index
                ) => (
                  <div
                    key={
                      activity._id ||
                      `${activity.deviceId}-${activity.createdAt}-${index}`
                    }
                    className="border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        {/* DEVICE NAME */}

                        <p className="truncate text-sm font-medium">
                          {activity.deviceName ||
                            activity.deviceId}
                        </p>

                        {/* DEVICE ID */}

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {
                            activity.deviceId
                          }
                        </p>

                        {/* VALUES */}

                        <p className="mt-2 text-sm text-muted-foreground">
                          Temperature{" "}
                          {formatValue(
                            activity.temperature,
                            "°C"
                          )}

                          {" · "}

                          Humidity{" "}
                          {formatValue(
                            activity.humidity,
                            "%"
                          )}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Current{" "}
                          {formatValue(
                            activity.current,
                            "A",
                            2
                          )}

                          {" · "}

                          Power{" "}
                          {formatValue(
                            activity.power,
                            "W"
                          )}
                        </p>
                      </div>

                      {/* TIME */}

                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatTime(
                          activity.createdAt
                        )}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
      </CardContent>
    </Card>
  );
}