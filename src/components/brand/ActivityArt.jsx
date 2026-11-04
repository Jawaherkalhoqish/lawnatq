/* Hand-drawn vector illustrations for the four LAWNATQ activities.
   Flat brand shapes, no photos, consistent rounded language. */

const INK = "#35434A";

export function CardsArt({ className = "" }) {
  return (
    <svg viewBox="0 0 240 190" className={className} role="img" aria-label="بطاقات تواصل">
      <g transform="rotate(-9 120 100)">
        <rect x="46" y="34" width="104" height="132" rx="26" fill="#7FB3D5" opacity="0.85" />
      </g>
      <g transform="rotate(7 130 90)">
        <rect x="82" y="26" width="104" height="132" rx="26" fill="#FFD068" opacity="0.9" />
      </g>
      <g transform="rotate(-2 120 100)">
        <rect x="66" y="40" width="110" height="132" rx="28" fill="#FFFFFF" stroke="#35434A" strokeOpacity="0.08" />
        <path d="M94 84c0-4 3-7 7-7s7 3 7 7-3 7-7 7-7-3-7-7Zm38 0c0-4 3-7 7-7s7 3 7 7-3 7-7 7-7-3-7-7Z" fill={INK} />
        <path d="M100 112c6 8 15 12 24 12s18-4 24-12" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>
      <g transform="rotate(6 196 54)">
        <rect x="174" y="34" width="52" height="40" rx="14" fill="#6FD0C5" />
        <path d="M186 74l-2 12 14-12Z" fill="#6FD0C5" />
        <circle cx="190" cy="54" r="3.5" fill="#FFFFFF" />
        <circle cx="200" cy="54" r="3.5" fill="#FFFFFF" />
        <circle cx="210" cy="54" r="3.5" fill="#FFFFFF" />
      </g>
      <circle cx="34" cy="146" r="9" fill="#FF9EAA" />
      <circle cx="210" cy="140" r="6" fill="#C39BD3" />
    </svg>
  );
}

export function ColorsArt({ className = "" }) {
  return (
    <svg viewBox="0 0 240 190" className={className} role="img" aria-label="رسم وتلوين">
      <path
        d="M118 22c44 0 86 24 86 62 0 26-18 36-34 46-14 9-18 26-40 26-48 0-84-32-84-70S74 22 118 22Z"
        fill="#FFFFFF"
        stroke="#35434A"
        strokeOpacity="0.08"
      />
      <circle cx="92" cy="60" r="15" fill="#6FD0C5" />
      <circle cx="134" cy="52" r="15" fill="#FFD068" />
      <circle cx="168" cy="78" r="15" fill="#FF7E75" />
      <circle cx="150" cy="118" r="15" fill="#C39BD3" />
      <circle cx="96" cy="116" r="15" fill="#7FB3D5" />
      <circle cx="62" cy="92" r="15" fill="#FF9EAA" />
      <g transform="rotate(-32 190 120)">
        <rect x="176" y="96" width="14" height="58" rx="7" fill="#FFD068" />
        <rect x="174" y="148" width="18" height="14" rx="6" fill="#35434A" />
      </g>
      <path d="M40 158c10-6 20-6 30 0" stroke="#6FD0C5" strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="206" cy="42" r="7" fill="#FF9EAA" />
    </svg>
  );
}

export function StoriesArt({ className = "" }) {
  return (
    <svg viewBox="0 0 240 190" className={className} role="img" aria-label="قصص تفاعلية">
      <circle cx="176" cy="46" r="22" fill="#FFD068" />
      <circle cx="176" cy="46" r="30" fill="#FFD068" opacity="0.25" />
      <path d="M28 148c22-30 60-46 92-46s70 16 92 46Z" fill="#6FD0C5" opacity="0.55" />
      <g>
        <path d="M44 92c26-12 50-12 74 2v58c-24-14-48-14-74-2Z" fill="#FFFFFF" stroke="#35434A" strokeOpacity="0.1" />
        <path d="M196 92c-26-12-50-12-74 2v58c24-14 48-14 74-2Z" fill="#FFFFFF" stroke="#35434A" strokeOpacity="0.1" />
        <path d="M120 94v58" stroke="#C39BD3" strokeWidth="4" strokeLinecap="round" />
        <g transform="translate(104 84)">
          <path d="M16 0c14 0 24 10 24 22 0 9-6 14-11 18-4 3-4 8-13 8S3 42 3 32 2 0 16 0Z" fill="#C39BD3" />
          <circle cx="12" cy="22" r="2.6" fill={INK} />
          <circle cx="22" cy="22" r="2.6" fill={INK} />
          <path d="M13 29c2.5 2.6 6.5 2.6 9 0" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </g>
        <path d="M58 112h34M58 124h24" stroke="#35434A" strokeOpacity="0.18" strokeWidth="4" strokeLinecap="round" />
        <path d="M148 112h34M148 124h22" stroke="#35434A" strokeOpacity="0.18" strokeWidth="4" strokeLinecap="round" />
      </g>
      <path d="M52 52l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" fill="#FF9EAA" />
      <circle cx="82" cy="40" r="4" fill="#7FB3D5" />
    </svg>
  );
}

export function AssistantArt({ className = "" }) {
  return (
    <svg viewBox="0 0 240 190" className={className} role="img" aria-label="مساعد ودود">
      <path d="M40 44h160a26 26 0 0 1 26 26v46a26 26 0 0 1-26 26H96l-30 24 4-24H40a26 26 0 0 1-26-26V70a26 26 0 0 1 26-26Z" fill="#6FD0C5" opacity="0.22" />
      <path d="M56 26h124a24 24 0 0 1 24 24v40a24 24 0 0 1-24 24H104l-26 20 3-20h-25A24 24 0 0 1 32 90V50a24 24 0 0 1 24-24Z" fill="#FFFFFF" stroke="#35434A" strokeOpacity="0.08" />
      <g transform="translate(88 40)">
        <path d="M34 0c24 0 42 16 42 36 0 15-10 23-19 30-7 5-7 14-23 14S15 70 5 58C-2 49 8 36 8 26 8 10 10 0 34 0Z" fill="#FFD068" />
        <circle cx="26" cy="36" r="4.5" fill={INK} />
        <circle cx="50" cy="36" r="4.5" fill={INK} />
        <path d="M27 50c6 6 16 6 22 0" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
      <circle cx="212" cy="150" r="16" fill="#FF9EAA" />
      <path d="M206 150l4 5 9-11" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M188 44l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#C39BD3" />
      <circle cx="40" cy="150" r="6" fill="#7FB3D5" />
    </svg>
  );
}

export const activityArt = {
  cards: CardsArt,
  colors: ColorsArt,
  stories: StoriesArt,
  assistant: AssistantArt,
};