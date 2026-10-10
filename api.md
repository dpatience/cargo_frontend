# Tembera Cargo — Required API

## Base URL and conventions

Set `VITE_API_BASE_URL` to the versioned base URL, including `/v1` (for
example, `https://api.cargo.tembera.rw/v1`). Endpoint paths below do not
repeat `/v1`; do not set the base URL to `/v1` and also prefix each path.
JSON is used unless noted. Schemas live in `src/packages/types/index.ts` and
are validated at runtime.

Authenticated requests send the access token as a bearer authorization
credential. Error responses use `{ "message": string }` and the
operation-appropriate status from 401/403/404/422/429/5xx. Money is
`{ amount: number, currency: "RWF" }`. Access tokens expire after 15 minutes.
Refresh sessions rotate, are revocable, and last 30 days; the refresh
credential is sent only as a Secure, HttpOnly cookie. Refresh/logout requests
must include credentials and the applicable `app` (`client`, `driver`, or
`admin`). The cookie is host-only, HttpOnly, SameSite=Lax, scoped to
`/v1/auth`, and Secure in production. Refresh/logout require an allowlisted
Origin. The client refreshes shortly before expiry and retries an unauthorized
request at most once after rotating the refresh session.

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
| POST | /auth/refresh | `{ app }` + refresh cookie | `Session` + rotated refresh cookie |
| POST | /auth/logout | `{ app }` + refresh cookie | `204`; revoke refresh session and clear cookie |
| GET | /auth/me | — | `user { id, name?, phone?, email?, roles[] }` |
| POST | /auth/email/request | `{ email }` + bearer access token | `{ requestId, expiresInSeconds }` |
| POST | /auth/email/verify | `{ requestId, code }` + bearer access token | updated `user` |

Client accounts are created only after a verified phone OTP. Driver accounts
and administrator credentials are provisioned by Cargo; OTP is not a
self-enrollment path for drivers. OTPs are six digits, expire after five
minutes, allow five attempts, and have a 60-second resend cooldown. Sends are
limited to three per phone per 15 minutes and 20 per IP per hour. Administrator
login attempts are limited to five per email per 15 minutes and 20 per IP per
hour, without account lockout. Africa's Talking delivers SMS OTP. Gmail SMTP
verifies email as a contact method only; email is not a sign-in credential.
Email verification uses the same six-digit, five-minute challenge limits.
Guest shipment OTP is a separate planned workflow and is not implemented by
the account sign-in endpoints.

OTP/login rate-limit errors return 429 with `Retry-After`; invalid input uses
422, invalid credentials/challenges use 401, rejected origins use 403, and
provider unavailability uses 503. Authentication errors use the
`{ "message": string }` envelope. Client location search uses live Google
Places API (New) Text Search. The server-side key is never returned to the
frontend; results are filtered to Rwanda; and the frontend shows Google
Maps attribution. Results are transient and the endpoint responds with
`Cache-Control: no-store`. Cargo must not import or persist Google content;
Place IDs may be retained as permitted by Google's current terms. Provider or
configuration failures return 503 with the standard error envelope.

## Locations

| Method | Path | Body | Response |
|---|---|---|---|
| GET | /locations/search?q= | — | `Location[] { id, name, address?, lat?, lng?, source: "google" }` |

`id` is the Google Place ID. The source is Google Places API (New) Text
Search, filtered to Rwanda and limited to ten results. Cargo does not
import or persist Google names, addresses, or coordinates. `address` is the
Google formatted address. The picker displays Google Maps attribution.
Production use requires an API key restricted to the Places API and production
server IP, billing/quota controls, and publicly accessible Cargo Terms of Use
and Privacy Policy incorporating Google's terms. Provider search does not
establish Cargo service coverage; Operations must approve coverage criteria.
Later quote/shipment flows must use Place IDs and obtain current Google data
instead of storing API content. Quote, history, and public tracking responses
mark live Google-derived location names with source `"google"` and do not
persist the returned names or addresses.

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
| POST | /quotes | `{ originId, destinationId, manual: { category, weightKg, sizeClass, fragile? } }` | `Quote { quoteId, expiresAt, options[]: { id, label, price, breakdown[{label,amount}], explanation?, route[{label,source?}], recommended? } }` |
| POST | /shipments | `Idempotency-Key` header; `{ quoteId, optionId, recipient: { name, phone, notes? }, sender?: { name?, phone? } }` | `Shipment { id, trackingCode, status, statusLabel?, origin, destination, recipientName?, recipientPhone?, price?, createdAt, eta?, events[], paymentUrl? }` (payment URL is not evidence of payment) |
| GET | /shipments | `page?`, `pageSize?` | `{ items: Shipment[], total, page, pageSize }` |
| GET | /tracking/:code | public, no auth | `PublicTracking { id, trackingCode, status, statusLabel?, origin, destination, originSource: "google", destinationSource: "google", eta?, price?, createdAt, events[{at,status,label,location?}] }` |

Quotes require manual cargo category, weight, and size class; cargo-vision
estimates are not accepted as booking inputs without the approved policy and
manual review. The only current quote option is `standard`. Quotes expire
after 15 minutes and include price provenance from the active tariff and
Google road distance; the distance itself is not persisted. The total is
rounded to the nearest whole RWF. Shipment creation accepts only the quoted
option and an unexpired, unused quote owned by the authenticated customer.
`Idempotency-Key` is required and same-key retries with the same request return
the original shipment; reusing it with different data returns 409.

Public tracking must not return recipient/sender details, payment URLs, or
internal evidence and responds `Cache-Control: no-store`. Location names are
resolved live from Place IDs and marked with Google Maps attribution. No
delivery time is promised. Quote and shipment endpoints return 503 until both
the legally reviewed cargo acceptance matrix and an approved tariff are
configured; an active tariff alone does not enable booking.

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
| GET | /admin/pricing/tariffs | — | `TariffVersion[]` |
| POST | /admin/pricing/tariffs | `{ name, baseFeeRwf, perKgRwf, perKmRwf, sizeRatesRwf, fragileSurchargeRwf }` | New draft `TariffVersion` |
| POST | /admin/pricing/tariffs/:id/activate | `{}` | Activated `TariffVersion`; prior active version is retired |
| GET | /admin/cargo-vision/reviews | — | `VisionReview[] { id, shipmentId?, imageUrls[], analysis, createdAt }` |
| POST | /admin/cargo-vision/reviews/:id | `{ decision: approve\|correct, corrections? }` | `{ ok }` |

Tariff versions are immutable once created except for the controlled
draft→active→retired status changes. Creation and activation are audited.
Tariff rates are not seeded; Finance and Operations must approve actual
values and effective dates before the active tariff is used for quotes.

## Planned (not launch commitments)

Payments callbacks, notifications, cargo points, businesses, admin
drivers/partners, incidents, reports, realtime events
(`shipment.updated`, `driver.location`, `job.assigned`).
