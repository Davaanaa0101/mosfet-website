"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TelemetryPoint {
  createdAt: string;
  temperature?: number;
  humidity?: number;
  current?: number;
  voltage?: number;
  power?: number;
}

interface TelemetryChartProps {
  data: TelemetryPoint[];
}

function formatTime(value: string) {
  const date = new Date(value);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function TelemetryChart({
  data,
}: TelemetryChartProps) {
  const chartData = data.map((item) => ({
    ...item,

    time: formatTime(
      item.createdAt
    ),

    temperature:
      typeof item.temperature === "number"
        ? item.temperature
        : null,

    humidity:
      typeof item.humidity === "number"
        ? item.humidity
        : null,

    current:
      typeof item.current === "number"
        ? item.current
        : null,

    voltage:
      typeof item.voltage === "number"
        ? item.voltage
        : null,

    power:
      typeof item.power === "number"
        ? item.power
        : null,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-[350px] items-center justify-center rounded-lg border">
        <p className="text-muted-foreground">
          No telemetry data available.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="time"
          />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="temperature"
            name="Temperature"
            dot={false}
            connectNulls
          />

          <Line
            type="monotone"
            dataKey="humidity"
            name="Humidity"
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}