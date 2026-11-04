import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/** Light is the brand default; dark keeps the pastel accents on warm charcoal. */
export function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "الوضع النهاري / Light mode" : "الوضع الليلي / Dark mode"}
      title={isDark ? "الوضع النهاري / Light" : "الوضع الليلي / Dark"}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-ink transition hover:bg-cream",
        className,
      )}
    >
      {isDark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}

export default ThemeToggle;