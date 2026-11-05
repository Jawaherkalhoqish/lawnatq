import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import Logo from "@/components/brand/Logo";
import LangToggle from "@/components/brand/LangToggle";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

/** The one navigation used on every public page — pages first, then homepage sections. */
const links = [
  { to: "/", ar: "الرئيسية", en: "Home" },
  { href: "/#how", ar: "كيف يعمل", en: "How it works" },
  { href: "/#activities", ar: "الأنشطة", en: "Activities" },
  { to: "/stories", ar: "القصص", en: "Stories" },
  { href: "/#contact", ar: "اتصل بنا", en: "Contact us" },
];

export function TopNav() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const linkClass = "rounded-full px-2.5 py-2 text-sm font-semibold text-ink-soft transition hover:bg-cream hover:text-ink xl:px-3";

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 shadow-[0_10px_30px_-26px_hsl(var(--ink)/0.45)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 sm:h-[4.5rem] sm:px-8">
        <Link to="/" onClick={close} className="flex shrink-0 items-center gap-2.5" aria-label="لونُطق — LAWNATQ">
          <Logo className="h-10 sm:h-11" wordmark />
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

        <div className="flex items-center gap-2">
          <LangToggle className="hidden sm:inline-flex" />
          <ThemeToggle className="hidden sm:inline-flex" />
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex h-10 items-center rounded-full bg-lav-deep px-5 text-sm font-bold text-primary-foreground transition hover:brightness-110"
            >
              {t("مساحتي", "My space")}
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-bold text-background transition hover:opacity-90"
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div id="mobile-nav" className={cn("border-t border-border/70 bg-background lg:hidden", open ? "block" : "hidden")}>
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
          {links.map((l) =>
            l.href ? (
              <a key={l.href} href={l.href} onClick={close} className="rounded-2xl px-4 py-3 text-base font-semibold text-ink transition hover:bg-cream">
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
          <Link to="/dashboard" onClick={close} className="rounded-2xl px-4 py-3 text-base font-semibold text-ink transition hover:bg-cream">
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