import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/services";
import { ApiError, tokenStore } from "../api/client";
import type { AppArea } from "../config/env";
import type { SessionResponse } from "../types";
import { useI18n } from "../i18n";
import { Button, Card, ErrorState, Field, Input, Logo } from "./index";

export function useToken(area: AppArea) {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const syncToken = () => setToken(tokenStore.get(area));
    const onAuthCleared = (event: Event) => {
      if ((event as CustomEvent<{ area?: AppArea }>).detail?.area === area) setToken(null);
    };
    syncToken();
    setReady(true);
    window.addEventListener("storage", syncToken);
    window.addEventListener("cargo:auth-cleared", onAuthCleared);
    return () => {
      window.removeEventListener("storage", syncToken);
      window.removeEventListener("cargo:auth-cleared", onAuthCleared);
    };
  }, [area]);
  const save = useCallback(
    (session: SessionResponse) => {
      tokenStore.set(area, session.token, session.expiresInSeconds);
      setToken(session.token);
    },
    [area],
  );
  const clear = useCallback(async () => {
    await authApi.logout(area);
    tokenStore.clear(area);
    setToken(null);
  }, [area]);
  return {
    token,
    ready,
    save,
    clear,
  };
}

/** Phone + OTP sign-in (client & driver). */
export function OtpSignIn({
  area,
  onDone,
  title,
}: {
  area: AppArea;
  onDone: (session: SessionResponse) => void;
  title?: string;
}) {
  const { t } = useI18n();
  const [phone, setPhone] = useState("+250");
  const [code, setCode] = useState("");
  const [reqId, setReqId] = useState<string | null>(null);
  const [deliveryUnconfirmed, setDeliveryUnconfirmed] = useState(false);
  const req = useMutation({
    mutationFn: () => authApi.requestOtp(area, phone),
    onSuccess: (r) => {
      setReqId(r.requestId);
      setDeliveryUnconfirmed(false);
    },
    onError: (error: unknown) => {
      if (
        error instanceof ApiError &&
        error.details !== null &&
        typeof error.details === "object" &&
        "deliveryUnconfirmed" in error.details &&
        error.details.deliveryUnconfirmed === true &&
        "requestId" in error.details &&
        typeof error.details.requestId === "string"
      ) {
        setReqId(error.details.requestId);
        setDeliveryUnconfirmed(true);
      }
    },
  });
  const ver = useMutation({
    mutationFn: () => authApi.verifyOtp(area, reqId!, code),
    onSuccess: onDone,
  });
  const err = ver.error ?? (deliveryUnconfirmed ? null : req.error);
  return (
    <Card className="mx-auto w-full max-w-sm space-y-4">
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      {!reqId ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            req.mutate();
          }}
        >
          <Field label={t("common.phone")}>
            <Input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Field>
          <Button block loading={req.isPending}>
            {t("common.sendCode")}
          </Button>
        </form>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            ver.mutate();
          }}
        >
          <Field label={t("common.code")}>
            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </Field>
          <Button block loading={ver.isPending}>
            {t("common.verify")}
          </Button>
        </form>
      )}
      {reqId &&
        (deliveryUnconfirmed ? (
          <p role="status" className="text-sm text-muted-foreground">
            {t("auth.deliveryUnconfirmed")}
          </p>
        ) : (
          <p role="status" className="text-sm text-success">
            {t("auth.codeSent")}
          </p>
        ))}
      {err &&
        (err instanceof ApiError && err.kind === "unconfigured" ? (
          <ErrorState error={err} />
        ) : (
          <p className="text-sm text-destructive">{(err as Error).message}</p>
        ))}
    </Card>
  );
}

/** Email + password sign-in (admin). */
export function PasswordSignIn({
  area,
  onDone,
}: {
  area: AppArea;
  onDone: (session: SessionResponse) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const m = useMutation({
    mutationFn: () => authApi.login(area, email, password),
    onSuccess: onDone,
  });
  return (
    <Card className="mx-auto w-full max-w-sm space-y-4">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          m.mutate();
        }}
      >
        <Field label="Email">
          <Input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <Button block loading={m.isPending}>
          Sign in
        </Button>
      </form>
      {m.error &&
        (m.error instanceof ApiError && m.error.kind === "unconfigured" ? (
          <ErrorState error={m.error} />
        ) : (
          <p className="text-sm text-destructive">{m.error.message}</p>
        ))}
    </Card>
  );
}

export function AuthGate({
  area,
  children,
  signIn,
  label,
}: {
  area: AppArea;
  children: (clear: () => Promise<void>) => ReactNode;
  signIn: "otp" | "password";
  label: string;
}) {
  const { token, ready, save, clear } = useToken(area);
  const [validationAttempt, setValidationAttempt] = useState(0);
  const [checking, setChecking] = useState(false);
  const [validationError, setValidationError] = useState<Error | null>(null);
  const [signOutError, setSignOutError] = useState<Error | null>(null);
  const signOut = useCallback(async () => {
    setSignOutError(null);
    try {
      await clear();
    } catch (error: unknown) {
      setSignOutError(error instanceof Error ? error : new Error("Unable to revoke the session."));
    }
  }, [clear]);
  useEffect(() => {
    if (!ready) {
      setChecking(false);
      setValidationError(null);
      return;
    }
    let active = true;
    setChecking(true);
    setValidationError(null);
    const validation = token
      ? authApi.me(area).then(() => undefined)
      : authApi.refresh(area).then((session) => save(session));
    validation.then(
      () => {
        if (active) setChecking(false);
      },
      (error: unknown) => {
        if (!active) return;
        if (error instanceof ApiError && error.kind === "unauthorized") {
          tokenStore.clear(area);
        } else {
          setValidationError(
            error instanceof Error ? error : new Error("Unable to validate the session."),
          );
        }
        setChecking(false);
      },
    );
    return () => {
      active = false;
    };
  }, [area, ready, token, validationAttempt, save]);

  if (!ready || checking) return null;
  if (validationError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <ErrorState
          error={validationError}
          onRetry={() => setValidationAttempt((attempt) => attempt + 1)}
        />
      </div>
    );
  }
  if (!token)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-glow px-4">
        <Logo suffix={label} />
        {signIn === "otp" ? (
          <OtpSignIn area={area} onDone={save} />
        ) : (
          <PasswordSignIn area={area} onDone={save} />
        )}
      </div>
    );
  return (
    <>
      {signOutError && (
        <div
          role="alert"
          className="border-b border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          Unable to sign out: {signOutError.message}
        </div>
      )}
      {children(signOut)}
    </>
  );
}
