import { WORLD_IMAGES } from "@/lib/brand-asset";

/**
 * «عالمي» — the four approved worlds, in the approved order.
 *
 * One single list, used by the homepage AND by the child's own space, so both
 * places always show the same four cards: same order, same approved images,
 * same names and descriptions, same destinations. Never duplicate this list.
 */
export const worlds = [
  {
    key: "small-world",
    // The approved «عالمي الصغير» illustration: the smiling child between the
    // apple card and the water-glass card. Used exactly as supplied.
    images: [WORLD_IMAGES.cards],
    bg: "bg-coral/12",
    ring: "ring-coral/25",
    accent: "text-coral-deep",
    glow: "shadow-[0_18px_40px_-24px_hsl(var(--coral)/0.85)]",
    title: { ar: "عالمي الصغير", en: "My little world" },
    body: {
      ar: "مشاعري واحتياجاتي وبطاقاتي التي رسمتها.",
      en: "My feelings, my needs and the cards I drew.",
    },
    site: "/cards",
    kid: "/cards",
  },
  {
    key: "qissati",
    images: [WORLD_IMAGES.story],
    bg: "bg-lav/15",
    ring: "ring-lav/30",
    accent: "text-lav-deep",
    glow: "shadow-[0_18px_40px_-24px_hsl(var(--lav)/0.85)]",
    title: { ar: "قصتي", en: "My stories" },
    body: {
      ar: "قصتان تفاعليتان: يومي الأول بالمدرسة، ومغامرة السلحفاة الصغيرة.",
      en: "Two interactive stories: my first day at school, and the little turtle's adventure.",
    },
    site: "/stories",
    kid: "/stories",
  },
  {
    key: "mosaedi",
    images: [WORLD_IMAGES.assistant],
    bg: "bg-turq/14",
    ring: "ring-turq/25",
    accent: "text-turq-deep",
    glow: "shadow-[0_18px_40px_-24px_hsl(var(--turq)/0.85)]",
    title: { ar: "مساعدي", en: "My helper" },
    body: {
      ar: "صديق ودود يجيب بكلمات بسيطة.",
      en: "A friendly friend who answers in simple words.",
    },
    site: "/assistant",
    kid: "/assistant",
  },
  {
    key: "alwani",
    images: [WORLD_IMAGES.colors],
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
    kid: "/draw",
  },
];

/** The My Feelings category id inside the communication-card library. */
export const FEELINGS_CATEGORY = "04_Feelings";