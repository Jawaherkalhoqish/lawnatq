import { useId } from "react";

const SKINS = {
  day: ["#FFF9EC", "#DDEEF7"],
  dusk: ["#FFF0DA", "#F3D6E4", "#CBD9ED"],
  night: ["#33475F", "#1F2E45"],
};

function Child({ x = 260, y = 250, tone = "#C39BD3" }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M6 132c-2-40 10-62 34-62s36 22 34 62Z" fill={tone} />
      <circle cx="40" cy="42" r="34" fill="#FFD9C2" />
      <path d="M8 34c2-22 16-34 32-34s30 12 32 34c-10-6-20-9-32-9s-22 3-32 9Z" fill="#4A3A34" />
      <circle cx="28" cy="44" r="4" fill="#35434A" />
      <circle cx="52" cy="44" r="4" fill="#35434A" />
      <path d="M31 57c6 6 12 6 18 0" stroke="#35434A" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <circle cx="18" cy="55" r="5" fill="#FF9EAA" opacity="0.55" />
      <circle cx="62" cy="55" r="5" fill="#FF9EAA" opacity="0.55" />
    </g>
  );
}

function Mascot({ x = 400, y = 226, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M55 0c38 0 66 26 66 58 0 24-16 35-30 46-11 9-11 22-36 22S8 108 8 84C8 54 16 0 55 0Z" fill="#FFD068" />
      <path d="M55 0c13 0 24 3 34 9-15 11-17 42-6 61 8 14 11 32 7 56-11 0-13-14-24-22-14-11-30-22-30-45C36 25 42 0 55 0Z" fill="#6FD0C5" opacity="0.9" />
      <circle cx="42" cy="56" r="8.5" fill="#FFFFFF" />
      <circle cx="76" cy="56" r="8.5" fill="#FFFFFF" />
      <circle cx="43" cy="57" r="4.4" fill="#3E2723" />
      <circle cx="77" cy="57" r="4.4" fill="#3E2723" />
      <path d="M46 73c5 6 13 6 18 0" stroke="#3E2723" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <circle cx="25" cy="72" r="6" fill="#FF9EAA" opacity="0.65" />
      <circle cx="94" cy="72" r="6" fill="#FF9EAA" opacity="0.65" />
    </g>
  );
}

/**
 * Illustrated story scene. Every scene is a full composition (sky, ground,
 * environment, characters) — never a floating object.
 */
