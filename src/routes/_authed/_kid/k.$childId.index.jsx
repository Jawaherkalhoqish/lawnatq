import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useChild } from "@/hooks/useFamily";
import { worlds } from "@/lib/activities";
import { MASCOT_URL } from "@/lib/brand-asset";
import { useI18n } from "@/lib/preferences";

export const Route = createFileRoute("/_authed/_kid/k/$childId/")({
  head: () => ({ meta: [{ title: "عالمي | لونُطق" }] }),
  component: ChildHome,
});

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

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">{t("عالمي", "My worlds")}</h2>
          <p className="text-sm font-bold text-ink-soft">{t("أربعة عوالم", "Four worlds")}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {worlds.map((world) => (
            <Link
              key={world.key}
              to={`/k/$childId${world.kid}`}
              params={{ childId }}
              className={`group flex flex-col items-center overflow-hidden rounded-[1.75rem] ${world.bg} p-4 ring-1 ${world.ring} transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:rounded-[2rem] sm:p-5`}
            >
              <span className="flex w-full items-center justify-center gap-1">
                {world.images.map((src, j) => (
                  <Image
                    key={src}
                    src={src}
                    alt={j === 0 ? world.title[lang] : ""}
                    className={`aspect-square h-auto max-w-[7.5rem] ${world.images.length > 1 ? "w-1/2" : "w-full"} object-contain transition duration-500 group-hover:scale-105 sm:max-w-[9rem]`}
                    fittingType="fit"
                  />
                ))}
              </span>
              <h3 className={`mt-2 text-center font-display text-xl font-extrabold sm:text-2xl ${world.accent}`}>{world.title[lang]}</h3>
              <p className="mt-1 flex-1 text-center text-xs leading-relaxed text-ink sm:text-sm">{world.body[lang]}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-xs font-bold text-ink shadow-sm sm:text-sm">
                {t("لنبدأ", "Let's start")}
                <Arrow className="h-3.5 w-3.5 transition group-hover:-translate-x-1 rtl:group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}