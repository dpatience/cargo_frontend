import type { Shipment } from "@/packages/types";
import { formatDate, formatRWF, useI18n } from "@/packages/i18n";
import { Card, StatusPill } from "@/packages/ui";

export function ShipmentView({ s }: { s: Shipment }) {
  const { t } = useI18n();
  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("send.trackingCode")}
            </p>
            <p className="font-display text-2xl font-bold">{s.trackingCode}</p>
          </div>
          <StatusPill tone={s.status === "delivered" ? "success" : "info"}>
            {s.statusLabel ?? s.status}
          </StatusPill>
        </div>
        <p className="text-lg font-semibold">
          {s.origin} <span className="text-accent">→</span> {s.destination}
        </p>
        {(s.originSource === "google" || s.destinationSource === "google") && (
          <p className="text-xs text-muted-foreground">Google Maps</p>
        )}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
          {s.eta && (
            <span>
              {t("track.eta")}: <b className="text-foreground">{formatDate(s.eta)}</b>
            </span>
          )}
          {s.price && <span>{formatRWF(s.price.amount)}</span>}
        </div>
      </Card>
      {s.events.length > 0 && (
        <Card>
          <h2 className="mb-4 font-semibold">{t("track.timeline")}</h2>
          <ol className="relative space-y-5 border-l border-border pl-5">
            {s.events.map((e, i) => (
              <li key={i} className="relative">
                <span
                  className={`absolute -left-[26px] top-1 size-3 rounded-full ${i === 0 ? "bg-accent ring-4 ring-accent/20" : "bg-muted-foreground"}`}
                />
                <p className="font-medium">{e.label}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(e.at)}
                  {e.location ? ` · ${e.location}` : ""}
                </p>
              </li>
            ))}
          </ol>
        </Card>
      )}
    </div>
  );
}
