import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Bookmark, Check, RotateCcw, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import StoryScene from "@/components/story/StoryScene";
import { useStoryProgress } from "@/hooks/useFamily";
import { speak, useI18n, usePrefs } from "@/lib/preferences";
import { storyById } from "@/lib/stories";
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
  const story = storyById(storyId);
  const { data: progress } = useStoryProgress(childId);
  const [scene, setScene] = useState(0);
  const [saved, setSaved] = useState(false);
  const progressId = useRef(null);
  const initialised = useRef(false);
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  // Resume where the child stopped, once.
  useEffect(() => {
    if (initialised.current || !progress) return;
    const entry = progress.find((p) => p.story_id === storyId);
    if (entry) {
      progressId.current = entry.id;
      setScene(Math.min(entry.scene_index ?? 0, (story?.scenes.length ?? 1) - 1));
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

  const current = story.scenes[scene];
  const isLast = scene === story.scenes.length - 1;

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

  async function goTo(index) {
    setScene(index);
    if (voice) speak(story.scenes[index].text[lang], lang);
    await persist(index, index === story.scenes.length - 1 ? "completed" : saved ? "saved" : "in_progress").catch(() => {});
  }

  async function saveStory() {
    await persist(scene, "saved");
    setSaved(true);
    toast.success(t("حُفظت القصة في مكتبتك", "Story saved to your library"));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/k/$childId/stories"
          params={{ childId }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-ink-soft transition hover:text-ink"
        >
          <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          {t("القصص", "Stories")}
        </Link>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {story.scenes.map((_, i) => (
            <span
              key={i}
              className={cn("h-2 rounded-full transition-all", i === scene ? "w-7 bg-ink" : i < scene ? "w-2 bg-ink/40" : "w-2 bg-ink/15")}
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

      <StoryScene setting={current.setting} sky={current.sky} who={current.who} className="w-full rounded-[2rem] shadow-soft" />

      <div className="rounded-[2rem] border border-border bg-card p-6 sm:p-8">
        <p className="text-lg leading-relaxed text-ink sm:text-xl">{current.text[lang]}</p>

        {current.choices ? (
          <div className="mt-6 space-y-2.5">
            <p className="text-sm font-bold text-ink-soft">{t("ماذا تختار؟", "What do you choose?")}</p>
            {current.choices.map((choice) => (
              <button
                key={choice.label[lang]}
                type="button"
                onClick={() => goTo(choice.next)}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-background px-5 py-4 text-start text-base font-bold text-ink transition hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-soft"
              >
                {choice.label[lang]}
                <Arrow className="h-4 w-4 text-ink-soft" aria-hidden="true" />
              </button>
            ))}
          </div>
        ) : isLast ? (
          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={saveStory}
              className="inline-flex h-13 items-center gap-2 rounded-full bg-ink px-6 text-base font-bold text-background"
            >
              {saved ? <Check className="h-5 w-5" aria-hidden="true" /> : <Bookmark className="h-5 w-5" aria-hidden="true" />}
              {saved ? t("محفوظة", "Saved") : t("احفظ القصة", "Save story")}
            </button>
            <button
              type="button"
              onClick={() => goTo(0)}
              className="inline-flex h-13 items-center gap-2 rounded-full border border-border px-6 text-base font-bold text-ink transition hover:bg-cream"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              {t("من البداية", "From the start")}
            </button>
            <Link
              to="/k/$childId/stories"
              params={{ childId }}
              className="inline-flex h-13 items-center gap-2 rounded-full px-5 text-base font-bold text-ink-soft transition hover:text-ink"
            >
              {t("قصص أخرى", "More stories")}
            </Link>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => goTo(scene + 1)}
            className="mt-6 inline-flex h-14 items-center gap-2 rounded-full bg-ink px-7 text-base font-bold text-background transition hover:opacity-90"
          >
            {t("التالي", "Next")}
            <Arrow className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
          </button>
        )}
      </div>

      <p className="text-center text-xs text-ink-soft">
        {t("هذه القصة لك — لا توجد إجابة صحيحة.", "This story is yours — there is no right answer.")}
      </p>
    </div>
  );
}