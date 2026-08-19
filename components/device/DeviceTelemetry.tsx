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

import TelemetryChart from "@/components/device/TelemetryChart";

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
// PROPS
// =====================================================

interface Props {
  deviceId: string;
}

// =====================================================
// SENSOR CHART DATA
// =====================================================

interface SensorChartData {
  createdAt: string;
  time: string;
  value: number | null;
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function DeviceTelemetry({
  deviceId,
}: Props) {
  const [range, setRange] =
    useState<Range>("24h");

  const [data, setData] =
    useState<TelemetryData[]>([]);

  const [config, setConfig] =
    useState<DeviceConfig | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

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
            result.success === false
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
  // INITIAL LOAD
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
      ).filter(
        (sensor) =>
          Number.isInteger(
            sensor.slot
          ) &&
          sensor.slot >= 1 &&
          sensor.slot <= 8
      );
    }, [config]);

  // ===================================================
  // SENSOR CHARTS
  // ===================================================

  const sensorCharts =
    useMemo(() => {
      return configuredSensors
        .map((sensor) => {
          const chartData: SensorChartData[] =
            data
              .map((record) => {
                const reading =
                  record.sensors?.find(
                    (item) =>
                      item.slot ===
                      sensor.slot
                  );

                const value =
                  reading?.value;

                return {
                  createdAt:
                    record.createdAt,

                  time:
                    formatChartTime(
                      record.createdAt,
                      range
                    ),

                  value:
                    typeof value ===
                      "number" &&
                    Number.isFinite(
                      value
                    )
                      ? value
                      : null,
                };
              })
              .filter(
                (item) =>
                  item.value !== null
              );

          return {
            sensor,
            chartData,
          };
        })
        .filter(
          ({ chartData }) =>
            chartData.length > 0
        );
    }, [
      configuredSensors,
      data,
      range,
    ]);

  // ===================================================
  // GENERIC TELEMETRY DATA
  //
  // These are kept for electrical/system
  // telemetry that is not represented by a
  // configured sensor slot.
  // ===================================================

  const genericChartData =
    useMemo(() => {
      return data.map(
        (item) => ({
          ...item,

          time:
            formatChartTime(
              item.createdAt,
              range
            ),
        })
      );
    }, [data, range]);

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="space-y-6">
      {/* =========================================== */}
      {/* HEADER */}
      {/* =========================================== */}

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

            {/* RANGE */}

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
                  sensorCharts.length
                }{" "}
                active sensors
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* =========================================== */}
      {/* CONFIGURED SENSOR HISTORY */}
      {/* =========================================== */}

      {sensorCharts.length >
        0 && (
        <div className="space-y-6">
          {sensorCharts.map(
            ({
              sensor,
              chartData,
            }) => {
              const title =
                sensor.name ||
                getDefaultSensorName(
                  sensor
                );

              const unit =
                sensor.unit ||
                getDefaultSensorUnit(
                  sensor
                );

              return (
                <TelemetryChart
                  key={
                    `sensor-${sensor.slot}`
                  }
                  title={`${title} — Slot ${sensor.slot}`}
                  data={chartData}
                  dataKey="value"
                  unit={unit}
                />
              );
            }
          )}
        </div>
      )}

      {/* =========================================== */}
      {/* NO SENSOR HISTORY */}
      {/* =========================================== */}

      {!loading &&
        !error &&
        data.length > 0 &&
        sensorCharts.length ===
          0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Sensor History
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                No configured sensor has
                numeric telemetry data in
                this period.
              </p>
            </CardContent>
          </Card>
        )}

      {/* =========================================== */}
      {/* ELECTRICAL TELEMETRY */}
      {/* =========================================== */}

      {data.length > 0 && (
        <>
          <div>
            <h2 className="mb-4 text-lg font-semibold">
              System Telemetry
            </h2>

            <div className="space-y-6">
              <TelemetryChart
                title="Current"
                data={
                  genericChartData
                }
                dataKey="current"
                unit="A"
              />

              <TelemetryChart
                title="Voltage"
                data={
                  genericChartData
                }
                dataKey="voltage"
                unit="V"
              />

              <TelemetryChart
                title="Power"
                data={
                  genericChartData
                }
                dataKey="power"
                unit="W"
              />

              <TelemetryChart
                title="Energy"
                data={
                  genericChartData
                }
                dataKey="energy"
                unit="Wh"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// =====================================================
// DEFAULT SENSOR NAME
// =====================================================

function getDefaultSensorName(
  sensor: SensorConfig
): string {
  switch (
    sensor.type
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

    default:
      return `Sensor #${sensor.slot}`;
  }
}

// =====================================================
// DEFAULT SENSOR UNIT
// =====================================================

function getDefaultSensorUnit(
  sensor: SensorConfig
): string {
  switch (
    sensor.type
  ) {
    case "TEMPERATURE":
    case "DHT_TEMPERATURE":
      return "°C";

    case "DHT_HUMIDITY":
      return "%";

    case "CURRENT":
      return "A";

    case "VOLTAGE":
      return "V";

    case "POWER":
      return "W";

    case "ENERGY":
      return "Wh";

    default:
      return "";
  }
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