export function StoryScene({ setting = "garden", sky = "day", who = "both", className = "" }) {
  const uid = useId().replace(/[:]/g, "");
  const stops = SKINS[sky] || SKINS.day;
  const night = sky === "night";

  return (
    <svg viewBox="0 0 640 440" className={className} role="img" aria-label={setting}>
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          {stops.map((c, i) => (
            <stop key={c} offset={`${(i / Math.max(1, stops.length - 1)) * 100}%`} stopColor={c} />
          ))}
        </linearGradient>
        <clipPath id={`clip-${uid}`}>
          <rect width="640" height="440" rx="32" />
        </clipPath>
      </defs>

      <g clipPath={`url(#clip-${uid})`}>
        <rect width="640" height="440" fill={`url(#sky-${uid})`} />

        {night ? (
          <g>
            {[[80, 60], [150, 40], [230, 80], [330, 46], [520, 70], [580, 120], [420, 40]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i % 2 ? 2.6 : 1.8} fill="#FFFFFF" opacity="0.75" />
            ))}
            <circle cx="520" cy="96" r="42" fill="#FFF3D2" />
            <circle cx="540" cy="82" r="38" fill={stops[0]} opacity="0.55" />
          </g>
        ) : (
          <g>
            <circle cx={sky === "dusk" ? 520 : 520} cy={sky === "dusk" ? 150 : 96} r="46" fill="#FFD068" />
            <circle cx="520" cy={sky === "dusk" ? 150 : 96} r="66" fill="#FFD068" opacity="0.2" />
            <g fill="#FFFFFF" opacity="0.85">
              <ellipse cx="140" cy="76" rx="44" ry="24" />
              <ellipse cx="176" cy="86" rx="32" ry="18" />
            </g>
          </g>
        )}

        {/* environment */}
        {setting === "garden" && (
          <g>
            <path d="M-20 330c70-56 168-82 262-70 86 12 150 40 200 70Z" fill={night ? "#2C4650" : "#8FD8CE"} />
            <path d="M-20 356c110-46 214-56 330-32 100 20 190 24 330 32v120H-20Z" fill={night ? "#27414B" : "#6FD0C5"} />
            <g transform="translate(430 150)">
              <rect x="14" y="150" width="14" height="60" rx="7" fill={night ? "#7A6357" : "#B58B76"} />
              <circle cx="21" cy="120" r="66" fill={night ? "#3F6A62" : "#6FD0C5"} />
              <circle cx="-16" cy="152" r="44" fill={night ? "#47786F" : "#84D8CE"} />
              <circle cx="60" cy="152" r="44" fill={night ? "#3A615A" : "#5FC6B8"} />
            </g>
            <g transform="translate(70 190)">
              <path d="M0 168c0-84 44-140 92-140s92 56 92 140Z" fill={night ? "#36534E" : "#4FB9AD"} opacity="0.35" />
              <path d="M78 168V92c0-24 10-38 26-38s26 14 26 38v76Z" fill={night ? "#22343F" : "#FFF3E2"} />
              <circle cx="118" cy="118" r="5" fill={night ? "#FFD068" : "#B58B76"} />
            </g>
            {[[250, 372], [300, 384], [350, 372]].map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y})`}>
                <circle cx="0" cy="0" r="7" fill={["#FF9EAA", "#FFD068", "#C39BD3"][i]} />
                <circle cx="0" cy="0" r="2.6" fill="#FFFFFF" />
              </g>
            ))}
          </g>
        )}

        {setting === "park" && (
          <g>
            <path d="M-20 330c90-58 190-76 300-58 96 16 200 38 380 58v130H-20Z" fill={night ? "#2C4650" : "#9BDDD4"} />
            <path d="M-20 368c120-40 240-46 360-26 100 16 180 20 300 26v90H-20Z" fill={night ? "#27414B" : "#7ED1C6"} />
            <g transform="translate(64 138)">
              <rect x="52" y="150" width="20" height="86" rx="10" fill={night ? "#7A6357" : "#B58B76"} />
              <circle cx="62" cy="112" r="70" fill={night ? "#3F6A62" : "#6FD0C5"} />
              <circle cx="8" cy="146" r="46" fill={night ? "#47786F" : "#84D8CE"} />
              <circle cx="116" cy="146" r="46" fill={night ? "#3A615A" : "#5FC6B8"} />
            </g>
            <g transform="translate(400 300)">
              <rect x="0" y="20" width="150" height="14" rx="7" fill={night ? "#3C5661" : "#C9A88F"} />
              <rect x="6" y="34" width="12" height="34" rx="5" fill={night ? "#3C5661" : "#B58B76"} />
              <rect x="132" y="34" width="12" height="34" rx="5" fill={night ? "#3C5661" : "#B58B76"} />
              <path d="M0 20h150" stroke={night ? "#54737F" : "#A9846C"} strokeWidth="6" strokeLinecap="round" />
            </g>
            <g transform="translate(300 150)">
              <path d="M32 96c-10 20-12 34-6 52" stroke={night ? "#8496A3" : "#35434A"} strokeOpacity="0.4" strokeWidth="3" fill="none" />
              <ellipse cx="32" cy="66" rx="24" ry="28" fill="#FF7E75" />
              <ellipse cx="24" cy="56" rx="6" ry="8" fill="#FFFFFF" opacity="0.45" />
            </g>
          </g>
        )}

        {setting === "market" && (
          <g>
            <path d="M-20 336h680v120H-20Z" fill={night ? "#2B4149" : "#E9D9C4"} />
            <g transform="translate(40 140)">
              <rect x="0" y="60" width="220" height="140" rx="14" fill={night ? "#3A4F58" : "#FFF6E7"} />
              <path d="M-14 60h248l-24 44H10Z" fill="#FF7E75" />
              <g fill="#FFF6E7" opacity="0.85">
                <path d="M42 60h30l-12 44H30Z" />
                <path d="M120 60h30l-12 44h-30Z" />
              </g>
              <g>
                {[40, 84, 128, 172].map((x) => (
                  <circle key={x} cx={x} cy="150" r="17" fill="#FFD068" />
                ))}
              </g>
              <rect x="24" y="172" width="172" height="18" rx="9" fill={night ? "#2C4048" : "#E4CAAC"} />
            </g>
            <g transform="translate(380 170)">
              <rect x="0" y="60" width="200" height="130" rx="14" fill={night ? "#3A4F58" : "#FFF6E7"} />
              <path d="M-14 60h228l-22 40H8Z" fill="#6FD0C5" />
              <g>
                {[40, 90, 140].map((x) => (
                  <circle key={x} cx={x} cy="146" r="16" fill="#FF9EAA" />
                ))}
              </g>
            </g>
          </g>
        )}

        {setting === "bedroom" && (
          <g>
            <rect x="0" y="0" width="640" height="440" fill={night ? "#2A3A50" : "#F4E7DA"} opacity="0.25" />
            <g transform="translate(400 60)">
              <rect x="0" y="0" width="170" height="150" rx="14" fill={night ? "#1B2A3D" : "#DDEEF7"} />
              <rect x="0" y="0" width="170" height="150" rx="14" fill="none" stroke={night ? "#5B7186" : "#C9A88F"} strokeWidth="8" />
              <path d="M85 0v150M0 75h170" stroke={night ? "#5B7186" : "#C9A88F"} strokeWidth="6" />
              {night && <circle cx="120" cy="46" r="20" fill="#FFF3D2" />}
            </g>
            <rect x="-10" y="330" width="660" height="130" fill={night ? "#253648" : "#EFDFCE"} />
            <g transform="translate(60 250)">
              <rect x="0" y="40" width="300" height="110" rx="22" fill={night ? "#38506A" : "#CBE3F0"} />
              <rect x="14" y="6" width="120" height="60" rx="20" fill="#FFF9F0" />
              <rect x="0" y="120" width="300" height="34" rx="14" fill={night ? "#2C4055" : "#B6D6E8"} />
            </g>
            <g transform="translate(500 250)">
              <rect x="24" y="40" width="12" height="90" rx="6" fill={night ? "#5B7186" : "#C9A88F"} />
              <path d="M-16 40h72l-20-34H4Z" fill="#FFD068" />
            </g>
          </g>
        )}

        {setting === "moon" && (
          <g>
            <path d="M-20 340c90-58 200-72 320-50 100 18 200 32 360 50v130H-20Z" fill={night ? "#2B4550" : "#9BDDD4"} />
            <path d="M-20 380c120-36 250-40 370-18 90 16 170 16 290 18v80H-20Z" fill={night ? "#243B45" : "#7ED1C6"} />
            <circle cx="330" cy="140" r="76" fill="#FFF3D2" opacity="0.95" />
            <circle cx="330" cy="140" r="98" fill="#FFF3D2" opacity="0.14" />
            <circle cx="300" cy="120" r="12" fill="#F0E1BC" />
            <circle cx="356" cy="168" r="9" fill="#F0E1BC" />
          </g>
        )}

        {setting !== "bedroom" && (
          <g>
            {who !== "child" && <Mascot x={who === "mascot" ? 290 : 400} y={who === "mascot" ? 250 : 232} scale={who === "mascot" ? 1.15 : 1} />}
            {who !== "mascot" && <Child x={who === "child" ? 280 : 236} y={who === "child" ? 244 : 258} />}
          </g>
        )}

        {setting === "bedroom" && (
          <g>
            <Child x={150} y={206} tone="#C39BD3" />
            <Mascot x={300} y={214} scale={0.85} />
          </g>
        )}
      </g>
    </svg>
  );
}

export default StoryScene;