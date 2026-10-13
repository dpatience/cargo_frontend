import { createFileRoute } from "@tanstack/react-router";
import { Home } from "./index";
import { cargoLandingHead } from "@/packages/config/seo";

export const Route = createFileRoute("/rw/")({
  head: () => cargoLandingHead("rw"),
  component: Home,
});
