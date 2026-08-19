"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertTriangle,
  Gauge,
  Save,
  Thermometer,
  Droplets,
  Wifi,
  Clock,
} from "lucide-react";

// =====================================================
// TYPES
// =====================================================

interface AlertSettings {
  highTemperatureEnabled: boolean;
  highTemperature: number;

  lowTemperatureEnabled: boolean;
  lowTemperature: number;

  highHumidityEnabled: boolean;
  highHumidity: number;

  lowHumidityEnabled: boolean;
  lowHumidity: number;

  highCurrentEnabled: boolean;
  highCurrent: number;

  lowRssiEnabled: boolean;
  lowRssi: number;

  deviceOfflineEnabled: boolean;
  deviceOfflineSeconds: number;
}

interface SettingsResponse {
  success: boolean;
  data?: AlertSettings;
  error?: string;
}

// =====================================================
// DEFAULTS
// =====================================================

const DEFAULT_SETTINGS: AlertSettings = {
  highTemperatureEnabled: true,
  highTemperature: 30,

  lowTemperatureEnabled: true,
  lowTemperature: 0,

  highHumidityEnabled: true,
  highHumidity: 80,

  lowHumidityEnabled: true,
  lowHumidity: 20,

  highCurrentEnabled: true,
  highCurrent: 10,

  lowRssiEnabled: true,
  lowRssi: -80,

  deviceOfflineEnabled: true,
  deviceOfflineSeconds: 30,
};

