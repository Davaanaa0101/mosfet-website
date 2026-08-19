import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

// =====================================================
// ALERT TYPES
// =====================================================

export type AlertType =
  | "DEVICE_OFFLINE"
  | "HIGH_TEMPERATURE"
  | "LOW_TEMPERATURE"
  | "HIGH_HUMIDITY"
  | "LOW_HUMIDITY"
  | "HIGH_CURRENT"
  | "LOW_RSSI";

// =====================================================
// ALERT STATUS
// =====================================================

export type AlertStatus =
  | "active"
  | "resolved";

// =====================================================
// ALERT DOCUMENT
// =====================================================

export interface IAlert
  extends Document {
  deviceId: string;

  deviceName?: string;

  type: AlertType;

  status: AlertStatus;

  title: string;

  message: string;

  severity:
    | "critical"
    | "warning"
    | "info";

  slot?: number;

  sensorType?: string;

  sensorName?: string;

  value?: number | null;

  threshold?: number | null;

  unit?: string;

  triggeredAt: Date;

  resolvedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

// =====================================================
// SCHEMA
// =====================================================

const AlertSchema =
  new Schema<IAlert>(
    {
      deviceId: {
        type: String,
        required: true,
        index: true,
      },

      deviceName: {
        type: String,
        default: "",
      },

      type: {
        type: String,
        enum: [
          "DEVICE_OFFLINE",
          "HIGH_TEMPERATURE",
          "LOW_TEMPERATURE",
          "HIGH_HUMIDITY",
          "LOW_HUMIDITY",
          "HIGH_CURRENT",
          "LOW_RSSI",
        ],
        required: true,
      },

      status: {
        type: String,
        enum: [
          "active",
          "resolved",
        ],
        default: "active",
        index: true,
      },

      title: {
        type: String,
        required: true,
      },

      message: {
        type: String,
        required: true,
      },

      severity: {
        type: String,
        enum: [
          "critical",
          "warning",
          "info",
        ],
        default: "warning",
      },

      slot: {
        type: Number,
      },

      sensorType: {
        type: String,
      },

      sensorName: {
        type: String,
      },

      value: {
        type: Number,
        default: null,
      },

      threshold: {
        type: Number,
        default: null,
      },

      unit: {
        type: String,
        default: "",
      },

      triggeredAt: {
        type: Date,
        default: Date.now,
        index: true,
      },

      resolvedAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

// =====================================================
// INDEXES
// =====================================================

AlertSchema.index({
  deviceId: 1,
  status: 1,
  triggeredAt: -1,
});

AlertSchema.index({
  status: 1,
  triggeredAt: -1,
});

// =====================================================
// EXPORT
// =====================================================

const Alert: Model<IAlert> =
  mongoose.models.Alert ||
  mongoose.model<IAlert>(
    "Alert",
    AlertSchema
  );

export default Alert;