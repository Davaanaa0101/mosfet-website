"use client";

import {
  MapPin,
  Radio,
} from "lucide-react";

import { useDevice } from "@/hooks/useDevice";

interface Props {
  deviceId: string;
}

// =====================================================
// STATUS LABEL
// =====================================================

function getStatusLabel(
  status: string | undefined
): string {
  switch (status) {
    case "NOT_REGISTERED":
      return "Not Registered";

    case "REGISTERED":
      return "Registered";

    case "RUNNING":
      return "Running";

    case "WARNING":
      return "Warning";

    case "ERROR":
      return "Error";

    case "OFFLINE":
      return "Offline";

    // Backward compatibility
    case "online":
      return "Running";

    case "offline":
      return "Offline";

    default:
      return "Unknown";
  }
}

// =====================================================
// STATUS STYLE
// =====================================================

function getStatusStyle(
  status: string | undefined
) {
  switch (status) {
    case "RUNNING":
    case "online":
      return {
        label: "Running",
        dot: "bg-emerald-500",
        wrapper:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        pulse: true,
      };

    case "WARNING":
      return {
        label: "Warning",
        dot: "bg-amber-500",
        wrapper:
          "border-amber-200 bg-amber-50 text-amber-700",
        pulse: false,
      };

    case "ERROR":
      return {
        label: "Error",
        dot: "bg-red-500",
        wrapper:
          "border-red-200 bg-red-50 text-red-700",
        pulse: false,
      };

    case "REGISTERED":
      return {
        label: "Registered",
        dot: "bg-blue-500",
        wrapper:
          "border-blue-200 bg-blue-50 text-blue-700",
        pulse: false,
      };

    case "NOT_REGISTERED":
      return {
        label: "Not Registered",
        dot: "bg-slate-400",
        wrapper:
          "border-slate-200 bg-slate-50 text-slate-600",
        pulse: false,
      };

    case "OFFLINE":
    case "offline":
      return {
        label: "Offline",
        dot: "bg-slate-400",
        wrapper:
          "border-slate-200 bg-slate-50 text-slate-600",
        pulse: false,
      };

    default:
      return {
        label: "Unknown",
        dot: "bg-slate-400",
        wrapper:
          "border-slate-200 bg-slate-50 text-slate-600",
        pulse: false,
      };
  }
}

// =====================================================
// COMPONENT
// =====================================================

