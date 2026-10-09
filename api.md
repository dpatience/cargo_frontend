# Tembera Cargo — Required API

Base: `VITE_API_BASE_URL`. JSON unless noted. Auth: `Authorization: Bearer <token>`. Errors: `{ "message": string }` with 400/401/403/404/422/5xx. Money is `{ amount: number, currency: "RWF" }`. Schemas live in `src/packages/types/index.ts` (Zod, validated at runtime).

## Auth
| Method | Path | Body | Response |
|---|---|---|---|
| POST | /auth/otp/request | `{ phone, app: "client"\|"driver" }` | `{ requestId, expiresInSeconds? }` |
| POST | /auth/otp/verify | `{ requestId, code, app }` | `Session { token, user }` |
| POST | /auth/login | `{ email, password, app: "admin" }` | `Session` |
| GET | /auth/me | — | `user { id, name?, phone?, email?, roles[] }` |

## Locations
| GET | /locations/search?q= | — | `Location[] { id, name, district?, province?, lat?, lng?, type? }` |

## Cargo vision
| POST | /cargo-vision/analyze | multipart: `images[]` (JPEG ≤1280px), `referenceObject?` | `CargoAnalysis { analysisId, category, estimatedWeightKg?, dimensionsCm?, sizeClass?, fragile?, confidence 0-1, needsReview, warnings[] }` |

## Quotes & shipments
| POST | /quotes | `{ originId, destinationId, analysisId? , manual?: { category, weightKg?, sizeClass?, fragile?, description? } }` | `Quote { quoteId, expiresAt?, options[]: { id, label, speed?, estimatedDelivery?, price, breakdown[{label,amount}], explanation?, route[{label,mode?}], recommended? } }` |
| POST | /shipments | `{ quoteId, optionId, recipient: { name, phone, notes? } }` | `Shipment` (incl. `paymentUrl?`) |
| GET | /shipments | — | `{ items: Shipment[], total, page, pageSize }` |
| GET | /tracking/:code | public, no auth | `Shipment { id, trackingCode, status, statusLabel?, origin, destination, eta?, price?, events[{at,status,label,location?}] }` |

## Driver
| GET | /driver/jobs | — | `DriverJob[] { id, shipmentId, trackingCode, type: pickup\|handoff\|delivery, status, address, contactName?, contactPhone?, cargoSummary?, scheduledFor? }` |
| GET | /driver/jobs/:id | — | `DriverJob` |
| POST | /driver/jobs/:id/handoff | `{ code }` | `{ ok }` |
| POST | /driver/jobs/:id/proof-of-delivery | multipart: `photo?`, `recipientCode`, `recipientName` | `{ ok }` |
| POST | /driver/location | `{ lat, lng, accuracy?, at }` (≤ every 20s) | `{ ok }` |

## Admin
| GET | /admin/dashboard | — | `{ metrics[{key,label,value,unit?,trend?}], alerts[{id,severity,message}] }` |
| GET | /admin/shipments?q=&status=&page= | — | paginated `Shipment` |
| GET | /admin/pricing/rules | — | `PricingRule[] { id, name, description?, value, unit, active, updatedAt? }` |
| PATCH | /admin/pricing/rules/:id | `{ value?, active? }` | `PricingRule` (server must audit-log) |
| GET | /admin/cargo-vision/reviews | — | `VisionReview[] { id, shipmentId?, imageUrls[], analysis, createdAt }` |
| POST | /admin/cargo-vision/reviews/:id | `{ decision: approve\|correct, corrections? }` | `{ ok }` |

## Planned (phase 2)
Payments callbacks, notifications, cargo points, businesses, admin drivers/partners, incidents, reports, realtime events (`shipment.updated`, `driver.location`, `job.assigned`).
