import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, LocateFixed, MapPin } from "lucide-react";
import { locationsQuery } from "@/packages/api/services";
import { Location as LocationSchema, type Location } from "@/packages/types";
import { useI18n } from "@/packages/i18n";
import { Button, ErrorState, Field, Input, Skeleton } from "@/packages/ui";

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
  const [text, setText] = useState(value?.source === "pin" ? "" : (value?.name ?? ""));
  const [pinLabel, setPinLabel] = useState(value?.source === "pin" ? value.name : "");
  const [latText, setLatText] = useState(value?.lat?.toString() ?? "");
  const [lngText, setLngText] = useState(value?.lng?.toString() ?? "");
  const [directions, setDirections] = useState(value?.directions ?? "");
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [debounced, setDebounced] = useState(text);
  const [pinDetailsOpen, setPinDetailsOpen] = useState(
    () => typeof value?.lat === "number" && typeof value.lng === "number",
  );
  const selectedId = value?.id;
  const selectedName = value?.name;
  const selectedSource = value?.source;
  const selectedLat = value?.lat;
  const selectedLng = value?.lng;
  const selectedDirections = value?.directions;

  useEffect(() => {
    if (selectedSource === "pin" && selectedId === "pin:manual") return;
    if (!selectedId) return;
    setText(selectedSource === "pin" ? "" : (selectedName ?? ""));
    setPinLabel(selectedSource === "pin" ? (selectedName ?? "") : "");
    setLatText(selectedLat?.toString() ?? "");
    setLngText(selectedLng?.toString() ?? "");
    setDirections(selectedDirections ?? "");
    if (typeof selectedLat === "number" && typeof selectedLng === "number") {
      setPinDetailsOpen(true);
    }
  }, [selectedDirections, selectedId, selectedLat, selectedLng, selectedName, selectedSource]);

  useEffect(() => {
    const h = setTimeout(() => setDebounced(text), 300);
    return () => clearTimeout(h);
  }, [text]);

  const updatePin = (
    nextLabel: string,
    nextLat: string,
    nextLng: string,
    nextDirections: string,
  ) => {
    const lat = Number(nextLat);
    const lng = Number(nextLng);
    if (
      nextLabel.trim() &&
      nextLat.trim() &&
      nextLng.trim() &&
      Number.isFinite(lat) &&
      Number.isFinite(lng)
    ) {
      setText("");
      onChange({
        id: "pin:manual",
        name: nextLabel.trim(),
        lat,
        lng,
        directions: nextDirections.trim() || undefined,
        accuracyM: value?.accuracyM,
        source: "pin",
      });
    } else {
      onChange(null);
    }
  };

  const locateMe = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError(t("send.locationUnavailable"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLat = position.coords.latitude.toFixed(6);
        const nextLng = position.coords.longitude.toFixed(6);
        setLatText(nextLat);
        setLngText(nextLng);
        setPinDetailsOpen(true);
        onChange({
          id: `gps:${nextLat},${nextLng}`,
          name: pinLabel.trim(),
          lat: Number(nextLat),
          lng: Number(nextLng),
          accuracyM: Math.round(position.coords.accuracy),
          directions: directions.trim() || undefined,
          source: "pin",
        });
      },
      () => setGpsError(t("send.locationPermission")),
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
    );
  };

  const q = useQuery({
    ...locationsQuery(debounced),
    enabled: debounced.trim().length >= 2,
  });
  const open = debounced.trim().length >= 2;
  const hasCoordinates = typeof value?.lat === "number" && typeof value.lng === "number";
  return (
    <div className="space-y-3">
      <Field label={label}>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={text}
            placeholder={t("send.searchPlace")}
            className="pl-10"
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </Field>
      {text.trim().length >= 2 && (
        <a
          className="inline-flex text-sm font-medium text-accent underline-offset-4 hover:underline"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noreferrer"
        >
          {t("send.findExactPoint")}
        </a>
      )}
      <Button type="button" variant="subtle" size="sm" block onClick={locateMe}>
        <LocateFixed className="size-4" />
        {t("send.useCurrentLocation")}
      </Button>
      {gpsError && (
        <p role="alert" className="text-sm text-destructive">
          {gpsError}
        </p>
      )}
      <details
        open={pinDetailsOpen}
        onToggle={(event) => setPinDetailsOpen(event.currentTarget.open)}
        className="group rounded-xl border border-border bg-card/70"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3 text-sm font-semibold marker:hidden">
          <span>{hasCoordinates ? t("send.editExactPin") : t("send.enterExactPin")}</span>
          <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
        </summary>
        <div className="space-y-3 border-t border-border p-3">
          <Field label={t("send.pinName")}>
            <Input
              value={pinLabel}
              placeholder={t("send.pinNamePlaceholder")}
              onChange={(event) => {
                const nextLabel = event.target.value;
                setPinLabel(nextLabel);
                updatePin(nextLabel, latText, lngText, directions);
              }}
            />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label={t("send.latitude")}>
              <Input
                inputMode="decimal"
                value={latText}
                placeholder="-1.944100"
                onChange={(event) => {
                  const next = event.target.value;
                  setLatText(next);
                  updatePin(pinLabel, next, lngText, directions);
                }}
              />
            </Field>
            <Field label={t("send.longitude")}>
              <Input
                inputMode="decimal"
                value={lngText}
                placeholder="30.061900"
                onChange={(event) => {
                  const next = event.target.value;
                  setLngText(next);
                  updatePin(pinLabel, latText, next, directions);
                }}
              />
            </Field>
          </div>
          {hasCoordinates && (
            <>
              <Field label={t("send.landmarkDirections")}>
                <Input
                  value={directions}
                  placeholder={t("send.landmarkPlaceholder")}
                  onChange={(event) => {
                    const next = event.target.value;
                    setDirections(next);
                    updatePin(pinLabel, latText, lngText, next);
                  }}
                />
              </Field>
              <div className="rounded-xl border border-border p-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                  <div className="min-w-0">
                    <p className="font-medium">
                      {latText}, {lngText}
                    </p>
                    {value?.accuracyM != null && (
                      <p className="text-muted-foreground">
                        {t("send.gpsAccuracy", { accuracy: value.accuracyM })}
                      </p>
                    )}
                    <a
                      className="text-accent underline"
                      href={`https://www.google.com/maps/search/?api=1&query=${latText},${lngText}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("send.viewOnMap")}
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </details>
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
                    const place = LocationSchema.omit({
                      lat: true,
                      lng: true,
                      accuracyM: true,
                      directions: true,
                    }).parse(l);
                    onChange(place);
                    setText("");
                    setPinLabel("");
                    setLatText("");
                    setLngText("");
                    setDirections("");
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
