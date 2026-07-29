import { Device } from "@/types/device";

export async function getDevices(): Promise<Device[]> {
  const res = await fetch("/api/devices");

  if (!res.ok) {
    throw new Error("Failed to load devices");
  }

  return res.json();
}