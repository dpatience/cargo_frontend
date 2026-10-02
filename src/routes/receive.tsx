import { createFileRoute } from "@tanstack/react-router";
import { ClientShell } from "@/apps/client/ClientShell";
import { TrackCodeForm } from "./track.index";

export const Route = createFileRoute("/receive")({
  head: () => ({
    meta: [
      { title: "Receive cargo — Tembera Cargo" },
      { name: "description", content: "Someone sent you cargo? Use your tracking code to see where it is and when it arrives." },
      { property: "og:title", content: "Receive cargo — Tembera Cargo" },
      { property: "og:description", content: "See where your incoming cargo is and when it arrives." },
    ],
  }),
  component: () => <ClientShell><TrackCodeForm titleKey="receive.title" bodyKey="receive.body" /></ClientShell>,
});
