import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CreditCard } from "lucide-react";
import { getMySubscription } from "@/lib/subscription-fns";
import { readPinToken } from "@/lib/pin-session";
import { useI18n } from "@/lib/preferences";

const PLAN_LABEL = {
  trial: { ar: "تجربة مجانية لسبعة أيام", en: "7-day free trial" },
  monthly: { ar: "اشتراك شهري — 19.99 ر.س", en: "Monthly — SAR 19.99" },
  annual: { ar: "اشتراك سنوي — 199 ر.س", en: "Annual — SAR 199" },
};

const formatDate = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("ar-SA", { dateStyle: "medium", timeZone: "Asia/Riyadh" });
};

/** The parent's real subscription record, straight from the database. */
export function SubscriptionCard() {
  const { t, lang } = useI18n();
  const token = readPinToken();
  const load = useServerFn(getMySubscription);
  const { data, isLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => load({ data: { token } }),
  });

  const active = data?.active;
  const plan = active ? PLAN_LABEL[active.plan] : null;

  return (
    <div className="rounded-[2rem] border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-ink">{t("اشتراكك", "Your subscription")}</h2>
        <CreditCard className="h-5 w-5 text-ink-soft" aria-hidden="true" />
      </div>
      {isLoading ? (
        <div className="mt-3 h-12 animate-pulse rounded-2xl bg-cream" />
      ) : plan ? (
        <>
          <p className="mt-3 font-display text-lg font-extrabold text-ink">{plan[lang]}</p>
          <p className="mt-1 text-xs text-ink-soft">
            {t("نشط حتى", "Active until")} {formatDate(active.end_date)}
          </p>
          <span className="mt-3 inline-block rounded-full bg-turq/20 px-3 py-1 text-[0.7rem] font-bold text-turq-deep">
            {t("اشتراك تجريبي — بدون دفع", "Prototype — no payment taken")}
          </span>
        </>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {t(
            "لا يوجد اشتراك نشط بعد. جرّبي الخطة من قسم الاشتراك في الصفحة الرئيسية.",
            "No active subscription yet. Try a plan from the subscription section on the homepage.",
          )}
        </p>
      )}
    </div>
  );
}

export default SubscriptionCard;