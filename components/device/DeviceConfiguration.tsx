"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  Check,
  Clock3,
  Cpu,
  Gauge,
  Info,
  Loader2,
  Save,
  Settings2,
  Thermometer,
  Wifi,
  Zap,
} from "lucide-react";

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

  // Backend / ESP32 uses milliseconds.
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
// SENSOR ICON
// =====================================================

function getSensorIcon(
  type: string
) {
  switch (type) {
    case "TEMPERATURE":
    case "DHT_TEMPERATURE":
      return Thermometer;

    case "CURRENT":
      return Zap;

    case "VOLTAGE":
      return Activity;

    case "POWER":
      return Gauge;

    case "DHT_HUMIDITY":
      return Activity;

    default:
      return Cpu;
  }
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
      Number.isFinite(parsed)
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
      if (
        !config.deviceName.trim()
      ) {
        throw new Error(
          "Device name is required"
        );
      }

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

      const sendInterval =
        intervalToMilliseconds(
          intervalValue,
          intervalUnit
        );

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
  // ACTIVE SENSOR COUNT
  // ===================================================

  const activeSensors =
    useMemo(() => {
      if (!config) {
        return 0;
      }

      return config.sensors.filter(
        (sensor) =>
          sensor.type !==
            "N/A" &&
          sensor.type.trim() !== ""
      ).length;
    }, [config]);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <Card
          className="
            rounded-3xl
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          <CardContent
            className="
              flex
              min-h-[420px]
              flex-col
              items-center
              justify-center
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-primary/10
              "
            >
              <Settings2
                className="
                  h-6
                  w-6
                  animate-pulse
                  text-primary
                "
              />
            </div>

            <p
              className="
                mt-5
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Loading configuration...
            </p>

            <p
              className="
                mt-1
                text-xs
                text-slate-400
              "
            >
              Connecting to device
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error && !config) {
    return (
      <Card
        className="
          rounded-3xl
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <CardContent className="p-6">
          <div
            className="
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-5
            "
          >
            <p
              className="
                text-sm
                font-semibold
                text-red-700
              "
            >
              Unable to load configuration
            </p>

            <p
              className="
                mt-1
                text-xs
                text-red-600
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={
                loadConfig
              }
              className="
                mt-4
                rounded-lg
                bg-red-600
                px-3
                py-2
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-red-700
              "
            >
              Try Again
            </button>
          </div>
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
    <div className="space-y-6">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div>
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
                items-center
                justify-center
                rounded-2xl
                bg-primary/10
              "
            >
              <Settings2
                className="
                  h-5
                  w-5
                  text-primary
                "
              />
            </div>

            <div>
              <h1
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-900
                "
              >
                Device Configuration
              </h1>

              <p
                className="
                  mt-0.5
                  font-mono
                  text-xs
                  text-slate-400
                "
              >
                {config.deviceId}
              </p>
            </div>
          </div>
        </div>

        {/* SAVE */}

        <button
          type="button"
          onClick={
            saveConfig
          }
          disabled={saving}
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-primary
            px-5
            text-sm
            font-semibold
            text-primary-foreground
            shadow-md
            shadow-primary/20
            transition-all
            hover:-translate-y-0.5
            hover:shadow-lg
            hover:shadow-primary/25
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {saving ? (
            <>
              <Loader2
                className="
                  h-4
                  w-4
                  animate-spin
                "
              />

              Saving...
            </>
          ) : (
            <>
              <Save
                className="
                  h-4
                  w-4
                "
              />

              Save Configuration
            </>
          )}
        </button>
      </div>

      {/* ================================================= */}
      {/* DEVICE OVERVIEW */}
      {/* ================================================= */}

      <div
        className="
          grid
          gap-4
          md:grid-cols-3
        "
      >
        <OverviewCard
          icon={Cpu}
          label="Device"
          value={
            config.deviceName ||
            config.deviceId
          }
          subtitle={
            config.deviceId
          }
        />

        <OverviewCard
          icon={Clock3}
          label="Telemetry Interval"
          value={formatIntervalPreview(
            intervalValue,
            intervalUnit
          )}
          subtitle="Current setting"
        />

        <OverviewCard
          icon={Activity}
          label="Active Sensors"
          value={`${activeSensors}`}
          subtitle={`of ${config.sensors.length} slots configured`}
        />
      </div>

      {/* ================================================= */}
      {/* BASIC SETTINGS */}
      {/* ================================================= */}

      <Card
        className="
          rounded-3xl
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <CardHeader
          className="
            border-b
            border-slate-100
            px-6
            py-5
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
              <Settings2
                className="
                  h-4
                  w-4
                  text-primary
                "
              />
            </div>

            <div>
              <CardTitle
                className="
                  text-base
                  font-bold
                  text-slate-900
                "
              >
                Basic Settings
              </CardTitle>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-slate-400
                "
              >
                Configure the device identity
                and telemetry frequency.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent
          className="
            grid
            gap-6
            p-6
            md:grid-cols-2
          "
        >
          {/* DEVICE NAME */}

          <div className="space-y-2">
            <label
              htmlFor="deviceName"
              className="
                text-xs
                font-semibold
                text-slate-700
              "
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
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                text-sm
                text-slate-800
                outline-none
                transition-all
                placeholder:text-slate-400
                focus:border-primary
                focus:bg-white
                focus:ring-4
                focus:ring-primary/10
              "
              placeholder="Device name"
            />
          </div>

          {/* SEND INTERVAL */}

          <div className="space-y-2">
            <label
              htmlFor="sendIntervalValue"
              className="
                text-xs
                font-semibold
                text-slate-700
              "
            >
              Telemetry Send Interval
            </label>

            <div
              className="
                flex
                gap-2
              "
            >
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
                className="
                  h-11
                  min-w-0
                  flex-1
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  text-sm
                  text-slate-800
                  outline-none
                  transition-all
                  focus:border-primary
                  focus:bg-white
                  focus:ring-4
                  focus:ring-primary/10
                "
              />

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
                className="
                  h-11
                  w-32
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-3
                  text-sm
                  text-slate-700
                  outline-none
                  transition-all
                  focus:border-primary
                  focus:bg-white
                  focus:ring-4
                  focus:ring-primary/10
                "
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

            <div
              className="
                flex
                items-center
                gap-2
                text-xs
                text-slate-400
              "
            >
              <Clock3
                className="
                  h-3.5
                  w-3.5
                "
              />

              Device will send telemetry
              every{" "}
              <span
                className="
                  font-semibold
                  text-slate-600
                "
              >
                {formatIntervalPreview(
                  intervalValue,
                  intervalUnit
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================================================= */}
      {/* SENSORS */}
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
        <CardHeader
          className="
            border-b
            border-slate-100
            px-6
            py-5
          "
        >
          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
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
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-50
                "
              >
                <Activity
                  className="
                    h-4
                    w-4
                    text-emerald-600
                  "
                />
              </div>

              <div>
                <CardTitle
                  className="
                    text-base
                    font-bold
                    text-slate-900
                  "
                >
                  Sensors
                </CardTitle>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-slate-400
                  "
                >
                  Configure sensors connected
                  to this ESP32.
                </p>
              </div>
            </div>

            <span
              className="
                inline-flex
                w-fit
                items-center
                gap-1.5
                rounded-full
                border
                border-slate-200
                bg-slate-50
                px-3
                py-1.5
                text-[10px]
                font-semibold
                text-slate-500
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-emerald-500
                "
              />

              {activeSensors} active
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* DESKTOP TABLE */}

          <div className="overflow-x-auto">
            <table
              className="
                w-full
                min-w-[800px]
                text-sm
              "
            >
              <thead>
                <tr
                  className="
                    border-b
                    border-slate-100
                    bg-slate-50/70
                  "
                >
                  <th
                    className="
                      px-5
                      py-3
                      text-left
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                  >
                    Slot
                  </th>

                  <th
                    className="
                      px-5
                      py-3
                      text-left
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                  >
                    Sensor Type
                  </th>

                  <th
                    className="
                      px-5
                      py-3
                      text-left
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                  >
                    Name
                  </th>

                  <th
                    className="
                      px-5
                      py-3
                      text-left
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                  >
                    Unit
                  </th>
                </tr>
              </thead>

              <tbody>
                {config.sensors.map(
                  (sensor) => {
                    const SensorIcon =
                      getSensorIcon(
                        sensor.type
                      );

                    const active =
                      sensor.type !==
                        "N/A" &&
                      sensor.type.trim() !==
                        "";

                    return (
                      <tr
                        key={
                          sensor.slot
                        }
                        className="
                          border-b
                          border-slate-100
                          transition-colors
                          last:border-0
                          hover:bg-slate-50/60
                        "
                      >
                        {/* SLOT */}

                        <td
                          className="
                            px-5
                            py-4
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              gap-2
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
                                font-bold
                                text-slate-600
                              "
                            >
                              {sensor.slot}
                            </div>

                            {active && (
                              <span
                                className="
                                  h-1.5
                                  w-1.5
                                  rounded-full
                                  bg-emerald-500
                                "
                              />
                            )}
                          </div>
                        </td>

                        {/* TYPE */}

                        <td
                          className="
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
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-xl
                                ${
                                  active
                                    ? "bg-primary/10"
                                    : "bg-slate-100"
                                }
                              `}
                            >
                              <SensorIcon
                                className={`
                                  h-4
                                  w-4
                                  ${
                                    active
                                      ? "text-primary"
                                      : "text-slate-400"
                                  }
                                `}
                              />
                            </div>

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
                                  event
                                    .target
                                    .value
                                )
                              }
                              className="
                                h-10
                                min-w-[220px]
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-3
                                text-xs
                                font-medium
                                text-slate-700
                                outline-none
                                transition-all
                                focus:border-primary
                                focus:ring-4
                                focus:ring-primary/10
                              "
                            >
                              {SENSOR_TYPES.map(
                                (
                                  type
                                ) => (
                                  <option
                                    key={
                                      type
                                    }
                                    value={
                                      type
                                    }
                                  >
                                    {type}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </td>

                        {/* NAME */}

                        <td
                          className="
                            px-5
                            py-4
                          "
                        >
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
                                event
                                  .target
                                  .value
                              )
                            }
                            className="
                              h-10
                              w-full
                              rounded-xl
                              border
                              border-slate-200
                              bg-white
                              px-3
                              text-xs
                              text-slate-700
                              outline-none
                              transition-all
                              placeholder:text-slate-400
                              focus:border-primary
                              focus:ring-4
                              focus:ring-primary/10
                            "
                            placeholder="Sensor name"
                          />
                        </td>

                        {/* UNIT */}

                        <td
                          className="
                            px-5
                            py-4
                          "
                        >
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
                                event
                                  .target
                                  .value
                              )
                            }
                            className="
                              h-10
                              w-full
                              max-w-[140px]
                              rounded-xl
                              border
                              border-slate-200
                              bg-white
                              px-3
                              text-xs
                              text-slate-700
                              outline-none
                              transition-all
                              placeholder:text-slate-400
                              focus:border-primary
                              focus:ring-4
                              focus:ring-primary/10
                            "
                            placeholder="°C"
                          />
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>

          {/* SENSOR INFO */}

          <div
            className="
              flex
              items-start
              gap-3
              border-t
              border-slate-100
              bg-slate-50/50
              px-5
              py-4
            "
          >
            <Info
              className="
                mt-0.5
                h-4
                w-4
                shrink-0
                text-slate-400
              "
            />

            <p
              className="
                text-xs
                leading-5
                text-slate-400
              "
            >
              Sensor configuration is sent
              to the ESP32 together with the
              telemetry interval. The device
              continues using the configured
              slots when reporting telemetry.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ================================================= */}
      {/* STATUS MESSAGE */}
      {/* ================================================= */}

      {message && (
        <div
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-emerald-200
            bg-emerald-50
            px-5
            py-4
            text-sm
            text-emerald-700
          "
        >
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-emerald-100
            "
          >
            <Check
              className="
                h-4
                w-4
                text-emerald-600
              "
            />
          </div>

          <div>
            <p className="font-semibold">
              Saved successfully
            </p>

            <p className="mt-0.5 text-xs">
              {message}
            </p>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* ERROR MESSAGE */}
      {/* ================================================= */}

      {error && config && (
        <div
          className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            px-5
            py-4
            text-sm
            text-red-700
          "
        >
          <p className="font-semibold">
            Configuration error
          </p>

          <p className="mt-1 text-xs">
            {error}
          </p>
        </div>
      )}

      {/* ================================================= */}
      {/* BOTTOM SAVE */}
      {/* ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
        "
      >
        <div
          className="
            hidden
            items-center
            gap-3
            sm:flex
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
            <Wifi
              className="
                h-4
                w-4
                text-primary
              "
            />
          </div>

          <div>
            <p
              className="
                text-xs
                font-semibold
                text-slate-700
              "
            >
              Configuration ready
            </p>

            <p
              className="
                text-[10px]
                text-slate-400
              "
            >
              Save changes to update the
              device.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={
            saveConfig
          }
          disabled={saving}
          className="
            ml-auto
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-primary
            px-6
            text-sm
            font-semibold
            text-primary-foreground
            shadow-md
            shadow-primary/20
            transition-all
            hover:-translate-y-0.5
            hover:shadow-lg
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {saving ? (
            <>
              <Loader2
                className="
                  h-4
                  w-4
                  animate-spin
                "
              />

              Saving...
            </>
          ) : (
            <>
              <Save
                className="
                  h-4
                  w-4
                "
              />

              Save Configuration
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// =====================================================
// OVERVIEW CARD
// =====================================================

function OverviewCard({
  icon: Icon,
  label,
  value,
  subtitle,
}: {
  icon: typeof Cpu;
  label: string;
  value: string;
  subtitle: string;
}) {
  return (
    <Card
      className="
        rounded-2xl
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      <CardContent
        className="
          flex
          items-center
          gap-4
          p-5
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
          <Icon
            className="
              h-5
              w-5
              text-primary
            "
          />
        </div>

        <div className="min-w-0">
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            {label}
          </p>

          <p
            className="
              mt-1
              truncate
              text-sm
              font-bold
              text-slate-800
            "
          >
            {value}
          </p>

          <p
            className="
              mt-0.5
              truncate
              text-[10px]
              text-slate-400
            "
          >
            {subtitle}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}