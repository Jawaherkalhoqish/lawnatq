import { Accessibility, Heart, Languages, ShieldCheck } from "lucide-react";
import Reveal from "@/components/landing/Reveal";
import { useI18n } from "@/lib/preferences";

const items = [
  {
    icon: Heart,
    tone: "bg-coral/20 text-coral-deep",
    ar: ["لا تشخيص ولا تصنيف", "لا نفسّر مشاعر الطفل من ألوانه أو رسوماته، ولا نضع عليه أي وصف."],
    en: ["No diagnosis, no labels", "We never read a child's feelings from colors or drawings, and never label them."],
  },
  {
    icon: Languages,
    tone: "bg-sky/20 text-sky-deep",
    ar: ["عربي وإنجليزي بالكامل", "كل زر وقصة ورسالة تتغير مع اللغة، مع اتجاه كتابة صحيح."],
    en: ["Fully Arabic and English", "Every button, story and message switches with the language, right-to-left included."],
  },
  {
    icon: Accessibility,
    tone: "bg-turq/20 text-turq-deep",
    ar: ["مصمم لأجساد وأعين مختلفة", "أزرار كبيرة، خيارات قليلة، حجم خط قابل للتكبير، وتقليل الحركة."],
    en: ["Designed for different bodies", "Large targets, fewer choices, adjustable text size and reduced motion."],
  },
  {
    icon: ShieldCheck,
    tone: "bg-lav/20 text-lav-deep",
    ar: ["خصوصية بإشراف الوالد", "ملفات الأطفال تُنشأ وتُدار من حساب الوالد فقط، وبإذنه."],
    en: ["Parent-controlled privacy", "Child profiles are created and managed only from the parent's account."],
  },
];

export function WhyDifferent() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-turq-deep">
          {t("لماذا لونُطق", "Why LAWNATQ")}
        </span>
        <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
          {t("فلسفة بسيطة: التعبير أولًا", "A simple idea: expression first")}
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const [title, body] = t(item.ar, item.en);
          return (
            <Reveal key={title} delay={i * 0.08}>
              <div className="h-full rounded-[2rem] border border-border bg-card p-6">
                <span className={`inline-grid h-12 w-12 place-items-center rounded-2xl ${item.tone}`}>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold leading-snug text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export default WhyDifferent;