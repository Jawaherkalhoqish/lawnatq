import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { activityArt } from "@/components/brand/ActivityArt";
import Reveal from "@/components/landing/Reveal";
import { useI18n } from "@/lib/preferences";

const items = [
  {
    key: "cards",
    art: "cards",
    bg: "bg-turq/15",
    ring: "ring-turq/30",
    accent: "text-turq-deep",
    ar: ["بطاقاتي", "بطاقات مصوّرة واضحة تساعد طفلك على قول ما يحتاجه: طعام، راحة، لعب، أو مساعدة."],
    en: ["My cards", "Clear picture cards that help your child say what they need: food, rest, play or help."],
    span: "md:col-span-2",
  },
  {
    key: "colors",
    art: "colors",
    bg: "bg-sun/15",
    ring: "ring-sun/30",
    accent: "text-sun-deep",
    ar: ["ألواني", "استوديو رسم وتلوين بألوان لونُطق، ورسومات جاهزة بخطوط واسعة."],
    en: ["My colors", "A drawing and coloring studio with LAWNATQ colors and bold-line templates."],
    span: "",
  },
  {
    key: "stories",
    art: "stories",
    bg: "bg-lav/15",
    ring: "ring-lav/30",
    accent: "text-lav-deep",
    ar: ["قصتي أنا", "قصص مصوّرة يتشارك فيها الطفل القرار، ويسمع السرد بصوته ولغته."],
    en: ["My story", "Illustrated stories where the child makes the choices and hears the narration."],
    span: "",
  },
  {
    key: "assistant",
    art: "assistant",
    bg: "bg-rose/15",
    ring: "ring-rose/30",
    accent: "text-rose-deep",
    ar: ["مساعدي", "مساعد ودود بلغة بسيطة: يوجّه الطفل بين الأنشطة ويقترح أفكارًا للتعبير."],
    en: ["My helper", "A friendly helper in simple language: guides the child and suggests ways to express."],
    span: "",
  },
];

export function Activities() {
  const { t, isAr } = useI18n();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <section id="activities" className="scroll-mt-24 bg-cream/60 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-coral-deep">
              {t("أنشطة لونُطق", "LAWNATQ activities")}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
              {t("أربعة عوالم، كلها بانتظار طفلك", "Four little worlds, all waiting for your child")}
            </h2>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 self-start rounded-full bg-card px-6 py-3 text-sm font-bold text-ink shadow-soft ring-1 ring-border transition hover:bg-background"
          >
            {t("جرّب الأنشطة", "Try the activities")}
            <Arrow className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {items.map((item, i) => {
            const Art = activityArt[item.art];
            const [title, body] = t(item.ar, item.en);
            return (
              <Reveal key={item.key} delay={i * 0.08} className={item.span}>
                <article
                  className={`group flex h-full flex-col justify-between gap-6 rounded-[2.25rem] ${item.bg} p-7 ring-1 ${item.ring} transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:flex-row sm:items-center sm:p-8`}
                >
                  <div className="max-w-xs">
                    <h3 className={`font-display text-2xl font-extrabold ${item.accent}`}>{title}</h3>
                    <p className="mt-2 leading-relaxed text-ink">{body}</p>
                  </div>
                  <Art className="h-40 w-40 shrink-0 self-center transition duration-500 group-hover:scale-105 sm:h-44 sm:w-44" />
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