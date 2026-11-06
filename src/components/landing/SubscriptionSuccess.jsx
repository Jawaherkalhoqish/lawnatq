import { useI18n } from "@/lib/preferences";

/** The friendly confirmation shown once a prototype subscription is active. */
export default function SubscriptionSuccess({ planLabel }) {
  const { t } = useI18n();

  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-6 flex flex-col items-center gap-2 rounded-[1.5rem] bg-aqua/70 p-6 text-center ring-1 ring-turq/40"
    >
      <p className="font-display text-lg font-extrabold leading-snug text-ink sm:text-xl">
        تم الاشتراك بنجاح! نتمنى لكم تجربة ممتعة مع لونطق.
      </p>
      <p className="text-sm font-semibold leading-relaxed text-ink sm:text-base" dir="ltr">
        Your subscription has been activated successfully! Enjoy your experience with LAWNATQ.
      </p>
      {planLabel ? (
        <p className="mt-1 text-xs font-bold text-turq-deep sm:text-sm">{planLabel}</p>
      ) : (
        <span className="sr-only">{t("الاشتراك نشط", "Subscription active")}</span>
      )}
    </div>
  );
}