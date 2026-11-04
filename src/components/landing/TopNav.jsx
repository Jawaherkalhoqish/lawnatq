import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import Logo from "@/components/brand/Logo";
import LangToggle from "@/components/brand/LangToggle";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

const links = [
  { href: "#how", ar: "كيف يعمل", en: "How it works" },
  { href: "#activities", ar: "الأنشطة", en: "Activities" },
  { href: "#stories", ar: "القصص", en: "Stories" },
  { href: "#parents", ar: "للوالدين", en: "For parents" },
];

export function TopNav() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5" aria-label="لونُطق — LAWNATQ">
          <Logo className="h-12" wordmark />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={t("التنقل الرئيسي", "Main navigation")}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition hover:bg-cream hover:text-ink"
            >
              {t(l.ar, l.en)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle className="hidden sm:inline-flex" />
          <ThemeToggle className="hidden sm:inline-flex" />
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:brightness-105"
            >
              {t("مساحتي", "My space")}
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden h-11 items-center rounded-full px-4 text-sm font-semibold text-ink transition hover:bg-cream sm:inline-flex"
              >
                {t("تسجيل الدخول", "Sign in")}
              </Link>
              <Link
                to="/register"
                className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-bold text-background transition hover:opacity-90"
              >
                {t("ابدأ الرحلة", "Start the journey")}
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={t("القائمة", "Menu")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className={cn("overflow-hidden border-t border-border/70 bg-background lg:hidden", open ? "block" : "hidden")}>
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-base font-semibold text-ink transition hover:bg-cream"
            >
              {t(l.ar, l.en)}
            </a>
          ))}
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