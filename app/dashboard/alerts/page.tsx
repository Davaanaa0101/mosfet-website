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
  Droplets,
  Gauge,
  RefreshCw,
  Server,
  Thermometer,
  Wifi,
} from "lucide-react";

import {
  Card,
  CardContent,
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
      setInterval(
        () => {
          loadAlerts(false);
        },
        10_000
      );

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
          (a, b) =>
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
          <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-100" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({
            length: 4,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-3xl bg-slate-100"
              />
            )
          )}
        </div>

        <div className="h-20 animate-pulse rounded-3xl bg-slate-100" />

        <div className="space-y-4">
          {Array.from({
            length: 3,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-3xl bg-slate-100"
              />
            )
          )}
        </div>
      </div>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="space-y-8">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Alerts
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Monitor sensor and device conditions.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            loadAlerts(false)
          }
          disabled={
            refreshing
          }
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-semibold
            text-slate-700
            shadow-sm
            transition-all
            hover:border-primary/30
            hover:bg-slate-50
            hover:text-primary
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
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

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
          "
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />

          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <SummaryCard
          title="Active Alerts"
          value={
            activeCount
          }
          description="Currently active"
          icon={
            <AlertTriangle className="h-5 w-5" />
          }
          iconClass="
            bg-red-50
            text-red-500
          "
          valueClass="text-red-600"
        />

        <SummaryCard
          title="Critical"
          value={
            criticalCount
          }
          description="Immediate attention"
          icon={
            <AlertTriangle className="h-5 w-5" />
          }
          iconClass="
            bg-red-50
            text-red-500
          "
          valueClass="text-red-600"
        />

        <SummaryCard
          title="Warnings"
          value={
            warningCount
          }
          description="Requires monitoring"
          icon={
            <Clock className="h-5 w-5" />
          }
          iconClass="
            bg-amber-50
            text-amber-500
          "
          valueClass="text-amber-600"
        />

        <SummaryCard
          title="Resolved"
          value={
            resolvedCount
          }
          description="Alert history"
          icon={
            <CheckCircle2 className="h-5 w-5" />
          }
          iconClass="
            bg-emerald-50
            text-emerald-500
          "
          valueClass="text-emerald-600"
        />

      </div>

      {/* ================================================= */}
      {/* FILTER BAR */}
      {/* ================================================= */}

      <Card
        className="
          rounded-3xl
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <CardContent className="p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <p className="text-sm font-bold text-slate-800">
                Alert History
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-600">
                  {
                    filteredAlerts.length
                  }
                </span>{" "}
                alert
                {filteredAlerts.length !==
                1
                  ? "s"
                  : ""}
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
                className="
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-slate-700
                  outline-none
                  transition
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/10
                "
              >
                <option value="active">
                  Active
                </option>

                <option value="resolved">
                  Resolved
                </option>

                <option value="all">
                  All Status
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
                className="
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-slate-700
                  outline-none
                  transition
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/10
                "
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

      {/* ================================================= */}
      {/* ALERT LIST */}
      {/* ================================================= */}

      {filteredAlerts.length ===
      0 ? (
        <Card
          className="
            rounded-3xl
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          <CardContent className="py-20">

            <div className="flex flex-col items-center justify-center text-center">

              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-emerald-50
                "
              >
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-800">
                No alerts
              </h2>

              <p className="mt-2 max-w-md text-sm text-slate-400">
                There are no alerts matching
                the current filters.
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
                alert={
                  alert
                }
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
  iconClass,
  valueClass,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  iconClass: string;
  valueClass: string;
}) {
  return (
    <Card
      className="
        rounded-3xl
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-md
      "
    >
      <CardContent className="p-5">

        <div className="flex items-start justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {title}
            </p>

            <p
              className={`
                mt-2
                text-3xl
                font-bold
                tracking-tight
                ${valueClass}
              `}
            >
              {value}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {description}
            </p>
          </div>

          <div
            className={`
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              ${iconClass}
            `}
          >
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

  const severity =
    getSeverityClass(
      alert.severity
    );

  const isActive =
    alert.status ===
    "active";

  return (
    <Card
      className={`
        overflow-hidden
        rounded-3xl
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:shadow-md
        ${
          isActive
            ? "border-red-200"
            : "border-emerald-200"
        }
      `}
    >
      <CardContent className="p-5 sm:p-6">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

          <div className="flex min-w-0 gap-4">

            {/* ICON */}

            <div
              className={`
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                ${severity}
              `}
            >
              {icon}
            </div>

            {/* CONTENT */}

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <h3 className="text-base font-bold text-slate-800">
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

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {alert.message}
              </p>

              {/* DEVICE INFO */}

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs">

                <span className="text-slate-400">
                  Device{" "}
                  <strong className="font-semibold text-slate-700">
                    {alert.deviceName ||
                      alert.deviceId}
                  </strong>
                </span>

                {alert.sensorName && (
                  <span className="text-slate-400">
                    Sensor{" "}
                    <strong className="font-semibold text-slate-700">
                      {
                        alert.sensorName
                      }
                    </strong>
                  </span>
                )}

                {typeof alert.slot ===
                  "number" && (
                  <span className="text-slate-400">
                    Slot{" "}
                    <strong className="font-semibold text-slate-700">
                      {
                        alert.slot
                      }
                    </strong>
                  </span>
                )}

              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* RIGHT */}
          {/* ================================================= */}

          <div
            className="
              flex
              shrink-0
              flex-row
              items-center
              justify-between
              gap-6
              border-t
              border-slate-100
              pt-4
              lg:min-w-[230px]
              lg:flex-col
              lg:items-end
              lg:border-t-0
              lg:pt-0
            "
          >

            {/* VALUE */}

            {typeof alert.value ===
              "number" && (
              <div className="text-left lg:text-right">

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Current value
                </p>

                <p className="mt-1 text-xl font-bold text-slate-800">
                  {formatNumber(
                    alert.value
                  )}{" "}
                  {alert.unit ||
                    ""}
                </p>

                {typeof alert.threshold ===
                  "number" && (
                  <p className="mt-1 text-xs text-slate-400">
                    Limit{" "}
                    <span className="font-semibold text-slate-600">
                      {formatNumber(
                        alert.threshold
                      )}{" "}
                      {alert.unit ||
                        ""}
                    </span>
                  </p>
                )}

              </div>
            )}

            {/* TIME */}

            <div className="flex items-center gap-2 text-xs text-slate-400">

              <Clock className="h-3.5 w-3.5" />

              <span>
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
              </span>

            </div>
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
      ? "bg-red-50 text-red-600 border-red-100"
      : severity ===
          "warning"
        ? "bg-amber-50 text-amber-600 border-amber-100"
        : "bg-blue-50 text-blue-600 border-blue-100";

  return (
    <span
      className={`
        rounded-full
        border
        px-2.5
        py-1
        text-[10px]
        font-bold
        uppercase
        tracking-wide
        ${classes}
      `}
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
  const active =
    status === "active";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        px-2.5
        py-1
        text-[10px]
        font-bold
        uppercase
        tracking-wide
        ${
          active
            ? "border-red-100 bg-red-50 text-red-600"
            : "border-emerald-100 bg-emerald-50 text-emerald-600"
        }
      `}
    >
      <span
        className={`
          h-1.5
          w-1.5
          rounded-full
          ${
            active
              ? "bg-red-500"
              : "bg-emerald-500"
          }
        `}
      />

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
      return "bg-red-50 text-red-500";

    case "warning":
      return "bg-amber-50 text-amber-500";

    default:
      return "bg-blue-50 text-blue-500";
  }
}

// =====================================================
// FORMAT NUMBER
// =====================================================

function formatNumber(
  value: number
) {
  if (
    Number.isInteger(
      value
    )
  ) {
    return String(
      value
    );
  }

  return value.toFixed(
    2
  );
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

  return date.toLocaleString(
    [],
    {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
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