import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Bookmark, Check, RotateCcw, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { useStoryProgress } from "@/hooks/useFamily";
import { sceneById, storyImage, storyPackById } from "@/lib/story-pack";
import { speak, useI18n, usePrefs } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/_kid/k/$childId/stories/$storyId")({
  head: () => ({ meta: [{ title: "قصة | لونُطق" }] }),
  component: StoryReader,
});

function StoryReader() {
  const { childId, storyId } = useParams({ strict: false });
  const { t, lang, isAr } = useI18n();
  const { voice } = usePrefs();
  const queryClient = useQueryClient();
  const story = storyPackById(storyId);
  const { data: progress } = useStoryProgress(childId);
  const [path, setPath] = useState(story ? [story.start] : []);
  const [saved, setSaved] = useState(false);
  const progressId = useRef(null);
  const initialised = useRef(false);
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  // Resume where the child stopped, once.
  useEffect(() => {
    if (initialised.current || !progress || !story) return;
    const entry = progress.find((p) => p.story_id === storyId);
    if (entry) {
      progressId.current = entry.id;
      const resumed = story.scenes[Math.min(entry.scene_index ?? 0, story.scenes.length - 1)];
      if (resumed) setPath([resumed.id]);
      setSaved(entry.status !== "in_progress");
    }
    initialised.current = true;
  }, [progress, storyId, story]);

  if (!story) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-10 text-center">
        <p className="font-bold text-ink">{t("لم نجد هذه القصة.", "Story not found.")}</p>
        <Link to="/k/$childId/stories" params={{ childId }} className="mt-4 inline-block text-sm font-bold text-turq-deep hover:underline">
          {t("كل القصص", "All stories")}
        </Link>
      </div>
    );
  }

  const current = sceneById(story, path[path.length - 1]) ?? sceneById(story, story.start);
  const sceneIndex = story.scenes.findIndex((s) => s.id === current.id);

  async function persist(index, status) {
    const payload = { child_id: childId, story_id: story.id, scene_index: index, status };
    if (progressId.current) {
      await base44.entities.StoryProgress.update(progressId.current, { scene_index: index, status });
    } else {
      const created = await base44.entities.StoryProgress.create(payload);
      progressId.current = created.id;
    }
    queryClient.invalidateQueries({ queryKey: ["story-progress", childId] });
  }

  function goTo(nextId) {
    const next = sceneById(story, nextId);
    if (!next) return;
    setPath((prev) => [...prev, nextId]);
    if (voice) speak(next.text[lang], lang);
    const index = story.scenes.findIndex((s) => s.id === nextId);
    persist(index, next.isEnding ? "completed" : saved ? "saved" : "in_progress").catch(() => {});
  }

  function goBack() {
    setPath((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }

  function restart() {
    setPath([story.start]);
    persist(0, "in_progress").catch(() => {});
  }

  async function saveStory() {
    await persist(sceneIndex, "saved");
    setSaved(true);
    toast.success(t("حُفظت القصة في مكتبتك", "Story saved to your library"));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Link
          to="/k/$childId/stories"
          params={{ childId }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-ink-soft transition hover:text-ink"
        >
          <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          {t("القصص", "Stories")}
        </Link>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {path.map((id, i) => (
            <span
              key={`${id}-${i}`}
              className={cn("h-2 rounded-full transition-all", i === path.length - 1 ? "w-7 bg-ink" : "w-2 bg-ink/25")}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => speak(current.text[lang], lang)}
          className="inline-flex items-center gap-2 rounded-full bg-turq/20 px-4 py-2 text-sm font-bold text-turq-deep transition hover:bg-turq/30"
        >
          <Volume2 className="h-4 w-4" aria-hidden="true" />
          {t("اسمع", "Listen")}
        </button>
      </div>

      <div className="overflow-hidden rounded-[2rem] bg-cream/50 shadow-soft ring-1 ring-border">
        <Image
          key={current.image}
          src={storyImage(story, current.image)}
          alt={t("مشهد من القصة", "A scene from the story")}
          className="mx-auto h-56 w-full object-contain p-3 animate-pop sm:h-80"
          fittingType="fit"
        />
      </div>

      <div className="rounded-[2rem] border border-border bg-card p-5 sm:p-7">
        <p className="text-lg leading-relaxed text-ink sm:text-xl">{current.text[lang]}</p>

        {current.choices ? (
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {current.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                onClick={() => goTo(choice.next)}
                className="flex items-center gap-3 rounded-2xl border-2 border-border bg-background p-2.5 text-start transition hover:-translate-y-0.5 hover:border-lav/60 hover:shadow-soft"
              >
                <Image
                  src={storyImage(story, choice.image)}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-xl bg-cream object-contain p-1"
                  fittingType="fit"
                />
                <span className="flex-1 text-base font-bold text-ink">{choice.label[lang]}</span>
                <Arrow className="h-4 w-4 shrink-0 text-ink-soft" aria-hidden="true" />
              </button>
            ))}
          </div>
        ) : current.isEnding ? (
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={saveStory}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-5 text-base font-bold text-background"
            >
              {saved ? <Check className="h-5 w-5" aria-hidden="true" /> : <Bookmark className="h-5 w-5" aria-hidden="true" />}
              {saved ? t("محفوظة", "Saved") : t("احفظ القصة", "Save story")}
            </button>
            <button
              type="button"
              onClick={restart}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-5 text-base font-bold text-ink transition hover:bg-cream"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              {t("من البداية", "From the start")}
            </button>
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={goBack}
              disabled={path.length <= 1}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-5 text-base font-bold text-ink transition hover:bg-cream disabled:opacity-40"
            >
              <Arrow className="h-4 w-4 rotate-180" aria-hidden="true" />
              {t("السابق", "Back")}
            </button>
            <button
              type="button"
              onClick={() => goTo(current.next)}
              className="inline-flex h-13 items-center gap-2 rounded-full bg-turq px-6 text-base font-bold text-turq-deep transition hover:brightness-105 dark:text-primary-foreground"
            >
              {t("التالي", "Next")}
              <Arrow className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}