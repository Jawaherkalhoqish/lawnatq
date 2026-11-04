import { Image } from "@/components/ui/image";
import { useI18n } from "@/lib/preferences";

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

export function CardStrip() {
  const { t } = useI18n();
  const row = [...strip, ...strip];

  return (
    <section className="border-y border-border/70 bg-cream py-8" aria-label={t("بطاقات التواصل", "Communication cards")}>
      <p className="mb-5 text-center text-sm font-semibold text-ink-soft">
        {t("بطاقات حقيقية من مكتبة لونُطق — بصمات وألوان واضحة", "Real cards from the LAWNATQ library")}
      </p>
      <div className="relative overflow-hidden">
        <div className="marquee-track flex w-max gap-4 px-4">
          {row.map(([cat, file, ar, en], i) => (
            <div
              key={`${file}-${i}`}
              className="flex w-[104px] shrink-0 flex-col items-center gap-1.5 rounded-3xl border border-border bg-card p-2.5 shadow-soft"
              aria-hidden={i >= strip.length}
            >
              <Image
                src={`/cards/${cat}/${file}.png`}
                alt=""
                className="h-16 w-16 object-contain"
                loading="lazy"
              />
              <span className="text-xs font-bold text-ink">{t(ar, en)}</span>
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