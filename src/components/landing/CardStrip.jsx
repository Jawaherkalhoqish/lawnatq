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
 * One continuous, seamless row of the real communication cards.
 * The strip is rendered twice inside one track, so the CSS marquee always
 * loops on an identical frame — no pause, no jump, no restart.
 */
export function CardStrip() {
  const { t } = useI18n();
  const [active, setActive] = useState(null);

  const renderCard = (card, index, copy) => {
    const [cat, file, ar, en] = card;
    const id = `${cat}-${file}`;
    const isActive = active === id;
    return (
      <div key={`${id}-${copy}-${index}`} className="card-bob" style={{ animationDelay: `${(index % 6) * 0.55}s` }}>
        <button
          type="button"
          onClick={() => setActive((current) => (current === id ? null : id))}
          aria-pressed={isActive}
          tabIndex={copy === 1 ? -1 : undefined}
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
              loading="lazy"
              decoding="async"
            />
            <span className="text-xs font-bold text-ink">{t(ar, en)}</span>
          </span>
        </button>
      </div>
    );
  };

  return (
    <section className="border-y border-border/70 bg-cream py-8" aria-label={t("بطاقات التواصل", "Communication cards")}>
      <p className="mb-5 text-center text-sm font-semibold text-ink-soft">
        {t("بطاقات حقيقية من مكتبة لونُطق — المسها لتكبر معك", "Real cards from the LAWNATQ library — tap one and watch it grow")}
      </p>
      <div className="relative overflow-hidden">
        <div className="card-marquee flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-4 pe-4" aria-hidden={copy === 1}>
              {strip.map((card, index) => renderCard(card, index, copy))}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 start-0 w-16 bg-gradient-to-r from-cream to-transparent rtl:bg-gradient-to-l" />
        <div className="pointer-events-none absolute inset-y-0 end-0 w-16 bg-gradient-to-l from-cream to-transparent rtl:bg-gradient-to-r" />
      </div>
    </section>
  );
}

export default CardStrip;