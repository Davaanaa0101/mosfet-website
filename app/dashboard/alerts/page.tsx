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

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  WifiOff,
} from "lucide-react";

// =====================================================
// TYPES
// =====================================================

interface AlertItem {
  _id: string;

  deviceId: string;

  deviceName?: string;

  type: string;

  status:
    | "active"
    | "resolved";

  title: string;

  message: string;

  severity:
    | "critical"
    | "warning"
    | "info";

  slot?: number;

  sensorType?: string;

  sensorName?: string;

  value?: number | null;

  threshold?: number | null;

  unit?: string;

  triggeredAt: string;

  resolvedAt?: string;
}

interface AlertsResponse {
  success: boolean;

  stats: {
    active: number;
    resolved: number;
    total: number;
  };

  data: AlertItem[];

  error?: string;
}

// =====================================================
// PAGE
// =====================================================

export default function AlertsPage() {
  const [alerts, setAlerts] =
    useState<AlertItem[]>([]);

  const [stats, setStats] =
    useState({
      active: 0,
      resolved: 0,
      total: 0,
    });

  const [filter, setFilter] =
    useState<
      "all" | "active" | "resolved"
    >("active");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  // ===================================================
  // LOAD
  // ===================================================

  const loadAlerts =
    useCallback(
      async () => {
        try {
          const query =
            filter === "all"
              ? ""
              : `?status=${filter}`;

          const response =
            await fetch(
              `/api/alerts${query}`,
              {
                cache: "no-store",
                headers: {
                  Accept:
                    "application/json",
                },
              }
            );

          const result =
            (await response.json()) as AlertsResponse;

          if (!response.ok) {
            throw new Error(
              result.error ||
                "Failed to load alerts"
            );
          }

          if (
            !result.success
          ) {
            throw new Error(
              result.error ||
                "Failed to load alerts"
            );
          }

          setAlerts(
            result.data || []
          );

          setStats(
            result.stats || {
              active: 0,
              resolved: 0,
              total: 0,
            }
          );

          setError(null);
        } catch (err) {
          console.error(
            "[AlertsPage]",
            err
          );

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load alerts"
          );
        } finally {
          setLoading(false);
        }
      },
      [filter]
    );

  // ===================================================
  // INITIAL + REFRESH
  // ===================================================

  useEffect(() => {
    setLoading(true);

    loadAlerts();

    const interval =
      setInterval(
        loadAlerts,
        10000
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, [loadAlerts]);

  // ===================================================
  // RESOLVE
  // ===================================================

  async function resolveAlert(
    id: string
  ) {
    try {
      const response =
        await fetch(
          `/api/alerts/${id}`,
          {
            method: "PATCH",
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ||
            "Failed to resolve alert"
        );
      }

      await loadAlerts();
    } catch (err) {
      console.error(
        "[AlertsPage] resolve",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to resolve alert"
      );
    }
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          Alerts
        </h1>

        <p className="mt-1 text-muted-foreground">
          Monitor device and sensor alerts.
        </p>
      </div>

      {/* STATS */}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Active Alerts"
          value={stats.active}
          icon={
            <AlertCircle className="h-5 w-5" />
          }
          danger
        />

        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={
            <CheckCircle2 className="h-5 w-5" />
          }
        />

        <StatCard
          title="Total Alerts"
          value={stats.total}
          icon={
            <Clock className="h-5 w-5" />
          }
        />
      </div>

      {/* ALERT LIST */}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>
              Alert History
            </CardTitle>

            <div className="flex gap-2">
              <FilterButton
                active={
                  filter === "active"
                }
                onClick={() =>
                  setFilter("active")
                }
              >
                Active
              </FilterButton>

              <FilterButton
                active={
                  filter === "resolved"
                }
                onClick={() =>
                  setFilter(
                    "resolved"
                  )
                }
              >
                Resolved
              </FilterButton>

              <FilterButton
                active={
                  filter === "all"
                }
                onClick={() =>
                  setFilter("all")
                }
              >
                All
              </FilterButton>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading alerts...
            </p>
          )}

          {!loading &&
            error && (
              <p className="py-8 text-center text-sm text-destructive">
                {error}
              </p>
            )}

          {!loading &&
            !error &&
            alerts.length ===
              0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-10 w-10 text-muted-foreground" />

                <p className="mt-3 font-medium">
                  No alerts
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Everything looks good.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            alerts.length >
              0 && (
              <div className="space-y-3">
                {alerts.map(
                  (alert) => (
                    <AlertRow
                      key={
                        alert._id
                      }
                      alert={alert}
                      onResolve={
                        resolveAlert
                      }
                    />
                  )
                )}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  title,
  value,
  icon,
  danger = false,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <p
            className={[
              "mt-2 text-3xl font-bold",
              danger &&
                value > 0
                ? "text-destructive"
                : "",
            ].join(" ")}
          >
            {value}
          </p>
        </div>

        <div className="rounded-lg bg-muted p-3">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// FILTER BUTTON
// =====================================================

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-background hover:bg-muted",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// =====================================================
// ALERT ROW
// =====================================================

function AlertRow({
  alert,
  onResolve,
}: {
  alert: AlertItem;
  onResolve: (
    id: string
  ) => void;
}) {
  const critical =
    alert.severity ===
    "critical";

  const warning =
    alert.severity ===
    "warning";

  return (
    <div className="rounded-lg border p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          <div
            className={[
              "mt-0.5 rounded-full p-2",
              critical
                ? "bg-destructive/10 text-destructive"
                : warning
                ? "bg-yellow-500/10 text-yellow-600"
                : "bg-muted text-muted-foreground",
            ].join(" ")}
          >
            {alert.type ===
            "DEVICE_OFFLINE" ? (
              <WifiOff className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">
                {alert.title}
              </h3>

              <span
                className={[
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  critical
                    ? "bg-destructive/10 text-destructive"
                    : warning
                    ? "bg-yellow-500/10 text-yellow-700"
                    : "bg-muted text-muted-foreground",
                ].join(" ")}
              >
                {alert.severity}
              </span>

              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                {alert.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              {alert.message}
            </p>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>
                Device:{" "}
                {alert.deviceName ||
                  alert.deviceId}
              </span>

              {alert.sensorName && (
                <span>
                  Sensor:{" "}
                  {alert.sensorName}
                </span>
              )}

              {alert.value !=
                null && (
                <span>
                  Value:{" "}
                  {alert.value}{" "}
                  {alert.unit}
                </span>
              )}

              <span>
                {new Date(
                  alert.triggeredAt
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {alert.status ===
          "active" && (
          <button
            type="button"
            onClick={() =>
              onResolve(
                alert._id
              )
            }
            className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted"
          >
            Resolve
          </button>
        )}
      </div>
    </div>
  );
}