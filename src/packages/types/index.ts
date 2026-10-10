import { z } from "zod";

export const Money = z.object({ amount: z.number(), currency: z.literal("RWF").default("RWF") });

export const Location = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  type: z.enum(["address", "cargo_point", "landmark", "town"]).optional(),
  source: z.literal("google"),
});
export type Location = z.infer<typeof Location>;

export const Session = z.object({
  token: z.string(),
  expiresInSeconds: z.number().int().positive(),
  user: z.object({
    id: z.string(),
    name: z.string().nullable().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    roles: z.array(z.string()).default([]),
  }),
});
export type SessionResponse = z.infer<typeof Session>;
export const OtpRequested = z.object({
  requestId: z.string(),
  expiresInSeconds: z.number().int().positive(),
});

export const CargoAnalysis = z.object({
  analysisId: z.string(),
  category: z.string(),
  description: z.string().optional(),
  estimatedWeightKg: z.number().nullable().optional(),
  dimensionsCm: z
    .object({ length: z.number(), width: z.number(), height: z.number() })
    .nullable()
    .optional(),
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
  route: z
    .array(
      z.object({
        label: z.string(),
        mode: z.string().optional(),
        source: z.literal("google").optional(),
      }),
    )
    .default([]),
  recommended: z.boolean().optional(),
});
export const Quote = z.object({
  quoteId: z.string(),
  expiresAt: z.string().datetime({ offset: true }),
  options: z.array(QuoteOption),
});
export type Quote = z.infer<typeof Quote>;
export type QuoteOption = z.infer<typeof QuoteOption>;

export const ShipmentStatus = z.string();
export const TrackingEvent = z.object({
  at: z.string(),
  status: z.string(),
  label: z.string(),
  location: z.string().nullable().optional(),
});
export const Shipment = z.object({
  id: z.string(),
  trackingCode: z.string(),
  status: ShipmentStatus,
  statusLabel: z.string().optional(),
  origin: z.string(),
  destination: z.string(),
  originSource: z.literal("google").optional(),
  destinationSource: z.literal("google").optional(),
  recipientName: z.string().optional(),
  recipientPhone: z.string().optional(),
  price: Money.optional(),
  createdAt: z.string(),
  eta: z.string().nullable().optional(),
  events: z.array(TrackingEvent).default([]),
  paymentUrl: z.string().nullable().optional(),
});
export type Shipment = z.infer<typeof Shipment>;
export const PublicTracking = z
  .object({
    id: z.string(),
    trackingCode: z.string(),
    status: ShipmentStatus,
    statusLabel: z.string().optional(),
    origin: z.string(),
    destination: z.string(),
    originSource: z.literal("google"),
    destinationSource: z.literal("google"),
    eta: z.string().nullable().optional(),
    price: Money.optional(),
    createdAt: z.string(),
    events: z.array(TrackingEvent).default([]),
  })
  .strict();
export type PublicTracking = z.infer<typeof PublicTracking>;
export const Paginated = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    total: z.number(),
    page: z.number().default(1),
    pageSize: z.number().default(20),
  });

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

export const AdminMetric = z.object({
  key: z.string(),
  label: z.string(),
  value: z.union([z.number(), z.string()]),
  unit: z.string().optional(),
  trend: z.number().optional(),
});
export const AdminDashboard = z.object({
  metrics: z.array(AdminMetric),
  alerts: z
    .array(
      z.object({
        id: z.string(),
        severity: z.enum(["info", "warning", "critical"]),
        message: z.string(),
      }),
    )
    .default([]),
});
export type AdminDashboard = z.infer<typeof AdminDashboard>;

export const TariffVersion = z.object({
  id: z.string(),
  version: z.number().int().positive(),
  name: z.string(),
  baseFeeRwf: z.number().int().nonnegative(),
  perKgRwf: z.number().int().nonnegative(),
  perKmRwf: z.number().int().nonnegative(),
  sizeRatesRwf: z.record(z.string(), z.number().int().nonnegative()),
  fragileSurchargeRwf: z.number().int().nonnegative(),
  status: z.enum(["draft", "active", "retired"]),
  activatedAt: z.string().datetime({ offset: true }).nullable(),
  updatedAt: z.string().datetime({ offset: true }),
});
export type TariffVersion = z.infer<typeof TariffVersion>;

export const VisionReview = z.object({
  id: z.string(),
  shipmentId: z.string().nullable().optional(),
  imageUrls: z.array(z.string()),
  analysis: CargoAnalysis,
  createdAt: z.string(),
});
export type VisionReview = z.infer<typeof VisionReview>;

export const Ok = z.object({ ok: z.boolean() }).passthrough();