// =====================================================
// PAGE
// =====================================================

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<AlertSettings>(
      DEFAULT_SETTINGS
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  // ===================================================
  // LOAD SETTINGS
  // ===================================================

  const loadSettings =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await fetch(
            "/api/settings/alerts",
            {
              cache: "no-store",
              headers: {
                Accept:
                  "application/json",
              },
            }
          );

        const result =
          (await response.json()) as SettingsResponse;

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Failed to load settings"
          );
        }

        if (
          !result.success ||
          !result.data
        ) {
          throw new Error(
            result.error ||
              "Failed to load settings"
          );
        }

        setSettings({
          ...DEFAULT_SETTINGS,
          ...result.data,
        });
      } catch (err) {
        console.error(
          "[SettingsPage] Load error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load settings"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // ===================================================
  // UPDATE FIELD
  // ===================================================

  function updateSetting<
    K extends keyof AlertSettings
  >(
    key: K,
    value: AlertSettings[K]
  ) {
    setSettings(
      (current) => ({
        ...current,
        [key]: value,
      })
    );

    setSuccess(null);
    setError(null);
  }

  // ===================================================
  // SAVE
  // ===================================================

  async function saveSettings() {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response =
        await fetch(
          "/api/settings/alerts",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            body: JSON.stringify(
              settings
            ),
          }
        );

      const result =
        (await response.json()) as SettingsResponse;

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to save settings"
        );
      }

      if (
        !result.success ||
        !result.data
      ) {
        throw new Error(
          result.error ||
            "Failed to save settings"
        );
      }

      setSettings({
        ...DEFAULT_SETTINGS,
        ...result.data,
      });

      setSuccess(
        "Alert settings saved successfully."
      );
    } catch (err) {
      console.error(
        "[SettingsPage] Save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  }

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Settings
          </h1>

          <p className="mt-1 text-muted-foreground">
            Configure your smart building platform.
          </p>
        </div>

        <Card>
          <CardContent className="py-12">
            <p className="text-center text-sm text-muted-foreground">
              Loading settings...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="space-y-8">
      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <div>
        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="mt-1 text-muted-foreground">
          Configure device and sensor alert thresholds.
        </p>
      </div>

      {/* ============================================= */}
      {/* ERROR */}
      {/* ============================================= */}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            {error}
          </p>
        </div>
      )}

      {/* ============================================= */}
      {/* SUCCESS */}
      {/* ============================================= */}

      {success && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
          <p className="text-sm text-green-700 dark:text-green-400">
            {success}
          </p>
        </div>
      )}

      {/* ============================================= */}
      {/* TEMPERATURE */}
      {/* ============================================= */}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-500/10 p-2 text-orange-600">
              <Thermometer className="h-5 w-5" />
            </div>

            <div>
              <CardTitle>
                Temperature
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Configure temperature warning thresholds.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <ThresholdRow
            enabled={
              settings.highTemperatureEnabled
            }
            onEnabledChange={(
              value
            ) =>
              updateSetting(
                "highTemperatureEnabled",
                value
              )
            }
            title="High Temperature"
            description="Create an alert when a temperature sensor exceeds this value."
            value={
              settings.highTemperature
            }
            onValueChange={(
              value
            ) =>
              updateSetting(
                "highTemperature",
                value
              )
            }
            unit="°C"
          />

          <ThresholdRow
            enabled={
              settings.lowTemperatureEnabled
            }
            onEnabledChange={(
              value
            ) =>
              updateSetting(
                "lowTemperatureEnabled",
                value
              )
            }
            title="Low Temperature"
            description="Create an alert when a temperature sensor falls below this value."
            value={
              settings.lowTemperature
            }
            onValueChange={(
              value
            ) =>
              updateSetting(
                "lowTemperature",
                value
              )
            }
            unit="°C"
          />
        </CardContent>
      </Card>

      {/* ============================================= */}
      {/* HUMIDITY */}
      {/* ============================================= */}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
              <Droplets className="h-5 w-5" />
            </div>

            <div>
              <CardTitle>
                Humidity
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Configure humidity warning thresholds.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <ThresholdRow
            enabled={
              settings.highHumidityEnabled
            }
            onEnabledChange={(
              value
            ) =>
              updateSetting(
                "highHumidityEnabled",
                value
              )
            }
            title="High Humidity"
            description="Create an alert when humidity exceeds this value."
            value={
              settings.highHumidity
            }
            onValueChange={(
              value
            ) =>
              updateSetting(
                "highHumidity",
                value
              )
            }
            unit="%"
          />

          <ThresholdRow
            enabled={
              settings.lowHumidityEnabled
            }
            onEnabledChange={(
              value
            ) =>
              updateSetting(
                "lowHumidityEnabled",
                value
              )
            }
            title="Low Humidity"
            description="Create an alert when humidity falls below this value."
            value={
              settings.lowHumidity
            }
            onValueChange={(
              value
            ) =>
              updateSetting(
                "lowHumidity",
                value
              )
            }
            unit="%"
          />
        </CardContent>
      </Card>

      {/* ============================================= */}
      {/* ELECTRICAL */}
      {/* ============================================= */}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-500/10 p-2 text-yellow-600">
              <Gauge className="h-5 w-5" />
            </div>

            <div>
              <CardTitle>
                Electrical
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Configure electrical monitoring alerts.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ThresholdRow
            enabled={
              settings.highCurrentEnabled
            }
            onEnabledChange={(
              value
            ) =>
              updateSetting(
                "highCurrentEnabled",
                value
              )
            }
            title="High Current"
            description="Create an alert when the absolute current exceeds this value."
            value={
              settings.highCurrent
            }
            onValueChange={(
              value
            ) =>
              updateSetting(
                "highCurrent",
                value
              )
            }
            unit="A"
          />
        </CardContent>
      </Card>

      {/* ============================================= */}
      {/* NETWORK */}
      {/* ============================================= */}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-600">
              <Wifi className="h-5 w-5" />
            </div>

            <div>
              <CardTitle>
                Network
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Configure Wi-Fi signal monitoring.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ThresholdRow
            enabled={
              settings.lowRssiEnabled
            }
            onEnabledChange={(
              value
            ) =>
              updateSetting(
                "lowRssiEnabled",
                value
              )
            }
            title="Weak Wi-Fi Signal"
            description="Create an alert when Wi-Fi signal falls below this value."
            value={
              settings.lowRssi
            }
            onValueChange={(
              value
            ) =>
              updateSetting(
                "lowRssi",
                value
              )
            }
            unit="dBm"
          />
        </CardContent>
      </Card>

      {/* ============================================= */}
      {/* DEVICE */}
      {/* ============================================= */}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-500/10 p-2 text-red-600">
              <Clock className="h-5 w-5" />
            </div>

            <div>
              <CardTitle>
                Device Connection
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Configure when a device should be considered offline.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={
                  settings.deviceOfflineEnabled
                }
                onChange={(event) =>
                  updateSetting(
                    "deviceOfflineEnabled",
                    event.target
                      .checked
                  )
                }
                className="mt-1 h-4 w-4"
              />

              <div>
                <p className="font-medium">
                  Device Offline
                </p>

                <p className="text-sm text-muted-foreground">
                  Create an alert when no telemetry is received for the selected time.
                </p>
              </div>
            </div>

            <DurationInput
              seconds={
                settings.deviceOfflineSeconds
              }
              onChange={(
                seconds
              ) =>
                updateSetting(
                  "deviceOfflineSeconds",
                  seconds
                )
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* ============================================= */}
      {/* SAVE */}
      {/* ============================================= */}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={saveSettings}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />

          {saving
            ? "Saving..."
            : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

// =====================================================
// THRESHOLD ROW
// =====================================================

function ThresholdRow({
  enabled,
  onEnabledChange,
  title,
  description,
  value,
  onValueChange,
  unit,
}: {
  enabled: boolean;
  onEnabledChange: (
    value: boolean
  ) => void;

  title: string;
  description: string;

  value: number;

  onValueChange: (
    value: number
  ) => void;

  unit: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) =>
            onEnabledChange(
              event.target.checked
            )
          }
          className="mt-1 h-4 w-4"
        />

        <div>
          <p className="font-medium">
            {title}
          </p>

          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(event) =>
            onValueChange(
              Number(
                event.target.value
              )
            )
          }
          disabled={!enabled}
          className="w-28 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        />

        <span className="w-12 text-sm text-muted-foreground">
          {unit}
        </span>
      </div>
    </div>
  );
}

