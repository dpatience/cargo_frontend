import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Camera, Check, ChevronLeft, Phone } from "lucide-react";
import { driverApi, driverJobQuery } from "@/packages/api/services";
import { Button, buttonVariants, Card, ErrorState, Field, Input, LoadingList, StatusPill } from "@/packages/ui";

export const Route = createFileRoute("/driver/jobs/$id")({ component: JobPage });

function JobPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const q = useQuery(driverJobQuery(id));
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const done = () => qc.invalidateQueries({ queryKey: ["driver", "jobs"] });
  const handoff = useMutation({ mutationFn: () => driverApi.confirmHandoff(id, code), onSuccess: done });
  const pod = useMutation({ mutationFn: () => driverApi.submitProof(id, { photo: photo ?? undefined, recipientCode: code, recipientName: name }), onSuccess: done });

  if (q.isPending) return <LoadingList rows={2} />;
  if (q.error) return <ErrorState error={q.error} onRetry={() => q.refetch()} />;
  const j = q.data;
  const success = handoff.isSuccess || pod.isSuccess;

  return (
    <div className="space-y-4">
      <Link to="/driver" className={buttonVariants({ variant: "ghost", size: "sm" })}><ChevronLeft className="size-4" />Jobs</Link>
      <Card className="space-y-2">
        <div className="flex items-center gap-2"><StatusPill>{j.type}</StatusPill><span className="text-sm text-muted-foreground">{j.trackingCode} · {j.status}</span></div>
        <p className="text-xl font-bold">{j.address}</p>
        {j.cargoSummary && <p className="text-muted-foreground">{j.cargoSummary}</p>}
        {j.contactPhone && <a href={`tel:${j.contactPhone}`} className={buttonVariants({ variant: "subtle", block: true })}><Phone className="size-4" />{j.contactName ?? j.contactPhone}</a>}
      </Card>

      {success ? (
        <Card className="text-center"><Check className="mx-auto mb-2 size-10 text-success" /><p className="font-semibold">Confirmed</p></Card>
      ) : j.type === "delivery" ? (
        <Card>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); pod.mutate(); }}>
            <h2 className="text-lg font-semibold">Proof of delivery</h2>
            <Field label="Recipient name"><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
            <Field label="Recipient confirmation code"><Input inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} required /></Field>
            <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border font-semibold">
              <Camera className="size-5" />{photo ? photo.name : "Photo of delivered cargo"}
              <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
            </label>
            <Button variant="success" size="lg" block loading={pod.isPending}>Confirm delivery</Button>
            {pod.error && <ErrorState error={pod.error} />}
          </form>
        </Card>
      ) : (
        <Card>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handoff.mutate(); }}>
            <h2 className="text-lg font-semibold">{j.type === "pickup" ? "Confirm pickup" : "Confirm handoff"}</h2>
            <Field label="Cargo / handoff code"><Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required /></Field>
            <Button variant="success" size="lg" block loading={handoff.isPending}>Confirm</Button>
            {handoff.error && <ErrorState error={handoff.error} />}
          </form>
        </Card>
      )}
    </div>
  );
}
