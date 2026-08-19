import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

// =====================================================
// SENSOR
// =====================================================

export interface IDeviceLogSensor {
  slot: number;
  type: string;
  value?: number | null;
}

// =====================================================
// DEVICE LOG
// =====================================================

export interface IDeviceLog
  extends Document {
  // -----------------------------------------------
  // DEVICE IDENTITY
  // -----------------------------------------------

  deviceId: string;

  serialId: string;

  // -----------------------------------------------
  // TELEMETRY
  // -----------------------------------------------

  temperature?: number;

  humidity?: number;

  voltage?: number;

  current?: number;

  power?: number;

  energy?: number;

  // -----------------------------------------------
  // NETWORK
  // -----------------------------------------------

  wifiSSID?: string;

  ipAddress?: string;

  rssi?: number;

  // -----------------------------------------------
  // ESP32 SYSTEM
  // -----------------------------------------------

  freeHeap?: number;

  uptime?: number;

  // -----------------------------------------------
  // SENSORS
  // -----------------------------------------------

  sensors: IDeviceLogSensor[];

  // -----------------------------------------------
  // TIMESTAMPS
  // -----------------------------------------------

  createdAt: Date;

  updatedAt: Date;
}

// =====================================================
// SENSOR SCHEMA
// =====================================================

const DeviceLogSensorSchema =
  new Schema<IDeviceLogSensor>(
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
      // =================================================
      // DEVICE ID
      // =================================================

      deviceId: {
        type: String,
        required: true,
        index: true,
        trim: true,
      },

      // =================================================
      // SERIAL ID
      //
      // Physical identity of the ESP32.
      //
      // Example:
      //
      // MOSFET-ESP32-000001
      // =================================================

      serialId: {
        type: String,
        required: true,
        index: true,
        trim: true,
      },

      // =================================================
      // TEMPERATURE
      // =================================================

      temperature: {
        type: Number,
      },

      // =================================================
      // HUMIDITY
      // =================================================

      humidity: {
        type: Number,
      },

      // =================================================
      // VOLTAGE
      // =================================================

      voltage: {
        type: Number,
      },

      // =================================================
      // CURRENT
      // =================================================

      current: {
        type: Number,
      },

      // =================================================
      // POWER
      // =================================================

      power: {
        type: Number,
      },

      // =================================================
      // ENERGY
      // =================================================

      energy: {
        type: Number,
      },

      // =================================================
      // WIFI SSID
      // =================================================

      wifiSSID: {
        type: String,
        default: "",
      },

      // =================================================
      // IP ADDRESS
      // =================================================

      ipAddress: {
        type: String,
        default: "",
      },

      // =================================================
      // RSSI
      // =================================================

      rssi: {
        type: Number,
      },

      // =================================================
      // FREE HEAP
      // =================================================

      freeHeap: {
        type: Number,
      },

      // =================================================
      // UPTIME
      // =================================================

      uptime: {
        type: Number,
      },

      // =================================================
      // SENSOR ARRAY
      // =================================================

      sensors: {
        type: [
          DeviceLogSensorSchema,
        ],

        default: [],
      },
    },

    // ===================================================
    // TIMESTAMPS
    // ===================================================

    {
      timestamps: true,
    }
  );

// =====================================================
// INDEXES
// =====================================================

// Fast telemetry lookup by device + time.
DeviceLogSchema.index({
  deviceId: 1,
  createdAt: -1,
});

// Fast telemetry lookup by serial + time.
DeviceLogSchema.index({
  serialId: 1,
  createdAt: -1,
});

// =====================================================
// EXPORT
// =====================================================

const DeviceLog =
  (mongoose.models.DeviceLog ||
    mongoose.model<IDeviceLog>(
      "DeviceLog",
      DeviceLogSchema
    )) as Model<IDeviceLog>;

export default DeviceLog;