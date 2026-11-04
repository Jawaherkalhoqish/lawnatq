import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";
import { HERO_URL } from "@/lib/brand-asset";
import { useI18n } from "@/lib/preferences";

/** The homepage opening: live text beside the untouched transparent hero illustration. */
export function Hero() {
  const { t, isAr } = useI18n();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 start-[-12%] h-[420px] w-[420px] rounded-full bg-sun/25 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 end-[-10%] h-[380px] w-[380px] rounded-full bg-turq/25 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-12 pt-10 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:pb-20 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-turq/40 bg-turq/12 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-turq-deep">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {t("عالَم صغير من التعبير", "A little world of expression")}
          </span>

          <h1 className="mt-6 font-display text-[2.9rem] font-extrabold leading-[1.06] tracking-tight text-ink sm:text-6xl">
            {t("لونك", "Let your colors")}{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-turq-deep">{t("ينطق", "speak")}</span>
              <svg
                className="absolute inset-x-0 -bottom-1 z-0 h-3 w-full text-sun"
                viewBox="0 0 120 12"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M2 8c26-6 62-7 116-3" stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none" />
              </svg>
            </span>
            <span className="text-ink">{t(" عنك.", ".")}</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-ink-soft sm:text-xl">
            {t(
              "مساحة تفاعلية تساعد الأطفال على التعبير عن أفكارهم واحتياجاتهم واختياراتهم من خلال الصور والألوان والقصص، بطريقتهم الخاصة.",
              "An interactive space for children to share their ideas, needs, and feelings through colors, pictures, and stories, in their own way.",
            )}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/cards"
              className="group inline-flex h-16 items-center justify-center gap-2 rounded-full bg-turq px-9 text-lg font-bold text-turq-deep shadow-lift transition hover:brightness-105"
            >
              {t("ابدأ الرحلة", "Start the journey")}
              <Arrow className="h-5 w-5 transition group-hover:-translate-x-1 rtl:group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <a
              href="#how"
              className="inline-flex h-16 items-center justify-center rounded-full border-2 border-ink/15 bg-card px-9 text-lg font-bold text-ink transition hover:border-ink/30 hover:bg-cream"
            >
              {t("اكتشف لونطق", "Discover LAWNATQ")}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-sun/30 px-4 py-2 text-sm font-bold text-sun-deep">
              {t("الأعمار ٥ – ١٠ سنوات", "Ages 5 – 10")}
            </span>
            <span className="text-sm font-semibold text-ink-soft">
              {t("بلا تشخيص، وبلا ضغط — مساحة للتعبير فقط.", "No diagnosis, no pressure — an expression space only.")}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[620px]"
        >
          <div className="pointer-events-none absolute inset-8 rounded-[46%_54%_58%_42%/48%_42%_58%_52%] bg-cream" aria-hidden="true" />
          <div className="pointer-events-none absolute -top-2 end-6 h-16 w-16 rounded-full bg-sun/50" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-6 start-0 h-12 w-12 rounded-full bg-lav/40" aria-hidden="true" />

          <Image
            src={HERO_URL}
            alt={t(
              "رسمة أطفال ملونة تمثل التعبير بالألوان والقصص في لونطق",
              "A colourful children's illustration of expression through colors and stories",
            )}
            className="relative h-auto w-full object-contain float-slow drop-shadow-[0_26px_40px_rgba(53,67,74,0.12)]"
            fittingType="fit"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;