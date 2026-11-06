import { useState } from "react";
import { Image } from "@/components/ui/image";
import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

const strip = [
  ["04_Feelings", "happy", "سعيد", "Happy"],
  ["01_Basic_Needs", "water", "ماء", "Water"],
  ["02_Actions_Activities", "play", "ألعب", "Play"],
  ["03_People", "mom", "ماما", "Mom"],
  ["06_Choices_Refusal", "yes", "نعم", "Yes"],
  ["02_Actions_Activities", "draw", "أرسم", "Draw"],
  ["07_Help_Regulation", "help_me", "ساعدني", "Help me"],
  ["05_Social_Interaction", "thank_you", "شكرًا", "Thank you"],
  ["08_Places_Routines", "home", "البيت", "Home"],
  ["04_Feelings", "comfortable", "مرتاح", "Comfortable"],
  ["01_Basic_Needs", "food", "طعام", "Food"],
  ["07_Help_Regulation", "break", "استراحة", "Break"],
];

/**
 * The real communication cards, all visible at once and fixed in their own
 * slots. Each card drifts a few pixels left and right inside its own cell and
 * returns to its exact origin — the layout, spacing and images never move, so
 * no gap can open and no card is ever hidden.
 */
export function CardStrip() {
  const { t } = useI18n();
  const [active, setActive] = useState(null);

  const renderCard = (card, index) => {
    const [cat, file, ar, en] = card;
    const id = `${cat}-${file}`;
    const isActive = active === id;
    return (
      <div
        key={id}
        className={cn("float-x", index % 2 === 1 && "float-x-reverse")}
        style={{ animationDelay: `${(index % 6) * 0.45}s` }}
      >
        <button
          type="button"
          onClick={() => setActive((current) => (current === id ? null : id))}
          aria-pressed={isActive}
          className="flex w-[92px] shrink-0 flex-col items-center gap-1.5 rounded-3xl border border-border bg-card p-2.5 sm:w-[108px] sm:p-3"
        >
          <span
            className={cn(
              "card-glow flex w-full flex-col items-center gap-1.5 rounded-3xl transition-[transform,box-shadow] duration-300 ease-out",
              isActive ? "card-glow-on scale-110" : "hover:scale-105",
            )}
          >
            <Image
              src={`/cards/${cat}/${file}.png`}
              alt=""
              className="h-16 w-16 object-contain"
              decoding="async"
            />
            <span className="text-xs font-bold text-ink">{t(ar, en)}</span>
          </span>
        </button>
      </div>
    );
  };

  return (
    <section className="border-y border-border/40 py-8" aria-label={t("بطاقات التواصل", "Communication cards")}>
      <p className="mb-5 text-center text-sm font-semibold text-ink-soft">
        {t("بطاقات حقيقية من مكتبة لونُطق — المسها لتكبر معك", "Real cards from the LAWNATQ library — tap one and watch it grow")}
      </p>
      <div className="mx-auto flex w-full max-w-[760px] flex-wrap items-center justify-center gap-4 px-4">
        {strip.map((card, index) => renderCard(card, index))}
      </div>
    </section>
  );
}

export default CardStrip;