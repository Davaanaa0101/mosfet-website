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
// TYPES
// =====================================================

interface SensorConfig {
  slot: number;
  type: string;
  name: string;
  unit: string;
}

interface DeviceConfig {
  deviceId: string;
  deviceName: string;

  // IMPORTANT:
  // Backend / ESP32 continues to use milliseconds.
  sendInterval: number;

  sensors: SensorConfig[];
}

type IntervalUnit =
  | "seconds"
  | "minutes"
  | "hours";

interface Props {
  deviceId: string;
}

// =====================================================
// SENSOR TYPES
// =====================================================

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

// =====================================================
// INTERVAL CONSTANTS
// =====================================================

const SECOND_MS = 1000;

const MINUTE_MS =
  60 * SECOND_MS;

const HOUR_MS =
  60 * MINUTE_MS;

const MIN_INTERVAL_MS =
  SECOND_MS;

// =====================================================
// INTERVAL HELPERS
// =====================================================

function intervalToMilliseconds(
  value: number,
  unit: IntervalUnit
): number {
  const safeValue =
    Math.max(
      1,
      Number.isFinite(value)
        ? value
        : 1
    );

  switch (unit) {
    case "seconds":
      return (
        safeValue *
        SECOND_MS
      );

    case "minutes":
      return (
        safeValue *
        MINUTE_MS
      );

    case "hours":
      return (
        safeValue *
        HOUR_MS
      );

    default:
      return (
        safeValue *
        SECOND_MS
      );
  }
}

function millisecondsToInterval(
  milliseconds: number
): {
  value: number;
  unit: IntervalUnit;
} {
  const safeMilliseconds =
    Math.max(
      MIN_INTERVAL_MS,
      Number.isFinite(
        milliseconds
      )
        ? milliseconds
        : MIN_INTERVAL_MS
    );

  // Exact hours
  if (
    safeMilliseconds >=
      HOUR_MS &&
    safeMilliseconds %
      HOUR_MS ===
      0
  ) {
    return {
      value:
        safeMilliseconds /
        HOUR_MS,
      unit: "hours",
    };
  }

  // Exact minutes
  if (
    safeMilliseconds >=
      MINUTE_MS &&
    safeMilliseconds %
      MINUTE_MS ===
      0
  ) {
    return {
      value:
        safeMilliseconds /
        MINUTE_MS,
      unit: "minutes",
    };
  }

  // Seconds
  return {
    value: Math.max(
      1,
      Math.round(
        safeMilliseconds /
          SECOND_MS
      )
    ),
    unit: "seconds",
  };
}

function getIntervalUnitLabel(
  unit: IntervalUnit,
  value: number
): string {
  const singular =
    value === 1;

  switch (unit) {
    case "seconds":
      return singular
        ? "second"
        : "seconds";

    case "minutes":
      return singular
        ? "minute"
        : "minutes";

    case "hours":
      return singular
        ? "hour"
        : "hours";

    default:
      return "seconds";
  }
}

function formatIntervalPreview(
  value: number,
  unit: IntervalUnit
): string {
  const safeValue =
    Math.max(
      1,
      Number.isFinite(value)
        ? value
        : 1
    );

  return `${safeValue} ${getIntervalUnitLabel(
    unit,
    safeValue
  )}`;
}

// =====================================================
// COMPONENT
// =====================================================

