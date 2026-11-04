import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Logo from "@/components/brand/Logo";
import LangToggle from "@/components/brand/LangToggle";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { Image } from "@/components/ui/image";
import { useI18n } from "@/lib/preferences";

/**
 * Shared frame for the auth screens: a warm branded panel on one side,
 * the form on the other. Keeps the LAWNATQ world present while staying calm.
 */
export function AuthLayout({ title, subtitle, children, footer }) {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[1.02fr_0.98fr]">
      <aside className="relative hidden overflow-hidden bg-cream lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -top-20 -end-24 h-72 w-72 rounded-full bg-sun/35 blur-2xl" />
        <div className="pointer-events-none absolute bottom-10 -start-16 h-64 w-64 rounded-full bg-turq/30 blur-2xl" />

        <Link to="/" className="relative z-10 inline-flex items-center gap-3">
          <Logo className="h-16" wordmark />
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-4xl font-extrabold leading-tight text-ink">
            {t("لونك ينطق عنك.", "Your color speaks for you.")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            {t(
              "مساحة دافئة للأطفال يعبّرون فيها بالألوان والبطاقات والقصص، وإشراف كامل من الوالدين.",
              "A warm space where children express themselves with colors, cards and stories — fully supervised by parents.",
            )}
          </p>

          <div className="mt-8 flex items-center gap-3">
            {["happy", "i_want", "play"].map((key, i) => {
              const paths = [
                "04_Feelings/happy",
                "06_Choices_Refusal/i_want",
                "02_Actions_Activities/play",
              ];
              return (
                <div key={key} className="rounded-3xl border border-border bg-card p-2.5 shadow-soft">
                  <Image src={`/cards/${paths[i]}.png`} alt="" className="h-14 w-14 object-contain" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 space-y-2 text-sm text-ink-soft">
          <p className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-turq-deep" aria-hidden="true" />
            {t("ملفات الأطفال تُدار من حساب الوالد فقط.", "Child profiles live only in the parent's account.")}
          </p>
          <p className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-coral-deep" aria-hidden="true" />
            {t("لونُطق مساحة تعبير، وليست أداة تشخيص.", "LAWNATQ is an expression space, not a diagnostic tool.")}
          </p>
        </div>
      </aside>

      <main className="flex min-h-screen flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-ink-soft transition hover:bg-cream hover:text-ink"
          >
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            {t("الرئيسية", "Home")}
          </Link>
          <div className="flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
          <Link to="/" className="mb-8 inline-flex lg:hidden">
            <Logo className="h-14" wordmark />
          </Link>
          <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-base text-ink-soft">{subtitle}</p>}
          <div className="mt-7 rounded-[2rem] border border-border bg-card p-6 shadow-soft sm:p-8">{children}</div>
          {footer && <p className="mt-6 text-center text-sm text-ink-soft">{footer}</p>}
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;