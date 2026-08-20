"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Droplets,
  Gauge,
  History,
  Loader2,
  Zap,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import TelemetryChart, {
  ChartData,
  TelemetrySeries,
} from "@/components/device/TelemetryChart";

// =====================================================
// TYPES
// =====================================================

interface SensorConfig {
  slot: number;
  type: string;
  name?: string;
  unit?: string;
}

interface DeviceConfig {
  success?: boolean;
  deviceId: string;
  deviceName: string;
  sendInterval: number;
  sensors: SensorConfig[];
}

interface SensorValue {
  slot: number;
  type: string;
  value: number | null;
}

interface TelemetryData {
  createdAt: string;

  temperature?: number | null;
  humidity?: number | null;
  voltage?: number | null;
  current?: number | null;
  power?: number | null;
  energy?: number | null;

  sensors?: SensorValue[];
}

interface TelemetryResponse {
  success: boolean;
  deviceId: string;
  deviceName?: string;
  range?: string;
  count?: number;
  data: TelemetryData[];
  error?: string;
}

interface Props {
  deviceId: string;
}

// =====================================================
// RANGE
// =====================================================

type Range =
  | "1h"
  | "6h"
  | "24h"
  | "7d"
  | "30d";

const RANGE_OPTIONS: {
  value: Range;
  label: string;
  description: string;
}[] = [
  {
    value: "1h",
    label: "1H",
    description: "Last hour",
  },
  {
    value: "6h",
    label: "6H",
    description: "Last 6 hours",
  },
  {
    value: "24h",
    label: "24H",
    description: "Last 24 hours",
  },
  {
    value: "7d",
    label: "7D",
    description: "Last 7 days",
  },
  {
    value: "30d",
    label: "30D",
    description: "Last 30 days",
  },
];

// =====================================================
// SENSOR GROUP
// =====================================================

type SensorGroup =
  | "temperature"
  | "humidity"
  | "current"
  | "voltage"
  | "power"
  | "energy";

// =====================================================
// STABLE SENSOR COLORS
// =====================================================

const SENSOR_COLORS = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#9333ea",
  "#ea580c",
  "#0891b2",
  "#db2777",
  "#65a30d",
];

// =====================================================
// COMPONENT
// =====================================================

