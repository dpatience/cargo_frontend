import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, useEffect, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { AlertTriangle, CloudOff, Inbox, Loader2, PlugZap, Truck, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiError } from "../api/client";
import { useI18n } from "../i18n";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        hero: "bg-brand text-primary-foreground shadow-cta hover:brightness-110",
        success: "bg-success text-success-foreground hover:bg-success/90",
        outline: "border border-border bg-transparent text-foreground hover:bg-secondary",
        ghost: "text-foreground hover:bg-secondary",
        subtle: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: { sm: "h-9 px-3 text-sm", md: "h-12 px-5 text-base", lg: "h-14 px-6 text-lg", xl: "h-20 px-8 text-xl" },
      block: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { loading?: boolean };
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, block, loading, children, disabled, ...p }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size, block }), className)} disabled={disabled || loading} {...p}>
    {loading && <Loader2 className="size-4 animate-spin" />}{children}
  </button>
));
Button.displayName = "Button";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...p }, ref) => (
  <input ref={ref} className={cn("h-12 w-full rounded-xl border border-input bg-surface px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring", className)} {...p} />
));
Input.displayName = "Input";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-1.5"><span className="text-sm font-medium text-muted-foreground">{label}</span>{children}</label>;
}

export function Card({ className, children, glass }: { className?: string; children: ReactNode; glass?: boolean }) {
  return <div className={cn("rounded-2xl border border-border p-5 shadow-card", glass ? "glass" : "bg-card", className)}>{children}</div>;
}

export function Logo({ suffix }: { suffix?: string }) {
  return (
    <span className="flex items-center gap-2 font-display text-lg font-bold">
      <span className="grid size-8 place-items-center rounded-lg bg-brand"><Truck className="size-4 text-primary-foreground" /></span>
      Tembera <span className="text-accent">Cargo</span>
      {suffix && <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">{suffix}</span>}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-muted", className)} />;
}
export function LoadingList({ rows = 3 }: { rows?: number }) {
  return <div className="space-y-3">{Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;
}

function StateBox({ icon, title, body, action }: { icon: ReactNode; title: string; body?: string; action?: ReactNode }) {
  return (
    <div role="status" className="flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-10 text-center">
      <div className="mb-3 grid size-12 place-items-center rounded-full bg-secondary text-accent">{icon}</div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {body && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return <StateBox icon={<Inbox className="size-5" />} title={title} body={body} action={action} />;
}
export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const { t } = useI18n();
  const e = error instanceof ApiError ? error : null;
  const retry = onRetry && <Button variant="outline" size="sm" onClick={onRetry}>{t("common.retry")}</Button>;
  if (e?.kind === "unconfigured") return <StateBox icon={<PlugZap className="size-5" />} title={t("state.unconfigured.title")} body={t("state.unconfigured.body")} />;
  if (e?.kind === "offline") return <StateBox icon={<WifiOff className="size-5" />} title={t("state.offline.title")} body={t("state.offline.body")} action={retry} />;
  return <StateBox icon={<AlertTriangle className="size-5" />} title={t("state.error.title")} body={e?.message ?? (error as Error)?.message} action={retry} />;
}

export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const u = () => setOnline(navigator.onLine);
    u(); window.addEventListener("online", u); window.addEventListener("offline", u);
    return () => { window.removeEventListener("online", u); window.removeEventListener("offline", u); };
  }, []);
  return online;
}
export function OfflineBanner() {
  const online = useOnline();
  const { t } = useI18n();
  if (online) return null;
  return <div className="flex items-center justify-center gap-2 bg-warning px-4 py-2 text-sm font-medium text-warning-foreground"><CloudOff className="size-4" />{t("state.offline.title")} — {t("state.offline.body")}</div>;
}

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex rounded-lg bg-secondary p-0.5 text-xs font-semibold" role="group" aria-label="Language">
      {(["rw", "en"] as const).map((l) => (
        <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} className={cn("rounded-md px-2.5 py-1.5 uppercase", lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>{l}</button>
      ))}
    </div>
  );
}

export function StatusPill({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "success" | "warning" | "danger" }) {
  const tones = { info: "bg-accent/15 text-accent", success: "bg-success/15 text-success", warning: "bg-warning/15 text-warning", danger: "bg-destructive/15 text-destructive" };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone])}>{children}</span>;
}
