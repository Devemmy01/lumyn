import { randomBytes } from "crypto";

export function downloadTokenTtlDays(): number {
  const configured = Number(process.env.STORE_DOWNLOAD_TOKEN_TTL_DAYS ?? 7);
  return Number.isFinite(configured) && configured > 0 ? configured : 7;
}

export function downloadCap(): number {
  const configured = Number(process.env.STORE_DOWNLOAD_CAP ?? 5);
  return Number.isInteger(configured) && configured > 0 ? configured : 5;
}

export function generateDownloadToken(): string {
  return randomBytes(32).toString("hex");
}

export function freshTokenExpiry(): Date {
  return new Date(Date.now() + downloadTokenTtlDays() * 24 * 60 * 60 * 1000);
}
