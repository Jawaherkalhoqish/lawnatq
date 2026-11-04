import { Link } from "@tanstack/react-router";
import { Check, MessageCircleQuestion } from "lucide-react";
import Reveal from "@/components/landing/Reveal";
import { useI18n } from "@/lib/preferences";

export function ParentSection() {
  const { t } = useI18n();
  const points = [
    t("لوحة واحدة تجمع رسمات طفلك وقصصه وبطاقاته.", "One dashboard for your child's drawings, stories and cards."),
    t("أسئلة مقترحة تفتح الحوار بدل أن تحكم على المشاعر.", "Suggested questions that open a conversation instead of judging feelings."),
    t("ملفات متعددة لكل أطفالك، مع تفضيلات وصول لكل طفل.", "Multiple profiles for each child, with their own access preferences."),
    t("أنتِ وحدك من يرى الملاحظات والرؤى — وليست داخل مساحة الطفل.", "Only you see notes and insights — never inside the child's space."),
  ];

  return (
    <section id="parents" className="scroll-mt-24 bg-cream/70 py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-sky-deep">
            {t("للوالدين", "For parents")}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
            {t("تشارك في رحلة التعبير، بهدوء ووضوح", "Join the expression journey, calmly and clearly")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            {t(
              "لونُطق لا يشخّص ولا يصنّف. يعطيك أثرًا لما فعله طفلك، وأفكارًا لما يمكنكما فعله معًا.",
              "LAWNATQ does not diagnose or label. It shows you what your child did, and ideas for what you can do together.",
            )}
          </p>

          <ul className="mt-7 space-y-3.5">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-turq/25 text-turq-deep">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="text-ink">{p}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/register"
            className="mt-8 inline-flex h-14 items-center rounded-full bg-ink px-8 text-base font-bold text-background transition hover:opacity-90"
          >
            {t("أنشئ حساب الوالد", "Create a parent account")}
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-turq/12" aria-hidden="true" />
            <div className="relative rounded-[2rem] border border-border bg-card p-5 shadow-lift">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sun/30 font-display text-lg font-extrabold text-sun-deep">
                    س
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">{t("ملف سارة", "Sara's profile")}</p>
                    <p className="text-xs text-ink-soft">{t("آخر نشاط: اليوم", "Last activity: today")}</p>
                  </div>
                </div>
                <span className="rounded-full bg-turq/15 px-3 py-1 text-xs font-bold text-turq-deep">
                  {t("٦ سنوات", "Age 6")}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { bg: "bg-sun/25", svg: "M10 52c14-16 34-16 48 0", stroke: "#FF7E75" },
                  { bg: "bg-lav/20", svg: "M14 24h40M14 36h28M14 48h34", stroke: "#C39BD3" },
                  { bg: "bg-turq/20", svg: "M12 40c12-24 30-24 44 0", stroke: "#6FD0C5" },
                ].map((d, i) => (
                  <div key={i} className={`aspect-square rounded-2xl ${d.bg} p-2`}>
                    <svg viewBox="0 0 68 68" className="h-full w-full">
                      <path d={d.svg} stroke={d.stroke} strokeWidth="5" strokeLinecap="round" fill="none" />
                    </svg>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-cream p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-ink">
                  <MessageCircleQuestion className="h-4 w-4 text-coral-deep" aria-hidden="true" />
                  {t("سؤال اليوم لطفلك", "Today's question for your child")}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {t(
                    "«استخدمت ألوانًا زرقاء كثيرة في هذه الرسمة. هل تحكي لي عنها؟»",
                    "\"You used lots of blue in this drawing. Can you tell me about it?\"",
                  )}
                </p>
                <p className="mt-2 text-xs text-ink-soft/80">
                  {t(
                    "ملاحظة وصفية فقط — لونُطق لا يفسّر المشاعر من الألوان.",
                    "A description only — LAWNATQ never reads feelings from colors.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default ParentSection;