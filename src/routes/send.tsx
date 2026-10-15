import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  MapPin,
  Package,
  Route as RouteIcon,
  Share2,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import { ClientShell } from "@/apps/client/ClientShell";
import { LocationPicker } from "@/apps/client/LocationPicker";
import { ApiError } from "@/packages/api/client";
import {
  cargoPointsQuery,
  locationConfirmationsApi,
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
  const [quotedDestination, setQuotedDestination] = useState<Location | null>(null);
  const [locationChangedAfterQuote, setLocationChangedAfterQuote] = useState(false);
  const [option, setOption] = useState<QuoteOption | null>(null);
  const [recipient, setRecipient] = useState({ name: "", phone: "+250", notes: "" });
  const [locationConfirmation, setLocationConfirmation] = useState<{
    token: string;
    expiresAt: string;
  } | null>(null);
  const [confirmationShareError, setConfirmationShareError] = useState<string | null>(null);
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

  const createLocationConfirmation = useMutation({
    mutationFn: () => locationConfirmationsApi.create(recipient.phone),
    onSuccess: (confirmation) => {
      setLocationConfirmation(confirmation);
      setConfirmationShareError(null);
    },
  });
  const confirmationQuery = useQuery({
    queryKey: ["location-confirmation", locationConfirmation?.token],
    queryFn: () => locationConfirmationsApi.get(locationConfirmation!.token),
    enabled: Boolean(locationConfirmation?.token),
    refetchInterval: (query) => (query.state.data?.status === "confirmed" ? false : 5_000),
  });
  const confirmedDestination = useMemo<Location | null>(() => {
    if (confirmationQuery.data?.status !== "confirmed") return null;
    return {
      id: "recipient-confirmed",
      name: confirmationQuery.data.label,
      lat: confirmationQuery.data.lat,
      lng: confirmationQuery.data.lng,
      directions: confirmationQuery.data.directions ?? undefined,
      accuracyM: confirmationQuery.data.accuracyM ?? undefined,
      source: "pin",
    };
  }, [confirmationQuery.data]);
  const quoteDestination = confirmedDestination ?? to;

  useEffect(() => {
    if (confirmedDestination) {
      setConfirmationShareError(null);
    }
  }, [confirmedDestination]);

  const getQuote = useMutation({
    mutationFn: async () => {
      const destination = quoteDestination!;
      const body: QuoteRequest = {
        origin: {
          lat: from!.lat!,
          lng: from!.lng!,
          label: from!.name,
          directions: from!.directions,
          accuracyM: from!.accuracyM,
        },
        destination: {
          lat: destination.lat!,
          lng: destination.lng!,
          label: destination.name,
          directions: destination.directions,
          accuracyM: destination.accuracyM,
        },
        ...(locationConfirmation
          ? {
              destinationConfirmationToken: locationConfirmation.token,
              recipientPhone: recipient.phone,
            }
          : {}),
        manual: {
          category: manual.category,
          weightKg: manual.weightKg ? Number(manual.weightKg) : undefined,
          sizeClass: manual.sizeClass || undefined,
          fragile: manual.fragile,
          description: manual.description || undefined,
        },
      };
      return { quote: await quotesApi.create(body), destination };
    },
    onSuccess: ({ quote: nextQuote, destination }) => {
      setQuote(nextQuote);
      setQuotedDestination(destination);
      setLocationChangedAfterQuote(false);
      setOption(nextQuote.options.find((o) => o.recommended) ?? null);
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
            ...(recipient.notes ? { notes: recipient.notes } : {}),
          },
          packageCount: Number(measurements.packageCount),
          dimensionsCm: {
            length: Number(measurements.length),
            width: Number(measurements.width),
            height: Number(measurements.height),
          },
          senderFulfillment,
          receiverFulfillment,
          ...(senderFulfillment === "station_dropoff" ? { originCargoPointId } : {}),
          ...(receiverFulfillment === "station_collection" ? { destinationCargoPointId } : {}),
        },
        key,
      );
    },
    onSuccess: (s) => {
      setShipment(s);
      setStep("done");
    },
    onError: (error) => {
      if (
        error instanceof ApiError &&
        error.status === 409 &&
        error.message.includes("Recipient confirmed")
      ) {
        setQuote(null);
        setOption(null);
        setQuotedDestination(null);
        setLocationChangedAfterQuote(true);
        setIdempotencyKey(null);
        setStep("cargo");
      }
    },
  });

  const idx = step === "done" ? steps.length : steps.indexOf(step);
  const back = () => idx > 0 && setStep(steps[idx - 1]!);
  const locationsReady = [from, to].every(
    (location) =>
      !location ||
      Boolean(
        location.name.trim() &&
        typeof location.lat === "number" &&
        typeof location.lng === "number",
      ),
  );
  const routeReady =
    Boolean(from && locationsReady && (to || locationConfirmation)) &&
    typeof from?.lat === "number" &&
    typeof from.lng === "number";
  const quoteReady = Boolean(
    from &&
    quoteDestination &&
    typeof from.lat === "number" &&
    typeof from.lng === "number" &&
    typeof quoteDestination.lat === "number" &&
    typeof quoteDestination.lng === "number",
  );

  useEffect(() => {
    if (
      !quote ||
      !quotedDestination ||
      !confirmedDestination ||
      (quotedDestination.lat === confirmedDestination.lat &&
        quotedDestination.lng === confirmedDestination.lng &&
        quotedDestination.name === confirmedDestination.name &&
        quotedDestination.directions === confirmedDestination.directions)
    ) {
      return;
    }

    setQuote(null);
    setOption(null);
    setQuotedDestination(null);
    setLocationChangedAfterQuote(true);
    setStep("cargo");
  }, [confirmedDestination, quote, quotedDestination]);

  const shareLocationConfirmation = async () => {
    if (!locationConfirmation) return;
    const url = `${window.location.origin}/confirm-location#${locationConfirmation.token}`;
    setConfirmationShareError(null);
    try {
      if (navigator.share) {
        await navigator.share({ title: t("send.confirmLocation"), url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setConfirmationShareError(t("send.locationShareError"));
    }
  };
  const updateRecipientPhone = (phone: string) => {
    const confirmedPinWasQuoted = quotedDestination?.id === "recipient-confirmed";
    setRecipient({ ...recipient, phone });
    setLocationConfirmation(null);
    createLocationConfirmation.reset();
    if (confirmedPinWasQuoted) {
      setQuote(null);
      setOption(null);
      setQuotedDestination(null);
      setLocationChangedAfterQuote(true);
      setStep("cargo");
    }
  };
  const stepIcons = [MapPin, Package, RouteIcon, UserRound, CheckCircle2];
  const stepHeadings: Record<Exclude<Step, "done">, string> = {
    route: t("send.pathTitle.route"),
    cargo: t("send.pathTitle.cargo"),
    price: t("send.pathTitle.price"),
    recipient: t("send.pathTitle.recipient"),
    confirm: t("send.pathTitle.confirm"),
  };
  const stepDescriptions: Record<Exclude<Step, "done">, string> = {
    route: t("send.pathDescription.route"),
    cargo: t("send.pathDescription.cargo"),
    price: t("send.pathDescription.price"),
    recipient: t("send.pathDescription.recipient"),
    confirm: t("send.pathDescription.confirm"),
  };

  return (
    <ClientShell>
      <div className="mx-auto max-w-4xl space-y-5">
        {step !== "done" && (
          <>
            <section className="relative overflow-hidden rounded-3xl border border-border bg-glow p-5 shadow-card sm:p-7">
              <div className="relative">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {idx > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={back}
                        aria-label={t("common.back")}
                        className="size-9 p-0"
                      >
                        <ArrowLeft className="size-4" />
                      </Button>
                    )}
                    <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-accent">
                      {t("send.pathKicker")}
                    </span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                    {t("send.pathStepCount", { current: idx + 1, total: steps.length })}
                  </span>
                </div>
                <h1 className="font-display text-2xl font-bold sm:text-3xl">
                  {stepHeadings[step]}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  {stepDescriptions[step]}
                </p>
              </div>
            </section>

            <nav
              aria-label={t("send.pathProgress")}
              className="overflow-x-auto rounded-2xl border border-border bg-card p-3 shadow-card sm:p-4"
            >
              <ol className="grid min-w-[590px] grid-cols-5 gap-2 sm:min-w-0">
                {steps.map((s, i) => {
                  const Icon = stepIcons[i]!;
                  const complete = i < idx;
                  const active = i === idx;
                  return (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => complete && setStep(s)}
                        disabled={!complete}
                        aria-current={active ? "step" : undefined}
                        className={cn(
                          "group flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors sm:px-3",
                          active && "bg-accent/10",
                          complete && "cursor-pointer hover:bg-secondary",
                          !complete && !active && "cursor-default",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-full border",
                            complete && "border-success bg-success text-success-foreground",
                            active && "border-accent bg-accent text-accent-foreground",
                            !complete &&
                              !active &&
                              "border-border bg-secondary text-muted-foreground",
                          )}
                        >
                          {complete ? <Check className="size-4" /> : <Icon className="size-4" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
                            {t("send.pathStepCount", { current: i + 1, total: steps.length })}
                          </span>
                          <span
                            className={cn(
                              "block truncate text-xs font-semibold sm:text-sm",
                              active ? "text-foreground" : "text-muted-foreground",
                            )}
                          >
                            {t(`send.step.${s}`)}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </>
        )}

        {step === "route" && (
          <Card className="space-y-5 p-4 sm:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <LocationPanel icon={MapPin} eyebrow={t("send.from")} value={from} tone="accent">
                <LocationPicker label={t("send.from")} value={from} onChange={setFrom} />
              </LocationPanel>
              <LocationPanel
                icon={MapPin}
                eyebrow={t("send.to")}
                value={confirmedDestination ?? to}
                tone="success"
              >
                <LocationPicker
                  label={t("send.to")}
                  value={confirmedDestination ?? to}
                  onChange={setTo}
                />
              </LocationPanel>
            </div>

            <div className="rounded-2xl border border-border bg-surface/70 p-4 sm:p-5">
              <div className="mb-4 flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                  <UserRound className="size-5" />
                </span>
                <div>
                  <h2 className="font-semibold">{t("send.recipientLocationTitle")}</h2>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {t("send.recipientLocationDescription")}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-start">
                <Field label={t("send.recipientPhone")}>
                  <Input
                    type="tel"
                    value={recipient.phone}
                    onChange={(e) => updateRecipientPhone(e.target.value)}
                    required
                    pattern="\+?[0-9 ]{9,15}"
                    autoComplete="tel"
                  />
                </Field>
                {auth.token ? (
                  <div className="rounded-xl border border-border bg-card p-3">
                    {!locationConfirmation ? (
                      <div className="space-y-2">
                        <Button
                          type="button"
                          variant="outline"
                          block
                          loading={createLocationConfirmation.isPending}
                          onClick={() => createLocationConfirmation.mutate()}
                        >
                          <Share2 className="size-4" />
                          {t("send.requestRecipientPin")}
                        </Button>
                        <p className="text-xs leading-5 text-muted-foreground">
                          {t("send.recipientLinkHint")}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="flex items-start gap-2 text-sm leading-5">
                          {confirmationQuery.data?.status === "confirmed" ? (
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                          ) : (
                            <Circle className="mt-0.5 size-4 shrink-0 text-accent" />
                          )}
                          {confirmationQuery.data?.status === "confirmed"
                            ? t("send.recipientPinConfirmed")
                            : t("send.waitingRecipientPin")}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          block
                          size="sm"
                          onClick={shareLocationConfirmation}
                        >
                          <Share2 className="size-4" />
                          {t("send.shareLocationLink")}
                        </Button>
                      </div>
                    )}
                    {(createLocationConfirmation.error || confirmationQuery.error) && (
                      <div className="mt-3">
                        <ErrorState
                          error={createLocationConfirmation.error ?? confirmationQuery.error}
                          onRetry={() =>
                            locationConfirmation
                              ? void confirmationQuery.refetch()
                              : createLocationConfirmation.mutate()
                          }
                        />
                      </div>
                    )}
                    {confirmationShareError && (
                      <p role="alert" className="mt-2 text-sm text-destructive">
                        {confirmationShareError}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-card p-3">
                    <p className="mb-2 text-sm text-muted-foreground">
                      {t("send.signInForRecipientPin")}
                    </p>
                    {auth.ready && <OtpSignIn area="client" onDone={auth.save} />}
                  </div>
                )}
              </div>
            </div>

            <p className="rounded-xl bg-accent/5 px-4 py-3 text-sm leading-5 text-muted-foreground">
              {t("send.locationHelp")}
            </p>
            <div className="flex justify-end border-t border-border pt-4">
              <Button size="lg" disabled={!routeReady} onClick={() => setStep("cargo")}>
                {t("common.next")}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </Card>
        )}

        {step === "cargo" && (
          <Card className="p-4 sm:p-6">
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (!quoteReady) return;
                getQuote.mutate();
              }}
            >
              <section className="space-y-4">
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Package className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-semibold">{t("send.cargoDetailsTitle")}</h2>
                    <p className="text-sm text-muted-foreground">
                      {t("send.cargoDetailsDescription")}
                    </p>
                  </div>
                </div>
                <Field label={t("send.category")}>
                  <Input
                    value={manual.category}
                    placeholder={t("send.categoryPlaceholder")}
                    onChange={(e) => setManual({ ...manual, category: e.target.value })}
                    required
                  />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
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
                      className="h-12 w-full rounded-xl border border-input bg-surface px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">{t("send.chooseSize")}</option>
                      <option value="small">{t("send.size.small")}</option>
                      <option value="medium">{t("send.size.medium")}</option>
                      <option value="large">{t("send.size.large")}</option>
                      <option value="xlarge">{t("send.size.xlarge")}</option>
                    </select>
                  </Field>
                </div>
                <Field label={t("send.description")}>
                  <Input
                    value={manual.description}
                    placeholder={t("send.descriptionPlaceholder")}
                    onChange={(e) => setManual({ ...manual, description: e.target.value })}
                  />
                </Field>
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
                    manual.fragile
                      ? "border-warning/50 bg-warning/10"
                      : "border-border bg-surface/60 hover:bg-secondary/60",
                  )}
                >
                  <input
                    type="checkbox"
                    className="size-5 accent-[var(--accent)]"
                    checked={manual.fragile}
                    onChange={(e) => setManual({ ...manual, fragile: e.target.checked })}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{t("send.fragile")}</span>
                    <span className="block text-xs text-muted-foreground">
                      {t("send.fragileHint")}
                    </span>
                  </span>
                </label>
              </section>
              {locationChangedAfterQuote && (
                <p
                  role="status"
                  className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm leading-5"
                >
                  {t("send.locationChangedAfterQuote")}
                </p>
              )}
              {getQuote.error && <ErrorState error={getQuote.error} />}
              <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <Button type="button" variant="ghost" onClick={() => setStep("route")}>
                  <ArrowLeft className="size-4" />
                  {t("send.editRoute")}
                </Button>
                <Button size="lg" loading={getQuote.isPending} disabled={!quoteReady}>
                  {t("send.getPrices")}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          </Card>
        )}

        {step === "price" && quote && (
          <Card className="space-y-4 p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-success/10 text-success">
                <CheckCircle2 className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold">{t("send.quoteReadyTitle")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("send.choose")}</p>
              </div>
            </div>
            <div className="space-y-3">
              {quote.options.map((o) => {
                const selected = option?.id === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setOption(o)}
                    className={cn(
                      "w-full rounded-2xl border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-card sm:p-5",
                      selected
                        ? "border-accent bg-accent/5 ring-2 ring-accent/25"
                        : "border-border",
                    )}
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className={cn(
                          "mt-1 grid size-5 shrink-0 place-items-center rounded-full border",
                          selected
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-muted-foreground/50",
                        )}
                      >
                        {selected && <Check className="size-3.5" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{o.label}</span>
                          {o.recommended && (
                            <StatusPill tone="success">{t("send.recommended")}</StatusPill>
                          )}
                        </span>
                        {(o.speed || o.estimatedDelivery) && (
                          <span className="mt-1 block text-sm text-muted-foreground">
                            {[o.speed, o.estimatedDelivery].filter(Boolean).join(" · ")}
                          </span>
                        )}
                        <span className="mt-3 block font-display text-2xl font-bold tabular-nums sm:text-3xl">
                          {formatRWF(o.price.amount)}
                        </span>
                      </span>
                    </span>
                    {selected &&
                      (o.breakdown.length > 0 || o.explanation || o.route.length > 0) && (
                        <span className="mt-4 block space-y-3 border-t border-border pt-4 text-sm">
                          {o.route.length > 0 && (
                            <span className="flex items-start gap-2 rounded-xl bg-surface/80 p-3">
                              <RouteIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                              <span className="font-medium">
                                {o.route.map((r) => r.label).join(" → ")}
                                {o.route.some((route) => route.source === "google") && (
                                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                                    Google Maps
                                  </span>
                                )}
                              </span>
                            </span>
                          )}
                          {o.explanation && (
                            <span className="block text-xs leading-5 text-muted-foreground">
                              {o.explanation}
                            </span>
                          )}
                          {o.breakdown.length > 0 && (
                            <span className="block space-y-2">
                              <span className="block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                                {t("send.priceBreakdown")}
                              </span>
                              {o.breakdown.map((b) => (
                                <span key={b.label} className="flex justify-between gap-3">
                                  <span className="text-muted-foreground">{b.label}</span>
                                  <span className="font-medium tabular-nums">
                                    {formatRWF(b.amount)}
                                  </span>
                                </span>
                              ))}
                            </span>
                          )}
                        </span>
                      )}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="ghost" onClick={() => setStep("cargo")}>
                <ArrowLeft className="size-4" />
                {t("send.editCargo")}
              </Button>
              <Button size="lg" disabled={!option} onClick={() => setStep("recipient")}>
                {t("common.next")}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </Card>
        )}

        {step === "recipient" && (
          <Card className="space-y-5 p-4 sm:p-6">
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setStep("confirm");
              }}
            >
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">
                    <UserRound className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-semibold">{t("send.recipientDetailsTitle")}</h2>
                    <p className="text-sm text-muted-foreground">
                      {t("send.recipientDetailsDescription")}
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
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
                      onChange={(e) => updateRecipientPhone(e.target.value)}
                      required
                      pattern="\+?[0-9 ]{9,15}"
                      autoComplete="tel"
                    />
                  </Field>
                </div>
                <Field label={t("send.notes")}>
                  <Input
                    value={recipient.notes}
                    onChange={(e) => setRecipient({ ...recipient, notes: e.target.value })}
                  />
                </Field>
              </section>

              <section className="space-y-4 border-t border-border pt-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-success/10 text-success">
                    <Truck className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-semibold">{t("send.handoffTitle")}</h2>
                    <p className="text-sm text-muted-foreground">{t("send.handoffDescription")}</p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-3 rounded-2xl border border-border bg-surface/50 p-4">
                    <Field label={t("send.senderHandoff")}>
                      <select
                        value={senderFulfillment}
                        onChange={(e) =>
                          setSenderFulfillment(e.target.value as typeof senderFulfillment)
                        }
                        className="h-12 w-full rounded-xl border border-input bg-surface px-3"
                      >
                        <option value="home_pickup">{t("send.homePickup")}</option>
                        <option value="station_dropoff">{t("send.stationDropoff")}</option>
                      </select>
                    </Field>
                    {senderFulfillment === "station_dropoff" && (
                      <CargoPointSelect
                        label={t("send.originCargoPoint")}
                        points={points.data ?? []}
                        loading={points.isPending}
                        value={originCargoPointId}
                        onChange={setOriginCargoPointId}
                      />
                    )}
                  </div>
                  <div className="space-y-3 rounded-2xl border border-border bg-surface/50 p-4">
                    <Field label={t("send.receiverHandoff")}>
                      <select
                        value={receiverFulfillment}
                        onChange={(e) =>
                          setReceiverFulfillment(e.target.value as typeof receiverFulfillment)
                        }
                        className="h-12 w-full rounded-xl border border-input bg-surface px-3"
                      >
                        <option value="address_delivery">{t("send.addressDelivery")}</option>
                        <option value="station_collection">{t("send.stationCollection")}</option>
                      </select>
                    </Field>
                    {receiverFulfillment === "station_collection" && (
                      <CargoPointSelect
                        label={t("send.destinationCargoPoint")}
                        points={points.data ?? []}
                        loading={points.isPending}
                        value={destinationCargoPointId}
                        onChange={setDestinationCargoPointId}
                      />
                    )}
                  </div>
                </div>
              </section>

              <section className="space-y-4 border-t border-border pt-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-warning/10 text-warning">
                    <Package className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-semibold">{t("send.measurementsTitle")}</h2>
                    <p className="text-sm text-muted-foreground">
                      {t("send.measurementsDescription")}
                    </p>
                  </div>
                </div>
                <Field label={t("send.packageCount")}>
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
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {(["length", "width", "height"] as const).map((dimension) => (
                    <Field key={dimension} label={t(`send.${dimension}`)}>
                      <Input
                        type="number"
                        min="0.1"
                        step="0.1"
                        required
                        value={measurements[dimension]}
                        onChange={(e) =>
                          setMeasurements({ ...measurements, [dimension]: e.target.value })
                        }
                      />
                    </Field>
                  ))}
                </div>
              </section>

              <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <Button type="button" variant="ghost" onClick={() => setStep("price")}>
                  <ArrowLeft className="size-4" />
                  {t("send.editPrice")}
                </Button>
                <Button size="lg">
                  {t("common.next")}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          </Card>
        )}

        {step === "confirm" && option && (
          <div className="space-y-4">
            <Card className="space-y-5 p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                  <ShieldCheck className="size-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold">{t("send.review")}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("send.reviewDescription")}
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <LocationSummary icon={MapPin} label={t("send.from")} value={from} tone="accent" />
                <LocationSummary
                  icon={MapPin}
                  label={t("send.to")}
                  value={quoteDestination}
                  tone="success"
                />
              </div>
              <section className="space-y-1 rounded-xl bg-surface/70 px-4 py-2">
                <Row
                  k={t("send.senderHandoff")}
                  v={
                    senderFulfillment === "home_pickup"
                      ? t("send.homePickup")
                      : points.data?.find((point) => point.id === originCargoPointId)?.name
                  }
                />
                <Row
                  k={t("send.receiverHandoff")}
                  v={
                    receiverFulfillment === "address_delivery"
                      ? t("send.addressDelivery")
                      : points.data?.find((point) => point.id === destinationCargoPointId)?.name
                  }
                />
                <Row
                  k={t("send.packageCount")}
                  v={`${measurements.packageCount} · ${measurements.length} × ${measurements.width} × ${measurements.height} cm`}
                />
                <Row k={t("send.category")} v={manual.category} />
                <Row k={t("send.recipientName")} v={`${recipient.name} · ${recipient.phone}`} />
                {recipient.notes && <Row k={t("send.notes")} v={recipient.notes} />}
              </section>
              <div className="flex items-center justify-between gap-4 rounded-xl border border-accent/20 bg-accent/5 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("send.selectedOption")}</p>
                  <p className="font-semibold">{option.label}</p>
                </div>
                <p className="font-display text-2xl font-bold tabular-nums">
                  {formatRWF(option.price.amount)}
                </p>
              </div>
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
          <Card className="space-y-5 p-5 text-center sm:p-8">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-success/15 text-success">
              <CheckCircle2 className="size-9" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">{t("send.created")}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{t("send.createdDescription")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("send.trackingCode")}</p>
              <p className="mt-1 font-display text-3xl font-bold tracking-wider">
                {shipment.trackingCode}
              </p>
            </div>
            {shipment.deliveryCode && (
              <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-left">
                <p className="text-sm font-semibold">{t("send.receiverDeliveryCode")}</p>
                <p className="font-display text-3xl font-bold tracking-widest">
                  {shipment.deliveryCode}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("send.receiverDeliveryCodeHint")}
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
                  if (navigator.share) void navigator.share({ title: "Tembera Cargo", url });
                  else void navigator.clipboard.writeText(url);
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

function LocationPanel({
  icon: Icon,
  eyebrow,
  value,
  tone,
  children,
}: {
  icon: typeof MapPin;
  eyebrow: string;
  value: Location | null;
  tone: "accent" | "success";
  children: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <section className="min-w-0 rounded-2xl border border-border bg-surface/50 p-4 sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl",
            tone === "accent" ? "bg-accent/10 text-accent" : "bg-success/10 text-success",
          )}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {eyebrow}
          </p>
          <p className="truncate font-semibold">{value?.name || t("send.locationNotSelected")}</p>
          {value && typeof value.lat === "number" && typeof value.lng === "number" && (
            <p className="mt-1 truncate text-xs tabular-nums text-muted-foreground">
              {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
            </p>
          )}
        </div>
      </div>
      {children}
      {value?.directions && (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-card px-3 py-2 text-xs leading-5 text-muted-foreground">
          <RouteIcon className="mt-0.5 size-3.5 shrink-0 text-accent" />
          <span>{value.directions}</span>
        </p>
      )}
    </section>
  );
}

function LocationSummary({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof MapPin;
  label: string;
  value: Location | null;
  tone: "accent" | "success";
}) {
  const { t } = useI18n();
  return (
    <div className="min-w-0 rounded-xl border border-border bg-surface/60 p-3">
      <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <Icon className={cn("size-4", tone === "accent" ? "text-accent" : "text-success")} />
        {label}
      </p>
      <p className="break-words text-sm font-semibold">
        {value?.name || t("send.locationNotSelected")}
      </p>
      {value && typeof value.lat === "number" && typeof value.lng === "number" && (
        <p className="mt-1 text-xs tabular-nums text-muted-foreground">
          {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
        </p>
      )}
      {value?.directions && (
        <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
          {value.directions}
        </p>
      )}
    </div>
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
  const { t } = useI18n();
  return (
    <Field label={label}>
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading || points.length === 0}
        className="h-12 w-full rounded-xl border border-input bg-surface px-3"
      >
        <option value="">{t("send.chooseCargoPoint")}</option>
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
