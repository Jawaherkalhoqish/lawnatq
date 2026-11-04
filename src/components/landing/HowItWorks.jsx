import { UserRoundPlus, MousePointerClick, HeartHandshake } from "lucide-react";
import Reveal from "@/components/landing/Reveal";
import { useI18n } from "@/lib/preferences";

export function HowItWorks() {
  const { t } = useI18n();
  const steps = [
    {
      icon: UserRoundPlus,
      tone: "bg-turq/15 text-turq-deep",
      title: t("أنشئ ملف طفلك", "Create your child's profile"),
      body: t(
        "الاسم، العمر، الاهتمامات، واحتياجات التواصل — في دقيقة واحدة، وبخصوصية تامة.",
        "Name, age, interests and communication needs — in a minute, and completely private.",
      ),
    },
    {
      icon: MousePointerClick,
      tone: "bg-sun/20 text-sun-deep",
      title: t("اختر نشاط اليوم", "Pick today's activity"),
      body: t(
        "بطاقات، ألوان، أو قصة. الطفل يختار ما يناسبه، بدون اختبارات ولا إجابات صحيحة.",
        "Cards, colors or a story. The child chooses what fits — no tests, no right answers.",
      ),
    },
    {
      icon: HeartHandshake,
      tone: "bg-rose/25 text-rose-deep",
      title: t("شاركوا لحظة التعبير", "Share the expression"),
      body: t(
        "الرسمات والقصص تبقى محفوظة لك، مع أسئلة لطيفة تساعدك على الحوار مع طفلك.",
        "Drawings and stories stay saved for you, with gentle questions to open a conversation.",
      ),
    },
  ];

  return (
    <section id="how" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-turq-deep">{t("كيف يعمل", "How it works")}</span>
        <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
          {t("ثلاث خطوات صغيرة، ومساحة كبيرة للتعبير", "Three small steps, one big space to express")}
        </h2>
        <p className="mt-4 text-lg text-ink-soft">
          {t(
            "لونُطق مصمم ليكون بسيطًا للطفل، ومطمئنًا للوالدين.",
            "LAWNATQ is designed to feel simple for the child and reassuring for the parent.",
          )}
        </p>
      </Reveal>

      <div className="relative mt-14 grid gap-6 md:grid-cols-3">
        <div className="pointer-events-none absolute inset-x-16 top-12 hidden border-t-2 border-dashed border-border md:block" />
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.12}>
            <div className="relative h-full rounded-[2rem] border border-border bg-card p-7 shadow-soft">
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${step.tone}`}>
                <step.icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <span className="absolute top-7 end-7 font-display text-2xl font-extrabold text-ink/15">
                0{i + 1}
              </span>
              <h3 className="mt-5 text-xl font-bold text-ink">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;