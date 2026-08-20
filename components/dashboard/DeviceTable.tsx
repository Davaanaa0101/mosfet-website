"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircleOff,
  Clock3,
  Cpu,
  Eye,
  Loader2,
  MapPin,
  Radio,
  Server,
  ShieldAlert,
  WifiOff,
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

type DeviceStatusType =
  | "NOT_REGISTERED"
  | "REGISTERED"
  | "RUNNING"
  | "WARNING"
  | "ERROR"
  | "OFFLINE"
  | "online"
  | "offline";

// =====================================================
// DEVICE
// =====================================================

interface Device {
  _id: string;

  deviceId: string;

  name?: string;

  deviceName?: string;

  type?: string;

  location?: string;

  status?: DeviceStatusType;

  ipAddress?: string;

  macAddress?: string;

  firmware?: string;

  serialId?: string;

  lastSeen?: string | null;

  registeredAt?: string | null;
}

// =====================================================
// STATUS CONFIG
// =====================================================

const STATUS_CONFIG: Record<
  DeviceStatusType,
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
    dotClass: "bg-slate-400",
    icon: CircleOff,
  },

  REGISTERED: {
    label: "Registered",
    className:
      "border-blue-200 bg-blue-50 text-blue-700",
    dotClass:
      "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]",
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
    icon: ShieldAlert,
  },

  OFFLINE: {
    label: "Offline",
    className:
      "border-slate-200 bg-slate-100 text-slate-600",
    dotClass: "bg-slate-400",
    icon: WifiOff,
  },

  // Backward compatibility

  online: {
    label: "Online",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotClass:
      "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]",
    icon: Activity,
  },

  offline: {
    label: "Offline",
    className:
      "border-slate-200 bg-slate-100 text-slate-600",
    dotClass: "bg-slate-400",
    icon: WifiOff,
  },
};

// =====================================================
// STATUS HELPER
// =====================================================

function getDeviceStatus(
  device: Device
): DeviceStatusType {
  // Prefer API status if available.

  if (device.status) {
    return device.status;
  }

  // Backward compatibility:
  // calculate online/offline from lastSeen.

  if (!device.lastSeen) {
    return "OFFLINE";
  }

  const lastSeenTime =
    new Date(
      device.lastSeen
    ).getTime();

  if (Number.isNaN(lastSeenTime)) {
    return "OFFLINE";
  }

  return Date.now() -
    lastSeenTime <=
    30_000
    ? "RUNNING"
    : "OFFLINE";
}

// =====================================================
// LAST SEEN
// =====================================================

