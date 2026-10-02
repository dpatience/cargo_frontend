import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ClientShell } from "@/apps/client/ClientShell";
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

function Profile({ onSignOut }: { onSignOut: () => void }) {
  const { t } = useI18n();
  const q = useQuery({ queryKey: ["me", "client"], queryFn: () => authApi.me("client") });
  return (
    <Card className="space-y-4">
      {q.isPending ? <Skeleton className="h-12" /> : q.error ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> : (
        <div><p className="text-lg font-semibold">{q.data.name ?? q.data.phone}</p><p className="text-sm text-muted-foreground">{q.data.phone ?? q.data.email}</p></div>
      )}
      <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Language</span><LanguageSwitcher /></div>
      <Button variant="outline" block onClick={onSignOut}>{t("common.signOut")}</Button>
    </Card>
  );
}

function Account() {
  const { t } = useI18n();
  const { token, ready, save, clear } = useToken("client");
  return (
    <ClientShell>
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-2xl font-bold">{t("nav.account")}</h1>
        {!ready ? null : token ? <Profile onSignOut={clear} /> : <OtpSignIn area="client" onDone={save} />}
      </div>
    </ClientShell>
  );
}
