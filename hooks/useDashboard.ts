"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/services/dashboard";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardSummary,
    refetchInterval: 10000,
  });
}