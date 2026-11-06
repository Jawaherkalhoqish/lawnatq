import { useEffect } from "react";
import { Sparkles, X } from "lucide-react";
import { useI18n } from "@/lib/preferences";

const PLAN_BADGE = {
  trial: { ar: "تجربة ٧ أيام", en: "7-DAY TRIAL" },
  monthly: { ar: "١٩.٩٩ ر.س شهريًا", en: "SAR 19.99 / MONTH" },
  annual: { ar: "١٩٩ ر.س سنويًا", en: "SAR 199 / YEAR" },
};

/**
 * Prototype activation confirmation. A branded in-page dialog — never a browser
 * alert. Closing it keeps the parent on the page; the primary button moves on
 * to the child's space.
 */
export function ActivationSuccessDialog({ open, plan, onClose, onStart }) {
  const { t, lang } = useI18n();
  const badge = plan ? PLAN_BADGE[plan]?.[lang] ?? "" : "";

  // Escape closes, and the page behind never scrolls while the dialog is up.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="activation-success-title"
      className="fixed inset-0 z-[70] flex items-end justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="animate-pop relative w-full max-w-[36rem] rounded-[1.75rem] border border-border bg-gradient-to-b from-blush to-lilac p-2.5 shadow-lift">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("إغلاق", "Close")}
          className="absolute end-4 top-4 z-10 rounded-full p-1.5 text-ink transition hover:rotate-90 hover:bg-card/70"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="rounded-[1.4rem] bg-card/60 p-6 sm:p-8">
          <div className="flex flex-col gap-3 pe-8">
            <h2
              id="activation-success-title"
              className="font-display text-[1.75rem] font-extrabold leading-tight text-ink sm:text-[2.6rem]"
            >
              {t("تم الاشتراك بنجاح!", "Subscription activated!")}
            </h2>
            {badge ? (
              <span className="w-fit rounded-full bg-card px-4 py-1.5 text-[0.72rem] font-bold tracking-[0.08em] text-ink ring-1 ring-border">
                {badge}
              </span>
            ) : null}
          </div>

          <div className="mt-7 flex flex-col gap-5">
            <span className="h-px w-full bg-ink/15" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-ink sm:text-base">
              {t(
                "أهلًا بك في عالم لونطق! اشتراكك أصبح مفعّلًا، والآن حان وقت استكشاف الأنشطة مع طفلك.",
                "Welcome to the LAWNATQ world! Your subscription is active — now it is time to explore the activities with your child.",
              )}
            </p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-[0.7rem] leading-relaxed text-ink-soft">
                {t("تفعيل تجريبي — لم تُخصم أي مبالغ ولم تتم أي عملية دفع.", "Prototype activation — no money was charged and no payment was made.")}
              </span>
              <button
                type="button"
                onClick={onStart}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-bold text-primary-foreground transition hover:brightness-110"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {t("تمام، لنبدأ!", "Great, let's start!")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivationSuccessDialog;