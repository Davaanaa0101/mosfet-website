import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDevice extends Document {
  customerId?: string;

  projectId?: string;

  deviceId: string;

  name: string;

  type: "esp32" | "plc" | "modbus" | "camera";

  location: string;

  macAddress?: string;

  firmware?: string;

  status: "online" | "offline";

  ipAddress?: string;

  lastSeen?: Date;

  createdAt: Date;

  updatedAt: Date;
}

const DeviceSchema = new Schema<IDevice>(
  {
    customerId: String,

    projectId: String,

    deviceId: {
      type: String,
      unique: true,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["esp32", "plc", "modbus", "camera"],
      default: "esp32",
    },

    location: String,

    macAddress: String,

    firmware: String,

    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },

    ipAddress: String,

    lastSeen: Date,
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.Device ||
  mongoose.model<IDevice>("Device", DeviceSchema)) as Model<IDevice>;