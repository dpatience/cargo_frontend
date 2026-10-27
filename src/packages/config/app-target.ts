import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHost } from "@tanstack/react-start/server";

/**
 * Which app this deployment serves.
 * - VITE_APP=client|driver|admin pins it.
 * - Vite's client|driver|admin mode selects an app for the per-port dev scripts.
 * - Otherwise the hostname decides: driver.* → driver, admin.* → admin,
 *   the configured client host and public Cargo domains → client.
 * - Anywhere else (Lovable preview, localhost:8080) → "all" so every app stays reachable.
 */
export type AppTarget = "client" | "driver" | "admin" | "all";

export const appBasePath: Record<Exclude<AppTarget, "all">, string> = { client: "/", driver: "/driver", admin: "/admin" };

const getHost = createIsomorphicFn()
  .server(() => getRequestHost())
  .client(() => window.location.host);

const PUBLIC_CLIENT_HOSTS = [
  "cargo.tembera.nyxarith.com",
  "cargo.nyxarith.com",
  "cargo.tembera.app",
];

export function isClientHost(host: string, configuredHost?: string): boolean {
  const normalizedHost = host.toLowerCase();
  return [configuredHost, ...PUBLIC_CLIENT_HOSTS]
    .filter((candidate): candidate is string => Boolean(candidate))
    .some((candidate) => {
      const domain = candidate.toLowerCase();
      return normalizedHost === domain || normalizedHost === `www.${domain}`;
    });
}

export function resolveAppTarget(): AppTarget {
  const pinned = import.meta.env["VITE_APP"] as string | undefined;
  if (pinned === "client" || pinned === "driver" || pinned === "admin") return pinned;
  const mode = import.meta.env.MODE;
  if (mode === "client" || mode === "driver" || mode === "admin") return mode;
  const host = (getHost() ?? "").split(":")[0]!.toLowerCase();
  if (host.startsWith("driver.")) return "driver";
  if (host.startsWith("admin.")) return "admin";
  const clientHost = import.meta.env["VITE_CLIENT_HOST"] as string | undefined;
  if (isClientHost(host, clientHost)) return "client";
  return "all";
}

export function areaOf(pathname: string): Exclude<AppTarget, "all"> {
  if (pathname === "/driver" || pathname.startsWith("/driver/")) return "driver";
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "admin";
  return "client";
}
