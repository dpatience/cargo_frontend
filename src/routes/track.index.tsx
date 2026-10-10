import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ClientShell } from "@/apps/client/ClientShell";
import { useI18n } from "@/packages/i18n";
import { absoluteSiteUrl } from "@/packages/config/seo";
import { Button, Card, Input } from "@/packages/ui";

export const Route = createFileRoute("/track/")({
  head: () => {
    const canonicalUrl = absoluteSiteUrl("/track");
    return {
      meta: [
        { title: "Track cargo — Tembera Cargo" },
        {
          name: "description",
          content: "Enter your tracking code to follow your Tembera Cargo shipment across Rwanda.",
        },
        { property: "og:title", content: "Track cargo — Tembera Cargo" },
        { property: "og:description", content: "See your shipment's latest status and journey." },
        ...(canonicalUrl ? [{ property: "og:url", content: canonicalUrl }] : []),
      ],
      links: canonicalUrl ? [{ rel: "canonical", href: canonicalUrl }] : [],
    };
  },
  component: TrackForm,
});

export function TrackCodeForm({
  titleKey = "track.title",
  bodyKey,
}: {
  titleKey?: "track.title" | "receive.title";
  bodyKey?: "receive.body";
}) {
  const { t } = useI18n();
  const nav = useNavigate();
  const [code, setCode] = useState("");
  return (
    <Card className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">{t(titleKey)}</h1>
      {bodyKey && <p className="text-muted-foreground">{t(bodyKey)}</p>}
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const c = code.trim();
          if (c) nav({ to: "/track/$code", params: { code: c } });
        }}
      >
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={t("track.placeholder")}
          aria-label={t("track.placeholder")}
          autoCapitalize="characters"
        />
        <Button>{t("track.go")}</Button>
      </form>
    </Card>
  );
}

function TrackForm() {
  return (
    <ClientShell>
      <TrackCodeForm />
    </ClientShell>
  );
}
