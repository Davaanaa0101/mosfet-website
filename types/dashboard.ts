import { Device } from "./device";

export interface DashboardSummary {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  alerts: number;
  avgTemperature: number;
  avgHumidity: number;
  latestDevices: Device[];
}

export interface DashboardDevice {
  _id: string;
  deviceId: string;
  name: string;
  location: string;
  status: "online" | "offline";
  lastSeen: string;
}


