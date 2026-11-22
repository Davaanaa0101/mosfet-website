export interface Device {
  _id: string;
  deviceId: string;
  name: string;
  type: string;
  location: string;

  status: "online" | "offline";

  firmware?: string;

  ipAddress?: string;
  macAddress?: string;

  lastSeen: string;
}

export interface DeviceTelemetry {
  deviceId: string;

  temperature?: number;
  humidity?: number;

  voltage?: number;
  current?: number;
  power?: number;
  energy?: number;

  rssi?: number;
  freeHeap?: number;
  uptime?: number;

  wifiSSID?: string;
  ipAddress?: string;

  createdAt: string;
}