"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const devices = [
  {
    id: "ESP32-001",
    location: "Main Office",
    status: "Online",
  },
  {
    id: "ESP32-002",
    location: "Warehouse",
    status: "Online",
  },
  {
    id: "ESP32-003",
    location: "Electrical Room",
    status: "Offline",
  },
];

export default function DeviceStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Status</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div>
              <p className="font-medium">{device.id}</p>
              <p className="text-sm text-muted-foreground">
                {device.location}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                device.status === "Online"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
              }`}
            >
              {device.status}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}