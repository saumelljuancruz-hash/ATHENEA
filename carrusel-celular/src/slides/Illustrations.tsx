import React from "react";
import { random } from "remotion";
import { Face } from "../components/Face";
import { Phone, TEAL } from "../components/Props";
import { Label, Panel } from "../components/Ui";
import { C, DISPLAY, MONO } from "../theme";

const RED = C.positive;

/** Ícono de obturador mecánico (las láminas de un diafragma). */
const Aperture: React.FC<{ size: number }> = ({ size }) => {
  const r = 90;
  const hex = new Array(6).fill(0).map((_, i) => {
    const a = (i / 6) * Math.PI * 2;
    return [Math.cos(a) * 34, Math.sin(a) * 34];
  });
  return (
    <svg width={size} height={size} viewBox="-110 -110 220 220">
      <circle r={r} fill="#141b2a" stroke="#5a6680" strokeWidth={8} />
      {hex.map(([x, y], i) => {
        const a = (i / 6) * Math.PI * 2 + 0.95;
        return <line key={i} x1={x} y1={y} x2={Math.cos(a) * r} y2={Math.sin(a) * r} stroke="#7b88a6" strokeWidth={6} strokeLinecap="round" />;
      })}
      <polygon points={hex.map(([x, y]) => `${x},${y}`).join(" ")} fill="#05070c" stroke="#7b88a6" strokeWidth={5} />
      <path d="M -78 -78 L 78 78 M 78 -78 L -78 78" stroke={RED} strokeWidth={18} strokeLinecap="round" />
    </svg>
  );
};

/** 1 · El clic de la cámara es un sonido grabado. */
export const ShutterIllo: React.FC = () => (
  <div style={{ position: "relative", width: 940, height: 520 }}>
    <div style={{ position: "absolute", left: 50, top: 10, rotate: "-8deg" }}>
      <Phone width={240}>
        <div style={{ position: "absolute", bottom: -20 }}>
          <Face width={230} mirrored />
        </div>
      </Phone>
    </div>
    <svg width={940} height={520} style={{ position: "absolute", left: 0, top: 0 }}>
      <g transform="translate(340 150)">
        <path d="M 0 -34 H 34 L 84 -78 V 78 L 34 34 H 0 Z" fill={C.yellow} />
        {[60, 100, 140].map((r, i) => (
          <path key={r} d={`M ${84 + r * 0.55} ${-r * 0.8} A ${r} ${r} 0 0 1 ${84 + r * 0.55} ${r * 0.8}`} fill="none" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" opacity={1 - i * 0.25} />
        ))}
      </g>
    </svg>
    <div style={{ position: "absolute", left: 600, top: 70 }}>
      <Panel glow={C.yellow} style={{ padding: "12px 26px", rotate: "4deg" }}>
        <Label size={84} mono color={C.yellow}>
          ¡CLIC!
        </Label>
        <Label size={28} color={C.dim} style={{ marginTop: 8 }}>
          = AUDIO GRABADO
        </Label>
      </Panel>
    </div>
    <div style={{ position: "absolute", left: 420, top: 300, display: "flex", alignItems: "center", gap: 24 }}>
      <Aperture size={190} />
      <Label size={36} color={RED} style={{ whiteSpace: "normal", width: 260, lineHeight: 1.1 }}>
        SIN OBTURADOR MECÁNICO
      </Label>
    </div>
  </div>
);

