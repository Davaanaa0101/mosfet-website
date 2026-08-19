"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Thermometer,
  Droplets,
  Gauge,
  Wifi,
  Server,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// =====================================================
// TYPES
// =====================================================

type AlertStatus =
  | "active"
  | "resolved";

type AlertSeverity =
  | "critical"
  | "warning"
  | "info";

type AlertType =
  | "DEVICE_OFFLINE"
  | "HIGH_TEMPERATURE"
  | "LOW_TEMPERATURE"
  | "HIGH_HUMIDITY"
  | "LOW_HUMIDITY"
  | "HIGH_CURRENT"
  | "LOW_RSSI";

interface AlertItem {
  _id: string;

  deviceId: string;

  deviceName?: string;

  type: AlertType;

  title: string;

  message: string;

  severity: AlertSeverity;

  status: AlertStatus;

  slot?: number;

  sensorType?: string;

  sensorName?: string;

  value?: number | null;

  threshold?: number | null;

  unit?: string;

  triggeredAt: string;

  resolvedAt?: string | null;

  createdAt?: string;
}

interface AlertsResponse {
  success: boolean;

  data?: AlertItem[];

  alerts?: AlertItem[];

  error?: string;
}

// =====================================================
// PAGE
// =====================================================

export default function AlertsPage() {
  const [alerts, setAlerts] =
    useState<AlertItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [statusFilter, setStatusFilter] =
    useState<
      "all" | AlertStatus
    >("active");

  const [severityFilter, setSeverityFilter] =
    useState<
      "all" | AlertSeverity
    >("all");

  // ===================================================
  // LOAD ALERTS
  // ===================================================

  const loadAlerts =
    useCallback(
      async (
        showLoading = false
      ) => {
        try {
          if (showLoading) {
            setLoading(true);
          } else {
            setRefreshing(true);
          }

          const response =
            await fetch(
              "/api/alerts",
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

          const alertData =
            result.data ??
            result.alerts ??
            [];

          setAlerts(
            alertData
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
          setRefreshing(false);
        }
      },
      []
    );

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadAlerts(true);
  }, [loadAlerts]);

  // ===================================================
  // AUTO REFRESH
  // ===================================================

  useEffect(() => {
    const interval =
      setInterval(() => {
        loadAlerts(false);
      }, 10000);

    return () => {
      clearInterval(
        interval
      );
    };
  }, [loadAlerts]);

  // ===================================================
  // FILTER
  // ===================================================

  const filteredAlerts =
    useMemo(() => {
      return alerts
        .filter((alert) => {
          if (
            statusFilter ===
            "all"
          ) {
            return true;
          }

          return (
            alert.status ===
            statusFilter
          );
        })
        .filter((alert) => {
          if (
            severityFilter ===
            "all"
          ) {
            return true;
          }

          return (
            alert.severity ===
            severityFilter
          );
        })
        .sort(
          (
            a,
            b
          ) =>
            new Date(
              b.triggeredAt
            ).getTime() -
            new Date(
              a.triggeredAt
            ).getTime()
        );
    }, [
      alerts,
      statusFilter,
      severityFilter,
    ]);

  // ===================================================
  // COUNTS
  // ===================================================

  const activeCount =
    alerts.filter(
      (alert) =>
        alert.status ===
        "active"
    ).length;

  const criticalCount =
    alerts.filter(
      (alert) =>
        alert.status ===
          "active" &&
        alert.severity ===
          "critical"
    ).length;

  const warningCount =
    alerts.filter(
      (alert) =>
        alert.status ===
          "active" &&
        alert.severity ===
          "warning"
    ).length;

  const resolvedCount =
    alerts.filter(
      (alert) =>
        alert.status ===
        "resolved"
    ).length;

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Alerts
          </h1>

          <p className="mt-1 text-muted-foreground">
            Monitor sensor and device alerts.
          </p>
        </div>

        <Card>
          <CardContent className="py-12">
            <p className="text-center text-sm text-muted-foreground">
              Loading alerts...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="space-y-8">
      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Alerts
          </h1>

          <p className="mt-1 text-muted-foreground">
            Monitor sensor and device conditions.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            loadAlerts(false)
          }
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              refreshing
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh
        </button>
      </div>

      {/* ============================================= */}
      {/* ERROR */}
      {/* ============================================= */}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            {error}
          </p>
        </div>
      )}

      {/* ============================================= */}
      {/* SUMMARY */}
      {/* ============================================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Active Alerts"
          value={activeCount}
          icon={
            <AlertTriangle className="h-5 w-5" />
          }
          description="Currently active"
        />

        <SummaryCard
          title="Critical"
          value={criticalCount}
          icon={
            <AlertTriangle className="h-5 w-5" />
          }
          description="Immediate attention"
        />

        <SummaryCard
          title="Warnings"
          value={warningCount}
          icon={
            <Clock className="h-5 w-5" />
          }
          description="Requires monitoring"
        />

        <SummaryCard
          title="Resolved"
          value={resolvedCount}
          icon={
            <CheckCircle2 className="h-5 w-5" />
          }
          description="Alert history"
        />
      </div>

      {/* ============================================= */}
      {/* FILTERS */}
      {/* ============================================= */}

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-medium">
                Alert History
              </p>

              <p className="text-sm text-muted-foreground">
                Showing{" "}
                {
                  filteredAlerts.length
                }{" "}
                alerts
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* STATUS */}

              <select
                value={
                  statusFilter
                }
                onChange={(
                  event
                ) =>
                  setStatusFilter(
                    event.target
                      .value as
                      | "all"
                      | AlertStatus
                  )
                }
                className="rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="active">
                  Active
                </option>

                <option value="resolved">
                  Resolved
                </option>

                <option value="all">
                  All
                </option>
              </select>

              {/* SEVERITY */}

              <select
                value={
                  severityFilter
                }
                onChange={(
                  event
                ) =>
                  setSeverityFilter(
                    event.target
                      .value as
                      | "all"
                      | AlertSeverity
                  )
                }
                className="rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="all">
                  All Severity
                </option>

                <option value="critical">
                  Critical
                </option>

                <option value="warning">
                  Warning
                </option>

                <option value="info">
                  Info
                </option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================= */}
      {/* ALERT LIST */}
      {/* ============================================= */}

      {filteredAlerts.length ===
      0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="mb-4 h-12 w-12 text-green-500" />

              <h2 className="text-lg font-semibold">
                No alerts
              </h2>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                There are no alerts matching the current filters.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map(
            (alert) => (
              <AlertCard
                key={
                  alert._id
                }
                alert={alert}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;

  value: number;

  description: string;

  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {title}
            </p>

            <p className="mt-1 text-3xl font-bold">
              {value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="rounded-lg border p-3">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// ALERT CARD
// =====================================================

function AlertCard({
  alert,
}: {
  alert: AlertItem;
}) {
  const icon =
    getAlertIcon(
      alert.type
    );

  const severityClass =
    getSeverityClass(
      alert.severity
    );

  const statusClass =
    alert.status ===
    "active"
      ? "border-red-500/30"
      : "border-green-500/30";

  return (
    <Card
      className={`border ${statusClass}`}
    >
      <CardContent className="p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* ========================================= */}
          {/* LEFT */}
          {/* ========================================= */}

          <div className="flex min-w-0 gap-4">
            <div
              className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${severityClass}`}
            >
              {icon}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">
                  {alert.title}
                </h3>

                <SeverityBadge
                  severity={
                    alert.severity
                  }
                />

                <StatusBadge
                  status={
                    alert.status
                  }
                />
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {alert.message}
              </p>

              {/* DEVICE */}

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span>
                  Device:{" "}
                  <strong className="font-medium text-foreground">
                    {alert.deviceName ||
                      alert.deviceId}
                  </strong>
                </span>

                {alert.sensorName && (
                  <span>
                    Sensor:{" "}
                    <strong className="font-medium text-foreground">
                      {
                        alert.sensorName
                      }
                    </strong>
                  </span>
                )}

                {typeof alert.slot ===
                  "number" && (
                  <span>
                    Slot:{" "}
                    <strong className="font-medium text-foreground">
                      {
                        alert.slot
                      }
                    </strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ========================================= */}
          {/* RIGHT */}
          {/* ========================================= */}

          <div className="flex shrink-0 flex-col gap-2 lg:items-end">
            {/* VALUE */}

            {typeof alert.value ===
              "number" && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  Current value
                </p>

                <p className="text-lg font-semibold">
                  {formatNumber(
                    alert.value
                  )}{" "}
                  {alert.unit ||
                    ""}
                </p>
              </div>
            )}

            {/* THRESHOLD */}

            {typeof alert.threshold ===
              "number" && (
              <p className="text-xs text-muted-foreground">
                Threshold:{" "}
                <span className="font-medium text-foreground">
                  {formatNumber(
                    alert.threshold
                  )}{" "}
                  {alert.unit ||
                    ""}
                </span>
              </p>
            )}

            {/* TIME */}

            <p className="text-xs text-muted-foreground">
              {alert.status ===
              "resolved"
                ? "Resolved"
                : "Triggered"}{" "}
              {formatDate(
                alert.status ===
                  "resolved" &&
                  alert.resolvedAt
                  ? alert.resolvedAt
                  : alert.triggeredAt
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// SEVERITY BADGE
// =====================================================

function SeverityBadge({
  severity,
}: {
  severity: AlertSeverity;
}) {
  const classes =
    severity ===
    "critical"
      ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
      : severity ===
        "warning"
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
      : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      {capitalize(
        severity
      )}
    </span>
  );
}

// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({
  status,
}: {
  status: AlertStatus;
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        status === "active"
          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
          : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
      }`}
    >
      {capitalize(
        status
      )}
    </span>
  );
}

// =====================================================
// ALERT ICON
// =====================================================

function getAlertIcon(
  type: AlertType
) {
  switch (type) {
    case "HIGH_TEMPERATURE":
    case "LOW_TEMPERATURE":
      return (
        <Thermometer className="h-5 w-5" />
      );

    case "HIGH_HUMIDITY":
    case "LOW_HUMIDITY":
      return (
        <Droplets className="h-5 w-5" />
      );

    case "HIGH_CURRENT":
      return (
        <Gauge className="h-5 w-5" />
      );

    case "LOW_RSSI":
      return (
        <Wifi className="h-5 w-5" />
      );

    case "DEVICE_OFFLINE":
      return (
        <Server className="h-5 w-5" />
      );

    default:
      return (
        <AlertTriangle className="h-5 w-5" />
      );
  }
}

// =====================================================
// SEVERITY COLOR
// =====================================================

function getSeverityClass(
  severity: AlertSeverity
) {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";

    case "warning":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400";

    default:
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400";
  }
}

// =====================================================
// FORMAT NUMBER
// =====================================================

function formatNumber(
  value: number
) {
  if (
    Number.isInteger(value)
  ) {
    return String(value);
  }

  return value.toFixed(2);
}

// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(
  value?: string | null
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleString();
}

// =====================================================
// CAPITALIZE
// =====================================================

function capitalize(
  value: string
) {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}