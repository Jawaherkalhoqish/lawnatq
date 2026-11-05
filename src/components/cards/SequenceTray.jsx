import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Check, Eraser, Loader2, Volume2, X } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { cardImage } from "@/lib/cards";
import { speak, useI18n, usePrefs } from "@/lib/preferences";

/** The cards a child has lined up, plus read-aloud and save. */
export function SequenceTray({ childId, selected, onRemove, onClear }) {
  const { t, lang } = useI18n();
  const { voice } = usePrefs();
  const queryClient = useQueryClient();

  const save = useMutation({
    mutationFn: () =>
      base44.entities.CardSequence.create({
        child_id: childId,
        card_keys: selected.map((c) => c.key),
        categories: [...new Set(selected.map((c) => c.cat))],
        spoken: voice,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card-sequences", childId] });
      toast(t("حفظنا جملتك", "Your sentence is saved"), {
        description: t("يمكن لوالدك رؤيتها في مساحته.", "Your parent can see it in their space."),
      });
      onClear();
    },
    onError: () => toast.error(t("تعذّر الحفظ الآن", "Could not save right now")),
  });

  if (!selected.length) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-border bg-card/80 px-5 py-4 text-center text-sm text-ink-soft">
        {t(
          "اختر بطاقة واحدة أو أكثر، وستظهر هنا جملتك.",
          "Pick one or more cards and your sentence appears here.",
        )}
      </div>
    );
  }

  const sentence = selected.map((c) => (lang === "ar" ? c.ar : c.en)).join(" ");

  return (
    <div className="rounded-[1.75rem] border border-border bg-card p-3 shadow-lift">
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
        {selected.map((card, index) => (
          <div key={`${card.key}-${index}`} className="relative shrink-0">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-cream p-1">
              <img src={cardImage(card)} alt="" className="h-full w-full object-contain" />
            </span>
            <button
              type="button"
              onClick={() => onRemove(index)}
              aria-label={t("إزالة", "Remove")}
              className="absolute -end-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-ink text-background"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <span className="mt-1 block max-w-16 truncate text-center text-[0.62rem] font-bold text-ink-soft">
              {lang === "ar" ? card.ar : card.en}
            </span>
          </div>
        ))}
        <div className="ms-auto flex shrink-0 items-center gap-2 ps-2">
          <button
            type="button"
            onClick={() => speak(sentence, lang)}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-turq px-4 text-sm font-bold text-turq-deep transition hover:brightness-105 dark:text-primary-foreground"
          >
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            {t("اقرأ", "Read")}
          </button>
          <button
            type="button"
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-4 text-sm font-bold text-background transition hover:opacity-90 disabled:opacity-60"
          >
            {save.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Bookmark className="h-4 w-4" aria-hidden="true" />
            )}
            {t("احفظ", "Save")}
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-2.5">
        <p className="flex items-center gap-1.5 text-xs text-ink-soft">
          <Check className="h-3.5 w-3.5 text-turq-deep" aria-hidden="true" />
          {sentence}
        </p>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-ink-soft transition hover:text-ink"
        >
          <Eraser className="h-3.5 w-3.5" aria-hidden="true" />
          {t("مسح", "Clear")}
        </button>
      </div>
    </div>
  );
}

export default SequenceTray;