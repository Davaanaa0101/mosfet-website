"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Activity {
  _id?: string;
  deviceId: string;

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

function formatTime(
  timestamp: string
): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return date.toLocaleString();
}

function formatValue(
  value: number | undefined,
  unit: string
): string {
  if (typeof value !== "number") {
    return "--";
  }

  return `${value.toFixed(1)} ${unit}`;
}

export default function RecentActivity() {
  const [activities, setActivities] =
    useState<Activity[]>([]);

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

        if (!response.ok) {
          throw new Error(
            "Failed to load recent activity"
          );
        }

        const result =
          (await response.json()) as SummaryResponse;

        if (result.error) {
          throw new Error(result.error);
        }

        setActivities(
          result.recentActivity ?? []
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

        {!loading && error && (
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
                (activity, index) => (
                  <div
                    key={
                      activity._id ||
                      `${activity.deviceId}-${activity.createdAt}-${index}`
                    }
                    className="border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">
                          {activity.deviceId}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
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
                            "A"
                          )}
                        </p>
                      </div>

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