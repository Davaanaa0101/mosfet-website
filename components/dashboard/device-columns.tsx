"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Activity,
  MapPin,
  Radio,
  Server,
  Wifi,
  WifiOff,
} from "lucide-react";

import { Device } from "@/types/device";

export const columns: ColumnDef<Device>[] = [
  // =====================================================
  // DEVICE ID
  // =====================================================

  {
    accessorKey: "deviceId",

    header: () => (
      <div className="flex items-center gap-2">
        <Server className="h-4 w-4 text-slate-400" />
        <span>Device ID</span>
      </div>
    ),

    cell: ({ row }) => {
      const deviceId =
        row.original.deviceId;

      return (
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-9
              w-9
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
                font-mono
                text-sm
                font-semibold
                text-slate-800
              "
            >
              {deviceId}
            </p>

            <p
              className="
                mt-0.5
                text-[11px]
                text-slate-400
              "
            >
              Device identifier
            </p>
          </div>
        </div>
      );
    },
  },

  // =====================================================
  // NAME
  // =====================================================

  {
    accessorKey: "name",

    header: "Name",

    cell: ({ row }) => {
      const name =
        row.original.name;

      return (
        <div>
          <p
            className="
              font-medium
              text-slate-800
            "
          >
            {name || "Unnamed device"}
          </p>
        </div>
      );
    },
  },

  // =====================================================
  // TYPE
  // =====================================================

  {
    accessorKey: "type",

    header: "Type",

    cell: ({ row }) => {
      const type =
        row.original.type;

      return (
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
            text-xs
            font-medium
            text-slate-600
          "
        >
          {type || "Unknown"}
        </span>
      );
    },
  },

  // =====================================================
  // LOCATION
  // =====================================================

  {
    accessorKey: "location",

    header: () => (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-slate-400" />
        <span>Location</span>
      </div>
    ),

    cell: ({ row }) => {
      const location =
        row.original.location;

      return (
        <div className="flex items-center gap-2">
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
              max-w-[180px]
              truncate
              text-sm
              text-slate-600
            "
          >
            {location || "Not specified"}
          </span>
        </div>
      );
    },
  },

  // =====================================================
  // STATUS
  // =====================================================

  {
    accessorKey: "status",

    header: () => (
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-slate-400" />
        <span>Status</span>
      </div>
    ),

    cell: ({ row }) => {
      const status =
        row.original.status;

      const isOnline =
        status === "online";

      return (
        <span
          className={`
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            px-3
            py-1.5
            text-xs
            font-semibold
            capitalize
            ${
              isOnline
                ? `
                  border-emerald-200
                  bg-emerald-50
                  text-emerald-700
                `
                : `
                  border-red-200
                  bg-red-50
                  text-red-600
                `
            }
          `}
        >
          <span
            className={`
              h-2
              w-2
              rounded-full
              ${
                isOnline
                  ? `
                    bg-emerald-500
                    shadow-[0_0_8px_rgba(16,185,129,0.6)]
                  `
                  : `
                    bg-red-500
                  `
              }
            `}
          />

          {isOnline ? (
            <Wifi
              className="h-3.5 w-3.5"
            />
          ) : (
            <WifiOff
              className="h-3.5 w-3.5"
            />
          )}

          {isOnline
            ? "Online"
            : "Offline"}
        </span>
      );
    },
  },
];