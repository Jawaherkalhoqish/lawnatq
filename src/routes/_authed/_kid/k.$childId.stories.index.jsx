import { Link, createFileRoute, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, Bookmark, Check } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useStoryProgress } from "@/hooks/useFamily";
import { storyImage, storyPack } from "@/lib/story-pack";
import { useI18n } from "@/lib/preferences";

export const Route = createFileRoute("/_authed/_kid/k/$childId/stories/")({
  head: () => ({ meta: [{ title: "قصتي | لونُطق" }] }),
  component: StoriesPage,
});

function StoriesPage() {
  const { childId } = useParams({ strict: false });
  const { t, lang, isAr } = useI18n();
  const { data: progress } = useStoryProgress(childId);
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const byStory = Object.fromEntries((progress || []).map((p) => [p.story_id, p]));

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-ink">{t("قصتي", "My stories")}</h1>
        <p className="mt-2 max-w-xl text-ink-soft">
          {t("أنت من يختار ما يحدث.", "You choose what happens.")}
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {storyPack.map((story) => {
          const entry = byStory[story.id];
          return (
            <Link
              key={story.id}
              to="/k/$childId/stories/$storyId"
              params={{ childId, storyId: story.id }}
              className="group flex flex-col overflow-hidden rounded-[2rem] border border-border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <Image
                src={storyImage(story, story.cover)}
                alt={story.title[lang]}
                className="h-48 w-full bg-cream/50 object-contain p-3 sm:h-56"
                fittingType="fit"
              />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2">
                  {entry?.status === "saved" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-turq/20 px-2.5 py-1 text-[0.68rem] font-bold text-turq-deep">
                      <Bookmark className="h-3 w-3" aria-hidden="true" /> {t("محفوظة", "Saved")}
                    </span>
                  )}
                  {entry?.status === "completed" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sun/25 px-2.5 py-1 text-[0.68rem] font-bold text-sun-deep">
                      <Check className="h-3 w-3" aria-hidden="true" /> {t("أنهيتها", "Finished")}
                    </span>
                  )}
                  {entry && entry.status === "in_progress" && (
                    <span className="rounded-full bg-cream px-2.5 py-1 text-[0.68rem] font-bold text-ink-soft">
                      {t("بدأتها", "Started")}
                    </span>
                  )}
                </div>
                <h2 className="mt-2 font-display text-xl font-extrabold text-ink">{story.title[lang]}</h2>
                <p className="mt-1 flex-1 text-sm text-ink-soft">{story.description[lang]}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-turq-deep">
                  {entry?.status === "in_progress" ? t("أكمل القصة", "Continue") : t("افتح القصة", "Open story")}
                  <Arrow className="h-4 w-4 transition group-hover:-translate-x-1 rtl:group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}