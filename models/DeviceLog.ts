import mongoose, {
  Schema,
  Model,
  Document,
} from "mongoose";

export interface IDeviceLog extends Document {
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

  createdAt: Date;
}

const DeviceLogSchema = new Schema<IDeviceLog>(
  {
    deviceId: {
      type: String,
      required: true,
      index: true,
    },

    temperature: {
      type: Number,
    },

    humidity: {
      type: Number,
    },

    voltage: {
      type: Number,
    },

    current: {
      type: Number,
    },

    power: {
      type: Number,
    },

    energy: {
      type: Number,
    },

    wifiSSID: {
      type: String,
    },

    ipAddress: {
      type: String,
    },

    rssi: {
      type: Number,
    },

    freeHeap: {
      type: Number,
    },

    uptime: {
      type: Number,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const DeviceLog: Model<IDeviceLog> =
  mongoose.models.DeviceLog ||
  mongoose.model<IDeviceLog>(
    "DeviceLog",
    DeviceLogSchema
  );

export default DeviceLog;