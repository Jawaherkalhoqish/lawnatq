import { Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import { cardImage } from "@/lib/cards";
import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

/** One communication card. Both labels are always shown, one per language line. */
export function CardTile({ card, selected, favorite, onSelect, onToggleFavorite }) {
  const { t } = useI18n();
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onSelect(card)}
        aria-pressed={selected}
        className={cn(
          "flex h-full w-full flex-col items-center gap-1 rounded-[1.6rem] border bg-card p-2.5 pt-3 text-center transition duration-200",
          selected
            ? "border-turq-deep/40 ring-2 ring-turq-deep/40 shadow-soft"
            : "border-border hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-soft",
        )}
      >
        <span className="grid aspect-square w-full place-items-center rounded-2xl bg-cream/70 p-1.5">
          <Image src={cardImage(card)} alt="" className="h-full w-full object-contain" />
        </span>
        <span className="mt-1 text-sm font-bold leading-tight text-ink">{card.ar}</span>
        <span className="text-[0.68rem] font-medium leading-tight text-ink-soft" dir="ltr">
          {card.en}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onToggleFavorite(card.key)}
        aria-label={t("إضافة إلى المفضلة", "Add to favourites")}
        aria-pressed={favorite}
        className={cn(
          "absolute end-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full transition",
          favorite ? "bg-sun text-sun-deep" : "bg-background/80 text-ink-soft hover:text-ink",
        )}
      >
        <Star className={cn("h-4 w-4", favorite && "fill-current")} aria-hidden="true" />
      </button>
    </div>
  );
}

export default CardTile;