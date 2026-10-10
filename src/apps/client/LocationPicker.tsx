import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { locationsQuery } from "@/packages/api/services";
import type { Location } from "@/packages/types";
import { useI18n } from "@/packages/i18n";
import { ErrorState, Field, Input, Skeleton } from "@/packages/ui";

export function LocationPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Location | null;
  onChange: (l: Location | null) => void;
}) {
  const { t } = useI18n();
  const [text, setText] = useState(value?.name ?? "");
  const [debounced, setDebounced] = useState(text);
  useEffect(() => {
    const h = setTimeout(() => setDebounced(text), 300);
    return () => clearTimeout(h);
  }, [text]);
  const q = useQuery({
    ...locationsQuery(debounced),
    enabled: !value && debounced.trim().length >= 2,
  });
  const open = !value && debounced.trim().length >= 2;
  return (
    <div className="space-y-2">
      <Field label={label}>
        <Input
          value={text}
          placeholder={t("send.searchPlace")}
          onChange={(e) => {
            setText(e.target.value);
            if (value) onChange(null);
          }}
        />
      </Field>
      {open &&
        (q.isPending ? (
          <Skeleton className="h-12" />
        ) : q.error ? (
          <ErrorState error={q.error} onRetry={() => q.refetch()} />
        ) : (
          <ul className="overflow-hidden rounded-xl border border-border bg-surface">
            {q.data.length === 0 && <li className="p-3 text-sm text-muted-foreground">—</li>}
            {q.data.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(l);
                    setText(l.name);
                  }}
                  className="flex w-full items-center gap-3 p-3 text-left hover:bg-secondary"
                >
                  <MapPin className="size-4 shrink-0 text-accent" />
                  <span>
                    <span className="block font-medium">{l.name}</span>
                    {(l.address || l.district || l.province) && (
                      <span className="text-xs text-muted-foreground">
                        {l.address || [l.district, l.province].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
            {q.data.some((location) => location.source === "google") && (
              <li className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
                Google Maps
              </li>
            )}
          </ul>
        ))}
      {value?.source === "google" && (
        <span className="text-xs text-muted-foreground">Google Maps</span>
      )}
    </div>
  );
}
