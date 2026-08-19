export interface TelemetryPoint {
  _id?: string;

  deviceId: string;

  temperature?: number;
  humidity?: number;
  voltage?: number;
  current?: number;
  power?: number;
  energy?: number;

  wifiSSID?: string;
  ipAddress?: string;

  rssi?: number;
  freeHeap?: number;
  uptime?: number;

  createdAt: string;
}

interface TelemetryResponse {
  success: boolean;
  deviceId: string;
  data: TelemetryPoint[];
  error?: string;
}

export async function getDeviceTelemetry(
  deviceId: string,
  limit = 100
): Promise<TelemetryPoint[]> {
  const response = await fetch(
    `/api/devices/${encodeURIComponent(
      deviceId
    )}/telemetry?limit=${limit}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load device telemetry"
    );
  }

  const result =
    (await response.json()) as TelemetryResponse;

  if (!result.success) {
    throw new Error(
      result.error ||
        "Failed to load telemetry"
    );
  }

  return result.data;
}