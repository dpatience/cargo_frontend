import { describe, expect, it } from "vitest";
import { normalizeRwandaPhone, readPrefill, rwandaNetwork } from "@/apps/client/send/rwanda";

describe("Rwanda phone numbers", () => {
  it("accepts local 07 format", () => expect(normalizeRwandaPhone("078 123 4567")).toBe("+250781234567"));
  it("accepts +250 format", () => expect(normalizeRwandaPhone("+250 722 000 111")).toBe("+250722000111"));
  it("rejects non-mobile prefixes", () => expect(normalizeRwandaPhone("0751234567")).toBeNull());
  it("rejects too short numbers", () => expect(normalizeRwandaPhone("07812345")).toBeNull());
  it("detects MTN vs Airtel", () => {
    expect(rwandaNetwork("0781234567")).toBe("MTN");
    expect(rwandaNetwork("0731234567")).toBe("Airtel");
  });
});

describe("send prefill", () => {
  it("keeps a pickup inside Rwanda", () => {
    expect(readPrefill({ fromLat: -1.95, fromLng: 30.06, fromLabel: "Kimironko" }).from).toEqual({ lat: -1.95, lng: 30.06, label: "Kimironko" });
  });
  it("drops coordinates outside Rwanda", () => {
    expect(readPrefill({ fromLat: 40.7, fromLng: -74, fromLabel: "NYC" }).from).toBeNull();
  });
  it("maps vehicle size to API size class", () => {
    expect(readPrefill({ size: "moto" }).size?.sizeClass).toBe("small");
    expect(readPrefill({ size: "spaceship" }).size).toBeNull();
  });
  it("normalises recipient phone and rejects invalid", () => {
    expect(readPrefill({ recipientPhone: "0791112223" }).recipientPhone).toBe("+250791112223");
    expect(readPrefill({ recipientPhone: "12345" }).recipientPhone).toBeNull();
  });
});
