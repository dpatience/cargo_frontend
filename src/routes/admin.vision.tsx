import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/packages/ui";

export const Route = createFileRoute("/admin/vision")({ component: Vision });

function Vision() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Cargo vision review</h1>
      <Card className="space-y-2">
        <p className="font-medium">Review is not enabled</p>
        <p className="text-sm text-muted-foreground">
          Cargo vision remains deferred until image consent, retention, provider, and review
          ownership are approved. Staff should use the manual cargo-entry workflow; no image
          submissions or review decisions are accepted by the backend.
        </p>
      </Card>
    </div>
  );
}
