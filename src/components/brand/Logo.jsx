import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/preferences";

/** The official LAWNATQ logo (background removed) with optional wordmark. */
export function Logo({ className = "h-12 w-auto", wordmark = false, compact = false }) {
  const { t } = useI18n();
  return (
    <span className="inline-flex items-center gap-3">
      <Image
        src="/brand/logo.png"
        alt={t("شعار لونُطق", "LAWNATQ logo")}
        width={720}
        height={589}
        className={cn("w-auto object-contain select-none", className)}
        fittingType="fit"
        draggable={false}
      />
      {wordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-2xl font-extrabold tracking-tight text-ink">لونُطق</span>
          {!compact && (
            <span className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-ink-soft">
              LAWNATQ
            </span>
          )}
        </span>
      )}
    </span>
  );
}

export default Logo;