import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, MessageCircleHeart, Palette } from "lucide-react";
import DrawingThumb from "@/components/app/DrawingThumb";
import { cardByKey, cardImage } from "@/lib/cards";
import { storyPackById as storyById } from "@/lib/story-pack";
import { timeAgo } from "@/lib/dates";
import { useI18n } from "@/lib/preferences";

/** Recent work for one child: drawings, stories and cards, as three tinted panels. */
export function RecentWork({ childId, drawings, sequences, progress }) {
  const { t, lang, isAr } = useI18n();
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const recentCards = [];
  sequences.forEach((seq) => {
    (seq.card_keys || []).forEach((key) => {
      if (!recentCards.includes(key) && cardByKey[key]) recentCards.push(key);
    });
  });
  const savedStories = (progress || []).filter((p) => p.status !== "in_progress").slice(0, 3);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-[2rem] bg-sun/10 p-5 ring-1 ring-sun/20">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-ink">
            <Palette className="h-4 w-4 text-sun-deep" aria-hidden="true" />
            {t("آخر الرسومات", "Recent drawings")}
          </h2>
          <Link to="/insights" className="inline-flex items-center gap-1 text-xs font-bold text-sun-deep hover:underline">
            {t("الكل", "All")}
            <Arrow className="h-3 w-3" aria-hidden="true" />
          </Link>
        </header>
        {drawings?.length ? (
          <div className="grid grid-cols-3 gap-2.5">
            {drawings.slice(0, 3).map((drawing) => (
              <DrawingThumb key={drawing.id} drawing={drawing} className="aspect-square" />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-card/70 p-4 text-sm leading-relaxed text-ink-soft">
            {t("لا توجد رسومات بعد. استوديو الألوان في انتظار طفلك.", "No drawings yet — the color studio is waiting.")}
          </p>
        )}
      </section>

      <section className="rounded-[2rem] bg-lav/10 p-5 ring-1 ring-lav/20">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-ink">
            <BookOpen className="h-4 w-4 text-lav-deep" aria-hidden="true" />
            {t("القصص", "Stories")}
          </h2>
          <Link to="/insights" className="inline-flex items-center gap-1 text-xs font-bold text-lav-deep hover:underline">
            {t("الكل", "All")}
            <Arrow className="h-3 w-3" aria-hidden="true" />
          </Link>
        </header>
        {savedStories.length ? (
          <ul className="space-y-2">
            {savedStories.map((entry) => {
              const story = storyById(entry.story_id);
              if (!story) return null;
              return (
                <li key={entry.id}>
                  <Link
                    to="/k/$childId/stories/$storyId"
                    params={{ childId, storyId: story.id }}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-card/80 px-4 py-3 transition hover:bg-card"
                  >
                    <span className="text-sm font-bold text-ink">{story.title[lang]}</span>
                    <span className="text-xs text-ink-soft">{timeAgo(entry.created_date, lang)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="rounded-2xl bg-card/70 p-4 text-sm leading-relaxed text-ink-soft">
            {t("لم تُحفظ قصة بعد. جرّبا معًا «باب الحديقة».", "No saved story yet — try “The Garden Door” together.")}
          </p>
        )}
      </section>

      <section className="rounded-[2rem] bg-turq/10 p-5 ring-1 ring-turq/20 lg:col-span-2">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-ink">
            <MessageCircleHeart className="h-4 w-4 text-turq-deep" aria-hidden="true" />
            {t("بطاقات استخدمها مؤخرًا", "Cards used recently")}
          </h2>
          {sequences?.[0] && (
            <span className="text-xs text-ink-soft">{timeAgo(sequences[0].created_date, lang)}</span>
          )}
        </header>
        {recentCards.length ? (
          <div className="flex flex-wrap gap-2.5">
            {recentCards.slice(0, 8).map((key) => {
              const card = cardByKey[key];
              return (
                <span
                  key={key}
                  className="flex items-center gap-2 rounded-2xl bg-card px-3 py-2 text-sm font-semibold text-ink shadow-sm"
                >
                  <img src={cardImage(card)} alt="" className="h-8 w-8 object-contain" />
                  {lang === "ar" ? card.ar : card.en}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-ink-soft">
            {t(
              "لم تُستخدم بطاقات بعد. ابدآ ببطاقتين فقط: «أريد» و«ماء».",
              "No cards used yet — start with just two: “I want” and “water”.",
            )}
          </p>
        )}
      </section>
    </div>
  );
}

export default RecentWork;