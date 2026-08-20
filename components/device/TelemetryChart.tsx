"use client";

import {
  useMemo,
} from "react";

import {
  Activity,
  BarChart3,
  Clock3,
} from "lucide-react";

import {
  Card,
  CardContent,
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
  color: string;
}

export interface ChartData {
  createdAt: string;
  time: string;

  [key: string]:
    | string
    | number
    | null;
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

  const validSeries =
    useMemo(
      () =>
        series.filter(
          (item) =>
            Boolean(item.key) &&
            Boolean(item.name) &&
            Boolean(item.color)
        ),
      [series]
    );

  // ===================================================
  // LATEST VALUES
  // ===================================================

  const latestValues =
    useMemo(() => {
      if (data.length === 0) {
        return [];
      }

      const latest =
        data[data.length - 1];

      return validSeries
        .map((item) => {
          const raw =
            latest[item.key];

          const value =
            typeof raw === "number"
              ? raw
              : Number(raw);

          if (
            !Number.isFinite(
              value
            )
          ) {
            return null;
          }

          return {
            ...item,
            value,
          };
        })
        .filter(
          (
            item
          ): item is TelemetrySeries & {
            value: number;
          } => item !== null
        );
    }, [
      data,
      validSeries,
    ]);

  // ===================================================
  // EMPTY STATE
  // ===================================================

