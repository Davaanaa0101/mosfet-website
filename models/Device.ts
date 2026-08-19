import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

// ---------------------------------------------
// SENSOR CONFIGURATION
// ---------------------------------------------

export interface IDeviceSensorConfig {
  slot: number;
  type: string;
  name?: string;
  unit?: string;
}

// ---------------------------------------------
// DEVICE
// ---------------------------------------------

export interface IDevice
  extends Document {
  customerId?: string;

  projectId?: string;

  deviceId: string;

  name: string;

  type:
    | "esp32"
    | "plc"
    | "modbus"
    | "camera";

  location: string;

  macAddress?: string;

  firmware?: string;

  status:
    | "online"
    | "offline";

  ipAddress?: string;

  lastSeen?: Date;

  // -------------------------------------------
  // DEVICE CONFIGURATION
  // -------------------------------------------

  sendInterval: number;

  sensors: IDeviceSensorConfig[];

  createdAt: Date;

  updatedAt: Date;
}

// ---------------------------------------------
// SENSOR CONFIG SCHEMA
// ---------------------------------------------

const DeviceSensorConfigSchema =
  new Schema<IDeviceSensorConfig>(
    {
      slot: {
        type: Number,
        required: true,
      },

      type: {
        type: String,
        required: true,
      },

      name: {
        type: String,
        default: "",
      },

      unit: {
        type: String,
        default: "",
      },
    },
    {
      _id: false,
    }
  );

// ---------------------------------------------
// DEVICE SCHEMA
// ---------------------------------------------

const DeviceSchema =
  new Schema<IDevice>(
    {
      customerId: String,

      projectId: String,

      deviceId: {
        type: String,
        unique: true,
        required: true,
        index: true,
      },

      name: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        enum: [
          "esp32",
          "plc",
          "modbus",
          "camera",
        ],
        default: "esp32",
      },

      location: {
        type: String,
        default: "",
      },

      macAddress: String,

      firmware: String,

      status: {
        type: String,
        enum: [
          "online",
          "offline",
        ],
        default: "offline",
      },

      ipAddress: String,

      lastSeen: Date,

      // -----------------------------------------
      // SEND INTERVAL
      // -----------------------------------------

      sendInterval: {
        type: Number,
        default: 10000,
        min: 1000,
      },

      // -----------------------------------------
      // SENSOR CONFIGURATION
      // -----------------------------------------

      sensors: {
        type: [
          DeviceSensorConfigSchema,
        ],

        default: [
          {
            slot: 1,
            type: "TEMPERATURE",
            name: "DS18B20 #1",
            unit: "°C",
          },
          {
            slot: 2,
            type: "TEMPERATURE",
            name: "DS18B20 #2",
            unit: "°C",
          },
          {
            slot: 3,
            type: "TEMPERATURE",
            name: "DS18B20 #3",
            unit: "°C",
          },
          {
            slot: 4,
            type: "TEMPERATURE",
            name: "DS18B20 #4",
            unit: "°C",
          },
          {
            slot: 5,
            type: "TEMPERATURE",
            name: "DS18B20 #5",
            unit: "°C",
          },
          {
            slot: 6,
            type: "TEMPERATURE",
            name: "DS18B20 #6",
            unit: "°C",
          },
          {
            slot: 7,
            type: "DHT_HUMIDITY",
            name: "AM2302 Humidity",
            unit: "%",
          },
          {
            slot: 8,
            type: "N/A",
            name: "Unused",
            unit: "",
          },
        ],
      },
    },
    {
      timestamps: true,
    }
  );

export default (mongoose.models.Device ||
  mongoose.model<IDevice>(
    "Device",
    DeviceSchema
  )) as Model<IDevice>;