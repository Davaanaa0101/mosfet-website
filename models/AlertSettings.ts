import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

export interface IAlertSettings
  extends Document {
  highTemperatureEnabled: boolean;
  highTemperature: number;

  lowTemperatureEnabled: boolean;
  lowTemperature: number;

  highHumidityEnabled: boolean;
  highHumidity: number;

  lowHumidityEnabled: boolean;
  lowHumidity: number;

  highCurrentEnabled: boolean;
  highCurrent: number;

  lowRssiEnabled: boolean;
  lowRssi: number;

  deviceOfflineEnabled: boolean;
  deviceOfflineSeconds: number;

  createdAt: Date;
  updatedAt: Date;
}

const AlertSettingsSchema =
  new Schema<IAlertSettings>(
    {
      highTemperatureEnabled: {
        type: Boolean,
        default: true,
      },

      highTemperature: {
        type: Number,
        default: 30,
      },

      lowTemperatureEnabled: {
        type: Boolean,
        default: true,
      },

      lowTemperature: {
        type: Number,
        default: 0,
      },

      highHumidityEnabled: {
        type: Boolean,
        default: true,
      },

      highHumidity: {
        type: Number,
        default: 80,
      },

      lowHumidityEnabled: {
        type: Boolean,
        default: true,
      },

      lowHumidity: {
        type: Number,
        default: 20,
      },

      highCurrentEnabled: {
        type: Boolean,
        default: true,
      },

      highCurrent: {
        type: Number,
        default: 10,
      },

      lowRssiEnabled: {
        type: Boolean,
        default: true,
      },

      lowRssi: {
        type: Number,
        default: -80,
      },

      deviceOfflineEnabled: {
        type: Boolean,
        default: true,
      },

      deviceOfflineSeconds: {
        type: Number,
        default: 30,
      },
    },
    {
      timestamps: true,
    }
  );

const AlertSettings: Model<IAlertSettings> =
  mongoose.models.AlertSettings ||
  mongoose.model<IAlertSettings>(
    "AlertSettings",
    AlertSettingsSchema
  );

export default AlertSettings;