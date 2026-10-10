import { createFileRoute } from "@tanstack/react-router";
import { ClientShell } from "@/apps/client/ClientShell";
import { absoluteSiteUrl } from "@/packages/config/seo";
import { TrackCodeForm } from "./track.index";

export const Route = createFileRoute("/receive")({
  head: () => {
    const canonicalUrl = absoluteSiteUrl("/receive");
    return {
      meta: [
        { title: "Receive cargo — Tembera Cargo" },
        {
          name: "description",
          content:
            "Someone sent you cargo? Use your tracking code to see where it is and when it arrives.",
        },
        { property: "og:title", content: "Receive cargo — Tembera Cargo" },
        {
          property: "og:description",
          content: "See where your incoming cargo is and when it arrives.",
        },
        ...(canonicalUrl ? [{ property: "og:url", content: canonicalUrl }] : []),
      ],
      links: canonicalUrl ? [{ rel: "canonical", href: canonicalUrl }] : [],
    };
  },
  component: () => (
    <ClientShell>
      <TrackCodeForm titleKey="receive.title" bodyKey="receive.body" />
    </ClientShell>
  ),
});
