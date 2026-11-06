import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CalendarDays } from "lucide-react";
import { StatusBadge } from "@/components/parent/AppointmentList";
import { getAppointments } from "@/lib/appointment-fns";
import { readPinToken } from "@/lib/pin-session";
import { useI18n } from "@/lib/preferences";

const formatSlot = (iso) =>
  iso ? new Date(iso).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Riyadh" }) : "";

/** Upcoming specialist requests, or an honest empty state. */
export function AppointmentsSummary() {
  const { t } = useI18n();
  const token = readPinToken();
  const load = useServerFn(getAppointments);
  const { data, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => load({ data: { token } }),
  });

  const items = (data?.items ?? []).filter((a) => a.status === "pending" || a.status === "confirmed").slice(0, 2);

  return (
    <div className="rounded-[2rem] border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-ink">{t("المواعيد القادمة", "Upcoming appointments")}</h2>
        <CalendarDays className="h-5 w-5 text-ink-soft" aria-hidden="true" />
      </div>
      {isLoading ? (
        <div className="mt-3 h-12 animate-pulse rounded-2xl bg-cream" />
      ) : items.length ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-2 rounded-2xl bg-cream px-3 py-2">
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-ink">{item.specialist_name || t("مختص", "Specialist")}</span>
                <span className="block text-[0.7rem] text-ink-soft">{formatSlot(item.scheduled_at)}</span>
              </span>
              <StatusBadge status={item.status} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {t("لا توجد مواعيد قادمة.", "No upcoming appointments.")}
        </p>
      )}
      <Link to="/appointments" className="mt-3 inline-block text-xs font-bold text-turq-deep hover:underline">
        {t("المواعيد والاستشارات", "Appointments and consultations")}
      </Link>
    </div>
  );
}

export default AppointmentsSummary;