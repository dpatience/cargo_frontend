# Tembera Cargo — Frontend

Three separate apps sharing one design system and API layer:

| App | Path (this repo) | Target domain | Sign-in |
|---|---|---|---|
| Client | `/en`, `/rw`, `/app`, `/send`, `/track/:code`, `/receive`, `/shipments`, `/account` | cargo.tembera.nyxarith.com | Phone + OTP |
| Driver | `/driver/*` | Private app host configured per deployment | Phone + OTP |
| Admin | `/admin/*` | Private app host configured per deployment | Email + password |

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

Use Node.js/npm or Bun; Bun is optional. In PowerShell, run the commands from the
`cargo_frontend` directory (the one containing `package.json`):

```powershell
cd "C:\Users\Patience\E-go\Tembera Cargo\cargo_frontend"
npm run dev:client
```

If dependencies have not been installed yet, run `npm install` in that directory
first. The Vite modes used by the per-app scripts select the app without
platform-specific environment-variable syntax.

## Running each app on its own port
```
npm run dev:client   # http://localhost:3000 (or: bun run dev:client)
npm run dev:driver   # http://localhost:3001 (or: bun run dev:driver)
npm run dev:admin    # http://localhost:3002 (or: bun run dev:admin)
```
`VITE_APP` pins a server to one app; any path from another app redirects to that app's home.

## Independent deployment (one project, three domains)
The public client app is served at `cargo.tembera.nyxarith.com`. Configure any private driver or admin host separately; do not change the public client domain as part of SEO work. The hostname picks the app: `driver.*` → Driver, `admin.*` → Admin, `VITE_CLIENT_HOST` → Client. Opening the driver domain lands on `/driver`; client or admin pages there redirect back. Preview and other hosts show all apps for testing.

## Search and AI discovery
The client deployment publishes `robots.txt`, `sitemap.xml`, and `llms.txt` from `public/`. The sitemap contains only the public English and Kinyarwanda landing pages; private and transactional screens are excluded. Submit `https://cargo.tembera.nyxarith.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

Cloudflare Web Analytics is loaded only on the localized, indexable public Cargo pages. Its beacon has SPA tracking disabled; the customer app, shipment tracking, quote, payment and account routes are excluded. No form values or custom events are collected. Disable automatic whole-site Web Analytics injection in Cloudflare for this hostname so it does not bypass the public-page-only integration.

The new Kinyarwanda landing-page copy and FAQs need review by a native speaker before publication.
