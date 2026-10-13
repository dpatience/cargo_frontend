import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { en, type Dict } from "./en";
import { rw } from "./rw";

export type Lang = "en" | "rw"; // "fr" planned
const dicts: Record<Lang, Partial<Dict>> = { en, rw };
type Key = keyof Dict;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key, vars?: Record<string, string | number>) => string }>({
  lang: "en", setLang: () => {}, t: (k) => en[k],
});

export function I18nProvider({
  children,
  initialLang = "en",
  localeLocked = false,
}: {
  children: ReactNode;
  initialLang?: Lang;
  localeLocked?: boolean;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  useEffect(() => {
    if (localeLocked) return;
    const s = localStorage.getItem("tembera-cargo:lang");
    if (s === "rw" || s === "en") setLangState(s);
  }, [localeLocked]);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (l: Lang) => {
    if (localeLocked) {
      window.location.assign(`/${l}`);
      return;
    }
    setLangState(l);
    localStorage.setItem("tembera-cargo:lang", l);
  };
  const t = useCallback((k: Key, vars?: Record<string, string | number>) => {
    let s = dicts[lang][k] ?? en[k];
    if (vars) for (const [n, v] of Object.entries(vars)) s = s.replace(`{${n}}`, String(v));
    return s;
  }, [lang]);
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}
export const useI18n = () => useContext(Ctx);

export function formatRWF(amount: number) {
  return new Intl.NumberFormat("en-RW", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(amount);
}
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}
