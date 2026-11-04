import { Link } from "@tanstack/react-router";
import { PlayCircle } from "lucide-react";
import SceneArt from "@/components/landing/SceneArt";
import Reveal from "@/components/landing/Reveal";
import { useI18n } from "@/lib/preferences";

export function StoryTeaser() {
  const { t } = useI18n();

  return (
    <section id="stories" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-lav/15 ring-1 ring-lav/30">
        <div className="grid items-center gap-10 p-7 sm:p-12 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-lav-deep">
              {t("قصص تفاعلية", "Interactive stories")}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
              {t("حين يصبح الطفل جزءًا من الحكاية", "When the child becomes part of the tale")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              {t(
                "في كل قصة ثلاث إلى خمس لوحات متصلة، شخصيات ثابتة، وقرارات صغيرة يختارها الطفل. لا إجابات صحيحة — فقط طريقته في رؤية العالم.",
                "Each story has three to five connected scenes, familiar characters, and small choices the child makes. No right answers — just their way of seeing the world.",
              )}
            </p>

            <blockquote className="mt-7 rounded-3xl border-s-4 border-sun bg-card p-5 text-ink shadow-soft">
              <p className="font-semibold leading-relaxed">
                {t(
                  "«وجدتُ بابًا صغيرًا في آخر الحديقة… وقلت في نفسي: أفتحه أم أنتظر حتى يأتي القمر؟»",
                  "\"I found a little door at the end of the garden… and I wondered: shall I open it, or wait for the moon?\"",
                )}
              </p>
              <footer className="mt-2 text-sm text-ink-soft">
                {t("من قصة: باب الحديقة", "From the story: The Garden Door")}
              </footer>
            </blockquote>

            <Link
              to="/register"
              className="mt-7 inline-flex h-14 items-center gap-2 rounded-full bg-lav-deep px-7 text-base font-bold text-white shadow-soft transition hover:opacity-90"
            >
              <PlayCircle className="h-5 w-5" aria-hidden="true" />
              {t("افتح مكتبة القصص", "Open the story library")}
            </Link>
          </Reveal>

          <Reveal delay={0.1} className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-card/60" aria-hidden="true" />
            <SceneArt className="relative w-full shadow-lift" />
            <div className="relative mt-4 flex items-center justify-center gap-2" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full ${i === 0 ? "w-8 bg-lav-deep" : "w-2 bg-lav-deep/30"}`}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default StoryTeaser;