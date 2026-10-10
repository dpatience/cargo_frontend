import { z } from "zod";
import { config, isApiConfigured, type AppArea } from "../config/env";
import { Session } from "../types";

export type ApiErrorKind =
  | "unconfigured"
  | "offline"
  | "timeout"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation"
  | "rate_limited"
  | "server"
  | "unknown";

export class ApiError extends Error {
  constructor(
    public kind: ApiErrorKind,
    message: string,
    public status?: number,
    public details?: unknown,
  ) {
    super(message);
  }
}

// Per-area token storage so client/driver/admin sessions never mix.
const tokenKey = (area: AppArea) => `tembera-cargo:${area}:token`;
const tokenExpiryKey = (area: AppArea) => `tembera-cargo:${area}:token-expiry`;
export const tokenStore = {
  get(area: AppArea) {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(tokenKey(area));
  },
  set(area: AppArea, token: string, expiresInSeconds: number) {
    window.localStorage.setItem(tokenKey(area), token);
    window.localStorage.setItem(tokenExpiryKey(area), String(Date.now() + expiresInSeconds * 1000));
  },
  isExpiring(area: AppArea) {
    if (typeof window === "undefined") return true;
    const expiresAt = Number(window.localStorage.getItem(tokenExpiryKey(area)) ?? 0);
    return !expiresAt || expiresAt <= Date.now() + 30_000;
  },
  clear(area: AppArea) {
    window.localStorage.removeItem(tokenKey(area));
    window.localStorage.removeItem(tokenExpiryKey(area));
    window.dispatchEvent(new CustomEvent("cargo:auth-cleared", { detail: { area } }));
  },
};

type RequestOpts = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  area?: AppArea;
  credentials?: RequestCredentials;
  retryUnauthorized?: boolean;
  query?: Record<string, string | number | undefined>;
  formData?: FormData;
  headers?: Record<string, string>;
};

const refreshInFlight = new Map<AppArea, Promise<string>>();

async function refreshAccessToken(area: AppArea): Promise<string> {
  const pending = refreshInFlight.get(area);
  if (pending) return pending;

  const promise = (async () => {
    const url = new URL(config.apiBaseUrl + "/auth/refresh");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.requestTimeoutMs);

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ app: area }),
        signal: controller.signal,
      });
      const json = response.status === 204 ? null : await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) tokenStore.clear(area);
        const message =
          (json && typeof json === "object" && "message" in json && String(json.message)) ||
          response.statusText;
        const kind: ApiErrorKind =
          response.status === 401
            ? "unauthorized"
            : response.status === 403
              ? "forbidden"
              : response.status === 429
                ? "rate_limited"
                : response.status >= 500
                  ? "server"
                  : "unknown";
        throw new ApiError(kind, message, response.status, json);
      }

      const parsed = Session.safeParse(json);
      if (!parsed.success)
        throw new ApiError(
          "validation",
          "Unexpected session response from server.",
          response.status,
          parsed.error.flatten(),
        );
      tokenStore.set(area, parsed.data.token, parsed.data.expiresInSeconds);
      return parsed.data.token;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error && error.name === "AbortError")
        throw new ApiError("timeout", "The request took too long.");
      throw new ApiError("offline", "Could not reach the server.");
    } finally {
      clearTimeout(timer);
      refreshInFlight.delete(area);
    }
  })();

  refreshInFlight.set(area, promise);
  return promise;
}

export async function apiRequest<S extends z.ZodTypeAny>(
  path: string,
  schema: S,
  opts: RequestOpts = {},
): Promise<z.output<S>> {
  if (!isApiConfigured())
    throw new ApiError("unconfigured", "The Tembera Cargo service is not connected yet.");
  if (typeof navigator !== "undefined" && navigator.onLine === false)
    throw new ApiError("offline", "You are offline.");

  const url = new URL(config.apiBaseUrl + path);
  Object.entries(opts.query ?? {}).forEach(
    ([k, v]) => v !== undefined && v !== "" && url.searchParams.set(k, String(v)),
  );

  let headers: Record<string, string> = { Accept: "application/json", ...opts.headers };
  let token = opts.area ? tokenStore.get(opts.area) : null;
  if (opts.area && token && tokenStore.isExpiring(opts.area)) {
    try {
      token = await refreshAccessToken(opts.area);
    } catch (error) {
      if (error instanceof ApiError && error.kind === "unauthorized") tokenStore.clear(opts.area);
      throw error;
    }
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;
  let body: BodyInit | null = null;
  if (opts.formData) body = opts.formData;
  else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  const ctrl = new AbortController();
  let timer = setTimeout(() => ctrl.abort(), config.requestTimeoutMs);
  let res: Response;
  try {
    res = await fetch(url, {
      method: opts.method ?? "GET",
      headers,
      body,
      credentials: opts.credentials,
      signal: ctrl.signal,
    });
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError")
      throw new ApiError("timeout", "The request took too long.");
    throw new ApiError("offline", "Could not reach the server.");
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 401 && opts.area && token && opts.retryUnauthorized !== false) {
    try {
      const refreshedToken = await refreshAccessToken(opts.area);
      headers = { ...headers };
      headers["Authorization"] = `Bearer ${refreshedToken}`;
      clearTimeout(timer);
      const retryController = new AbortController();
      timer = setTimeout(() => retryController.abort(), config.requestTimeoutMs);
      res = await fetch(url, {
        method: opts.method ?? "GET",
        headers,
        body,
        credentials: opts.credentials,
        signal: retryController.signal,
      });
    } catch (error) {
      if (error instanceof ApiError && error.kind === "unauthorized") tokenStore.clear(opts.area);
      if (error instanceof ApiError) throw error;
      if (error instanceof Error && error.name === "AbortError")
        throw new ApiError("timeout", "The request took too long.");
      throw new ApiError("offline", "Could not reach the server.");
    } finally {
      clearTimeout(timer);
    }
  }

  const json = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const msg =
      (json && typeof json === "object" && "message" in json && String(json.message)) ||
      res.statusText;
    const kind: ApiErrorKind =
      res.status === 401
        ? "unauthorized"
        : res.status === 403
          ? "forbidden"
          : res.status === 404
            ? "not_found"
            : res.status === 422 || res.status === 400
              ? "validation"
              : res.status === 429
                ? "rate_limited"
                : res.status >= 500
                  ? "server"
                  : "unknown";
    if (kind === "unauthorized" && opts.area) tokenStore.clear(opts.area);
    throw new ApiError(kind, msg, res.status, json);
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success)
    throw new ApiError(
      "validation",
      "Unexpected response from server.",
      res.status,
      parsed.error.flatten(),
    );
  return parsed.data;
}
