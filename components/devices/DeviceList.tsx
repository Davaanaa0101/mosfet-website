"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Server,
  Wifi,
  WifiOff,
  XCircle,
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
// DEVICE
// =====================================================

interface Device {
  _id: string;

  deviceId: string;

  serialId?: string;

  name: string;

  type:
    | "esp32"
    | "plc"
    | "modbus"
    | "camera";

  location?: string;

  macAddress?: string;

  firmware?: string;

  ipAddress?: string;

  status: DeviceStatus;

  lastSeen?: string;

  registeredAt?: string;

  createdAt?: string;
}

// =====================================================
// RESPONSE
// =====================================================

interface DevicesResponse {
  success: boolean;

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
    icon: typeof Activity;
    badgeClass: string;
    dotClass: string;
  }
> = {
  NOT_REGISTERED: {
    label: "Not Registered",
    icon: WifiOff,
    badgeClass:
      "border-slate-200 bg-slate-50 text-slate-600",
    dotClass: "bg-slate-400",
  },

  REGISTERED: {
    label: "Registered",
    icon: CheckCircle2,
    badgeClass:
      "border-blue-200 bg-blue-50 text-blue-700",
    dotClass: "bg-blue-500",
  },

  RUNNING: {
    label: "Running",
    icon: Activity,
    badgeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotClass: "bg-emerald-500",
  },

  WARNING: {
    label: "Warning",
    icon: AlertTriangle,
    badgeClass:
      "border-amber-200 bg-amber-50 text-amber-700",
    dotClass: "bg-amber-500",
  },

  ERROR: {
    label: "Error",
    icon: XCircle,
    badgeClass:
      "border-red-200 bg-red-50 text-red-700",
    dotClass: "bg-red-500",
  },

  OFFLINE: {
    label: "Offline",
    icon: WifiOff,
    badgeClass:
      "border-slate-200 bg-slate-100 text-slate-600",
    dotClass: "bg-slate-400",
  },
};

// =====================================================
// DEVICE LIST
// =====================================================

