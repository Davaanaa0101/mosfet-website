"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  "ESP32-001 reported temperature 24°C",
  "Warehouse device came online",
  "New customer registered",
  "Firmware v1.2 uploaded",
];

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {activities.map((activity, index) => (
            <li
              key={index}
              className="border-b pb-2 text-sm last:border-0"
            >
              {activity}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}