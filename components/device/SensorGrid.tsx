"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Activity,
  BatteryCharging,
  CircleAlert,
  Clock3,
  Cpu,
  Droplets,
  Gauge,
  Radio,
  Thermometer,
  Zap,
} from "lucide-react";

import {
  Card,
  CardContent,
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
    typeof sensor.name ===
      "string" &&
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
  if (
    typeof sensor.unit ===
      "string" &&
    sensor.unit.trim()
  ) {
    return sensor.unit.trim();
  }

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
  const type =
    sensor.type
      .trim()
      .toUpperCase();

  if (type === "N/A") {
    return "N/A";
  }

  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "--";
  }

  if (type === "CONTACT") {
    return value === 1
      ? "ON"
      : "OFF";
  }

  let decimals = 2;

  if (
    type === "TEMPERATURE" ||
    type === "DHT_TEMPERATURE" ||
    type === "DHT_HUMIDITY"
  ) {
    decimals = 1;
  }

  if (type === "VOLTAGE") {
    decimals = 1;
  }

  if (type === "CURRENT") {
    decimals = 2;
  }

  if (type === "POWER") {
    decimals = 1;
  }

  const formatted =
    value.toFixed(decimals);

  const unit =
    getSensorUnit(sensor);

  return unit
    ? `${formatted} ${unit}`
    : formatted;
}

// =====================================================
// SENSOR ICON
// =====================================================

function getSensorIcon(
  type: string
) {
  switch (
    type
      .trim()
      .toUpperCase()
  ) {
    case "TEMPERATURE":
    case "DHT_TEMPERATURE":
      return Thermometer;

    case "DHT_HUMIDITY":
      return Droplets;

    case "CURRENT":
      return Zap;

    case "VOLTAGE":
      return BatteryCharging;

    case "POWER":
      return Gauge;

    case "ENERGY":
      return Activity;

    case "CONTACT":
      return Radio;

    default:
      return Cpu;
  }
}

// =====================================================
// SENSOR COLOR
// =====================================================

