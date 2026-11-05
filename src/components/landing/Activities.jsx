import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/landing/Reveal";
import { WORLD_IMAGES } from "@/lib/brand-asset";
import { useI18n } from "@/lib/preferences";

/** The four worlds — each illustrated by its own uploaded PNG, shown whole. */
const worlds = [
  {
    key: "cards",
    image: WORLD_IMAGES.cards,
    bg: "bg-turq/12",
    ring: "ring-turq/30",
    accent: "text-turq-deep",
    ar: ["بطاقاتي", "بطاقات مصوّرة واضحة تساعد طفلك على قول ما يحتاجه: طعام، راحة، لعب، أو مساعدة."],
    en: ["My cards", "Clear picture cards that help your child say what they need: food, rest, play or help."],
  },
  {
    key: "feelings",
    image: WORLD_IMAGES.feelings,
    bg: "bg-rose/15",
    ring: "ring-rose/30",
    accent: "text-rose-deep",
    ar: ["مشاعري", "بطاقات مشاعر بوجوه واضحة، تساعد طفلك على تسمية ما يشعر به بالطريقة التي تناسبه."],
    en: ["My feelings", "Feeling cards with clear faces that help your child name what they feel, in their own way."],
  },
  {
    key: "story",
    image: WORLD_IMAGES.story,
    bg: "bg-lav/15",
    ring: "ring-lav/30",
    accent: "text-lav-deep",
    ar: ["قصتي", "قصص مصوّرة يتشارك فيها الطفل القرار، ويسمع السرد بصوته ولغته."],
    en: ["My stories", "Illustrated stories where the child makes the choices and hears the narration."],
  },
  {
    key: "colors",
    image: WORLD_IMAGES.colors,
    bg: "bg-sun/15",
    ring: "ring-sun/30",
    accent: "text-sun-deep",
    ar: ["ألواني", "استوديو رسم وتلوين بألوان لونُطق، ورسومات جاهزة بخطوط واسعة."],
    en: ["My colors", "A drawing and coloring studio with LAWNATQ colors and bold-line templates."],
  },
];

const hrefs = { cards: "/cards", feelings: "/cards", story: "/story", colors: "/colors" };

export function Activities() {
  const { t, isAr } = useI18n();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <section id="activities" className="scroll-mt-24 bg-cream/60 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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
            className="inline-flex items-center gap-2 self-start rounded-full bg-card px-6 py-3 text-sm font-bold text-ink shadow-soft ring-1 ring-border transition hover:bg-background"
          >
            {t("جرّب الأنشطة", "Try the activities")}
            <Arrow className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {worlds.map((world, i) => {
            const [title, body] = t(world.ar, world.en);
            return (
              <Reveal key={world.key} delay={i * 0.08}>
                <article
                  className={`group flex h-full flex-col justify-between gap-6 rounded-[2.25rem] ${world.bg} p-6 ring-1 ${world.ring} transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:flex-row sm:items-center sm:p-8`}
                >
                  <div className="max-w-xs">
                    <h3 className={`font-display text-2xl font-extrabold ${world.accent}`}>{title}</h3>
                    <p className="mt-2 leading-relaxed text-ink">{body}</p>
                    <Link
                      to={hrefs[world.key]}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-ink underline decoration-ink/25 decoration-2 underline-offset-4 transition hover:decoration-ink/60"
                    >
                      {t("افتح العالم", "Open the world")}
                      <Arrow className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                  <span className="flex shrink-0 items-center justify-center self-center">
                    <Image
                      src={world.image}
                      alt={title}
                      className="aspect-square h-32 w-32 object-contain drop-shadow-[0_14px_24px_rgba(53,67,74,0.10)] sm:h-40 sm:w-40"
                      fittingType="fit"
                    />
                  </span>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Activities;