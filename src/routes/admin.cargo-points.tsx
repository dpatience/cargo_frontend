import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { adminApi, adminCargoPointsQuery } from "@/packages/api/services";
import { Button, Card, EmptyState, ErrorState, Field, Input, LoadingList } from "@/packages/ui";

export const Route = createFileRoute("/admin/cargo-points")({ component: CargoPoints });

const initialForm = {
  code: "",
  name: "",
  address: "",
  district: "",
  province: "",
  contactName: "",
  contactPhone: "",
  maxItems: "",
  maxWeightKg: "",
  maxVolumeM3: "",
};

function CargoPoints() {
  const queryClient = useQueryClient();
  const points = useQuery(adminCargoPointsQuery());
  const [form, setForm] = useState(initialForm);
  const [operatorPhones, setOperatorPhones] = useState<Record<string, string>>({});
  const create = useMutation({
    mutationFn: () =>
      adminApi.createCargoPoint({
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        address: form.address.trim(),
        district: form.district.trim(),
        province: form.province.trim(),
        contactName: form.contactName.trim() || undefined,
        contactPhone: form.contactPhone.trim() || undefined,
        capacity: {
          maxItems: Number(form.maxItems),
          maxWeightKg: Number(form.maxWeightKg),
          maxVolumeM3: Number(form.maxVolumeM3),
        },
        isActive: false,
      }),
    onSuccess: async () => {
      setForm(initialForm);
      await queryClient.invalidateQueries({ queryKey: ["admin", "cargo-points"] });
    },
  });
  const setActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApi.updateCargoPoint(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "cargo-points"] }),
  });
  const addOperator = useMutation({
    mutationFn: ({ id, phone }: { id: string; phone: string }) =>
      adminApi.provisionCargoPointOperator(id, phone),
    onSuccess: (_user, variables) =>
      setOperatorPhones((current) => ({ ...current, [variables.id]: "" })),
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    create.mutate();
  }

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Cargo points and stations</h1>
        <p className="text-sm text-muted-foreground">
          Register operations-approved stations and their item, weight, and volume limits. New
          points are inactive until contact and operating details are confirmed.
        </p>
      </header>

      <Card>
        <form className="space-y-4" onSubmit={submit}>
          <h2 className="text-lg font-semibold">Register cargo point</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Station code">
              <Input
                required
                minLength={2}
                maxLength={20}
                pattern="[A-Za-z0-9][A-Za-z0-9_-]*"
                value={form.code}
                onChange={(event) => setForm({ ...form, code: event.target.value })}
              />
            </Field>
            <Field label="Station name">
              <Input
                required
                maxLength={120}
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </Field>
            <Field label="Province">
              <Input
                required
                maxLength={100}
                value={form.province}
                onChange={(event) => setForm({ ...form, province: event.target.value })}
              />
            </Field>
            <Field label="District">
              <Input
                required
                maxLength={100}
                value={form.district}
                onChange={(event) => setForm({ ...form, district: event.target.value })}
              />
            </Field>
          </div>
          <Field label="Cargo point address">
            <Input
              required
              maxLength={500}
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Responsible contact">
              <Input
                maxLength={160}
                value={form.contactName}
                onChange={(event) => setForm({ ...form, contactName: event.target.value })}
              />
            </Field>
            <Field label="Contact phone">
              <Input
                type="tel"
                maxLength={16}
                value={form.contactPhone}
                onChange={(event) => setForm({ ...form, contactPhone: event.target.value })}
              />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Maximum items">
              <Input
                required
                type="number"
                min={1}
                step={1}
                value={form.maxItems}
                onChange={(event) => setForm({ ...form, maxItems: event.target.value })}
              />
            </Field>
            <Field label="Maximum weight (kg)">
              <Input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.maxWeightKg}
                onChange={(event) => setForm({ ...form, maxWeightKg: event.target.value })}
              />
            </Field>
            <Field label="Maximum volume (m³)">
              <Input
                required
                type="number"
                min="0.001"
                step="0.001"
                value={form.maxVolumeM3}
                onChange={(event) => setForm({ ...form, maxVolumeM3: event.target.value })}
              />
            </Field>
          </div>
          {create.error && <ErrorState error={create.error} />}
          <Button type="submit" loading={create.isPending}>
            Save inactive cargo point
          </Button>
        </form>
      </Card>

      {(setActive.error || addOperator.error) && <ErrorState error={setActive.error ?? addOperator.error} />}
      {points.isPending ? (
        <LoadingList />
      ) : points.error ? (
        <ErrorState error={points.error} onRetry={() => points.refetch()} />
      ) : points.data.length === 0 ? (
        <EmptyState
          title="No cargo points registered"
          body="Register and verify an operations-approved station before activating it."
        />
      ) : (
        <div className="space-y-3">
          {points.data.map((point) => (
            <Card key={point.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {point.code} · {point.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {point.address}, {point.district}, {point.province}
                </p>
                {point.capacity && (
                  <p className="text-xs text-muted-foreground">
                    Capacity: {point.capacity.maxItems} items · {point.capacity.maxWeightKg} kg ·{" "}
                    {point.capacity.maxVolumeM3} m³
                  </p>
                )}
              </div>
              {point.isActive ? (
                <Button
                  size="sm"
                  variant="outline"
                  loading={setActive.isPending}
                  onClick={() => setActive.mutate({ id: point.id, isActive: false })}
                >
                  Deactivate
                </Button>
              ) : (
                <Button
                  size="sm"
                  loading={setActive.isPending}
                  disabled={!point.contactName || !point.contactPhone}
                  onClick={() => setActive.mutate({ id: point.id, isActive: true })}
                >
                  Activate
                </Button>
              )}
              <form
                className="flex w-full flex-wrap gap-2 border-t border-border pt-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  addOperator.mutate({ id: point.id, phone: operatorPhones[point.id] ?? "" });
                }}
              >
                <Input
                  type="tel"
                  inputMode="tel"
                  autoComplete="off"
                  placeholder="Operator phone"
                  pattern="\+?[0-9 ]{9,15}"
                  required
                  value={operatorPhones[point.id] ?? ""}
                  onChange={(event) =>
                    setOperatorPhones((current) => ({ ...current, [point.id]: event.target.value }))
                  }
                  className="max-w-xs"
                />
                <Button size="sm" variant="outline" loading={addOperator.isPending}>
                  Provision station operator
                </Button>
              </form>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
