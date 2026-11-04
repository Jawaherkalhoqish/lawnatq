import { Link } from "@tanstack/react-router";
import Logo from "@/components/brand/Logo";
import Reveal from "@/components/landing/Reveal";
import { useI18n } from "@/lib/preferences";

export function FinalCta() {
  const { t } = useI18n();
  return (
    <section className="px-5 pb-20 sm:px-8">
      <Reveal className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.75rem] bg-primary px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0 opacity-[0.14] dotted-grid" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-16 start-1/4 h-56 w-56 rounded-full bg-white/25 blur-2xl" aria-hidden="true" />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center">
            <Logo className="h-24 float-mid drop-shadow-[0_18px_30px_rgba(38,64,61,0.18)]" />
            <h2 className="mt-6 text-3xl font-extrabold text-primary-foreground sm:text-[2.6rem] sm:leading-tight">
              {t("لنبدأ بلون، وكلمة، وقصة", "Let's begin with a color, a word, a story")}
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/85">
              {t(
                "أنشئ حساب الوالد، وأضف ملف طفلك في دقيقة واحدة.",
                "Create your parent account and add your child's profile in a minute.",
              )}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex h-16 items-center justify-center rounded-full bg-primary-foreground px-9 text-lg font-bold text-white shadow-lift transition hover:opacity-90"
              >
                {t("ابدأ الرحلة مجانًا", "Start the journey free")}
              </Link>
              <Link
                to="/login"
                className="inline-flex h-16 items-center justify-center rounded-full border-2 border-primary-foreground/25 px-9 text-lg font-bold text-primary-foreground transition hover:border-primary-foreground/50"
              >
                {t("لدي حساب", "I have an account")}
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default FinalCta;