import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { activityArt } from "@/components/brand/ActivityArt";
import { Image } from "@/components/ui/image";
import { useChild } from "@/hooks/useFamily";
import { MASCOT_URL } from "@/lib/brand-asset";
import { useI18n } from "@/lib/preferences";

export const Route = createFileRoute("/_authed/_kid/k/$childId/")({
  head: () => ({ meta: [{ title: "مساحة الطفل | لونُطق" }] }),
  component: ChildHome,
});

const tiles = [
  {
    path: "/cards",
    art: "cards",
    bg: "bg-coral/12",
    ring: "ring-coral/25",
    accent: "text-coral-deep",
    ar: ["بطاقاتي", "أقُل ما أريد بصور كبيرة وواضحة."],
    en: ["My cards", "Say what I want with big clear pictures."],
  },
  {
    path: "/draw",
    art: "colors",
    bg: "bg-sun/14",
    ring: "ring-sun/30",
    accent: "text-sun-deep",
    ar: ["ألواني", "أرسم وألوّن بحرية، بلا قواعد."],
    en: ["My colors", "Draw and color freely, no rules."],
  },
  {
    path: "/stories",
    art: "stories",
    bg: "bg-lav/14",
    ring: "ring-lav/25",
    accent: "text-lav-deep",
    ar: ["قصتي أنا", "أختار ما يحدث في الحكاية."],
    en: ["My story", "I choose what happens in the tale."],
  },
  {
    path: "/assistant",
    art: "assistant",
    bg: "bg-turq/14",
    ring: "ring-turq/25",
    accent: "text-turq-deep",
    ar: ["مساعدي", "صديق ودود يجيب بكلمات بسيطة."],
    en: ["My helper", "A friendly friend who answers simply."],
  },
];

function ChildHome() {
  const { childId } = useParams({ strict: false });
  const { data: child } = useChild(childId);
  const { t, isAr } = useI18n();
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
            <p className="mt-2 text-sm text-ink-soft/80">
              {t("لا يوجد ترتيب صحيح، ولا وقت محدد.", "There is no right order and no time limit.")}
            </p>
          </div>
          <Image
            src={MASCOT_URL}
            alt=""
            className="h-32 w-auto origin-center float-mid drop-shadow-[0_16px_24px_rgba(53,67,74,0.14)] sm:h-40"
            fittingType="fit"
          />
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {tiles.map((tile) => {
          const Art = activityArt[tile.art];
          const [title, body] = t(tile.ar, tile.en);
          return (
            <Link
              key={tile.path}
              to={`/k/$childId${tile.path}`}
              params={{ childId }}
              className={`group relative flex min-h-[13.5rem] flex-col justify-between overflow-hidden rounded-[2rem] ${tile.bg} p-6 ring-1 ${tile.ring} transition duration-300 hover:-translate-y-1 hover:shadow-lift`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className={`font-display text-2xl font-extrabold ${tile.accent}`}>{title}</h2>
                  <p className="mt-2 max-w-[15rem] leading-relaxed text-ink">{body}</p>
                </div>
                <Art className="h-24 w-24 shrink-0 transition duration-500 group-hover:rotate-3 group-hover:scale-110 sm:h-28 sm:w-28" />
              </div>
              <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-bold text-ink shadow-sm">
                {t("لنبدأ", "Let's start")}
                <Arrow className="h-4 w-4 transition group-hover:-translate-x-1 rtl:group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}