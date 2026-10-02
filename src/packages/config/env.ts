// Runtime configuration. All values come from VITE_* env vars (see .env.example).
export const config = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "",
  realtimeUrl: (import.meta.env.VITE_REALTIME_URL as string | undefined) ?? "",
  requestTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 15000),
};

export const isApiConfigured = () => config.apiBaseUrl.length > 0;

export type AppArea = "client" | "driver" | "admin";