function getSensorStyle(
  type: string
) {
  switch (
    type
      .trim()
      .toUpperCase()
  ) {
    case "TEMPERATURE":
    case "DHT_TEMPERATURE":
      return {
        icon:
          "bg-orange-50 text-orange-500",
        value:
          "text-orange-600",
        dot:
          "bg-orange-500",
      };

    case "DHT_HUMIDITY":
      return {
        icon:
          "bg-blue-50 text-blue-500",
        value:
          "text-blue-600",
        dot:
          "bg-blue-500",
      };

    case "CURRENT":
      return {
        icon:
          "bg-purple-50 text-purple-500",
        value:
          "text-purple-600",
        dot:
          "bg-purple-500",
      };

    case "VOLTAGE":
      return {
        icon:
          "bg-emerald-50 text-emerald-500",
        value:
          "text-emerald-600",
        dot:
          "bg-emerald-500",
      };

    case "POWER":
      return {
        icon:
          "bg-amber-50 text-amber-500",
        value:
          "text-amber-600",
        dot:
          "bg-amber-500",
      };

    case "ENERGY":
      return {
        icon:
          "bg-cyan-50 text-cyan-500",
        value:
          "text-cyan-600",
        dot:
          "bg-cyan-500",
      };

    case "CONTACT":
      return {
        icon:
          "bg-indigo-50 text-indigo-500",
        value:
          "text-indigo-600",
        dot:
          "bg-indigo-500",
      };

    default:
      return {
        icon:
          "bg-slate-100 text-slate-500",
        value:
          "text-slate-700",
        dot:
          "bg-slate-400",
      };
  }
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
    useState<string | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  // ===================================================
  // LOAD DATA
  // ===================================================

  const loadData =
    useCallback(
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
          // SAVE
          // -------------------------------------------

          setConfig(
            deviceConfig
          );

          setValues(
            latest?.sensors ?? []
          );

          setLastUpdated(
            latest?.createdAt ??
              null
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

  // ===================================================
  // REFRESH
  // ===================================================

  useEffect(() => {
    loadData();

    const interval =
      setInterval(
        loadData,
        10000
      );

    return () => {
      clearInterval(
        interval
      );
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
      <Card
        className="
          overflow-hidden
          rounded-3xl
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <CardContent className="p-6">
          <div className="space-y-6">

            <div
              className="
                flex
                items-center
                gap-4
              "
            >
              <div
                className="
                  h-12
                  w-12
                  animate-pulse
                  rounded-2xl
                  bg-slate-100
                "
              />

              <div className="space-y-2">
                <div
                  className="
                    h-5
                    w-32
                    animate-pulse
                    rounded
                    bg-slate-100
                  "
                />

                <div
                  className="
                    h-3
                    w-48
                    animate-pulse
                    rounded
                    bg-slate-100
                  "
                />
              </div>
            </div>

            <div
              className="
                grid
                gap-4
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >
              {Array.from({
                length: 4,
              }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="
                      h-36
                      animate-pulse
                      rounded-2xl
                      bg-slate-100
                    "
                  />
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ===================================================
  // CONFIG ERROR
  // ===================================================

  if (!config) {
    return (
      <Card
        className="
          rounded-3xl
          border-red-200
          bg-red-50
        "
      >
        <CardContent className="p-6">
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
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-red-100
              "
            >
              <CircleAlert
                className="
                  h-5
                  w-5
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
                Unable to load sensors
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-red-600
                "
              >
                {error ||
                  "Failed to load sensor configuration"}
              </p>
            </div>
          </div>
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
      <Card
        className="
          rounded-3xl
          border-slate-200
          bg-white
        "
      >
        <CardContent className="p-8">
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              text-center
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
                bg-slate-100
              "
            >
              <Cpu
                className="
                  h-6
                  w-6
                  text-slate-400
                "
              />
            </div>

            <h3
              className="
                mt-4
                text-base
                font-bold
                text-slate-700
              "
            >
              No sensors configured
            </h3>

            <p
              className="
                mt-1
                max-w-sm
                text-sm
                text-slate-400
              "
            >
              This device does not have
              any configured sensors yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <Card
      className="
        overflow-hidden
        rounded-3xl
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        className="
          border-b
          border-slate-100
          px-5
          py-5
          sm:px-6
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* TITLE */}

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
              <Cpu
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
                Sensors
              </h2>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-slate-400
                "
              >
                {configuredSensors.length}{" "}
                configured sensor
                {configuredSensors.length !==
                1
                  ? "s"
                  : ""}
              </p>
            </div>
          </div>

          {/* STATUS */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            {error ? (
              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-amber-200
                  bg-amber-50
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-amber-700
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-amber-500
                  "
                />
                Refresh issue
              </span>
            ) : (
              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-emerald-200
                  bg-emerald-50
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-emerald-700
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    animate-pulse
                    rounded-full
                    bg-emerald-500
                  "
                />
                Live
              </span>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-5 sm:p-6">

        {/* ================================================= */}
        {/* SENSOR GRID */}
        {/* ================================================= */}

        <div
          className="
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {configuredSensors.map(
            (sensor) => {
              // -------------------------------------
              // READING
              // -------------------------------------

              const reading =
                values.find(
                  (value) =>
                    value.slot ===
                    sensor.slot
                );

              const value =
                reading?.value;

              // -------------------------------------
              // INFO
              // -------------------------------------

              const name =
                getSensorName(
                  sensor
                );

              const type =
                sensor.type ||
                "N/A";

              const unit =
                getSensorUnit(
                  sensor
                );

              const displayValue =
                formatSensorValue(
                  sensor,
                  value
                );

              const normalizedType =
                type
                  .trim()
                  .toUpperCase();

              const isUnused =
                normalizedType ===
                "N/A";

              const hasValue =
                !isUnused &&
                value !== null &&
                value !== undefined &&
                Number.isFinite(
                  value
                );

              const Icon =
                getSensorIcon(
                  type
                );

              const style =
                getSensorStyle(
                  type
                );

              return (
                <div
                  key={
                    sensor.slot
                  }
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-primary/30
                    hover:shadow-lg
                  "
                >
                  {/* TOP ACCENT */}

                  <div
                    className={`
                      absolute
                      inset-x-0
                      top-0
                      h-0.5
                      ${style.dot}
                    `}
                  />

                  {/* HEADER */}

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${style.icon}
                      `}
                    >
                      <Icon
                        className="
                          h-5
                          w-5
                        "
                      />
                    </div>

                    <span
                      className="
                        rounded-full
                        bg-slate-100
                        px-2
                        py-1
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Slot{" "}
                      {sensor.slot}
                    </span>
                  </div>

                  {/* SENSOR NAME */}

                  <div className="mt-4">
                    <p
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-slate-800
                      "
                      title={name}
                    >
                      {name}
                    </p>

                    <p
                      className="
                        mt-1
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-wider
                        text-slate-400
                      "
                    >
                      {type}
                    </p>
                  </div>

                  {/* VALUE */}

                  <div className="mt-5">
                    <p
                      className={`
                        text-3xl
                        font-bold
                        tracking-tight
                        ${
                          isUnused
                            ? "text-slate-300"
                            : hasValue
                            ? style.value
                            : "text-slate-400"
                        }
                      `}
                    >
                      {displayValue}
                    </p>
                  </div>

                  {/* UNIT / STATUS */}

                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      justify-between
                    "
                  >
                    {isUnused ? (
                      <span
                        className="
                          text-[10px]
                          font-medium
                          text-slate-400
                        "
                      >
                        Sensor unused
                      </span>
                    ) : (
                      <span
                        className="
                          text-[10px]
                          font-medium
                          text-slate-400
                        "
                      >
                        {unit
                          ? `Unit: ${unit}`
                          : "No unit"}
                      </span>
                    )}

                    {!isUnused &&
                      (hasValue ? (
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            text-[10px]
                            font-semibold
                            text-emerald-600
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
                          Active
                        </span>
                      ) : (
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            text-[10px]
                            font-semibold
                            text-slate-400
                          "
                        >
                          <span
                            className="
                              h-1.5
                              w-1.5
                              rounded-full
                              bg-slate-300
                            "
                          />
                          No data
                        </span>
                      ))}
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* ================================================= */}
        {/* LAST UPDATED */}
        {/* ================================================= */}

        <div
          className="
            mt-6
            flex
            flex-col
            gap-2
            border-t
            border-slate-100
            pt-4
            text-xs
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              text-slate-400
            "
          >
            <Clock3
              className="
                h-3.5
                w-3.5
              "
            />

            <span>
              {lastUpdated
                ? `Last update: ${new Date(
                    lastUpdated
                  ).toLocaleString()}`
                : "No telemetry received yet"}
            </span>
          </div>

          <span
            className="
              text-slate-400
            "
          >
            Auto refresh: 10s
          </span>
        </div>

        {/* ================================================= */}
        {/* TEMPORARY ERROR */}
        {/* ================================================= */}

        {error && (
          <div
            className="
              mt-4
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-amber-200
              bg-amber-50
              px-3
              py-2.5
              text-xs
              text-amber-700
            "
          >
            <CircleAlert
              className="
                h-3.5
                w-3.5
                shrink-0
              "
            />

            <span>
              {error}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}