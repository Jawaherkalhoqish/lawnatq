import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";
import { HERO_URL } from "@/lib/brand-asset";
import { useI18n } from "@/lib/preferences";

/** The homepage opening: the approved hero photograph, set in a warm paper frame. */
export function Hero() {
  const { t, isAr } = useI18n();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute -top-28 start-[-12%] h-[420px] w-[420px] rounded-full bg-rose/25 blur-3xl dark:bg-rose/10" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 end-[-10%] h-[380px] w-[380px] rounded-full bg-lav/25 blur-3xl dark:bg-lav/10" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-9 px-5 pb-12 pt-9 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:pb-20 lg:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-lav/40 bg-lilac/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-lav-deep">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {t("عالَم صغير من التعبير", "A little world of expression")}
          </span>

          <h1 className="mt-5 font-display text-[2.6rem] font-extrabold leading-[1.06] tracking-tight text-ink sm:text-6xl">
            {t("لونك", "Let your colors")}{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-lav-deep">{t("ينطق", "speak")}</span>
              <svg
                className="absolute inset-x-0 -bottom-1 z-0 h-3 w-full text-rose"
                viewBox="0 0 120 12"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M2 8c26-6 62-7 116-3" stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none" />
              </svg>
            </span>
            <span className="text-ink">{t(" عنك", " for you")}</span>
          </h1>

          <p className="mt-5 text-lg font-semibold leading-relaxed text-ink sm:text-xl">
            {t(
              "لأن لكل طفل لونًا وصوتًا يستحق أن يُسمع.",
              "Because every child has a color and a voice worth being heard.",
            )}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/register"
              search={{ returnTo: "/dashboard" }}
              className="group inline-flex h-15 items-center justify-center gap-2 rounded-full bg-lav-deep px-8 text-lg font-bold text-primary-foreground shadow-lift transition hover:brightness-110"
            >
              {t("ابدأ الرحلة", "Start the journey")}
              <Arrow className="h-5 w-5 transition group-hover:-translate-x-1 rtl:group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <a
              href="#how"
              className="inline-flex h-15 items-center justify-center rounded-full border-2 border-ink/15 bg-card px-8 text-lg font-bold text-ink transition hover:border-ink/30 hover:bg-cream"
            >
              {t("اكتشف لونطق", "Discover LAWNATQ")}
            </a>
          </div>

          <p className="mt-6 text-sm font-semibold text-ink">
            {t("بلا تشخيص، وبلا ضغط — مساحة للتعبير فقط.", "No diagnosis, no pressure — an expression space only.")}
          </p>
        </motion.div>

        {/* The approved artwork, shown whole: its own ratio, contained, never cropped or stretched. */}
        <div className="relative mx-auto w-full max-w-[560px] lg:max-w-[640px]">
          <div
            className="pointer-events-none absolute inset-10 rounded-full bg-gradient-to-br from-rose/30 via-sun/15 to-lav/25 blur-3xl dark:from-rose/10 dark:via-transparent dark:to-lav/15"
            aria-hidden="true"
          />
          <div className="relative aspect-[1398/1125] w-full overflow-hidden rounded-[2rem] shadow-lift">
            <Image
              src={HERO_URL}
              alt={t(
                "طفلان يرسمان مع شخصية لونُطق",
                "Two children drawing alongside the LAWNATQ mascot",
              )}
              className="block h-full w-full object-contain"
              fittingType="fit"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;