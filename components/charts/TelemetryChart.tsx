"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface TelemetryChartData {
  createdAt: string;

  temperature?: number;
  humidity?: number;
  voltage?: number;
  current?: number;
  power?: number;
  energy?: number;
}

interface TelemetryChartProps {
  title: string;
  data: TelemetryChartData[];
  dataKey: string;
  unit: string;
}

export default function TelemetryChart({
  title,
  data,
  dataKey,
  unit,
}: TelemetryChartProps) {
  const chartData = data.map((item) => {
    const rawValue =
      item[
        dataKey as keyof TelemetryChartData
      ];

    return {
      ...item,

      time: new Date(
        item.createdAt
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),

      value:
        typeof rawValue === "number"
          ? rawValue
          : null,
    };
  });

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground">
          Historical telemetry
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            No telemetry data available.
          </p>
        </div>
      ) : (
        <ResponsiveContainer
          width="100%"
          height={300}
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
              tick={{ fontSize: 12 }}
            />

            <YAxis
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              formatter={(value) => {
                if (
                  typeof value === "number"
                ) {
                  return [
                    `${value.toFixed(2)} ${unit}`,
                    title,
                  ];
                }

                return [
                  "N/A",
                  title,
                ];
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              name={title}
              dot={false}
              strokeWidth={2}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}