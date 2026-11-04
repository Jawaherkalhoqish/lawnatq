/* A warm, illustrated story scene used on the landing page: hills, sun,
   the LAWNATQ mascot and a child character together. */

export function SceneArt({ className = "" }) {
  return (
    <svg viewBox="0 0 560 400" className={className} role="img" aria-label="مشهد من قصة لونُطق">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF5E8" />
          <stop offset="55%" stopColor="#FDEBF0" />
          <stop offset="100%" stopColor="#EAF7F5" />
        </linearGradient>
        <linearGradient id="hillA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9BDDD4" />
          <stop offset="100%" stopColor="#6FD0C5" />
        </linearGradient>
        <linearGradient id="hillB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C7E7F5" />
          <stop offset="100%" stopColor="#7FB3D5" />
        </linearGradient>
      </defs>

      <rect width="560" height="400" rx="36" fill="url(#sky)" />
      <circle cx="452" cy="82" r="46" fill="#FFD068" />
      <circle cx="452" cy="82" r="66" fill="#FFD068" opacity="0.22" />

      <g fill="#FFFFFF" opacity="0.9">
        <ellipse cx="128" cy="78" rx="46" ry="26" />
        <ellipse cx="164" cy="88" rx="34" ry="20" />
        <ellipse cx="330" cy="52" rx="34" ry="18" />
      </g>

      <path d="M-20 300c60-62 148-92 250-74 80 14 132 46 170 74Z" fill="url(#hillB)" opacity="0.75" />
      <path d="M-20 330c92-58 190-78 300-52 96 22 176 30 300 52v70H-20Z" fill="url(#hillA)" />

      {/* tree */}
      <g transform="translate(96 208)">
        <rect x="24" y="72" width="16" height="66" rx="8" fill="#B58B76" />
        <circle cx="32" cy="62" r="44" fill="#6FD0C5" />
        <circle cx="6" cy="82" r="28" fill="#84D8CE" />
        <circle cx="58" cy="82" r="28" fill="#5FC6B8" />
      </g>

      {/* flowers */}
      <g>
        {[196, 236, 276].map((x, i) => (
          <g key={x} transform={`translate(${x} ${318 + (i % 2) * 10})`}>
            <path d="M0 0v22" stroke="#3F9E93" strokeWidth="3" strokeLinecap="round" />
            <circle cx="0" cy="-4" r="7" fill={["#FF9EAA", "#FFD068", "#C39BD3"][i]} />
            <circle cx="0" cy="-4" r="2.6" fill="#FFFFFF" />
          </g>
        ))}
      </g>

      {/* balloon */}
      <g transform="translate(372 128)">
        <path d="M22 52c-14 22-18 44-8 66" stroke="#35434A" strokeOpacity="0.35" strokeWidth="2.5" fill="none" />
        <ellipse cx="22" cy="26" rx="26" ry="30" fill="#FF7E75" />
        <ellipse cx="13" cy="16" rx="7" ry="9" fill="#FFFFFF" opacity="0.45" />
      </g>

      {/* child character */}
      <g transform="translate(300 206)">
        <path d="M6 132c-2-40 10-62 34-62s36 22 34 62Z" fill="#C39BD3" />
        <circle cx="40" cy="42" r="34" fill="#FFD9C2" />
        <path d="M8 34c2-22 16-34 32-34s30 12 32 34c-10-6-20-9-32-9s-22 3-32 9Z" fill="#4A3A34" />
        <circle cx="28" cy="44" r="4" fill="#35434A" />
        <circle cx="52" cy="44" r="4" fill="#35434A" />
        <path d="M31 57c6 6 12 6 18 0" stroke="#35434A" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        <circle cx="18" cy="55" r="5.5" fill="#FF9EAA" opacity="0.6" />
        <circle cx="62" cy="55" r="5.5" fill="#FF9EAA" opacity="0.6" />
        <path d="M74 96c14 4 20 14 18 26" stroke="#FFD9C2" strokeWidth="13" strokeLinecap="round" fill="none" />
      </g>

      {/* mascot */}
      <g transform="translate(120 246)">
        <path d="M58 0c40 0 70 26 70 60 0 25-17 36-32 48-12 9-12 24-38 24S10 112 10 88C10 56 18 0 58 0Z" fill="#FFD068" />
        <path d="M58 0c14 0 26 3 36 9-16 12-18 44-6 64 9 15 12 34 8 59-12 0-14-15-26-24-15-12-32-23-32-48C38 26 44 0 58 0Z" fill="#6FD0C5" opacity="0.9" />
        <g>
          <circle cx="44" cy="58" r="9" fill="#FFFFFF" />
          <circle cx="80" cy="58" r="9" fill="#FFFFFF" />
          <circle cx="45" cy="59" r="4.6" fill="#3E2723" />
          <circle cx="81" cy="59" r="4.6" fill="#3E2723" />
          <path d="M48 76c5 6 14 6 20 0" stroke="#3E2723" strokeWidth="3.6" strokeLinecap="round" fill="none" />
        </g>
        <circle cx="26" cy="76" r="7" fill="#FF9EAA" opacity="0.7" />
        <circle cx="98" cy="76" r="7" fill="#FF9EAA" opacity="0.7" />
      </g>

      <path d="M488 300l6 14 14 6-14 6-6 14-6-14-14-6 14-6Z" fill="#FF9EAA" opacity="0.9" />
    </svg>
  );
}

export default SceneArt;