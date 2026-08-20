"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  CheckCircle2,
  Clock3,
  Droplets,
  Gauge,
  Loader2,
  Radio,
  Thermometer,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// =====================================================
// TELEMETRY
// =====================================================

interface Telemetry {
  deviceId: string;

  temperature?: number;
  humidity?: number;
  current?: number;
  voltage?: number;
  power?: number;
  rssi?: number;

  createdAt: string;
}

// =====================================================
// DEVICE
// =====================================================

interface Device {
  deviceId: string;

  deviceName?: string;

  status?: string;

  telemetry?: Telemetry | null;
}

// =====================================================
// RESPONSE
// =====================================================

interface SummaryResponse {
  success?: boolean;

  devices?: Device[];

  error?: string;
}

// =====================================================
// STATUS CONFIG
// =====================================================

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    className: string;
    dotClass: string;
    icon: typeof Activity;
  }
> = {
  NOT_REGISTERED: {
    label: "Not Registered",

    className:
      "border-slate-200 bg-slate-50 text-slate-600",

    dotClass:
      "bg-slate-400",

    icon: WifiOff,
  },

  REGISTERED: {
    label: "Registered",

    className:
      "border-blue-200 bg-blue-50 text-blue-700",

    dotClass:
      "bg-blue-500",

    icon: CheckCircle2,
  },

  RUNNING: {
    label: "Running",

    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    dotClass:
      "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]",

    icon: Activity,
  },

  WARNING: {
    label: "Warning",

    className:
      "border-amber-200 bg-amber-50 text-amber-700",

    dotClass:
      "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]",

    icon: AlertTriangle,
  },

  ERROR: {
    label: "Error",

    className:
      "border-red-200 bg-red-50 text-red-700",

    dotClass:
      "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]",

    icon: AlertTriangle,
  },

  OFFLINE: {
    label: "Offline",

    className:
      "border-slate-200 bg-slate-100 text-slate-600",

    dotClass:
      "bg-slate-400",

    icon: WifiOff,
  },

  // Backward compatibility

  online: {
    label: "Online",

    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    dotClass:
      "bg-emerald-500",

    icon: Activity,
  },

  offline: {
    label: "Offline",

    className:
      "border-slate-200 bg-slate-100 text-slate-600",

    dotClass:
      "bg-slate-400",

    icon: WifiOff,
  },
};

// =====================================================
// COMPONENT
// =====================================================

