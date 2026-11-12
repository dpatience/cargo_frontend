import { z } from "zod";

/** Normalises a Rwandan mobile number to +2507XXXXXXXX, or returns null when invalid. */
export function normalizeRwandaPhone(input: string): string | null {
  const digits = input.replace(/[\s\-().]/g, "");
  let local: string;
  if (/^\+2507\d{8}$/.test(digits)) local = digits.slice(4);
  else if (/^2507\d{8}$/.test(digits)) local = digits.slice(3);
  else if (/^07\d{8}$/.test(digits)) local = digits.slice(1);
  else if (/^7\d{8}$/.test(digits)) local = digits;
  else return null;
  // Rwandan mobile prefixes: 72/73 (Airtel), 78/79 (MTN).
  if (!/^7[2389]/.test(local)) return null;
  return `+250${local}`;
}

export function rwandaNetwork(phone: string): "MTN" | "Airtel" | null {
  const n = normalizeRwandaPhone(phone);
  if (!n) return null;
  return /^\+2507[89]/.test(n) ? "MTN" : "Airtel";
}

/** Vehicle-based size picker: maps to the API's sizeClass + typical outer dimensions (cm). */
export const VEHICLE_SIZES = [
  { id: "moto", sizeClass: "small", dims: { length: 50, width: 40, height: 40 } },
  { id: "car", sizeClass: "medium", dims: { length: 100, width: 60, height: 50 } },
  { id: "pickup", sizeClass: "large", dims: { length: 180, width: 120, height: 80 } },
  { id: "truck", sizeClass: "xlarge", dims: { length: 400, width: 200, height: 180 } },
] as const;
export type VehicleSizeId = (typeof VEHICLE_SIZES)[number]["id"];

export const CARGO_CATEGORIES = [
  "produce", "electronics", "furniture", "documents", "parts", "clothing", "other",
] as const;

/** Search params an assistant (or a shared link) may use to pre-fill /send. Never confirms or pays. */
export const sendPrefillSchema = z.object({
  fromLat: z.number().optional(),
  fromLng: z.number().optional(),
  fromLabel: z.string().optional(),
  toLat: z.number().optional(),
  toLng: z.number().optional(),
  toLabel: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  weightKg: z.number().optional(),
  size: z.string().optional(),
  fragile: z.boolean().optional(),
  recipientName: z.string().optional(),
  recipientPhone: z.string().optional(),
  notes: z.string().optional(),
});
export type SendPrefill = z.infer<typeof sendPrefillSchema>;

const validLat = (n?: number) => typeof n === "number" && n >= -3 && n <= -1;
const validLng = (n?: number) => typeof n === "number" && n >= 28.8 && n <= 31;

/** Turns raw (already type-checked) params into safe initial form values. Coordinates must be inside Rwanda. */
export function readPrefill(p: SendPrefill) {
  const loc = (lat?: number, lng?: number, label?: string) =>
    validLat(lat) && validLng(lng) && label?.trim()
      ? { lat: lat!, lng: lng!, label: label.trim().slice(0, 120) }
      : null;
  const size = VEHICLE_SIZES.find((v) => v.id === p.size) ?? null;
  const weight = typeof p.weightKg === "number" && p.weightKg > 0 && p.weightKg <= 20000 ? p.weightKg : null;
  return {
    from: loc(p.fromLat, p.fromLng, p.fromLabel),
    to: loc(p.toLat, p.toLng, p.toLabel),
    category: p.category?.trim().slice(0, 80) ?? "",
    description: p.description?.trim().slice(0, 200) ?? "",
    weightKg: weight,
    size,
    fragile: p.fragile === true,
    recipientName: p.recipientName?.trim().slice(0, 80) ?? "",
    recipientPhone: p.recipientPhone ? normalizeRwandaPhone(p.recipientPhone) : null,
    notes: p.notes?.trim().slice(0, 200) ?? "",
  };
}
