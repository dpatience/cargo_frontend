# Plan: Simpler Send Cargo for Rwanda, ready for AI assistants

No backend endpoints change. Everything below uses the APIs that already exist.

## 1. Rwanda-first flow (fewer, clearer steps)
Today there are 5 steps, a lot of typing, and the place search expects formal addresses. New flow, with one question per screen:

```text
1. Where?   Pickup: [Use my location] [Search] [Pin on map] [Cargo point]
            Deliver: [Recipient shares location by SMS link] [Search] [Pin on map] [Cargo point]
2. What?    Big category tiles (Food/produce, Electronics, Furniture, Documents, Motorcycle parts, Other)
            + size by picture (fits on a moto / in a car / needs a truck) + optional photo
3. Who?     Recipient name + phone (+250, MTN/Airtel check), "I am the recipient" shortcut
4. Price    Options in RWF, recommended first, clear "why this price"
5. Confirm  One summary card, sign in with phone code, pay with MoMo/Airtel Money link
```

Rwanda-specific details:
- Describe places by landmark ("near Kimironko market, blue gate") with an optional directions field, not a street address.
- Recipient location by sending them a link (uses the existing confirm-location page), since many people don't know their address.
- Phone numbers checked for Rwanda format (07X..., +250), with large number keys.
- Size picked by vehicle picture (moto / car / pickup / truck) instead of centimetres.
- Kinyarwanda first-class: every new label translated, with English fallback.
- Works on slow networks and low-end phones: light screens, the draft is kept if the connection drops, and you can retry without retyping.

## 2. Easier to use (using the shared design skills)
- better-interface / better-layout: one main button per screen, at the bottom where the thumb reaches, large tap targets.
- better-writing: short, friendly wording; error messages say what to do next.
- better-accessibility: labels, focus order, contrast, screen-reader progress ("Step 2 of 5").
- state-machine: the flow becomes a clear step machine (allowed moves, back, resume), so it doesn't break on refresh.
- interface-review / teardown: a review pass on mobile at 360px before finishing.

## 3. AI assistants can send cargo
- Pre-filled links: an assistant can open `/send?from=...&to=...&category=...&recipientPhone=...`, and the page fills in and jumps to the first missing step. A person always confirms and pays.
- In-browser assistant tools (WebMCP) on the Send page: "set pickup", "set destination", "describe cargo", "get prices", "choose option", "set recipient". Nothing pays or confirms by itself; the final confirm stays a human tap.
- Clear, stable labels on every field and button so browser-driving assistants can find them reliably.

## 4. Well presented to AIs
- Update `llms.txt` / `llms-full.txt`: how sending works, the pre-filled link format, what an assistant may and may not do (no invented prices; quotes only from the app).
- Structured data on the home and Send pages (Organization, Service, FAQ in EN/RW).
- Unique titles and descriptions for every page, sitemap kept up to date, robots allow AI crawlers on public pages only.

## Technical details
- Refactor `src/routes/send.tsx` (about 1,200 lines) into step components under `src/apps/client/send/` with a reducer-based state machine; draft saved to sessionStorage.
- Route search params validated with Zod for prefill; no new API calls, only the existing `locations`, `cargo-vision`, `quotes`, `shipments` and location-confirmation services.
- WebMCP tools registered with `use-webmcp-tool` inside the step components, cleaned up on unmount; no server MCP (that would need backend changes).
- i18n keys added to `en.ts` and `rw.ts`.
- Tests: prefill parsing, Rwanda phone validation, step transitions.

## Open questions
- Which mobile money provider handles payment links (MTN MoMo, Airtel, both)?
- Should "send to a cargo point for pickup" be offered as the default for upcountry deliveries?
