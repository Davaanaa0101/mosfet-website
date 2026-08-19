"use client";

import {
  useMemo,
} from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// =====================================================
// TYPES
// =====================================================

interface ChartData {
  createdAt: string;

  time?: string;

  temperature?: number | null;

  humidity?: number | null;

  voltage?: number | null;

  current?: number | null;

  power?: number | null;

  energy?: number | null;
}

interface TelemetryChartProps {
  title: string;

  data: ChartData[];

  dataKey:
    | "temperature"
    | "humidity"
    | "voltage"
    | "current"
    | "power"
    | "energy";

  unit: string;
}

// =====================================================
// COMPONENT
// =====================================================

export default function TelemetryChart({
  title,
  data,
  dataKey,
  unit,
}: TelemetryChartProps) {
  // ===================================================
  // PREPARE DATA
  // ===================================================

  const chartData =
    useMemo(() => {
      return data
        .map((item) => {
          const value =
            item[dataKey];

          return {
            ...item,

            value:
              typeof value ===
                "number" &&
              Number.isFinite(
                value
              )
                ? value
                : null,

            time:
              item.time ||
              formatTime(
                item.createdAt
              ),
          };
        })
        .filter(
          (item) =>
            item.value !== null
        );
    }, [
      data,
      dataKey,
    ]);

  // ===================================================
  // EMPTY
  // ===================================================

  if (
    chartData.length === 0
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No {title.toLowerCase()} data available.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >
              {/* ----------------------------------- */}
              {/* GRID */}
              {/* ----------------------------------- */}

              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
              />

              {/* ----------------------------------- */}
              {/* X AXIS */}
              {/* ----------------------------------- */}

              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                minTickGap={30}
                tick={{
                  fontSize: 12,
                }}
              />

              {/* ----------------------------------- */}
              {/* Y AXIS */}
              {/* ----------------------------------- */}

              <YAxis
                tickLine={false}
                axisLine={false}
                width={55}
                tick={{
                  fontSize: 12,
                }}
                tickFormatter={(
                  value
                ) =>
                  `${value}${unit}`
                }
              />

              {/* ----------------------------------- */}
              {/* TOOLTIP */}
              {/* ----------------------------------- */}

              <Tooltip
                formatter={(
                  value
                ) => {
                  if (
                    typeof value ===
                    "number"
                  ) {
                    return [
                      `${value.toFixed(
                        2
                      )} ${unit}`,
                      title,
                    ];
                  }

                  return [
                    value,
                    title,
                  ];
                }}
                labelFormatter={(
                  label
                ) =>
                  `Time: ${label}`
                }
              />

              {/* ----------------------------------- */}
              {/* LINE */}
              {/* ----------------------------------- */}

              <Line
                type="monotone"
                dataKey="value"
                name={title}
                dot={false}
                strokeWidth={2}
                activeDot={{
                  r: 5,
                }}
                isAnimationActive={
                  false
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ----------------------------------------- */}
        {/* SUMMARY */}
        {/* ----------------------------------------- */}

        <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <span>
            {chartData.length}{" "}
            readings
          </span>

          <span>
            Unit: {unit}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// FORMAT TIME
// =====================================================

function formatTime(
  timestamp: string
): string {
  const date =
    new Date(timestamp);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}