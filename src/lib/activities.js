import { WORLD_IMAGES } from "@/lib/brand-asset";

/**
 * Two approved lists, one source of illustrations.
 *
 * The homepage shows exactly four worlds; «بيتي» (the child's own space) shows
 * five, with مساعدي added. Every image below is an approved LAWNATQ file.
 */
export const homeWorlds = [
  {
    key: "bitqati",
    image: WORLD_IMAGES.cards,
    bg: "bg-coral/12",
    ring: "ring-coral/25",
    accent: "text-coral-deep",
    glow: "shadow-[0_18px_40px_-24px_hsl(var(--coral)/0.85)]",
    title: { ar: "بطاقاتي", en: "My cards" },
    body: {
      ar: "بطاقات المشاعر والاحتياجات والأفعال، مع إضافة بطاقاتكم الخاصة.",
      en: "Feelings, needs and action cards, plus your own family cards.",
    },
    site: "/cards",
  },
  {
    key: "mashaeri",
    image: WORLD_IMAGES.feelings,
    bg: "bg-rose/15",
    ring: "ring-rose/30",
    accent: "text-rose-deep",
    glow: "shadow-[0_18px_40px_-24px_hsl(var(--rose)/0.9)]",
    title: { ar: "مشاعري", en: "My feelings" },
    body: {
      ar: "بطاقات تُسمّي المشاعر بهدوء، بلا إلزام ولا تقييم.",
      en: "Cards that name feelings calmly, without pressure or judgement.",
    },
    site: "/cards",
  },
  {
    key: "qissati",
    image: WORLD_IMAGES.story,
    bg: "bg-lav/15",
    ring: "ring-lav/30",
    accent: "text-lav-deep",
    glow: "shadow-[0_18px_40px_-24px_hsl(var(--lav)/0.85)]",
    title: { ar: "قصتي", en: "My stories" },
    body: {
      ar: "قصص مصوّرة يتشارك فيها الطفل القرار، ويسمع السرد بصوته ولغته.",
      en: "Illustrated stories where the child makes the choices and hears the narration.",
    },
    site: "/stories",
  },
  {
    key: "alwani",
    image: WORLD_IMAGES.colors,
    bg: "bg-sun/15",
    ring: "ring-sun/30",
    accent: "text-sun-deep",
    glow: "shadow-[0_18px_40px_-24px_hsl(var(--sun)/0.9)]",
    title: { ar: "ألواني", en: "My colors" },
    body: {
      ar: "استوديو رسم وتلوين بألوان لونُطق، ورسومات جاهزة بخطوط واسعة.",
      en: "A drawing and coloring studio with LAWNATQ colors and bold-line templates.",
    },
    site: "/colors",
  },
];

/** «بيتي» — the five cards inside the child's own space. */
export const kidWorlds = [
  {
    key: "bitqati",
    image: WORLD_IMAGES.cards,
    title: { ar: "بطاقاتي", en: "My cards" },
    kidBody: { ar: "أختار بطاقة تعبّر عني.", en: "I pick a card that shows what I mean." },
    kid: "/cards",
  },
  {
    key: "mashaeri",
    image: WORLD_IMAGES.feelings,
    title: { ar: "مشاعري", en: "My feelings" },
    kidBody: { ar: "أسمّي شعوري بكلمات بسيطة.", en: "I name my feeling in simple words." },
    kid: "/cards",
  },
  {
    key: "alwani",
    image: WORLD_IMAGES.colors,
    title: { ar: "ألواني", en: "My colors" },
    kidBody: { ar: "أرسم وألوّن بحرية، بلا قواعد.", en: "Draw and color freely, no rules." },
    kid: "/draw",
  },
  {
    key: "qissati",
    image: WORLD_IMAGES.story,
    title: { ar: "قصتي", en: "My stories" },
    kidBody: { ar: "أختار ما يحدث في الحكاية.", en: "I choose what happens in the tale." },
    kid: "/stories",
  },
  {
    key: "mosaedi",
    image: WORLD_IMAGES.assistant,
    title: { ar: "مساعدي", en: "My helper" },
    kidBody: { ar: "صديق ودود يجيب بكلمات بسيطة.", en: "A friendly friend who answers simply." },
    kid: "/assistant",
  },
];

/** The My Feelings category id inside the communication-card library. */
export const FEELINGS_CATEGORY = "04_Feelings";