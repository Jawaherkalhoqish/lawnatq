import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useChild } from "@/hooks/useFamily";
import { activities } from "@/lib/activities";
import { MASCOT_URL } from "@/lib/brand-asset";
import { useI18n } from "@/lib/preferences";

export const Route = createFileRoute("/_authed/_kid/k/$childId/")({
  head: () => ({ meta: [{ title: "بيتي | لونُطق" }] }),
  component: ChildHome,
});

const toneFor = {
  bitqati: { bg: "bg-coral/12", ring: "ring-coral/25", accent: "text-coral-deep" },
  mashaeri: { bg: "bg-rose/15", ring: "ring-rose/30", accent: "text-rose-deep" },
  qissati: { bg: "bg-lav/14", ring: "ring-lav/25", accent: "text-lav-deep" },
  alwani: { bg: "bg-sun/14", ring: "ring-sun/30", accent: "text-sun-deep" },
  mosaedi: { bg: "bg-turq/14", ring: "ring-turq/25", accent: "text-turq-deep" },
};

function ChildHome() {
  const { childId } = useParams({ strict: false });
  const { data: child } = useChild(childId);
  const { t, isAr, lang } = useI18n();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-cream p-6 ring-1 ring-border sm:p-10">
        <div className="pointer-events-none absolute -top-10 end-[-2rem] h-44 w-44 rounded-full bg-sun/40 blur-2xl" aria-hidden="true" />
        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-start">
          <div className="max-w-md">
            <p className="text-sm font-bold text-turq-deep">{t("هذه مساحتك", "This space is yours")}</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold leading-snug text-ink sm:text-4xl">
              {t(`أهلًا يا ${child?.name ?? "صديقي"}`, `Hello ${child?.name ?? "friend"}`)}
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-ink-soft">
              {t("بماذا تحب أن نبدأ اليوم؟ اختر واحدة فقط.", "What shall we start with today? Pick just one.")}
            </p>
          </div>
          <Image
            src={MASCOT_URL}
            alt=""
            className="h-28 w-auto origin-center float-mid drop-shadow-[0_16px_24px_rgba(53,67,74,0.14)] sm:h-36"
            fittingType="fit"
          />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {activities.map((activity) => {
          const tone = toneFor[activity.key];
          return (
            <Link
              key={activity.key}
              to={`/k/$childId${activity.kid}`}
              params={{ childId }}
              className={`group flex flex-col items-center overflow-hidden rounded-[1.75rem] ${tone.bg} p-4 ring-1 ${tone.ring} transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:rounded-[2rem] sm:p-5`}
            >
              <Image
                src={activity.image}
                alt={activity.title[lang]}
                className="aspect-square h-auto w-full max-w-[7.5rem] object-contain transition duration-500 group-hover:scale-105 sm:max-w-[9rem]"
                fittingType="fit"
              />
              <h2 className={`mt-2 font-display text-xl font-extrabold sm:text-2xl ${tone.accent}`}>{activity.title[lang]}</h2>
              <p className="mt-1 flex-1 text-center text-xs leading-relaxed text-ink sm:text-sm">{activity.kidBody[lang]}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-xs font-bold text-ink shadow-sm sm:text-sm">
                {t("لنبدأ", "Let's start")}
                <Arrow className="h-3.5 w-3.5 transition group-hover:-translate-x-1 rtl:group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}