export default function DeviceConfiguration({
  deviceId,
}: Props) {
  const [config, setConfig] =
    useState<DeviceConfig | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(
      null
    );

  const [error, setError] =
    useState<string | null>(
      null
    );

  // ===================================================
  // USER-FRIENDLY INTERVAL STATE
  // ===================================================

  const [
    intervalValue,
    setIntervalValue,
  ] = useState<number>(10);

  const [
    intervalUnit,
    setIntervalUnit,
  ] =
    useState<IntervalUnit>(
      "seconds"
    );

  // ===================================================
  // LOAD CONFIGURATION
  // ===================================================

  const loadConfig =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError(null);

          const response =
            await fetch(
              `/api/devices/${encodeURIComponent(
                deviceId
              )}/config`,
              {
                cache:
                  "no-store",
              }
            );

          if (!response.ok) {
            throw new Error(
              "Failed to load device configuration"
            );
          }

          const data =
            (await response.json()) as DeviceConfig;

          // -------------------------------------------
          // Convert milliseconds → user-friendly unit
          // -------------------------------------------

          const interval =
            millisecondsToInterval(
              data.sendInterval
            );

          setIntervalValue(
            interval.value
          );

          setIntervalUnit(
            interval.unit
          );

          // -------------------------------------------
          // Store configuration
          // -------------------------------------------

          setConfig({
            deviceId:
              data.deviceId,

            deviceName:
              data.deviceName ||
              data.deviceId,

            sendInterval:
              data.sendInterval,

            sensors:
              Array.isArray(
                data.sensors
              )
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

  // ===================================================
  // UPDATE DEVICE NAME
  // ===================================================

  function updateDeviceName(
    value: string
  ) {
    setConfig(
      (current) =>
        current
          ? {
              ...current,
              deviceName:
                value,
            }
          : current
    );
  }

  // ===================================================
  // UPDATE INTERVAL VALUE
  // ===================================================

  function updateIntervalValue(
    value: string
  ) {
    const parsed =
      Number(value);

    setIntervalValue(
      Number.isFinite(
        parsed
      )
        ? Math.max(
            1,
            parsed
          )
        : 1
    );
  }

  // ===================================================
  // UPDATE INTERVAL UNIT
  // ===================================================

  function updateIntervalUnit(
    unit: IntervalUnit
  ) {
    setIntervalUnit(unit);
  }

  // ===================================================
  // UPDATE SENSOR
  // ===================================================

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
              sensor.slot ===
              slot
                ? {
                    ...sensor,
                    [field]:
                      value,
                  }
                : sensor
          ),
      };
    });
  }

  // ===================================================
  // SAVE
  // ===================================================

  async function saveConfig() {
    if (!config) {
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      // ---------------------------------------------
      // DEVICE NAME
      // ---------------------------------------------

      if (
        !config.deviceName.trim()
      ) {
        throw new Error(
          "Device name is required"
        );
      }

      // ---------------------------------------------
      // INTERVAL VALUE
      // ---------------------------------------------

      if (
        !Number.isFinite(
          intervalValue
        ) ||
        intervalValue < 1
      ) {
        throw new Error(
          "Send interval must be at least 1"
        );
      }

      // ---------------------------------------------
      // CONVERT TO MILLISECONDS
      // ---------------------------------------------

      const sendInterval =
        intervalToMilliseconds(
          intervalValue,
          intervalUnit
        );

      // ---------------------------------------------
      // MINIMUM 1 SECOND
      // ---------------------------------------------

      if (
        sendInterval <
        MIN_INTERVAL_MS
      ) {
        throw new Error(
          "Send interval must be at least 1 second"
        );
      }

      console.log(
        "[DeviceConfiguration] Saving interval:",
        {
          value:
            intervalValue,

          unit:
            intervalUnit,

          milliseconds:
            sendInterval,
        }
      );

      // ---------------------------------------------
      // SAVE API
      // ---------------------------------------------

      const response =
        await fetch(
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

              // IMPORTANT:
              // Backend receives milliseconds.
              sendInterval,

              sensors:
                config.sensors.map(
                  (sensor) => ({
                    slot:
                      sensor.slot,

                    type:
                      sensor.type,

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

      // ---------------------------------------------
      // UPDATE LOCAL CONFIG
      // ---------------------------------------------

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

      // ---------------------------------------------
      // Make sure UI reflects server value
      // ---------------------------------------------

      const savedInterval =
        millisecondsToInterval(
          result.sendInterval
        );

      setIntervalValue(
        savedInterval.value
      );

      setIntervalUnit(
        savedInterval.unit
      );

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

  // ===================================================
  // LOADING
  // ===================================================

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

  // ===================================================
  // ERROR
  // ===================================================

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

  // ===================================================
  // UI
  // ===================================================

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Device Configuration
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* ========================================== */}
        {/* BASIC CONFIGURATION */}
        {/* ========================================== */}

        <div className="grid gap-6 md:grid-cols-2">

          {/* DEVICE NAME */}

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

          {/* SEND INTERVAL */}

          <div className="space-y-2">
            <label
              htmlFor="sendIntervalValue"
              className="text-sm font-medium"
            >
              Send Interval
            </label>

            <div className="flex gap-2">

              {/* VALUE */}

              <input
                id="sendIntervalValue"
                type="number"
                min={1}
                step={1}
                value={
                  intervalValue
                }
                onChange={(
                  event
                ) =>
                  updateIntervalValue(
                    event.target.value
                  )
                }
                className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="10"
              />

              {/* UNIT */}

              <select
                value={
                  intervalUnit
                }
                onChange={(
                  event
                ) =>
                  updateIntervalUnit(
                    event.target
                      .value as IntervalUnit
                  )
                }
                className="w-32 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="seconds">
                  Seconds
                </option>

                <option value="minutes">
                  Minutes
                </option>

                <option value="hours">
                  Hours
                </option>
              </select>
            </div>

            <p className="text-xs text-muted-foreground">
              Device will send telemetry every{" "}
              <span className="font-medium text-foreground">
                {formatIntervalPreview(
                  intervalValue,
                  intervalUnit
                )}
              </span>
            </p>
          </div>
        </div>

        {/* ========================================== */}
        {/* SENSOR CONFIGURATION */}
        {/* ========================================== */}

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
                      key={
                        sensor.slot
                      }
                      className="border-b last:border-0"
                    >

                      {/* SLOT */}

                      <td className="px-4 py-3">
                        <div className="flex h-9 w-12 items-center justify-center rounded-md bg-muted font-medium">
                          {
                            sensor.slot
                          }
                        </div>
                      </td>

                      {/* TYPE */}

                      <td className="px-4 py-3">
                        <select
                          value={
                            sensor.type
                          }
                          onChange={(
                            event
                          ) =>
                            updateSensor(
                              sensor.slot,
                              "type",
                              event.target
                                .value
                            )
                          }
                          className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                        >
                          {SENSOR_TYPES.map(
                            (type) => (
                              <option
                                key={
                                  type
                                }
                                value={
                                  type
                                }
                              >
                                {
                                  type
                                }
                              </option>
                            )
                          )}
                        </select>
                      </td>

                      {/* NAME */}

                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={
                            sensor.name
                          }
                          onChange={(
                            event
                          ) =>
                            updateSensor(
                              sensor.slot,
                              "name",
                              event.target
                                .value
                            )
                          }
                          className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Sensor name"
                        />
                      </td>

                      {/* UNIT */}

                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={
                            sensor.unit
                          }
                          onChange={(
                            event
                          ) =>
                            updateSensor(
                              sensor.slot,
                              "unit",
                              event.target
                                .value
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

        {/* ========================================== */}
        {/* STATUS */}
        {/* ========================================== */}

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

        {/* ========================================== */}
        {/* SAVE */}
        {/* ========================================== */}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={
              saveConfig
            }
            disabled={
              saving
            }
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