"use client";

import { useTelemetry } from "@/hooks/useTelemetry";

import TelemetryChart from "@/components/charts/TelemetryChart";

interface Props {
  deviceId: string;
}

export default function DeviceTelemetry({
  deviceId,
}: Props) {
  const { data, isLoading } = useTelemetry(deviceId);

  if (isLoading) {
    return <div>Loading telemetry...</div>;
  }

  return (
    <div className="space-y-6">
      <TelemetryChart
        title="Temperature"
        data={data ?? []}
        dataKey="temperature"
        unit="°C"
      />

      <TelemetryChart
        title="Humidity"
        data={data ?? []}
        dataKey="humidity"
        unit="%"
      />
    </div>
  );
}