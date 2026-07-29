"use client";

import { useQuery } from "@tanstack/react-query";
import { getDevices } from "@/services/device";

export function useDevices() {
  return useQuery({
    queryKey: ["devices"],
    queryFn: getDevices,
    refetchInterval: 10000,
  });
}