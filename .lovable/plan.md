# Simpler, Rwanda-friendly Send flow that AI assistants can also use

## Goals
- Someone with a basic phone and patchy internet can send cargo in under a minute.
- An AI assistant can book the same shipment for someone, step by step, through a clear and safe interface.
- The app explains itself clearly to search engines and AI agents.

## 1. Where: pickup and delivery
- **Pickup:** a big "Use my current location" button at the top. Under it: search a place, pick a recent place, or choose a cargo point (bus park, agent shop).
- **Delivery:** "Use my location", search, "Pick on the map", or "Recipient will share location" (they get an SMS link).
- Places are described the way Rwandans give directions: district/sector/cell plus a landmark ("near Kimironko market, blue gate"). There is a landmark notes field.
- Map: Google Maps with a draggable pin, centered on Rwanda. Every pin becomes a named place through the backend.
- Recent and saved places (Home, Shop) can be picked with one tap.

## 2. What: describing the cargo
- Common items as big picture tiles: Sack of produce, Box, Phone/electronics, Documents, Furniture, Motorbike parts, Other.
- The photo option stays. After the photo, the AI suggestion appears as editable chips.
- Size is shown with everyday objects (fits on a moto / a car boot / needs a pickup truck) instead of S/M/L.

## 3. Price
- Up to 3 clear options (Moto today, Bus next day, Truck), each with the total in RWF and the arrival time.
- One line explains the price. The full breakdown opens when you tap it.
- Payment shown up front: MTN MoMo, Airtel Money, cash on pickup.

## 4. Who receives it
- Recipient phone first, checked as a Rwandan number (+250 7X), with a contacts picker where the phone supports it. Name second.
- Option to let the recipient pay.

## 5. Confirm and pay
- One summary card, then sign in with a phone code only at this step.
- Pay in the app with a MoMo push. Tracking code and an SMS/WhatsApp share are ready right after.

## 6. Works in real conditions
- Kinyarwanda first when the phone is set to it; English and French as options.
- The draft is saved on the phone, so a dropped connection loses nothing.
- Large touch targets, high contrast for outdoor sun, light pages for 3G.
- Accessibility pass using the better-accessibility, better-writing and better-layout skills (labels, focus, error messages that say what to do next).

## 7. Sending by AI assistant
- **Single request link:** `/send?from=...&to=...&item=...&recipient=...` opens the flow already filled in, so an assistant can prepare a booking and the person only confirms.
- **In-browser assistant tools:** the Send page registers tools such as "set pickup", "set delivery", "describe cargo", "get prices", "choose option" and "set recipient". Assistants running in the browser can fill the form while the person watches. Paying and the final confirmation always stay with the person.
- **External assistants:** an MCP server exposes read and quote tools (search places, get price quote, track shipment). Creating a shipment needs the customer's sign-in and an explicit confirmation step. It is never public.
- **Scheduled sends:** an assistant can create a draft for a future date. The customer gets an SMS to approve and pay.

## 8. Clear to AI and search engines
- Clear page titles and descriptions for every page, plus structured data (Organization, Service, FAQ for pricing and areas).
- `/llms.txt` describing what Tembera Cargo does, where it works, how to start a shipment, and the request link format.
- An `/.well-known` MCP description once the MCP server is live.
- Proper headings, labels and button names, so agents reading the page understand it.

## Technical details
- New backend endpoints (added to api.md): `GET /locations/reverse?lat&lng`, `GET /locations/recent`, `POST /quotes` (unchanged), `POST /shipments/drafts` (scheduled/assistant drafts), `POST /payments/momo`.
- Geolocation in the browser. Reverse geocoding and map picks resolve to a `Location` through our API. No mock data: missing endpoints show the existing "not connected" states.
- Google Maps connector (managed key) for the map picker, loaded only in the browser.
- Send flow state goes into URL search params and is validated with Zod. This makes the prefilled request link work and keeps drafts.
- WebMCP tools through `use-webmcp-tool` in the Send components. The server MCP uses `@lovable.dev/mcp-js` at `/mcp`. Authenticated tools wait until sign-in exists, so only public quote/track tools ship at first.
- All new text uses i18n keys in EN, RW and FR.

## Order
1. Location options and map (the earlier request)
2. Cargo tiles, everyday size options, price cards
3. Rwandan phone check, MoMo, saved draft
4. Request link and in-browser assistant tools
5. MCP server, llms.txt, structured data
