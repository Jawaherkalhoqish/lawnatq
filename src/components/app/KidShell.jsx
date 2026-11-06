import { Link, Outlet, useParams } from "@tanstack/react-router";
import { ArrowRight, BookOpen, MessageCircleHeart, Palette, Sparkles, Volume2, VolumeX, LayoutGrid } from "lucide-react";
import LangToggle from "@/components/brand/LangToggle";
import MusicControl from "@/components/sound/MusicControl";
import { useChild } from "@/hooks/useFamily";
import { avatarClasses } from "@/lib/cards";
import { useI18n, usePrefs } from "@/lib/preferences";
import { cn } from "@/lib/utils";

const kidNav = [
  { path: "", icon: LayoutGrid, ar: "بيتي", en: "Home" },
  { path: "/cards", icon: MessageCircleHeart, ar: "بطاقاتي", en: "Cards" },
  { path: "/draw", icon: Palette, ar: "ألواني", en: "Colors" },
  { path: "/stories", icon: BookOpen, ar: "قصتي", en: "Stories" },
  { path: "/assistant", icon: Sparkles, ar: "مساعدي", en: "Helper" },
];

export function KidShell() {
  const { childId } = useParams({ strict: false });
  const { data: child } = useChild(childId);
  const { t } = useI18n();
  const { voice, update } = usePrefs();

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed -top-24 end-[-10%] h-72 w-72 rounded-full bg-sun/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none fixed bottom-[-6rem] start-[-8%] h-80 w-80 rounded-full bg-turq/20 blur-3xl" aria-hidden="true" />

      <header className="relative z-20 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-bold text-ink-soft transition hover:text-ink sm:text-sm"
          >
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            <span className="hidden sm:inline">{t("مساحة الوالد", "Parent space")}</span>
          </Link>

          <div className="flex items-center gap-2.5">
            {child && (
              <>
                <span
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-full font-display text-lg font-extrabold",
                    avatarClasses[child.avatar_color] || avatarClasses.sun,
                  )}
                  aria-hidden="true"
                >
                  {child.name?.charAt(0)}
                </span>
                <span className="text-start">
                  <span className="block text-xs text-ink-soft">{t("أهلًا", "Hello")}</span>
                  <span className="block font-display text-base font-extrabold text-ink">{child.name}</span>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => update({ voice: !voice }, { persist: true })}
              aria-pressed={voice}
              aria-label={voice ? t("إيقاف الصوت", "Mute sound") : t("تشغيل الصوت", "Sound on")}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full border transition",
                voice ? "border-turq/50 bg-turq/15 text-turq-deep" : "border-border bg-background text-ink-soft",
              )}
            >
              {voice ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
            <MusicControl />
            <LangToggle />
          </div>
        </div>

        <nav aria-label={t("أنشطة الطفل", "Child activities")} className="mx-auto max-w-5xl px-3 pb-3 sm:px-5">
          <ul className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {kidNav.map((item) => (
              <li key={item.path} className="shrink-0">
                <Link
                  to={`/k/$childId${item.path}`}
                  params={{ childId }}
                  activeOptions={{ exact: true }}
                  className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-bold text-ink-soft transition hover:bg-cream hover:text-ink [&.active]:bg-ink [&.active]:text-background"
                  activeProps={{ className: "active" }}
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  {t(item.ar, item.en)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default KidShell;