import { createFileRoute } from "@tanstack/react-router";
import TopNav from "@/components/landing/TopNav";
import Hero from "@/components/landing/Hero";
import CardStrip from "@/components/landing/CardStrip";
import HowItWorks from "@/components/landing/HowItWorks";
import Activities from "@/components/landing/Activities";
import StoryTeaser from "@/components/landing/StoryTeaser";
import ParentSection from "@/components/landing/ParentSection";
import WhyDifferent from "@/components/landing/WhyDifferent";
import FinalCta from "@/components/landing/FinalCta";
import SiteFooter from "@/components/landing/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "لونُطق | LAWNATQ — لونك ينطق عنك" },
      {
        name: "description",
        content:
          "مساحة تعبير للأطفال من ٥ إلى ١٠ سنوات: بطاقات تواصل، رسم وتلوين، قصص تفاعلية، ومساعد ودود — بالعربية والإنجليزية.",
      },
      { property: "og:title", content: "لونُطق | LAWNATQ" },
      { property: "og:description", content: "لونك ينطق عنك — مساحة تعبير للأطفال بالألوان والصور والقصص." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-background"
      >
        تخطَّ إلى المحتوى / Skip to content
      </a>
      <TopNav />
      <main id="main">
        <Hero />
        <CardStrip />
        <HowItWorks />
        <Activities />
        <StoryTeaser />
        <ParentSection />
        <WhyDifferent />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}