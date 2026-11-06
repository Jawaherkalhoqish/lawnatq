import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export const STATUS_STYLE = {
  pending: { className: "bg-sun/25 text-sun-deep", ar: "بانتظار التأكيد", en: "Pending" },
  confirmed: { className: "bg-turq/20 text-turq-deep", ar: "مؤكد", en: "Confirmed" },
  cancelled: { className: "bg-destructive/12 text-destructive", ar: "ملغى", en: "Cancelled" },
  completed: { className: "bg-lav/25 text-lav-deep", ar: "مكتمل", en: "Completed" },
};

export function StatusBadge({ status }) {
  const { t } = useI18n();
  const style = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
  return (
    <span className={cn("rounded-full px-3 py-1 text-[0.7rem] font-bold", style.className)}>
      {t(style.ar, style.en)}
    </span>
  );
}

const formatDate = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Riyadh" });
};

/** The parent's saved requests with their real status. */
export function AppointmentList({ items, onCancel, cancelling }) {
  const { t } = useI18n();

  if (!items?.length) {
    return (
      <p className="rounded-[2rem] border border-dashed border-border bg-card p-6 text-center text-sm text-ink-soft">
        {t("لا توجد طلبات مواعيد بعد.", "No appointment requests yet.")}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="rounded-[1.5rem] border border-border bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-base font-extrabold text-ink">
                {item.specialist_name || t("مختص من لونُطق", "LAWNATQ specialist")}
              </p>
              <p className="mt-0.5 text-xs text-ink-soft">{formatDate(item.scheduled_at)}</p>
              {item.price ? (
                <p className="mt-1 text-xs font-bold text-ink-soft">
                  {t("قيمة الجلسة", "Session fee")}: {item.price} {item.currency || "SAR"}
                </p>
              ) : null}
            </div>
            <StatusBadge status={item.status} />
          </div>
          {(item.status === "pending" || item.status === "confirmed") && (
            <button
              type="button"
              onClick={() => onCancel(item.id)}
              disabled={cancelling}
              className="mt-3 text-xs font-bold text-destructive hover:underline disabled:opacity-50"
            >
              {t("إلغاء الطلب", "Cancel request")}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default AppointmentList;