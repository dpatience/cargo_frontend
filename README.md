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

## Running each app on its own port
```
bun run dev:client   # http://localhost:3000
bun run dev:driver   # http://localhost:3001  (opens /driver)
bun run dev:admin    # http://localhost:3002  (opens /admin)
```
`VITE_APP` pins a server to one app; any path from another app redirects to that app's home.

## Independent deployment (one project, three domains)
Connect `cargo.tembera.rw`, `driver.cargo.tembera.rw` and `admin.cargo.tembera.rw` to the project and do NOT set a primary domain (so none redirect to another). The hostname picks the app: `driver.*` → Driver, `admin.*` → Admin, `VITE_CLIENT_HOST` → Client. Opening the driver domain lands on `/driver`; client or admin pages there redirect back. Preview and other hosts show all apps for testing.
