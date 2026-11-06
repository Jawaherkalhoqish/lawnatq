import { Star } from "lucide-react";
import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

const TOPIC_LABEL = {
  activities: { ar: "الأنشطة", en: "Activities" },
  website: { ar: "الموقع", en: "The website" },
  specialists: { ar: "المواعيد والمختصون", en: "Appointments" },
  other: { ar: "اقتراح آخر", en: "Something else" },
};

const formatDate = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Riyadh" });
};

/** The parent's saved feedback, newest first. */
export function FeedbackHistory({ items }) {
  const { t, lang } = useI18n();

  if (!items?.length) {
    return (
      <p className="rounded-[2rem] border border-dashed border-border bg-card p-6 text-center text-sm text-ink-soft">
        {t("لم ترسلي ملاحظات بعد.", "You have not sent feedback yet.")}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const topic = TOPIC_LABEL[item.topic] ?? TOPIC_LABEL.other;
        return (
          <li key={item.id} className="rounded-[1.5rem] border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1" aria-label={`${item.rating}/5`}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={cn("h-4 w-4", item.rating >= value ? "fill-sun text-sun-deep" : "text-ink-soft/40")}
                    aria-hidden="true"
                  />
                ))}
              </span>
              <span className="rounded-full bg-cream px-3 py-1 text-[0.7rem] font-bold text-ink-soft">
                {lang === "ar" ? topic.ar : topic.en}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink">{item.comment}</p>
            <p className="mt-2 text-[0.7rem] text-ink-soft">{formatDate(item.created_date)}</p>
          </li>
        );
      })}
    </ul>
  );
}

export default FeedbackHistory;