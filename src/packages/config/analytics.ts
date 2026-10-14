const CLOUDFLARE_WEB_ANALYTICS_TOKEN = "e72feaa3d2654e5ead22e28a97671840";

export function isPublicCargoAnalyticsPath(pathname: string, enabled = true): boolean {
  return enabled && /^\/(?:en|rw)(?:\/|$)/.test(pathname);
}

export function cloudflareWebAnalyticsAttributes() {
  return {
    src: "https://static.cloudflareinsights.com/beacon.min.js",
    dataCfBeacon: JSON.stringify({ token: CLOUDFLARE_WEB_ANALYTICS_TOKEN, spa: false }),
  };
}
