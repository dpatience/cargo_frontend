import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Camera, Check, ChevronLeft, PencilLine, Share2 } from "lucide-react";
import { ClientShell } from "@/apps/client/ClientShell";
import { CameraCapture } from "@/apps/client/CameraCapture";
import { LocationPicker } from "@/apps/client/LocationPicker";
import { quotesApi, shipmentsApi, visionApi, type QuoteRequest } from "@/packages/api/services";
import type { CargoAnalysis, Location, Quote, QuoteOption, Shipment } from "@/packages/types";
import { formatRWF, useI18n } from "@/packages/i18n";
import { OtpSignIn, useToken } from "@/packages/ui/auth";
import { Button, buttonVariants, Card, ErrorState, Field, Input, StatusPill } from "@/packages/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/send")({
  head: () => ({
    meta: [
      { title: "Send cargo — Tembera Cargo" },
      { name: "description", content: "Tell us where, snap your cargo, compare delivery options and pay in RWF." },
      { property: "og:title", content: "Send cargo — Tembera Cargo" },
      { property: "og:description", content: "Send anything across Rwanda in a few taps." },
    ],
  }),
  component: Send,
});

type Step = "route" | "cargo" | "price" | "recipient" | "confirm" | "done";
const steps: Step[] = ["route", "cargo", "price", "recipient", "confirm"];

