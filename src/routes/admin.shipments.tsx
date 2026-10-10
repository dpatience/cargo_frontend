import { createFileRoute } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { adminShipmentsQuery } from "@/packages/api/services";
import { formatDate, formatRWF } from "@/packages/i18n";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
  LoadingList,
  StatusPill,
} from "@/packages/ui";

export const Route = createFileRoute("/admin/shipments")({ component: AdminShipments });

function AdminShipments() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const r = useQuery({
    ...adminShipmentsQuery({ q, status, page }),
    placeholderData: keepPreviousData,
  });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Shipments</h1>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Search tracking code, phone, name"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
        <Input
          placeholder="Status filter"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-48"
        />
      </div>
      {r.isPending ? (
        <LoadingList />
      ) : r.error ? (
        <ErrorState error={r.error} onRetry={() => r.refetch()} />
      ) : r.data.items.length === 0 ? (
        <EmptyState title="No shipments match" />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b border-border">
                {["Code", "Route", "Recipient", "Price", "Created", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {r.data.items.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/50"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold">{s.trackingCode}</p>
                    <p className="font-mono text-xs text-muted-foreground">{s.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    {s.origin} → {s.destination}
                  </td>
                  <td className="px-4 py-3">{s.recipientName ?? "—"}</td>
                  <td className="px-4 py-3">{s.price ? formatRWF(s.price.amount) : "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(s.createdAt)}</td>
                  <td className="px-4 py-3">
                    <StatusPill>{s.statusLabel ?? s.status}</StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {r.data && r.data.total > r.data.pageSize && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {Math.ceil(r.data.total / r.data.pageSize)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page * r.data.pageSize >= r.data.total}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
