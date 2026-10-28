import React from "react";
import { random } from "remotion";
import { COLOR } from "../../comun/tema";

// Pierna de costado, sentada: muslo horizontal, rodilla, pantorrilla hacia abajo y pie.
const NERVIO: [number, number][] = [
  [40, 800],
  [300, 806],
  [560, 812],
  [640, 870],
  [652, 1000],
  [660, 1120],
  [720, 1190],
];
/** Dónde aprieta el borde del inodoro (fracción del recorrido del nervio). */
export const T_APRIETE = 0.27;

const largos = NERVIO.slice(1).map((p, k) => Math.hypot(p[0] - NERVIO[k][0], p[1] - NERVIO[k][1]));
const total = largos.reduce((a, b) => a + b, 0);

/** Punto del nervio en la fracción t (0 = cadera, 1 = pie). */
export const puntoNervio = (t: number): [number, number] => {
  let d = Math.min(1, Math.max(0, t)) * total;
  for (let k = 0; k < largos.length; k++) {
    if (d <= largos[k]) {
      const u = d / largos[k];
      return [
        NERVIO[k][0] + (NERVIO[k + 1][0] - NERVIO[k][0]) * u,
        NERVIO[k][1] + (NERVIO[k + 1][1] - NERVIO[k][1]) * u,
      ];
    }
    d -= largos[k];
  }
  return NERVIO[NERVIO.length - 1];
};

/**
 * Pierna por dentro (ilustración cálida): piel, el nervio como un cable amarillo con señales
 * que viajan del pie a la cadera, el borde del inodoro que aprieta y un pie con carita.
 * `apriete` 0..1 achica el nervio; `bloqueo` 0..1 frena las señales; `caos` 0..1 las desordena
 * con chispas (hormigueo); `dormido` 0..1 cierra los ojos del pie.
 */
