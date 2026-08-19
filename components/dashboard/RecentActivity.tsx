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
  createdAt: string;

  temperature?: number;
  humidity?: number;
  current?: number;
  voltage?: number;
  power?: number;
}

interface DashboardResponse {
  success: boolean;
  recentActivity?: Activity[];
  error?: string;
}

export default function RecentActivity() {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadActivity =
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

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              "Failed to load activity"
          );
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
    }, []);

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

        <ul className="space-y-3">
          {activities.map(
            (activity, index) => (
              <li
                key={
                  activity._id ||
                  `${activity.deviceId}-${activity.createdAt}-${index}`
                }
                className="border-b pb-3 last:border-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">
                      {
                        activity.deviceId
                      }
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatActivity(
                        activity
                      )}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatTime(
                      activity.createdAt
                    )}
                  </span>
                </div>
              </li>
            )
          )}
        </ul>
      </CardContent>
    </Card>
  );
}

function formatActivity(
  activity: Activity
): string {
  if (
    activity.temperature !==
    undefined
  ) {
    return `Temperature ${activity.temperature.toFixed(
      1
    )} °C`;
  }

  if (
    activity.humidity !==
    undefined
  ) {
    return `Humidity ${activity.humidity.toFixed(
      1
    )} %`;
  }

  if (
    activity.current !==
    undefined
  ) {
    return `Current ${activity.current.toFixed(
      2
    )} A`;
  }

  if (
    activity.voltage !==
    undefined
  ) {
    return `Voltage ${activity.voltage.toFixed(
      1
    )} V`;
  }

  if (
    activity.power !==
    undefined
  ) {
    return `Power ${activity.power.toFixed(
      1
    )} W`;
  }

  return "Telemetry received";
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