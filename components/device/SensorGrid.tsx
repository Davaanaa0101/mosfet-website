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
  if (sensor.name?.trim()) {
    return sensor.name.trim();
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

    case "N/A":
      return `Sensor #${sensor.slot}`;

    default:
      return `Sensor #${sensor.slot}`;
  }
}

function getSensorUnit(
  sensor: SensorConfig
): string {
  if (sensor.unit?.trim()) {
    return sensor.unit.trim();
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
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "N/A";
  }

  if (sensor.type === "CONTACT") {
    return value === 1 ? "ON" : "OFF";
  }

  const unit = getSensorUnit(sensor);

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
        const encodedDeviceId =
          encodeURIComponent(deviceId);

        const [
          configResponse,
          telemetryResponse,
        ] = await Promise.all([
          // ---------------------------------------
          // DEVICE CONFIGURATION
          // ---------------------------------------
          fetch(
            `/api/devices/${encodedDeviceId}/config`,
            {
              cache: "no-store",
            }
          ),

          // ---------------------------------------
          // LATEST TELEMETRY
          // ---------------------------------------
          fetch(
            `/api/devices/${encodedDeviceId}/telemetry?limit=1`,
            {
              cache: "no-store",
            }
          ),
        ]);

        // -----------------------------------------
        // CONFIG RESPONSE
        // -----------------------------------------

        if (!configResponse.ok) {
          const configText =
            await configResponse.text();

          console.error(
            "[SensorGrid] Config request failed:",
            configResponse.status,
            configText
          );

          throw new Error(
            "Failed to load device configuration"
          );
        }

        // -----------------------------------------
        // TELEMETRY RESPONSE
        // -----------------------------------------

        if (!telemetryResponse.ok) {
          const telemetryText =
            await telemetryResponse.text();

          console.error(
            "[SensorGrid] Telemetry request failed:",
            telemetryResponse.status,
            telemetryText
          );

          throw new Error(
            "Failed to load sensor telemetry"
          );
        }

        // -----------------------------------------
        // PARSE RESPONSES
        // -----------------------------------------

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

        // -----------------------------------------
        // LATEST TELEMETRY
        // -----------------------------------------

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

  // -------------------------------------------
  // INITIAL LOAD + AUTO REFRESH
  // -------------------------------------------

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

  // -------------------------------------------
  // LOADING
  // -------------------------------------------

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

  // -------------------------------------------
  // ERROR
  // -------------------------------------------

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

  // -------------------------------------------
  // CONFIGURED SENSORS
  // -------------------------------------------

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

  // Hide unused N/A slots.
  const visibleSensors =
    configuredSensors.filter(
      (sensor) =>
        sensor.type !== "N/A"
    );

  if (visibleSensors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Sensors
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            No active sensors configured.
          </p>
        </CardContent>
      </Card>
    );
  }

  // -------------------------------------------
  // RENDER
  // -------------------------------------------

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Sensors
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleSensors.map(
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
                  className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
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

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                      Slot {sensor.slot}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
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