export default function DeviceHeader({
  deviceId,
}: Props) {
  const {
    data,
    isLoading,
  } = useDevice(deviceId);

  // ===================================================
  // LOADING
  // ===================================================

  if (isLoading) {
    return (
      <div
        className="
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <div className="p-6">
          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            <div
              className="
                h-14
                w-14
                animate-pulse
                rounded-2xl
                bg-slate-100
              "
            />

            <div className="flex-1 space-y-3">
              <div
                className="
                  h-6
                  w-52
                  animate-pulse
                  rounded-lg
                  bg-slate-100
                "
              />

              <div
                className="
                  h-4
                  w-36
                  animate-pulse
                  rounded-lg
                  bg-slate-100
                "
              />
            </div>

            <div
              className="
                h-9
                w-24
                animate-pulse
                rounded-full
                bg-slate-100
              "
            />
          </div>
        </div>
      </div>
    );
  }

  // ===================================================
  // NOT FOUND
  // ===================================================

  if (!data) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-red-200
          bg-red-50
          p-5
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
              bg-red-100
            "
          >
            <Radio
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
              Device not found
            </p>

            <p
              className="
                mt-0.5
                text-xs
                text-red-600
              "
            >
              The requested device could not
              be loaded.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===================================================
  // STATUS
  // ===================================================

  const status =
    typeof data.status ===
    "string"
      ? data.status
      : undefined;

  const statusStyle =
    getStatusStyle(status);

  const statusLabel =
    getStatusLabel(status);

  // ===================================================
  // DEVICE NAME
  // ===================================================

  const deviceName =
    data.name ||
    "Unnamed Device";

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* ================================================= */}
      {/* MAIN HEADER */}
      {/* ================================================= */}

      <div
        className="
          relative
          overflow-hidden
          p-5
          sm:p-6
        "
      >
        {/* Background decoration */}

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-48
            w-48
            rounded-full
            bg-primary/5
            blur-3xl
          "
        />

        <div
          className="
            relative
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* ================================================= */}
          {/* DEVICE INFORMATION */}
          {/* ================================================= */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-4
            "
          >
            {/* Device Icon */}

            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-primary/10
                ring-1
                ring-primary/10
              "
            >
              <Radio
                className="
                  h-7
                  w-7
                  text-primary
                "
              />
            </div>

            {/* Name */}

            <div className="min-w-0">
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <h1
                  className="
                    truncate
                    text-xl
                    font-bold
                    tracking-tight
                    text-slate-900
                    sm:text-2xl
                  "
                >
                  {deviceName}
                </h1>

                {/* Small status on mobile */}

                <div
                  className={`
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    lg:hidden
                    ${statusStyle.wrapper}
                  `}
                >
                  <span
                    className={`
                      h-1.5
                      w-1.5
                      rounded-full
                      ${statusStyle.dot}
                      ${
                        statusStyle.pulse
                          ? "animate-pulse"
                          : ""
                      }
                    `}
                  />

                  {statusLabel}
                </div>
              </div>

              {/* Device ID */}

              <div
                className="
                  mt-1.5
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Device ID
                </span>

                <span
                  className="
                    max-w-[220px]
                    truncate
                    font-mono
                    text-xs
                    text-slate-500
                  "
                >
                  {data.deviceId}
                </span>
              </div>

              {/* Location */}

              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-1.5
                  text-xs
                  text-slate-400
                "
              >
                <MapPin
                  className="
                    h-3.5
                    w-3.5
                    shrink-0
                  "
                />

                <span>
                  {data.location ||
                    "Location not specified"}
                </span>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* STATUS */}
          {/* ================================================= */}

          <div
            className={`
              hidden
              shrink-0
              items-center
              gap-2
              rounded-full
              border
              px-4
              py-2.5
              text-xs
              font-bold
              lg:inline-flex
              ${statusStyle.wrapper}
            `}
          >
            <span className="relative flex h-2.5 w-2.5">
              {statusStyle.pulse && (
                <span
                  className={`
                    absolute
                    inline-flex
                    h-full
                    w-full
                    animate-ping
                    rounded-full
                    opacity-50
                    ${statusStyle.dot}
                  `}
                />
              )}

              <span
                className={`
                  relative
                  inline-flex
                  h-2.5
                  w-2.5
                  rounded-full
                  ${statusStyle.dot}
                `}
              />
            </span>

            {statusLabel}
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* DEVICE META */}
      {/* ================================================= */}

      <div
        className="
          grid
          border-t
          border-slate-100
          bg-slate-50/50
          sm:grid-cols-2
        "
      >
        {/* DEVICE ID */}

        <div
          className="
            border-b
            border-slate-100
            px-5
            py-3.5
            sm:border-b-0
            sm:border-r
          "
        >
          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-widest
              text-slate-400
            "
          >
            Device Identifier
          </p>

          <p
            className="
              mt-1
              truncate
              font-mono
              text-xs
              font-medium
              text-slate-600
            "
          >
            {data.deviceId}
          </p>
        </div>

        {/* LOCATION */}

        <div
          className="
            px-5
            py-3.5
          "
        >
          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-widest
              text-slate-400
            "
          >
            Location
          </p>

          <div
            className="
              mt-1
              flex
              items-center
              gap-1.5
            "
          >
            <MapPin
              className="
                h-3.5
                w-3.5
                text-primary
              "
            />

            <p
              className="
                truncate
                text-xs
                font-medium
                text-slate-600
              "
            >
              {data.location ||
                "Not specified"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}