import { z } from "zod";
import { queryOptions } from "@tanstack/react-query";
import { apiRequest } from "./client";
import type { AppArea } from "../config/env";
import {
  AdminDashboard, CargoAnalysis, DriverJob, Location, Ok, OtpRequested, Paginated,
  PricingRule, Quote, Session, Shipment, VisionReview,
} from "../types";

// ---------- Auth ----------
export const authApi = {
  requestOtp: (area: AppArea, phone: string) => apiRequest("/auth/otp/request", OtpRequested, { method: "POST", body: { phone, app: area } }),
  verifyOtp: (area: AppArea, requestId: string, code: string) => apiRequest("/auth/otp/verify", Session, { method: "POST", body: { requestId, code, app: area } }),
  login: (area: AppArea, email: string, password: string) => apiRequest("/auth/login", Session, { method: "POST", body: { email, password, app: area } }),
  me: (area: AppArea) => apiRequest("/auth/me", Session.shape.user, { area }),
};

// ---------- Locations ----------
export const locationsQuery = (q: string) => queryOptions({
  queryKey: ["locations", q],
  queryFn: () => apiRequest("/locations/search", z.array(Location), { query: { q } }),
  enabled: q.trim().length >= 2,
  staleTime: 5 * 60_000,
});

// ---------- Cargo vision ----------
export const visionApi = {
  analyze: (images: Blob[], referenceObject?: string) => {
    const fd = new FormData();
    images.forEach((b, i) => fd.append("images", b, `cargo-${i}.jpg`));
    if (referenceObject) fd.append("referenceObject", referenceObject);
    return apiRequest("/cargo-vision/analyze", CargoAnalysis, { method: "POST", formData: fd, area: "client" });
  },
};

// ---------- Quotes & shipments ----------
export type QuoteRequest = {
  originId: string; destinationId: string;
  analysisId?: string;
  manual?: { category: string; weightKg?: number | undefined; sizeClass?: string | undefined; fragile?: boolean; description?: string | undefined };
};
export const quotesApi = { create: (body: QuoteRequest) => apiRequest("/quotes", Quote, { method: "POST", body, area: "client" }) };

export type CreateShipmentBody = { quoteId: string; optionId: string; recipient: { name: string; phone: string; notes?: string }; sender?: { name?: string; phone?: string } };
export const shipmentsApi = {
  create: (body: CreateShipmentBody) => apiRequest("/shipments", Shipment, { method: "POST", body, area: "client" }),
};
export const myShipmentsQuery = () => queryOptions({
  queryKey: ["shipments", "mine"],
  queryFn: () => apiRequest("/shipments", Paginated(Shipment), { area: "client" }),
});
export const trackingQuery = (code: string) => queryOptions({
  queryKey: ["tracking", code],
  queryFn: () => apiRequest(`/tracking/${encodeURIComponent(code)}`, Shipment),
  refetchInterval: 30_000,
  retry: (n, e) => n < 2 && (e as { kind?: string }).kind !== "not_found",
});

// ---------- Driver ----------
export const driverJobsQuery = () => queryOptions({
  queryKey: ["driver", "jobs"],
  queryFn: () => apiRequest("/driver/jobs", z.array(DriverJob), { area: "driver" }),
  refetchInterval: 60_000,
});
export const driverJobQuery = (id: string) => queryOptions({
  queryKey: ["driver", "jobs", id],
  queryFn: () => apiRequest(`/driver/jobs/${id}`, DriverJob, { area: "driver" }),
});
export const driverApi = {
  confirmHandoff: (jobId: string, code: string) => apiRequest(`/driver/jobs/${jobId}/handoff`, Ok, { method: "POST", body: { code }, area: "driver" }),
  submitProof: (jobId: string, data: { photo?: Blob; recipientCode: string; recipientName: string }) => {
    const fd = new FormData();
    if (data.photo) fd.append("photo", data.photo, "pod.jpg");
    fd.append("recipientCode", data.recipientCode);
    fd.append("recipientName", data.recipientName);
    return apiRequest(`/driver/jobs/${jobId}/proof-of-delivery`, Ok, { method: "POST", formData: fd, area: "driver" });
  },
  sendLocation: (lat: number, lng: number, accuracy?: number) => apiRequest("/driver/location", Ok, { method: "POST", body: { lat, lng, accuracy, at: new Date().toISOString() }, area: "driver" }),
};

// ---------- Admin ----------
export const adminDashboardQuery = () => queryOptions({ queryKey: ["admin", "dashboard"], queryFn: () => apiRequest("/admin/dashboard", AdminDashboard, { area: "admin" }), refetchInterval: 60_000 });
export const adminShipmentsQuery = (f: { q?: string; status?: string; page?: number }) => queryOptions({
  queryKey: ["admin", "shipments", f],
  queryFn: () => apiRequest("/admin/shipments", Paginated(Shipment), { area: "admin", query: f }),
});
export const adminPricingQuery = () => queryOptions({ queryKey: ["admin", "pricing"], queryFn: () => apiRequest("/admin/pricing/rules", z.array(PricingRule), { area: "admin" }) });
export const adminVisionQuery = () => queryOptions({ queryKey: ["admin", "vision"], queryFn: () => apiRequest("/admin/cargo-vision/reviews", z.array(VisionReview), { area: "admin" }) });
export const adminApi = {
  updatePricingRule: (id: string, patch: { value?: number; active?: boolean }) => apiRequest(`/admin/pricing/rules/${id}`, PricingRule, { method: "PATCH", body: patch, area: "admin" }),
  resolveVision: (id: string, body: { decision: "approve" | "correct"; corrections?: Record<string, unknown> }) => apiRequest(`/admin/cargo-vision/reviews/${id}`, Ok, { method: "POST", body, area: "admin" }),
};
