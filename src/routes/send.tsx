import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, ChevronLeft, Share2 } from "lucide-react";
import { ClientShell } from "@/apps/client/ClientShell";
import { LocationPicker } from "@/apps/client/LocationPicker";
import {
  cargoPointsQuery,
  quotesApi,
  shipmentsApi,
  type QuoteRequest,
} from "@/packages/api/services";
import type { CargoPoint, Location, Quote, QuoteOption, Shipment } from "@/packages/types";
import { formatRWF, useI18n } from "@/packages/i18n";
import { OtpSignIn, useToken } from "@/packages/ui/auth";
import { Button, buttonVariants, Card, ErrorState, Field, Input, StatusPill } from "@/packages/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/send")({
  head: () => ({
    meta: [
      { title: "Send cargo — Tembera Cargo" },
      {
        name: "description",
        content: "Enter cargo details, compare delivery options and pay in RWF.",
      },
      { property: "og:title", content: "Send cargo — Tembera Cargo" },
      { property: "og:description", content: "Send anything across Rwanda in a few taps." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Send,
});

type Step = "route" | "cargo" | "price" | "recipient" | "confirm" | "done";
const steps: Exclude<Step, "done">[] = ["route", "cargo", "price", "recipient", "confirm"];

function Send() {
  const { t } = useI18n();
  const auth = useToken("client");
  const points = useQuery(cargoPointsQuery());
  const [step, setStep] = useState<Step>("route");
  const [from, setFrom] = useState<Location | null>(null);
  const [to, setTo] = useState<Location | null>(null);
  const [manual, setManual] = useState({
    category: "",
    weightKg: "",
    sizeClass: "",
    fragile: false,
    description: "",
  });
  const [quote, setQuote] = useState<Quote | null>(null);
  const [option, setOption] = useState<QuoteOption | null>(null);
  const [recipient, setRecipient] = useState({ name: "", phone: "+250", notes: "" });
  const [senderFulfillment, setSenderFulfillment] = useState<"home_pickup" | "station_dropoff">(
    "home_pickup",
  );
  const [receiverFulfillment, setReceiverFulfillment] = useState<
    "address_delivery" | "station_collection"
  >("address_delivery");
  const [originCargoPointId, setOriginCargoPointId] = useState("");
  const [destinationCargoPointId, setDestinationCargoPointId] = useState("");
  const [measurements, setMeasurements] = useState({
    packageCount: "1",
    length: "",
    width: "",
    height: "",
  });
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState<string | null>(null);

  const getQuote = useMutation({
    mutationFn: () => {
      const body: QuoteRequest = {
        originId: from!.id,
        destinationId: to!.id,
        manual: {
          category: manual.category,
          weightKg: manual.weightKg ? Number(manual.weightKg) : undefined,
          sizeClass: manual.sizeClass || undefined,
          fragile: manual.fragile,
          description: manual.description || undefined,
        },
      };
      return quotesApi.create(body);
    },
    onSuccess: (q) => {
      setQuote(q);
      setOption(q.options.find((o) => o.recommended) ?? null);
      setStep("price");
    },
  });
  const create = useMutation({
    mutationFn: () => {
      const key = idempotencyKey ?? crypto.randomUUID();
      setIdempotencyKey(key);
      return shipmentsApi.create(
        {
          quoteId: quote!.quoteId,
          optionId: option!.id,
          recipient: {
            name: recipient.name,
            phone: recipient.phone,
            notes: recipient.notes || undefined,
          },
          packageCount: Number(measurements.packageCount),
          dimensionsCm: {
            length: Number(measurements.length),
            width: Number(measurements.width),
            height: Number(measurements.height),
          },
          senderFulfillment,
          receiverFulfillment,
          originCargoPointId:
            senderFulfillment === "station_dropoff" ? originCargoPointId : undefined,
          destinationCargoPointId:
            receiverFulfillment === "station_collection" ? destinationCargoPointId : undefined,
        },
        key,
      );
    },
    onSuccess: (s) => {
      setShipment(s);
      setStep("done");
    },
  });

  const idx = step === "done" ? steps.length : steps.indexOf(step);
  const back = () => idx > 0 && setStep(steps[idx - 1]!);

  return (
    <ClientShell>
      <div className="mx-auto max-w-xl">
        {step !== "done" && (
          <>
            <div className="mb-2 flex items-center gap-2">
              {idx > 0 && (
                <Button variant="ghost" size="sm" onClick={back} aria-label={t("common.back")}>
                  <ChevronLeft className="size-4" />
                </Button>
              )}
              <h1 className="text-2xl font-bold">{t("home.send")}</h1>
            </div>
            <ol className="mb-6 grid grid-cols-5 gap-1.5" aria-label="Progress">
              {steps.map((s, i) => (
                <li key={s} className="space-y-1">
                  <div className={cn("h-1.5 rounded-full", i <= idx ? "bg-accent" : "bg-muted")} />
                  <span
                    className={cn(
                      "text-xs",
                      i === idx ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {t(`send.step.${s}`)}
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}

        {step === "route" && (
          <Card className="space-y-4">
            <LocationPicker label={t("send.from")} value={from} onChange={setFrom} />
            <LocationPicker label={t("send.to")} value={to} onChange={setTo} />
            <Button block size="lg" disabled={!from || !to} onClick={() => setStep("cargo")}>
              {t("common.next")}
            </Button>
          </Card>
        )}

        {step === "cargo" && (
          <Card>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                getQuote.mutate();
              }}
            >
              <Field label={t("send.category")}>
                <Input
                  value={manual.category}
                  onChange={(e) => setManual({ ...manual, category: e.target.value })}
                  required
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t("send.weight")}>
                  <Input
                    type="number"
                    inputMode="decimal"
                    min="0.1"
                    step="0.1"
                    required
                    value={manual.weightKg}
                    onChange={(e) => setManual({ ...manual, weightKg: e.target.value })}
                  />
                </Field>
                <Field label={t("send.size")}>
                  <select
                    required
                    value={manual.sizeClass}
                    onChange={(e) => setManual({ ...manual, sizeClass: e.target.value })}
                    className="h-12 w-full rounded-xl border border-input bg-surface px-3"
                  >
                    <option value="">—</option>
                    <option value="small">S</option>
                    <option value="medium">M</option>
                    <option value="large">L</option>
                    <option value="xlarge">XL</option>
                  </select>
                </Field>
              </div>
              <Field label={t("send.description")}>
                <Input
                  value={manual.description}
                  onChange={(e) => setManual({ ...manual, description: e.target.value })}
                />
              </Field>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="size-5 accent-[var(--accent)]"
                  checked={manual.fragile}
                  onChange={(e) => setManual({ ...manual, fragile: e.target.checked })}
                />
                {t("send.fragile")}
              </label>
              <Button block size="lg" loading={getQuote.isPending}>
                {t("send.getPrices")}
              </Button>
              {getQuote.error && <ErrorState error={getQuote.error} />}
            </form>
          </Card>
        )}

        {step === "price" && quote && (
          <div className="space-y-3">
            <p className="font-medium">{t("send.choose")}</p>
            {quote.options.map((o) => (
              <button
                key={o.id}
                onClick={() => setOption(o)}
                className={cn(
                  "w-full rounded-2xl border bg-card p-4 text-left",
                  option?.id === o.id ? "border-accent ring-2 ring-accent/30" : "border-border",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 font-semibold">
                      {o.label}
                      {o.recommended && (
                        <StatusPill tone="success">{t("send.recommended")}</StatusPill>
                      )}
                    </p>
                    {(o.speed || o.estimatedDelivery) && (
                      <p className="text-sm text-muted-foreground">
                        {[o.speed, o.estimatedDelivery].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <p className="font-display text-xl font-bold">{formatRWF(o.price.amount)}</p>
                </div>
                {option?.id === o.id &&
                  (o.breakdown.length > 0 || o.explanation || o.route.length > 0) && (
                    <div className="mt-3 space-y-2 border-t border-border pt-3 text-sm">
                      <p className="font-medium text-accent">{t("send.why")}</p>
                      {o.explanation && <p className="text-muted-foreground">{o.explanation}</p>}
                      {o.breakdown.map((b) => (
                        <div key={b.label} className="flex justify-between">
                          <span className="text-muted-foreground">{b.label}</span>
                          <span>{formatRWF(b.amount)}</span>
                        </div>
                      ))}
                      {o.route.length > 0 && (
                        <p className="text-muted-foreground">
                          {o.route.map((r) => r.label).join(" → ")}
                        </p>
                      )}
                      {o.route.some((route) => route.source === "google") && (
                        <p className="text-xs text-muted-foreground">Google Maps</p>
                      )}
                    </div>
                  )}
              </button>
            ))}
            <Button block size="lg" disabled={!option} onClick={() => setStep("recipient")}>
              {t("common.next")}
            </Button>
          </div>
        )}

        {step === "recipient" && (
          <Card>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setStep("confirm");
              }}
            >
              <Field label={t("send.recipientName")}>
                <Input
                  value={recipient.name}
                  onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
                  required
                  autoComplete="name"
                />
              </Field>
              <Field label={t("send.recipientPhone")}>
                <Input
                  type="tel"
                  value={recipient.phone}
                  onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
                  required
                  pattern="\+?[0-9 ]{9,15}"
                />
              </Field>
              <Field label={t("send.notes")}>
                <Input
                  value={recipient.notes}
                  onChange={(e) => setRecipient({ ...recipient, notes: e.target.value })}
                />
              </Field>
              <Field label="Sender handoff">
                <select
                  value={senderFulfillment}
                  onChange={(e) => setSenderFulfillment(e.target.value as typeof senderFulfillment)}
                  className="h-12 w-full rounded-xl border border-input bg-surface px-3"
                >
                  <option value="home_pickup">Home pickup</option>
                  <option value="station_dropoff">Drop off at a cargo point</option>
                </select>
              </Field>
              {senderFulfillment === "station_dropoff" && (
                <CargoPointSelect
                  label="Origin cargo point"
                  points={points.data ?? []}
                  loading={points.isPending}
                  value={originCargoPointId}
                  onChange={setOriginCargoPointId}
                />
              )}
              <Field label="Receiver handoff">
                <select
                  value={receiverFulfillment}
                  onChange={(e) =>
                    setReceiverFulfillment(e.target.value as typeof receiverFulfillment)
                  }
                  className="h-12 w-full rounded-xl border border-input bg-surface px-3"
                >
                  <option value="address_delivery">Deliver to address</option>
                  <option value="station_collection">Collect at a cargo point</option>
                </select>
              </Field>
              {receiverFulfillment === "station_collection" && (
                <CargoPointSelect
                  label="Destination cargo point"
                  points={points.data ?? []}
                  loading={points.isPending}
                  value={destinationCargoPointId}
                  onChange={setDestinationCargoPointId}
                />
              )}
              <h3 className="font-semibold">Cargo measurements for station capacity</h3>
              <Field label="Number of items">
                <Input
                  type="number"
                  min="1"
                  max="1000"
                  step="1"
                  required
                  value={measurements.packageCount}
                  onChange={(e) =>
                    setMeasurements({ ...measurements, packageCount: e.target.value })
                  }
                />
              </Field>
              <div className="grid grid-cols-3 gap-2">
                <Field label="Length (cm)">
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    required
                    value={measurements.length}
                    onChange={(e) => setMeasurements({ ...measurements, length: e.target.value })}
                  />
                </Field>
                <Field label="Width (cm)">
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    required
                    value={measurements.width}
                    onChange={(e) => setMeasurements({ ...measurements, width: e.target.value })}
                  />
                </Field>
                <Field label="Height (cm)">
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    required
                    value={measurements.height}
                    onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })}
                  />
                </Field>
              </div>
              <Button block size="lg">
                {t("common.next")}
              </Button>
            </form>
          </Card>
        )}

        {step === "confirm" && option && (
          <div className="space-y-4">
            <Card className="space-y-2">
              <h2 className="text-lg font-semibold">{t("send.review")}</h2>
              <Row k={t("send.from")} v={from?.name} />
              <Row k={t("send.to")} v={to?.name} />
              <Row
                k="Sender handoff"
                v={
                  senderFulfillment === "home_pickup"
                    ? "Home pickup"
                    : points.data?.find((point) => point.id === originCargoPointId)?.name
                }
              />
              <Row
                k="Receiver handoff"
                v={
                  receiverFulfillment === "address_delivery"
                    ? "Address delivery"
                    : points.data?.find((point) => point.id === destinationCargoPointId)?.name
                }
              />
              <Row
                k="Cargo items"
                v={`${measurements.packageCount} · ${measurements.length} × ${measurements.width} × ${measurements.height} cm`}
              />
              <Row k={t("send.category")} v={manual.category} />
              <Row k={t("send.recipientName")} v={`${recipient.name} · ${recipient.phone}`} />
              <Row k={option.label} v={formatRWF(option.price.amount)} strong />
            </Card>
            {!auth.ready ? null : auth.token ? (
              <>
                <Button
                  variant="hero"
                  block
                  size="lg"
                  loading={create.isPending}
                  onClick={() => create.mutate()}
                >
                  {t("send.confirm")}
                </Button>
                {create.error && (
                  <ErrorState error={create.error} onRetry={() => create.mutate()} />
                )}
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">{t("state.signInNeeded")}</p>
                <OtpSignIn area="client" onDone={auth.save} />
              </>
            )}
          </div>
        )}

        {step === "done" && shipment && (
          <Card className="space-y-5 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-success/15 text-success">
              <Check className="size-8" />
            </div>
            <h1 className="text-2xl font-bold">{t("send.created")}</h1>
            <div>
              <p className="text-sm text-muted-foreground">{t("send.trackingCode")}</p>
              <p className="font-display text-3xl font-bold tracking-wider">
                {shipment.trackingCode}
              </p>
            </div>
            {shipment.deliveryCode && (
              <div className="rounded-xl border border-warning/40 bg-warning/10 p-4">
                <p className="text-sm font-semibold">Receiver delivery code</p>
                <p className="font-display text-3xl font-bold tracking-widest">
                  {shipment.deliveryCode}
                </p>
                <p className="text-xs text-muted-foreground">
                  Share only with the receiver. They will also receive it by SMS.
                </p>
              </div>
            )}
            {shipment.paymentUrl && (
              <a
                href={shipment.paymentUrl}
                className={buttonVariants({ variant: "hero", size: "lg", block: true })}
              >
                {t("send.pay")}
              </a>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const url = `${window.location.origin}/track/${shipment.trackingCode}`;
                  if (navigator.share) navigator.share({ title: "Tembera Cargo", url });
                  else navigator.clipboard.writeText(url);
                }}
              >
                <Share2 className="size-4" />
                {t("send.share")}
              </Button>
              <Link
                to="/track/$code"
                params={{ code: shipment.trackingCode }}
                className={buttonVariants({ variant: "subtle" })}
              >
                {t("home.track")}
              </Link>
            </div>
          </Card>
        )}
      </div>
    </ClientShell>
  );
}

function CargoPointSelect({
  label,
  points,
  loading,
  value,
  onChange,
}: {
  label: string;
  points: CargoPoint[];
  loading: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading || points.length === 0}
        className="h-12 w-full rounded-xl border border-input bg-surface px-3"
      >
        <option value="">Choose an active cargo point</option>
        {points.map((point) => (
          <option key={point.id} value={point.id}>
            {point.name} · {point.district}
          </option>
        ))}
      </select>
    </Field>
  );
}

function Row({ k, v, strong }: { k: string; v?: string | undefined; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className={strong ? "font-display text-lg font-bold" : "text-right font-medium"}>
        {v}
      </span>
    </div>
  );
}
