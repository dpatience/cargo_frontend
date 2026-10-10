import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Check, ChevronLeft, Phone } from "lucide-react";
import { driverApi, driverJobQuery } from "@/packages/api/services";
import {
  Button,
  buttonVariants,
  Card,
  ErrorState,
  Field,
  Input,
  LoadingList,
  StatusPill,
} from "@/packages/ui";

export const Route = createFileRoute("/driver/jobs/$id")({ component: JobPage });

function JobPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const q = useQuery(driverJobQuery(id));
  const [tagCode, setTagCode] = useState("");
  const [deliveryCode, setDeliveryCode] = useState("");
  const [scanKey, setScanKey] = useState(() => crypto.randomUUID());
  const scan = useMutation({
    mutationFn: () => driverApi.scanTag(id, tagCode.trim(), deliveryCode || undefined, scanKey),
    onSuccess: async () => {
      setScanKey(crypto.randomUUID());
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["driver", "jobs"] }),
        qc.invalidateQueries({ queryKey: ["driver", "jobs", id] }),
      ]);
    },
  });

  if (q.isPending) return <LoadingList rows={2} />;
  if (q.error) return <ErrorState error={q.error} onRetry={() => q.refetch()} />;
  const job = q.data;

  return (
    <div className="space-y-4">
      <Link to="/driver" className={buttonVariants({ variant: "ghost", size: "sm" })}>
        <ChevronLeft className="size-4" />
        Jobs
      </Link>
      <Card className="space-y-2">
        <div className="flex items-center gap-2">
          <StatusPill>{job.type}</StatusPill>
          <span className="text-sm text-muted-foreground">{job.trackingCode} · {job.status}</span>
        </div>
        <p className="text-xl font-bold">{job.address}</p>
        {job.cargoSummary && <p className="text-muted-foreground">{job.cargoSummary}</p>}
        {job.contactPhone && (
          <a
            href={`tel:${job.contactPhone}`}
            className={buttonVariants({ variant: "subtle", block: true })}
          >
            <Phone className="size-4" />
            {job.contactName ?? job.contactPhone}
          </a>
        )}
      </Card>

      {scan.isSuccess ? (
        <Card className="text-center">
          <Check className="mx-auto mb-2 size-10 text-success" />
          <p className="font-semibold">Custody scan confirmed</p>
        </Card>
      ) : (
        <Card>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              scan.mutate();
            }}
          >
            <h2 className="text-lg font-semibold">
              {job.type === "delivery" ? "Verify final delivery" : `Confirm ${job.type}`}
            </h2>
            <p className="text-sm text-muted-foreground">
              Scan or enter the code printed on the cargo tag. Cargo photos are not collected.
            </p>
            <Field label="Cargo tag / tracking code">
              <Input
                autoComplete="off"
                value={tagCode}
                onChange={(event) => setTagCode(event.target.value.toUpperCase())}
                required
              />
            </Field>
            {job.type === "delivery" && (
              <Field label="Receiver delivery code">
                <Input
                  inputMode="numeric"
                  autoComplete="off"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={deliveryCode}
                  onChange={(event) => setDeliveryCode(event.target.value.replace(/\D/g, ""))}
                  required
                />
              </Field>
            )}
            <Button variant="success" size="lg" block loading={scan.isPending}>
              Record custody scan
            </Button>
            {scan.error && <ErrorState error={scan.error} />}
          </form>
        </Card>
      )}
    </div>
  );
}
