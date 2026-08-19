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

interface SensorConfig {
  slot: number;
  type: string;
  name: string;
  unit: string;
}

interface DeviceConfig {
  deviceId: string;
  deviceName: string;
  sendInterval: number;
  sensors: SensorConfig[];
}

interface Props {
  deviceId: string;
}

const SENSOR_TYPES = [
  "N/A",
  "TEMPERATURE",
  "DHT_TEMPERATURE",
  "DHT_HUMIDITY",
  "CONTACT",
  "CURRENT",
  "VOLTAGE",
  "POWER",
];

export default function DeviceConfiguration({
  deviceId,
}: Props) {
  const [config, setConfig] =
    useState<DeviceConfig | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  // -----------------------------------------
  // LOAD CONFIGURATION
  // -----------------------------------------

  const loadConfig = useCallback(
    async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/devices/${encodeURIComponent(
            deviceId
          )}/config`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load device configuration"
          );
        }

        const data =
          (await response.json()) as DeviceConfig;

        setConfig({
          deviceId:
            data.deviceId,

          deviceName:
            data.deviceName ||
            data.deviceId,

          sendInterval:
            data.sendInterval,

          sensors:
            Array.isArray(data.sensors)
              ? data.sensors
              : [],
        });
      } catch (err) {
        console.error(
          "[DeviceConfiguration]",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load configuration"
        );
      } finally {
        setLoading(false);
      }
    },
    [deviceId]
  );

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // -----------------------------------------
  // UPDATE DEVICE NAME
  // -----------------------------------------

  function updateDeviceName(
    value: string
  ) {
    setConfig((current) =>
      current
        ? {
            ...current,
            deviceName: value,
          }
        : current
    );
  }

  // -----------------------------------------
  // UPDATE SEND INTERVAL
  // -----------------------------------------

  function updateSendInterval(
    value: string
  ) {
    const numberValue =
      Number(value);

    setConfig((current) =>
      current
        ? {
            ...current,
            sendInterval:
              Number.isFinite(
                numberValue
              )
                ? numberValue
                : 1000,
          }
        : current
    );
  }

  // -----------------------------------------
  // UPDATE SENSOR
  // -----------------------------------------

  function updateSensor(
    slot: number,
    field: keyof SensorConfig,
    value: string
  ) {
    setConfig((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,

        sensors:
          current.sensors.map(
            (sensor) =>
              sensor.slot === slot
                ? {
                    ...sensor,
                    [field]: value,
                  }
                : sensor
          ),
      };
    });
  }

  // -----------------------------------------
  // SAVE
  // -----------------------------------------

  async function saveConfig() {
    if (!config) {
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      if (
        !config.deviceName.trim()
      ) {
        throw new Error(
          "Device name is required"
        );
      }

      if (
        !Number.isFinite(
          config.sendInterval
        ) ||
        config.sendInterval < 1000
      ) {
        throw new Error(
          "Send interval must be at least 1000 ms"
        );
      }

      const response = await fetch(
        `/api/devices/${encodeURIComponent(
          deviceId
        )}/config`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            deviceName:
              config.deviceName.trim(),

            sendInterval:
              config.sendInterval,

            sensors:
              config.sensors.map(
                (sensor) => ({
                  slot: sensor.slot,

                  type: sensor.type,

                  name:
                    sensor.name.trim(),

                  unit:
                    sensor.unit.trim(),
                })
              ),
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to save configuration"
        );
      }

      setConfig({
        deviceId:
          result.deviceId,

        deviceName:
          result.deviceName,

        sendInterval:
          result.sendInterval,

        sensors:
          result.sensors ?? [],
      });

      setMessage(
        "Configuration saved successfully."
      );
    } catch (err) {
      console.error(
        "[DeviceConfiguration] Save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save configuration"
      );
    } finally {
      setSaving(false);
    }
  }

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Device Configuration
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Loading configuration...
          </p>
        </CardContent>
      </Card>
    );
  }

  // -----------------------------------------
  // ERROR
  // -----------------------------------------

  if (error && !config) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Device Configuration
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

  if (!config) {
    return null;
  }

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Device Configuration
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* ---------------------------------- */}
        {/* BASIC CONFIGURATION */}
        {/* ---------------------------------- */}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="deviceName"
              className="text-sm font-medium"
            >
              Device Name
            </label>

            <input
              id="deviceName"
              type="text"
              value={
                config.deviceName
              }
              onChange={(event) =>
                updateDeviceName(
                  event.target.value
                )
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="Device name"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="sendInterval"
              className="text-sm font-medium"
            >
              Send Interval
            </label>

            <div className="flex items-center gap-2">
              <input
                id="sendInterval"
                type="number"
                min={1000}
                step={1000}
                value={
                  config.sendInterval
                }
                onChange={(event) =>
                  updateSendInterval(
                    event.target.value
                  )
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />

              <span className="text-sm text-muted-foreground">
                ms
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Minimum 1000 ms.
            </p>
          </div>
        </div>

        {/* ---------------------------------- */}
        {/* SENSOR CONFIGURATION */}
        {/* ---------------------------------- */}

        <div>
          <div className="mb-4">
            <h3 className="font-semibold">
              Sensors
            </h3>

            <p className="text-sm text-muted-foreground">
              Configure the sensors connected
              to this device.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">
                    Slot
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Type
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Name
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Unit
                  </th>
                </tr>
              </thead>

              <tbody>
                {config.sensors.map(
                  (sensor) => (
                    <tr
                      key={sensor.slot}
                      className="border-b last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex h-9 w-12 items-center justify-center rounded-md bg-muted font-medium">
                          {sensor.slot}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <select
                          value={
                            sensor.type
                          }
                          onChange={(event) =>
                            updateSensor(
                              sensor.slot,
                              "type",
                              event.target.value
                            )
                          }
                          className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                        >
                          {SENSOR_TYPES.map(
                            (type) => (
                              <option
                                key={type}
                                value={type}
                              >
                                {type}
                              </option>
                            )
                          )}
                        </select>
                      </td>

                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={
                            sensor.name
                          }
                          onChange={(event) =>
                            updateSensor(
                              sensor.slot,
                              "name",
                              event.target.value
                            )
                          }
                          className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Sensor name"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={
                            sensor.unit
                          }
                          onChange={(event) =>
                            updateSensor(
                              sensor.slot,
                              "unit",
                              event.target.value
                            )
                          }
                          className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                          placeholder="°C"
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---------------------------------- */}
        {/* STATUS */}
        {/* ---------------------------------- */}

        {message && (
          <div className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* ---------------------------------- */}
        {/* SAVE */}
        {/* ---------------------------------- */}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={saveConfig}
            disabled={saving}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Configuration"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}