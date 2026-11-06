import { Image } from "@/components/ui/image";
import Reveal from "@/components/landing/Reveal";
import { HOW_IMAGES } from "@/lib/brand-asset";
import { useI18n } from "@/lib/preferences";

/** Three approved illustrations: create a profile, pick an activity, share the moment. */
const steps = [
  {
    image: HOW_IMAGES.profile,
    glow: "shadow-[0_16px_36px_-18px_hsl(var(--rose)/0.9)]",
    ring: "ring-rose/35",
    number: "text-rose-deep",
    ar: ["ملف طفلك", "الاسم والعمر، في دقيقة واحدة."],
    en: ["Your child's profile", "A name and an age, in one minute."],
  },
  {
    image: HOW_IMAGES.activity,
    glow: "shadow-[0_16px_36px_-18px_hsl(var(--turq)/0.9)]",
    ring: "ring-turq/35",
    number: "text-turq-deep",
    ar: ["نشاط اليوم", "الطفل يختار ما يناسبه."],
    en: ["Today's activity", "The child picks what fits."],
  },
  {
    image: HOW_IMAGES.share,
    glow: "shadow-[0_16px_36px_-18px_hsl(var(--lav)/0.9)]",
    ring: "ring-lav/40",
    number: "text-lav-deep",
    ar: ["لحظة التعبير", "كل شيء يبقى محفوظًا لك."],
    en: ["The expression", "Everything stays saved for you."],
  },
];

export function HowItWorks() {
  const { t } = useI18n();

  return (
    <section id="how" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-turq-deep">{t("كيف يعمل", "How it works")}</span>
        <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
          {t("ثلاث خطوات صغيرة، ومساحة كبيرة للتعبير", "Three small steps, one big space to express")}
        </h2>
        <p className="mt-4 text-lg text-ink-soft">
          {t("بسيط للطفل، ومطمئن للوالدين.", "Simple for the child, reassuring for the parents.")}
        </p>
      </Reveal>

      <div className="relative mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-14 lg:gap-6">
        <div className="pointer-events-none absolute inset-x-16 top-16 hidden border-t-2 border-dashed border-border sm:block" />
        {steps.map((step, i) => {
          const [title, body] = t(step.ar, step.en);
          return (
            <Reveal key={title} delay={i * 0.12}>
              <div className="relative h-full overflow-hidden rounded-[1.75rem] border border-border bg-card p-4 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:rounded-[2rem] sm:p-6">
                <span className={`absolute top-4 end-4 font-display text-xl font-extrabold sm:top-6 sm:end-6 sm:text-2xl ${step.number} opacity-40`}>
                  0{i + 1}
                </span>
                <span className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cream ring-1 sm:h-28 sm:w-28 ${step.ring} ${step.glow}`}>
                  <Image src={step.image} alt="" className="h-16 w-16 object-contain sm:h-24 sm:w-24" fittingType="fit" />
                </span>
                <h3 className="mt-3 text-center text-lg font-bold text-ink sm:mt-5 sm:text-xl">{title}</h3>
                <p className="mt-1 text-center text-sm leading-relaxed text-ink-soft sm:text-base">{body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export default HowItWorks;