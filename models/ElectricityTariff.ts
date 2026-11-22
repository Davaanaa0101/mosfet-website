import mongoose, { Schema, type Model } from "mongoose";
import type { ElectricityTariffInput } from "@/lib/electricity-tariff";

export interface IElectricityTariff extends ElectricityTariffInput {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ElectricityTariffSchema = new Schema<IElectricityTariff>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    month: { type: String, required: true },
    customerType: { type: String, enum: ["household", "business", "supported"], required: true },
    businessCategory: { type: String, enum: ["industrial", "telecom", "budget", "other"], default: "other" },
    meterType: { type: String, enum: ["single", "two", "three"], required: true },
    monthlyKwh: { type: Number, min: 0, default: 0 },
    dayKwh: { type: Number, min: 0, default: 0 },
    eveningKwh: { type: Number, min: 0, default: 0 },
    nightKwh: { type: Number, min: 0, default: 0 },
    includeBaseFee: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const ElectricityTariff: Model<IElectricityTariff> = mongoose.models.ElectricityTariff || mongoose.model<IElectricityTariff>("ElectricityTariff", ElectricityTariffSchema);
export default ElectricityTariff;
