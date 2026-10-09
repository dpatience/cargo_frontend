import { z } from "zod";
import { config, isApiConfigured, type AppArea } from "../config/env";

export type ApiErrorKind = "unconfigured" | "offline" | "timeout" | "unauthorized" | "forbidden" | "not_found" | "validation" | "server" | "unknown";

export class ApiError extends Error {
  constructor(public kind: ApiErrorKind, message: string, public status?: number, public details?: unknown) {
    super(message);
  }
}

// Per-area token storage so client/driver/admin sessions never mix.
const tokenKey = (area: AppArea) => `tembera-cargo:${area}:token`;
export const tokenStore = {
  get(area: AppArea) {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(tokenKey(area));
  },
  set(area: AppArea, token: string) { window.localStorage.setItem(tokenKey(area), token); },
  clear(area: AppArea) { window.localStorage.removeItem(tokenKey(area)); },
};

type RequestOpts = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  area?: AppArea;
  query?: Record<string, string | number | undefined>;
  formData?: FormData;
};

export async function apiRequest<S extends z.ZodTypeAny>(path: string, schema: S, opts: RequestOpts = {}): Promise<z.output<S>> {
  if (!isApiConfigured()) throw new ApiError("unconfigured", "The Tembera Cargo service is not connected yet.");
  if (typeof navigator !== "undefined" && navigator.onLine === false) throw new ApiError("offline", "You are offline.");

  const url = new URL(config.apiBaseUrl + path);
  Object.entries(opts.query ?? {}).forEach(([k, v]) => v !== undefined && v !== "" && url.searchParams.set(k, String(v)));

  const headers: Record<string, string> = { Accept: "application/json" };
  const token = opts.area ? tokenStore.get(opts.area) : null;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  let body: BodyInit | null = null;
  if (opts.formData) body = opts.formData;
  else if (opts.body !== undefined) { headers["Content-Type"] = "application/json"; body = JSON.stringify(opts.body); }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), config.requestTimeoutMs);
  let res: Response;
  try {
    res = await fetch(url, { method: opts.method ?? "GET", headers, body, signal: ctrl.signal });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw new ApiError("timeout", "The request took too long.");
    throw new ApiError("offline", "Could not reach the server.");
  } finally { clearTimeout(timer); }

  const json = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const msg = (json && typeof json === "object" && "message" in json && String(json.message)) || res.statusText;
    const kind: ApiErrorKind = res.status === 401 ? "unauthorized" : res.status === 403 ? "forbidden" : res.status === 404 ? "not_found" : res.status === 422 || res.status === 400 ? "validation" : res.status >= 500 ? "server" : "unknown";
    if (kind === "unauthorized" && opts.area) tokenStore.clear(opts.area);
    throw new ApiError(kind, msg, res.status, json);
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) throw new ApiError("validation", "Unexpected response from server.", res.status, parsed.error.flatten());
  return parsed.data as z.output<S>;
}
