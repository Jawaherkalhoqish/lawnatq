import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/landing/Reveal";
import { SUBSCRIPTION_IMAGES } from "@/lib/brand-asset";
import { activateSubscription as saveSubscription } from "@/lib/subscription-fns";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/lib/preferences";
import { activateSubscription, readSubscription } from "@/lib/subscription";

/**
 * Subscription section. Prototype only: choosing any plan activates it in the
 * browser and shows a friendly confirmation. No payment provider, no card
 * details, no charge.
 */
export function Subscription() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const persistPlan = useServerFn(saveSubscription);
  const [activePlan, setActivePlan] = useState(null);

  // The stored subscription is read after mount, never during the server render.
  useEffect(() => setActivePlan(readSubscription()), []);

  const plans = [
    {
      key: "trial",
      image: SUBSCRIPTION_IMAGES.trial,
      ring: "ring-rose/35",
      bg: "bg-blush/70",
      badge: t("ابدأ من هنا", "Start here"),
      title: t("تجربة مجانية", "Free trial"),
      price: t("7 أيام", "7 days"),
      period: t("بدون دفع", "no payment"),
      body: t(
        "كل الميزات مفتوحة خلال التجربة: البطاقات، ألواني، القصص، ومساعدي.",
        "Every feature is open during the trial: cards, colors, stories and the helper.",
      ),
      action: "trial",
    },
    {
      key: "monthly",
      image: SUBSCRIPTION_IMAGES.monthly,
      ring: "ring-lav/40",
      bg: "bg-lilac/60",
      badge: t("مرن", "Flexible"),
      title: t("اشتراك شهري", "Monthly"),
      price: t("19.99 ر.س", "SAR 19.99"),
      period: t("شهريًا", "per month"),
      body: t(
        "بعد انتهاء التجربة يُخصم 19.99 ر.س شهريًا، ويمكنك الإلغاء في أي وقت.",
        "After the trial, SAR 19.99 is charged every month. Cancel any time.",
      ),
      action: "monthly",
    },
    {
      key: "annual",
      image: SUBSCRIPTION_IMAGES.annual,
      ring: "ring-turq/40",
      bg: "bg-aqua/70",
      badge: t("الأوفر", "Best value"),
      title: t("اشتراك سنوي", "Annual"),
      price: t("199 ر.س", "SAR 199"),
      period: t("سنويًا", "per year"),
      body: t(
        "بعد انتهاء التجربة يُخصم 199 ر.س سنويًا — أي ما يعادل 16.58 ر.س شهريًا.",
        "After the trial, SAR 199 is charged once a year — about SAR 16.58 a month.",
      ),
      action: "annual",
    },
  ];

  // Prototype activation: no payment provider is connected. A signed-in parent
  // also gets a real subscription record saved to their account.
  function subscribe(plan) {
    setActivePlan(activateSubscription(plan.action));
    if (isAuthenticated) persistPlan({ data: { plan: plan.action } }).catch(() => {});
  }

  const activePlanData = activePlan ? plans.find((plan) => plan.action === activePlan.plan) : null;
  const activePlanLabel = activePlanData
    ? `${t("خطتك الحالية", "Your current plan")}: ${activePlanData.title}`
    : null;

  return (
    <section id="subscribe" className="scroll-mt-24 px-5 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-rose-deep">{t("الاشتراك", "Subscription")}</span>
          <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
            {t("جرّب لونُطق مجانًا لمدة ٧ أيام", "Try LAWNATQ free for 7 days")}
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            {t(
              "كل الميزات مفتوحة خلال التجربة، ثم تختار الخطة التي تناسب عائلتك.",
              "Every feature is open during the trial, then you choose the plan that suits your family.",
            )}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
          {plans.map((plan, i) => (
            <Reveal key={plan.key} delay={i * 0.08}>
              <article className={`flex h-full flex-col rounded-[1.75rem] ${plan.bg} p-5 ring-1 ${plan.ring} sm:rounded-[2rem] sm:p-6`}>
                <div className="flex items-start justify-between gap-3">
                  <Image src={plan.image} alt="" className="h-20 w-20 object-contain sm:h-24 sm:w-24" fittingType="fit" />
                  <span className="rounded-full bg-card px-3 py-1 text-[0.7rem] font-bold text-ink-soft ring-1 ring-border">
                    {plan.badge}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-extrabold text-ink">{plan.title}</h3>
                <p className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-extrabold text-ink">{plan.price}</span>
                  <span className="text-sm font-semibold text-ink-soft">{plan.period}</span>
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink">{plan.body}</p>

                {plan.action === "trial" ? (
                  <button
                    type="button"
                    onClick={() => subscribe(plan)}
                    className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-rose-deep px-6 text-base font-bold text-primary-foreground transition hover:brightness-110"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    {isAuthenticated ? t("ابدأ التجربة الآن", "Start the trial") : t("ابدأ التجربة المجانية", "Start the free trial")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => subscribe(plan)}
                    className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-base font-bold text-background transition hover:opacity-90"
                  >
                    <Check className="h-4 w-4" aria-hidden="true" />
                    {t("اطلب هذا الاشتراك", "Request this plan")}
                  </button>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        {activePlan ? (
          <p role="status" className="mx-auto mt-8 max-w-2xl text-center text-sm font-semibold text-turq-deep">
            {t(
              "تم تفعيل الاشتراك لأغراض العرض التجريبي — لم تُخصم أي مبالغ ولم تتم أي عملية دفع.",
              "The subscription is activated for demonstration purposes — no money was charged and no payment was made.",
            )}
            {activePlanLabel ? ` · ${activePlanLabel}` : ""}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export default Subscription;