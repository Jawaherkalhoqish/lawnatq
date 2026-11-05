import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/landing/Reveal";
import { SIGNUP_PHOTO_URL } from "@/lib/brand-asset";
import { useI18n } from "@/lib/preferences";

export function FinalCta() {
  const { t } = useI18n();
  return (
    <section id="start" className="scroll-mt-24 px-5 pb-20 sm:px-8">
      <Reveal className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2.75rem] border border-lav/25 bg-gradient-to-br from-blush/70 via-peach/60 to-lilac/60 shadow-lift">
          <div className="grid items-center gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-4">
            <div className="px-6 pb-10 pt-10 text-center sm:px-10 sm:pb-12 sm:pt-12 lg:py-16 lg:pe-2 lg:ps-12 lg:text-start">
              <h2 className="text-3xl font-extrabold text-ink sm:text-[2.6rem] sm:leading-tight">
                {t("لنبدأ بلون، وكلمة، وقصة", "Let's begin with a color, a word, a story")}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                {t(
                  "أنشئ حساب الوالد، وأضف ملف طفلك في دقيقة واحدة.",
                  "Create your parent account and add your child's profile in a minute.",
                )}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="inline-flex h-16 items-center justify-center rounded-full bg-lav-deep px-9 text-lg font-bold text-primary-foreground shadow-lift transition hover:brightness-110"
                >
                  {t("ابدأ الرحلة مجانًا", "Start the journey free")}
                </Link>
                <Link
                  to="/login"
                  className="inline-flex h-16 items-center justify-center rounded-full border-2 border-ink/15 bg-card px-9 text-lg font-bold text-ink transition hover:border-ink/30 hover:bg-cream"
                >
                  {t("لدي حساب", "I have an account")}
                </Link>
              </div>
            </div>

            <div className="px-3 pb-3 sm:px-5 sm:pb-5 lg:py-6 lg:pe-6 lg:ps-2">
              <Image
                src={SIGNUP_PHOTO_URL}
                alt={t(
                  "أم وطفلتها تبتسمان أمام حاسوب في غرفة مليئة بالألوان والرسم",
                  "A mother and her daughter smiling at a laptop in a room full of colors and drawings",
                )}
                className="h-auto w-full rounded-[1.9rem] object-contain shadow-soft ring-1 ring-card/70"
                fittingType="fit"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default FinalCta;