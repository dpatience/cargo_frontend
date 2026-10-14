import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/packages/i18n";

type Theme = "dark" | "light";
const STORAGE_KEY = "tembera-cargo:theme";

export function ThemeToggle() {
  const { t } = useI18n();
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initialTheme = saved === "light" ? "light" : "dark";
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = t(nextTheme === "light" ? "theme.switchToLight" : "theme.switchToDark");

  return (
    <button
      type="button"
      className="theme-toggle inline-flex size-9 items-center justify-center rounded-lg transition-colors"
      aria-label={label}
      title={label}
      onClick={() => {
        localStorage.setItem(STORAGE_KEY, nextTheme);
        setTheme(nextTheme);
        document.documentElement.dataset.theme = nextTheme;
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
      }}
    >
      {theme === "dark" ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
