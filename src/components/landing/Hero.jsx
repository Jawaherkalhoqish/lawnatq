import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import Logo from "@/components/brand/Logo";
import { Image } from "@/components/ui/image";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/lib/preferences";

export function Hero() {
  const { t, isAr } = useI18n();
  const { isAuthenticated } = useAuth();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 start-[-10%] h-[420px] w-[420px] rounded-full bg-sun/25 blur-3xl" />
      <div className="pointer-events-none absolute top-40 end-[-8%] h-[380px] w-[380px] rounded-full bg-turq/25 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-10 pt-12 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-6 lg:pb-16 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-turq/40 bg-turq/10 px-4 py-1.5 text-xs font-bold text-turq-deep">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {t("مساحة تعبير للأطفال من ٥ إلى ١٠ سنوات", "An expression space for children aged 5–10")}
          </span>

          <h1 className="mt-6 font-display text-[2.9rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-6xl">
            {t("لونك", "Your color")}{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-turq-deep">{t("ينطق", "speaks")}</span>
              <svg
                className="absolute inset-x-0 -bottom-1 z-0 h-3 w-full text-sun"
                viewBox="0 0 120 12"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M2 8c26-6 62-7 116-3" stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none" />
              </svg>
            </span>{" "}
            {t("عنك.", "for you.")}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-ink-soft sm:text-xl">
            {t(
              "كل طفل لديه طريقته الخاصة في التعبير. في لونُطق، نمنح الأطفال مساحة يعبّرون فيها عن أنفسهم بالألوان والصور والقصص.",
              "Every child has their own way of expressing themselves. LAWNATQ gives children a gentle space to do it with colors, pictures and stories.",
            )}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="group inline-flex h-16 items-center justify-center gap-2 rounded-full bg-ink px-9 text-lg font-bold text-background shadow-lift transition hover:opacity-90"
            >
              {isAuthenticated ? t("اذهب إلى مساحتي", "Go to my space") : t("ابدأ الرحلة", "Start the journey")}
              <Arrow className="h-5 w-5 transition group-hover:-translate-x-1 rtl:group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <a
              href="#how"
              className="inline-flex h-16 items-center justify-center rounded-full border-2 border-ink/15 bg-card px-9 text-lg font-bold text-ink transition hover:border-ink/30 hover:bg-cream"
            >
              {t("تعرّف على لونُطق", "Learn about LAWNATQ")}
            </a>
          </div>

          <ul className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-ink-soft">
            {[
              t("بطاقات تواصل", "Communication cards"),
              t("رسم وتلوين", "Drawing & coloring"),
              t("قصص تفاعلية", "Interactive stories"),
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-turq" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[540px]"
        >
          <div className="relative aspect-square">
            <div className="absolute inset-3 rounded-[46%_54%_58%_42%/48%_42%_58%_52%] bg-turq/22" />
            <div className="absolute inset-12 rounded-[54%_46%_42%_58%/52%_58%_42%_48%] bg-cream" />
            <div className="absolute -top-2 end-4 h-20 w-20 rounded-full bg-sun/60" />
            <div className="absolute bottom-10 start-0 h-14 w-14 rounded-full bg-lav/50" />

            <div className="absolute inset-0 flex items-center justify-center">
              <Logo className="w-[74%] float-slow drop-shadow-[0_28px_40px_rgba(53,67,74,0.16)]" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -bottom-2 start-0 flex items-center gap-3 rounded-3xl border border-border bg-card p-3 shadow-lift sm:start-2"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-sun/25">
                <Image src="/cards/04_Feelings/happy.png" alt="" className="h-11 w-11 object-contain" />
              </div>
              <div className="pe-2 text-start">
                <p className="text-sm font-bold text-ink">{t("سعيد", "Happy")}</p>
                <p className="text-xs text-ink-soft">{t("بطاقة شعور", "A feeling card")}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="absolute end-0 top-8 rounded-3xl border border-border bg-card p-3.5 shadow-lift"
            >
              <div className="flex items-center gap-1.5">
                {["bg-turq", "bg-sun", "bg-coral", "bg-lav", "bg-sky", "bg-rose"].map((c) => (
                  <span key={c} className={`h-5 w-5 rounded-full ${c}`} />
                ))}
              </div>
              <p className="mt-2 text-xs font-semibold text-ink-soft">{t("لوحة ألواني", "My palette")}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute bottom-16 end-2 rounded-full bg-card px-4 py-2 shadow-soft ring-1 ring-border"
            >
              <span className="text-sm font-bold text-coral-deep">{t("قصتي أنا ✦", "My story ✦")}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;