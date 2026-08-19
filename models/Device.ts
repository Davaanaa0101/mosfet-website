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
// DEVICE STATUS
// ---------------------------------------------

export type DeviceStatus =
  | "NOT_REGISTERED"
  | "REGISTERED"
  | "RUNNING"
  | "WARNING"
  | "ERROR"
  | "OFFLINE";

// ---------------------------------------------
// DEVICE
// ---------------------------------------------

export interface IDevice
  extends Document {
  customerId?: string;

  projectId?: string;

  // -------------------------------------------
  // DEVICE IDENTITY
  // -------------------------------------------

  serialId: string;

  deviceId: string;

  name: string;

  type:
    | "esp32"
    | "plc"
    | "modbus"
    | "camera";

  // -------------------------------------------
  // USER OWNERSHIP
  // -------------------------------------------

  userId?: string;

  registeredAt?: Date;

  // -------------------------------------------
  // LOCATION / NETWORK
  // -------------------------------------------

  location: string;

  macAddress?: string;

  firmware?: string;

  ipAddress?: string;

  // -------------------------------------------
  // DEVICE STATUS
  // -------------------------------------------

  status: DeviceStatus;

  lastSeen?: Date;

  // -------------------------------------------
  // DEVICE API KEY
  // -------------------------------------------

  apiKey?: string;

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
      // -----------------------------------------
      // LEGACY / OPTIONAL OWNERSHIP
      // -----------------------------------------

      customerId: {
        type: String,
        index: true,
      },

      projectId: {
        type: String,
        index: true,
      },

      // -----------------------------------------
      // SERIAL ID
      //
      // Physical identity printed on the ESP32.
      // Example:
      // MOSFET-ESP32-000001
      // -----------------------------------------

      serialId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
      },

      // -----------------------------------------
      // DEVICE ID
      //
      // Internal ESP32/device identifier.
      // Example:
      // esp32_1
      // -----------------------------------------

      deviceId: {
        type: String,
        unique: true,
        required: true,
        index: true,
        trim: true,
      },

      // -----------------------------------------
      // DEVICE NAME
      // -----------------------------------------

      name: {
        type: String,
        required: true,
        trim: true,
      },

      // -----------------------------------------
      // DEVICE TYPE
      // -----------------------------------------

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

      // -----------------------------------------
      // USER OWNERSHIP
      //
      // undefined = not registered
      // user ID = registered to that user
      // -----------------------------------------

      userId: {
        type: String,
        index: true,
        sparse: true,
      },

      // -----------------------------------------
      // REGISTRATION DATE
      // -----------------------------------------

      registeredAt: {
        type: Date,
      },

      // -----------------------------------------
      // LOCATION
      // -----------------------------------------

      location: {
        type: String,
        default: "",
      },

      // -----------------------------------------
      // NETWORK
      // -----------------------------------------

      macAddress: {
        type: String,
        default: "",
      },

      firmware: {
        type: String,
        default: "",
      },

      ipAddress: {
        type: String,
        default: "",
      },

      // -----------------------------------------
      // STATUS
      // -----------------------------------------

      status: {
        type: String,

        enum: [
          "NOT_REGISTERED",
          "REGISTERED",
          "RUNNING",
          "WARNING",
          "ERROR",
          "OFFLINE",
        ],

        default:
          "NOT_REGISTERED",

        index: true,
      },

      // -----------------------------------------
      // LAST SEEN
      // -----------------------------------------

      lastSeen: {
        type: Date,
      },

      // -----------------------------------------
      // DEVICE API KEY
      // -----------------------------------------

      apiKey: {
        type: String,
        unique: true,
        sparse: true,
        index: true,
      },

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

// ---------------------------------------------
// EXPORT
// ---------------------------------------------

export default (mongoose.models.Device ||
  mongoose.model<IDevice>(
    "Device",
    DeviceSchema
  )) as Model<IDevice>;