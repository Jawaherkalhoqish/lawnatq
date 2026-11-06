import { Mail } from "lucide-react";
import Reveal from "@/components/landing/Reveal";
import { useI18n } from "@/lib/preferences";

const EMAIL = "lonotq@gmail.com";

/** Connect With Us — one clear, working email link. */
export function ConnectWithUs() {
  const { t } = useI18n();

  return (
    <section id="contact" className="scroll-mt-24 px-5 pb-16 sm:px-8 lg:pb-24">
      <Reveal className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-lav/15 p-7 text-center ring-1 ring-lav/30 sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-card text-lav-deep ring-1 ring-lav/40">
          <Mail className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-3xl font-extrabold text-ink">
          {t("تواصل معنا", "Connect with us")}
        </h2>
        <p className="mt-2 text-ink-soft">
          {t("نحب أن نسمع منك — سؤال، ملاحظة، أو قصة نجحت مع طفلك.", "We would love to hear from you — a question, a note, or a story that worked with your child.")}
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="mt-5 inline-flex h-13 items-center justify-center gap-2 rounded-full bg-lav-deep px-7 text-lg font-bold text-primary-foreground shadow-soft transition hover:brightness-110"
        >
          <Mail className="h-5 w-5" aria-hidden="true" />
          {EMAIL}
        </a>
      </Reveal>
    </section>
  );
}

export default ConnectWithUs;