function formatLastSeen(
  lastSeen?: string | null
): string {
  if (!lastSeen) {
    return "Never";
  }

  const date =
    new Date(lastSeen);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Unknown";
  }

  return date.toLocaleString(
    [],
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

// =====================================================
// COMPONENT
// =====================================================

export default function DeviceTable() {
  const [devices, setDevices] =
    useState<Device[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // =====================================================
  // LOAD DEVICES
  // =====================================================

  const loadDevices =
    useCallback(async () => {
      try {
        const response =
          await fetch(
            "/api/devices",
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load devices"
          );
        }

        const result =
          (await response.json()) as Device[];

        setDevices(
          Array.isArray(result)
            ? result
            : []
        );

        setError(null);
      } catch (err) {
        console.error(
          "[DeviceTable]",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load devices"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  // =====================================================
  // INITIAL LOAD + AUTO REFRESH
  // =====================================================

  useEffect(() => {
    loadDevices();

    const interval =
      setInterval(
        loadDevices,
        10_000
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, [loadDevices]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
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
        <CardHeader
          className="
            border-b
            border-slate-100
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
                bg-blue-50
              "
            >
              <Server
                className="
                  h-5
                  w-5
                  text-blue-600
                "
              />
            </div>

            <div>
              <CardTitle>
                Devices
              </CardTitle>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-400
                "
              >
                Connected building devices
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
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
                text-blue-500
              "
            />

            Loading devices...
          </div>
        </CardContent>
      </Card>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
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
        <CardHeader>
          <CardTitle>
            Devices
          </CardTitle>
        </CardHeader>

        <CardContent>
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
            <ShieldAlert
              className="
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
                Unable to load devices
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
        </CardContent>
      </Card>
    );
  }

  // =====================================================
  // EMPTY
  // =====================================================

  if (devices.length === 0) {
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
        <CardHeader>
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
                bg-slate-100
              "
            >
              <Cpu
                className="
                  h-5
                  w-5
                  text-slate-500
                "
              />
            </div>

            <div>
              <CardTitle>
                Devices
              </CardTitle>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-400
                "
              >
                Connected building devices
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
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
              No devices registered
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
              Register an ESP32 device
              to start monitoring telemetry.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // =====================================================
  // MAIN TABLE
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
                bg-blue-50
              "
            >
              <Server
                className="
                  h-5
                  w-5
                  text-blue-600
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
                Devices
              </CardTitle>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-400
                "
              >
                {devices.length}{" "}
                {devices.length === 1
                  ? "device"
                  : "devices"}{" "}
                registered
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

            Auto refresh 10s
          </div>
        </div>
      </CardHeader>

      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table
            className="
              w-full
              min-w-[900px]
              text-sm
            "
          >
            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <thead>
              <tr
                className="
                  border-b
                  border-slate-100
                  bg-slate-50/70
                  text-left
                "
              >
                <th
                  className="
                    px-6
                    py-3.5
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Device
                </th>

                <th
                  className="
                    px-4
                    py-3.5
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Type
                </th>

                <th
                  className="
                    px-4
                    py-3.5
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Status
                </th>

                <th
                  className="
                    px-4
                    py-3.5
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Network
                </th>

                <th
                  className="
                    px-4
                    py-3.5
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Location
                </th>

                <th
                  className="
                    px-4
                    py-3.5
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Last Seen
                </th>

                <th
                  className="
                    px-6
                    py-3.5
                    text-right
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Action
                </th>
              </tr>
            </thead>

            {/* ================================================= */}
            {/* BODY */}
            {/* ================================================= */}

            <tbody>
              {devices.map(
                (device) => {
                  const status =
                    getDeviceStatus(
                      device
                    );

                  const config =
                    STATUS_CONFIG[
                      status
                    ] ??
                    STATUS_CONFIG.OFFLINE;

                  const StatusIcon =
                    config.icon;

                  const deviceName =
                    device.name ||
                    device.deviceName ||
                    device.deviceId;

                  return (
                    <tr
                      key={
                        device._id ||
                        device.deviceId
                      }
                      className="
                        group
                        border-b
                        border-slate-100
                        last:border-0
                        transition-colors
                        duration-200
                        hover:bg-slate-50/80
                      "
                    >
                      {/* ===================================== */}
                      {/* DEVICE */}
                      {/* ===================================== */}

                      <td
                        className="
                          px-6
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
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              border
                              border-slate-200
                              bg-slate-50
                              transition-all
                              duration-200
                              group-hover:border-blue-200
                              group-hover:bg-blue-50
                            "
                          >
                            <Radio
                              className="
                                h-4
                                w-4
                                text-slate-500
                                group-hover:text-blue-600
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
                                max-w-[190px]
                                truncate
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
                                mt-1
                                font-mono
                                text-[11px]
                                text-slate-400
                              "
                            >
                              {
                                device.deviceId
                              }
                            </p>

                            {device.serialId && (
                              <p
                                className="
                                  mt-0.5
                                  font-mono
                                  text-[10px]
                                  text-slate-300
                                "
                              >
                                S/N{" "}
                                {
                                  device.serialId
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* ===================================== */}
                      {/* TYPE */}
                      {/* ===================================== */}

                      <td
                        className="
                          px-4
                          py-4
                        "
                      >
                        <span
                          className="
                            inline-flex
                            items-center
                            rounded-lg
                            border
                            border-slate-200
                            bg-slate-50
                            px-2.5
                            py-1.5
                            text-xs
                            font-medium
                            text-slate-600
                          "
                        >
                          {device.type ||
                            "Unknown"}
                        </span>
                      </td>

                      {/* ===================================== */}
                      {/* STATUS */}
                      {/* ===================================== */}

                      <td
                        className="
                          px-4
                          py-4
                        "
                      >
                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            px-3
                            py-1.5
                            text-[11px]
                            font-semibold
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
                              h-3.5
                              w-3.5
                            "
                          />

                          {
                            config.label
                          }
                        </span>
                      </td>

                      {/* ===================================== */}
                      {/* NETWORK */}
                      {/* ===================================== */}

                      <td
                        className="
                          px-4
                          py-4
                        "
                      >
                        <div>
                          <p
                            className="
                              font-mono
                              text-xs
                              font-medium
                              text-slate-600
                            "
                          >
                            {device.ipAddress ||
                              "--"}
                          </p>

                          {device.macAddress && (
                            <p
                              className="
                                mt-1
                                font-mono
                                text-[10px]
                                text-slate-400
                              "
                            >
                              {
                                device.macAddress
                              }
                            </p>
                          )}
                        </div>
                      </td>

                      {/* ===================================== */}
                      {/* LOCATION */}
                      {/* ===================================== */}

                      <td
                        className="
                          px-4
                          py-4
                        "
                      >
                        <div
                          className="
                            flex
                            max-w-[180px]
                            items-center
                            gap-2
                          "
                        >
                          <MapPin
                            className="
                              h-4
                              w-4
                              shrink-0
                              text-slate-400
                            "
                          />

                          <span
                            className="
                              truncate
                              text-sm
                              text-slate-600
                            "
                          >
                            {device.location ||
                              "--"}
                          </span>
                        </div>
                      </td>

                      {/* ===================================== */}
                      {/* LAST SEEN */}
                      {/* ===================================== */}

                      <td
                        className="
                          px-4
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
                          <Clock3
                            className="
                              h-3.5
                              w-3.5
                              shrink-0
                              text-slate-400
                            "
                          />

                          <span
                            className="
                              whitespace-nowrap
                              text-xs
                              text-slate-500
                            "
                          >
                            {formatLastSeen(
                              device.lastSeen
                            )}
                          </span>
                        </div>
                      </td>

                      {/* ===================================== */}
                      {/* ACTION */}
                      {/* ===================================== */}

                      <td
                        className="
                          px-6
                          py-4
                          text-right
                        "
                      >
                        <Link
                          href={`/dashboard/devices/${encodeURIComponent(
                            device.deviceId
                          )}`}
                          className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-slate-600
                            transition-all
                            duration-200
                            hover:border-[#E91E63]/30
                            hover:bg-[#E91E63]/5
                            hover:text-[#D81B60]
                          "
                        >
                          <Eye
                            className="
                              h-3.5
                              w-3.5
                            "
                          />

                          View
                        </Link>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

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
            : "devices"}
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

          Live device monitoring
        </div>
      </div>
    </Card>
  );
}