export default function DeviceTelemetry({
  deviceId,
}: Props) {
  const [range, setRange] =
    useState<Range>("24h");

  const [data, setData] =
    useState<TelemetryData[]>([]);

  const [config, setConfig] =
    useState<DeviceConfig | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  // ===================================================
  // LOAD CONFIGURATION
  // ===================================================

  const loadConfig =
    useCallback(
      async () => {
        try {
          const response =
            await fetch(
              `/api/devices/${encodeURIComponent(
                deviceId
              )}/config`,
              {
                method: "GET",
                cache: "no-store",
                headers: {
                  Accept:
                    "application/json",
                },
              }
            );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result.error ||
                "Failed to load device configuration"
            );
          }

          if (
            result.success ===
            false
          ) {
            throw new Error(
              result.error ||
                "Failed to load device configuration"
            );
          }

          setConfig(
            result as DeviceConfig
          );
        } catch (err) {
          console.error(
            "[DeviceTelemetry] Config error:",
            err
          );

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load device configuration"
          );
        }
      },
      [deviceId]
    );

  // ===================================================
  // LOAD TELEMETRY
  // ===================================================

  const loadTelemetry =
    useCallback(
      async () => {
        try {
          const response =
            await fetch(
              `/api/devices/${encodeURIComponent(
                deviceId
              )}/telemetry?range=${range}&limit=1000`,
              {
                method: "GET",
                cache: "no-store",
                headers: {
                  Accept:
                    "application/json",
                },
              }
            );

          const result =
            (await response.json()) as TelemetryResponse;

          if (!response.ok) {
            throw new Error(
              result.error ||
                "Failed to load telemetry"
            );
          }

          if (
            !result.success
          ) {
            throw new Error(
              result.error ||
                "Failed to load telemetry"
            );
          }

          setData(
            result.data ?? []
          );

          setError(null);
        } catch (err) {
          console.error(
            "[DeviceTelemetry] Telemetry error:",
            err
          );

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load telemetry"
          );
        } finally {
          setLoading(false);
        }
      },
      [deviceId, range]
    );

  // ===================================================
  // LOAD + AUTO REFRESH
  // ===================================================

  useEffect(() => {
    setLoading(true);

    loadConfig();
    loadTelemetry();

    const interval =
      setInterval(() => {
        loadConfig();
        loadTelemetry();
      }, 10_000);

    return () => {
      clearInterval(interval);
    };
  }, [
    loadConfig,
    loadTelemetry,
  ]);

  // ===================================================
  // CONFIGURED SENSORS
  // ===================================================

  const configuredSensors =
    useMemo(() => {
      return (
        config?.sensors ?? []
      )
        .filter(
          (sensor) =>
            Number.isInteger(
              sensor.slot
            ) &&
            sensor.slot >= 1 &&
            sensor.slot <= 8
        )
        .filter(
          (sensor) =>
            sensor.type
              .toUpperCase() !==
            "N/A"
        )
        .sort(
          (a, b) =>
            a.slot - b.slot
        );
    }, [config]);

  // ===================================================
  // SENSOR NAME
  // ===================================================

  const getSensorName =
    useCallback(
      (
        sensor: SensorConfig
      ) => {
        if (
          sensor.name &&
          sensor.name.trim()
        ) {
          return sensor.name;
        }

        return getDefaultSensorName(
          sensor
        );
      },
      []
    );

  // ===================================================
  // GROUP SENSORS
  // ===================================================

  const groupedSensors =
    useMemo(() => {
      const groups: Record<
        SensorGroup,
        SensorConfig[]
      > = {
        temperature: [],
        humidity: [],
        current: [],
        voltage: [],
        power: [],
        energy: [],
      };

      for (const sensor of configuredSensors) {
        const group =
          getSensorGroup(
            sensor.type
          );

        if (group) {
          groups[group].push(
            sensor
          );
        }
      }

      return groups;
    }, [
      configuredSensors,
    ]);

  // ===================================================
  // BUILD SENSOR GROUP CHART
  // ===================================================

  const buildSensorChart =
    useCallback(
      (
        sensors: SensorConfig[]
      ): {
        data: ChartData[];
        series: TelemetrySeries[];
      } => {
        if (
          sensors.length === 0
        ) {
          return {
            data: [],
            series: [],
          };
        }

        const series: TelemetrySeries[] =
          sensors.map(
            (sensor) => ({
              key: `sensor_${sensor.slot}`,

              name:
                getSensorName(
                  sensor
                ),

              color:
                SENSOR_COLORS[
                  (sensor.slot - 1) %
                    SENSOR_COLORS.length
                ],
            })
          );

        const chartData: ChartData[] =
          data.map(
            (record) => {
              const row: ChartData =
                {
                  createdAt:
                    record.createdAt,

                  time:
                    formatChartTime(
                      record.createdAt,
                      range
                    ),
                };

              for (const sensor of sensors) {
                const reading =
                  record.sensors?.find(
                    (item) =>
                      item.slot ===
                      sensor.slot
                  );

                const value =
                  reading?.value;

                row[
                  `sensor_${sensor.slot}`
                ] =
                  typeof value ===
                    "number" &&
                  Number.isFinite(
                    value
                  )
                    ? value
                    : null;
              }

              return row;
            }
          );

        return {
          data: chartData,
          series,
        };
      },
      [
        data,
        range,
        getSensorName,
      ]
    );

  // ===================================================
  // CHART GROUPS
  // ===================================================

  const temperatureChart =
    useMemo(
      () =>
        buildSensorChart(
          groupedSensors.temperature
        ),
      [
        buildSensorChart,
        groupedSensors.temperature,
      ]
    );

  const humidityChart =
    useMemo(
      () =>
        buildSensorChart(
          groupedSensors.humidity
        ),
      [
        buildSensorChart,
        groupedSensors.humidity,
      ]
    );

  const currentChart =
    useMemo(
      () =>
        buildSensorChart(
          groupedSensors.current
        ),
      [
        buildSensorChart,
        groupedSensors.current,
      ]
    );

  const voltageChart =
    useMemo(
      () =>
        buildSensorChart(
          groupedSensors.voltage
        ),
      [
        buildSensorChart,
        groupedSensors.voltage,
      ]
    );

  const powerChart =
    useMemo(
      () =>
        buildSensorChart(
          groupedSensors.power
        ),
      [
        buildSensorChart,
        groupedSensors.power,
      ]
    );

  const energyChart =
    useMemo(
      () =>
        buildSensorChart(
          groupedSensors.energy
        ),
      [
        buildSensorChart,
        groupedSensors.energy,
      ]
    );

  // ===================================================
  // GENERIC SYSTEM TELEMETRY
  // ===================================================

  const genericChartData =
    useMemo(() => {
      return data.map(
        (item) => ({
          createdAt:
            item.createdAt,

          time:
            formatChartTime(
              item.createdAt,
              range
            ),

          current:
            validNumber(
              item.current
            ),

          voltage:
            validNumber(
              item.voltage
            ),

          power:
            validNumber(
              item.power
            ),

          energy:
            validNumber(
              item.energy
            ),
        })
      );
    }, [
      data,
      range,
    ]);

  // ===================================================
  // SUMMARY
  // ===================================================

  const rangeLabel =
    RANGE_OPTIONS.find(
      (item) =>
        item.value === range
    )?.description ??
    "Selected period";

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="space-y-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <Card
        className="
          overflow-hidden
          rounded-3xl
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <CardContent className="p-0">

          {/* Header */}

          <div
            className="
              relative
              overflow-hidden
              border-b
              border-slate-100
              p-5
              sm:p-6
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-64
                w-64
                rounded-full
                bg-primary/5
                blur-3xl
              "
            />

            <div
              className="
                relative
                flex
                flex-col
                gap-5
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* Title */}

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
                  <History
                    className="
                      h-5
                      w-5
                      text-primary
                    "
                  />
                </div>

                <div>
                  <h2
                    className="
                      text-lg
                      font-bold
                      tracking-tight
                      text-slate-900
                    "
                  >
                    Historical Telemetry
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-slate-400
                    "
                  >
                    {config?.deviceName ||
                      "Device"}{" "}
                    · {rangeLabel}
                  </p>
                </div>
              </div>

              {/* RANGE */}

              <div
                className="
                  flex
                  items-center
                  gap-1
                  overflow-x-auto
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-1
                "
              >
                {RANGE_OPTIONS.map(
                  (option) => {
                    const active =
                      range ===
                      option.value;

                    return (
                      <button
                        key={
                          option.value
                        }
                        type="button"
                        onClick={() =>
                          setRange(
                            option.value
                          )
                        }
                        className={`
                          shrink-0
                          rounded-lg
                          px-3
                          py-2
                          text-[11px]
                          font-bold
                          transition-all
                          duration-200
                          ${
                            active
                              ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
                              : "text-slate-400 hover:bg-white/70 hover:text-slate-600"
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Summary */}

          <div
            className="
              grid
              grid-cols-2
              divide-x
              divide-slate-100
              sm:grid-cols-3
            "
          >
            <SummaryItem
              icon={BarChart3}
              label="Records"
              value={
                data.length
              }
            />

            <SummaryItem
              icon={Activity}
              label="Sensors"
              value={
                configuredSensors.length
              }
            />

            <div className="hidden sm:block">
              <SummaryItem
                icon={Clock3}
                label="Refresh"
                value="10 sec"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {loading &&
        data.length === 0 && (
          <Card
            className="
              rounded-3xl
              border-slate-200
              bg-white
            "
          >
            <CardContent
              className="
                flex
                min-h-[180px]
                items-center
                justify-center
              "
            >
              <div
                className="
                  flex
                  flex-col
                  items-center
                  gap-3
                "
              >
                <Loader2
                  className="
                    h-7
                    w-7
                    animate-spin
                    text-primary
                  "
                />

                <p
                  className="
                    text-sm
                    text-slate-400
                  "
                >
                  Loading telemetry...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {!loading &&
        error && (
          <Card
            className="
              rounded-3xl
              border-red-200
              bg-red-50
            "
          >
            <CardContent className="p-5">
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
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-100
                  "
                >
                  <Activity
                    className="
                      h-4
                      w-4
                      text-red-600
                    "
                  />
                </div>

                <div>
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-red-700
                    "
                  >
                    Unable to load telemetry
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-red-600
                    "
                  >
                    {error}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {/* ================================================= */}
      {/* NO DATA */}
      {/* ================================================= */}

      {!loading &&
        !error &&
        data.length === 0 && (
          <Card
            className="
              rounded-3xl
              border-slate-200
              bg-white
            "
          >
            <CardContent
              className="
                flex
                min-h-[180px]
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-100
                "
              >
                <BarChart3
                  className="
                    h-5
                    w-5
                    text-slate-400
                  "
                />
              </div>

              <p
                className="
                  mt-4
                  text-sm
                  font-semibold
                  text-slate-700
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
                No telemetry data is available
                for this period.
              </p>
            </CardContent>
          </Card>
        )}

      {/* ================================================= */}
      {/* SENSOR CHARTS */}
      {/* ================================================= */}

      {temperatureChart.series
        .length > 0 && (
        <ChartSection
          icon={Activity}
          title="Temperature"
          subtitle="Temperature sensor history"
        >
          <TelemetryChart
            title="Temperature"
            data={
              temperatureChart.data
            }
            series={
              temperatureChart.series
            }
            unit="°C"
          />
        </ChartSection>
      )}

      {humidityChart.series
        .length > 0 && (
        <ChartSection
          icon={Droplets}
          title="Humidity"
          subtitle="Humidity sensor history"
        >
          <TelemetryChart
            title="Humidity"
            data={
              humidityChart.data
            }
            series={
              humidityChart.series
            }
            unit="%"
          />
        </ChartSection>
      )}

      {currentChart.series
        .length > 0 && (
        <ChartSection
          icon={Zap}
          title="Current"
          subtitle="Electrical current history"
        >
          <TelemetryChart
            title="Current"
            data={
              currentChart.data
            }
            series={
              currentChart.series
            }
            unit="A"
          />
        </ChartSection>
      )}

      {voltageChart.series
        .length > 0 && (
        <ChartSection
          icon={Gauge}
          title="Voltage"
          subtitle="Voltage sensor history"
        >
          <TelemetryChart
            title="Voltage"
            data={
              voltageChart.data
            }
            series={
              voltageChart.series
            }
            unit="V"
          />
        </ChartSection>
      )}

      {powerChart.series
        .length > 0 && (
        <ChartSection
          icon={Zap}
          title="Power"
          subtitle="Power consumption history"
        >
          <TelemetryChart
            title="Power"
            data={
              powerChart.data
            }
            series={
              powerChart.series
            }
            unit="W"
          />
        </ChartSection>
      )}

      {energyChart.series
        .length > 0 && (
        <ChartSection
          icon={Zap}
          title="Energy"
          subtitle="Energy consumption history"
        >
          <TelemetryChart
            title="Energy"
            data={
              energyChart.data
            }
            series={
              energyChart.series
            }
            unit="Wh"
          />
        </ChartSection>
      )}

      {/* ================================================= */}
      {/* SYSTEM TELEMETRY */}
      {/* ================================================= */}

      {data.length > 0 && (
        <div>
          <div
            className="
              mb-4
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-slate-100
              "
            >
              <Zap
                className="
                  h-4
                  w-4
                  text-slate-500
                "
              />
            </div>

            <div>
              <h2
                className="
                  text-base
                  font-bold
                  text-slate-800
                "
              >
                System Telemetry
              </h2>

              <p
                className="
                  text-xs
                  text-slate-400
                "
              >
                Device-level electrical measurements
              </p>
            </div>
          </div>

          <div className="space-y-5">

            {genericChartData.some(
              (item) =>
                item.current !==
                null
            ) && (
              <TelemetryChart
                title="System Current"
                data={
                  genericChartData
                }
                series={[
                  {
                    key: "current",
                    name: "Current",
                    color:
                      "#2563eb",
                  },
                ]}
                unit="A"
              />
            )}

            {genericChartData.some(
              (item) =>
                item.voltage !==
                null
            ) && (
              <TelemetryChart
                title="System Voltage"
                data={
                  genericChartData
                }
                series={[
                  {
                    key: "voltage",
                    name: "Voltage",
                    color:
                      "#16a34a",
                  },
                ]}
                unit="V"
              />
            )}

            {genericChartData.some(
              (item) =>
                item.power !==
                null
            ) && (
              <TelemetryChart
                title="System Power"
                data={
                  genericChartData
                }
                series={[
                  {
                    key: "power",
                    name: "Power",
                    color:
                      "#9333ea",
                  },
                ]}
                unit="W"
              />
            )}

            {genericChartData.some(
              (item) =>
                item.energy !==
                null
            ) && (
              <TelemetryChart
                title="System Energy"
                data={
                  genericChartData
                }
                series={[
                  {
                    key: "energy",
                    name: "Energy",
                    color:
                      "#ea580c",
                  },
                ]}
                unit="Wh"
              />
            )}

          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* EMPTY CONFIGURATION */}
      {/* ================================================= */}

      {!loading &&
        !error &&
        data.length > 0 &&
        configuredSensors.length ===
          0 && (
          <Card
            className="
              rounded-3xl
              border-slate-200
              bg-white
            "
          >
            <CardContent className="p-5">
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
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-amber-50
                  "
                >
                  <CalendarDays
                    className="
                      h-4
                      w-4
                      text-amber-500
                    "
                  />
                </div>

                <div>
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    No configured sensors
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-slate-400
                    "
                  >
                    Telemetry exists, but no
                    sensors are configured for
                    this device.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

// =====================================================
// SUMMARY ITEM
// =====================================================

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity;
  label: string;
  value: string | number;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        px-5
        py-4
      "
    >
      <Icon
        className="
          h-4
          w-4
          shrink-0
          text-slate-400
        "
      />

      <div>
        <p
          className="
            text-[9px]
            font-bold
            uppercase
            tracking-widest
            text-slate-400
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5
            text-sm
            font-bold
            text-slate-700
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// =====================================================
// CHART SECTION
// =====================================================

function ChartSection({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof Activity;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className="
          mb-3
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-primary/10
          "
        >
          <Icon
            className="
              h-4
              w-4
              text-primary
            "
          />
        </div>

        <div>
          <h2
            className="
              text-base
              font-bold
              text-slate-800
            "
          >
            {title}
          </h2>

          <p
            className="
              text-xs
              text-slate-400
            "
          >
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}

// =====================================================
// SENSOR GROUP
// =====================================================

function getSensorGroup(
  type: string
): SensorGroup | null {
  switch (
    type.toUpperCase()
  ) {
    case "TEMPERATURE":
    case "DHT_TEMPERATURE":
      return "temperature";

    case "HUMIDITY":
    case "DHT_HUMIDITY":
      return "humidity";

    case "CURRENT":
      return "current";

    case "VOLTAGE":
      return "voltage";

    case "POWER":
      return "power";

    case "ENERGY":
      return "energy";

    default:
      return null;
  }
}

// =====================================================
// DEFAULT SENSOR NAME
// =====================================================

function getDefaultSensorName(
  sensor: SensorConfig
): string {
  switch (
    sensor.type.toUpperCase()
  ) {
    case "TEMPERATURE":
      return `DS18B20 #${sensor.slot}`;

    case "DHT_TEMPERATURE":
      return "AM2302 Temperature";

    case "DHT_HUMIDITY":
      return "AM2302 Humidity";

    case "CONTACT":
      return "Contact";

    case "CURRENT":
      return "Current";

    case "VOLTAGE":
      return "Voltage";

    case "POWER":
      return "Power";

    case "ENERGY":
      return "Energy";

    default:
      return `Sensor #${sensor.slot}`;
  }
}

// =====================================================
// NUMBER VALIDATION
// =====================================================

function validNumber(
  value:
    | number
    | null
    | undefined
): number | null {
  return typeof value ===
    "number" &&
    Number.isFinite(value)
    ? value
    : null;
}

// =====================================================
// CHART TIME
// =====================================================

function formatChartTime(
  timestamp: string,
  range: Range
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

  if (
    range === "1h" ||
    range === "6h" ||
    range === "24h"
  ) {
    return date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  return date.toLocaleDateString(
    [],
    {
      month: "short",
      day: "numeric",
    }
  );
}