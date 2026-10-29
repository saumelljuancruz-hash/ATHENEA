import React from "react";

/** Tamaño del dibujo y dónde está cada rasgo, para marcarlos desde afuera. */
export const FACE = {
  width: 600,
  height: 760,
  eyeL: [210, 345] as const,
  eyeR: [390, 331] as const,
  mouthL: [232, 528] as const,
  mouthR: [372, 514] as const,
  part: [228, 104] as const,
  mark: [404, 462] as const,
  noseY: 466,
};

type FaceProps = {
  width: number;
  /** Ancho de la nariz: 1 normal, 1.3 como en una selfie a 30 cm. */
  nose?: number;
  expression?: "smile" | "cringe";
  /** Dibujada al revés, como en el espejo. */
  mirrored?: boolean;
  style?: React.CSSProperties;
};

/**
 * Una cara con asimetrías a propósito: el ojo derecho más alto, la sonrisa
 * torcida, la raya del pelo a un costado y un lunar en la mejilla.
 */
export const Face: React.FC<FaceProps> = ({ width, nose = 1, expression = "smile", mirrored = false, style }) => {
  const w = 74 * nose;
  const cx = 300;
  return (
    <svg
      width={width}
      height={(width / FACE.width) * FACE.height}
      viewBox={`0 0 ${FACE.width} ${FACE.height}`}
      style={{ overflow: "visible", scale: mirrored ? "-1 1" : undefined, ...style }}
    >
      <defs>
        <radialGradient id="face-skin" cx="0.45" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#f6cdb0" />
          <stop offset="0.7" stopColor="#e7ad89" />
          <stop offset="1" stopColor="#c98a68" />
        </radialGradient>
        <linearGradient id="face-shirt" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#2fc7ab" />
          <stop offset="1" stopColor="#0d5f52" />
        </linearGradient>
        <linearGradient id="face-hair" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#4a2e20" />
          <stop offset="1" stopColor="#1e120c" />
        </linearGradient>
      </defs>
      <path d="M 30 760 C 50 650 165 612 300 612 C 435 612 550 650 570 760 Z" fill="url(#face-shirt)" />
      <path d="M 238 520 L 238 640 C 262 664 338 664 362 640 L 362 520 Z" fill="#c98a68" />
      <ellipse cx={100} cy={388} rx={32} ry={56} fill="#dfa07c" />
      <ellipse cx={500} cy={388} rx={32} ry={56} fill="#dfa07c" />
      <path d="M 300 108 C 422 108 502 200 502 340 C 502 472 440 602 300 612 C 160 602 98 472 98 340 C 98 200 178 108 300 108 Z" fill="url(#face-skin)" />
      <ellipse cx={188} cy={452} rx={42} ry={24} fill="#ff8f80" opacity={0.25} />
      <ellipse cx={412} cy={446} rx={42} ry={24} fill="#ff8f80" opacity={0.25} />
      {/* Pelo con la raya del lado izquierdo */}
      <path
        d="M 90 362 C 66 160 190 48 322 56 C 452 64 544 170 510 362 C 494 270 452 212 382 192 C 332 180 282 174 238 152 C 216 204 162 244 118 282 C 104 304 96 332 90 362 Z"
        fill="url(#face-hair)"
      />
      <path d="M 224 74 C 226 102 230 128 238 152" stroke="#e7ad89" strokeWidth={7} fill="none" strokeLinecap="round" />
      {/* Cejas: la derecha más alta */}
      <path d="M 160 302 C 190 284 236 284 262 296" stroke="#2b1a12" strokeWidth={15} fill="none" strokeLinecap="round" />
      <path d="M 338 286 C 364 270 410 270 442 286" stroke="#2b1a12" strokeWidth={15} fill="none" strokeLinecap="round" />
      {/* Ojos: el derecho 14 px más arriba */}
      {[FACE.eyeL, FACE.eyeR].map(([x, y]) => (
        <g key={x}>
          <ellipse cx={x} cy={y} rx={40} ry={22} fill="#fffaf6" />
          <circle cx={x + 2} cy={y + 2} r={17} fill="#5a3826" />
          <circle cx={x + 2} cy={y + 2} r={8} fill="#120a06" />
          <circle cx={x + 8} cy={y - 4} r={5} fill="#fff" />
          <path d={`M ${x - 42} ${y} C ${x - 20} ${y - 28} ${x + 20} ${y - 28} ${x + 42} ${y}`} stroke="#3a2418" strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      ))}
      {/* Nariz */}
      <path d={`M ${cx} 350 C ${cx - 6} 390 ${cx - 10} 420 ${cx - 6} 440`} stroke="#c98a68" strokeWidth={5} fill="none" opacity={0.7} strokeLinecap="round" />
      <path
        d={`M ${cx - w / 2} ${FACE.noseY - 12} C ${cx - w / 2 - 10} ${FACE.noseY + 8} ${cx - w / 4} ${FACE.noseY + 20} ${cx} ${FACE.noseY + 16} C ${cx + w / 4} ${FACE.noseY + 20} ${cx + w / 2 + 10} ${FACE.noseY + 8} ${cx + w / 2} ${FACE.noseY - 12}`}
        stroke="#b8775a"
        strokeWidth={7}
        fill="#e7ad89"
        strokeLinecap="round"
      />
      <ellipse cx={cx - w * 0.26} cy={FACE.noseY + 6} rx={9 * nose} ry={6} fill="#8f553e" />
      <ellipse cx={cx + w * 0.26} cy={FACE.noseY + 6} rx={9 * nose} ry={6} fill="#8f553e" />
      {/* Boca: la comisura derecha más arriba */}
      {expression === "smile" ? (
        <>
          <path d={`M ${FACE.mouthL[0]} ${FACE.mouthL[1]} C 270 566 336 562 ${FACE.mouthR[0]} ${FACE.mouthR[1]} C 334 540 268 546 ${FACE.mouthL[0]} ${FACE.mouthL[1]} Z`} fill="#8e2f35" />
          <path d={`M 258 540 C 285 548 318 546 346 534`} stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <path d={`M ${FACE.mouthL[0] + 6} 536 C 258 524 280 544 300 532 C 320 520 344 544 ${FACE.mouthR[0] - 6} 528`} stroke="#8e2f35" strokeWidth={10} fill="none" strokeLinecap="round" />
      )}
      {/* Lunar */}
      <circle cx={FACE.mark[0]} cy={FACE.mark[1]} r={8} fill="#5a3324" />
    </svg>
  );
};
