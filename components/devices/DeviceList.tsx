"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// =====================================================
// DEVICE
// =====================================================

type DeviceStatus =
  | "NOT_REGISTERED"
  | "REGISTERED"
  | "RUNNING"
  | "WARNING"
  | "ERROR"
  | "OFFLINE";

interface Device {
  _id: string;

  deviceId: string;

  serialId?: string;

  name: string;

  type:
    | "esp32"
    | "plc"
    | "modbus"
    | "camera";

  location?: string;

  macAddress?: string;

  firmware?: string;

  ipAddress?: string;

  status: DeviceStatus;

  lastSeen?: string;

  registeredAt?: string;

  createdAt?: string;
}

// =====================================================
// RESPONSE
// =====================================================

interface DevicesResponse {
  success: boolean;

  devices?: Device[];

  error?: string;
}

// =====================================================
// DEVICE LIST
// =====================================================

export default function DeviceList() {
  const [devices, setDevices] =
    useState<Device[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  // ===================================================
  // LOAD DEVICES
  // ===================================================

  const loadDevices =
    useCallback(async () => {
      try {
        const response =
          await fetch(
            "/api/devices",
            {
              method: "GET",

              cache: "no-store",

              headers: {
                Accept:
                  "application/json",
              },

              credentials:
                "include",
            }
          );

        const result =
          (await response.json()) as DevicesResponse;

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Failed to load devices"
          );
        }

        if (
          !result.success
        ) {
          throw new Error(
            result.error ||
              "Failed to load devices"
          );
        }

        setDevices(
          result.devices ?? []
        );

        setError(null);
      } catch (err) {
        console.error(
          "[DeviceList]",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load devices"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  // ===================================================
  // AUTO REFRESH
  // ===================================================

  useEffect(() => {
    loadDevices();

    const interval =
      setInterval(
        loadDevices,
        10000
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, [loadDevices]);

  // ===================================================
  // SEARCH
  // ===================================================

  const filteredDevices =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return devices;
      }

      return devices.filter(
        (device) =>
          device.deviceId
            .toLowerCase()
            .includes(query) ||

          device.serialId
            ?.toLowerCase()
            .includes(query) ||

          device.name
            .toLowerCase()
            .includes(query) ||

          device.type
            .toLowerCase()
            .includes(query) ||

          device.location
            ?.toLowerCase()
            .includes(query) ||

          device.ipAddress
            ?.toLowerCase()
            .includes(query)
      );
    }, [
      devices,
      search,
    ]);

  // ===================================================
  // STATUS COUNTS
  // ===================================================

  const notRegisteredCount =
    devices.filter(
      (device) =>
        device.status ===
        "NOT_REGISTERED"
    ).length;

  const registeredCount =
    devices.filter(
      (device) =>
        device.status ===
        "REGISTERED"
    ).length;

  const runningCount =
    devices.filter(
      (device) =>
        device.status ===
        "RUNNING"
    ).length;

  const warningCount =
    devices.filter(
      (device) =>
        device.status ===
        "WARNING"
    ).length;

  const errorCount =
    devices.filter(
      (device) =>
        device.status ===
        "ERROR"
    ).length;

  const offlineCount =
    devices.filter(
      (device) =>
        device.status ===
        "OFFLINE"
    ).length;

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="space-y-6">

      {/* ============================================= */}
      {/* SUMMARY */}
      {/* ============================================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

        <SummaryCard
          title="Not Registered"
          value={
            notRegisteredCount
          }
        />

        <SummaryCard
          title="Registered"
          value={
            registeredCount
          }
        />

        <SummaryCard
          title="Running"
          value={
            runningCount
          }
        />

        <SummaryCard
          title="Warning"
          value={
            warningCount
          }
        />

        <SummaryCard
          title="Error"
          value={
            errorCount
          }
        />

        <SummaryCard
          title="Offline"
          value={
            offlineCount
          }
        />

      </div>

      {/* ============================================= */}
      {/* DEVICE LIST */}
      {/* ============================================= */}

      <Card>

        <CardHeader>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <CardTitle>
              All Devices
            </CardTitle>

            <div className="flex gap-3">

              <input
                type="text"
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder="Search devices..."
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:border-primary md:w-72"
              />

              <Link
                href="/dashboard/devices/register"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Register Device
              </Link>

            </div>

          </div>

        </CardHeader>

        <CardContent>

          {/* ========================================= */}
          {/* LOADING */}
          {/* ========================================= */}

          {loading && (
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Loading devices...
              </p>
            </div>
          )}

          {/* ========================================= */}
          {/* ERROR */}
          {/* ========================================= */}

          {!loading &&
            error && (
              <div className="rounded-lg border border-destructive p-4">
                <p className="text-sm text-destructive">
                  {error}
                </p>
              </div>
            )}

          {/* ========================================= */}
          {/* EMPTY */}
          {/* ========================================= */}

          {!loading &&
            !error &&
            devices.length ===
              0 && (
              <div className="py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No devices registered yet.
                </p>

                <Link
                  href="/dashboard/devices/register"
                  className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Register Device
                </Link>
              </div>
            )}

          {/* ========================================= */}
          {/* NO SEARCH RESULTS */}
          {/* ========================================= */}

          {!loading &&
            !error &&
            devices.length >
              0 &&
            filteredDevices.length ===
              0 && (
              <div className="py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No devices match your search.
                </p>
              </div>
            )}

          {/* ========================================= */}
          {/* TABLE */}
          {/* ========================================= */}

          {!loading &&
            !error &&
            filteredDevices.length >
              0 && (
              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead>

                    <tr className="border-b text-left">

                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Device
                      </th>

                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Serial ID
                      </th>

                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Type
                      </th>

                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Location
                      </th>

                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        IP Address
                      </th>

                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Status
                      </th>

                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Last Seen
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredDevices.map(
                      (
                        device
                      ) => (
                        <tr
                          key={
                            device._id ||
                            device.deviceId
                          }
                          className="border-b last:border-0 hover:bg-muted/50"
                        >

                          {/* DEVICE */}

                          <td className="px-4 py-4">

                            <Link
                              href={`/dashboard/devices/${encodeURIComponent(
                                device.deviceId
                              )}`}
                              className="block"
                            >

                              <p className="font-medium hover:text-primary">
                                {
                                  device.name
                                }
                              </p>

                              <p className="mt-1 text-xs text-muted-foreground">
                                {
                                  device.deviceId
                                }
                              </p>

                            </Link>

                          </td>

                          {/* SERIAL ID */}

                          <td className="px-4 py-4">

                            <span className="font-mono text-xs">
                              {
                                device.serialId ||
                                "—"
                              }
                            </span>

                          </td>

                          {/* TYPE */}

                          <td className="px-4 py-4">

                            <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium uppercase">
                              {
                                device.type
                              }
                            </span>

                          </td>

                          {/* LOCATION */}

                          <td className="px-4 py-4 text-muted-foreground">
                            {
                              device.location ||
                              "—"
                            }
                          </td>

                          {/* IP */}

                          <td className="px-4 py-4 font-mono text-xs">
                            {
                              device.ipAddress ||
                              "—"
                            }
                          </td>

                          {/* STATUS */}

                          <td className="px-4 py-4">

                            <StatusBadge
                              status={
                                device.status
                              }
                            />

                          </td>

                          {/* LAST SEEN */}

                          <td className="px-4 py-4 text-xs text-muted-foreground">
                            {formatLastSeen(
                              device.lastSeen
                            )}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

        </CardContent>

      </Card>

    </div>
  );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <Card>

      <CardContent className="p-5">

        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        <p className="mt-2 text-3xl font-bold">
          {value}
        </p>

      </CardContent>

    </Card>
  );
}

// =====================================================
// STATUS LABEL
// =====================================================

function getStatusLabel(
  status: DeviceStatus
): string {
  switch (status) {
    case "NOT_REGISTERED":
      return "Not Registered";

    case "REGISTERED":
      return "Registered";

    case "RUNNING":
      return "Running";

    case "WARNING":
      return "Warning";

    case "ERROR":
      return "Error";

    case "OFFLINE":
      return "Offline";

    default:
      return "Unknown";
  }
}

// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({
  status,
}: {
  status: DeviceStatus;
}) {
  const label =
    getStatusLabel(
      status
    );

  let className =
    "bg-muted text-muted-foreground";

  let dotClassName =
    "bg-muted-foreground";

  switch (status) {

    case "NOT_REGISTERED":
      className =
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

      dotClassName =
        "bg-gray-500";

      break;

    case "REGISTERED":
      className =
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400";

      dotClassName =
        "bg-blue-500";

      break;

    case "RUNNING":
      className =
        "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";

      dotClassName =
        "bg-green-500";

      break;

    case "WARNING":
      className =
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400";

      dotClassName =
        "bg-yellow-500";

      break;

    case "ERROR":
      className =
        "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";

      dotClassName =
        "bg-red-500";

      break;

    case "OFFLINE":
      className =
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

      dotClassName =
        "bg-gray-500";

      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${dotClassName}`}
      />

      {label}
    </span>
  );
}

// =====================================================
// LAST SEEN
// =====================================================

function formatLastSeen(
  timestamp?: string
): string {
  if (!timestamp) {
    return "Never";
  }

  const date =
    new Date(timestamp);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Unknown";
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