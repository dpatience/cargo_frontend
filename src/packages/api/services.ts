import { z } from "zod";
import { queryOptions } from "@tanstack/react-query";
import { apiRequest, tokenStore } from "./client";
import type { AppArea } from "../config/env";
import {
  AdminDashboard,
  CargoAnalysis,
  CargoPoint,
  DriverJob,
  DispatchDriver,
  DispatchShipment,
  Location,
  FailedNotification,
  NotificationPreference,
  OperationsException,
  Ok,
  OtpRequested,
  Paginated,
  PublicTracking,
  PricingAuditEvent,
  Quote,
  Session,
  Shipment,
  TariffVersion,
} from "../types";

// ---------- Auth ----------
export const authApi = {
  requestOtp: (area: AppArea, phone: string) =>
    apiRequest("/auth/otp/request", OtpRequested, { method: "POST", body: { phone, app: area } }),
  verifyOtp: (area: AppArea, requestId: string, code: string) =>
    apiRequest("/auth/otp/verify", Session, {
      method: "POST",
      body: { requestId, code, app: area },
      credentials: "include",
    }),
  login: (area: AppArea, email: string, password: string) =>
    apiRequest("/auth/login", Session, {
      method: "POST",
      body: { email, password, app: area },
      credentials: "include",
    }),
  refresh: async (area: AppArea) => {
    const session = await apiRequest("/auth/refresh", Session, {
      method: "POST",
      body: { app: area },
      credentials: "include",
    });
    tokenStore.set(area, session.token, session.expiresInSeconds);
    return session;
  },
  logout: (area: AppArea) =>
    apiRequest("/auth/logout", z.null(), {
      method: "POST",
      body: { app: area },
      credentials: "include",
    }),
  me: (area: AppArea) => apiRequest("/auth/me", Session.shape.user, { area }),
  requestEmailVerification: (area: AppArea, email: string) =>
    apiRequest("/auth/email/request", OtpRequested, { method: "POST", body: { email }, area }),
  verifyEmail: (area: AppArea, requestId: string, code: string) =>
    apiRequest("/auth/email/verify", Session.shape.user, {
      method: "POST",
      body: { requestId, code },
      area,
    }),
};

