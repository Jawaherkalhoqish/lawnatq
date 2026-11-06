import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { CalendarDays, LayoutDashboard, Lock, LogOut, Sparkles, Settings as SettingsIcon, Users, ShieldCheck, Menu, X } from "lucide-react";
import Logo from "@/components/brand/Logo";
import LangToggle from "@/components/brand/LangToggle";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { useAuth } from "@/lib/AuthContext";
import { clearPinSession } from "@/lib/pin-fns";
import { clearPinToken } from "@/lib/pin-session";
import { useI18n } from "@/lib/preferences";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", icon: LayoutDashboard, ar: "لوحة الوالد", en: "Dashboard" },
  { to: "/children", icon: Users, ar: "ملفات الأطفال", en: "Children" },
  { to: "/appointments", icon: CalendarDays, ar: "المواعيد والاستشارات", en: "Appointments" },
  { to: "/insights", icon: Sparkles, ar: "الأسئلة والرؤى", en: "Insights" },
  { to: "/settings", icon: SettingsIcon, ar: "الإعدادات", en: "Settings" },
];

export function ParentShell() {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const name = user?.full_name || user?.email?.split("@")[0] || "";

  // Locking drops the PIN session on the server and here, so the next visit
  // to any parent page asks for the PIN again.
  async function lockParentArea() {
    setOpen(false);
    await clearPinSession({ data: {} }).catch(() => {});
    clearPinToken();
    navigate({ to: "/parent-pin", replace: true });
  }

  const navLink = (item) => {
    const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
    const Icon = item.icon;
    return (
      <Link
        key={item.to}
        to={item.to}
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
          active ? "bg-primary/20 text-ink" : "text-ink-soft hover:bg-cream hover:text-ink",
        )}
      >
        <Icon className={cn("h-5 w-5", active ? "text-turq-deep" : "text-ink-soft")} aria-hidden="true" />
        {t(item.ar, item.en)}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-[272px] flex-col border-e border-border bg-card p-5 lg:flex">
        <Link to="/" className="mb-8 inline-flex px-2">
          <Logo className="h-14" wordmark />
        </Link>
        <nav className="space-y-1" aria-label={t("لوحة الوالد", "Parent navigation")}>
          {nav.map(navLink)}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="rounded-3xl bg-cream p-4">
            <p className="flex items-center gap-2 text-xs font-bold text-ink">
              <ShieldCheck className="h-4 w-4 text-turq-deep" aria-hidden="true" />
              {t("مساحة خاصة بك", "Private to you")}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
              {t(
                "ملفات أطفالك وملاحظاتك تظهر لكِ فقط.",
                "Your children's profiles and notes are visible only to you.",
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={lockParentArea}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-cream"
          >
            <Lock className="h-4 w-4" aria-hidden="true" />
            {t("قفل المساحة", "Lock the area")}
          </button>
          <div className="flex items-center gap-3 rounded-2xl border border-border p-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lav/25 font-display text-sm font-extrabold text-lav-deep">
              {(name || "?").charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink">{name}</p>
              <p className="truncate text-xs text-ink-soft">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              aria-label={t("تسجيل الخروج", "Log out")}
              className="rounded-full p-2 text-ink-soft transition hover:bg-cream hover:text-ink"
            >
              <LogOut className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:ms-[272px]">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-8">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card lg:hidden"
                aria-label={t("القائمة", "Menu")}
                aria-expanded={open}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <Link to="/" className="lg:hidden">
                <Logo className="h-11" wordmark compact />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <LangToggle />
              <ThemeToggle />
            </div>
          </div>
          {open && (
            <div className="border-t border-border bg-card p-3 lg:hidden">
              <nav className="space-y-1">{nav.map(navLink)}</nav>
              <button
                type="button"
                onClick={lockParentArea}
                className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-ink hover:bg-cream"
              >
                <Lock className="h-5 w-5" aria-hidden="true" />
                {t("قفل المساحة", "Lock the area")}
              </button>
              <button
                type="button"
                onClick={() => logout()}
                className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-ink-soft hover:bg-cream"
              >
                <LogOut className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
                {t("تسجيل الخروج", "Log out")}
              </button>
            </div>
          )}
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ParentShell;