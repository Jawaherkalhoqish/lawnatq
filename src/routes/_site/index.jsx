import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/landing/Hero";
import CardStrip from "@/components/landing/CardStrip";
import HowItWorks from "@/components/landing/HowItWorks";
import Activities from "@/components/landing/Activities";
import StoryTeaser from "@/components/landing/StoryTeaser";
import Subscription from "@/components/landing/Subscription";
import ParentSection from "@/components/landing/ParentSection";
import WhyDifferent from "@/components/landing/WhyDifferent";
import FinalCta from "@/components/landing/FinalCta";
import ConnectWithUs from "@/components/landing/ConnectWithUs";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "لونُطق | LAWNATQ — لونك ينطق عنك" },
      {
        name: "description",
        content:
          "مساحة تعبير للأطفال من ٥ إلى ١٠ سنوات: بطاقات تواصل، رسم وتلوين، قصص تفاعلية، ومرافق ودود — بالعربية والإنجليزية.",
      },
      { property: "og:title", content: "لونُطق | LAWNATQ" },
      { property: "og:description", content: "لونك ينطق عنك — مساحة تعبير للأطفال بالألوان والصور والقصص." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <CardStrip />
      <HowItWorks />
      <Activities />
      <StoryTeaser />
      <Subscription />
      <WhyDifferent />
      <ParentSection />
      <FinalCta />
      <ConnectWithUs />
    </>
  );
}