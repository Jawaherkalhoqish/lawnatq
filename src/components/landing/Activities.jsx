import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/landing/Reveal";
import { worlds } from "@/lib/activities";
import { useI18n } from "@/lib/preferences";

/** «عالمي» — the same four worlds the child sees in their own space. */
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
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-5xl">
              {t("أربعة عوالم، كلها بانتظار طفلك", "Four worlds, all waiting for your child")}
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
          {worlds.map((world, i) => (
            <Reveal key={world.key} delay={i * 0.06} className="h-full">
              <Link
                to={world.site}
                className={`group flex h-full flex-col rounded-[1.5rem] ${world.bg} p-4 ring-1 ${world.ring} transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:rounded-[2rem] sm:p-6`}
              >
                <span className="mx-auto flex w-full max-w-[9rem] items-center justify-center gap-1 sm:max-w-[11rem]">
                  {world.images.map((src, j) => (
                    <Image
                      key={src}
                      src={src}
                      alt={j === 0 ? world.title[lang] : ""}
                      className={`aspect-square h-auto ${world.images.length > 1 ? "w-1/2" : "w-full"} object-contain transition duration-500 group-hover:scale-105 ${world.glow}`}
                      fittingType="fit"
                    />
                  ))}
                </span>
                <h3 className={`mt-3 text-center font-display text-lg font-extrabold sm:text-2xl ${world.accent}`}>
                  {world.title[lang]}
                </h3>
                <p className="mt-1.5 flex-1 text-center text-xs leading-relaxed text-ink sm:text-sm">{world.body[lang]}</p>
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