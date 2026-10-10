import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { adminApi, adminPricingAuditQuery, adminPricingQuery } from "@/packages/api/services";
import { formatDate } from "@/packages/i18n";
import type { TariffVersion } from "@/packages/types";
import { Button, Card, EmptyState, ErrorState, Field, Input, LoadingList } from "@/packages/ui";

export const Route = createFileRoute("/admin/pricing")({ component: Pricing });

type TariffDraft = {
  name: string;
  baseFeeRwf: string;
  perKgRwf: string;
  perKmRwf: string;
  fragileSurchargeRwf: string;
  sizeRatesRwf: string;
};

const emptyDraft: TariffDraft = {
  name: "Unapproved placeholder",
  baseFeeRwf: "0",
  perKgRwf: "0",
  perKmRwf: "0",
  fragileSurchargeRwf: "0",
  sizeRatesRwf: '{\n  "small": 0,\n  "medium": 0,\n  "large": 0,\n  "xlarge": 0\n}',
};

function parseSizeRates(value: string): Record<string, number> {
  const parsed: unknown = JSON.parse(value);
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    Array.isArray(parsed) ||
    Object.keys(parsed).length === 0 ||
    !Object.entries(parsed).every(
      ([key, amount]) =>
        key.trim().length > 0 &&
        key.length <= 40 &&
        Number.isSafeInteger(amount) &&
        typeof amount === "number" &&
        amount >= 0,
    )
  ) {
    throw new Error("Size rates must be a non-empty JSON object of nonnegative whole RWF amounts.");
  }
  return Object.fromEntries(Object.entries(parsed).map(([key, amount]) => [key, amount]));
}

function TariffCard({
  tariff,
  onActivate,
  busy,
}: {
  tariff: TariffVersion;
  onActivate: (id: string) => void;
  busy: boolean;
}) {
  return (
    <Card className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">
            v{tariff.version} · {tariff.name}
          </p>
          <p className="text-sm capitalize text-muted-foreground">{tariff.status}</p>
        </div>
        {tariff.status === "draft" && (
          <Button
            size="sm"
            loading={busy}
            onClick={() => {
              if (
                window.confirm(
                  `Activate tariff v${tariff.version}? It will replace the current active tariff.`,
                )
              ) {
                onActivate(tariff.id);
              }
            }}
          >
            Activate
          </Button>
        )}
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
        <Rate label="Base fee" value={tariff.baseFeeRwf} />
        <Rate label="Per kg" value={tariff.perKgRwf} />
        <Rate label="Per km" value={tariff.perKmRwf} />
        <Rate label="Fragile surcharge" value={tariff.fragileSurchargeRwf} />
        {Object.entries(tariff.sizeRatesRwf).map(([size, amount]) => (
          <Rate key={size} label={`Size: ${size}`} value={amount} />
        ))}
      </dl>
    </Card>
  );
}

function Rate({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value.toLocaleString()} RWF</dd>
    </div>
  );
}

