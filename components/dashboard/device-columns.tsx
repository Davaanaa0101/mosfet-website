"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Device } from "@/types/device";

export const columns: ColumnDef<Device>[] = [
  {
    accessorKey: "deviceId",
    header: "Device ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <span
          className={
            status === "online"
              ? "text-green-600 font-medium"
              : "text-red-600 font-medium"
          }
        >
          {status}
        </span>
      );
    },
  },
];