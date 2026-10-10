import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { dispatchApi } from "@/packages/api/services";
import { Button, Card, ErrorState, Field, Input } from "@/packages/ui";

export const Route = createFileRoute("/cargo-point-operator/")({
  component: CustodyDesk,
});

function CustodyDesk() {
  const [trackingCode, setTrackingCode] = useState("");
  const [deliveryCode, setDeliveryCode] = useState("");
  const [action, setAction] = useState<"receive" | "release">("receive");
  const [scanKey, setScanKey] = useState(() => crypto.randomUUID());
  const scan = useMutation({
    mutationFn: () =>
      dispatchApi.scanAtStation(
        { trackingCode: trackingCode.trim().toUpperCase(), action, deliveryCode: deliveryCode || undefined },
        scanKey,
      ),
    onSuccess: () => {
      setTrackingCode("");
      setDeliveryCode("");
      setScanKey(crypto.randomUUID());
    },
  });

  return (
    <Card className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Cargo custody scan</h1>
        <p className="text-sm text-muted-foreground">
          Record each station receipt or release by scanning the cargo tag. No cargo photos are captured.
        </p>
      </div>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          scan.mutate();
        }}
      >
        <Field label="Cargo tag / tracking code">
          <Input
            autoComplete="off"
            value={trackingCode}
            onChange={(event) => setTrackingCode(event.target.value.toUpperCase())}
            required
          />
        </Field>
        <Field label="Station action">
          <select
            value={action}
            onChange={(event) => setAction(event.target.value as typeof action)}
            className="h-12 w-full rounded-xl border border-input bg-surface px-3"
          >
            <option value="receive">Receive into station custody</option>
            <option value="release">Release from station custody</option>
          </select>
        </Field>
        {action === "release" && (
          <Field label="Delivery code (required for receiver station collection)">
            <Input
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={deliveryCode}
              onChange={(event) => setDeliveryCode(event.target.value.replace(/\D/g, ""))}
            />
          </Field>
        )}
        <Button size="lg" block loading={scan.isPending}>Record scan</Button>
      </form>
      {scan.isSuccess && <p role="status" className="text-sm font-semibold text-success">Custody updated.</p>}
      {scan.error && <ErrorState error={scan.error} />}
    </Card>
  );
}
