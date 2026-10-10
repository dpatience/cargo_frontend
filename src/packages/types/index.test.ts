import { describe, expect, it } from "vitest";

import { Location, PublicTracking, Quote, Session } from "./index";

describe("frontend API contract schemas", () => {
  it("requires an access-token lifetime in session responses", () => {
    const session = {
      token: "access-token",
      expiresInSeconds: 900,
      user: { id: "user-1", roles: ["client"] },
    };

    expect(Session.safeParse(session).success).toBe(true);
    expect(Session.safeParse({ ...session, expiresInSeconds: 0 }).success).toBe(false);
  });

  it("requires a timezone-aware quote expiry", () => {
    const quote = {
      quoteId: "quote-1",
      expiresAt: "2026-10-09T20:00:00Z",
      options: [],
    };

    expect(Quote.safeParse(quote).success).toBe(true);
    expect(Quote.safeParse({ ...quote, expiresAt: undefined }).success).toBe(false);
    expect(Quote.safeParse({ ...quote, expiresAt: "2026-10-09" }).success).toBe(false);
  });

  it("rejects private shipment fields from public tracking responses", () => {
    const tracking = {
      id: "shipment-1",
      trackingCode: "public-code",
      status: "in_transit",
      origin: "Kigali",
      destination: "Huye",
      originSource: "google",
      destinationSource: "google",
      createdAt: "2026-10-09T12:00:00Z",
      events: [],
    };

    expect(PublicTracking.safeParse(tracking).success).toBe(true);
    expect(PublicTracking.safeParse({ ...tracking, recipientPhone: "+250..." }).success).toBe(
      false,
    );
    expect(
      PublicTracking.safeParse({ ...tracking, paymentUrl: "https://pay.example" }).success,
    ).toBe(false);
  });

  it("validates transient Google Places location results", () => {
    const location = {
      id: "ChIJ-test",
      name: "Kigali",
      address: "Kigali, Rwanda",
      lat: -1.9441,
      lng: 30.0619,
      source: "google",
    };

    expect(Location.safeParse(location).success).toBe(true);
    expect(Location.safeParse({ ...location, source: "cargo" }).success).toBe(false);
  });
});
