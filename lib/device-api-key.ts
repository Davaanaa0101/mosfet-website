import crypto from "crypto";

// =====================================================
// GENERATE DEVICE API KEY
// =====================================================

export function generateDeviceApiKey(): string {
  return crypto
    .randomBytes(32)
    .toString("hex");
}