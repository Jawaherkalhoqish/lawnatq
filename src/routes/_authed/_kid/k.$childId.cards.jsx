import { useMemo, useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Search, Star } from "lucide-react";
import { base44 } from "@/api/base44Client";
import CardTile from "@/components/cards/CardTile";
import FeelingsCustomCards from "@/components/cards/FeelingsCustomCards";
import SequenceTray from "@/components/cards/SequenceTray";
import { Input } from "@/components/ui/input";
import { useCardSequences, useChild } from "@/hooks/useFamily";
import { FEELINGS_CATEGORY } from "@/lib/activities";
import { cardByKey, cardCategories, cardImage, cards, toneClasses } from "@/lib/cards";
import { speak, useI18n, usePrefs } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/_kid/k/$childId/cards")({
  head: () => ({ meta: [{ title: "بطاقاتي | لونُطق" }] }),
  component: CardsPage,
});

function CardsPage() {
  const { childId } = useParams({ strict: false });
  const { t, lang } = useI18n();
  const { voice } = usePrefs();
  const queryClient = useQueryClient();
  const { data: child } = useChild(childId);
  const { data: sequences } = useCardSequences(childId, 4);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState([]);

  const favorites = child?.favorite_cards ?? [];

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((card) => {
      if (category !== "all" && card.cat !== category) return false;
      if (favoritesOnly && !favorites.includes(card.key)) return false;
      if (!q) return true;
      return card.ar.includes(q) || card.en.toLowerCase().includes(q);
    });
  }, [query, category, favoritesOnly, favorites]);

  function toggleSelect(card) {
    setSelected((prev) => {
      const exists = prev.some((c) => c.key === card.key);
      if (exists) return prev.filter((c) => c.key !== card.key);
      if (voice) speak(lang === "ar" ? card.ar : card.en, lang);
      return [...prev, card];
    });
  }

  async function toggleFavorite(key) {
    if (!child) return;
    const next = favorites.includes(key) ? favorites.filter((k) => k !== key) : [...favorites, key];
    await base44.entities.Child.update(child.id, { favorite_cards: next });
    queryClient.invalidateQueries({ queryKey: ["child", child.id] });
  }

  const lastSequence = sequences?.[0];

  return (
    <div className="space-y-5 pb-4">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-ink">{t("بطاقاتي", "My cards")}</h1>
        <p className="mt-2 text-ink-soft">
          {t("اضغط على الصور لتكوين جملتك، ثم اضغط «اقرأ».", "Tap pictures to build your sentence, then tap “Read”.")}
        </p>
      </header>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("ابحث عن بطاقة…", "Search for a card…")}
            aria-label={t("بحث في البطاقات", "Search cards")}
            className="h-12 rounded-full ps-11"
          />
        </div>
        <button
          type="button"
          onClick={() => setFavoritesOnly((v) => !v)}
          aria-pressed={favoritesOnly}
          className={cn(
            "inline-flex h-12 items-center justify-center gap-2 rounded-full border px-5 text-sm font-bold transition",
            favoritesOnly ? "border-sun/50 bg-sun/25 text-sun-deep" : "border-border bg-card text-ink-soft hover:text-ink",
          )}
        >
          <Star className={cn("h-4 w-4", favoritesOnly && "fill-current")} aria-hidden="true" />
          {t("المفضلة", "Favourites")}
        </button>
      </div>

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
        <button
          type="button"
          onClick={() => setCategory("all")}
          aria-pressed={category === "all"}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition",
            category === "all" ? "border-ink/15 bg-ink text-background" : "border-border bg-card text-ink-soft hover:text-ink",
          )}
        >
          {t("الكل", "All")}
        </button>
        {cardCategories.map((cat) => {
          const active = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              aria-pressed={active}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition",
                active ? "border-ink/15 bg-ink text-background" : cn("bg-card", toneClasses[cat.tone].chip),
              )}
            >
              {lang === "ar" ? cat.ar : cat.en}
            </button>
          );
        })}
      </div>

      {lastSequence?.card_keys?.length ? (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-cream/70 px-3 py-2.5">
          <span className="text-xs font-bold text-ink-soft">{t("آخر جملة:", "Last sentence:")}</span>
          {lastSequence.card_keys.map((key, i) => {
            const card = cardByKey[key];
            if (!card) return null;
            return (
              <span key={`${key}-${i}`} className="inline-flex items-center gap-1.5 rounded-full bg-card px-2 py-1 text-xs font-semibold text-ink">
                <img src={cardImage(card)} alt="" className="h-6 w-6 object-contain" />
                {lang === "ar" ? card.ar : card.en}
              </span>
            );
          })}
        </div>
      ) : null}

      {visible.length ? (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6">
          {visible.map((card) => (
            <CardTile
              key={card.key}
              card={card}
              selected={selected.some((c) => c.key === card.key)}
              favorite={favorites.includes(card.key)}
              onSelect={toggleSelect}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-border bg-card p-10 text-center">
          <p className="font-bold text-ink">{t("لا توجد بطاقات بهذا البحث", "No cards match this search")}</p>
          <p className="mt-1 text-sm text-ink-soft">{t("جرّب كلمة أبسط أو أزل التصفية.", "Try a simpler word or clear the filter.")}</p>
        </div>
      )}

      {category === FEELINGS_CATEGORY ? <FeelingsCustomCards child={child} /> : null}

      <div className="sticky bottom-3 z-20">
        <SequenceTray
          childId={childId}
          selected={selected}
          onRemove={(index) => setSelected((prev) => prev.filter((_, i) => i !== index))}
          onClear={() => setSelected([])}
        />
      </div>
    </div>
  );
}