import mongoose, {
  Schema,
  Model,
  Document,
} from "mongoose";

export interface IDeviceSensor {
  slot: number;
  type: string;
  value?: number | null;
}

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

  sensors?: IDeviceSensor[];

  createdAt: Date;
}

const DeviceSensorSchema =
  new Schema<IDeviceSensor>(
    {
      slot: {
        type: Number,
        required: true,
      },

      type: {
        type: String,
        required: true,
      },

      value: {
        type: Number,
        default: null,
      },
    },
    {
      _id: false,
    }
  );

const DeviceLogSchema =
  new Schema<IDeviceLog>(
    {
      deviceId: {
        type: String,
        required: true,
        index: true,
      },

      temperature: Number,

      humidity: Number,

      voltage: Number,

      current: Number,

      power: Number,

      energy: Number,

      wifiSSID: String,

      ipAddress: String,

      rssi: Number,

      freeHeap: Number,

      uptime: Number,

      sensors: {
        type: [DeviceSensorSchema],
        default: [],
      },
    },
    {
      timestamps: {
        createdAt: true,
        updatedAt: false,
      },
    }
  );

export default (mongoose.models.DeviceLog ||
  mongoose.model<IDeviceLog>(
    "DeviceLog",
    DeviceLogSchema
  )) as Model<IDeviceLog>;