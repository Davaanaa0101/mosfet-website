"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Activity,
  AlertTriangle,
  Cpu,
  ShieldAlert,
  WifiOff,
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";

// =====================================================
// DASHBOARD STATS
// =====================================================

interface DashboardStats {
  totalDevices: number;

  runningDevices: number;

  warningDevices: number;

  errorDevices: number;

  offlineDevices: number;

  // Backward compatibility

  onlineDevices?: number;
}

// =====================================================
// API RESPONSE
// =====================================================

interface SummaryResponse {
  success?: boolean;

  stats?: DashboardStats;

  totalDevices?: number;

  runningDevices?: number;

  warningDevices?: number;

  errorDevices?: number;

  onlineDevices?: number;

  offlineDevices?: number;

  error?: string;
}

// =====================================================
// COMPONENT
// =====================================================

export default function StatsGrid() {
  const [stats, setStats] =
    useState<DashboardStats | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // =====================================================
  // LOAD STATS
  // =====================================================

  const loadStats =
    useCallback(async () => {
      try {
        const response =
          await fetch(
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

        if (
          result.error ||
          result.success === false
        ) {
          throw new Error(
            result.error ||
              "Failed to load dashboard"
          );
        }

        // =================================================
        // PREFER NEW STATS OBJECT
        // =================================================

        if (result.stats) {
          setStats({
            totalDevices:
              result.stats
                .totalDevices ?? 0,

            runningDevices:
              result.stats
                .runningDevices ?? 0,

            warningDevices:
              result.stats
                .warningDevices ?? 0,

            errorDevices:
              result.stats
                .errorDevices ?? 0,

            offlineDevices:
              result.stats
                .offlineDevices ?? 0,

            onlineDevices:
              result.stats
                .onlineDevices ??
              0,
          });

          setError(null);

          return;
        }

        // =================================================
        // BACKWARD COMPATIBILITY
        // =================================================

        const totalDevices =
          result.totalDevices ?? 0;

        const onlineDevices =
          result.onlineDevices ?? 0;

        const offlineDevices =
          result.offlineDevices ?? 0;

        setStats({
          totalDevices,

          runningDevices:
            result.runningDevices ??
            onlineDevices,

          warningDevices:
            result.warningDevices ??
            0,

          errorDevices:
            result.errorDevices ??
            0,

          offlineDevices,

          onlineDevices,
        });

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
    }, []);

  // =====================================================
  // INITIAL LOAD + AUTO REFRESH
  // =====================================================

  useEffect(() => {
    loadStats();

    const interval =
      setInterval(
        loadStats,
        10_000
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, [loadStats]);

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-red-200
          bg-red-50
          p-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <ShieldAlert
            className="
              h-5
              w-5
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
              Dashboard unavailable
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
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // CARDS
  // =====================================================

  const cards = [
    {
      title: "Total Devices",

      value:
        stats?.totalDevices ?? 0,

      subtitle:
        "Registered devices",

      icon: Cpu,
    },

    {
      title: "Running",

      value:
        stats?.runningDevices ?? 0,

      subtitle:
        "Operating normally",

      icon: Activity,
    },

    {
      title: "Warning",

      value:
        stats?.warningDevices ?? 0,

      subtitle:
        "Requires attention",

      icon: AlertTriangle,
    },

    {
      title: "Errors",

      value:
        stats?.errorDevices ?? 0,

      subtitle:
        "Critical conditions",

      icon: ShieldAlert,
    },

    {
      title: "Offline",

      value:
        stats?.offlineDevices ?? 0,

      subtitle:
        "No recent telemetry",

      icon: WifiOff,
    },
  ];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="
        grid
        gap-4
        sm:grid-cols-2
        xl:grid-cols-5
      "
    >
      {cards.map(
        (card) => (
          <StatCard
            key={
              card.title
            }
            title={
              card.title
            }
            value={
              loading
                ? "..."
                : card.value
            }
            subtitle={
              card.subtitle
            }
            icon={
              card.icon
            }
          />
        )
      )}
    </div>
  );
}