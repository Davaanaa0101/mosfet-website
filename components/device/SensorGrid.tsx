"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Sensor {
  slot: number;
  type: string;
  value?: number | null;
}

interface Telemetry {
  sensors?: Sensor[];
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
  sensor: Sensor
): string {
  if (sensor.type === "TEMPERATURE") {
    return `DS18B20 #${sensor.slot}`;
  }

  if (sensor.type === "DHT_TEMPERATURE") {
    return "AM2302 Temperature";
  }

  if (sensor.type === "DHT_HUMIDITY") {
    return "AM2302 Humidity";
  }

  if (sensor.type === "CONTACT") {
    return "Contact";
  }

  if (sensor.type === "CURRENT") {
    return "Current";
  }

  if (sensor.type === "VOLTAGE") {
    return "Voltage";
  }

  if (sensor.type === "POWER") {
    return "Power";
  }

  return `Sensor #${sensor.slot}`;
}

function getSensorUnit(
  sensor: Sensor
): string {
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

function formatSensorValue(
  sensor: Sensor
): string {
  if (
    sensor.value === null ||
    sensor.value === undefined
  ) {
    return "N/A";
  }

  const unit =
    getSensorUnit(sensor);

  if (
    sensor.type === "CONTACT"
  ) {
    return sensor.value === 1
      ? "ON"
      : "OFF";
  }

  const value =
    Number.isInteger(sensor.value)
      ? String(sensor.value)
      : sensor.value.toFixed(2);

  return unit
    ? `${value} ${unit}`
    : value;
}

export default function SensorGrid({
  deviceId,
}: Props) {
  const [sensors, setSensors] =
    useState<Sensor[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadSensors = useCallback(
    async () => {
      try {
        const response = await fetch(
          `/api/devices/${encodeURIComponent(
            deviceId
          )}/telemetry?limit=1`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load sensors"
          );
        }

        const result =
          (await response.json()) as TelemetryResponse;

        if (!result.success) {
          throw new Error(
            result.error ||
              "Failed to load sensors"
          );
        }

        const latest =
          result.data?.[
            result.data.length - 1
          ];

        setSensors(
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
            : "Failed to load sensors"
        );
      } finally {
        setLoading(false);
      }
    },
    [deviceId]
  );

  useEffect(() => {
    loadSensors();

    const interval = setInterval(
      loadSensors,
      10000
    );

    return () => {
      clearInterval(interval);
    };
  }, [loadSensors]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Sensors
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading && (
          <p className="text-sm text-muted-foreground">
            Loading sensors...
          </p>
        )}

        {!loading && error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          sensors.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No sensor data available.
            </p>
          )}

        {!loading &&
          !error &&
          sensors.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {sensors.map((sensor) => (
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
                    {formatSensorValue(
                      sensor
                    )}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Slot {sensor.slot}
                  </p>
                </div>
              ))}
            </div>
          )}
      </CardContent>
    </Card>
  );
}