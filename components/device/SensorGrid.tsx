"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SensorConfig {
  slot: number;
  type: string;
  name?: string;
  unit?: string;
}

interface DeviceConfig {
  deviceId: string;
  deviceName: string;
  sendInterval: number;
  sensors: SensorConfig[];
}

interface SensorValue {
  slot: number;
  type: string;
  value?: number | null;
}

interface Telemetry {
  sensors?: SensorValue[];
  createdAt: string;
}

interface TelemetryResponse {
  success: boolean;
  deviceId: string;
  data: Telemetry[];
  error?: string;
}

interface Props {
  deviceId: string;
}

function getSensorName(
  sensor: SensorConfig
): string {
  if (sensor.name) {
    return sensor.name;
  }

  switch (sensor.type) {
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

function getSensorUnit(
  sensor: SensorConfig
): string {
  if (sensor.unit) {
    return sensor.unit;
  }

  switch (sensor.type) {
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

    default:
      return "";
  }
}

function formatValue(
  sensor: SensorConfig,
  value: number | null | undefined
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "N/A";
  }

  if (sensor.type === "CONTACT") {
    return value === 1
      ? "ON"
      : "OFF";
  }

  const unit =
    getSensorUnit(sensor);

  const formatted =
    Number.isInteger(value)
      ? String(value)
      : value.toFixed(2);

  return unit
    ? `${formatted} ${unit}`
    : formatted;
}

export default function SensorGrid({
  deviceId,
}: Props) {
  const [config, setConfig] =
    useState<DeviceConfig | null>(null);

  const [values, setValues] =
    useState<SensorValue[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadData = useCallback(
    async () => {
      try {
        const [
          configResponse,
          telemetryResponse,
        ] = await Promise.all([
          fetch(
            `/api/config/${encodeURIComponent(
              deviceId
            )}`,
            {
              cache: "no-store",
            }
          ),

          fetch(
            `/api/devices/${encodeURIComponent(
              deviceId
            )}/telemetry?limit=1`,
            {
              cache: "no-store",
            }
          ),
        ]);

        if (!configResponse.ok) {
          throw new Error(
            "Failed to load device configuration"
          );
        }

        if (!telemetryResponse.ok) {
          throw new Error(
            "Failed to load sensor telemetry"
          );
        }

        const deviceConfig =
          (await configResponse.json()) as DeviceConfig;

        const telemetry =
          (await telemetryResponse.json()) as TelemetryResponse;

        if (!telemetry.success) {
          throw new Error(
            telemetry.error ||
              "Failed to load telemetry"
          );
        }

        const latest =
          telemetry.data?.[
            telemetry.data.length - 1
          ];

        setConfig(deviceConfig);
        setValues(
          latest?.sensors ?? []
        );

        setError(null);
      } catch (err) {
        console.error(
          "[SensorGrid]",
          err
        );

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

  useEffect(() => {
    loadData();

    const interval = setInterval(
      loadData,
      10000
    );

    return () => {
      clearInterval(interval);
    };
  }, [loadData]);

  if (loading) {
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

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Sensors
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-destructive">
            {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  const configuredSensors =
    config?.sensors ?? [];

  if (configuredSensors.length === 0) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Sensors
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {configuredSensors.map(
            (sensor) => {
              const reading =
                values.find(
                  (value) =>
                    value.slot ===
                    sensor.slot
                );

              return (
                <div
                  key={sensor.slot}
                  className="rounded-lg border p-4"
                >
                  <p className="text-sm text-muted-foreground">
                    {getSensorName(
                      sensor
                    )}
                  </p>

                  <p className="mt-2 text-2xl font-semibold">
                    {formatValue(
                      sensor,
                      reading?.value
                    )}
                  </p>

                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Slot {sensor.slot}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {sensor.type}
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </CardContent>
    </Card>
  );
}