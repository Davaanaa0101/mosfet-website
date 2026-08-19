"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DeviceItem {
  deviceId: string;
  deviceName: string;
  status: "online" | "offline";
  ipAddress?: string;
  lastSeen?: string;
}

interface DashboardResponse {
  success: boolean;
  devices?: DeviceItem[];
  error?: string;
}

export default function DeviceStatus() {
  const [devices, setDevices] =
    useState<DeviceItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadDevices =
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
    }, []);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Device Status
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading && (
          <p className="text-sm text-muted-foreground">
            Loading devices...
          </p>
        )}

        {!loading && error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          devices.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No devices registered.
            </p>
          )}

        <div className="space-y-4">
          {devices.map(
            (device) => (
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
                  <div>
                    <p className="font-medium">
                      {
                        device.deviceName
                      }
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {
                        device.deviceId
                      }
                    </p>

                    {device.ipAddress && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {
                          device.ipAddress
                        }
                      </p>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      device.status ===
                      "online"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                    }`}
                  >
                    {device.status ===
                    "online"
                      ? "Online"
                      : "Offline"}
                  </span>
                </div>
              </Link>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}