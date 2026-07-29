"use client";

import { useQuery } from "@tanstack/react-query";

import { getTelemetryHistory } from "@/services/telemetry";

export function useTelemetry(deviceId: string) {
  return useQuery({
    queryKey: ["telemetry", deviceId],
    queryFn: () => getTelemetryHistory(deviceId),
    enabled: !!deviceId,
    refetchInterval: 5000,
  });
}