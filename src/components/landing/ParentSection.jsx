import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/landing/Reveal";
import { PARENT_PHOTO_URL } from "@/lib/brand-asset";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/lib/preferences";

export function ParentSection() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const points = [
    t("لوحة واحدة تجمع رسمات طفلك وقصصه وبطاقاته.", "One dashboard for your child's drawings, stories and cards."),
    t("أسئلة مقترحة تفتح الحوار بدل أن تحكم على المشاعر.", "Suggested questions that open a conversation instead of judging feelings."),
    t("ملفات متعددة لكل أطفالك، مع تفضيلات وصول لكل طفل.", "Multiple profiles for each child, with their own access preferences."),
    t("أنتِ وحدك من يرى الملاحظات والرؤى — وليست داخل مساحة الطفل.", "Only you see notes and insights — never inside the child's space."),
  ];

  return (
    <section id="parents" className="scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-lav-deep">
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
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lav/25 text-lav-deep">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="text-ink">{p}</span>
              </li>
            ))}
          </ul>

          {/* A signed-in parent goes straight to the PIN gate of the parent area,
              never back to registration. */}
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="mt-8 inline-flex h-14 items-center rounded-full bg-ink px-8 text-base font-bold text-background transition hover:opacity-90"
          >
            {isAuthenticated
              ? t("ادخل إلى مساحة الوالدين", "Open the parent area")
              : t("أنشئ حساب الوالد", "Create a parent account")}
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-3 rounded-[2.75rem] bg-gradient-to-tr from-blush/80 via-lilac/70 to-aqua/50"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[2rem] border border-lav/30 bg-card p-2 shadow-lift">
              <Image
                src={PARENT_PHOTO_URL}
                alt={t(
                  "أم وطفلتها ترسمان معًا على طاولة دافئة",
                  "A mother and her daughter drawing together at a warm table",
                )}
                className="h-auto w-full rounded-[1.6rem] object-contain"
                fittingType="fit"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default ParentSection;