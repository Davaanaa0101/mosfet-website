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

import {
  Activity,
  BatteryCharging,
  Droplets,
  Gauge,
  Thermometer,
  Zap,
} from "lucide-react";

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

// =====================================================
// ICON
// =====================================================

function getMetricIcon(
  dataKey: string
) {
  switch (dataKey) {
    case "temperature":
      return Thermometer;

    case "humidity":
      return Droplets;

    case "voltage":
      return BatteryCharging;

    case "current":
      return Zap;

    case "power":
      return Gauge;

    case "energy":
      return Activity;

    default:
      return Activity;
  }
}

// =====================================================
// ICON STYLE
// =====================================================

function getMetricStyle(
  dataKey: string
) {
  switch (dataKey) {
    case "temperature":
      return "bg-orange-50 text-orange-500";

    case "humidity":
      return "bg-blue-50 text-blue-500";

    case "voltage":
      return "bg-emerald-50 text-emerald-500";

    case "current":
      return "bg-yellow-50 text-yellow-500";

    case "power":
      return "bg-purple-50 text-purple-500";

    case "energy":
      return "bg-cyan-50 text-cyan-500";

    default:
      return "bg-slate-100 text-slate-500";
  }
}

// =====================================================
// TOOLTIP
// =====================================================

interface TooltipPayload {
  value?: number | string;
  name?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  unit: string;
  title: string;
}

function CustomTooltip({
  active,
  payload,
  label,
  unit,
  title,
}: CustomTooltipProps) {
  if (
    !active ||
    !payload ||
    payload.length === 0
  ) {
    return null;
  }

  const value =
    payload[0]?.value;

  const numericValue =
    typeof value === "number"
      ? value
      : Number(value);

  return (
    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-white
        px-4
        py-3
        shadow-lg
      "
    >
      <p
        className="
          text-[10px]
          font-medium
          text-slate-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-xs
          font-medium
          text-slate-500
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1
          text-lg
          font-bold
          text-slate-900
        "
      >
        {Number.isFinite(
          numericValue
        )
          ? `${numericValue.toFixed(2)} ${unit}`
          : `-- ${unit}`}
      </p>
    </div>
  );
}

// =====================================================
// CHART
// =====================================================

export default function TelemetryChart({
  title,
  data,
  dataKey,
  unit,
}: TelemetryChartProps) {
  const Icon =
    getMetricIcon(dataKey);

  const iconStyle =
    getMetricStyle(dataKey);

  const chartData =
    data
      .map((item) => {
        const rawValue =
          item[
            dataKey as keyof TelemetryChartData
          ];

        return {
          ...item,

          time: formatChartTime(
            item.createdAt
          ),

          value:
            typeof rawValue ===
            "number"
              ? rawValue
              : null,
        };
      })
      .filter(
        (item) =>
          item.value !== null
      );

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:shadow-md
      "
    >
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-100
          px-5
          py-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <div
            className={`
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              ${iconStyle}
            `}
          >
            <Icon
              className="
                h-5
                w-5
              "
            />
          </div>

          <div>
            <h3
              className="
                text-sm
                font-bold
                text-slate-800
              "
            >
              {title}
            </h3>

            <p
              className="
                mt-0.5
                text-[11px]
                text-slate-400
              "
            >
              Historical telemetry
            </p>
          </div>
        </div>

        {/* UNIT */}

        <span
          className="
            rounded-full
            border
            border-slate-200
            bg-slate-50
            px-2.5
            py-1
            text-[10px]
            font-semibold
            text-slate-500
          "
        >
          {unit}
        </span>
      </div>

      {/* ================================================= */}
      {/* CHART */}
      {/* ================================================= */}

      <div className="p-5">
        {chartData.length === 0 ? (
          <div
            className="
              flex
              h-[280px]
              flex-col
              items-center
              justify-center
              text-center
            "
          >
            <div
              className={`
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                ${iconStyle}
              `}
            >
              <Icon
                className="
                  h-5
                  w-5
                "
              />
            </div>

            <p
              className="
                mt-4
                text-sm
                font-semibold
                text-slate-600
              "
            >
              No telemetry data
            </p>

            <p
              className="
                mt-1
                text-xs
                text-slate-400
              "
            >
              No {title.toLowerCase()} readings
              are available yet.
            </p>
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 5,
                }}
              >
                {/* GRID */}

                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#e2e8f0"
                  vertical={false}
                />

                {/* X AXIS */}

                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: "#94a3b8",
                  }}
                  tickMargin={10}
                  minTickGap={30}
                />

                {/* Y AXIS */}

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: "#94a3b8",
                  }}
                  tickMargin={8}
                  width={45}
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
                  content={
                    <CustomTooltip
                      unit={unit}
                      title={title}
                    />
                  }
                />

                {/* LINE */}

                <Line
                  type="monotone"
                  dataKey="value"
                  name={title}
                  stroke="#E91E63"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke:
                      "#ffffff",
                    fill: "#E91E63",
                  }}
                  connectNulls
                  animationDuration={
                    700
                  }
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      {chartData.length > 0 && (
        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-slate-100
            bg-slate-50/50
            px-5
            py-3
          "
        >
          <span
            className="
              text-[10px]
              text-slate-400
            "
          >
            {chartData.length} readings
          </span>

          <span
            className="
              text-[10px]
              text-slate-400
            "
          >
            {unit}
          </span>
        </div>
      )}
    </div>
  );
}

// =====================================================
// TIME FORMAT
// =====================================================

function formatChartTime(
  timestamp: string
): string {
  const date =
    new Date(timestamp);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "--";
  }

  return date.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}