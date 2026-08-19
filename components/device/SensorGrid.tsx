"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// =====================================================
// SENSOR CONFIGURATION
// =====================================================

interface SensorConfig {
  slot: number;
  type: string;
  name?: string;
  unit?: string;
}

// =====================================================
// DEVICE CONFIGURATION
// =====================================================

interface DeviceConfig {
  success?: boolean;

  deviceId: string;

  deviceName: string;

  sendInterval: number;

  sensors: SensorConfig[];

  error?: string;
}

// =====================================================
// SENSOR TELEMETRY
// =====================================================

interface SensorValue {
  slot: number;

  type: string;

  value:
    | number
    | null
    | undefined;
}

// =====================================================
// TELEMETRY
// =====================================================

interface Telemetry {
  _id?: string;

  deviceId?: string;

  createdAt: string;

  sensors?: SensorValue[];

  temperature?: number | null;

  humidity?: number | null;

  current?: number | null;

  voltage?: number | null;

  power?: number | null;

  energy?: number | null;
}

// =====================================================
// TELEMETRY RESPONSE
// =====================================================

interface TelemetryResponse {
  success: boolean;

  deviceId: string;

  data: Telemetry[];

  error?: string;
}

// =====================================================
// PROPS
// =====================================================

interface Props {
  deviceId: string;
}

// =====================================================
// SENSOR NAME
// =====================================================

function getSensorName(
  sensor: SensorConfig
): string {
  if (
    typeof sensor.name === "string" &&
    sensor.name.trim()
  ) {
    return sensor.name.trim();
  }

  switch (
    sensor.type
      .trim()
      .toUpperCase()
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

    case "N/A":
      return "Unused";

    default:
      return `Sensor #${sensor.slot}`;
  }
}

// =====================================================
// SENSOR UNIT
// =====================================================

function getSensorUnit(
  sensor: SensorConfig
): string {
  // -----------------------------------------
  // Use configured unit first
  // -----------------------------------------

  if (
    typeof sensor.unit === "string"
  ) {
    return sensor.unit.trim();
  }

  // -----------------------------------------
  // Otherwise use type default
  // -----------------------------------------

  switch (
    sensor.type
      .trim()
      .toUpperCase()
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
      return "kWh";

    default:
      return "";
  }
}

// =====================================================
// FORMAT SENSOR VALUE
// =====================================================

function formatSensorValue(
  sensor: SensorConfig,
  value:
    | number
    | null
    | undefined
): string {
  // -----------------------------------------
  // N/A SENSOR
  // -----------------------------------------

  if (
    sensor.type
      .trim()
      .toUpperCase() ===
    "N/A"
  ) {
    return "N/A";
  }

  // -----------------------------------------
  // NO VALUE
  // -----------------------------------------

  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "N/A";
  }

  // -----------------------------------------
  // CONTACT
  // -----------------------------------------

  if (
    sensor.type
      .trim()
      .toUpperCase() ===
    "CONTACT"
  ) {
    return value === 1
      ? "ON"
      : "OFF";
  }

  // -----------------------------------------
  // NUMBER FORMAT
  // -----------------------------------------

  const type =
    sensor.type
      .trim()
      .toUpperCase();

  let decimals = 2;

  if (
    type === "TEMPERATURE" ||
    type === "DHT_TEMPERATURE" ||
    type === "DHT_HUMIDITY"
  ) {
    decimals = 1;
  }

  if (
    type === "VOLTAGE"
  ) {
    decimals = 1;
  }

  if (
    type === "CURRENT"
  ) {
    decimals = 2;
  }

  if (
    type === "POWER"
  ) {
    decimals = 1;
  }

  const formatted =
    value.toFixed(decimals);

  const unit =
    getSensorUnit(sensor);

  if (!unit) {
    return formatted;
  }

  return `${formatted} ${unit}`;
}

// =====================================================
// COMPONENT
// =====================================================

