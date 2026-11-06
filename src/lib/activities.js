import { WORLD_IMAGES } from "@/lib/brand-asset";

/**
 * The five approved LAWNATQ worlds — one shared source for the homepage and
 * «بيتي» (the child platform). Both render this list, so an illustration or a
 * label changed here updates everywhere at once.
 */
export const activities = [
  {
    key: "bitqati",
    image: WORLD_IMAGES.cards,
    bg: "bg-turq/12",
    ring: "ring-turq/30",
    accent: "text-turq-deep",
    glow: "shadow-[0_18px_40px_-24px_hsl(var(--turq)/0.85)]",
    title: { ar: "عالم الصغير", en: "The little one's world" },
    body: {
      ar: "بطاقات المشاعر والاحتياجات والأفعال في مكان واحد، مع «إضافة بطاقاتي» لكتابة عباراتكم ورسمها.",
      en: "Feelings, needs and actions in one place, with “Add my cards” for your own phrases and drawings.",
    },
    kidBody: {
      ar: "مشاعري واحتياجاتي وبطاقاتي التي رسمتها.",
      en: "My feelings, my needs, and the cards I drew.",
    },
    site: "/cards",
    kid: "/cards",
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
    kidBody: {
      ar: "أختار ما يحدث في الحكاية.",
      en: "I choose what happens in the tale.",
    },
    site: "/stories",
    kid: "/stories",
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
    kidBody: {
      ar: "أرسم وألوّن بحرية، بلا قواعد.",
      en: "Draw and color freely, no rules.",
    },
    site: "/colors",
    kid: "/draw",
  },
  {
    key: "mosaedi",
    image: WORLD_IMAGES.assistant,
    bg: "bg-turq/12",
    ring: "ring-turq/30",
    accent: "text-turq-deep",
    glow: "shadow-[0_18px_40px_-24px_hsl(var(--turq)/0.85)]",
    title: { ar: "مساعدي", en: "My helper" },
    body: {
      ar: "مرافق ودود يجيب بكلمات بسيطة، ويقترح نشاطًا بدل أن يحكم على شيء.",
      en: "A friendly companion that answers in simple words and suggests an activity instead of judging anything.",
    },
    kidBody: {
      ar: "صديق ودود يجيب بكلمات بسيطة.",
      en: "A friendly friend who answers simply.",
    },
    site: "/assistant",
    kid: "/assistant",
  },
];

/** The My Feelings category id inside the communication-card library. */
export const FEELINGS_CATEGORY = "04_Feelings";