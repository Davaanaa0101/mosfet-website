"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Device {
  _id: string;
  deviceId: string;
  name?: string;
  type?: string;
  location?: string;
  status?: string;
  ipAddress?: string;
  lastSeen?: string;
}

function isOnline(
  lastSeen?: string
): boolean {
  if (!lastSeen) {
    return false;
  }

  const timestamp =
    new Date(lastSeen).getTime();

  if (Number.isNaN(timestamp)) {
    return false;
  }

  return (
    Date.now() - timestamp <= 30_000
  );
}

export default function DeviceStatus() {
  const [devices, setDevices] =
    useState<Device[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadDevices = useCallback(
    async () => {
      try {
        const response = await fetch(
          "/api/devices",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load devices"
          );
        }

        const result =
          (await response.json()) as Device[];

        setDevices(result);
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

  useEffect(() => {
    loadDevices();

    const interval = setInterval(
      loadDevices,
      10000
    );

    return () => {
      clearInterval(interval);
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

        {!loading &&
          !error &&
          devices.length > 0 && (
            <div className="space-y-4">
              {devices.map((device) => {
                const online =
                  isOnline(
                    device.lastSeen
                  );

                return (
                  <div
                    key={device._id}
                    className="flex items-center justify-between gap-4 rounded-lg border p-3"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/devices/${encodeURIComponent(
                          device.deviceId
                        )}`}
                        className="font-medium hover:underline"
                      >
                        {device.name ||
                          device.deviceId}
                      </Link>

                      <p className="text-sm text-muted-foreground">
                        {device.deviceId}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {device.location ||
                          device.ipAddress ||
                          "No location"}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          online
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />

                      <span
                        className={`text-xs font-medium ${
                          online
                            ? "text-green-600 dark:text-green-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {online
                          ? "Online"
                          : "Offline"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </CardContent>
    </Card>
  );
}