import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import Logo from "@/components/brand/Logo";
import LangToggle from "@/components/brand/LangToggle";
import MusicSettings from "@/components/sound/MusicSettings";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/lib/preferences";

/** The one navigation used on every public page — pages first, then homepage sections. */
const links = [
  { to: "/", ar: "الرئيسية", en: "Home" },
  { href: "/#how", ar: "كيف يعمل", en: "How it works" },
  { href: "/#activities", ar: "الأنشطة", en: "Activities" },
  { to: "/stories", ar: "القصص", en: "Stories" },
  { to: "/dashboard", ar: "للوالدين", en: "For parents" },
  { href: "/#subscribe", ar: "الاشتراك", en: "Subscription" },
  { href: "/#contact", ar: "اتصل بنا", en: "Contact us" },
];

export function TopNav() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const close = () => setOpen(false);
  const isDark = resolvedTheme === "dark";
  const linkClass = "rounded-full px-2.5 py-2 text-sm font-semibold text-ink-soft transition hover:bg-cream hover:text-ink xl:px-3";

  const panel = (
    <div className="fixed inset-0 z-[80]">
      <div onClick={close} className="absolute inset-0 bg-ink/45 backdrop-blur-sm" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("القائمة", "Menu")}
        className="absolute inset-y-0 end-0 flex w-[86%] max-w-sm flex-col gap-1 overflow-y-auto bg-background p-5 shadow-lift animate-in slide-in-from-bottom-0"
      >
        <div className="flex items-center justify-between">
          <Logo className="h-8" wordmark />
          <button
            type="button"
            onClick={close}
            aria-label={t("إغلاق القائمة", "Close menu")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-3 flex flex-col gap-1" aria-label={t("أقسام الموقع", "Site sections")}>
          {links.map((l) =>
            l.href ? (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                className="rounded-2xl px-4 py-3 text-base font-semibold text-ink transition hover:bg-cream"
              >
                {t(l.ar, l.en)}
              </a>
            ) : (
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
            ),
          )}
        </nav>

        <div className="mt-3 space-y-2 border-t border-border pt-4">
          <MusicSettings />
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-card px-4 py-3 ring-1 ring-border">
            <span className="text-sm font-bold text-ink">{t("اللغة", "Language")}</span>
            <LangToggle />
          </div>
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex w-full items-center justify-between gap-3 rounded-2xl bg-card px-4 py-3 ring-1 ring-border"
          >
            <span className="text-sm font-bold text-ink">{t("المظهر", "Appearance")}</span>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft">
              {isDark ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
              {isDark ? t("ليلي", "Dark") : t("نهاري", "Light")}
            </span>
          </button>
        </div>

        <a
          href="mailto:lonotq@gmail.com"
          onClick={close}
          className="mt-3 rounded-2xl px-4 py-3 text-sm font-semibold text-ink-soft transition hover:bg-cream hover:text-ink"
        >
          lonotq@gmail.com
        </a>
      </aside>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 shadow-[0_10px_30px_-26px_hsl(var(--ink)/0.45)] backdrop-blur-xl">
      <div className="mx-auto flex h-15 max-w-7xl items-center justify-between gap-2 px-4 sm:h-[4.25rem] sm:px-8">
        <Link to="/" onClick={close} className="flex shrink-0 items-center gap-2" aria-label="لونُطق — LAWNATQ">
          <Logo className="h-8 sm:h-9" wordmark />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label={t("التنقل الرئيسي", "Main navigation")}>
          {links.map((l) =>
            l.href ? (
              <a key={l.href} href={l.href} className={linkClass}>
                {t(l.ar, l.en)}
              </a>
            ) : (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className={linkClass}
                activeProps={{ className: "bg-cream text-ink" }}
              >
                {t(l.ar, l.en)}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-1.5">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex h-9 items-center rounded-full bg-lav-deep px-4 text-xs font-bold text-primary-foreground transition hover:brightness-110 sm:text-sm"
            >
              {t("مساحتي", "My space")}
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-xs font-bold text-background transition hover:opacity-90 sm:text-sm"
            >
              {t("دخول", "Login")}
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-label={t("القائمة", "Menu")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-ink"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* The side menu: navigation on small screens, language and theme everywhere. */}
      {mounted && open ? createPortal(panel, document.body) : null}
      <span className="sr-only" aria-live="polite">
        {open ? t("القائمة مفتوحة", "Menu opened") : ""}
      </span>
    </header>
  );
}

export default TopNav;