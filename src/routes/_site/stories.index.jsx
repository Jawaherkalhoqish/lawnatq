import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import PageIntro from "@/components/site/PageIntro";
import { Image } from "@/components/ui/image";
import { storyImage, storyPack } from "@/lib/story-pack";
import { readProgress } from "@/lib/story-progress";
import { useI18n } from "@/lib/preferences";

export const Route = createFileRoute("/_site/stories/")({
  head: () => ({
    meta: [
      { title: "القصص التفاعلية | لونُطق" },
      {
        name: "description",
        content: "قصص تفاعلية مصوّرة يختار فيها الطفل ما يحدث، في كل قصة مساران ونهايتان مختلفتان.",
      },
    ],
  }),
  component: StoriesPage,
});

function StoriesPage() {
  const { t, lang, isAr } = useI18n();
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const [progress, setProgress] = useState({});

  useEffect(() => setProgress(readProgress()), []);

  return (
    <div className="pb-16">
      <PageIntro
        eyebrow={t("القصص التفاعلية", "Interactive stories")}
        title={t("أنت من يختار ما يحدث", "You choose what happens")}
        description={t(
          "لونطق، قصة اليوم وعالم من الحكايات غدًا.",
          "LAWNATQ — a story today, a world of stories tomorrow.",
        )}
        tone="lav"
      />

      <div className="mx-auto mt-10 grid max-w-7xl gap-6 px-5 sm:px-8 md:grid-cols-2">
        {storyPack.map((story) => {
          const resumed = progress[story.id];
          return (
            <article
              key={story.id}
              className="group flex flex-col overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative bg-cream/60">
                <Image
                  src={storyImage(story, story.cover)}
                  alt={story.title[lang]}
                  className="h-64 w-full object-contain p-3"
                  fittingType="fit"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-display text-2xl font-extrabold text-ink">{story.title[lang]}</h2>
                <p className="mt-2 flex-1 text-ink-soft">{story.description[lang]}</p>
                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <Link
                    to="/stories/$storyId"
                    params={{ storyId: story.id }}
                    className="inline-flex h-13 items-center gap-2 rounded-full bg-turq px-6 text-base font-bold text-turq-deep transition hover:brightness-105 dark:text-primary-foreground"
                  >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    {resumed ? t("أكمل القصة", "Continue") : t("اقرأ القصة", "Read the story")}
                  </Link>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs font-bold text-ink-soft">
                    {story.scenes.filter((s) => s.isEnding).length}
                    {t(" نهايات مختلفة", " different endings")}
                    <Arrow className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}