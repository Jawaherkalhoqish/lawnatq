import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { avatarClasses } from "@/lib/cards";
import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

/** Horizontal child selector used on the dashboard and insights pages. */
export function ChildPicker({ children, activeId, onSelect }) {
  const { t } = useI18n();
  if (!children?.length) return null;

  return (
    <div className="no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
      {children.map((child) => {
        const active = child.id === activeId;
        return (
          <button
            key={child.id}
            type="button"
            onClick={() => onSelect(child.id)}
            aria-pressed={active}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-full border py-2 pe-5 ps-2 transition",
              active
                ? "border-ink/15 bg-card shadow-soft"
                : "border-transparent bg-cream/70 hover:bg-cream",
            )}
          >
            <span
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full font-display text-base font-extrabold",
                avatarClasses[child.avatar_color] || avatarClasses.sun,
              )}
              aria-hidden="true"
            >
              {child.name?.charAt(0)}
            </span>
            <span className="text-start">
              <span className="block text-sm font-bold text-ink">{child.name}</span>
              <span className="block text-[0.7rem] text-ink-soft">
                {child.age} {t("سنوات", "yrs")}
              </span>
            </span>
          </button>
        );
      })}
      <Link
        to="/children"
        className="flex shrink-0 items-center gap-2 rounded-full border border-dashed border-border px-4 py-2 text-sm font-bold text-ink-soft transition hover:border-ink/25 hover:text-ink"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        {t("طفل آخر", "Another child")}
      </Link>
    </div>
  );
}

export default ChildPicker;