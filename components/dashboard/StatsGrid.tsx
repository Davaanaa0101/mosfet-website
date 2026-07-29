"use client";

import {
  Cpu,
  Wifi,
  TriangleAlert,
  Thermometer,
} from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";
import StatCard from "./StatCard";

export default function StatsGrid() {
  const { data, isLoading } = useDashboard();

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Devices"
        value={isLoading ? "--" : data?.totalDevices ?? 0}
        subtitle="Registered"
        icon={Cpu}
      />

      <StatCard
        title="Online"
        value={isLoading ? "--" : data?.onlineDevices ?? 0}
        subtitle="Currently Connected"
        icon={Wifi}
      />

      <StatCard
        title="Alerts"
        value={isLoading ? "--" : data?.alerts ?? 0}
        subtitle="Needs Attention"
        icon={TriangleAlert}
      />

      <StatCard
        title="Temperature"
        value={
          isLoading
            ? "--"
            : `${data?.avgTemperature ?? 0}°C`
        }
        subtitle="Latest Reading"
        icon={Thermometer}
      />
    </div>
  );
}