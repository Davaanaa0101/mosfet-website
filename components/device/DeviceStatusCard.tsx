"use client";

import { useMemo } from "react";
import { useTelemetry } from "@/hooks/useTelemetry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  deviceId: string;
}

export default function DeviceStatusCard({ deviceId }: Props) {
  const { data } = useTelemetry(deviceId);

  const latest = useMemo(() => {
    if (!data?.length) return null;
    return data[data.length - 1];
  }, [data]);

  if (!latest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Status</CardTitle>
        </CardHeader>
        <CardContent>No telemetry available.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Status</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4">

        <Metric
          title="Temperature"
          value={`${latest.temperature ?? "--"} °C`}
        />

        <Metric
          title="Humidity"
          value={`${latest.humidity ?? "--"} %`}
        />

        <Metric
          title="Voltage"
          value={`${latest.voltage ?? "--"} V`}
        />

        <Metric
          title="Power"
          value={`${latest.power ?? "--"} W`}
        />

        <Metric
          title="RSSI"
          value={`${latest.rssi ?? "--"} dBm`}
        />

        <Metric
          title="Free Heap"
          value={`${latest.freeHeap ?? "--"} B`}
        />

      </CardContent>
    </Card>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-sm text-muted-foreground">
        {title}
      </div>

      <div className="text-2xl font-semibold">
        {value}
      </div>
    </div>
  );
}