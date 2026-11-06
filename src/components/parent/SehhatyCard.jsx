import { ExternalLink, HeartPulse } from "lucide-react";
import { useI18n } from "@/lib/preferences";

/** Official Sehhaty platform. LAWNATQ only links out — nothing is booked here. */
export const SEHHATY_URL = "https://www.sehhaty.sa";

export function SehhatyCard() {
  const { t } = useI18n();
  return (
    <article className="flex h-full flex-col rounded-[2rem] border border-border bg-card p-6 shadow-soft">
      <span className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-turq/20 text-turq-deep">
        <HeartPulse className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-display text-xl font-extrabold text-ink">{t("الحجز عبر صحتي", "Booking through Sehhaty")}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
        {t(
          "يمكنك الانتقال إلى منصة صحتي للاطلاع على خدمات المواعيد الصحية والحجز من خلالها.",
          "You can go to the Sehhaty platform to see health appointment services and book through it.",
        )}
      </p>
      <a
        href={SEHHATY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-turq px-6 text-sm font-bold text-turq-deep transition hover:brightness-105 dark:text-primary-foreground"
      >
        {t("الانتقال إلى صحتي", "Go to Sehhaty")}
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
      <p className="mt-3 text-[0.7rem] leading-relaxed text-ink-soft">
        {t(
          "المواعيد الصحية تُدار في صحتي، وليس داخل لونُطق.",
          "Health appointments are managed in Sehhaty, not inside LAWNATQ.",
        )}
      </p>
    </article>
  );
}

export default SehhatyCard;