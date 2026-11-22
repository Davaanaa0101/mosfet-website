import { Device } from "@/types/device";

export async function getDevice(id: string): Promise<Device> {
  const res = await fetch(`/api/devices/${id}`);

  if (!res.ok) {
    throw new Error("Failed to load device");
  }

  return res.json();
}