import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import Logo from "@/components/brand/Logo";
import LangToggle from "@/components/brand/LangToggle";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

/** The one navigation used on every public page. */
const links = [
  { to: "/", ar: "الرئيسية", en: "Home" },
  { to: "/cards", ar: "البطاقات", en: "Cards" },
  { to: "/colors", ar: "الرسم", en: "Drawing" },
  { to: "/story", ar: "قصتي", en: "My story" },
  { to: "/stories", ar: "القصص التفاعلية", en: "Interactive stories" },
  { to: "/assistant", ar: "المرافق", en: "Companion" },
];

export function TopNav() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" onClick={close} className="flex shrink-0 items-center gap-2.5" aria-label="لونُطق — LAWNATQ">
          <Logo className="h-12" wordmark />
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label={t("التنقل الرئيسي", "Main navigation")}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-ink-soft transition hover:bg-cream hover:text-ink"
              activeProps={{ className: "bg-cream text-ink" }}
            >
              {t(l.ar, l.en)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle className="hidden sm:inline-flex" />
          <ThemeToggle className="hidden sm:inline-flex" />
          <Link
            to="/dashboard"
            className="hidden h-11 items-center rounded-full px-4 text-sm font-semibold text-ink transition hover:bg-cream lg:inline-flex"
          >
            {t("لوحة الوالد", "Parent dashboard")}
          </Link>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex h-11 items-center rounded-full bg-turq px-5 text-sm font-bold text-turq-deep transition hover:brightness-105"
            >
              {t("مساحتي", "My space")}
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-bold text-background transition hover:opacity-90"
            >
              {t("تسجيل الدخول", "Login")}
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={t("القائمة", "Menu")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div id="mobile-nav" className={cn("border-t border-border/70 bg-background xl:hidden", open ? "block" : "hidden")}>
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={close}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-2xl px-4 py-3 text-base font-semibold text-ink transition hover:bg-cream"
              activeProps={{ className: "bg-cream" }}
            >
              {t(l.ar, l.en)}
            </Link>
          ))}
          <Link
            to="/dashboard"
            onClick={close}
            className="rounded-2xl px-4 py-3 text-base font-semibold text-ink transition hover:bg-cream"
          >
            {t("لوحة الوالد", "Parent dashboard")}
          </Link>
          <div className="mt-3 flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNav;