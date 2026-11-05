/**
 * The LAWNATQ communication card library.
 * Every card is one of the real PNG files shipped in the brand pack — never a
 * substitute illustration. `cat` matches the folder the file lives in.
 */
export const cardCategories = [
  { id: "01_Basic_Needs", ar: "احتياجاتي", en: "My needs", tone: "turq" },
  { id: "02_Actions_Activities", ar: "أفعال وأنشطة", en: "Actions", tone: "sun" },
  { id: "03_People", ar: "الناس", en: "People", tone: "coral" },
  { id: "04_Feelings", ar: "مشاعري", en: "My Feelings", tone: "lav" },
  { id: "05_Social_Interaction", ar: "أتكلم مع الآخرين", en: "Talking", tone: "sky" },
  { id: "06_Choices_Refusal", ar: "أختار", en: "I choose", tone: "rose" },
  { id: "07_Help_Regulation", ar: "أطلب مساعدة", en: "Getting help", tone: "turq" },
  { id: "08_Places_Routines", ar: "أماكن ووقت", en: "Places & time", tone: "sky" },
];

export const cards = [
  { key: "bathroom", cat: "01_Basic_Needs", ar: "الحمام", en: "Bathroom" },
  { key: "food", cat: "01_Basic_Needs", ar: "طعام", en: "Food" },
  { key: "pain", cat: "01_Basic_Needs", ar: "ألم", en: "Pain" },
  { key: "rest", cat: "01_Basic_Needs", ar: "راحة", en: "Rest" },
  { key: "sleep", cat: "01_Basic_Needs", ar: "نوم", en: "Sleep" },
  { key: "water", cat: "01_Basic_Needs", ar: "ماء", en: "Water" },

  { key: "draw", cat: "02_Actions_Activities", ar: "أرسم", en: "Draw" },
  { key: "go", cat: "02_Actions_Activities", ar: "أذهب", en: "Go" },
  { key: "listen", cat: "02_Actions_Activities", ar: "أسمع", en: "Listen" },
  { key: "play", cat: "02_Actions_Activities", ar: "ألعب", en: "Play" },
  { key: "read", cat: "02_Actions_Activities", ar: "أقرأ", en: "Read" },

  { key: "brother", cat: "03_People", ar: "أخي", en: "Brother" },
  { key: "dad", cat: "03_People", ar: "بابا", en: "Dad" },
  { key: "friend", cat: "03_People", ar: "صديقي", en: "Friend" },
  { key: "mom", cat: "03_People", ar: "ماما", en: "Mom" },
  { key: "teacher", cat: "03_People", ar: "معلمتي", en: "Teacher" },

  { key: "comfortable", cat: "04_Feelings", ar: "مرتاح", en: "Comfortable" },
  { key: "happy", cat: "04_Feelings", ar: "سعيد", en: "Happy" },
  { key: "sad", cat: "04_Feelings", ar: "حزين", en: "Sad" },
  { key: "scared", cat: "04_Feelings", ar: "خائف", en: "Scared" },
  { key: "tired", cat: "04_Feelings", ar: "متعب", en: "Tired" },
  { key: "upset", cat: "04_Feelings", ar: "منزعج", en: "Upset" },

  { key: "hello", cat: "05_Social_Interaction", ar: "مرحبًا", en: "Hello" },
  { key: "my_turn", cat: "05_Social_Interaction", ar: "دوري", en: "My turn" },
  { key: "please", cat: "05_Social_Interaction", ar: "من فضلك", en: "Please" },
  { key: "thank_you", cat: "05_Social_Interaction", ar: "شكرًا", en: "Thank you" },
  { key: "your_turn", cat: "05_Social_Interaction", ar: "دورك", en: "Your turn" },

  { key: "finished", cat: "06_Choices_Refusal", ar: "انتهيت", en: "Finished" },
  { key: "i_dont_want", cat: "06_Choices_Refusal", ar: "لا أريد", en: "I don't want" },
  { key: "i_want", cat: "06_Choices_Refusal", ar: "أريد", en: "I want" },
  { key: "no", cat: "06_Choices_Refusal", ar: "لا", en: "No" },
  { key: "yes", cat: "06_Choices_Refusal", ar: "نعم", en: "Yes" },

  { key: "break", cat: "07_Help_Regulation", ar: "استراحة", en: "Break" },
  { key: "help_me", cat: "07_Help_Regulation", ar: "ساعدني", en: "Help me" },
  { key: "i_dont_understand", cat: "07_Help_Regulation", ar: "لم أفهم", en: "I don't understand" },
  { key: "stop", cat: "07_Help_Regulation", ar: "توقف", en: "Stop" },
  { key: "wait", cat: "07_Help_Regulation", ar: "انتظر", en: "Wait" },

  { key: "center", cat: "08_Places_Routines", ar: "المركز", en: "Center" },
  { key: "home", cat: "08_Places_Routines", ar: "البيت", en: "Home" },
  { key: "later", cat: "08_Places_Routines", ar: "لاحقًا", en: "Later" },
  { key: "now", cat: "08_Places_Routines", ar: "الآن", en: "Now" },
  { key: "park", cat: "08_Places_Routines", ar: "الحديقة", en: "Park" },
  { key: "school", cat: "08_Places_Routines", ar: "المدرسة", en: "School" },
];

export const cardByKey = Object.fromEntries(cards.map((c) => [c.key, c]));

export const cardImage = (card) => `/cards/${card.cat}/${card.key}.png`;

/** Literal Tailwind classes per category tone (never build these dynamically). */
export const toneClasses = {
  turq: { chip: "bg-turq/20 text-turq-deep border-turq/40", tile: "bg-turq/10", text: "text-turq-deep" },
  sun: { chip: "bg-sun/25 text-sun-deep border-sun/40", tile: "bg-sun/12", text: "text-sun-deep" },
  coral: { chip: "bg-coral/20 text-coral-deep border-coral/40", tile: "bg-coral/10", text: "text-coral-deep" },
  lav: { chip: "bg-lav/20 text-lav-deep border-lav/40", tile: "bg-lav/10", text: "text-lav-deep" },
  sky: { chip: "bg-sky/20 text-sky-deep border-sky/40", tile: "bg-sky/10", text: "text-sky-deep" },
  rose: { chip: "bg-rose/25 text-rose-deep border-rose/40", tile: "bg-rose/10", text: "text-rose-deep" },
};

export const avatarClasses = {
  sun: "bg-sun/40 text-sun-deep",
  turq: "bg-turq/30 text-turq-deep",
  coral: "bg-coral/25 text-coral-deep",
  lav: "bg-lav/25 text-lav-deep",
  sky: "bg-sky/25 text-sky-deep",
  rose: "bg-rose/30 text-rose-deep",
};

export const childTone = (index = 0) => ["sun", "turq", "coral", "lav", "sky", "rose"][index % 6];