// ---------- Locations ----------
export const locationsQuery = (q: string) =>
  queryOptions({
    queryKey: ["locations", q],
    queryFn: () => apiRequest("/locations/search", z.array(Location), { query: { q } }),
    enabled: q.trim().length >= 2,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

export const cargoPointsQuery = () =>
  queryOptions({
    queryKey: ["cargo-points"],
    queryFn: () => apiRequest("/cargo-points", z.array(CargoPoint)),
    staleTime: 60_000,
  });

// ---------- Cargo vision ----------
export const visionApi = {
  analyze: (images: Blob[], referenceObject?: string) => {
    const fd = new FormData();
    images.forEach((b, i) => fd.append("images", b, `cargo-${i}.jpg`));
    if (referenceObject) fd.append("referenceObject", referenceObject);
    return apiRequest("/cargo-vision/analyze", CargoAnalysis, {
      method: "POST",
      formData: fd,
      area: "client",
    });
  },
};

// ---------- Quotes & shipments ----------
export type QuoteRequest = {
  originId: string;
  destinationId: string;
  analysisId?: string;
  manual?: {
    category: string;
    weightKg?: number | undefined;
    sizeClass?: string | undefined;
    fragile?: boolean;
    description?: string | undefined;
  };
};
export const quotesApi = {
  create: (body: QuoteRequest) =>
    apiRequest("/quotes", Quote, { method: "POST", body, area: "client" }),
};

export type CreateShipmentBody = {
  quoteId: string;
  optionId: string;
  recipient: { name: string; phone: string; notes?: string | undefined };
  sender?: { name?: string; phone?: string };
  packageCount: number;
  dimensionsCm: { length: number; width: number; height: number };
  senderFulfillment: "station_dropoff" | "home_pickup";
  receiverFulfillment: "station_collection" | "address_delivery";
  originCargoPointId?: string;
  destinationCargoPointId?: string;
};
export const shipmentsApi = {
  create: (body: CreateShipmentBody, idempotencyKey: string) =>
    apiRequest("/shipments", Shipment, {
      method: "POST",
      body,
      area: "client",
      headers: { "Idempotency-Key": idempotencyKey },
    }),
};
export const myShipmentsQuery = () =>
  queryOptions({
    queryKey: ["shipments", "mine"],
    queryFn: () => apiRequest("/shipments", Paginated(Shipment), { area: "client" }),
  });
export const trackingQuery = (code: string) =>
  queryOptions({
    queryKey: ["tracking", code],
    queryFn: () => apiRequest(`/tracking/${encodeURIComponent(code)}`, PublicTracking),
    refetchInterval: 30_000,
    retry: (n, e) => n < 2 && (e as { kind?: string }).kind !== "not_found",
  });

// ---------- Driver ----------
export const driverJobsQuery = () =>
  queryOptions({
    queryKey: ["driver", "jobs"],
    queryFn: () => apiRequest("/driver/jobs", z.array(DriverJob), { area: "driver" }),
    refetchInterval: 60_000,
  });
export const driverJobQuery = (id: string) =>
  queryOptions({
    queryKey: ["driver", "jobs", id],
    queryFn: () => apiRequest(`/driver/jobs/${id}`, DriverJob, { area: "driver" }),
  });
export const driverApi = {
  scanTag: (
    jobId: string,
    trackingCode: string,
    deliveryCode?: string,
    idempotencyKey = crypto.randomUUID(),
  ) =>
    apiRequest(`/driver/jobs/${jobId}/tag-scan`, Ok, {
      method: "POST",
      body: { trackingCode, deliveryCode },
      headers: { "Idempotency-Key": idempotencyKey },
      area: "driver",
    }),
  sendLocation: (lat: number, lng: number, accuracy?: number) =>
    apiRequest("/driver/location", Ok, {
      method: "POST",
      body: { lat, lng, accuracy, at: new Date().toISOString() },
      area: "driver",
    }),
};

export const dispatchApi = {
  queue: () =>
    apiRequest("/admin/dispatch/shipments", z.array(DispatchShipment), { area: "admin" }),
  drivers: () => apiRequest("/admin/dispatch/drivers", z.array(DispatchDriver), { area: "admin" }),
  assign: (
    body: {
      shipmentId: string;
      driverId: string;
      cargoPointId?: string;
      type: "pickup" | "handoff" | "delivery";
    },
    idempotencyKey = crypto.randomUUID(),
  ) =>
    apiRequest("/admin/dispatch/jobs", DriverJob, {
      method: "POST",
      body,
      headers: { "Idempotency-Key": idempotencyKey },
      area: "admin",
    }),
  scanAtStation: (
    body: { trackingCode: string; action: "receive" | "release"; deliveryCode?: string },
    idempotencyKey = crypto.randomUUID(),
  ) =>
    apiRequest("/cargo-point-operator/scans", Ok, {
      method: "POST",
      body,
      headers: { "Idempotency-Key": idempotencyKey },
      area: "cargo_point_operator",
    }),
};

// ---------- Admin ----------
export const adminDashboardQuery = () =>
  queryOptions({
    queryKey: ["admin", "dashboard"],
    queryFn: () => apiRequest("/admin/dashboard", AdminDashboard, { area: "admin" }),
    refetchInterval: 60_000,
  });
export const adminShipmentsQuery = (f: { q?: string; status?: string; page?: number }) =>
  queryOptions({
    queryKey: ["admin", "shipments", f],
    queryFn: () => apiRequest("/admin/shipments", Paginated(Shipment), { area: "admin", query: f }),
  });
export const adminPricingQuery = () =>
  queryOptions({
    queryKey: ["admin", "pricing", "tariffs"],
    queryFn: () => apiRequest("/admin/pricing/tariffs", z.array(TariffVersion), { area: "admin" }),
  });
export const adminPricingAuditQuery = (page = 1) =>
  queryOptions({
    queryKey: ["admin", "pricing", "audit", page],
    queryFn: () =>
      apiRequest("/admin/pricing/audit", Paginated(PricingAuditEvent), {
        area: "admin",
        query: { page },
      }),
  });
export const adminExceptionsQuery = (status: "open" | "resolved" = "open", page = 1) =>
  queryOptions({
    queryKey: ["admin", "operations", "exceptions", status, page],
    queryFn: () =>
      apiRequest("/admin/operations/exceptions", Paginated(OperationsException), {
        area: "admin",
        query: { status, page },
      }),
  });
export const adminFailedNotificationsQuery = (page = 1) =>
  queryOptions({
    queryKey: ["admin", "notifications", "failed", page],
    queryFn: () =>
      apiRequest("/admin/notifications/failed", Paginated(FailedNotification), {
        area: "admin",
        query: { page },
      }),
  });
export const notificationPreferencesQuery = (area: AppArea) =>
  queryOptions({
    queryKey: ["notifications", "preferences", area],
    queryFn: () => apiRequest("/notifications/preferences", NotificationPreference, { area }),
  });
export const notificationsApi = {
  setPreferences: (area: AppArea, enabled: boolean) =>
    apiRequest("/notifications/preferences", NotificationPreference, {
      method: "PUT",
      body: { smsStatusUpdatesEnabled: enabled },
      area,
    }),
};
export const adminCargoPointsQuery = () =>
  queryOptions({
    queryKey: ["admin", "cargo-points"],
    queryFn: () => apiRequest("/admin/cargo-points", z.array(CargoPoint), { area: "admin" }),
  });
export const adminApi = {
  openException: (body: { shipmentId: string; category: string; description: string }) =>
    apiRequest("/admin/operations/exceptions", OperationsException, {
      method: "POST",
      body,
      area: "admin",
    }),
  correctShipment: (
    id: string,
    body: { status: string; reason: string; currentCargoPointId?: string },
  ) =>
    apiRequest(`/admin/operations/exceptions/${encodeURIComponent(id)}/correct`, Ok, {
      method: "POST",
      body,
      area: "admin",
    }),
  resolveException: (id: string, resolution: string) =>
    apiRequest(`/admin/operations/exceptions/${encodeURIComponent(id)}/resolve`, Ok, {
      method: "POST",
      body: { resolution },
      area: "admin",
    }),
  createTariff: (body: {
    name: string;
    baseFeeRwf: number;
    perKgRwf: number;
    perKmRwf: number;
    sizeRatesRwf: Record<string, number>;
    fragileSurchargeRwf: number;
  }) =>
    apiRequest("/admin/pricing/tariffs", TariffVersion, {
      method: "POST",
      body,
      area: "admin",
    }),
  activateTariff: (id: string) =>
    apiRequest(`/admin/pricing/tariffs/${encodeURIComponent(id)}/activate`, TariffVersion, {
      method: "POST",
      body: {},
      area: "admin",
    }),
  createCargoPoint: (body: {
    code: string;
    name: string;
    address: string;
    district: string;
    province: string;
    contactName?: string;
    contactPhone?: string;
    capacity: { maxItems: number; maxWeightKg: number; maxVolumeM3: number };
    isActive: boolean;
  }) =>
    apiRequest("/admin/cargo-points", CargoPoint, {
      method: "POST",
      body,
      area: "admin",
    }),
  updateCargoPoint: (
    id: string,
    body: {
      name?: string;
      address?: string;
      district?: string;
      province?: string;
      contactName?: string;
      contactPhone?: string;
      capacity?: { maxItems: number; maxWeightKg: number; maxVolumeM3: number };
      isActive?: boolean;
    },
  ) =>
    apiRequest(`/admin/cargo-points/${encodeURIComponent(id)}`, CargoPoint, {
      method: "PATCH",
      body,
      area: "admin",
    }),
  provisionCargoPointOperator: (id: string, phone: string) =>
    apiRequest(`/admin/cargo-points/${encodeURIComponent(id)}/operators`, Session.shape.user, {
      method: "POST",
      body: { phone },
      area: "admin",
    }),
};
