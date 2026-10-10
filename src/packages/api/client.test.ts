import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

vi.mock("../config/env", () => ({
  config: { apiBaseUrl: "https://api.cargo.test/v1", requestTimeoutMs: 2_000 },
  isApiConfigured: () => true,
}));

import { apiRequest, tokenStore } from "./client";

describe("API session lifecycle", () => {
  let fetchMock: ReturnType<typeof vi.fn<typeof fetch>>;

  beforeEach(() => {
    localStorage.clear();
    fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("refreshes an expiring app-specific access token before sending the request", async () => {
    tokenStore.set("driver", "old-driver-token", 1);
    fetchMock
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            token: "new-driver-token",
            expiresInSeconds: 900,
            user: { id: "driver-1", roles: ["driver"] },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    await expect(
      apiRequest("/driver/jobs", z.object({ ok: z.boolean() }), { area: "driver" }),
    ).resolves.toEqual({ ok: true });

    const refreshCall = fetchMock.mock.calls[0];
    const apiCall = fetchMock.mock.calls[1];
    expect(refreshCall).toBeDefined();
    expect(apiCall).toBeDefined();
    expect(String(refreshCall?.[0])).toBe("https://api.cargo.test/v1/auth/refresh");
    expect(refreshCall?.[1]?.credentials).toBe("include");
    expect(JSON.parse(String(refreshCall?.[1]?.body))).toEqual({ app: "driver" });
    expect(new Headers(apiCall?.[1]?.headers).get("Authorization")).toBe("Bearer new-driver-token");
    expect(tokenStore.get("driver")).toBe("new-driver-token");
    expect(tokenStore.get("client")).toBeNull();
  });

  it("retries an unauthorized request once after rotating its refresh session", async () => {
    tokenStore.set("client", "expired-client-token", 900);
    fetchMock
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            token: "rotated-client-token",
            expiresInSeconds: 900,
            user: { id: "client-1", roles: ["client"] },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    await expect(
      apiRequest("/shipments", z.object({ ok: z.boolean() }), { area: "client" }),
    ).resolves.toEqual({ ok: true });

    expect(fetchMock).toHaveBeenCalledTimes(3);
    const originalAuthorization = new Headers(fetchMock.mock.calls[0]?.[1]?.headers).get(
      "Authorization",
    );
    const rotatedAuthorization = new Headers(fetchMock.mock.calls[2]?.[1]?.headers).get(
      "Authorization",
    );
    expect(originalAuthorization?.startsWith("Bearer ")).toBe(true);
    expect(originalAuthorization?.endsWith("expired-client-token")).toBe(true);
    expect(rotatedAuthorization?.startsWith("Bearer ")).toBe(true);
    expect(rotatedAuthorization?.endsWith("rotated-client-token")).toBe(true);
  });
});
