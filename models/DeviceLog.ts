import mongoose, {
  Schema,
  Model,
  Document,
} from "mongoose";

// =====================================================
// SENSOR VALUE
// =====================================================

export interface IDeviceSensor {
  slot: number;

  type: string;

  value?: number | null;
}

// =====================================================
// DEVICE LOG
// =====================================================

export interface IDeviceLog
  extends Document {
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

  // IMPORTANT:
  // Store ALL configured sensor readings.
  sensors?: IDeviceSensor[];

  createdAt: Date;
}

// =====================================================
// SENSOR SCHEMA
// =====================================================

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

// =====================================================
// DEVICE LOG SCHEMA
// =====================================================

const DeviceLogSchema =
  new Schema<IDeviceLog>(
    {
      deviceId: {
        type: String,
        required: true,
        index: true,
      },

      temperature:
        Number,

      humidity:
        Number,

      voltage:
        Number,

      current:
        Number,

      power:
        Number,

      energy:
        Number,

      wifiSSID:
        String,

      ipAddress:
        String,

      rssi:
        Number,

      freeHeap:
        Number,

      uptime:
        Number,

      // ===============================================
      // ALL SENSOR VALUES
      // ===============================================

      sensors: {
        type: [
          DeviceSensorSchema,
        ],
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

// =====================================================
// INDEXES
// =====================================================

DeviceLogSchema.index({
  deviceId: 1,
  createdAt: -1,
});

DeviceLogSchema.index({
  createdAt: -1,
});

// =====================================================
// EXPORT
// =====================================================

export default (mongoose.models
  .DeviceLog ||
  mongoose.model<IDeviceLog>(
    "DeviceLog",
    DeviceLogSchema
  )) as Model<IDeviceLog>;