export default function SensorGrid({
  deviceId,
}: Props) {
  const [config, setConfig] =
    useState<DeviceConfig | null>(
      null
    );

  const [values, setValues] =
    useState<SensorValue[]>([]);

  const [lastUpdated, setLastUpdated] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ===================================================
  // LOAD CONFIG + TELEMETRY
  // ===================================================

  const loadData = useCallback(
    async () => {
      try {
        // -------------------------------------------
        // CONFIG
        // -------------------------------------------

        const configResponse =
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

        if (
          !configResponse.ok
        ) {
          throw new Error(
            "Failed to load device configuration"
          );
        }

        const deviceConfig =
          (await configResponse.json()) as DeviceConfig;

        if (
          deviceConfig.success ===
            false
        ) {
          throw new Error(
            deviceConfig.error ||
              "Failed to load device configuration"
          );
        }

        // -------------------------------------------
        // TELEMETRY
        // -------------------------------------------

        const telemetryResponse =
          await fetch(
            `/api/devices/${encodeURIComponent(
              deviceId
            )}/telemetry?limit=1`,
            {
              method: "GET",

              cache: "no-store",

              headers: {
                Accept:
                  "application/json",
              },
            }
          );

        if (
          !telemetryResponse.ok
        ) {
          throw new Error(
            "Failed to load sensor telemetry"
          );
        }

        const telemetry =
          (await telemetryResponse.json()) as TelemetryResponse;

        if (
          !telemetry.success
        ) {
          throw new Error(
            telemetry.error ||
              "Failed to load sensor telemetry"
          );
        }

        // -------------------------------------------
        // LATEST RECORD
        // -------------------------------------------

        const records =
          telemetry.data ?? [];

        const latest =
          records.length > 0
            ? records[
                records.length - 1
              ]
            : null;

        // -------------------------------------------
        // SAVE CONFIG
        // -------------------------------------------

        setConfig(
          deviceConfig
        );

        // -------------------------------------------
        // SAVE SENSOR VALUES
        // -------------------------------------------

        setValues(
          latest?.sensors ?? []
        );

        // -------------------------------------------
        // LAST UPDATED
        // -------------------------------------------

        setLastUpdated(
          latest?.createdAt ??
            null
        );

        // -------------------------------------------
        // CLEAR ERROR
        // -------------------------------------------

        setError(null);
      } catch (err) {
        console.error(
          "[SensorGrid]",
          err
        );

        // -------------------------------------------
        // Don't remove already-loaded data
        // -------------------------------------------

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load sensor data"
        );
      } finally {
        setLoading(false);
      }
    },
    [deviceId]
  );

  // ===================================================
  // INITIAL LOAD + REFRESH
  // ===================================================

  useEffect(() => {
    loadData();

    const interval =
      setInterval(
        loadData,
        10000
      );

    return () => {
      clearInterval(interval);
    };
  }, [loadData]);

  // ===================================================
  // INITIAL LOADING
  // ===================================================

  if (
    loading &&
    !config
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Sensors
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Loading sensors...
          </p>
        </CardContent>
      </Card>
    );
  }

  // ===================================================
  // CONFIGURATION ERROR
  // ===================================================

  if (
    !config
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Sensors
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-destructive">
            {error ||
              "Failed to load sensor configuration"}
          </p>
        </CardContent>
      </Card>
    );
  }

  // ===================================================
  // CONFIGURED SENSORS
  // ===================================================

  const configuredSensors =
    Array.isArray(
      config.sensors
    )
      ? [...config.sensors].sort(
          (a, b) =>
            a.slot - b.slot
        )
      : [];

  // ===================================================
  // NO SENSORS
  // ===================================================

  if (
    configuredSensors.length ===
    0
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Sensors
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            No sensors configured.
          </p>
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              Sensors
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Configured sensor readings
            </p>
          </div>

          {error ? (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
              Refresh issue
            </span>
          ) : (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Live
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* ----------------------------------------- */}
        {/* SENSOR GRID */}
        {/* ----------------------------------------- */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {configuredSensors.map(
            (sensor) => {
              // -------------------------------------
              // FIND TELEMETRY BY SLOT
              // -------------------------------------

              const reading =
                values.find(
                  (value) =>
                    value.slot ===
                    sensor.slot
                );

              // -------------------------------------
              // VALUE
              // -------------------------------------

              const value =
                reading?.value;

              // -------------------------------------
              // SENSOR NAME
              // -------------------------------------

              const name =
                getSensorName(
                  sensor
                );

              // -------------------------------------
              // SENSOR TYPE
              // -------------------------------------

              const type =
                sensor.type ||
                "N/A";

              // -------------------------------------
              // SENSOR UNIT
              // -------------------------------------

              const unit =
                getSensorUnit(
                  sensor
                );

              // -------------------------------------
              // VALUE TEXT
              // -------------------------------------

              const displayValue =
                formatSensorValue(
                  sensor,
                  value
                );

              // -------------------------------------
              // IS N/A?
              // -------------------------------------

              const isUnused =
                type
                  .trim()
                  .toUpperCase() ===
                "N/A";

              return (
                <div
                  key={
                    sensor.slot
                  }
                  className="rounded-xl border p-4 transition-shadow hover:shadow-md"
                >
                  {/* ----------------------------- */}
                  {/* HEADER */}
                  {/* ----------------------------- */}

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {name}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Slot{" "}
                        {sensor.slot}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-[10px] font-medium">
                      {type}
                    </span>
                  </div>

                  {/* ----------------------------- */}
                  {/* VALUE */}
                  {/* ----------------------------- */}

                  <div className="mt-5">
                    <p
                      className={
                        isUnused
                          ? "text-2xl font-semibold text-muted-foreground"
                          : "text-2xl font-semibold"
                      }
                    >
                      {displayValue}
                    </p>
                  </div>

                  {/* ----------------------------- */}
                  {/* UNIT */}
                  {/* ----------------------------- */}

                  {!isUnused &&
                    unit && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Unit:{" "}
                        {unit}
                      </p>
                    )}
                </div>
              );
            }
          )}
        </div>

        {/* ----------------------------------------- */}
        {/* LAST UPDATED */}
        {/* ----------------------------------------- */}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {lastUpdated
              ? `Last update: ${new Date(
                  lastUpdated
                ).toLocaleString()}`
              : "No telemetry received yet"}
          </span>

          <span>
            Refresh: 10s
          </span>
        </div>

        {/* ----------------------------------------- */}
        {/* TEMPORARY ERROR */}
        {/* ----------------------------------------- */}

        {error && (
          <p className="mt-3 text-xs text-yellow-600">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}