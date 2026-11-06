import { Delete, RotateCcw } from "lucide-react";
import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

/** The four-digit indicator row, shared by the PIN screen and its confirmation step. */
export function PinDots({ value, length = 4, tone = "lav" }) {
  const tones = {
    lav: "bg-lav-deep",
    coral: "bg-coral-deep",
    turq: "bg-turq-deep",
  };
  return (
    <div className="flex items-center justify-center gap-3" dir="ltr" aria-hidden="true">
      {Array.from({ length }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "grid h-14 w-12 place-items-center rounded-2xl border-2 text-2xl font-extrabold transition",
            i < value.length ? `border-transparent text-primary-foreground ${tones[tone]}` : "border-border bg-cream text-ink-soft",
          )}
        >
          {i < value.length ? "•" : ""}
        </span>
      ))}
    </div>
  );
}

/** Number pad: digits, erase one, clear all. Large targets for shaky hands. */
export function PinPad({ value, onChange, disabled = false, max = 4 }) {
  const { t } = useI18n();

  const press = (digit) => {
    if (disabled || value.length >= max) return;
    onChange(value + digit);
  };
  const erase = () => !disabled && onChange(value.slice(0, -1));

  return (
    <div className="mx-auto grid max-w-xs grid-cols-3 gap-2.5">
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => press(key)}
          disabled={disabled}
          className="h-16 rounded-2xl bg-card text-2xl font-extrabold text-ink shadow-soft ring-1 ring-border transition active:scale-95 disabled:opacity-50"
        >
          {key}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange("")}
        disabled={disabled}
        aria-label={t("مسح الكل", "Clear all")}
        className="grid h-16 place-items-center rounded-2xl bg-cream text-ink-soft ring-1 ring-border transition active:scale-95 disabled:opacity-50"
      >
        <RotateCcw className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => press("0")}
        disabled={disabled}
        className="h-16 rounded-2xl bg-card text-2xl font-extrabold text-ink shadow-soft ring-1 ring-border transition active:scale-95 disabled:opacity-50"
      >
        0
      </button>
      <button
        type="button"
        onClick={erase}
        disabled={disabled}
        aria-label={t("حذف رقم", "Delete a digit")}
        className="grid h-16 place-items-center rounded-2xl bg-cream text-ink-soft ring-1 ring-border transition active:scale-95 disabled:opacity-50"
      >
        <Delete className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}