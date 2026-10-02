# Tembera Cargo — Build Plan

## Platform constraints (how the brief is adapted)
- This project runs on one TanStack Start app (TanStack Router, not React Router). Three truly separate Vite apps on ports 3000/3001/3002 are not possible here.
- Instead: three fully isolated app areas with their own layouts, nav, auth guards and entry routes — `/` (Client), `/driver/*`, `/admin/*`. They share nothing except `src/packages/{ui,api,types,config,i18n}`. No role-switching dashboard. Each area can later be split into its own deployment (documented in README).
- No mock data anywhere. All dynamic values go through a typed API layer (`VITE_API_BASE_URL`); when the backend is not connected, screens show "service unavailable" / empty / error states.

## Phase 1 (this turn) — Foundation + Client core
1. Design system in `src/styles.css`: deep navy base, blue→violet gradient used only on non-text surfaces, cyan highlights, green success, selective glass cards, large touch targets, high-contrast outdoor-readable text. Fonts: Sora (headings) + Manrope (body).
2. Shared layers:
   - `api/`: fetch client (base URL, auth token, timeouts, retry, typed `ApiError`), Zod-validated services per domain (auth, locations, cargo vision, quotes, shipments, tracking, drivers, handoffs, POD, notifications, admin).
   - `types/`: Zod schemas + TS types.
   - `i18n/`: key-based translations, English + Kinyarwanda, French-ready; RWF formatter.
   - `ui/`: Button variants, Card, StateViews (Loading skeleton, Empty, Unavailable, Error with retry), OfflineBanner, LanguageSwitcher.
3. Client app:
   - Home: "Send anything across Rwanda" hero, dominant Send Cargo CTA, Track / Receive / My Shipments.
   - Send flow: pickup + destination (locations API), cargo via camera capture (getUserMedia + multi-angle, upload to vision API) or manual fallback, quote options + price explanation, recipient, confirmation, payment hand-off.
   - Public tracking `/track/$code` (no install needed), My Shipments, Account, auth (phone + OTP via API).
   - Low-bandwidth mode toggle and offline banner.
4. Driver app shell: login, home (assigned jobs), job detail, handoff scan/confirm, proof of delivery (photo + signature + code), location sharing.
5. Admin app shell: login, dashboard (API metrics only), shipments table with filters, pricing rules editor, cargo-vision review queue, network view placeholder fed by API.
6. Docs: `README.md`, `api.md` (every endpoint the frontend calls, with request/response shapes), `.env.example`.

## Phase 2 (follow-up turns)
- Offline draft queue in IndexedDB + installable/offline PWA (published app only).
- Real-time updates (WebSocket/SSE adapter), maps integration, business client mode, notifications center, admin permissions + audit log views, reports.

## Technical details
- Routes: `src/routes/index.tsx`, `send.*`, `track.*`, `shipments.*`, `account.tsx`, `driver.tsx` (layout) + `driver.*`, `admin.tsx` (layout) + `admin.*`.
- Server state via TanStack Query (`queryOptions` per service); auth token in memory + storage per app area, separate keys for client/driver/admin.
- No backend is built here; the frontend targets your external API. If you'd rather I also build the backend on Lovable Cloud, say so.
