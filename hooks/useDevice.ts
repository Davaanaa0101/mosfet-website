"use client";

import { useQuery } from "@tanstack/react-query";
import { getDevice } from "@/services/device-detail";

export function useDevice(deviceId: string) {
  return useQuery({
    queryKey: ["device", deviceId],
    queryFn: () => getDevice(deviceId),
    enabled: !!deviceId,
  });
}