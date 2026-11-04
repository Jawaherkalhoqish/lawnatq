import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, ShieldCheck, Trash2, UserRoundCheck, Sparkles } from "lucide-react";
import TopNav from "@/components/landing/TopNav";
import SiteFooter from "@/components/landing/SiteFooter";
import { useI18n } from "@/lib/preferences";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "الخصوصية والأمان | لونُطق" },
      {
        name: "description",
        content: "كيف نحمي بيانات الأطفال في لونُطق: ملفات بإشراف الوالد، لا تشخيص، ومساحة تعبير فقط.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t } = useI18n();

  const sections = [
    {
      icon: UserRoundCheck,
      ar: ["حساب الوالد هو البداية", "لا يُنشئ ملفات الأطفال إلا حساب والد موثّق بالبريد الإلكتروني، ولا يمكن لطفل أن ينشئ حسابًا بنفسه."],
      en: ["The parent account comes first", "Only a parent account with a verified email can create child profiles. A child cannot create an account."],
    },
    {
      icon: Lock,
      ar: ["كل عائلة ترى بياناتها فقط", "ملفات الأطفال ورسوماتهم وقصصهم وملاحظاتك مرتبطة بحسابك، ولا تظهر لعائلة أخرى."],
      en: ["Each family sees only its own data", "Child profiles, drawings, stories and your notes belong to your account and are never shown to another family."],
    },
    {
      icon: ShieldCheck,
      ar: ["لا تشخيص ولا تصنيف", "لونُطق لا تقيس النمو ولا تشخّص، ولا تفسّر الألوان أو الأشكال كدليل على مشاعر الطفل."],
      en: ["No diagnosis, no labels", "LAWNATQ does not measure development or diagnose, and never reads colors or shapes as evidence of a child's feelings."],
    },
    {
      icon: Sparkles,
      ar: ["كيف يعمل المساعد", "المساعد يولد ردودًا بلغة بسيطة من نص المحادثة فقط. لا نرسل صور الرسومات إلى أي خدمة خارجية، ولا نطلب من الطفل معلومات شخصية."],
      en: ["How the helper works", "The helper generates simple replies from the conversation text only. We never send drawing images to an external service, and never ask a child for personal details."],
    },
    {
      icon: Trash2,
      ar: ["أنتِ تتحكمين في الحذف", "يمكنك حذف ملف طفل من صفحة الملفات في أي وقت، وطلب حذف حسابك بالكامل من إعدادات الحساب."],
      en: ["You control deletion", "You can delete a child profile from the profiles page at any time, and request full account deletion from account settings."],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-turq/15 px-4 py-1.5 text-xs font-bold text-turq-deep">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          {t("الخصوصية والأمان", "Privacy & safety")}
        </span>
        <h1 className="mt-5 font-display text-3xl font-extrabold text-ink sm:text-4xl">
          {t("بيانات الأطفال أمانة، ونتعامل معها كذلك", "Children's data is a trust, and we treat it that way")}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          {t(
            "هذه الصفحة تشرح بصراحة ما نجمعه، ومن يراه، وما لا نفعله. لا نقدّم أي ادعاء بالامتثال التنظيمي أو استضافة البيانات محليًا.",
            "This page explains plainly what we collect, who can see it, and what we do not do. We make no claims of regulatory compliance or local data hosting.",
          )}
        </p>

        <div className="mt-10 space-y-4">
          {sections.map((section) => {
            const [title, body] = t(section.ar, section.en);
            return (
              <section key={title} className="rounded-[1.75rem] border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-cream text-turq-deep">
                    <section.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-ink">{title}</h2>
                    <p className="mt-1.5 leading-relaxed text-ink-soft">{body}</p>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-6 rounded-[1.75rem] bg-cream p-6">
          <h2 className="font-display text-lg font-extrabold text-ink">{t("ما لا نجمعه", "What we do not collect")}</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
            <li>· {t("لا صور شخصية للطفل، ولا موقعه، ولا اسم مدرسته.", "No photos of the child, no location, no school name.")}</li>
            <li>· {t("لا تشخيصات أو تقارير طبية.", "No diagnoses or medical reports.")}</li>
            <li>· {t("لا إعلانات ولا تتبّع لأغراض تسويقية داخل مساحة الطفل.", "No advertising or marketing tracking inside the child's space.")}</li>
          </ul>
        </div>

        <Link
          to="/"
          className="mt-10 inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-bold text-background transition hover:opacity-90"
        >
          {t("العودة إلى الرئيسية", "Back to home")}
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}