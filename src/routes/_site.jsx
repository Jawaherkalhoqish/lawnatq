import { Outlet, createFileRoute } from "@tanstack/react-router";
import TopNav from "@/components/landing/TopNav";
import SiteFooter from "@/components/landing/SiteFooter";

/** Public site shell: one header and one footer for every visitor page. */
export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-background"
      >
        تخطَّ إلى المحتوى / Skip to content
      </a>
      <TopNav />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}