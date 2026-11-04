import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

/** Two-state language switch. Updates the whole document (dir + copy) instantly. */
export function LangToggle({ className, tone = "light" }) {
  const { lang, setLang } = useI18n();
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card p-1 text-xs font-semibold",
        className,
      )}
      role="group"
      aria-label="Language / اللغة"
    >
      {[
        { key: "ar", label: "ع" },
        { key: "en", label: "EN" },
      ].map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => setLang(opt.key)}
          aria-pressed={lang === opt.key}
          className={cn(
            "min-w-9 rounded-full px-2.5 py-1.5 transition",
            lang === opt.key
              ? "bg-ink text-background shadow-sm"
              : `text-ink-soft hover:text-ink ${tone === "light" ? "" : ""}`,
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default LangToggle;