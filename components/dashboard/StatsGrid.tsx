"use client";

import { useCallback, useEffect, useState } from "react";

import StatCard from "@/components/dashboard/StatCard";

interface DashboardStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
}

interface SummaryResponse {
  success?: boolean;

  stats?: DashboardStats;

  totalDevices?: number;
  onlineDevices?: number;
  offlineDevices?: number;

  error?: string;
}

export default function StatsGrid() {
  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadStats = useCallback(
    async () => {
      try {
        const response = await fetch(
          "/api/dashboard/summary",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load dashboard summary"
          );
        }

        const result =
          (await response.json()) as SummaryResponse;

        if (result.error) {
          throw new Error(result.error);
        }

        const dashboardStats =
          result.stats ?? {
            totalDevices:
              result.totalDevices ?? 0,

            onlineDevices:
              result.onlineDevices ?? 0,

            offlineDevices:
              result.offlineDevices ?? 0,
          };

        setStats(dashboardStats);
        setError(null);
      } catch (err) {
        console.error(
          "[StatsGrid]",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadStats();

    const interval = setInterval(
      loadStats,
      10000
    );

    return () => {
      clearInterval(interval);
    };
  }, [loadStats]);

  if (error) {
    return (
      <div className="rounded-lg border border-destructive p-4">
        <p className="text-sm text-destructive">
          {error}
        </p>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Devices",
      value:
        stats?.totalDevices ?? 0,
    },

    {
      title: "Online",
      value:
        stats?.onlineDevices ?? 0,
    },

    {
      title: "Offline",
      value:
        stats?.offlineDevices ?? 0,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={
            loading
              ? "..."
              : card.value
          }
        />
      ))}
    </div>
  );
}