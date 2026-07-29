import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;

  phone: string;
  company?: string;

  avatar?: string;

  role: "customer" | "staff" | "admin";

  status: "active" | "inactive" | "blocked";

  emailVerified: boolean;

  lastLogin?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    avatar: {
        type: String,
        default: "",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      default: "",
    },

    role: {
        type: String,
        enum: ["customer", "staff", "admin"],
        default: "customer",
    },

    status: {
        type: String,
        enum: ["active", "inactive", "blocked"],
        default: "active",
    },

    lastLogin: {
        type: Date,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;