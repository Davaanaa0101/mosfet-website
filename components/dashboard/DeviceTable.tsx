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
  macAddress?: string;
  firmware?: string;
  lastSeen?: string;
}

function isDeviceOnline(
  lastSeen?: string
): boolean {
  if (!lastSeen) {
    return false;
  }

  const lastSeenTime =
    new Date(lastSeen).getTime();

  if (Number.isNaN(lastSeenTime)) {
    return false;
  }

  // Consider device online if telemetry
  // was received within the last 30 seconds.
  return (
    Date.now() - lastSeenTime <= 30_000
  );
}

function formatLastSeen(
  lastSeen?: string
): string {
  if (!lastSeen) {
    return "Never";
  }

  const date = new Date(lastSeen);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString();
}

export default function DeviceTable() {
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
          "[DeviceTable]",
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

    // Refresh device status every 10 seconds.
    const interval = setInterval(
      loadDevices,
      10000
    );

    return () => {
      clearInterval(interval);
    };
  }, [loadDevices]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Devices
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            Loading devices...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Devices
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-destructive">
            {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (devices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Devices
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            No devices registered.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              Devices
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              {devices.length} device
              {devices.length !== 1
                ? "s"
                : ""}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="px-4 py-3 font-medium">
                  Device
                </th>

                <th className="px-4 py-3 font-medium">
                  Type
                </th>

                <th className="px-4 py-3 font-medium">
                  Status
                </th>

                <th className="px-4 py-3 font-medium">
                  IP Address
                </th>

                <th className="px-4 py-3 font-medium">
                  Location
                </th>

                <th className="px-4 py-3 font-medium">
                  Last Seen
                </th>

                <th className="px-4 py-3 font-medium">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {devices.map((device) => {
                const online =
                  isDeviceOnline(
                    device.lastSeen
                  );

                return (
                  <tr
                    key={device._id}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    {/* Device */}
                    <td className="px-4 py-4">
                      <div className="font-medium">
                        {device.name ||
                          device.deviceId}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {device.deviceId}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-4">
                      <span className="rounded-md bg-muted px-2 py-1 text-xs">
                        {device.type ||
                          "unknown"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            online
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />

                        <span
                          className={
                            online
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }
                        >
                          {online
                            ? "Online"
                            : "Offline"}
                        </span>
                      </div>
                    </td>

                    {/* IP */}
                    <td className="px-4 py-4 font-mono text-xs">
                      {device.ipAddress ||
                        "--"}
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4">
                      {device.location ||
                        "--"}
                    </td>

                    {/* Last Seen */}
                    <td className="px-4 py-4 text-xs text-muted-foreground">
                      {formatLastSeen(
                        device.lastSeen
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-4">
                      <Link
                        href={`/dashboard/devices/${encodeURIComponent(
                          device.deviceId
                        )}`}
                        className="font-medium underline underline-offset-4 hover:no-underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}