export default function LatestTelemetry() {
  const [devices, setDevices] =
    useState<Device[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // =====================================================
  // LOAD TELEMETRY
  // =====================================================

  const loadTelemetry =
    useCallback(async () => {
      try {
        const response =
          await fetch(
            "/api/dashboard/summary",
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load telemetry"
          );
        }

        const result =
          (await response.json()) as SummaryResponse;

        if (
          result.error ||
          result.success === false
        ) {
          throw new Error(
            result.error ||
              "Failed to load telemetry"
          );
        }

        setDevices(
          result.devices ?? []
        );

        setError(null);
      } catch (err) {
        console.error(
          "[LatestTelemetry]",
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
    }, []);

  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {
    loadTelemetry();

    const interval =
      setInterval(
        loadTelemetry,
        10_000
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, [loadTelemetry]);

  // =====================================================
  // RENDER
  // =====================================================

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
            gap-4
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
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#E91E63]/10
              "
            >
              <Activity
                className="
                  h-5
                  w-5
                  text-[#D81B60]
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
                Latest Telemetry
              </CardTitle>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-400
                "
              >
                Real-time sensor readings
              </p>
            </div>
          </div>

          {/* Live indicator */}

          <div
            className="
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-emerald-200
              bg-emerald-50
              px-3
              py-1.5
              text-[11px]
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
          </div>
        </div>
      </CardHeader>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <CardContent className="p-6">
        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading && (
          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              py-12
              text-sm
              text-slate-500
            "
          >
            <Loader2
              className="
                h-4
                w-4
                animate-spin
                text-[#E91E63]
              "
            />

            Loading telemetry...
          </div>
        )}

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {!loading && error && (
          <div
            className="
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-4
            "
          >
            <AlertTriangle
              className="
                mt-0.5
                h-5
                w-5
                shrink-0
                text-red-500
              "
            />

            <div>
              <p
                className="
                  text-sm
                  font-semibold
                  text-red-700
                "
              >
                Unable to load telemetry
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-red-600
                "
              >
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* EMPTY */}
        {/* ================================================= */}

        {!loading &&
          !error &&
          devices.length === 0 && (
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                py-12
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
                <Radio
                  className="
                    h-6
                    w-6
                    text-slate-400
                  "
                />
              </div>

              <p
                className="
                  mt-4
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                No telemetry available
              </p>

              <p
                className="
                  mt-1
                  max-w-sm
                  text-xs
                  leading-5
                  text-slate-400
                "
              >
                Connect a device and send
                telemetry to see live readings.
              </p>
            </div>
          )}

        {/* ================================================= */}
        {/* DEVICE GRID */}
        {/* ================================================= */}

        {!loading &&
          !error &&
          devices.length > 0 && (
            <div
              className="
                grid
                gap-5
                xl:grid-cols-2
              "
            >
              {devices.map(
                (device) => {
                  const telemetry =
                    device.telemetry;

                  const rawStatus =
                    device.status ||
                    "OFFLINE";

                  const status =
                    STATUS_CONFIG[
                      rawStatus
                    ] ??
                    STATUS_CONFIG.OFFLINE;

                  const StatusIcon =
                    status.icon;

                  return (
                    <div
                      key={
                        device.deviceId
                      }
                      className="
                        group
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50/40
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:border-slate-300
                        hover:shadow-md
                      "
                    >
                      {/* ================================= */}
                      {/* DEVICE HEADER */}
                      {/* ================================= */}

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          border-b
                          border-slate-200
                          bg-white
                          px-5
                          py-4
                        "
                      >
                        <div
                          className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                          "
                        >
                          <div
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              border
                              border-blue-200
                              bg-blue-50
                            "
                          >
                            <Radio
                              className="
                                h-4
                                w-4
                                text-blue-600
                              "
                            />
                          </div>

                          <div className="min-w-0">
                            <p
                              className="
                                truncate
                                text-sm
                                font-bold
                                text-slate-800
                              "
                            >
                              {device.deviceName ||
                                device.deviceId}
                            </p>

                            <p
                              className="
                                mt-0.5
                                truncate
                                font-mono
                                text-[10px]
                                text-slate-400
                              "
                            >
                              {
                                device.deviceId
                              }
                            </p>
                          </div>
                        </div>

                        {/* STATUS */}

                        <span
                          className={`
                            inline-flex
                            shrink-0
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            px-2.5
                            py-1.5
                            text-[10px]
                            font-bold
                            ${status.className}
                          `}
                        >
                          <span
                            className={`
                              h-1.5
                              w-1.5
                              rounded-full
                              ${status.dotClass}
                            `}
                          />

                          <StatusIcon
                            className="
                              h-3
                              w-3
                            "
                          />

                          {
                            status.label
                          }
                        </span>
                      </div>

                      {/* ================================= */}
                      {/* TELEMETRY */}
                      {/* ================================= */}

                      {telemetry ? (
                        <div className="p-4">
                          <div
                            className="
                              grid
                              grid-cols-2
                              gap-3
                              sm:grid-cols-3
                            "
                          >
                            <Metric
                              title="Temperature"
                              value={
                                telemetry.temperature !=
                                null
                                  ? `${telemetry.temperature.toFixed(
                                      1
                                    )} °C`
                                  : "--"
                              }
                              icon={
                                Thermometer
                              }
                              iconClass="text-orange-500 bg-orange-50"
                            />

                            <Metric
                              title="Humidity"
                              value={
                                telemetry.humidity !=
                                null
                                  ? `${telemetry.humidity.toFixed(
                                      1
                                    )} %`
                                  : "--"
                              }
                              icon={
                                Droplets
                              }
                              iconClass="text-blue-500 bg-blue-50"
                            />

                            <Metric
                              title="Current"
                              value={
                                telemetry.current !=
                                null
                                  ? `${telemetry.current.toFixed(
                                      2
                                    )} A`
                                  : "--"
                              }
                              icon={
                                Zap
                              }
                              iconClass="text-yellow-500 bg-yellow-50"
                            />

                            <Metric
                              title="Voltage"
                              value={
                                telemetry.voltage !=
                                null
                                  ? `${telemetry.voltage.toFixed(
                                      1
                                    )} V`
                                  : "--"
                              }
                              icon={
                                BatteryCharging
                              }
                              iconClass="text-emerald-500 bg-emerald-50"
                            />

                            <Metric
                              title="Power"
                              value={
                                telemetry.power !=
                                null
                                  ? `${telemetry.power.toFixed(
                                      1
                                    )} W`
                                  : "--"
                              }
                              icon={
                                Gauge
                              }
                              iconClass="text-purple-500 bg-purple-50"
                            />

                            <Metric
                              title="Signal"
                              value={
                                telemetry.rssi !=
                                null
                                  ? `${telemetry.rssi} dBm`
                                  : "--"
                              }
                              icon={
                                Wifi
                              }
                              iconClass="text-cyan-500 bg-cyan-50"
                            />
                          </div>

                          {/* Timestamp */}

                          <div
                            className="
                              mt-4
                              flex
                              items-center
                              justify-between
                              border-t
                              border-slate-200
                              pt-3
                            "
                          >
                            <div
                              className="
                                flex
                                items-center
                                gap-1.5
                                text-[10px]
                                text-slate-400
                              "
                            >
                              <Clock3
                                className="
                                  h-3
                                  w-3
                                "
                              />

                              Last telemetry
                            </div>

                            <span
                              className="
                                text-[10px]
                                font-medium
                                text-slate-500
                              "
                            >
                              {formatTelemetryTime(
                                telemetry.createdAt
                              )}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="
                            flex
                            items-center
                            gap-3
                            px-5
                            py-8
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
                            "
                          >
                            <Radio
                              className="
                                h-4
                                w-4
                                text-slate-400
                              "
                            />
                          </div>

                          <div>
                            <p
                              className="
                                text-sm
                                font-medium
                                text-slate-600
                              "
                            >
                              No telemetry received
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-xs
                                text-slate-400
                              "
                            >
                              Waiting for device data...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
      </CardContent>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      {!loading &&
        !error &&
        devices.length > 0 && (
          <div
            className="
              flex
              items-center
              justify-between
              border-t
              border-slate-100
              bg-slate-50/50
              px-6
              py-3
            "
          >
            <span
              className="
                text-[11px]
                text-slate-400
              "
            >
              {devices.length}{" "}
              {devices.length === 1
                ? "device"
                : "devices"}{" "}
              monitored
            </span>

            <div
              className="
                flex
                items-center
                gap-1.5
                text-[11px]
                text-slate-400
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

              Updates every 10s
            </div>
          </div>
        )}
    </Card>
  );
}

// =====================================================
// METRIC
// =====================================================

function Metric({
  title,
  value,
  icon: Icon,
  iconClass,
}: {
  title: string;

  value: string;

  icon: typeof Thermometer;

  iconClass: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-white
        p-3
        transition-all
        duration-200
        hover:border-slate-300
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-2
        "
      >
        <div
          className={`
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-lg
            ${iconClass}
          `}
        >
          <Icon
            className="
              h-3.5
              w-3.5
            "
          />
        </div>

        <span
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-wider
            text-slate-400
          "
        >
          {title}
        </span>
      </div>

      <p
        className="
          mt-3
          text-base
          font-bold
          tracking-tight
          text-slate-800
        "
      >
        {value}
      </p>
    </div>
  );
}

// =====================================================
// TIME FORMAT
// =====================================================

function formatTelemetryTime(
  timestamp?: string
): string {
  if (!timestamp) {
    return "--";
  }

  const date =
    new Date(timestamp);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "--";
  }

  return date.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  );
}