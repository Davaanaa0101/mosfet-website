import { DeviceTelemetry } from "@/types/device";

export async function getTelemetryHistory(
  deviceId: string
): Promise<DeviceTelemetry[]> {
  const res = await fetch(
    `/api/devices/${deviceId}/history`
  );

  if (!res.ok) {
    throw new Error("Failed to load history");
  }

  return res.json();
}