/** 2 · El agujerito al lado de la cámara es un micrófono. */
export const MicIllo: React.FC = () => {
  const lens = (cx: number, cy: number) => (
    <g key={`${cx}-${cy}`}>
      <circle cx={cx} cy={cy} r={84} fill="#0a0d14" stroke="#5a6680" strokeWidth={8} />
      <circle cx={cx} cy={cy} r={58} fill="url(#lens-glass)" />
      <circle cx={cx} cy={cy} r={24} fill="#05070c" />
      <circle cx={cx - 20} cy={cy - 22} r={12} fill="#fff" opacity={0.35} />
    </g>
  );
  const hole = { x: 408, y: 402 };
  return (
    <div style={{ position: "relative", width: 940, height: 520 }}>
      <svg width={600} height={520} viewBox="0 0 600 520" style={{ position: "absolute", left: 40, top: 0 }}>
        <defs>
          <radialGradient id="lens-glass" cx="0.35" cy="0.35" r="0.8">
            <stop offset="0" stopColor="#4b6ea8" />
            <stop offset="0.6" stopColor="#12233f" />
            <stop offset="1" stopColor="#05070c" />
          </radialGradient>
        </defs>
        <rect x={40} y={30} width={460} height={460} rx={110} fill="#1a2030" stroke="#3a4560" strokeWidth={6} />
        {lens(170, 150)}
        {lens(170, 370)}
        {lens(380, 260)}
        <circle cx={400} cy={110} r={30} fill="#fff6d6" />
        <circle cx={400} cy={110} r={30} fill="none" stroke="#c9b57a" strokeWidth={4} />
        <circle cx={hole.x} cy={hole.y} r={10} fill="#05070c" stroke="#7b88a6" strokeWidth={3} />
        <circle cx={hole.x} cy={hole.y} r={34} fill="none" stroke={C.yellow} strokeWidth={7} />
        {[70, 110, 150].map((r, i) => (
          <path key={r} d={`M ${hole.x + r * 0.7} ${hole.y - r * 0.7} A ${r} ${r} 0 0 1 ${hole.x + r * 0.7} ${hole.y + r * 0.7}`} fill="none" stroke={TEAL} strokeWidth={8} strokeLinecap="round" opacity={0.9 - i * 0.25} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 640, top: 360 }}>
        <Panel glow={C.yellow} style={{ padding: "10px 22px" }}>
          <Label size={44} color={C.yellow}>
            MICRÓFONO
          </Label>
        </Panel>
      </div>
      <svg width={940} height={520} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M 636 396 C 560 400 520 410 492 404" fill="none" stroke={C.yellow} strokeWidth={6} strokeLinecap="round" />
      </svg>
    </div>
  );
};

/** 3 · Un QR se puede leer aunque le falte hasta el 30 %. */
export const QrIllo: React.FC = () => {
  const n = 25;
  const size = 440;
  const cell = size / n;
  const finder = (x: number, y: number) => {
    const inBox = (cx: number, cy: number) => x >= cx && x < cx + 7 && y >= cy && y < cy + 7;
    for (const [cx, cy] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
      if (inBox(cx, cy)) {
        const dx = x - cx;
        const dy = y - cy;
        return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) ? 1 : 0;
      }
      if (x >= cx - 1 && x <= cx + 7 && y >= cy - 1 && y <= cy + 7) {
        return 0;
      }
    }
    return -1;
  };
  // Triángulo arrancado abajo a la derecha: catetos de 0,775 × lado ≈ 30 % del área.
  const leg = size * Math.sqrt(0.6);
  const tear = new Array(13).fill(0).map((_, i) => {
    const t = i / 12;
    const jitter = i === 0 || i === 12 ? 0 : (random(`tear${i}`) - 0.5) * 34;
    return [size - leg + leg * t + jitter * 0.7, size - leg * t + jitter * 0.7];
  });
  const pad = 30;
  return (
    <div style={{ position: "relative", width: 940, height: 520 }}>
      <svg width={size + pad * 2} height={size + pad * 2} style={{ position: "absolute", left: 470 - size / 2 - pad - 90, top: 260 - size / 2 - pad }}>
        <g transform={`translate(${pad} ${pad})`}>
          <rect x={-18} y={-18} width={size + 36} height={size + 36} rx={18} fill="#f4efe6" />
          {new Array(n * n).fill(0).map((_, i) => {
            const x = i % n;
            const y = Math.floor(i / n);
            const f = finder(x, y);
            const on = f === -1 ? random(`qr${i}`) > 0.52 : f === 1;
            return on ? <rect key={i} x={x * cell} y={y * cell} width={cell + 0.5} height={cell + 0.5} fill="#0b0f17" /> : null;
          })}
          <path d={`M ${tear.map(([x, y]) => `${x} ${y}`).join(" L ")} L ${size + 40} ${size + 40} Z`} fill="#0d1d22" />
          <polyline points={tear.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke="#d8cfbd" strokeWidth={6} strokeLinejoin="round" />
        </g>
        {[
          [6, 6, 1, 1],
          [size + pad * 2 - 6, 6, -1, 1],
          [6, size + pad * 2 - 6, 1, -1],
          [size + pad * 2 - 6, size + pad * 2 - 6, -1, -1],
        ].map(([x, y, sx, sy], i) => (
          <path key={i} d={`M ${x} ${y + sy * 70} L ${x} ${y} L ${x + sx * 70} ${y}`} fill="none" stroke={TEAL} strokeWidth={10} strokeLinecap="round" />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 640, top: 150, display: "flex", flexDirection: "column", gap: 22 }}>
        <Panel glow={RED} style={{ padding: "10px 22px" }}>
          <Label size={64} mono color={RED}>
            −30%
          </Label>
        </Panel>
        <Panel glow={TEAL} style={{ padding: "10px 22px", display: "flex", alignItems: "center", gap: 14 }}>
          <svg width={44} height={44} viewBox="0 0 44 44">
            <path d="M 8 23 L 18 33 L 37 11" fill="none" stroke={TEAL} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Label size={36} color={TEAL}>
            SE LEE IGUAL
          </Label>
        </Panel>
      </div>
    </div>
  );
};

/** 4 · La @ era una medida de peso. */
export const ArrobaIllo: React.FC = () => (
  <svg width={940} height={520} viewBox="0 0 940 520">
    <rect x={455} y={110} width={30} height={360} rx={12} fill="#5a6680" />
    <rect x={360} y={462} width={220} height={30} rx={14} fill="#5a6680" />
    <rect x={150} y={96} width={640} height={22} rx={11} fill="#8b97b5" />
    <circle cx={470} cy={107} r={22} fill={C.yellow} />
    {[230, 710].map((x) => (
      <g key={x} stroke="#8b97b5" strokeWidth={5}>
        <line x1={x} y1={110} x2={x - 110} y2={330} />
        <line x1={x} y1={110} x2={x + 110} y2={330} />
      </g>
    ))}
    {[230, 710].map((x) => (
      <path key={x} d={`M ${x - 140} 330 Q ${x} 400 ${x + 140} 330 Z`} fill="#2a3245" stroke="#8b97b5" strokeWidth={5} />
    ))}
    <text x={230} y={318} textAnchor="middle" fontFamily={DISPLAY} fontWeight={900} fontSize={250} fill={C.yellow} style={{ filter: `drop-shadow(0 0 26px ${C.yellow}88)` }}>
      @
    </text>
    <path d="M 596 330 L 620 216 H 800 L 824 330 Z" fill="#c5ccdb" stroke="#8b97b5" strokeWidth={4} />
    <rect x={686} y={190} width={48} height={32} rx={10} fill="none" stroke="#c5ccdb" strokeWidth={10} />
    <text x={710} y={294} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={42} fill="#0b0f17">
      11,5 kg
    </text>
  </svg>
);

/** 5 · Más memoria que la computadora del Apolo 11. */
export const ApolloIllo: React.FC = () => (
  <div style={{ position: "relative", width: 940, height: 520 }}>
    <svg width={260} height={430} viewBox="0 0 100 300" style={{ position: "absolute", left: 40, top: 10 }}>
      <path d="M 50 0 C 62 18 66 36 66 54 L 66 250 L 84 284 L 84 300 L 16 300 L 16 284 L 34 250 L 34 54 C 34 36 38 18 50 0 Z" fill="#e6e9f0" />
      <rect x={34} y={96} width={32} height={10} fill="#0b0f17" />
      <rect x={34} y={186} width={32} height={10} fill="#0b0f17" />
      <path d="M 36 300 L 42 320 L 58 320 L 64 300 Z" fill={C.heat} opacity={0.9} />
    </svg>
    <div style={{ position: "absolute", left: 20, top: 450, width: 300, textAlign: "center" }}>
      <Label size={30} color={C.dim} style={{ whiteSpace: "normal" }}>
        APOLO 11 · 1969
      </Label>
    </div>
    <div style={{ position: "absolute", left: 230, top: 330, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 8, height: 8, background: C.yellow, boxShadow: `0 0 12px ${C.yellow}` }} />
      <Label size={44} mono color={C.yellow}>
        4 KB
      </Label>
    </div>
    <div style={{ position: "absolute", left: 360, top: 150 }}>
      <Panel glow={C.yellow} style={{ padding: "10px 22px", rotate: "-6deg" }}>
        <Label size={56} mono color={C.yellow}>
          ×2.000.000
        </Label>
      </Panel>
    </div>
    <div style={{ position: "absolute", left: 560, top: 250, width: 340, height: 230, borderRadius: 20, background: `linear-gradient(135deg, ${TEAL}, #0d5f52)`, boxShadow: `0 0 60px ${TEAL}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Label size={84} mono color="#04231e" style={{ textShadow: "none" }}>
        8 GB
      </Label>
    </div>
    <div style={{ position: "absolute", left: 560, top: 490, width: 340, textAlign: "center" }}>
      <Label size={30} color={C.dim}>
        TU CELULAR
      </Label>
    </div>
  </div>
);

/** 6 · Entre 20 y 80 % la batería dura más años. */
export const BatteryIllo: React.FC = () => {
  const x0 = 60;
  const w = 720;
  const at = (p: number) => x0 + (w * p) / 100;
  return (
    <svg width={940} height={520} viewBox="0 0 940 520">
      <rect x={x0} y={150} width={w} height={230} rx={40} fill="#0b0f17" stroke="#fff" strokeWidth={10} />
      <rect x={x0 + w + 12} y={215} width={40} height={100} rx={12} fill="#fff" />
      <rect x={at(0) + 14} y={164} width={at(20) - at(0) - 14} height={202} rx={28} fill={RED} opacity={0.35} />
      <rect x={at(20)} y={164} width={at(80) - at(20)} height={202} fill={TEAL} opacity={0.85} />
      <rect x={at(80)} y={164} width={at(100) - at(80) - 14} height={202} rx={28} fill={RED} opacity={0.35} />
      <path d={`M ${at(52)} 196 L ${at(44)} 272 H ${at(50)} L ${at(46)} 336 L ${at(58)} 252 H ${at(52)} Z`} fill="#04231e" />
      {[0, 20, 80, 100].map((p) => (
        <g key={p}>
          <line x1={at(p)} x2={at(p)} y1={392} y2={420} stroke="#fff" strokeWidth={5} opacity={0.7} />
          <text x={at(p)} y={462} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={38} fill={p === 20 || p === 80 ? TEAL : "#fff"}>
            {p}%
          </text>
        </g>
      ))}
      <text x={at(50)} y={118} textAnchor="middle" fontFamily={DISPLAY} fontWeight={900} fontSize={44} fill={TEAL}>
        ZONA IDEAL
      </text>
      <text x={at(10)} y={118} textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize={30} fill={RED}>
        ESTRÉS
      </text>
      <text x={at(90)} y={118} textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize={30} fill={RED}>
        ESTRÉS
      </text>
    </svg>
  );
};