// =====================================================
// DURATION INPUT
// =====================================================

function DurationInput({
  seconds,
  onChange,
}: {
  seconds: number;

  onChange: (
    seconds: number
  ) => void;
}) {
  const getUnit =
    seconds >= 3600
      ? "hours"
      : seconds >= 60
      ? "minutes"
      : "seconds";

  const getValue =
    seconds >= 3600
      ? seconds / 3600
      : seconds >= 60
      ? seconds / 60
      : seconds;

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="1"
        step="1"
        value={getValue}
        onChange={(event) => {
          const value =
            Number(
              event.target.value
            ) || 1;

          if (
            getUnit ===
            "hours"
          ) {
            onChange(
              Math.max(
                5,
                Math.round(
                  value * 3600
                )
              )
            );

            return;
          }

          if (
            getUnit ===
            "minutes"
          ) {
            onChange(
              Math.max(
                5,
                Math.round(
                  value * 60
                )
              )
            );

            return;
          }

          onChange(
            Math.max(
              5,
              Math.round(value)
            )
          );
        }}
        className="w-24 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
      />

      <select
        value={getUnit}
        onChange={(event) => {
          const unit =
            event.target.value;

          if (
            unit ===
            "seconds"
          ) {
            onChange(
              Math.max(
                5,
                Math.round(
                  seconds
                )
              )
            );

            return;
          }

          if (
            unit ===
            "minutes"
          ) {
            onChange(
              Math.max(
                5,
                Math.round(
                  getValue * 60
                )
              )
            );

            return;
          }

          onChange(
            Math.max(
              5,
              Math.round(
                getValue * 3600
              )
            )
          );
        }}
        className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="seconds">
          seconds
        </option>

        <option value="minutes">
          minutes
        </option>

        <option value="hours">
          hours
        </option>
      </select>
    </div>
  );
}