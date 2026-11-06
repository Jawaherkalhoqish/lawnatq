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
 * The real communication cards in one single row that stays exactly where it
 * belongs. Each card sways a few pixels to the right and back to its own origin
 * inside its slot — no scrolling, no marquee, no reordering — and the whole row
 * shrinks just enough to keep every card on screen at any width.
 */
export function CardStrip() {
  const { t } = useI18n();
  const [active, setActive] = useState(null);

  return (
    <section className="border-y border-border/40 py-8" aria-label={t("بطاقات التواصل", "Communication cards")}>
      <p className="mb-5 text-center text-sm font-semibold text-ink-soft">
        {t("بطاقات حقيقية من مكتبة لونُطق — المسها لتكبر معك", "Real cards from the LAWNATQ library — tap one and watch it grow")}
      </p>
      <div className="mx-auto flex max-w-6xl items-stretch justify-center gap-1.5 px-3 sm:gap-3 sm:px-6">
        {strip.map(([cat, file, ar, en], index) => {
          const id = `${cat}-${file}`;
          const isActive = active === id;
          return (
            <div
              key={id}
              className="card-sway min-w-0 flex-1 basis-0"
              style={{ animationDelay: `${(index % 4) * 0.6}s` }}
            >
              <button
                type="button"
                onClick={() => setActive((current) => (current === id ? null : id))}
                aria-pressed={isActive}
                className="flex w-full max-w-[108px] flex-col items-center gap-1.5 rounded-3xl border border-border bg-card p-1.5 sm:p-2.5 mx-auto"
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
                    className="aspect-square w-full max-h-16 object-contain"
                    decoding="async"
                  />
                  <span className="w-full truncate text-center text-[0.7rem] font-bold text-ink sm:text-xs">
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