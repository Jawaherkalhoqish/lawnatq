import { BadgeCheck, GraduationCap } from "lucide-react";
import { useI18n } from "@/lib/preferences";

/** One real specialist as configured by the administrator. Nothing is invented. */
export function SpecialistCard({ specialist, onBook }) {
  const { t, lang } = useI18n();
  const title = lang === "ar" ? specialist.title_ar : specialist.title_en;

  return (
    <article className="flex h-full flex-col rounded-[2rem] border border-border bg-card p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lav/25 font-display text-lg font-extrabold text-lav-deep">
          {specialist.name?.charAt(0)}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-extrabold text-ink">{specialist.name}</h3>
          {title ? <p className="text-xs font-semibold text-ink-soft">{title}</p> : null}
        </div>
      </div>

      {specialist.bio_ar || specialist.bio_en ? (
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
          {lang === "ar" ? specialist.bio_ar : specialist.bio_en}
        </p>
      ) : null}

      {specialist.qualifications?.length ? (
        <p className="mt-3 flex items-start gap-2 text-xs text-ink-soft">
          <GraduationCap className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{specialist.qualifications.join(" · ")}</span>
        </p>
      ) : null}

      {specialist.license_verified ? (
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-turq-deep">
          <BadgeCheck className="h-4 w-4" aria-hidden="true" />
          {t("ترخيص موثّق", "License verified")}
        </p>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
        <p className="text-sm font-bold text-ink">
          {specialist.session_price ?? 0} {specialist.currency || "SAR"}
          <span className="block text-[0.7rem] font-semibold text-ink-soft">{t("قيمة الجلسة", "per session")}</span>
        </p>
        <button
          type="button"
          onClick={() => onBook(specialist)}
          disabled={!specialist.slots?.length}
          className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-bold text-background transition hover:opacity-90 disabled:opacity-50"
        >
          {specialist.slots?.length ? t("احجزي موعدًا", "Request") : t("لا أوقات متاحة", "No slots")}
        </button>
      </div>
    </article>
  );
}

export default SpecialistCard;