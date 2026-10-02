import { z } from "zod";

export const Money = z.object({ amount: z.number(), currency: z.literal("RWF").default("RWF") });

export const Location = z.object({
  id: z.string(),
  name: z.string(),
  district: z.string().optional(),
  province: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  type: z.enum(["address", "cargo_point", "landmark", "town"]).optional(),
});
export type Location = z.infer<typeof Location>;

export const Session = z.object({ token: z.string(), user: z.object({ id: z.string(), name: z.string().nullable().optional(), phone: z.string().optional(), email: z.string().optional(), roles: z.array(z.string()).default([]) }) });
export type Session = z.infer<typeof Session>;
export const OtpRequested = z.object({ requestId: z.string(), expiresInSeconds: z.number().optional() });

export const CargoAnalysis = z.object({
  analysisId: z.string(),
  category: z.string(),
  description: z.string().optional(),
  estimatedWeightKg: z.number().nullable().optional(),
  dimensionsCm: z.object({ length: z.number(), width: z.number(), height: z.number() }).nullable().optional(),
  sizeClass: z.string().optional(),
  fragile: z.boolean().optional(),
  confidence: z.number().min(0).max(1),
  needsReview: z.boolean().default(false),
  warnings: z.array(z.string()).default([]),
});
export type CargoAnalysis = z.infer<typeof CargoAnalysis>;

export const QuoteOption = z.object({
  id: z.string(),
  label: z.string(),
  speed: z.string().optional(),
  estimatedDelivery: z.string().optional(),
  price: Money,
  breakdown: z.array(z.object({ label: z.string(), amount: z.number() })).default([]),
  explanation: z.string().optional(),
  route: z.array(z.object({ label: z.string(), mode: z.string().optional() })).default([]),
  recommended: z.boolean().optional(),
});
export const Quote = z.object({ quoteId: z.string(), expiresAt: z.string().optional(), options: z.array(QuoteOption) });
export type Quote = z.infer<typeof Quote>;
export type QuoteOption = z.infer<typeof QuoteOption>;

export const ShipmentStatus = z.string();
export const TrackingEvent = z.object({ at: z.string(), status: z.string(), label: z.string(), location: z.string().nullable().optional() });
export const Shipment = z.object({
  id: z.string(),
  trackingCode: z.string(),
  status: ShipmentStatus,
  statusLabel: z.string().optional(),
  origin: z.string(),
  destination: z.string(),
  recipientName: z.string().optional(),
  recipientPhone: z.string().optional(),
  price: Money.optional(),
  createdAt: z.string(),
  eta: z.string().nullable().optional(),
  events: z.array(TrackingEvent).default([]),
  paymentUrl: z.string().nullable().optional(),
});
export type Shipment = z.infer<typeof Shipment>;
export const Paginated = <T extends z.ZodTypeAny>(item: T) => z.object({ items: z.array(item), total: z.number(), page: z.number().default(1), pageSize: z.number().default(20) });

export const DriverJob = z.object({
  id: z.string(),
  shipmentId: z.string(),
  trackingCode: z.string(),
  type: z.enum(["pickup", "handoff", "delivery"]),
  status: z.string(),
  address: z.string(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  cargoSummary: z.string().optional(),
  scheduledFor: z.string().nullable().optional(),
});
export type DriverJob = z.infer<typeof DriverJob>;

export const AdminMetric = z.object({ key: z.string(), label: z.string(), value: z.union([z.number(), z.string()]), unit: z.string().optional(), trend: z.number().optional() });
export const AdminDashboard = z.object({ metrics: z.array(AdminMetric), alerts: z.array(z.object({ id: z.string(), severity: z.enum(["info", "warning", "critical"]), message: z.string() })).default([]) });
export type AdminDashboard = z.infer<typeof AdminDashboard>;

export const PricingRule = z.object({ id: z.string(), name: z.string(), description: z.string().optional(), value: z.number(), unit: z.string(), active: z.boolean(), updatedAt: z.string().optional() });
export type PricingRule = z.infer<typeof PricingRule>;

export const VisionReview = z.object({ id: z.string(), shipmentId: z.string().nullable().optional(), imageUrls: z.array(z.string()), analysis: CargoAnalysis, createdAt: z.string() });
export type VisionReview = z.infer<typeof VisionReview>;

export const Ok = z.object({ ok: z.boolean() }).passthrough();
