import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  username: string;
  password: string;
  role: string;
  ipAddress: string;
  loginAttempts: number;
  lockUntil: number;
  refreshToken: string;
}

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  ipAddress: { type: String, unique: true, required: true },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Number, default: 0 },
  refreshToken: { type: String },
});

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
