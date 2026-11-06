import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Volume2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import AddCustomCardDialog from "@/components/cards/AddCustomCardDialog";
import { signedUrlFor, useCustomCards } from "@/hooks/useFamily";
import { speak, useI18n } from "@/lib/preferences";

function CardDrawing({ fileUri, alt }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let alive = true;
    if (!fileUri) return;
    signedUrlFor(fileUri)
      .then((value) => {
        if (alive) setUrl(value);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [fileUri]);

  if (!url) return <div className="h-24 w-full animate-pulse rounded-xl bg-cream" aria-hidden="true" />;
  return <Image src={url} alt={alt} className="h-24 w-full rounded-xl object-contain" fittingType="fit" />;
}

/** The child's own cards inside «مشاعري»: parent-written phrases, drawn by the child. */
export function FeelingsCustomCards({ child }) {
  const { t, lang } = useI18n();
  const queryClient = useQueryClient();
  const { data: customCards = [] } = useCustomCards(child?.id);

  if (!child) return null;

  const phraseOf = (card) => (lang === "ar" ? card.phrase_ar : card.phrase_en || card.phrase_ar);

  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-display text-xl font-extrabold text-ink">{t("بطاقاتي الخاصة", "My own cards")}</h2>
        <p className="mt-1 text-sm text-ink-soft">
          {t(
            "كلمات كتبناها معًا، ورسومات عبّرت عنها.",
            "Words we wrote together, and drawings that said them.",
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
        {customCards.map((card) => (
          <article
            key={card.id}
            className="flex flex-col rounded-[1.5rem] border border-border bg-card p-3 shadow-soft"
          >
            <CardDrawing fileUri={card.file_uri} alt={phraseOf(card)} />
            <p className="mt-2 flex-1 text-center text-sm font-bold text-ink">{phraseOf(card)}</p>
            <button
              type="button"
              onClick={() => speak(phraseOf(card), lang)}
              className="mx-auto mt-2 inline-flex items-center gap-1.5 rounded-full bg-lav/20 px-3 py-1.5 text-xs font-bold text-lav-deep transition hover:bg-lav/30"
            >
              <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
              {t("اقرأ", "Read")}
            </button>
          </article>
        ))}

        <AddCustomCardDialog
          child={child}
          onSaved={() => queryClient.invalidateQueries({ queryKey: ["custom-cards", child.id] })}
        />
      </div>
    </section>
  );
}

export default FeelingsCustomCards;