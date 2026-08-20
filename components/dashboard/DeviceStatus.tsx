"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// =====================================================
// DEVICE STATUS
// =====================================================

type DeviceStatusType =
  | "NOT_REGISTERED"
  | "REGISTERED"
  | "RUNNING"
  | "WARNING"
  | "ERROR"
  | "OFFLINE";

// =====================================================
// DEVICE
// =====================================================

interface DeviceItem {
  _id?: string;

  deviceId: string;

  serialId?: string;

  deviceName: string;

  status: DeviceStatusType;

  ipAddress?: string;

  location?: string;

  type?: string;

  lastSeen?: string | null;

  registeredAt?: string | null;

  telemetry?: Record<string, unknown> | null;
}

// =====================================================
// API RESPONSE
// =====================================================

interface DashboardResponse {
  success: boolean;

  devices?: DeviceItem[];

  error?: string;
}

// =====================================================
// STATUS CONFIG
// =====================================================

const STATUS_CONFIG: Record<
  DeviceStatusType,
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

// =====================================================
// COMPONENT
// =====================================================

export default function DeviceStatus() {
  const [devices, setDevices] =
    useState<DeviceItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // =====================================================
  // LOAD DEVICES
  // =====================================================

  const loadDevices = useCallback(
    async () => {
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
              "Failed to load devices"
          );
        }

        setDevices(
          result.devices ?? []
        );

        setError(null);
      } catch (err) {
        console.error(
          "[DeviceStatus]",
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
    },
    []
  );

  // =====================================================
  // INITIAL LOAD + AUTO REFRESH
  // =====================================================

  useEffect(() => {
    loadDevices();

    const interval =
      setInterval(
        loadDevices,
        10_000
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, [loadDevices]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Device Status
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* ================================================
            LOADING
        ================================================= */}

        {loading && (
          <p className="text-sm text-muted-foreground">
            Loading devices...
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
            NO DEVICES
        ================================================= */}

        {!loading &&
          !error &&
          devices.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No devices registered.
            </p>
          )}

        {/* ================================================
            DEVICE LIST
        ================================================= */}

        {!loading &&
          !error &&
          devices.length > 0 && (
            <div className="space-y-4">
              {devices.map(
                (device) => {
                  // ----------------------------------------
                  // STATUS CONFIG
                  // ----------------------------------------

                  const status =
                    STATUS_CONFIG[
                      device.status
                    ] ??
                    STATUS_CONFIG.OFFLINE;

                  // ----------------------------------------
                  // RENDER
                  // ----------------------------------------

                  return (
                    <Link
                      key={
                        device.deviceId
                      }
                      href={`/devices/${encodeURIComponent(
                        device.deviceId
                      )}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                        {/* =================================
                            DEVICE INFORMATION
                        ================================== */}

                        <div>
                          {/* DEVICE NAME */}

                          <p className="font-medium">
                            {
                              device.deviceName
                            }
                          </p>

                          {/* DEVICE ID */}

                          <p className="text-sm text-muted-foreground">
                            {
                              device.deviceId
                            }
                          </p>

                          {/* SERIAL ID */}

                          {device.serialId && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Serial:{" "}
                              {
                                device.serialId
                              }
                            </p>
                          )}

                          {/* IP ADDRESS */}

                          {device.ipAddress && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {
                                device.ipAddress
                              }
                            </p>
                          )}
                        </div>

                        {/* =================================
                            STATUS
                        ================================== */}

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                        >
                          {
                            status.label
                          }
                        </span>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          )}
      </CardContent>
    </Card>
  );
}