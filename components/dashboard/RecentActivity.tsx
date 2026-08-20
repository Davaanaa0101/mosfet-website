"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Droplets,
  Gauge,
  Loader2,
  Radio,
  Thermometer,
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
// DEVICE STATUS
// =====================================================

type DeviceStatus =
  | "NOT_REGISTERED"
  | "REGISTERED"
  | "RUNNING"
  | "WARNING"
  | "ERROR"
  | "OFFLINE";

// =====================================================
// ACTIVITY
// =====================================================

interface ActivityItem {
  _id?: string;

  deviceId: string;

  createdAt: string;

  temperature?: number;

  humidity?: number;

  current?: number;

  voltage?: number;

  power?: number;

  energy?: number;

  rssi?: number;
}

// =====================================================
// DEVICE
// =====================================================

interface Device {
  deviceId: string;

  deviceName: string;

  status: DeviceStatus;
}

// =====================================================
// API RESPONSE
// =====================================================

interface DashboardResponse {
  success: boolean;

  recentActivity?: ActivityItem[];

  devices?: Device[];

  error?: string;
}

// =====================================================
// STATUS CONFIG
// =====================================================

const STATUS_CONFIG: Record<
  DeviceStatus,
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
      "bg-emerald-500",

    icon: Activity,
  },

  WARNING: {
    label: "Warning",

    className:
      "border-amber-200 bg-amber-50 text-amber-700",

    dotClass:
      "bg-amber-500",

    icon: AlertTriangle,
  },

  ERROR: {
    label: "Error",

    className:
      "border-red-200 bg-red-50 text-red-700",

    dotClass:
      "bg-red-500",

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
};

// =====================================================
// COMPONENT
// =====================================================

