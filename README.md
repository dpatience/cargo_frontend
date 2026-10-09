# Tembera Cargo — Frontend

Three separate apps sharing one design system and API layer:

| App | Path (this repo) | Target domain | Sign-in |
|---|---|---|---|
| Client | `/`, `/send`, `/track/:code`, `/receive`, `/shipments`, `/account` | cargo.tembera.rw | Phone + OTP |
| Driver | `/driver/*` | driver.cargo.tembera.rw | Phone + OTP |
| Admin | `/admin/*` | admin.cargo.tembera.rw | Email + password |

Each app has its own layout, navigation, auth gate and token storage (`tembera-cargo:<app>:token`). No role-based switching.

## Structure
```
src/packages/config   env config
src/packages/api      fetch client (timeouts, typed ApiError, Zod validation) + services/queries
src/packages/types    Zod schemas
src/packages/i18n     EN + Kinyarwanda keys, RWF formatting (French-ready)
src/packages/ui       buttons, cards, loading/empty/error/offline states, auth
src/apps/client       client-only components (camera, location picker, timeline)
src/routes            route entry points per app
```

## Setup
Copy `.env.example` → `.env` and set `VITE_API_BASE_URL`. Without it every screen shows "Service not connected" — no mock data is ever shown. Endpoints: see `api.md`.

## Independent deployment
Deploy the same build to three domains and route each domain's root to its app area (e.g. edge redirect `driver.cargo.tembera.rw/` → `/driver`), or split `src/routes/driver*` / `admin*` into separate projects that import `src/packages`.
