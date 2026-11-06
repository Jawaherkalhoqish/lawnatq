import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CalendarClock, Info } from "lucide-react";
import { toast } from "sonner";
import AppointmentList from "@/components/parent/AppointmentList";
import BookingDialog from "@/components/parent/BookingDialog";
import SpecialistCard from "@/components/parent/SpecialistCard";
import { useChildren } from "@/hooks/useFamily";
import { cancelAppointment, getAppointments, getSpecialists } from "@/lib/appointment-fns";
import { readPinToken } from "@/lib/pin-session";
import { useI18n } from "@/lib/preferences";

export const Route = createFileRoute("/_authed/_parent/appointments")({
  head: () => ({ meta: [{ title: "المواعيد والاستشارات | لونُطق" }] }),
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const { t, lang } = useI18n();
  const token = readPinToken();
  const listAppointments = useServerFn(getAppointments);
  const listSpecialists = useServerFn(getSpecialists);
  const cancel = useServerFn(cancelAppointment);
  const queryClient = useQueryClient();

  const { data: children } = useChildren();
  const { data: appointments, refetch } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => listAppointments({ data: { token } }),
  });
  const { data: directory } = useQuery({ queryKey: ["specialists"], queryFn: () => listSpecialists({ data: {} }) });
  const [booking, setBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const specialists = directory?.specialists ?? [];
  const categories = directory?.categories ?? [];

  async function onCancel(id) {
    setCancelling(true);
    try {
      const res = await cancel({ data: { token, id } });
      if (!res.ok) throw new Error();
      toast.success(t("أُلغي الطلب", "Request cancelled"));
      refetch();
    } catch {
      toast.error(t("تعذّر الإلغاء", "Could not cancel"));
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
          {t("المواعيد والاستشارات", "Appointments and consultations")}
        </h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          {t(
            "دليل مختصين داخلي بصفحات تجريبية للعرض: اختاري مختصًا ووقتًا، أرسلي طلب موعد تجريبي، وتابعيه من هنا ومن لوحة الوالد.",
            "An internal specialist directory with demonstration profiles: pick a specialist and a time, send a demo request, and follow it here and on your dashboard.",
          )}
        </p>
      </header>

      <article className="flex flex-col rounded-[2rem] border border-border bg-card p-6 shadow-soft">
        <span className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-lav/20 text-lav-deep">
          <CalendarClock className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-xl font-extrabold text-ink">
          {t("احجزي مع مختص من لونُطق", "Book a LAWNATQ specialist")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {t(
            "اختاري مختصًا، اطّلعي على ملفه ووقته وقيمة الجلسة، ثم أرسلي طلب موعد وتابعي حالته من هنا.",
            "Choose a specialist, review the profile, time and session fee, then send a request and follow its status here.",
          )}
        </p>
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-cream p-3 text-xs leading-relaxed text-ink-soft">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {t(
            "كل الأسماء والأسعار والأوقات في هذا الدليل بيانات تجريبية للعرض فقط: ليست مختصين حقيقيين، ولا تحمل ترخيصًا، ولا تُعد حجزًا مؤكدًا.",
            "Every name, price and time in this directory is demonstration data only: these are not real or licensed specialists, and nothing is a confirmed booking.",
          )}
        </p>
      </article>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-extrabold text-ink">{t("المختصون المتاحون", "Available specialists")}</h2>

        {categories.length ? (
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <span key={category.id} className="shrink-0 rounded-full bg-cream px-3.5 py-1.5 text-xs font-bold text-ink-soft">
                {lang === "ar" ? category.title_ar : category.title_en}
              </span>
            ))}
          </div>
        ) : null}

        {specialists.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {specialists.map((specialist) => (
              <SpecialistCard key={specialist.id} specialist={specialist} onBook={setBooking} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-border bg-card p-6 text-sm leading-relaxed text-ink-soft">
            <p className="font-bold text-ink">{t("الخدمة جاهزة، ولم يُضف مختصون بعد", "The service is ready; no specialists added yet")}</p>
            <p className="mt-2">
              {t(
                "لا نعرض أي مختص أو ترخيص غير حقيقي. يضيف المسؤول المختصين وأوقاتهم وموافقتهم المهنية، ثم يظهرون هنا مباشرة.",
                "We never show an invented specialist, license or time. An administrator adds real specialists with their qualifications and slots, and they appear here.",
              )}
            </p>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-extrabold text-ink">{t("طلباتي", "My requests")}</h2>
        <AppointmentList items={appointments?.items} onCancel={onCancel} cancelling={cancelling} />
      </section>

      {booking ? (
        <BookingDialog
          specialist={booking}
          children={children}
          token={token}
          open={Boolean(booking)}
          onOpenChange={(open) => !open && setBooking(null)}
          onBooked={() => {
            refetch();
            queryClient.invalidateQueries({ queryKey: ["specialists"] });
          }}
        />
      ) : null}
    </div>
  );
}