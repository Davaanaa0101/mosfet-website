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

// =====================================================
// ACTIVITY
// =====================================================

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

  ipAddress?: string;
}

// =====================================================
// DEVICE
// =====================================================

interface DeviceItem {
  deviceId: string;

  deviceName: string;

  status: DeviceStatus;

  ipAddress?: string;

  lastSeen?: string | null;
}

// =====================================================
// API RESPONSE
// =====================================================

interface DashboardResponse {
  success: boolean;

  recentActivity?: Activity[];

  devices?: DeviceItem[];

  error?: string;
}

// =====================================================
// COMPONENT
// =====================================================

export default function RecentActivity() {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [devices, setDevices] =
    useState<DeviceItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // =====================================================
  // LOAD ACTIVITY
  // =====================================================

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
    }, []);

  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {
    loadActivity();

    const interval =
      setInterval(
        loadActivity,
        10_000
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, [loadActivity]);

  // =====================================================
  // DEVICE STATUS MAP
  // =====================================================

  const deviceStatusMap =
    useMemo(() => {
      const map =
        new Map<
          string,
          DeviceStatus
        >();

      for (const device of devices) {
        map.set(
          device.deviceId,
          device.status
        );
      }

      return map;
    }, [devices]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Recent Activity
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* ================================================
            LOADING
        ================================================= */}

        {loading && (
          <p className="text-sm text-muted-foreground">
            Loading activity...
          </p>
        )}

        {/* ================================================
            ERROR
        ================================================= */}

        {!loading &&
          error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

        {/* ================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          activities.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No recent activity.
            </p>
          )}

        {/* ================================================
            ACTIVITY LIST
        ================================================= */}

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
                    deviceStatusMap.get(
                      activity.deviceId
                    ) ??
                    "OFFLINE";

                  return (
                    <div
                      key={
                        activity._id ||
                        `${activity.deviceId}-${activity.createdAt}-${index}`
                      }
                      className="rounded-lg border p-3"
                    >
                      {/* =================================
                          HEADER
                      ================================== */}

                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {
                              activity.deviceId
                            }
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* STATUS */}

                          <StatusBadge
                            status={
                              status
                            }
                          />

                          {/* TIME */}

                          <span className="text-xs text-muted-foreground">
                            {formatTime(
                              activity.createdAt
                            )}
                          </span>
                        </div>
                      </div>

                      {/* =================================
                          TELEMETRY GRID
                      ================================== */}

                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                        {/* TEMPERATURE */}

                        <TelemetryItem
                          label="Temperature"
                          value={
                            formatNumber(
                              activity.temperature,
                              1,
                              "°C"
                            )
                          }
                        />

                        {/* HUMIDITY */}

                        <TelemetryItem
                          label="Humidity"
                          value={
                            formatNumber(
                              activity.humidity,
                              1,
                              "%"
                            )
                          }
                        />

                        {/* CURRENT */}

                        <TelemetryItem
                          label="Current"
                          value={
                            formatNumber(
                              activity.current,
                              2,
                              "A"
                            )
                          }
                        />

                        {/* VOLTAGE */}

                        <TelemetryItem
                          label="Voltage"
                          value={
                            formatNumber(
                              activity.voltage,
                              1,
                              "V"
                            )
                          }
                        />

                        {/* POWER */}

                        <TelemetryItem
                          label="Power"
                          value={
                            formatNumber(
                              activity.power,
                              1,
                              "W"
                            )
                          }
                        />

                        {/* RSSI */}

                        <TelemetryItem
                          label="RSSI"
                          value={
                            formatNumber(
                              activity.rssi,
                              0,
                              "dBm"
                            )
                          }
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

// =====================================================
// TELEMETRY ITEM
// =====================================================

interface TelemetryItemProps {
  label: string;

  value: string;
}

function TelemetryItem({
  label,
  value,
}: TelemetryItemProps) {
  return (
    <div className="rounded-md bg-muted/40 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-0.5 text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

// =====================================================
// STATUS BADGE
// =====================================================

interface StatusBadgeProps {
  status: DeviceStatus;
}

function StatusBadge({
  status,
}: StatusBadgeProps) {
  const config: Record<
    DeviceStatus,
    {
      label: string;
      className: string;
    }
  > = {
    NOT_REGISTERED: {
      label: "Not Registered",
      className:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    },

    REGISTERED: {
      label: "Registered",
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    },

    RUNNING: {
      label: "Running",
      className:
        "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    },

    WARNING: {
      label: "Warning",
      className:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    },

    ERROR: {
      label: "Error",
      className:
        "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    },

    OFFLINE: {
      label: "Offline",
      className:
        "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    },
  };

  const current =
    config[status] ??
    config.OFFLINE;

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${current.className}`}
    >
      {current.label}
    </span>
  );
}

// =====================================================
// NUMBER FORMATTER
// =====================================================

function formatNumber(
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

// =====================================================
// TIME FORMATTER
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
    return "--";
  }

  return date.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// =====================================================
// STATUS
// =====================================================

type DeviceStatus =
  | "NOT_REGISTERED"
  | "REGISTERED"
  | "RUNNING"
  | "WARNING"
  | "ERROR"
  | "OFFLINE";

// =====================================================
// ACTIVITY
// =====================================================

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

  ipAddress?: string;
}

// =====================================================
// DEVICE
// =====================================================

interface DeviceItem {
  deviceId: string;

  deviceName: string;

  status: DeviceStatus;

  ipAddress?: string;

  lastSeen?: string | null;
}

// =====================================================
// API RESPONSE
// =====================================================

interface DashboardResponse {
  success: boolean;

  recentActivity?: Activity[];

  devices?: DeviceItem[];

  error?: string;
}

// =====================================================
// COMPONENT
// =====================================================

export default function RecentActivity() {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [devices, setDevices] =
    useState<DeviceItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // =====================================================
  // LOAD ACTIVITY
  // =====================================================

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
    }, []);

  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {
    loadActivity();

    const interval =
      setInterval(
        loadActivity,
        10_000
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, [loadActivity]);

  // =====================================================
  // DEVICE STATUS MAP
  // =====================================================

  const deviceStatusMap =
    useMemo(() => {
      const map =
        new Map<
          string,
          DeviceStatus
        >();

      for (const device of devices) {
        map.set(
          device.deviceId,
          device.status
        );
      }

      return map;
    }, [devices]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Recent Activity
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* ================================================
            LOADING
        ================================================= */}

        {loading && (
          <p className="text-sm text-muted-foreground">
            Loading activity...
          </p>
        )}

        {/* ================================================
            ERROR
        ================================================= */}

        {!loading &&
          error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

        {/* ================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          activities.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No recent activity.
            </p>
          )}

        {/* ================================================
            ACTIVITY LIST
        ================================================= */}

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
                    deviceStatusMap.get(
                      activity.deviceId
                    ) ??
                    "OFFLINE";

                  return (
                    <div
                      key={
                        activity._id ||
                        `${activity.deviceId}-${activity.createdAt}-${index}`
                      }
                      className="rounded-lg border p-3"
                    >
                      {/* =================================
                          HEADER
                      ================================== */}

                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {
                              activity.deviceId
                            }
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* STATUS */}

                          <StatusBadge
                            status={
                              status
                            }
                          />

                          {/* TIME */}

                          <span className="text-xs text-muted-foreground">
                            {formatTime(
                              activity.createdAt
                            )}
                          </span>
                        </div>
                      </div>

                      {/* =================================
                          TELEMETRY GRID
                      ================================== */}

                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                        {/* TEMPERATURE */}

                        <TelemetryItem
                          label="Temperature"
                          value={
                            formatNumber(
                              activity.temperature,
                              1,
                              "°C"
                            )
                          }
                        />

                        {/* HUMIDITY */}

                        <TelemetryItem
                          label="Humidity"
                          value={
                            formatNumber(
                              activity.humidity,
                              1,
                              "%"
                            )
                          }
                        />

                        {/* CURRENT */}

                        <TelemetryItem
                          label="Current"
                          value={
                            formatNumber(
                              activity.current,
                              2,
                              "A"
                            )
                          }
                        />

                        {/* VOLTAGE */}

                        <TelemetryItem
                          label="Voltage"
                          value={
                            formatNumber(
                              activity.voltage,
                              1,
                              "V"
                            )
                          }
                        />

                        {/* POWER */}

                        <TelemetryItem
                          label="Power"
                          value={
                            formatNumber(
                              activity.power,
                              1,
                              "W"
                            )
                          }
                        />

                        {/* RSSI */}

                        <TelemetryItem
                          label="RSSI"
                          value={
                            formatNumber(
                              activity.rssi,
                              0,
                              "dBm"
                            )
                          }
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

// =====================================================
// TELEMETRY ITEM
// =====================================================

interface TelemetryItemProps {
  label: string;

  value: string;
}

function TelemetryItem({
  label,
  value,
}: TelemetryItemProps) {
  return (
    <div className="rounded-md bg-muted/40 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-0.5 text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

// =====================================================
// STATUS BADGE
// =====================================================

interface StatusBadgeProps {
  status: DeviceStatus;
}

function StatusBadge({
  status,
}: StatusBadgeProps) {
  const config: Record<
    DeviceStatus,
    {
      label: string;
      className: string;
    }
  > = {
    NOT_REGISTERED: {
      label: "Not Registered",
      className:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    },

    REGISTERED: {
      label: "Registered",
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    },

    RUNNING: {
      label: "Running",
      className:
        "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    },

    WARNING: {
      label: "Warning",
      className:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    },

    ERROR: {
      label: "Error",
      className:
        "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    },

    OFFLINE: {
      label: "Offline",
      className:
        "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    },
  };

  const current =
    config[status] ??
    config.OFFLINE;

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${current.className}`}
    >
      {current.label}
    </span>
  );
}

// =====================================================
// NUMBER FORMATTER
// =====================================================

function formatNumber(
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

// =====================================================
// TIME FORMATTER
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