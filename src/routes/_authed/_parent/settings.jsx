import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, LogOut, Moon, ShieldCheck, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import ChangePinCard from "@/components/parent/ChangePinCard";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useI18n, usePrefs } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/_parent/settings")({
  head: () => ({ meta: [{ title: "الإعدادات | لونُطق" }] }),
  component: SettingsPage,
});

function Row({ title, hint, children }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-5 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-sm">
        <p className="text-sm font-bold text-ink">{title}</p>
        {hint && <p className="mt-1 text-xs leading-relaxed text-ink-soft">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SettingsPage() {
  const { t, lang } = useI18n();
  const { lang: current, textSize, motion, voice, update } = usePrefs();
  const { theme, setTheme } = useTheme();
  const { user, logout, refresh } = useAuth();
  const [name, setName] = useState(user?.full_name ?? "");
  const [saving, setSaving] = useState(false);

  async function saveName() {
    setSaving(true);
    try {
      await base44.auth.updateMe({ full_name: name.trim() });
      await refresh();
      toast.success(t("حُفظ اسمك", "Your name is saved"));
    } catch {
      toast.error(t("تعذّر الحفظ", "Could not save"));
    } finally {
      setSaving(false);
    }
  }

  const textSizes = [
    { value: "small", label: t("صغير", "Small") },
    { value: "normal", label: t("عادي", "Normal") },
    { value: "large", label: t("كبير", "Large") },
    { value: "xlarge", label: t("أكبر", "Largest") },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{t("الإعدادات والوصول", "Settings & accessibility")}</h1>
        <p className="mt-2 text-ink-soft">
          {t("هذه الخيارات تُطبَّق على الموقع كله، وتُحفظ في حسابك.", "These apply across the whole site and are saved to your account.")}
        </p>
      </header>

      <section className="rounded-[2rem] border border-border bg-card p-6">
        <h2 className="font-display text-lg font-extrabold text-ink">{t("اللغة والمظهر", "Language & appearance")}</h2>

        <Row title={t("لغة الموقع", "Site language")} hint={t("يتغير كل النص والاتجاه فورًا.", "All copy and direction change instantly.")}>
          <div className="inline-flex rounded-full bg-cream p-1">
            {[{ v: "ar", l: "العربية" }, { v: "en", l: "English" }].map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() => update({ lang: opt.v, persist: true }, { persist: true })}
                aria-pressed={current === opt.v}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-bold transition",
                  current === opt.v ? "bg-ink text-background" : "text-ink-soft",
                )}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </Row>

        <Row title={t("الوضع", "Theme")} hint={t("النهاري هو الافتراضي بهوية لونُطق الهادئة.", "Light is the default LAWNATQ look.")}>
          <div className="inline-flex gap-2">
            {[
              { v: "light", label: t("نهاري", "Light"), icon: Sun },
              { v: "dark", label: t("ليلي", "Dark"), icon: Moon },
            ].map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() => setTheme(opt.v)}
                aria-pressed={theme === opt.v}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition",
                  theme === opt.v ? "border-ink/20 bg-ink text-background" : "border-border text-ink-soft hover:text-ink",
                )}
              >
                <opt.icon className="h-4 w-4" aria-hidden="true" />
                {opt.label}
              </button>
            ))}
          </div>
        </Row>

        <Row title={t("حجم النص", "Text size")} hint={t("يكبّر النص في كل الصفحات.", "Scales text on every page.")}>
          <div className="flex flex-wrap gap-1.5">
            {textSizes.map((size) => (
              <button
                key={size.value}
                type="button"
                onClick={() => update({ textSize: size.value, persist: true }, { persist: true })}
                aria-pressed={textSize === size.value}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-sm font-bold transition",
                  textSize === size.value ? "border-ink/20 bg-ink text-background" : "border-border text-ink-soft hover:text-ink",
                )}
              >
                {size.label}
              </button>
            ))}
          </div>
        </Row>

        <Row title={t("تقليل الحركة", "Reduce motion")} hint={t("يوقف الانتقالات والحركات التلقائية.", "Turns off transitions and automatic motion.")}>
          <Switch
            checked={motion === "reduced"}
            onCheckedChange={(checked) => update({ motion: checked ? "reduced" : "full", persist: true }, { persist: true })}
            aria-label={t("تقليل الحركة", "Reduce motion")}
          />
        </Row>

        <Row title={t("الصوت", "Sound")} hint={t("قراءة البطاقات والقصص بصوت المتصفح.", "Reads cards and stories with the browser voice.")}>
          <Switch
            checked={voice}
            onCheckedChange={(checked) => update({ voice: checked, persist: true }, { persist: true })}
            aria-label={t("الصوت", "Sound")}
          />
        </Row>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6">
        <h2 className="font-display text-lg font-extrabold text-ink">{t("حساب الوالد", "Parent account")}</h2>
        <div className="mt-4 space-y-2">
          <Label htmlFor="account-name">{t("الاسم", "Name")}</Label>
          <div className="flex gap-2">
            <Input id="account-name" value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-2xl" />
            <button
              type="button"
              onClick={saveName}
              disabled={saving}
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-background disabled:opacity-60"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              {t("حفظ", "Save")}
            </button>
          </div>
          <p className="pt-1 text-xs text-ink-soft">
            {t("البريد:", "Email:")} <span dir="ltr">{user?.email}</span>
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/privacy"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-bold text-ink transition hover:bg-cream"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {t("الخصوصية والأمان", "Privacy & safety")}
          </Link>
          <button
            type="button"
            onClick={() => logout()}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-bold text-ink-soft transition hover:bg-cream hover:text-ink"
          >
            <LogOut className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            {t("تسجيل الخروج", "Log out")}
          </button>
        </div>
      </section>

      <ChangePinCard />

      <p className="px-1 text-xs leading-relaxed text-ink-soft">
        {t(
          "ملاحظة: لونُطق مساحة تعبير، وليست أداة تشخيص أو تقييم. لا نجمع معلومات صحية غير ما تختارين مشاركته اختياريًا.",
          "Note: LAWNATQ is an expression space, not a diagnostic or assessment tool. We do not collect health information beyond what you optionally share.",
        )}
      </p>
    </div>
  );
}