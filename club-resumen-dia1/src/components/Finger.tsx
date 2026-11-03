import React from "react";

type FingerProps = {
  /** Ancho en píxeles; el alto se escala en proporción (320 × 1500). */
  width: number;
  /** Luz de la pantalla rebotando en el borde del dedo, 0 → 1. */
  rim?: number;
  rimColor?: string;
  style?: React.CSSProperties;
};

/**
 * Dedo índice visto desde los ojos del espectador (lado de la uña),
 * apuntando hacia arriba. La punta queda en (160, 0) del viewBox.
 */
export const Finger: React.FC<FingerProps> = ({ width, rim = 0.6, rimColor = "#7fdcff", style }) => {
  const height = (width / 320) * 1500;
  return (
    <svg width={width} height={height} viewBox="0 0 320 1500" style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id="skin" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#6e3f2e" />
          <stop offset="0.22" stopColor="#c98a68" />
          <stop offset="0.5" stopColor="#efbd9b" />
          <stop offset="0.8" stopColor="#c4825f" />
          <stop offset="1" stopColor="#5e3324" />
        </linearGradient>
        <linearGradient id="skin-fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0.45" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="nail" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff1e8" />
          <stop offset="0.25" stopColor="#f6cfc0" />
          <stop offset="1" stopColor="#e2a592" />
        </linearGradient>
        <filter id="finger-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <path
        d="M 6 1500 L 24 196 C 26 74 92 4 160 4 C 228 4 294 74 296 196 L 314 1500 Z"
        fill="url(#skin)"
      />
      <path
        d="M 30 1500 L 36 200 C 38 96 92 22 150 18"
        stroke={rimColor}
        strokeWidth={26}
        fill="none"
        opacity={rim}
        filter="url(#finger-soft)"
      />
      <g stroke="#7a4532" strokeLinecap="round" fill="none" opacity={0.5}>
        <path d="M 70 640 C 120 618 200 618 250 640" strokeWidth={7} />
        <path d="M 86 672 C 130 656 190 656 234 672" strokeWidth={5} />
        <path d="M 60 1060 C 120 1032 200 1032 262 1060" strokeWidth={8} />
        <path d="M 78 1098 C 130 1078 192 1078 246 1098" strokeWidth={5} />
      </g>
      <path d="M 60 352 C 118 392 204 392 260 352" stroke="#a6634b" strokeWidth={10} fill="none" opacity={0.55} />
      <path
        d="M 72 334 L 70 154 C 70 82 110 40 160 40 C 210 40 250 82 250 154 L 248 334 C 200 356 120 356 72 334 Z"
        fill="url(#nail)"
      />
      <path d="M 78 120 C 92 66 126 46 160 44 C 196 46 228 66 242 120" stroke="#fffaf6" strokeWidth={10} fill="none" opacity={0.8} />
      <ellipse cx={112} cy={200} rx={20} ry={90} fill="#fff" opacity={0.35} />
      <path
        d="M 6 1500 L 24 196 C 26 74 92 4 160 4 C 228 4 294 74 296 196 L 314 1500 Z"
        fill="url(#skin-fade)"
      />
    </svg>
  );
};
