import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Volume2 } from "lucide-react";
import PageIntro from "@/components/site/PageIntro";
import SceneView from "@/components/story/SceneView";
import { Image } from "@/components/ui/image";
import { sceneById, storyImage, storyPack } from "@/lib/story-pack";
import { speak, useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/story")({
  head: () => ({
    meta: [
      { title: "قصتي أنا | لونُطق" },
      {
        name: "description",
        content: "اختر البطل وما يحدث، وستُبنى لك قصة مصوّرة تقرأها مشهدًا مشهدًا.",
      },
    ],
  }),
  component: MyStoryPage,
});

function buildScenes(story, choice) {
  const start = sceneById(story, story.start);
  const decision = start?.next ? sceneById(story, start.next) : null;
  const afterChoice = sceneById(story, choice.next);
  const ending = afterChoice?.next ? sceneById(story, afterChoice.next) : null;
  return [
    start,
    decision,
    {
      id: "my_choice",
      image: choice.image,
      text: { ar: `اخترت: ${choice.label.ar}`, en: `I chose: ${choice.label.en}` },
    },
    afterChoice,
    ending,
  ].filter(Boolean);
}

function MyStoryPage() {
  const { t, lang, isAr } = useI18n();
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const [heroId, setHeroId] = useState(storyPack[0].id);
  const [choiceId, setChoiceId] = useState(null);
  const [name, setName] = useState("");
  const [sceneIndex, setSceneIndex] = useState(0);
  const [scenes, setScenes] = useState(null);

  const story = storyPack.find((s) => s.id === heroId) ?? storyPack[0];
  const decision = sceneById(story, sceneById(story, story.start).next);
  const choice = decision.choices.find((c) => c.id === choiceId);

  function personalise(text) {
    const clean = name.trim();
    if (!clean) return text;
    return text.split(story.hero[lang]).join(clean);
  }

  function build() {
    if (!choice) return;
    setScenes(buildScenes(story, choice));
    setSceneIndex(0);
  }

  function reset() {
    setScenes(null);
    setChoiceId(null);
  }

  if (scenes) {
    const scene = scenes[sceneIndex];
    const isLast = sceneIndex === scenes.length - 1;
    return (
      <div className="mx-auto max-w-4xl px-5 pb-16 pt-8 sm:px-8">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold text-ink-soft transition hover:text-ink"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {t("غيّر القصة", "Change the story")}
          </button>
          <button
            type="button"
            onClick={() => speak(personalise(scene.text[lang]), lang)}
            className="inline-flex items-center gap-2 rounded-full bg-turq/20 px-4 py-2.5 text-sm font-bold text-turq-deep transition hover:bg-turq/30"
          >
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            {t("اسمع", "Listen")}
          </button>
        </div>

        <h1 className="mt-6 font-display text-3xl font-extrabold text-ink sm:text-4xl">
          {t("قصتي أنا", "My own story")} · {story.title[lang]}
        </h1>

        <SceneView
          src={storyImage(story, scene.image)}
          alt={t("مشهد من قصتك", "A scene from your story")}
          className="mt-5"
        >
          <p className="text-lg leading-relaxed text-ink sm:text-xl">{personalise(scene.text[lang])}</p>
        </SceneView>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSceneIndex((i) => Math.max(0, i - 1))}
            disabled={sceneIndex === 0}
            className="inline-flex h-14 items-center gap-2 rounded-full border border-border bg-card px-6 text-base font-bold text-ink transition hover:bg-cream disabled:opacity-40"
          >
            <Arrow className="h-4 w-4 rotate-180" aria-hidden="true" />
            {t("السابق", "Previous")}
          </button>
          {isLast ? (
            <button
              type="button"
              onClick={() => setSceneIndex(0)}
              className="inline-flex h-14 items-center gap-2 rounded-full bg-ink px-7 text-base font-bold text-background transition hover:opacity-90"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              {t("من البداية", "From the start")}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSceneIndex((i) => Math.min(scenes.length - 1, i + 1))}
              className="inline-flex h-14 items-center gap-2 rounded-full bg-turq px-7 text-base font-bold text-turq-deep transition hover:brightness-105"
            >
              {t("التالي", "Next")}
              <Arrow className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
          <span className="text-sm font-bold text-ink-soft">
            {sceneIndex + 1} / {scenes.length}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <PageIntro
        eyebrow={t("قصتي أنا", "My story")}
        title={t("ابنِ قصتك خطوة بخطوة", "Build your story step by step")}
        description={t(
          "اختر البطل، ثم اختر ما يحدث، وستظهر لك قصتك على مشاهد مصوّرة تقرأها كما تحب.",
          "Choose the hero, then choose what happens, and your story appears as illustrated scenes you read at your own pace.",
        )}
        tone="coral"
      />

      <div className="mx-auto mt-8 max-w-4xl space-y-8 px-5 sm:px-8">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink-soft">
            1 · {t("اختر البطل", "Choose the hero")}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {storyPack.map((s) => {
              const active = s.id === heroId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setHeroId(s.id);
                    setChoiceId(null);
                  }}
                  aria-pressed={active}
                  className={cn(
                    "flex items-center gap-3 rounded-[1.75rem] border-2 bg-card p-3 text-start transition",
                    active ? "border-turq ring-2 ring-turq/40" : "border-border hover:border-ink/20",
                  )}
                >
                  <Image src={storyImage(s, s.cover)} alt="" className="h-20 w-20 shrink-0 object-contain" fittingType="fit" />
                  <span>
                    <span className="block font-display text-lg font-extrabold text-ink">{s.hero[lang]}</span>
                    <span className="mt-0.5 block text-sm text-ink-soft">{s.title[lang]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink-soft">
            2 · {t("اختر ما يحدث", "Choose what happens")}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {decision.choices.map((c) => {
              const active = c.id === choiceId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChoiceId(c.id)}
                  aria-pressed={active}
                  className={cn(
                    "overflow-hidden rounded-[1.75rem] border-2 bg-card text-start transition",
                    active ? "border-lav ring-2 ring-lav/40" : "border-border hover:border-ink/20",
                  )}
                >
                  <img src={storyImage(story, c.image)} alt="" className="h-32 w-full bg-cream/50 object-contain p-2" />
                  <span className="block border-t border-border px-4 py-3 text-base font-bold text-ink">{c.label[lang]}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink-soft">
            3 · {t("اسمك في القصة (اختياري)", "Your name in the story (optional)")}
          </h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder={t("اكتب اسمك الأول", "Type your first name")}
            aria-label={t("اسمك في القصة", "Your name in the story")}
            className="mt-3 h-14 w-full max-w-sm rounded-full border border-input bg-card px-5 text-base text-ink outline-none focus:border-turq"
          />
        </section>

        <button
          type="button"
          onClick={build}
          disabled={!choice}
          className="inline-flex h-15 items-center gap-2 rounded-full bg-coral px-8 text-lg font-bold text-ink transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Sparkles className="h-5 w-5" aria-hidden="true" />
          {t("ابنِ قصتي", "Build my story")}
        </button>
      </div>
    </div>
  );
}