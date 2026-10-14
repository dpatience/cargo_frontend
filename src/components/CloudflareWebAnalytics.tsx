import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  cloudflareWebAnalyticsAttributes,
  isPublicCargoAnalyticsPath,
} from "@/packages/config/analytics";

export function CloudflareWebAnalytics({ enabled = true }: { enabled?: boolean }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    if (!import.meta.env.PROD || !isPublicCargoAnalyticsPath(pathname, enabled)) return;

    const script = document.createElement("script");
    const reportLoadError = () => {
      console.error("Cloudflare Web Analytics beacon failed to load.");
    };

    script.type = "module";
    const attributes = cloudflareWebAnalyticsAttributes();
    script.src = attributes.src;
    script.setAttribute("data-cf-beacon", attributes.dataCfBeacon);
    script.addEventListener("error", reportLoadError);
    document.head.append(script);

    return () => {
      script.removeEventListener("error", reportLoadError);
      script.remove();
    };
  }, [enabled, pathname]);

  return null;
}