function Pricing() {
  const queryClient = useQueryClient();
  const query = useQuery(adminPricingQuery());
  const audit = useQuery(adminPricingAuditQuery());
  const [draft, setDraft] = useState(emptyDraft);
  const [formError, setFormError] = useState<string | null>(null);
  const create = useMutation({
    mutationFn: () =>
      adminApi.createTariff({
        name: draft.name.trim(),
        baseFeeRwf: Number(draft.baseFeeRwf),
        perKgRwf: Number(draft.perKgRwf),
        perKmRwf: Number(draft.perKmRwf),
        fragileSurchargeRwf: Number(draft.fragileSurchargeRwf),
        sizeRatesRwf: parseSizeRates(draft.sizeRatesRwf),
      }),
    onSuccess: async () => {
      setDraft(emptyDraft);
      setFormError(null);
      await queryClient.invalidateQueries({ queryKey: ["admin", "pricing", "tariffs"] });
    },
  });
  const activate = useMutation({
    mutationFn: adminApi.activateTariff,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "pricing", "tariffs"] }),
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    try {
      const sizeRatesRwf = parseSizeRates(draft.sizeRatesRwf);
      const amounts = [
        draft.baseFeeRwf,
        draft.perKgRwf,
        draft.perKmRwf,
        draft.fragileSurchargeRwf,
        ...Object.values(sizeRatesRwf).map(String),
      ];
      if (
        !draft.name.trim() ||
        amounts.some((amount) => !/^\d+$/.test(amount) || !Number.isSafeInteger(Number(amount)))
      ) {
        throw new Error("Enter a tariff name and nonnegative whole RWF amounts.");
      }
      create.mutate();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Invalid tariff values.");
    }
  }

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Tariff versions</h1>
        <p className="text-sm text-muted-foreground">
          Tariffs are versioned and audited. Creating a draft does not enable quotes; only activate
          a tariff after the cargo policy and rates have been approved.
        </p>
        <p className="text-sm font-medium text-warning">
          New form values are zero-rate placeholders, not approved customer prices. Replace them
          with institution-approved fees in a new tariff version before enabling quotes.
        </p>
      </header>

      <Card>
        <form className="space-y-4" onSubmit={submit}>
          <h2 className="text-lg font-semibold">Create draft tariff</h2>
          <Field label="Version name">
            <Input
              required
              maxLength={120}
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["baseFeeRwf", "Base fee (RWF)"],
                ["perKgRwf", "Per kg (RWF)"],
                ["perKmRwf", "Per km (RWF)"],
                ["fragileSurchargeRwf", "Fragile surcharge (RWF)"],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label}>
                <Input
                  required
                  type="number"
                  min={0}
                  step={1}
                  value={draft[key]}
                  onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
                />
              </Field>
            ))}
          </div>
          <Field label="Size-class rates (JSON; each value is a whole RWF amount)">
            <textarea
              required
              value={draft.sizeRatesRwf}
              onChange={(event) => setDraft({ ...draft, sizeRatesRwf: event.target.value })}
              className="min-h-24 w-full rounded-xl border border-input bg-surface p-3 font-mono text-sm"
              placeholder='{"small": 0, "medium": 0}'
            />
          </Field>
          {(formError || create.error) && (
            <p role="alert" className="text-sm text-destructive">
              {formError ?? create.error?.message}
            </p>
          )}
          <Button type="submit" loading={create.isPending}>
            Save draft
          </Button>
        </form>
      </Card>

      {activate.error && <ErrorState error={activate.error} />}
      {query.isPending ? (
        <LoadingList />
      ) : query.error ? (
        <ErrorState error={query.error} onRetry={() => query.refetch()} />
      ) : query.data.length === 0 ? (
        <EmptyState title="No tariff versions defined" />
      ) : (
        <div className="space-y-3">
          {query.data.map((tariff) => (
            <TariffCard
              key={tariff.id}
              tariff={tariff}
              onActivate={(id) => activate.mutate(id)}
              busy={activate.isPending}
            />
          ))}
        </div>
      )}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Pricing change history</h2>
        {audit.isPending ? (
          <LoadingList />
        ) : audit.error ? (
          <ErrorState error={audit.error} onRetry={() => audit.refetch()} />
        ) : audit.data.items.length === 0 ? (
          <EmptyState title="No pricing changes recorded" />
        ) : (
          <Card className="space-y-3">
            {audit.data.items.map((event) => (
              <div
                key={event.id}
                className="flex flex-wrap justify-between gap-2 border-b border-border pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium">{event.action.replaceAll(".", " ")}</p>
                  <p className="text-xs text-muted-foreground">Tariff {event.subjectId}</p>
                </div>
                <time className="text-sm text-muted-foreground">
                  {formatDate(event.occurredAt)}
                </time>
              </div>
            ))}
          </Card>
        )}
      </section>
    </div>
  );
}
