import { useEffect, useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/services";
import { ApiError, tokenStore } from "../api/client";
import type { AppArea } from "../config/env";
import { useI18n } from "../i18n";
import { Button, Card, ErrorState, Field, Input, Logo } from "./index";

export function useToken(area: AppArea) {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setToken(tokenStore.get(area)); setReady(true); }, [area]);
  return {
    token, ready,
    save: (t: string) => { tokenStore.set(area, t); setToken(t); },
    clear: () => { tokenStore.clear(area); setToken(null); },
  };
}

/** Phone + OTP sign-in (client & driver). */
export function OtpSignIn({ area, onDone, title }: { area: AppArea; onDone: (token: string) => void; title?: string }) {
  const { t } = useI18n();
  const [phone, setPhone] = useState("+250");
  const [code, setCode] = useState("");
  const [reqId, setReqId] = useState<string | null>(null);
  const req = useMutation({ mutationFn: () => authApi.requestOtp(area, phone), onSuccess: (r) => setReqId(r.requestId) });
  const ver = useMutation({ mutationFn: () => authApi.verifyOtp(area, reqId!, code), onSuccess: (s) => onDone(s.token) });
  const err = req.error ?? ver.error;
  return (
    <Card className="mx-auto w-full max-w-sm space-y-4">
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      {!reqId ? (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); req.mutate(); }}>
          <Field label={t("common.phone")}><Input type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required /></Field>
          <Button block loading={req.isPending}>{t("common.sendCode")}</Button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); ver.mutate(); }}>
          <Field label={t("common.code")}><Input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} required /></Field>
          <Button block loading={ver.isPending}>{t("common.verify")}</Button>
        </form>
      )}
      {err && (err instanceof ApiError && err.kind === "unconfigured" ? <ErrorState error={err} /> : <p className="text-sm text-destructive">{(err as Error).message}</p>)}
    </Card>
  );
}

/** Email + password sign-in (admin). */
export function PasswordSignIn({ area, onDone }: { area: AppArea; onDone: (token: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const m = useMutation({ mutationFn: () => authApi.login(area, email, password), onSuccess: (s) => onDone(s.token) });
  return (
    <Card className="mx-auto w-full max-w-sm space-y-4">
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); m.mutate(); }}>
        <Field label="Email"><Input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
        <Field label="Password"><Input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Field>
        <Button block loading={m.isPending}>Sign in</Button>
      </form>
      {m.error && (m.error instanceof ApiError && m.error.kind === "unconfigured" ? <ErrorState error={m.error} /> : <p className="text-sm text-destructive">{m.error.message}</p>)}
    </Card>
  );
}

export function AuthGate({ area, children, signIn, label }: { area: AppArea; children: (clear: () => void) => ReactNode; signIn: "otp" | "password"; label: string }) {
  const { token, ready, save, clear } = useToken(area);
  if (!ready) return null;
  if (!token) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-glow px-4">
      <Logo suffix={label} />
      {signIn === "otp" ? <OtpSignIn area={area} onDone={save} /> : <PasswordSignIn area={area} onDone={save} />}
    </div>
  );
  return <>{children(clear)}</>;
}
