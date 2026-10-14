import { describe, expect, it } from "vitest";
import {
  cloudflareWebAnalyticsAttributes,
  isPublicCargoAnalyticsPath,
} from "@/packages/config/analytics";

describe("Cloudflare Web Analytics page eligibility", () => {
  it("allows localized public paths only", () => {
    expect(isPublicCargoAnalyticsPath("/en")).toBe(true);
    expect(isPublicCargoAnalyticsPath("/rw/help")).toBe(true);
    expect(isPublicCargoAnalyticsPath("/app")).toBe(false);
    expect(isPublicCargoAnalyticsPath("/send")).toBe(false);
    expect(isPublicCargoAnalyticsPath("/track/private-code")).toBe(false);
    expect(isPublicCargoAnalyticsPath("/enough")).toBe(false);
  });

  it("excludes explicitly non-indexable content", () => {
    expect(isPublicCargoAnalyticsPath("/en/privacy", false)).toBe(false);
  });

  it("uses the Cloudflare beacon with automatic SPA tracking disabled", () => {
    const attributes = cloudflareWebAnalyticsAttributes();

    expect(attributes.src).toBe("https://static.cloudflareinsights.com/beacon.min.js");
    expect(JSON.parse(attributes.dataCfBeacon)).toMatchObject({ spa: false });
    expect(JSON.parse(attributes.dataCfBeacon).token).toMatch(/^[a-f0-9]{32}$/);
  });
});
