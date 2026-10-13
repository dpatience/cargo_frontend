import { createFileRoute } from "@tanstack/react-router";
import { Home } from "./index";
import { absoluteSiteUrl } from "@/packages/config/seo";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [{ title: "Tembera Cargo app" }, { name: "robots", content: "noindex,follow" }],
    links: [{ rel: "canonical", href: absoluteSiteUrl("/app") }],
  }),
  component: Home,
});
