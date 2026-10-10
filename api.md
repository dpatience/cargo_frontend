# Tembera Cargo — Required API

## Base URL and conventions

Set `VITE_API_BASE_URL` to the versioned base URL, including `/v1` (for
example, `https://api.cargo.tembera.rw/v1`). Endpoint paths below do not
repeat `/v1`; do not set the base URL to `/v1` and also prefix each path.
JSON is used unless noted. Schemas live in `src/packages/types/index.ts` and
are validated at runtime.

Authenticated requests send the access token as a bearer authorization
credential. Error responses use `{ "message": string }` and the
operation-appropriate status from 400/401/403/404/422/5xx. Money is
`{ amount: number, currency: "RWF" }`. Access tokens expire after 15 minutes.
Refresh sessions rotate, are revocable, and last 30 days; the refresh
credential is sent only as a Secure, HttpOnly cookie. Refresh/logout requests
must include credentials. Cookie, CORS, and CSRF policy requires
backend/security approval before implementation.

These endpoints and rules are the Phase 0 contract baseline for backend and
frontend owner review. Unapproved assumptions and open decisions are tracked
in [the Phase 0 discovery record](../backend/docs/phase-0-discovery.md).

## Service metadata

| Method | Path | Body | Response |
|---|---|---|---|
| GET | /meta | — | `{ service: "tembera-cargo", apiVersion: "v1", countryCode: "RW", currency: "RWF", timeZone: "Africa/Kigali" }` |

This is a versioned foundation/diagnostic endpoint, not an indication that a
service area, route, cargo category, or delivery schedule is active.

## Auth

`Session` is `{ token, expiresInSeconds, user }`. Successful sign-in and
refresh return `expiresInSeconds: 900`; the refresh credential is not returned
in JSON. `/auth/me` returns the user object directly:
`{ id, name?, phone?, email?, roles[] }`.

| Method | Path | Body | Response |
|---|---|---|---|
| POST | /auth/otp/request | `{ phone, app: "client"\|"driver" }` | `{ requestId, expiresInSeconds }` |
| POST | /auth/otp/verify | `{ requestId, code, app }` | `Session` + refresh cookie |
| POST | /auth/login | `{ email, password, app: "admin" }` | `Session` + refresh cookie |
| POST | /auth/refresh | — (refresh cookie) | `Session` + rotated refresh cookie |
| POST | /auth/logout | — (refresh cookie) | `204`; revoke refresh session and clear cookie |
| GET | /auth/me | — | `user { id, name?, phone?, email?, roles[] }` |

OTP validity, rate limits, role names, administrator provisioning/recovery,
and cookie/CORS/CSRF details require owner approval.

## Locations

| Method | Path | Body | Response |
|---|---|---|---|
| GET | /locations/search?q= | — | `Location[] { id, name, district?, province?, lat?, lng?, type? }` |

The source is a Cargo-managed approved directory. Results must be limited to
activated service coverage; directory ownership and update cadence remain to
be approved.

## Cargo vision

| Method | Path | Body | Response |
|---|---|---|---|
| POST | /cargo-vision/analyze | multipart: `images[]` (JPEG, longest edge ≤1280px), `referenceObject?` | `CargoAnalysis { analysisId, category, description?, estimatedWeightKg?, dimensionsCm?, sizeClass?, fragile?, confidence: 0..1, needsReview, warnings[] }` |

Manual cargo entry remains available if analysis is unavailable or needs
review. Maximum image count/bytes, consent, retention, provider, and review
ownership are not yet approved.

## Quotes and shipments

| Method | Path | Body | Response |
|---|---|---|---|
| POST | /quotes | `{ originId, destinationId, analysisId?, manual?: { category, weightKg?, sizeClass?, fragile?, description? } }` | `Quote { quoteId, expiresAt, options[]: { id, label, speed?, estimatedDelivery?, price, breakdown[{label,amount}], explanation?, route[{label,mode?}], recommended? } }` |
| POST | /shipments | `Idempotency-Key` header; `{ quoteId, optionId, recipient: { name, phone, notes? }, sender?: { name?, phone? } }` | `Shipment { id, trackingCode, status, statusLabel?, origin, destination, recipientName?, recipientPhone?, price?, createdAt, eta?, events[], paymentUrl? }` (payment URL is not evidence of payment) |
| GET | /shipments | `page?`, `pageSize?` | `{ items: Shipment[], total, page, pageSize }` |
| GET | /tracking/:code | public, no auth | `PublicTracking { id, trackingCode, status, statusLabel?, origin, destination, eta?, price?, createdAt, events[{at,status,label,location?}] }` |

Quote expiry is a required timezone-aware ISO-8601 timestamp. Quotes must be
valid and unexpired at shipment creation. Public tracking must not return
recipient/sender details, payment URLs, or internal evidence. Quote lifetime,
price provenance/rounding, idempotency retention, and exact shipment snapshot
fields require backend, finance, and product approval.

## Driver

| Method | Path | Body | Response |
|---|---|---|---|
| GET | /driver/jobs | — | `DriverJob[] { id, shipmentId, trackingCode, type: pickup\|handoff\|delivery, status, address, contactName?, contactPhone?, cargoSummary?, scheduledFor? }` |
| GET | /driver/jobs/:id | — | `DriverJob` |
| POST | /driver/jobs/:id/handoff | `{ code }` | `{ ok }` |
| POST | /driver/jobs/:id/proof-of-delivery | multipart: `photo?`, `recipientCode`, `recipientName` | `{ ok }` |
| POST | /driver/location | `{ lat, lng, accuracy?, at }` (client throttles to ≤1 request/20s) | `{ ok }` |

Driver job pagination, location retention/rate enforcement, and evidence
constraints require approval; server-side authorization and limits are
mandatory regardless of client throttling.

## Admin

| Method | Path | Body | Response |
|---|---|---|---|
| GET | /admin/dashboard | — | `{ metrics[{key,label,value,unit?,trend?}], alerts[{id,severity,message}] }` |
| GET | /admin/shipments?q=&status=&page=&pageSize= | — | `{ items: Shipment[], total, page, pageSize }` |
| GET | /admin/pricing/rules | — | `PricingRule[] { id, name, description?, value, unit, active, updatedAt? }` |
| PATCH | /admin/pricing/rules/:id | `{ value?, active? }` | `PricingRule` (server must audit-log) |
| GET | /admin/cargo-vision/reviews | — | `VisionReview[] { id, shipmentId?, imageUrls[], analysis, createdAt }` |
| POST | /admin/cargo-vision/reviews/:id | `{ decision: approve\|correct, corrections? }` | `{ ok }` |

## Planned (not launch commitments)

Payments callbacks, notifications, cargo points, businesses, admin
drivers/partners, incidents, reports, realtime events
(`shipment.updated`, `driver.location`, `job.assigned`).
