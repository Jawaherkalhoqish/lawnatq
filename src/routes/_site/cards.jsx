import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Star, Volume2, X } from "lucide-react";
import PageIntro from "@/components/site/PageIntro";
import CardTile from "@/components/cards/CardTile";
import { Image } from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import { cardCategories, cardImage, cards, toneClasses } from "@/lib/cards";
import { speak, useI18n, usePrefs } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/cards")({
  head: () => ({
    meta: [
      { title: "بطاقات التواصل | لونُطق" },
      {
        name: "description",
        content:
          "مكتبة بطاقات تواصل مصوّرة للأطفال: احتياجاتي، الأفعال، الأشخاص، المشاعر، التواصل، اختياراتي، وطلب المساعدة.",
      },
    ],
  }),
  component: CardsPage,
});

const FAV_KEY = "lawnatq_favorite_cards";

function CardsPage() {
  const { t, lang } = useI18n();
  const { voice } = usePrefs();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      setFavorites(JSON.parse(window.localStorage.getItem(FAV_KEY) || "[]"));
    } catch {
      setFavorites([]);
    }
  }, []);

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

  function toggleFavorite(key) {
    setFavorites((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      try {
        window.localStorage.setItem(FAV_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }

  const sentence = selected.map((c) => (lang === "ar" ? c.ar : c.en)).join(" ");

  return (
    <div className="pb-16">
      <PageIntro
        eyebrow={t("بطاقات التواصل", "Communication cards")}
        title={t("صورة واحدة تكفي لتقول ما تريد", "One picture is enough to say what you need")}
        description={t(
          "اضغط على البطاقات لتكوين جملتك. لا حاجة لاختيار شعور، ولا إجابة صحيحة أو خاطئة.",
          "Tap the cards to build your sentence. There is no need to pick a feeling, and no right or wrong answer.",
        )}
      />

      <div className="mx-auto mt-8 max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("ابحث عن بطاقة…", "Search for a card…")}
              aria-label={t("بحث في البطاقات", "Search cards")}
              className="h-13 rounded-full ps-11 text-base"
            />
          </div>
          <button
            type="button"
            onClick={() => setFavoritesOnly((v) => !v)}
            aria-pressed={favoritesOnly}
            className={cn(
              "inline-flex h-13 items-center justify-center gap-2 rounded-full border px-5 text-sm font-bold transition",
              favoritesOnly ? "border-sun/50 bg-sun/25 text-sun-deep" : "border-border bg-card text-ink-soft hover:text-ink",
            )}
          >
            <Star className={cn("h-4 w-4", favoritesOnly && "fill-current")} aria-hidden="true" />
            {t("المفضلة", "Favourites")}
          </button>
        </div>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setCategory("all")}
            aria-pressed={category === "all"}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2.5 text-sm font-bold transition",
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
                  "shrink-0 rounded-full border px-4 py-2.5 text-sm font-bold transition",
                  active ? "border-ink/15 bg-ink text-background" : cn("bg-card", toneClasses[cat.tone].chip),
                )}
              >
                {lang === "ar" ? cat.ar : cat.en}
              </button>
            );
          })}
        </div>

        {visible.length ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
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
          <div className="mt-8 rounded-[2rem] border border-dashed border-border bg-card p-12 text-center">
            <p className="font-bold text-ink">{t("لا توجد بطاقات بهذا البحث", "No cards match this search")}</p>
            <p className="mt-1 text-sm text-ink-soft">{t("جرّب كلمة أبسط أو أزل التصفية.", "Try a simpler word or clear the filter.")}</p>
          </div>
        )}
      </div>

      <div className="sticky bottom-3 z-20 mx-auto mt-8 max-w-7xl px-5 sm:px-8">
        <div className="rounded-[1.75rem] border border-border bg-card p-3 shadow-lift">
          {selected.length ? (
            <>
              <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
                {selected.map((card, index) => (
                  <div key={`${card.key}-${index}`} className="relative shrink-0">
                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-cream p-1">
                      <Image src={cardImage(card)} alt="" className="h-full w-full object-contain" />
                      <span className="sr-only">{lang === "ar" ? card.ar : card.en}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelected((prev) => prev.filter((_, i) => i !== index))}
                      aria-label={t("إزالة البطاقة", "Remove card")}
                      className="absolute -end-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-ink text-background"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <span className="mt-1 block max-w-16 truncate text-center text-[0.65rem] font-bold text-ink-soft">
                      {lang === "ar" ? card.ar : card.en}
                    </span>
                  </div>
                ))}
                <div className="ms-auto flex shrink-0 items-center gap-2 ps-2">
                  <button
                    type="button"
                    onClick={() => speak(sentence, lang)}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-turq px-5 text-sm font-bold text-turq-deep transition hover:brightness-105"
                  >
                    <Volume2 className="h-4 w-4" aria-hidden="true" />
                    {t("اقرأ", "Read")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelected([])}
                    className="inline-flex h-12 items-center rounded-full border border-border px-4 text-sm font-bold text-ink-soft transition hover:text-ink"
                  >
                    {t("مسح", "Clear")}
                  </button>
                </div>
              </div>
              <p className="mt-3 border-t border-border pt-2.5 text-sm font-semibold text-ink">{sentence}</p>
            </>
          ) : (
            <p className="px-3 py-2 text-center text-sm text-ink-soft">
              {t("اختر بطاقة واحدة أو أكثر، وستظهر هنا جملتك.", "Pick one or more cards and your sentence appears here.")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}