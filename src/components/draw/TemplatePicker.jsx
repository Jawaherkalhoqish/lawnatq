import { templates } from "@/components/draw/templates";
import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

/** Horizontal picker: blank canvas plus the coloring outlines. */
export function TemplatePicker({ value, onChange }) {
  const { t, lang } = useI18n();
  const options = [{ id: "free", ar: "ورقة بيضاء", en: "Blank", svg: null }, ...templates];

  return (
    <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={active}
            className={cn(
              "flex w-[104px] shrink-0 flex-col items-center gap-1.5 rounded-2xl border p-2 transition",
              active ? "border-ink/20 bg-card shadow-soft ring-2 ring-turq/50" : "border-border bg-card/70 hover:bg-card",
            )}
          >
            <span className="grid h-14 w-full place-items-center overflow-hidden rounded-xl bg-white">
              {opt.svg ? (
                <span className="block h-full w-full [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: opt.svg }} />
              ) : (
                <span className="text-xs font-bold text-ink-soft">{t("فارغة", "Blank")}</span>
              )}
            </span>
            <span className="text-[0.7rem] font-bold text-ink">{lang === "ar" ? opt.ar : opt.en}</span>
          </button>
        );
      })}
    </div>
  );
}

export default TemplatePicker;