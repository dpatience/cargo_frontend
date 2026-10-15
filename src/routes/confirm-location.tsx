import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LocateFixed } from "lucide-react";
import { locationConfirmationsApi } from "@/packages/api/services";
import { useI18n } from "@/packages/i18n";
import { Button, Card, ErrorState, Field, Input } from "@/packages/ui";

export const Route = createFileRoute("/confirm-location")({
  head: () => ({
    meta: [
      { title: "Confirm delivery location — Tembera Cargo" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "referrer", content: "no-referrer" },
    ],
  }),
  component: ConfirmLocation,
});

function ConfirmLocation() {
  const { t } = useI18n();
  const [token, setToken] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [label, setLabel] = useState("");
  const [directions, setDirections] = useState("");
  const [accuracyM, setAccuracyM] = useState<number | undefined>(undefined);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const confirmation = useQuery({
    queryKey: ["location-confirmation", token],
    queryFn: () => locationConfirmationsApi.get(token),
    enabled: Boolean(token),
    retry: false,
  });
  const confirm = useMutation({
    mutationFn: () => {
      const lat = Number(latitude);
      const lng = Number(longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || !label.trim()) {
        throw new Error(t("send.invalidRecipientPin"));
      }

      return locationConfirmationsApi.confirm(token, {
        lat,
        lng,
        label: label.trim(),
        ...(directions.trim() ? { directions: directions.trim() } : {}),
        ...(accuracyM !== undefined ? { accuracyM } : {}),
      });
    },
    onSuccess: () => confirmation.refetch(),
  });

  const useCurrentLocation = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError(t("send.locationUnavailable"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setAccuracyM(Math.round(position.coords.accuracy));
      },
      () => setGpsError(t("send.locationPermission")),
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
    );
  };

  useEffect(() => {
    setToken(window.location.hash.slice(1));
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-8">
      <Card className="w-full space-y-4">
        <h1 className="text-2xl font-bold">{t("send.confirmLocation")}</h1>
        <p className="text-sm text-muted-foreground">{t("send.confirmLocationHelp")}</p>
        {!token ? (
          <p role="status">{t("send.openSecureLink")}</p>
        ) : confirmation.isPending ? (
          <p role="status">{t("common.loading")}</p>
        ) : null}
        {token && confirmation.error && <ErrorState error={confirmation.error} />}
        {confirmation.data?.status === "confirmed" ? (
          <p role="status" className="rounded-xl bg-success/10 p-4 text-success">
            {t("send.locationAlreadyConfirmed")}
          </p>
        ) : confirmation.data ? (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              confirm.mutate();
            }}
          >
            <Button type="button" variant="outline" block onClick={useCurrentLocation}>
              <LocateFixed className="size-4" />
              {t("send.useCurrentLocation")}
            </Button>
            {gpsError && (
              <p role="alert" className="text-sm text-destructive">
                {gpsError}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("send.latitude")}>
                <Input
                  inputMode="decimal"
                  value={latitude}
                  onChange={(event) => setLatitude(event.target.value)}
                  required
                />
              </Field>
              <Field label={t("send.longitude")}>
                <Input
                  inputMode="decimal"
                  value={longitude}
                  onChange={(event) => setLongitude(event.target.value)}
                  required
                />
              </Field>
            </div>
            <Field label={t("send.pinName")}>
              <Input
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                maxLength={160}
                required
              />
            </Field>
            <Field label={t("send.landmarkDirections")}>
              <Input
                value={directions}
                onChange={(event) => setDirections(event.target.value)}
                maxLength={500}
                placeholder={t("send.landmarkPlaceholder")}
              />
            </Field>
            {accuracyM !== undefined && (
              <p className="text-sm text-muted-foreground">
                {t("send.gpsAccuracy", { accuracy: accuracyM })}
              </p>
            )}
            <Button block size="lg" loading={confirm.isPending}>
              {t("send.confirmRecipientPin")}
            </Button>
            {confirm.error && <ErrorState error={confirm.error} />}
          </form>
        ) : null}
      </Card>
    </main>
  );
}
