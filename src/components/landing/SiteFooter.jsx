import { Link } from "@tanstack/react-router";
import Logo from "@/components/brand/Logo";
import { useI18n } from "@/lib/preferences";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="scroll-mt-24 border-t border-border bg-cream/60">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="h-14" wordmark />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              {t(
                "لونُطق مساحة تعبير للأطفال من ٥ إلى ١٠ سنوات، تجمع بطاقات التواصل والرسم والقصص التفاعلية بمشاركة الوالدين.",
                "LAWNATQ is an expression space for children aged 5–10, bringing together communication cards, drawing and interactive stories with parents.",
              )}
            </p>
            <p className="mt-4 rounded-2xl bg-card px-4 py-3 text-xs leading-relaxed text-ink-soft ring-1 ring-border">
              {t(
                "لونُطق ليست أداة تشخيص أو علاج، ولا تستبدل مختصًا. هي مساحة تعبير فقط.",
                "LAWNATQ is not a diagnostic or therapeutic tool and does not replace a specialist. It is an expression space.",
              )}
            </p>
          </div>

          <nav aria-label={t("الأنشطة", "Activities")}>
            <h3 className="text-sm font-bold text-ink">{t("الأنشطة", "Activities")}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              <li><Link to="/cards" className="transition hover:text-ink">{t("بطاقات التواصل", "Communication cards")}</Link></li>
              <li><Link to="/colors" className="transition hover:text-ink">{t("ألواني — الرسم والتلوين", "My colors — drawing")}</Link></li>
              <li><Link to="/story" className="transition hover:text-ink">{t("قصتي أنا", "My story")}</Link></li>
              <li><Link to="/stories" className="transition hover:text-ink">{t("القصص التفاعلية", "Interactive stories")}</Link></li>
              <li><Link to="/assistant" className="transition hover:text-ink">{t("المرافق", "Companion")}</Link></li>
            </ul>
          </nav>

          <nav aria-label={t("للوالدين", "For parents")}>
            <h3 className="text-sm font-bold text-ink">{t("للوالدين", "For parents")}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              <li><Link to="/dashboard" className="transition hover:text-ink">{t("لوحة الوالد", "Parent dashboard")}</Link></li>
              <li><Link to="/insights" className="transition hover:text-ink">{t("رؤى النشاط", "Activity insights")}</Link></li>
              <li><Link to="/settings" className="transition hover:text-ink">{t("الإعدادات والوصول", "Settings & accessibility")}</Link></li>
              <li><Link to="/privacy" className="transition hover:text-ink">{t("الخصوصية والأمان", "Privacy & safety")}</Link></li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex justify-center border-t border-border pt-6">
          <p className="text-center text-xs leading-relaxed text-ink-soft">
            © 2026 LAWNATQ | صُمّم بحب، لأن لكل طفل حكاية تستحق أن تُنطق.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;