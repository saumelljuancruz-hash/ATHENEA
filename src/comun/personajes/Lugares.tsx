import React from "react";
import { random } from "remotion";

/** Baño: pared menta con azulejos, piso cálido, inodoro, toalla y plantita. Inodoro centrado en x=540, asiento en y≈1080. */
export const Bano: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="paredBano" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c8f1e6" />
        <stop offset="100%" stopColor="#8fd9c6" />
      </linearGradient>
      <linearGradient id="pisoBano" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f2c9a0" />
        <stop offset="100%" stopColor="#e3a97a" />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#paredBano)" />
    {Array.from({ length: 12 }, (_, k) => (
      <line
        key={`h${k}`}
        x1={0}
        x2={1080}
        y1={120 * k}
        y2={120 * k}
        stroke="#fff"
        strokeOpacity={0.45}
        strokeWidth={4}
      />
    ))}
    {Array.from({ length: 10 }, (_, k) => (
      <line
        key={`v${k}`}
        x1={120 * k}
        x2={120 * k}
        y1={0}
        y2={1300}
        stroke="#fff"
        strokeOpacity={0.45}
        strokeWidth={4}
      />
    ))}
    <rect x={0} y={1300} width={1080} height={620} fill="url(#pisoBano)" />
    {/* Toalla */}
    <rect x={80} y={420} width={200} height={20} rx={10} fill="#d9b48a" />
    <rect x={95} y={430} width={170} height={300} rx={22} fill="#ff8a7a" />
    <rect x={95} y={660} width={170} height={22} fill="#ffb3a6" />
    {/* Plantita */}
    <rect x={850} y={560} width={110} height={120} rx={18} fill="#ff9a3c" />
    {[-30, 0, 30].map((a, k) => (
      <ellipse
        key={k}
        cx={905 + a}
        cy={520 - (k === 1 ? 30 : 0)}
        rx={26}
        ry={60}
        fill="#3fae7a"
        transform={`rotate(${a} ${905 + a} 560)`}
      />
    ))}
    {/* Inodoro */}
    <rect x={430} y={760} width={220} height={260} rx={30} fill="#ffffff" stroke="#cfe3dd" strokeWidth={6} />
    <rect x={470} y={790} width={60} height={14} rx={7} fill="#cfe3dd" />
    <path
      d="M 400 1040 Q 540 1010 680 1040 L 660 1180 Q 540 1240 420 1180 Z"
      fill="#ffffff"
      stroke="#cfe3dd"
      strokeWidth={6}
    />
    <rect x={470} y={1170} width={140} height={150} rx={30} fill="#ffffff" stroke="#cfe3dd" strokeWidth={6} />
    <ellipse cx={540} cy={1040} rx={150} ry={30} fill="#eef7f4" stroke="#cfe3dd" strokeWidth={6} />
    {children}
  </svg>
);

/** Living: pared durazno → coral, ventana, lámpara con luz cálida, sillón y alfombra. Sillón en y≈1100. */
export const Living: React.FC<{ frame: number; children?: React.ReactNode }> = ({ frame, children }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="paredLiving" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffd9b8" />
        <stop offset="100%" stopColor="#ffb08f" />
      </linearGradient>
      <radialGradient id="luzLampara">
        <stop offset="0%" stopColor="#fff2b3" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#fff2b3" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#paredLiving)" />
    {/* Ventana */}
    <rect x={620} y={300} width={300} height={360} rx={24} fill="#9fd8ff" stroke="#fff" strokeWidth={14} />
    <line x1={770} y1={300} x2={770} y2={660} stroke="#fff" strokeWidth={10} />
    <ellipse cx={720 + 20 * Math.sin(frame / 90)} cy={400} rx={60} ry={22} fill="#fff" opacity={0.9} />
    {/* Lámpara */}
    <circle cx={190} cy={560} r={230} fill="url(#luzLampara)" opacity={0.8 + 0.1 * Math.sin(frame / 25)} />
    <line x1={190} y1={600} x2={190} y2={1240} stroke="#7a4a2e" strokeWidth={10} />
    <path d="M 120 600 L 260 600 L 230 500 L 150 500 Z" fill="#ffc94a" />
    {/* Piso y alfombra */}
    <rect x={0} y={1240} width={1080} height={680} fill="#e89a6f" />
    <ellipse cx={540} cy={1420} rx={420} ry={90} fill="#ffcf6b" opacity={0.85} />
    {/* Sillón */}
    <rect x={220} y={860} width={640} height={240} rx={60} fill="#e8604f" />
    <rect x={170} y={960} width={110} height={260} rx={50} fill="#d24f40" />
    <rect x={800} y={960} width={110} height={260} rx={50} fill="#d24f40" />
    <rect x={250} y={1060} width={580} height={150} rx={40} fill="#f07062" />
    <rect x={230} y={1200} width={30} height={60} fill="#7a4a2e" />
    <rect x={820} y={1200} width={30} height={60} fill="#7a4a2e" />
    {children}
  </svg>
);

/** Dormitorio de noche: pared índigo, luna en la ventana, velador cálido y cama. Cama en y≈1150. */
export const Dormitorio: React.FC<{ frame: number; children?: React.ReactNode }> = ({ frame, children }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="paredDormi" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3b3f8f" />
        <stop offset="100%" stopColor="#5a4fa0" />
      </linearGradient>
      <radialGradient id="luzVelador">
        <stop offset="0%" stopColor="#ffd38a" stopOpacity={0.8} />
        <stop offset="100%" stopColor="#ffd38a" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#paredDormi)" />
    <rect
      x={620}
      y={280}
      width={300}
      height={340}
      rx={24}
      fill="#1f2366"
      stroke="#ffd9a8"
      strokeOpacity={0.4}
      strokeWidth={10}
    />
    <circle cx={780} cy={400} r={50} fill="#fff4cf" />
    <circle cx={802} cy={386} r={44} fill="#1f2366" />
    {Array.from({ length: 10 }, (_, k) => (
      <circle
        key={k}
        cx={640 + random(`e${k}`) * 260}
        cy={300 + random(`f${k}`) * 300}
        r={3}
        fill="#fff"
        opacity={0.4 + 0.5 * Math.abs(Math.sin(frame / 30 + k))}
      />
    ))}
    <circle cx={160} cy={880} r={260} fill="url(#luzVelador)" />
    <rect x={90} y={980} width={150} height={200} rx={20} fill="#c98a5a" />
    <path d="M 120 900 L 210 900 L 195 840 L 135 840 Z" fill="#ffd38a" />
    <rect x={0} y={1300} width={1080} height={620} fill="#4a3f7a" />
    {/* Cama */}
    <rect x={260} y={980} width={760} height={330} rx={40} fill="#f4f1ff" />
    <rect x={240} y={900} width={40} height={420} rx={16} fill="#c98a5a" />
    <rect x={290} y={1000} width={210} height={120} rx={50} fill="#ffffff" />
    <path d="M 480 1060 Q 760 1000 1020 1060 L 1020 1310 L 480 1310 Z" fill="#7b8cff" />
    {children}
  </svg>
);
