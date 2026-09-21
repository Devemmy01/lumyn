import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

export function isFieldEncryptionConfigured() {
  return Boolean(process.env.FIELD_ENCRYPTION_KEY);
}

function getKey(): Buffer {
  const secret = process.env.FIELD_ENCRYPTION_KEY;
  if (!secret) throw new Error("Sensitive data storage is temporarily unavailable.");
  const key = Buffer.from(secret, "base64");
  if (key.length !== 32) {
    throw new Error("FIELD_ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
  }
  return key;
}

/** Encrypts a single string field for storage (AES-256-GCM, random IV per call). */
export function encryptField(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return ["v1", iv.toString("base64"), authTag.toString("base64"), encrypted.toString("base64")].join(":");
}

/**
 * Decrypts a field encrypted with encryptField. Falls back to returning the
 * input unchanged (with a warning) if it doesn't look like our ciphertext
 * format — this keeps any data written before encryption was introduced
 * readable instead of throwing, at the cost of that old data staying
 * unencrypted until it's next resubmitted and re-saved.
 */
export function decryptField(value: string): string {
  const parts = value.split(":");
  if (parts.length !== 4 || parts[0] !== "v1") {
    console.warn("[crypto] Encountered a value that isn't in the expected encrypted format; returning as-is.");
    return value;
  }
  try {
    const [, ivB64, authTagB64, dataB64] = parts;
    const key = getKey();
    const iv = Buffer.from(ivB64, "base64");
    const authTag = Buffer.from(authTagB64, "base64");
    const data = Buffer.from(dataB64, "base64");
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString("utf8");
  } catch (error) {
    console.error("[crypto] Failed to decrypt a field value.", error);
    return value;
  }
}