function Send() {
  const { t } = useI18n();
  const auth = useToken("client");
  const [step, setStep] = useState<Step>("route");
  const [from, setFrom] = useState<Location | null>(null);
  const [to, setTo] = useState<Location | null>(null);
  const [mode, setMode] = useState<"camera" | "manual" | null>(null);
  const [analysis, setAnalysis] = useState<CargoAnalysis | null>(null);
  const [manual, setManual] = useState({ category: "", weightKg: "", sizeClass: "", fragile: false, description: "" });
  const [quote, setQuote] = useState<Quote | null>(null);
  const [option, setOption] = useState<QuoteOption | null>(null);
  const [recipient, setRecipient] = useState({ name: "", phone: "+250", notes: "" });
  const [shipment, setShipment] = useState<Shipment | null>(null);

  const analyze = useMutation({ mutationFn: (imgs: Blob[]) => visionApi.analyze(imgs), onSuccess: setAnalysis });
  const getQuote = useMutation({
    mutationFn: () => {
      const body: QuoteRequest = { originId: from!.id, destinationId: to!.id };
      if (mode === "camera" && analysis) body.analysisId = analysis.analysisId;
      else body.manual = { category: manual.category, weightKg: manual.weightKg ? Number(manual.weightKg) : undefined, sizeClass: manual.sizeClass || undefined, fragile: manual.fragile, description: manual.description || undefined };
      return quotesApi.create(body);
    },
    onSuccess: (q) => { setQuote(q); setOption(q.options.find((o) => o.recommended) ?? null); setStep("price"); },
  });
  const create = useMutation({
    mutationFn: () => shipmentsApi.create({ quoteId: quote!.quoteId, optionId: option!.id, recipient: { name: recipient.name, phone: recipient.phone, notes: recipient.notes || undefined } }),
    onSuccess: (s) => { setShipment(s); setStep("done"); },
  });

  const idx = steps.indexOf(step);
  const back = () => idx > 0 && setStep(steps[idx - 1]);

  return (
    <ClientShell>
      <div className="mx-auto max-w-xl">
        {step !== "done" && (
          <>
            <div className="mb-2 flex items-center gap-2">
              {idx > 0 && <Button variant="ghost" size="sm" onClick={back} aria-label={t("common.back")}><ChevronLeft className="size-4" /></Button>}
              <h1 className="text-2xl font-bold">{t("home.send")}</h1>
            </div>
            <ol className="mb-6 grid grid-cols-5 gap-1.5" aria-label="Progress">
              {steps.map((s, i) => (
                <li key={s} className="space-y-1">
                  <div className={cn("h-1.5 rounded-full", i <= idx ? "bg-accent" : "bg-muted")} />
                  <span className={cn("text-xs", i === idx ? "text-foreground" : "text-muted-foreground")}>{t(`send.step.${s}`)}</span>
                </li>
              ))}
            </ol>
          </>
        )}

        {step === "route" && (
          <Card className="space-y-4">
            <LocationPicker label={t("send.from")} value={from} onChange={setFrom} />
            <LocationPicker label={t("send.to")} value={to} onChange={setTo} />
            <Button block size="lg" disabled={!from || !to} onClick={() => setStep("cargo")}>{t("common.next")}</Button>
          </Card>
        )}

        {step === "cargo" && (
          <div className="space-y-4">
            {!mode && (
              <>
                <p className="font-medium">{t("send.cargoHow")}</p>
                <button onClick={() => setMode("camera")} className="flex w-full items-center gap-4 rounded-2xl bg-brand p-5 text-left text-primary-foreground shadow-cta">
                  <Camera className="size-8" /><span><span className="block text-lg font-bold">{t("send.useCamera")}</span><span className="text-sm opacity-85">{t("send.useCameraHint")}</span></span>
                </button>
                <button onClick={() => setMode("manual")} className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left">
                  <PencilLine className="size-8 text-accent" /><span><span className="block text-lg font-bold">{t("send.manual")}</span><span className="text-sm text-muted-foreground">{t("send.manualHint")}</span></span>
                </button>
              </>
            )}
            {mode === "camera" && !analysis && (
              <Card className="space-y-3">
                <h2 className="text-lg font-semibold">{t("camera.title")}</h2>
                <CameraCapture busy={analyze.isPending} onSubmit={(imgs) => analyze.mutate(imgs)} />
                {analyze.error && <ErrorState error={analyze.error} />}
                <Button variant="ghost" block onClick={() => setMode("manual")}>{t("send.manual")}</Button>
              </Card>
            )}
            {mode === "camera" && analysis && (
              <Card className="space-y-3">
                <h2 className="text-lg font-semibold">{t("camera.result")}</h2>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div><dt className="text-muted-foreground">{t("send.category")}</dt><dd className="font-semibold">{analysis.category}</dd></div>
                  {analysis.estimatedWeightKg != null && <div><dt className="text-muted-foreground">{t("send.weight")}</dt><dd className="font-semibold">~{analysis.estimatedWeightKg} kg</dd></div>}
                  {analysis.sizeClass && <div><dt className="text-muted-foreground">{t("send.size")}</dt><dd className="font-semibold">{analysis.sizeClass}</dd></div>}
                  {analysis.dimensionsCm && <div><dt className="text-muted-foreground">cm</dt><dd className="font-semibold">{analysis.dimensionsCm.length}×{analysis.dimensionsCm.width}×{analysis.dimensionsCm.height}</dd></div>}
                </dl>
                {analysis.fragile && <StatusPill tone="warning">{t("send.fragile")}</StatusPill>}
                {(analysis.confidence < 0.7 || analysis.needsReview) && <p className="rounded-xl bg-warning/15 p-3 text-sm text-warning">{t("camera.lowConfidence")}</p>}
                {analysis.warnings.map((w) => <p key={w} className="text-sm text-muted-foreground">• {w}</p>)}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => { setAnalysis(null); setMode("manual"); setManual((m) => ({ ...m, category: analysis.category, weightKg: String(analysis.estimatedWeightKg ?? "") })); }}>{t("send.manual")}</Button>
                  <Button variant="success" loading={getQuote.isPending} onClick={() => getQuote.mutate()}>{t("camera.accept")}</Button>
                </div>
                {getQuote.error && <ErrorState error={getQuote.error} onRetry={() => getQuote.mutate()} />}
              </Card>
            )}
            {mode === "manual" && (
              <Card>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); getQuote.mutate(); }}>
                  <Field label={t("send.category")}><Input value={manual.category} onChange={(e) => setManual({ ...manual, category: e.target.value })} required /></Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={t("send.weight")}><Input type="number" inputMode="decimal" min={0} step="0.1" value={manual.weightKg} onChange={(e) => setManual({ ...manual, weightKg: e.target.value })} /></Field>
                    <Field label={t("send.size")}>
                      <select value={manual.sizeClass} onChange={(e) => setManual({ ...manual, sizeClass: e.target.value })} className="h-12 w-full rounded-xl border border-input bg-surface px-3">
                        <option value="">—</option><option value="small">S</option><option value="medium">M</option><option value="large">L</option><option value="xlarge">XL</option>
                      </select>
                    </Field>
                  </div>
                  <Field label={t("send.description")}><Input value={manual.description} onChange={(e) => setManual({ ...manual, description: e.target.value })} /></Field>
                  <label className="flex items-center gap-3"><input type="checkbox" className="size-5 accent-[var(--accent)]" checked={manual.fragile} onChange={(e) => setManual({ ...manual, fragile: e.target.checked })} />{t("send.fragile")}</label>
                  <Button block size="lg" loading={getQuote.isPending}>{t("send.getPrices")}</Button>
                  {getQuote.error && <ErrorState error={getQuote.error} />}
                </form>
              </Card>
            )}
          </div>
        )}

        {step === "price" && quote && (
          <div className="space-y-3">
            <p className="font-medium">{t("send.choose")}</p>
            {quote.options.map((o) => (
              <button key={o.id} onClick={() => setOption(o)} className={cn("w-full rounded-2xl border bg-card p-4 text-left", option?.id === o.id ? "border-accent ring-2 ring-accent/30" : "border-border")}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 font-semibold">{o.label}{o.recommended && <StatusPill tone="success">{t("send.recommended")}</StatusPill>}</p>
                    {(o.speed || o.estimatedDelivery) && <p className="text-sm text-muted-foreground">{[o.speed, o.estimatedDelivery].filter(Boolean).join(" · ")}</p>}
                  </div>
                  <p className="font-display text-xl font-bold">{formatRWF(o.price.amount)}</p>
                </div>
                {option?.id === o.id && (o.breakdown.length > 0 || o.explanation || o.route.length > 0) && (
                  <div className="mt-3 space-y-2 border-t border-border pt-3 text-sm">
                    <p className="font-medium text-accent">{t("send.why")}</p>
                    {o.explanation && <p className="text-muted-foreground">{o.explanation}</p>}
                    {o.breakdown.map((b) => <div key={b.label} className="flex justify-between"><span className="text-muted-foreground">{b.label}</span><span>{formatRWF(b.amount)}</span></div>)}
                    {o.route.length > 0 && <p className="text-muted-foreground">{o.route.map((r) => r.label).join(" → ")}</p>}
                  </div>
                )}
              </button>
            ))}
            <Button block size="lg" disabled={!option} onClick={() => setStep("recipient")}>{t("common.next")}</Button>
          </div>
        )}

        {step === "recipient" && (
          <Card>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep("confirm"); }}>
              <Field label={t("send.recipientName")}><Input value={recipient.name} onChange={(e) => setRecipient({ ...recipient, name: e.target.value })} required autoComplete="name" /></Field>
              <Field label={t("send.recipientPhone")}><Input type="tel" value={recipient.phone} onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })} required pattern="\+?[0-9 ]{9,15}" /></Field>
              <Field label={t("send.notes")}><Input value={recipient.notes} onChange={(e) => setRecipient({ ...recipient, notes: e.target.value })} /></Field>
              <Button block size="lg">{t("common.next")}</Button>
            </form>
          </Card>
        )}

        {step === "confirm" && option && (
          <div className="space-y-4">
            <Card className="space-y-2">
              <h2 className="text-lg font-semibold">{t("send.review")}</h2>
              <Row k={t("send.from")} v={from?.name} /><Row k={t("send.to")} v={to?.name} />
              <Row k={t("send.category")} v={analysis?.category ?? manual.category} />
              <Row k={t("send.recipientName")} v={`${recipient.name} · ${recipient.phone}`} />
              <Row k={option.label} v={formatRWF(option.price.amount)} strong />
            </Card>
            {!auth.ready ? null : auth.token ? (
              <>
                <Button variant="hero" block size="lg" loading={create.isPending} onClick={() => create.mutate()}>{t("send.confirm")}</Button>
                {create.error && <ErrorState error={create.error} onRetry={() => create.mutate()} />}
              </>
            ) : <><p className="text-sm text-muted-foreground">{t("state.signInNeeded")}</p><OtpSignIn area="client" onDone={auth.save} /></>}
          </div>
        )}

        {step === "done" && shipment && (
          <Card className="space-y-5 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-success/15 text-success"><Check className="size-8" /></div>
            <h1 className="text-2xl font-bold">{t("send.created")}</h1>
            <div><p className="text-sm text-muted-foreground">{t("send.trackingCode")}</p><p className="font-display text-3xl font-bold tracking-wider">{shipment.trackingCode}</p></div>
            {shipment.paymentUrl && <a href={shipment.paymentUrl} className={buttonVariants({ variant: "hero", size: "lg", block: true })}>{t("send.pay")}</a>}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => {
                const url = `${window.location.origin}/track/${shipment.trackingCode}`;
                if (navigator.share) navigator.share({ title: "Tembera Cargo", url }); else navigator.clipboard.writeText(url);
              }}><Share2 className="size-4" />{t("send.share")}</Button>
              <Link to="/track/$code" params={{ code: shipment.trackingCode }} className={buttonVariants({ variant: "subtle" })}>{t("home.track")}</Link>
            </div>
          </Card>
        )}
      </div>
    </ClientShell>
  );
}

function Row({ k, v, strong }: { k: string; v?: string; strong?: boolean }) {
  return <div className="flex justify-between gap-4 border-b border-border py-2 last:border-0"><span className="text-muted-foreground">{k}</span><span className={strong ? "font-display text-lg font-bold" : "text-right font-medium"}>{v}</span></div>;
}