export default function DeviceList() {
  const [devices, setDevices] =
    useState<Device[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  // =====================================================
  // LOAD DEVICES
  // =====================================================

  const loadDevices =
    useCallback(
      async (
        manualRefresh = false
      ) => {
        try {
          if (manualRefresh) {
            setRefreshing(true);
          }

          const response =
            await fetch(
              "/api/devices",
              {
                method: "GET",
                cache: "no-store",
                headers: {
                  Accept:
                    "application/json",
                },
                credentials:
                  "include",
              }
            );

          const result =
            (await response.json()) as DevicesResponse;

          if (!response.ok) {
            throw new Error(
              result.error ||
                "Failed to load devices"
            );
          }

          if (
            !result.success
          ) {
            throw new Error(
              result.error ||
                "Failed to load devices"
            );
          }

          setDevices(
            result.devices ?? []
          );

          setError(null);
        } catch (err) {
          console.error(
            "[DeviceList]",
            err
          );

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load devices"
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      []
    );

  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {
    loadDevices();

    const interval =
      setInterval(
        () => {
          loadDevices();
        },
        10_000
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, [loadDevices]);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredDevices =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return devices;
      }

      return devices.filter(
        (device) =>
          device.deviceId
            .toLowerCase()
            .includes(query) ||

          device.serialId
            ?.toLowerCase()
            .includes(query) ||

          device.name
            .toLowerCase()
            .includes(query) ||

          device.type
            .toLowerCase()
            .includes(query) ||

          device.location
            ?.toLowerCase()
            .includes(query) ||

          device.ipAddress
            ?.toLowerCase()
            .includes(query)
      );
    }, [
      devices,
      search,
    ]);

  // =====================================================
  // STATUS COUNTS
  // =====================================================

  const counts =
    useMemo(
      () => ({
        total:
          devices.length,

        notRegistered:
          devices.filter(
            (device) =>
              device.status ===
              "NOT_REGISTERED"
          ).length,

        registered:
          devices.filter(
            (device) =>
              device.status ===
              "REGISTERED"
          ).length,

        running:
          devices.filter(
            (device) =>
              device.status ===
              "RUNNING"
          ).length,

        warning:
          devices.filter(
            (device) =>
              device.status ===
              "WARNING"
          ).length,

        error:
          devices.filter(
            (device) =>
              device.status ===
              "ERROR"
          ).length,

        offline:
          devices.filter(
            (device) =>
              device.status ===
              "OFFLINE"
          ).length,
      }),
      [devices]
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="
        space-y-6
      "
    >
      {/* ================================================= */}
      {/* PAGE HEADER */}
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
              <Server
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
                Devices
              </h1>

              <p
                className="
                  mt-0.5
                  text-sm
                  text-slate-400
                "
              >
                Monitor and manage your
                connected devices
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          {/* REFRESH */}

          <button
            type="button"
            onClick={() =>
              loadDevices(true)
            }
            disabled={
              loading ||
              refreshing
            }
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              text-sm
              font-medium
              text-slate-600
              shadow-sm
              transition-all
              hover:bg-slate-50
              hover:text-slate-900
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshCw
              className={`
                h-4
                w-4
                ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              `}
            />

            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>

          {/* REGISTER */}

          <Link
            href="/dashboard/devices/register"
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-primary
              px-4
              text-sm
              font-semibold
              text-primary-foreground
              shadow-md
              shadow-primary/20
              transition-all
              hover:-translate-y-0.5
              hover:shadow-lg
              hover:shadow-primary/25
            "
          >
            <Plus
              className="
                h-4
                w-4
              "
            />

            Register Device
          </Link>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================================= */}

      <div
        className="
          grid
          gap-3
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-6
        "
      >
        <SummaryCard
          title="Total"
          value={counts.total}
          icon={Cpu}
          iconClass="
            bg-purple-50
            text-purple-600
          "
        />

        <SummaryCard
          title="Running"
          value={counts.running}
          icon={Activity}
          iconClass="
            bg-emerald-50
            text-emerald-600
          "
        />

        <SummaryCard
          title="Warning"
          value={counts.warning}
          icon={AlertTriangle}
          iconClass="
            bg-amber-50
            text-amber-600
          "
        />

        <SummaryCard
          title="Error"
          value={counts.error}
          icon={XCircle}
          iconClass="
            bg-red-50
            text-red-600
          "
        />

        <SummaryCard
          title="Registered"
          value={counts.registered}
          icon={CheckCircle2}
          iconClass="
            bg-blue-50
            text-blue-600
          "
        />

        <SummaryCard
          title="Offline"
          value={counts.offline}
          icon={WifiOff}
          iconClass="
            bg-slate-100
            text-slate-500
          "
        />
      </div>

      {/* ================================================= */}
      {/* DEVICE TABLE */}
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
        {/* HEADER */}

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
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div>
              <CardTitle
                className="
                  text-base
                  font-bold
                  text-slate-900
                "
              >
                All Devices
              </CardTitle>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-400
                "
              >
                {filteredDevices.length}
                {" "}
                of{" "}
                {devices.length}
                {" "}
                devices
              </p>
            </div>

            {/* SEARCH */}

            <div
              className="
                relative
                w-full
                lg:w-80
              "
            >
              <Search
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder="Search devices..."
                className="
                  h-10
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  pl-10
                  pr-4
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
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* ================================================= */}
          {/* LOADING */}
          {/* ================================================= */}

          {loading && (
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                px-6
                py-16
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  animate-pulse
                  items-center
                  justify-center
                  rounded-2xl
                  bg-primary/10
                "
              >
                <Server
                  className="
                    h-5
                    w-5
                    text-primary
                  "
                />
              </div>

              <p
                className="
                  mt-4
                  text-sm
                  font-medium
                  text-slate-600
                "
              >
                Loading devices...
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-400
                "
              >
                Please wait
              </p>
            </div>
          )}

          {/* ================================================= */}
          {/* ERROR */}
          {/* ================================================= */}

          {!loading &&
            error && (
              <div className="p-6">
                <div
                  className="
                    rounded-2xl
                    border
                    border-red-200
                    bg-red-50
                    p-5
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <XCircle
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

                      <button
                        type="button"
                        onClick={() =>
                          loadDevices(
                            true
                          )
                        }
                        className="
                          mt-3
                          text-xs
                          font-semibold
                          text-red-700
                          underline
                          underline-offset-4
                        "
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* ================================================= */}
          {/* EMPTY */}
          {/* ================================================= */}

          {!loading &&
            !error &&
            devices.length ===
              0 && (
              <EmptyDevices />
            )}

          {/* ================================================= */}
          {/* NO SEARCH RESULTS */}
          {/* ================================================= */}

          {!loading &&
            !error &&
            devices.length >
              0 &&
            filteredDevices.length ===
              0 && (
              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  px-6
                  py-16
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
                  <Search
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
                  No devices found
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-400
                  "
                >
                  Try a different
                  search term.
                </p>
              </div>
            )}

          {/* ================================================= */}
          {/* DESKTOP TABLE */}
          {/* ================================================= */}

          {!loading &&
            !error &&
            filteredDevices.length >
              0 && (
              <div className="overflow-x-auto">
                <table
                  className="
                    w-full
                    min-w-[1000px]
                    text-sm
                  "
                >
                  <thead>
                    <tr
                      className="
                        border-b
                        border-slate-100
                        bg-slate-50/70
                        text-left
                      "
                    >
                      <TableHeader>
                        Device
                      </TableHeader>

                      <TableHeader>
                        Serial ID
                      </TableHeader>

                      <TableHeader>
                        Type
                      </TableHeader>

                      <TableHeader>
                        Location
                      </TableHeader>

                      <TableHeader>
                        IP Address
                      </TableHeader>

                      <TableHeader>
                        Status
                      </TableHeader>

                      <TableHeader>
                        Last Seen
                      </TableHeader>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredDevices.map(
                      (device) => (
                        <DeviceRow
                          key={
                            device._id ||
                            device.deviceId
                          }
                          device={
                            device
                          }
                        />
                      )
                    )}
                  </tbody>
                </table>
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
                flex-col
                gap-2
                border-t
                border-slate-100
                bg-slate-50/50
                px-6
                py-3
                text-xs
                text-slate-400
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <span>
                Showing{" "}
                {filteredDevices.length}{" "}
                device
                {filteredDevices.length !==
                1
                  ? "s"
                  : ""}
              </span>

              <span
                className="
                  flex
                  items-center
                  gap-1.5
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

                Auto-refreshing every
                10 seconds
              </span>
            </div>
          )}
      </Card>
    </div>
  );
}