  if (
    data.length === 0 ||
    validSeries.length === 0
  ) {
    return (
      <Card
        className="
          overflow-hidden
          rounded-3xl
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <CardContent
          className="
            flex
            min-h-[360px]
            flex-col
            items-center
            justify-center
            text-center
          "
        >
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-slate-100
            "
          >
            <BarChart3
              className="
                h-6
                w-6
                text-slate-400
              "
            />
          </div>

          <h3
            className="
              mt-4
              text-base
              font-bold
              text-slate-700
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-1
              max-w-xs
              text-sm
              text-slate-400
            "
          >
            No {title.toLowerCase()} data
            available for this period.
          </p>
        </CardContent>
      </Card>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <Card
      className="
        overflow-hidden
        rounded-3xl
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        className="
          border-b
          border-slate-100
          px-5
          py-5
          sm:px-6
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* TITLE */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-primary/10
              "
            >
              <Activity
                className="
                  h-5
                  w-5
                  text-primary
                "
              />
            </div>

            <div>
              <h3
                className="
                  text-base
                  font-bold
                  tracking-tight
                  text-slate-900
                "
              >
                {title}
              </h3>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-slate-400
                "
              >
                Historical telemetry
              </p>
            </div>
          </div>

          {/* LATEST VALUES */}

          {latestValues.length >
            0 && (
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              {latestValues.map(
                (item) => (
                  <div
                    key={
                      item.key
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-slate-100
                      bg-slate-50
                      px-3
                      py-2
                    "
                  >
                    <span
                      className="
                        h-2
                        w-2
                        rounded-full
                      "
                      style={{
                        backgroundColor:
                          item.color,
                      }}
                    />

                    <span
                      className="
                        text-[10px]
                        font-medium
                        text-slate-400
                      "
                    >
                      {item.name}
                    </span>

                    <span
                      className="
                        text-xs
                        font-bold
                        text-slate-700
                      "
                    >
                      {formatNumber(
                        item.value
                      )}{" "}
                      {unit}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* CHART */}
      {/* ================================================= */}

      <CardContent className="p-4 sm:p-6">
        <div
          className="
            h-[320px]
            w-full
            sm:h-[360px]
          "
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={data}
              margin={{
                top: 12,
                right: 16,
                left: 0,
                bottom: 8,
              }}
            >
              {/* GRID */}

              <CartesianGrid
                stroke="#e2e8f0"
                strokeDasharray="4 5"
                vertical={false}
              />

              {/* X AXIS */}

              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                minTickGap={35}
                tick={{
                  fontSize: 11,
                  fill: "#94a3b8",
                }}
                dy={8}
              />

              {/* Y AXIS */}

              <YAxis
                tickLine={false}
                axisLine={false}
                width={65}
                tick={{
                  fontSize: 11,
                  fill: "#94a3b8",
                }}
                tickFormatter={(
                  value: number
                ) =>
                  formatAxisValue(
                    value,
                    unit
                  )
                }
              />

              {/* TOOLTIP */}

              <Tooltip
                cursor={{
                  stroke:
                    "#cbd5e1",
                  strokeWidth: 1,
                  strokeDasharray:
                    "4 4",
                }}
                contentStyle={{
                  border:
                    "1px solid #e2e8f0",
                  borderRadius:
                    "14px",
                  background:
                    "#ffffff",
                  boxShadow:
                    "0 10px 30px rgba(15,23,42,0.10)",
                  padding:
                    "10px 12px",
                }}
                labelStyle={{
                  color:
                    "#64748b",
                  fontSize:
                    "11px",
                  fontWeight:
                    600,
                  marginBottom:
                    "6px",
                }}
                itemStyle={{
                  fontSize:
                    "12px",
                  fontWeight:
                    600,
                  padding:
                    "2px 0",
                }}
                labelFormatter={(
                  label
                ) =>
                  String(label)
                }
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

                  const key =
                    String(
                      dataKey ??
                        ""
                    );

                  const matched =
                    validSeries.find(
                      (item) =>
                        item.key ===
                        key
                    );

                  const label =
                    matched?.name ??
                    key;

                  if (
                    Number.isFinite(
                      value
                    )
                  ) {
                    return [
                      `${formatNumber(
                        value
                      )} ${unit}`,
                      label,
                    ];
                  }

                  return [
                    "--",
                    label,
                  ];
                }}
              />

              {/* LEGEND */}

              <Legend
                verticalAlign="bottom"
                align="center"
                height={38}
                iconType="circle"
                iconSize={7}
                wrapperStyle={{
                  fontSize:
                    "11px",
                  paddingTop:
                    "12px",
                  color:
                    "#64748b",
                }}
              />

              {/* LINES */}

              {validSeries.map(
                (item) => (
                  <Line
                    key={
                      item.key
                    }
                    type="monotone"
                    dataKey={
                      item.key
                    }
                    name={
                      item.name
                    }
                    stroke={
                      item.color
                    }
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                      strokeWidth: 2,
                      stroke:
                        "#ffffff",
                    }}
                    isAnimationActive={
                      false
                    }
                    connectNulls={
                      false
                    }
                  />
                )
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div
          className="
            mt-4
            flex
            flex-col
            gap-3
            border-t
            border-slate-100
            pt-4
            text-xs
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              text-slate-400
            "
          >
            <BarChart3
              className="
                h-3.5
                w-3.5
              "
            />

            <span>
              {data.length} reading
              {data.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-slate-400
            "
          >
            <Clock3
              className="
                h-3.5
                w-3.5
              "
            />

            <span>
              {validSeries.length} sensor
              {validSeries.length !== 1
                ? "s"
                : ""}
              {" · "}
              {unit || "No unit"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// NUMBER FORMAT
// =====================================================

function formatNumber(
  value: number
): string {
  if (
    !Number.isFinite(
      value
    )
  ) {
    return "--";
  }

  const absolute =
    Math.abs(value);

  if (
    absolute >= 100
  ) {
    return value.toFixed(0);
  }

  if (
    absolute >= 10
  ) {
    return value.toFixed(1);
  }

  return value.toFixed(2);
}

// =====================================================
// AXIS FORMAT
// =====================================================

function formatAxisValue(
  value: number,
  unit: string
): string {
  if (
    !Number.isFinite(
      value
    )
  ) {
    return "";
  }

  if (
    Math.abs(value) >=
    100
  ) {
    return `${value.toFixed(
      0
    )}${unit ? ` ${unit}` : ""}`;
  }

  if (
    Math.abs(value) >=
    10
  ) {
    return `${value.toFixed(
      1
    )}${unit ? ` ${unit}` : ""}`;
  }

  return `${value.toFixed(
    2
  )}${unit ? ` ${unit}` : ""}`;
}