import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/landing/Reveal";
import { homeWorlds } from "@/lib/activities";
import { useI18n } from "@/lib/preferences";

/** The five worlds — shared with «بيتي», so both places always show the same cards. */
export function Activities() {
  const { t, isAr, lang } = useI18n();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <section id="activities" className="scroll-mt-24 bg-cream/60 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-lav-deep">
              {t("أنشطة لونُطق", "LAWNATQ activities")}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
              {t("أربعة عوالم، كلها بانتظار طفلك", "Four little worlds, all waiting for your child")}
            </h2>
          </div>
          <Link
            to="/cards"
            className="inline-flex items-center gap-2 self-start rounded-full bg-card px-5 py-2.5 text-sm font-bold text-ink shadow-soft ring-1 ring-border transition hover:bg-background"
          >
            {t("جرّب الأنشطة", "Try the activities")}
            <Arrow className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-4">
          {homeWorlds.map((activity, i) => (
            <Reveal key={activity.key} delay={i * 0.06} className="h-full">
              <Link
                to={activity.site}
                className={`group flex h-full flex-col rounded-[1.5rem] ${activity.bg} p-4 ring-1 ${activity.ring} transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:rounded-[2rem] sm:p-6`}
              >
                <span className="mx-auto flex w-full max-w-[9rem] items-center justify-center sm:max-w-[11rem]">
                  <Image
                    src={activity.image}
                    alt={activity.title[lang]}
                    className={`aspect-square h-auto w-full object-contain transition duration-500 group-hover:scale-105 ${activity.glow}`}
                    fittingType="fit"
                  />
                </span>
                <h3 className={`mt-3 text-center font-display text-lg font-extrabold sm:text-2xl ${activity.accent}`}>
                  {activity.title[lang]}
                </h3>
                <p className="mt-1.5 flex-1 text-center text-xs leading-relaxed text-ink sm:text-sm">{activity.body[lang]}</p>
                <span className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-ink underline decoration-ink/25 decoration-2 underline-offset-4 sm:text-sm">
                  {t("افتح العالم", "Open the world")}
                  <Arrow className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Activities;