// =====================================================
// TABLE HEADER
// =====================================================

function TableHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th
      className="
        px-5
        py-3.5
        text-[10px]
        font-bold
        uppercase
        tracking-wider
        text-slate-400
      "
    >
      {children}
    </th>
  );
}

// =====================================================
// DEVICE ROW
// =====================================================

function DeviceRow({
  device,
}: {
  device: Device;
}) {
  const config =
    STATUS_CONFIG[
      device.status
    ];

  const StatusIcon =
    config.icon;

  return (
    <tr
      className="
        group
        border-b
        border-slate-100
        transition-colors
        duration-200
        last:border-0
        hover:bg-slate-50/70
      "
    >
      {/* DEVICE */}

      <td className="px-5 py-4">
        <Link
          href={`/dashboard/devices/${encodeURIComponent(
            device.deviceId
          )}`}
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
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-primary/10
              transition-colors
              group-hover:bg-primary
            "
          >
            <Cpu
              className="
                h-4
                w-4
                text-primary
                group-hover:text-primary-foreground
              "
            />
          </div>

          <div className="min-w-0">
            <p
              className="
                truncate
                font-semibold
                text-slate-800
                group-hover:text-primary
              "
            >
              {device.name}
            </p>

            <p
              className="
                mt-0.5
                font-mono
                text-[10px]
                text-slate-400
              "
            >
              {device.deviceId}
            </p>
          </div>
        </Link>
      </td>

      {/* SERIAL */}

      <td className="px-5 py-4">
        <span
          className="
            font-mono
            text-xs
            text-slate-500
          "
        >
          {device.serialId ||
            "—"}
        </span>
      </td>

      {/* TYPE */}

      <td className="px-5 py-4">
        <span
          className="
            inline-flex
            items-center
            rounded-lg
            border
            border-slate-200
            bg-slate-50
            px-2.5
            py-1
            text-[10px]
            font-bold
            uppercase
            tracking-wide
            text-slate-500
          "
        >
          {device.type}
        </span>
      </td>

      {/* LOCATION */}

      <td className="px-5 py-4">
        {device.location ? (
          <div
            className="
              flex
              max-w-[180px]
              items-center
              gap-1.5
              text-xs
              text-slate-500
            "
          >
            <MapPin
              className="
                h-3.5
                w-3.5
                shrink-0
                text-slate-400
              "
            />

            <span className="truncate">
              {
                device.location
              }
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">
            —
          </span>
        )}
      </td>

      {/* IP */}

      <td className="px-5 py-4">
        {device.ipAddress ? (
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <Wifi
              className="
                h-3.5
                w-3.5
                text-slate-400
              "
            />

            <span
              className="
                font-mono
                text-xs
                text-slate-500
              "
            >
              {
                device.ipAddress
              }
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">
            —
          </span>
        )}
      </td>

      {/* STATUS */}

      <td className="px-5 py-4">
        <span
          className={`
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border
            px-2.5
            py-1.5
            text-[10px]
            font-semibold
            ${config.badgeClass}
          `}
        >
          <span
            className={`
              h-1.5
              w-1.5
              rounded-full
              ${config.dotClass}
              ${
                device.status ===
                "RUNNING"
                  ? "animate-pulse"
                  : ""
              }
            `}
          />

          <StatusIcon
            className="
              h-3
              w-3
            "
          />

          {config.label}
        </span>
      </td>

      {/* LAST SEEN */}

      <td className="px-5 py-4">
        <span
          className="
            whitespace-nowrap
            text-xs
            text-slate-400
          "
        >
          {formatLastSeen(
            device.lastSeen
          )}
        </span>
      </td>
    </tr>
  );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  title,
  value,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: number;
  icon: typeof Cpu;
  iconClass: string;
}) {
  return (
    <Card
      className="
        group
        overflow-hidden
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
          justify-between
          gap-3
          p-4
        "
      >
        <div>
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            {title}
          </p>

          <p
            className="
              mt-1
              text-2xl
              font-bold
              tracking-tight
              text-slate-900
            "
          >
            {value}
          </p>
        </div>

        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            transition-transform
            duration-300
            group-hover:scale-110
            ${iconClass}
          `}
        >
          <Icon
            className="
              h-5
              w-5
            "
          />
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// EMPTY DEVICES
// =====================================================

function EmptyDevices() {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        px-6
        py-16
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
          bg-primary/10
        "
      >
        <Server
          className="
            h-6
            w-6
            text-primary
          "
        />
      </div>

      <h3
        className="
          mt-5
          text-base
          font-bold
          text-slate-800
        "
      >
        No devices registered
      </h3>

      <p
        className="
          mt-1
          max-w-sm
          text-xs
          leading-5
          text-slate-400
        "
      >
        Register your first ESP32
        or monitoring device to
        start receiving telemetry.
      </p>

      <Link
        href="/dashboard/devices/register"
        className="
          mt-5
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-primary
          px-4
          py-2.5
          text-sm
          font-semibold
          text-primary-foreground
          shadow-md
          shadow-primary/20
          transition-all
          hover:-translate-y-0.5
          hover:shadow-lg
        "
      >
        <Plus
          className="
            h-4
            w-4
          "
        />

        Register Device
      </Link>
    </div>
  );
}

// =====================================================
// LAST SEEN
// =====================================================

function formatLastSeen(
  timestamp?: string
): string {
  if (!timestamp) {
    return "Never";
  }

  const date =
    new Date(timestamp);

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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}