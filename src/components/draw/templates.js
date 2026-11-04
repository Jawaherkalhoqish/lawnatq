/** Coloring templates: large shapes, thick outlines, ages 5–10. */
const S = 'stroke="#35434A" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"';

export const templates = [
  {
    id: "house",
    ar: "بيت",
    en: "House",
    svg: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg"><g ${S}><path d="M110 195 300 78l190 117"/><path d="M155 188v150h290V188"/><path d="M272 338v-92h56v92"/><rect x="182" y="218" width="58" height="52" rx="8"/><rect x="360" y="218" width="58" height="52" rx="8"/><path d="M60 338h480"/><path d="M470 96a34 34 0 1 1 0 68 34 34 0 0 1 0-68"/><path d="M470 62v-16M470 214v-16M514 130h16M410 130h16"/></g></svg>`,
  },
  {
    id: "sun",
    ar: "شمس",
    en: "Sun",
    svg: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg"><g ${S}><circle cx="300" cy="190" r="86"/><path d="M300 58v-34M300 356v-34M432 190h34M134 190h34M394 96l24-24M182 308l-24 24M394 284l24 24M182 72l-24-24"/><path d="M96 320c0-26 22-46 48-46 8-22 30-36 54-36 34 0 60 26 62 58"/><path d="M470 330c0-20 16-36 36-36"/></g></svg>`,
  },
  {
    id: "tree",
    ar: "شجرة",
    en: "Tree",
    svg: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg"><g ${S}><path d="M270 350v-98h60v98"/><circle cx="300" cy="150" r="78"/><circle cx="212" cy="196" r="54"/><circle cx="388" cy="196" r="54"/><path d="M70 350h460"/><path d="M120 330l14-24M150 330l-8-22M470 330l-12-26M500 330l10-22"/></g></svg>`,
  },
  {
    id: "flower",
    ar: "زهرة",
    en: "Flower",
    svg: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg"><g ${S}><path d="M300 350V196"/><circle cx="300" cy="128" r="40"/><ellipse cx="300" cy="46" rx="32" ry="42"/><ellipse cx="300" cy="210" rx="32" ry="42"/><ellipse cx="382" cy="128" rx="42" ry="32"/><ellipse cx="218" cy="128" rx="42" ry="32"/><ellipse cx="358" cy="196" rx="36" ry="26" transform="rotate(38 358 196)"/><ellipse cx="242" cy="196" rx="36" ry="26" transform="rotate(-38 242 196)"/><path d="M300 268c-44 22-70 20-92 4 18-30 50-38 92-16"/><path d="M300 300c44 22 70 20 92 4-18-30-50-38-92-16"/><path d="M90 350h420"/></g></svg>`,
  },
  {
    id: "butterfly",
    ar: "فراشة",
    en: "Butterfly",
    svg: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg"><g ${S}><ellipse cx="300" cy="200" rx="18" ry="92"/><path d="M286 120c-46-52-118-56-148-18-24 32-4 84 44 100-40 10-56 46-34 72 26 30 90 20 134-40"/><path d="M314 120c46-52 118-56 148-18 24 32 4 84-44 100 40 10 56 46 34 72-26 30-90 20-134-40"/><path d="M292 108c-10-16-24-24-40-26M308 108c10-16 24-24 40-26"/></g></svg>`,
  },
  {
    id: "cat",
    ar: "قطة",
    en: "Cat",
    svg: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg"><g ${S}><circle cx="300" cy="160" r="82"/><path d="M246 96l-16-56 54 24M354 96l16-56-54 24"/><path d="M226 240h148v76c0 26-24 42-74 42s-74-16-74-42z"/><path d="M374 268c44-6 62 26 44 52-12 18-34 20-44 6"/><path d="M270 158v6M330 158v6"/><path d="M282 192c10 10 26 10 36 0"/><path d="M120 358h360"/></g></svg>`,
  },
  {
    id: "car",
    ar: "سيارة",
    en: "Car",
    svg: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg"><g ${S}><path d="M96 286v-56c0-14 10-24 24-24h60l52-62c6-8 16-12 26-12h86c10 0 20 4 26 12l54 62h38c14 0 24 10 24 24v56"/><path d="M96 286h428"/><circle cx="182" cy="300" r="40"/><circle cx="438" cy="300" r="40"/><path d="M262 152h108M232 206h158"/><path d="M120 254h-24M504 254h24"/></g></svg>`,
  },
  {
    id: "rainbow",
    ar: "قوس قزح",
    en: "Rainbow",
    svg: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg"><g ${S}><path d="M96 320a204 204 0 0 1 408 0"/><path d="M140 320a160 160 0 0 1 320 0"/><path d="M184 320a116 116 0 0 1 232 0"/><path d="M228 320a72 72 0 0 1 144 0"/><path d="M52 322c0-18 14-30 32-30 4-20 22-34 42-34 24 0 42 18 44 40"/><path d="M430 322c0-18 14-30 32-30 4-20 22-34 42-34"/></g></svg>`,
  },
];

export const templateById = (id) => templates.find((x) => x.id === id);