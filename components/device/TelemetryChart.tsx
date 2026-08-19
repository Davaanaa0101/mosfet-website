"use client";

import { useMemo } from "react";

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

  value?: number | null;

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
    | "value"
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
          const rawValue =
            item[dataKey];

          const numericValue =
            typeof rawValue ===
              "number" &&
            Number.isFinite(
              rawValue
            )
              ? rawValue
              : null;

          return {
            ...item,

            value:
              numericValue,

            chartValue:
              numericValue,

            time:
              item.time ||
              formatTime(
                item.createdAt
              ),
          };
        })
        .filter(
          (item) =>
            item.chartValue !==
            null
        );
    }, [
      data,
      dataKey,
    ]);

  // ===================================================
  // EMPTY STATE
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
              No {title.toLowerCase()}{" "}
              data available.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ===================================================
  // CHART
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
                left: 5,
                bottom: 5,
              }}
            >
              {/* ================================= */}
              {/* GRID */}
              {/* ================================= */}

              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
              />

              {/* ================================= */}
              {/* X AXIS */}
              {/* ================================= */}

              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                minTickGap={30}
                tick={{
                  fontSize: 12,
                }}
              />

              {/* ================================= */}
              {/* Y AXIS */}
              {/* ================================= */}

              <YAxis
                tickLine={false}
                axisLine={false}
                width={65}
                tick={{
                  fontSize: 12,
                }}
                tickFormatter={(
                  value: number
                ) =>
                  unit
                    ? `${value} ${unit}`
                    : String(
                        value
                      )
                }
              />

              {/* ================================= */}
              {/* TOOLTIP */}
              {/* ================================= */}

              <Tooltip
                formatter={(
                  rawValue
                ) => {
                  const value =
                    typeof rawValue ===
                    "number"
                      ? rawValue
                      : Number(
                          rawValue
                        );

                  if (
                    Number.isFinite(
                      value
                    )
                  ) {
                    return [
                      unit
                        ? `${value.toFixed(
                            2
                          )} ${unit}`
                        : value.toFixed(
                            2
                          ),
                      title,
                    ];
                  }

                  return [
                    String(
                      rawValue
                    ),
                    title,
                  ];
                }}
                labelFormatter={(
                  label
                ) =>
                  `Time: ${String(
                    label
                  )}`
                }
              />

              {/* ================================= */}
              {/* LINE */}
              {/* ================================= */}

              <Line
                type="monotone"
                dataKey="chartValue"
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

        {/* ========================================= */}
        {/* FOOTER */}
        {/* ========================================= */}

        <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <span>
            {chartData.length}{" "}
            readings
          </span>

          <span>
            Unit:{" "}
            {unit || "—"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// TIME FORMAT
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