/**
 * The two interactive stories from the LAWNATQ story pack.
 * Scenes, branches and bilingual text mirror each story.json exactly; every
 * image is the file shipped with that scene. Nothing is randomised.
 */
const schoolDay = {
  id: "school_day",
  folder: "01_School_Day",
  cover: "cover.png",
  title: { ar: "يومي الأول في المدرسة", en: "My First Day at School" },
  description: {
    ar: "قصة تفاعلية عن بداية يوم جديد والتعرّف على الأصدقاء والتعبير بالرسم.",
    en: "An interactive story about a new day, making friends, and expressing yourself through drawing.",
  },
  hero: { ar: "سامي", en: "Sami" },
  start: "scene_01",
  scenes: [
    {
      id: "scene_01",
      image: "scene_01_wakeup.png",
      text: {
        ar: "استيقظ سامي في الصباح، فهذا أول يوم له في المدرسة!",
        en: "Sami woke up in the morning. It was his first day at school!",
      },
      next: "scene_02",
    },
    {
      id: "scene_02",
      image: "scene_02_school.png",
      text: {
        ar: "وصل سامي إلى المدرسة ورأى أطفالًا جددًا في الساحة. ماذا يختار؟",
        en: "Sami arrived at school and saw new children in the playground. What should he choose?",
      },
      choices: [
        {
          id: "choice_a",
          label: { ar: "أذهب للتعرّف على صديق", en: "Go and meet a new friend" },
          image: "choice_a_meet_friend.png",
          next: "scene_03_a",
        },
        {
          id: "choice_b",
          label: { ar: "أجلس وأرسم أولًا", en: "Sit down and draw first" },
          image: "choice_b_draw_first.png",
          next: "scene_03_b",
        },
      ],
    },
    {
      id: "scene_03_a",
      image: "scene_03_friend_a.png",
      text: {
        ar: "اقترب سامي من طفل جديد وبدأ يتحدث معه.",
        en: "Sami walked over to a new child and started talking with him.",
      },
      next: "ending_a",
    },
    {
      id: "scene_03_b",
      image: "scene_03_friend_b.png",
      text: {
        ar: "اختار سامي الرسم، ثم جاءت طفلة وجلست بجانبه.",
        en: "Sami chose to draw, and then a girl came and sat beside him.",
      },
      next: "ending_b",
    },
    {
      id: "ending_a",
      image: "ending_a.png",
      text: {
        ar: "أصبح لدى سامي صديق جديد، ولعبا معًا بسعادة!",
        en: "Sami made a new friend, and they happily played together!",
      },
      isEnding: true,
    },
    {
      id: "ending_b",
      image: "ending_b.png",
      text: {
        ar: "شارك سامي رسمته مع أصدقائه، وقضوا وقتًا جميلًا معًا.",
        en: "Sami shared his drawing with his friends, and they had a lovely time together.",
      },
      isEnding: true,
    },
  ],
};

const turtle = {
  id: "turtle_adventure",
  folder: "02_Turtle_Adventure",
  cover: "cover.png",
  title: { ar: "مغامرة السلحفاة الصغيرة", en: "The Little Turtle's Adventure" },
  description: {
    ar: "رحلة لولو الصغيرة بين الشاطئ والغابة، مع اختيار الطريق الذي تريد استكشافه.",
    en: "Lulu's little journey between the beach and the forest, where the child chooses which path to explore.",
  },
  hero: { ar: "لولو", en: "Lulu" },
  start: "scene_01",
  scenes: [
    {
      id: "scene_01",
      image: "scene_01_beach.png",
      text: {
        ar: "كانت لولو السلحفاة الصغيرة تستمتع بيوم جميل على الشاطئ.",
        en: "Lulu the little turtle was enjoying a beautiful day at the beach.",
      },
      next: "scene_02",
    },
    {
      id: "scene_02",
      image: "scene_02_crossroads.png",
      text: {
        ar: "وجدت لولو طريقين أمامها. أي طريق تختار؟",
        en: "Lulu found two paths ahead. Which path should she choose?",
      },
      choices: [
        {
          id: "choice_a",
          label: { ar: "أستكشف الغابة", en: "Explore the forest" },
          image: "choice_a_forest.png",
          next: "scene_03_a",
        },
        {
          id: "choice_b",
          label: { ar: "أعود إلى البحر", en: "Go back to the sea" },
          image: "choice_b_sea.png",
          next: "scene_03_b",
        },
      ],
    },
    {
      id: "scene_03_a",
      image: "scene_03_forest.png",
      text: {
        ar: "دخلت لولو الغابة وقابلت سنجابًا لطيفًا.",
        en: "Lulu entered the forest and met a friendly squirrel.",
      },
      next: "ending_a",
    },
    {
      id: "scene_03_b",
      image: "scene_03_sea.png",
      text: {
        ar: "عادت لولو إلى البحر وقابلت سلطعونًا مرحًا.",
        en: "Lulu returned to the sea and met a playful crab.",
      },
      next: "ending_b",
    },
    {
      id: "ending_a",
      image: "ending_a_forest.png",
      text: {
        ar: "استمتعت لولو بالغابة وصديقها السنجاب في نهاية مغامرتها.",
        en: "Lulu enjoyed the forest and her squirrel friend at the end of her adventure.",
      },
      isEnding: true,
    },
    {
      id: "ending_b",
      image: "ending_b_sea.png",
      text: {
        ar: "استمتعت لولو بغروب الشمس وصديقها السلطعون على الشاطئ.",
        en: "Lulu enjoyed the sunset and her crab friend by the shore.",
      },
      isEnding: true,
    },
  ],
};

export const storyPack = [schoolDay, turtle];

export const storyPackById = (id) => storyPack.find((s) => s.id === id);

export const sceneById = (story, id) => story.scenes.find((s) => s.id === id);

/** Public path of a file shipped inside a story folder. */
export const storyImage = (story, file) => `/stories/${story.folder}/${file}`;