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
  Legend,
} from "recharts";

// =====================================================
// TYPES
// =====================================================

export interface TelemetrySeries {
  key: string;
  name: string;
}

export interface ChartData {
  createdAt: string;
  time: string;

  [key: string]: string | number | null;
}

interface TelemetryChartProps {
  title: string;

  data: ChartData[];

  series: TelemetrySeries[];

  unit: string;
}

// =====================================================
// COMPONENT
// =====================================================

export default function TelemetryChart({
  title,
  data,
  series,
  unit,
}: TelemetryChartProps) {
  // ===================================================
  // VALID SERIES
  // ===================================================

  const validSeries = useMemo(() => {
    return series.filter(
      (item) =>
        typeof item.key === "string" &&
        item.key.length > 0
    );
  }, [series]);

  // ===================================================
  // EMPTY STATE
  // ===================================================

  if (
    data.length === 0 ||
    validSeries.length === 0
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex h-[320px] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No {title.toLowerCase()} data available.
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
        <div className="h-[350px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 10,
              }}
            >
              {/* ===================================== */}
              {/* GRID */}
              {/* ===================================== */}

              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
              />

              {/* ===================================== */}
              {/* X AXIS */}
              {/* ===================================== */}

              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                minTickGap={30}
                tick={{
                  fontSize: 12,
                }}
              />

              {/* ===================================== */}
              {/* Y AXIS */}
              {/* ===================================== */}

              <YAxis
                tickLine={false}
                axisLine={false}
                width={70}
                tick={{
                  fontSize: 12,
                }}
                tickFormatter={(
                  value: number
                ) =>
                  unit
                    ? `${value} ${unit}`
                    : String(value)
                }
              />

              {/* ===================================== */}
              {/* TOOLTIP */}
              {/* ===================================== */}

              <Tooltip
                formatter={(
                  rawValue,
                  dataKey
                ) => {
                  const value =
                    typeof rawValue ===
                    "number"
                      ? rawValue
                      : Number(
                          rawValue
                        );

                  const label =
                    String(
                      dataKey ?? ""
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
                      label,
                    ];
                  }

                  return [
                    String(
                      rawValue
                    ),
                    label,
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

              {/* ===================================== */}
              {/* LEGEND */}
              {/* ===================================== */}

              <Legend
                verticalAlign="bottom"
                height={50}
                wrapperStyle={{
                  fontSize: "12px",
                }}
              />

              {/* ===================================== */}
              {/* SENSOR LINES */}
              {/* ===================================== */}

              {validSeries.map(
                (item, index) => (
                  <Line
                    key={item.key}
                    type="monotone"
                    dataKey={
                      item.key
                    }
                    name={
                      item.name
                    }
                    dot={false}
                    strokeWidth={2}
                    activeDot={{
                      r: 5,
                    }}
                    isAnimationActive={
                      false
                    }
                    connectNulls={false}
                  />
                )
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* =========================================== */}
        {/* FOOTER */}
        {/* =========================================== */}

        <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <span>
            {data.length}{" "}
            readings
          </span>

          <span>
            {validSeries.length}{" "}
            sensor
            {validSeries.length !==
            1
              ? "s"
              : ""}{" "}
            · {unit || "—"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}