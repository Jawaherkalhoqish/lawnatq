/**
 * LAWNATQ interactive stories — three short, calm tales for ages 5–10.
 * Each scene has a setting/sky/who for the illustration, a short narration in
 * both languages, and optional choices that simply move the story forward.
 */
export const stories = [
  {
    id: "garden-door",
    tone: "lav",
    cover: { setting: "garden", sky: "dusk", who: "both" },
    title: { ar: "باب الحديقة", en: "The Garden Door" },
    subtitle: { ar: "قصة عن فضول صغير", en: "A story about a small curiosity" },
    scenes: [
      {
        setting: "garden",
        sky: "dusk",
        who: "both",
        text: {
          ar: "في آخر الحديقة، بين الشجر والعشب، وجدتُ بابًا صغيرًا ليس في أي خريطة.",
          en: "At the end of the garden, between the trees and the grass, I found a little door that was on no map.",
        },
        choices: [
          { label: { ar: "أفتح الباب", en: "Open the door" }, next: 1 },
          { label: { ar: "أنتظر حتى يطلع القمر", en: "Wait for the moon" }, next: 1 },
        ],
      },
      {
        setting: "garden",
        sky: "night",
        who: "both",
        text: {
          ar: "انفتح الباب على ضوء أزرق خفيف. القمر كان يسألني بهدوء: إلى أين؟",
          en: "The door opened onto a soft blue light. The moon seemed to ask quietly: where to?",
        },
        choices: [
          { label: { ar: "أدخل خطوة صغيرة", en: "Take one small step" }, next: 2 },
          { label: { ar: "أمشي على أطراف أصابعي", en: "Tip-toe in" }, next: 2 },
        ],
      },
      {
        setting: "moon",
        sky: "night",
        who: "both",
        text: {
          ar: "وراء الباب كانت حديقة أخرى: فراشات نائمة فوق أوراق كبيرة، ونهر صغير يهمس.",
          en: "Beyond the door was another garden: sleeping butterflies on big leaves, and a little river whispering.",
        },
        choices: null,
      },
      {
        setting: "moon",
        sky: "night",
        who: "both",
        text: {
          ar: "عدتُ وأنا أحمل ورقة صغيرة. في الصباح، سأرسم الحديقة التي لا يعرفها أحد غيري.",
          en: "I came back carrying a small leaf. In the morning, I'll draw the garden nobody knows but me.",
        },
        choices: null,
      },
    ],
  },
  {
    id: "lost-color",
    tone: "sun",
    cover: { setting: "market", sky: "day", who: "both" },
    title: { ar: "اللون الضائع", en: "The Lost Color" },
    subtitle: { ar: "قصة عن لون وشمس", en: "A story about a color and the sun" },
    scenes: [
      {
        setting: "market",
        sky: "day",
        who: "both",
        text: {
          ar: "في الصباح اختفى اللون الأصفر من كل مكان: الشمس باهتة، والليمون أبيض مثل الورق.",
          en: "In the morning the color yellow disappeared everywhere: the sun was pale and the lemons were white as paper.",
        },
        choices: [
          { label: { ar: "أسأل صاحب الدكان", en: "Ask the shopkeeper" }, next: 1 },
          { label: { ar: "أبحث في الحديقة", en: "Search the park" }, next: 1 },
        ],
      },
      {
        setting: "market",
        sky: "day",
        who: "both",
        text: {
          ar: "قال صاحب الدكان: ربما أخذه طفل يحب الرسم. ابتسم، وأعطاني قلمًا أصفر صغيرًا.",
          en: "The shopkeeper said: maybe a child who loves drawing took it. He smiled and gave me a little yellow pencil.",
        },
        choices: null,
      },
      {
        setting: "park",
        sky: "day",
        who: "both",
        text: {
          ar: "تحت الشجرة، وجدتُ طفلًا يرسم الشمس بقلمه الأصفر. الشمس في ورقته كانت تبتسم.",
          en: "Under the tree, I found a child drawing the sun with a yellow pencil. The sun on their paper was smiling.",
        },
        choices: [
          { label: { ar: "أقول: رسمتك جميلة", en: "Say: your drawing is lovely" }, next: 3 },
          { label: { ar: "أجلس بجانبه وأرسم", en: "Sit beside them and draw" }, next: 3 },
        ],
      },
      {
        setting: "park",
        sky: "day",
        who: "both",
        text: {
          ar: "ضحك وأعطاني قلمًا. صرنا نرسم شمسين: واحدة في السماء، وواحدة على الورق.",
          en: "They laughed and gave me a pencil. Together we drew two suns: one in the sky, one on paper.",
        },
        choices: null,
      },
    ],
  },
  {
    id: "moon-pillow",
    tone: "sky",
    cover: { setting: "bedroom", sky: "night", who: "both" },
    title: { ar: "القمر والوسادة", en: "The Moon and the Pillow" },
    subtitle: { ar: "قصة قبل النوم", en: "A story before sleep" },
    scenes: [
      {
        setting: "bedroom",
        sky: "night",
        who: "both",
        text: {
          ar: "لم يأتِ النعاس هذه الليلة. القمر كان قريبًا جدًا من النافذة.",
          en: "Sleep didn't come tonight. The moon was very close to the window.",
        },
        choices: [
          { label: { ar: "أحكي له عن يومي", en: "Tell it about my day" }, next: 1 },
          { label: { ar: "أطلب منه أن يبقى", en: "Ask it to stay" }, next: 1 },
        ],
      },
      {
        setting: "bedroom",
        sky: "night",
        who: "both",
        text: {
          ar: "قلتُ: هل تحرس الأحلام؟ قال بصوت هادئ: أنا أنتظر أن تحكي لي شيئًا.",
          en: "I asked: do you guard dreams? It said softly: I'm waiting for you to tell me something.",
        },
        choices: null,
      },
      {
        setting: "moon",
        sky: "night",
        who: "both",
        text: {
          ar: "حكيتُ له عن البطاقة التي استخدمتها اليوم، وعن الرسمة التي لم تكتمل بعد.",
          en: "I told it about the card I used today, and about the drawing I haven't finished yet.",
        },
        choices: [
          { label: { ar: "أغمض عيني بهدوء", en: "Close my eyes slowly" }, next: 3 },
          { label: { ar: "أتنفس ثلاث مرات", en: "Take three breaths" }, next: 3 },
        ],
      },
      {
        setting: "bedroom",
        sky: "night",
        who: "both",
        text: {
          ar: "سمعتُ صوتًا هادئًا… ثم أغمضتُ عيني، والقمر بقي عند النافذة.",
          en: "I heard a quiet sound… then I closed my eyes, and the moon stayed by the window.",
        },
        choices: null,
      },
    ],
  },
];

export const storyById = (id) => stories.find((s) => s.id === id);