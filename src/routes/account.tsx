import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ClientShell } from "@/apps/client/ClientShell";
import { ApiError } from "@/packages/api/client";
import { authApi } from "@/packages/api/services";
import { useI18n } from "@/packages/i18n";
import { OtpSignIn, useToken } from "@/packages/ui/auth";
import { Button, Card, ErrorState, LanguageSwitcher, Skeleton } from "@/packages/ui";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — Tembera Cargo" },
      { name: "description", content: "Manage your Tembera Cargo account, language and sign-in." },
      { property: "og:title", content: "Account — Tembera Cargo" },
      { property: "og:description", content: "Your Tembera Cargo account." },
    ],
  }),
  component: Account,
});

function Profile({ onSignOut }: { onSignOut: () => Promise<void> }) {
  const { t } = useI18n();
  const q = useQuery({ queryKey: ["me", "client"], queryFn: () => authApi.me("client") });
  const signOut = useMutation({ mutationFn: onSignOut });
  return (
    <Card className="space-y-4">
      {q.isPending ? (
        <Skeleton className="h-12" />
      ) : q.error ? (
        <ErrorState error={q.error} onRetry={() => q.refetch()} />
      ) : (
        <div>
          <p className="text-lg font-semibold">{q.data.name ?? q.data.phone}</p>
          <p className="text-sm text-muted-foreground">{q.data.phone ?? q.data.email}</p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Language</span>
        <LanguageSwitcher />
      </div>
      <Button variant="outline" block loading={signOut.isPending} onClick={() => signOut.mutate()}>
        {t("common.signOut")}
      </Button>
      {signOut.error && <p className="text-sm text-destructive">{signOut.error.message}</p>}
    </Card>
  );
}

function Account() {
  const { t } = useI18n();
  const { token, ready, save, clear } = useToken("client");
  const [restoring, setRestoring] = useState(false);
  const [restoreAttempt, setRestoreAttempt] = useState(0);
  const [restoreError, setRestoreError] = useState<Error | null>(null);
  useEffect(() => {
    if (!ready || token) {
      setRestoring(false);
      setRestoreError(null);
      return;
    }
    let active = true;
    setRestoring(true);
    setRestoreError(null);
    authApi
      .refresh("client")
      .then(save)
      .catch((error: unknown) => {
        if (active && !(error instanceof ApiError && error.kind === "unauthorized")) {
          setRestoreError(
            error instanceof Error ? error : new Error("Unable to restore the session."),
          );
        }
      })
      .finally(() => {
        if (active) setRestoring(false);
      });
    return () => {
      active = false;
    };
  }, [ready, token, restoreAttempt, save]);
  return (
    <ClientShell>
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-2xl font-bold">{t("nav.account")}</h1>
        {restoreError ? (
          <ErrorState
            error={restoreError}
            onRetry={() => setRestoreAttempt((attempt) => attempt + 1)}
          />
        ) : !ready || restoring ? null : token ? (
          <Profile onSignOut={clear} />
        ) : (
          <OtpSignIn area="client" onDone={save} />
        )}
      </div>
    </ClientShell>
  );
}
