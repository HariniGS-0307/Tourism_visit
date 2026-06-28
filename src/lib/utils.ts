import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generate a cryptographically safe booking reference */
export function generateBookingRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let ref = "BKG-";
  Array.from(bytes).forEach((b) => {
    ref += chars[b % chars.length];
  });
  return ref;
}
