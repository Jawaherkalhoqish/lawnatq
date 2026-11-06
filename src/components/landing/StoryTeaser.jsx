import { Link } from "@tanstack/react-router";
import { PlayCircle } from "lucide-react";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/landing/Reveal";
import { storyImage, storyPack } from "@/lib/story-pack";
import { useI18n } from "@/lib/preferences";

/** The two real story packs, shown with their own cover illustrations. */
export function StoryTeaser() {
  const { t, lang } = useI18n();

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
                "حكايتان مصوّرتان، والطفل يختار الطريق في كل مشهد.",
                "Two illustrated tales, with the child choosing the path in every scene.",
              )}
            </p>

            <Link
              to="/stories"
              className="mt-7 inline-flex h-14 items-center gap-2 rounded-full bg-lav-deep px-7 text-base font-bold text-primary-foreground shadow-soft transition hover:opacity-90"
            >
              <PlayCircle className="h-5 w-5" aria-hidden="true" />
              {t("افتح مكتبة القصص", "Open the story library")}
            </Link>
          </Reveal>

          <Reveal delay={0.1} className="grid gap-4 sm:grid-cols-2">
            {storyPack.map((story) => (
              <Link
                key={story.id}
                to="/stories/$storyId"
                params={{ storyId: story.id }}
                className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-card bg-card shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <Image
                  src={storyImage(story, story.cover)}
                  alt={story.title[lang]}
                  className="h-40 w-full object-contain p-2"
                  fittingType="fit"
                />
                <span className="block border-t border-border px-4 py-3 text-sm font-bold text-ink">
                  {story.title[lang]}
                </span>
              </Link>
            ))}
          </Reveal>
        </div>

        <p className="border-t border-lav/25 px-7 py-5 text-center font-display text-base font-extrabold text-lav-deep sm:px-12 sm:text-lg">
          {t("لونطق، قصة اليوم وعالم من الحكايات غدًا", "LAWNATQ — a story today, a world of stories tomorrow")}
        </p>
      </div>
    </section>
  );
}

export default StoryTeaser;