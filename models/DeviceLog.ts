import mongoose, { Schema, Model, Document } from "mongoose";

export interface IDeviceLog extends Document {
  deviceId: string;

  temperature?: number;

  humidity?: number;

  voltage?: number;

  current?: number;

  power?: number;

  wifiSSID?: string;

  ipAddress?: string;

  rssi?: number;

  freeHeap?: number;

  uptime?: number;

  createdAt: Date;
}

const DeviceLogSchema = new Schema<IDeviceLog>(
  {
    deviceId: String,

    temperature: Number,

    humidity: Number,

    voltage: Number,

    current: Number,

    power: Number,

    wifiSSID: String,

    ipAddress: String,

    rssi: Number,

    freeHeap: Number,

    uptime: Number,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

export default (mongoose.models.DeviceLog ||
  mongoose.model<IDeviceLog>("DeviceLog", DeviceLogSchema)) as Model<IDeviceLog>;