"use client";

import { useDevice } from "@/hooks/useDevice";
import { Badge } from "@/components/ui/badge";

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

    // -------------------------------------------------
    // Backward compatibility
    // -------------------------------------------------

    case "online":
      return "Running";

    case "offline":
      return "Offline";

    default:
      return "Unknown";
  }
}

// =====================================================
// STATUS BADGE VARIANT
// =====================================================

function getStatusVariant(
  status: string | undefined
):
  | "default"
  | "secondary"
  | "destructive"
  | "outline" {
  switch (status) {
    case "RUNNING":
    case "online":
      return "default";

    case "WARNING":
      return "secondary";

    case "ERROR":
      return "destructive";

    case "NOT_REGISTERED":
      return "outline";

    case "REGISTERED":
      return "secondary";

    case "OFFLINE":
    case "offline":
      return "secondary";

    default:
      return "outline";
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
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />

          <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  // ===================================================
  // NOT FOUND
  // ===================================================

  if (!data) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
        <p className="text-sm text-destructive">
          Device not found.
        </p>
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

  const statusLabel =
    getStatusLabel(status);

  const statusVariant =
    getStatusVariant(status);

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="flex items-center justify-between gap-6">
      {/* DEVICE INFORMATION */}

      <div className="min-w-0">
        <h1 className="truncate text-3xl font-bold">
          {data.name ||
            "Unnamed Device"}
        </h1>

        {data.location ? (
          <p className="mt-1 text-muted-foreground">
            {data.location}
          </p>
        ) : (
          <p className="mt-1 text-muted-foreground">
            {data.deviceId}
          </p>
        )}
      </div>

      {/* STATUS */}

      <Badge
        variant={
          statusVariant
        }
        className="shrink-0"
      >
        {statusLabel}
      </Badge>
    </div>
  );
}