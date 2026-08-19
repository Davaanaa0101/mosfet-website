"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
}[] = [
  {
    value: "1h",
    label: "1H",
  },
  {
    value: "6h",
    label: "6H",
  },
  {
    value: "24h",
    label: "24H",
  },
  {
    value: "7d",
    label: "7D",
  },
  {
    value: "30d",
    label: "30D",
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
//
// Color is determined by SLOT.
// Therefore:
//
// Slot 1 -> always same color
// Slot 2 -> always same color
// Slot 5 -> always same color
// Slot 6 -> always same color
//
// =====================================================

const SENSOR_COLORS = [
  "#2563eb", // Slot 1 - Blue
  "#dc2626", // Slot 2 - Red
  "#16a34a", // Slot 3 - Green
  "#9333ea", // Slot 4 - Purple
  "#ea580c", // Slot 5 - Orange
  "#0891b2", // Slot 6 - Cyan
  "#db2777", // Slot 7 - Pink
  "#65a30d", // Slot 8 - Lime
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
    useCallback(async () => {
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
    }, [deviceId]);

  // ===================================================
  // LOAD TELEMETRY
  // ===================================================

  const loadTelemetry =
    useCallback(async () => {
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
    }, [
      deviceId,
      range,
    ]);

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
      }, 10000);

    return () => {
      clearInterval(
        interval
      );
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

        // ---------------------------------------------
        // SERIES
        // ---------------------------------------------

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
                  (sensor.slot -
                    1) %
                    SENSOR_COLORS.length
                ],
            })
          );

        // ---------------------------------------------
        // DATA
        // ---------------------------------------------

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
  // RENDER
  // ===================================================

  return (
    <div className="space-y-6">

      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <CardTitle>
                Historical Telemetry
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                {config?.deviceName ||
                  "Device"}{" "}
                sensor history
              </p>
            </div>

            {/* RANGE SELECTOR */}

            <div className="flex flex-wrap gap-2">
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
                      className={[
                        "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-muted",
                      ].join(" ")}
                    >
                      {
                        option.label
                      }
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading &&
            data.length ===
              0 && (
              <p className="text-sm text-muted-foreground">
                Loading telemetry...
              </p>
            )}

          {!loading &&
            error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}

          {!loading &&
            !error &&
            data.length ===
              0 && (
              <p className="text-sm text-muted-foreground">
                No telemetry data available for this period.
              </p>
            )}

          {data.length >
            0 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                {data.length} telemetry
                records ·{" "}
                {range.toUpperCase()}
              </p>

              <p className="text-xs text-muted-foreground">
                {
                  configuredSensors.length
                }{" "}
                configured sensors
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ============================================= */}
      {/* TEMPERATURE */}
      {/* ============================================= */}

      {temperatureChart.series
        .length > 0 && (
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
      )}

      {/* ============================================= */}
      {/* HUMIDITY */}
      {/* ============================================= */}

      {humidityChart.series
        .length > 0 && (
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
      )}

      {/* ============================================= */}
      {/* CURRENT */}
      {/* ============================================= */}

      {currentChart.series
        .length > 0 && (
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
      )}

      {/* ============================================= */}
      {/* VOLTAGE */}
      {/* ============================================= */}

      {voltageChart.series
        .length > 0 && (
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
      )}

      {/* ============================================= */}
      {/* POWER */}
      {/* ============================================= */}

      {powerChart.series
        .length > 0 && (
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
      )}

      {/* ============================================= */}
      {/* ENERGY */}
      {/* ============================================= */}

      {energyChart.series
        .length > 0 && (
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
      )}

      {/* ============================================= */}
      {/* SYSTEM TELEMETRY */}
      {/* ============================================= */}

      {data.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            System Telemetry
          </h2>

          <div className="space-y-6">

            {/* CURRENT */}

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

            {/* VOLTAGE */}

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

            {/* POWER */}

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

            {/* ENERGY */}

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

      {/* ============================================= */}
      {/* EMPTY */}
      {/* ============================================= */}

      {!loading &&
        !error &&
        data.length > 0 &&
        configuredSensors.length ===
          0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Sensor History
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                No configured sensors found.
              </p>
            </CardContent>
          </Card>
        )}
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
  return (
    typeof value ===
      "number" &&
    Number.isFinite(value)
  )
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