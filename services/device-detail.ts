import { Device } from "@/types/device";

export async function getDevice(id: string): Promise<Device> {
  const res = await fetch(`/api/devices/${encodeURIComponent(id)}`);
  const payload = await res.json();

  if (!res.ok || !payload?.success || !payload?.device) {
    throw new Error(payload?.error || "Failed to load device");
  }

  return payload.device as Device;
}

export async function updateDevice(
  id: string,
  values: { name: string; location: string; identifier: string },
): Promise<Device> {
  const res = await fetch(`/api/devices/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const payload = await res.json();

  if (!res.ok || !payload?.success || !payload?.device) {
    throw new Error(payload?.error || "Failed to update device");
  }

  return payload.device as Device;
}