export const PiernaPorDentro: React.FC<{
  frame: number;
  apriete: number;
  bloqueo: number;
  caos: number;
  dormido: number;
  cable?: number;
}> = ({ frame, apriete, bloqueo, caos, dormido, cable = 0 }) => {
  const pinch = puntoNervio(T_APRIETE);
  const temblor = caos * 4 * Math.sin(frame * 2.3);
  const n = 26;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="fondoPierna" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe3c4" />
          <stop offset="100%" stopColor="#ffc3a8" />
        </linearGradient>
        <filter id="brilloNervio" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={8} />
        </filter>
      </defs>
      <rect width={1080} height={1920} fill="url(#fondoPierna)" />
      <g transform={`translate(${temblor} 0)`}>
        {/* Pierna (piel) */}
        <path
          d="M -40 690 L 560 690 Q 720 700 730 860 L 740 1150 Q 900 1150 920 1210 Q 900 1260 700 1255 L 600 1250 L 580 940 Q 560 910 520 910 L -40 910 Z"
          fill="#e0a77c"
        />
        <path
          d="M -40 690 L 560 690 Q 720 700 730 860 L 740 1150"
          fill="none"
          stroke="#c98a5a"
          strokeWidth={6}
          opacity={0.6}
        />
        {/* Short */}
        <path d="M -40 680 L 260 680 L 280 920 L -40 920 Z" fill="#4a6fd1" />
        {/* Nervio: cable con brillo */}
        <polyline
          points={NERVIO.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke="#ffd34d"
          strokeWidth={34}
          opacity={0.35}
          filter="url(#brilloNervio)"
        />
        <polyline
          points={NERVIO.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke={cable > 0.5 ? "#2b2e35" : "#ffb02e"}
          strokeWidth={20}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {cable > 0.5 ? (
          <polyline
            points={NERVIO.map((p) => p.join(",")).join(" ")}
            fill="none"
            stroke="#ffd34d"
            strokeWidth={8}
            strokeLinejoin="round"
          />
        ) : null}
        {/* Señales: del pie hacia la cadera */}
        {Array.from({ length: n }, (_, i) => {
          const base = 1 - ((((frame * 0.006 + i / n) % 1) + 1) % 1);
          let t = base;
          if (bloqueo > 0 && base < T_APRIETE + 0.02)
            t = T_APRIETE + 0.02 + (i % 5) * 0.012 * bloqueo + (1 - bloqueo) * (base - T_APRIETE - 0.02);
          const [px, py] = puntoNervio(t);
          const jx = caos * (random(`jx${i}${Math.floor(frame / 3)}`) - 0.5) * 40;
          const jy = caos * (random(`jy${i}${Math.floor(frame / 3)}`) - 0.5) * 40;
          return <circle key={i} cx={px + jx} cy={py + jy} r={9} fill="#fff7c2" stroke="#ff9a3c" strokeWidth={3} />;
        })}
        {/* Chispas del hormigueo */}
        {caos > 0
          ? Array.from({ length: 22 }, (_, k) => {
              const [px, py] = puntoNervio(random(`ct${k}`) * 0.95 + 0.05);
              const vida = ((frame + k * 7) % 18) / 18;
              const r = 10 + 22 * vida;
              return (
                <g
                  key={k}
                  transform={`translate(${px + (random(`cx${k}`) - 0.5) * 160} ${py + (random(`cy${k}`) - 0.5) * 140})`}
                  opacity={caos * (1 - vida)}
                >
                  <path
                    d={`M 0 ${-r} L ${r * 0.25} ${-r * 0.25} L ${r} 0 L ${r * 0.25} ${r * 0.25} L 0 ${r} L ${-r * 0.25} ${r * 0.25} L ${-r} 0 L ${-r * 0.25} ${-r * 0.25} Z`}
                    fill="#ffe14d"
                  />
                </g>
              );
            })
          : null}
        {/* Pie con carita */}
        <g transform="translate(830 1205)">
          {[-1, 1].map((l) => (
            <g key={l}>
              <ellipse cx={l * 24} cy={-8} rx={11} ry={13 * (1 - dormido) + 1} fill="#fff" />
              {dormido < 0.5 ? <circle cx={l * 24} cy={-6} r={6} fill="#3a2a22" /> : null}
              {dormido >= 0.5 ? (
                <path
                  d={`M ${l * 24 - 11} -6 Q ${l * 24} 2 ${l * 24 + 11} -6`}
                  fill="none"
                  stroke="#3a2a22"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
              ) : null}
            </g>
          ))}
          <path
            d={
              caos > 0.5
                ? "M -16 18 Q -8 10 0 18 Q 8 26 16 18"
                : dormido > 0.5
                  ? "M -8 18 Q 0 22 8 18"
                  : "M -12 16 Q 0 26 12 16"
            }
            fill="none"
            stroke="#3a2a22"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>
        {dormido > 0.5
          ? ["z", "Z"].map((z, k) => (
              <text
                key={z}
                x={890 + k * 40}
                y={1130 - k * 50 - 8 * Math.sin(frame / 12 + k)}
                fill="#7b6cff"
                fontFamily="Inter, sans-serif"
                fontWeight={800}
                fontSize={44 + k * 16}
                opacity={dormido}
              >
                {z}
              </text>
            ))
          : null}
      </g>
      {/* Borde del inodoro que aprieta el muslo desde abajo */}
      <g transform={`translate(0 ${-apriete * 26})`}>
        <rect x={180} y={905} width={420} height={70} rx={35} fill="#ffffff" stroke="#cfe3dd" strokeWidth={6} />
        {apriete > 0.3
          ? [0, 1, 2].map((k) => (
              <path
                key={k}
                d={`M ${pinch[0] - 40 + k * 40} 1030 l 0 -50 m -14 14 l 14 -14 l 14 14`}
                fill="none"
                stroke={COLOR.rojo}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={apriete}
              />
            ))
          : null}
      </g>
      {/* Marca del apriete en el nervio */}
      {apriete > 0.3 ? (
        <circle
          cx={pinch[0]}
          cy={pinch[1]}
          r={36 + 6 * Math.sin(frame / 5)}
          fill="none"
          stroke={COLOR.rojo}
          strokeWidth={5}
          opacity={apriete}
        />
      ) : null}
    </svg>
  );
};