export default function RecentActivity() {
  const [activities, setActivities] =
    useState<ActivityItem[]>([]);

  const [devices, setDevices] =
    useState<Device[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // =====================================================
  // LOAD ACTIVITY
  // =====================================================

  const loadActivity =
    useCallback(async () => {
      try {
        const response =
          await fetch(
            "/api/dashboard/summary",
            {
              cache: "no-store",
            }
          );

        const result =
          (await response.json()) as DashboardResponse;

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.error ||
              "Failed to load activity"
          );
        }

        // Only show latest 5
        setActivities(
          (result.recentActivity ?? [])
            .slice(0, 5)
        );

        setDevices(
          result.devices ?? []
        );

        setError(null);
      } catch (err) {
        console.error(
          "[RecentActivity]",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load activity"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {
    loadActivity();

    const interval =
      setInterval(
        loadActivity,
        10_000
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, [loadActivity]);

  // =====================================================
  // GET DEVICE STATUS
  // =====================================================

  const getDeviceStatus = (
    deviceId: string
  ): DeviceStatus => {
    const device =
      devices.find(
        (item) =>
          item.deviceId ===
          deviceId
      );

    return (
      device?.status ??
      "OFFLINE"
    );
  };

  // =====================================================
  // GET DEVICE NAME
  // =====================================================

  const getDeviceName = (
    deviceId: string
  ): string => {
    const device =
      devices.find(
        (item) =>
          item.deviceId ===
          deviceId
      );

    return (
      device?.deviceName ||
      deviceId
    );
  };

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
            items-center
            justify-between
            gap-4
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
                bg-purple-50
              "
            >
              <Activity
                className="
                  h-5
                  w-5
                  text-purple-600
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
                Recent Activity
              </CardTitle>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-400
                "
              >
                Latest device telemetry
              </p>
            </div>
          </div>

          {/* LIVE */}

          <div
            className="
              flex
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

      <CardContent className="p-0">
        {/* LOADING */}

        {loading && (
          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              px-6
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
                text-purple-500
              "
            />

            Loading activity...
          </div>
        )}

        {/* ERROR */}

        {!loading &&
          error && (
            <div
              className="
                px-6
                py-6
              "
            >
              <div
                className="
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  p-4
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <AlertTriangle
                    className="
                      h-5
                      w-5
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
                      Unable to load activity
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
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          activities.length === 0 && (
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                px-6
                py-12
                text-center
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-100
                "
              >
                <Radio
                  className="
                    h-5
                    w-5
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
                No recent activity
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-400
                "
              >
                Waiting for telemetry...
              </p>
            </div>
          )}

        {/* ================================================= */}
        {/* ACTIVITY LIST */}
        {/* ================================================= */}

        {!loading &&
          !error &&
          activities.length > 0 && (
            <div>
              {activities.map(
                (
                  activity,
                  index
                ) => {
                  const status =
                    getDeviceStatus(
                      activity.deviceId
                    );

                  const deviceName =
                    getDeviceName(
                      activity.deviceId
                    );

                  const config =
                    STATUS_CONFIG[
                      status
                    ];

                  const StatusIcon =
                    config.icon;

                  return (
                    <div
                      key={
                        activity._id ??
                        `${activity.deviceId}-${activity.createdAt}-${index}`
                      }
                      className="
                        group
                        border-b
                        border-slate-100
                        px-6
                        py-4
                        transition-colors
                        duration-200
                        last:border-0
                        hover:bg-slate-50/70
                      "
                    >
                      {/* ================================= */}
                      {/* TOP */}
                      {/* ================================= */}

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
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
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-slate-100
                              transition-colors
                              group-hover:bg-purple-50
                            "
                          >
                            <Radio
                              className="
                                h-4
                                w-4
                                text-slate-500
                                group-hover:text-purple-600
                              "
                            />
                          </div>

                          <div
                            className="
                              min-w-0
                            "
                          >
                            <p
                              className="
                                truncate
                                text-sm
                                font-semibold
                                text-slate-800
                              "
                            >
                              {
                                deviceName
                              }
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
                                activity.deviceId
                              }
                            </p>
                          </div>
                        </div>

                        {/* STATUS + TIME */}

                        <div
                          className="
                            flex
                            shrink-0
                            items-center
                            gap-3
                          "
                        >
                          <span
                            className={`
                              hidden
                              items-center
                              gap-1.5
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-[10px]
                              font-semibold
                              sm:inline-flex
                              ${config.className}
                            `}
                          >
                            <span
                              className={`
                                h-1.5
                                w-1.5
                                rounded-full
                                ${config.dotClass}
                              `}
                            />

                            <StatusIcon
                              className="
                                h-3
                                w-3
                              "
                            />

                            {
                              config.label
                            }
                          </span>

                          <span
                            className="
                              flex
                              items-center
                              gap-1
                              whitespace-nowrap
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

                            {formatTime(
                              activity.createdAt
                            )}
                          </span>
                        </div>
                      </div>

                      {/* ================================= */}
                      {/* METRICS */}
                      {/* ================================= */}

                      <div
                        className="
                          mt-3
                          grid
                          grid-cols-2
                          gap-2
                          sm:grid-cols-3
                          lg:grid-cols-6
                        "
                      >
                        <MiniMetric
                          icon={
                            Thermometer
                          }
                          label="Temp"
                          value={formatValue(
                            activity.temperature,
                            1,
                            "°C"
                          )}
                          iconClass="
                            bg-orange-50
                            text-orange-500
                          "
                        />

                        <MiniMetric
                          icon={
                            Droplets
                          }
                          label="Humidity"
                          value={formatValue(
                            activity.humidity,
                            1,
                            "%"
                          )}
                          iconClass="
                            bg-blue-50
                            text-blue-500
                          "
                        />

                        <MiniMetric
                          icon={Zap}
                          label="Current"
                          value={formatValue(
                            activity.current,
                            2,
                            "A"
                          )}
                          iconClass="
                            bg-yellow-50
                            text-yellow-500
                          "
                        />

                        <MiniMetric
                          icon={Gauge}
                          label="Voltage"
                          value={formatValue(
                            activity.voltage,
                            1,
                            "V"
                          )}
                          iconClass="
                            bg-emerald-50
                            text-emerald-500
                          "
                        />

                        <MiniMetric
                          icon={Zap}
                          label="Power"
                          value={formatValue(
                            activity.power,
                            1,
                            "W"
                          )}
                          iconClass="
                            bg-purple-50
                            text-purple-500
                          "
                        />

                        <MiniMetric
                          icon={WifiOff}
                          label="RSSI"
                          value={formatValue(
                            activity.rssi,
                            0,
                            "dBm"
                          )}
                          iconClass="
                            bg-cyan-50
                            text-cyan-500
                          "
                        />
                      </div>
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
        activities.length > 0 && (
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
              Showing latest{" "}
              {activities.length}{" "}
              activities
            </span>

            <span
              className="
                text-[11px]
                text-slate-400
              "
            >
              Updates every 10s
            </span>
          </div>
        )}
    </Card>
  );
}

// =====================================================
// MINI METRIC
// =====================================================

function MiniMetric({
  icon: Icon,
  label,
  value,
  iconClass,
}: {
  icon: typeof Thermometer;

  label: string;

  value: string;

  iconClass: string;
}) {
  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-2
        rounded-xl
        border
        border-slate-100
        bg-white
        px-2.5
        py-2
      "
    >
      <div
        className={`
          flex
          h-7
          w-7
          shrink-0
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

      <div
        className="
          min-w-0
        "
      >
        <p
          className="
            truncate
            text-[9px]
            font-medium
            uppercase
            tracking-wide
            text-slate-400
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5
            truncate
            text-xs
            font-bold
            text-slate-700
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// =====================================================
// FORMAT VALUE
// =====================================================

function formatValue(
  value: number | undefined,
  decimals: number,
  unit: string
): string {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(value)
  ) {
    return "--";
  }

  return `${value.toFixed(
    decimals
  )} ${unit}`;
}

// =====================================================
// FORMAT TIME
// =====================================================

function formatTime(
  timestamp: string
): string {
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