import { createFileRoute } from "@tanstack/react-router";
import { Home } from "./index";
import { cargoLandingHead } from "@/packages/config/seo";

export const Route = createFileRoute("/en/")({
  head: () => cargoLandingHead("en"),
  component: Home,
});
