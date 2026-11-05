import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, RotateCcw, Volume2 } from "lucide-react";
import SceneView from "@/components/story/SceneView";
import { sceneById, storyImage, storyPackById } from "@/lib/story-pack";
import { writeProgress } from "@/lib/story-progress";
import { speak, useI18n, usePrefs } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/stories/$storyId")({
  loader: ({ params }) => {
    const story = storyPackById(params.storyId);
    if (!story) throw notFound();
    return story;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title?.ar ?? "قصة"} | لونُطق` }],
  }),
  component: StoryReader,
});

function StoryReader() {
  const story = Route.useLoaderData();
  const { t, lang, isAr } = useI18n();
  const { voice } = usePrefs();
  const [sceneId, setSceneId] = useState(story.start);
  const [history, setHistory] = useState([]);

  const scene = sceneById(story, sceneId) ?? story.scenes[0];

  useEffect(() => {
    writeProgress(story.id, scene.id);
  }, [story.id, scene.id]);

  function go(nextId) {
    setHistory((prev) => [...prev, scene.id]);
    setSceneId(nextId);
    const next = sceneById(story, nextId);
    if (next && voice) speak(next.text[lang], lang);
  }

  function back() {
    setHistory((prev) => {
      if (!prev.length) return prev;
      setSceneId(prev[prev.length - 1]);
      return prev.slice(0, -1);
    });
  }

  function restart() {
    setHistory([]);
    setSceneId(story.start);
  }

  const totalScenes = story.scenes.length;

  return (
    <div className="mx-auto max-w-4xl px-5 pb-16 pt-8 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/stories"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold text-ink-soft transition hover:text-ink"
        >
          <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          {t("كل القصص", "All stories")}
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={back}
            disabled={!history.length}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold text-ink-soft transition hover:text-ink disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            {t("رجوع", "Back")}
          </button>
          <button
            type="button"
            onClick={() => speak(scene.text[lang], lang)}
            className="inline-flex items-center gap-2 rounded-full bg-lav/25 px-4 py-2.5 text-sm font-bold text-lav-deep transition hover:bg-lav/35"
          >
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            {t("اسمع", "Listen")}
          </button>
        </div>
      </div>

      <header className="mt-6">
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{story.title[lang]}</h1>
        <div className="mt-3 flex items-center gap-1.5" aria-hidden="true">
          {story.scenes.map((s) => (
            <span
              key={s.id}
              className={cn("h-2 rounded-full transition-all", s.id === scene.id ? "w-8 bg-ink" : "w-2 bg-ink/20")}
            />
          ))}
        </div>
      </header>

      <SceneView
        src={storyImage(story, scene.image)}
        alt={t("مشهد من القصة", "A scene from the story")}
        className="mt-5"
      >
        <p className="text-lg leading-relaxed text-ink sm:text-xl">{scene.text[lang]}</p>
      </SceneView>

      {scene.choices ? (
        <div className="mt-6">
          <p className="text-sm font-bold text-ink-soft">{t("ماذا تختار؟", "What do you choose?")}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {scene.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                onClick={() => go(choice.next)}
                className="group flex flex-col overflow-hidden rounded-[1.75rem] border-2 border-border bg-card text-start transition duration-200 hover:-translate-y-1 hover:border-lav/60 hover:shadow-lift"
              >
                <img
                  src={storyImage(story, choice.image)}
                  alt=""
                  className="h-40 w-full bg-cream/50 object-contain p-2"
                />
                <span className="flex items-center justify-between gap-3 border-t border-border px-5 py-4 text-base font-bold text-ink">
                  {choice.label[lang]}
                  <ArrowRight className="h-4 w-4 shrink-0 text-ink-soft transition group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : scene.isEnding ? (
        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={restart}
            className="inline-flex h-14 items-center gap-2 rounded-full bg-ink px-7 text-base font-bold text-background transition hover:opacity-90"
          >
            <RotateCcw className="h-5 w-5" aria-hidden="true" />
            {t("من البداية", "From the start")}
          </button>
          <button
            type="button"
            onClick={back}
            className="inline-flex h-14 items-center gap-2 rounded-full border border-border bg-card px-6 text-base font-bold text-ink transition hover:bg-cream"
          >
            {t("رجوع خطوة", "One step back")}
          </button>
          <Link
            to="/stories"
            className="inline-flex h-14 items-center rounded-full px-5 text-base font-bold text-ink-soft transition hover:text-ink"
          >
            {t("قصة أخرى", "Another story")}
          </Link>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => go(scene.next)}
          className="mt-6 inline-flex h-14 items-center gap-2 rounded-full bg-turq px-7 text-base font-bold text-turq-deep transition hover:brightness-105 dark:text-primary-foreground"
        >
          {t("التالي", "Next")}
          <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
        </button>
      )}

      <p className="mt-8 text-center text-sm text-ink-soft">
        {t("هذه القصة لك — لا توجد إجابة صحيحة.", "This story is yours — there is no right answer.")}
      </p>
      <p className="sr-only">{t(`عدد المشاهد ${totalScenes}`, `${totalScenes} scenes`)}</p>
    </div>
  );
}