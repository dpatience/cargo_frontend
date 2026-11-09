import { createFileRoute } from "@tanstack/react-router";
import { Home } from "./index";
import { absoluteSiteUrl } from "@/packages/config/seo";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Tembera Cargo app | Send and track cargo in Rwanda" },
      {
        name: "description",
        content:
          "Use the Tembera Cargo web app to plan a shipment, review a quote, send cargo and track delivery across Rwanda.",
      },
      { name: "robots", content: "index,follow,max-image-preview:large" },
    ],
    links: [{ rel: "canonical", href: absoluteSiteUrl("/app") }],
  }),
  component: Home,
});
