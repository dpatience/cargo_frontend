import { describe, expect, it } from "vitest";
import { isClientHost } from "./app-target";

describe("isClientHost", () => {
  it.each([
    "cargo.tembera.nyxarith.com",
    "www.cargo.tembera.nyxarith.com",
    "cargo.nyxarith.com",
    "www.cargo.nyxarith.com",
    "cargo.tembera.app",
    "www.cargo.tembera.app",
    "CARGO.TEMBERA.APP",
  ])("recognizes the public Cargo hostname %s", (host) => {
    expect(isClientHost(host)).toBe(true);
  });

  it("recognizes a configured client hostname", () => {
    expect(isClientHost("www.cargo.tembera.rw", "cargo.tembera.rw")).toBe(true);
  });

  it("does not recognize unrelated hosts", () => {
    expect(isClientHost("preview.pages.dev")).toBe(false);
  });
});
