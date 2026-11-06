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
 * The original communication cards, untouched: the same source images at their
 * natural 64px size, the same rounded card, border, padding, label and tap-to-grow
 * behaviour, in one single row. The only addition is a calm few-pixel sway that
 * returns every card to its exact starting point.
 */
export function CardStrip() {
  const { t } = useI18n();
  const [active, setActive] = useState(null);

  return (
    <section className="border-y border-border/40 py-8" aria-label={t("بطاقات التواصل", "Communication cards")}>
      <p className="mb-5 text-center text-sm font-semibold text-ink-soft">
        {t("بطاقات حقيقية من مكتبة لونُطق — المسها لتكبر معك", "Real cards from the LAWNATQ library — tap one and watch it grow")}
      </p>
      <div className="flex items-start justify-center gap-1.5 px-2 sm:gap-2 sm:px-4">
        {strip.map(([cat, file, ar, en], index) => {
          const id = `${cat}-${file}`;
          const isActive = active === id;
          return (
            <div
              key={id}
              className="card-sway"
              style={{ animationDelay: `${(index % 4) * 0.7}s` }}
            >
              <button
                type="button"
                onClick={() => setActive((current) => (current === id ? null : id))}
                aria-pressed={isActive}
                className="flex w-[72px] shrink-0 flex-col items-center gap-1.5 rounded-3xl border border-border bg-card p-1.5 sm:w-[84px] sm:p-2"
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
                    className="h-14 w-14 object-contain sm:h-16 sm:w-16"
                    decoding="async"
                  />
                  <span className="whitespace-nowrap text-[0.65rem] font-bold leading-tight text-ink sm:text-xs">
                    {t(ar, en)}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CardStrip;