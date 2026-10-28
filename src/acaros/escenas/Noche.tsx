import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { entre } from "../../comun/anim";
import { Cortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Acaro, Melatonina, POROS, SuperficiePiel } from "../componentes/Piel";
import { TEXTOS } from "../guion-acaros";
import { MarcasAcaros } from "../linea-acaros";

export type PropsNoche = { marcas: MarcasAcaros["noche"]; duracion: number };

const ENCUENTRO = { x: (POROS[5].x + POROS[6].x) / 2, y: (POROS[5].y + POROS[6].y) / 2 + 60 };
const REGLA = { x: 140, y: 1060, ancho: 800 };

/** Reloj de agujas: `minutos` 0..60. */
const Reloj: React.FC<{ x: number; y: number; minutos: number }> = ({ x, y, minutos }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={90} fill="rgba(8,9,11,0.85)" stroke="#9fb7ff" strokeWidth={6} />
    <path d={`M 0 0 L 0 -80 A 80 80 0 ${minutos > 30 ? 1 : 0} 1 ${80 * Math.sin((minutos / 60) * 2 * Math.PI)} ${-80 * Math.cos((minutos / 60) * 2 * Math.PI)} Z`} fill="#9fb7ff" opacity={0.25} />
    <line x1={0} y1={0} x2={70 * Math.sin((minutos / 60) * 2 * Math.PI)} y2={-70 * Math.cos((minutos / 60) * 2 * Math.PI)} stroke="#9fb7ff" strokeWidth={8} strokeLinecap="round" />
    <circle r={10} fill="#9fb7ff" />
  </g>
);

export const Noche: React.FC<PropsNoche> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.noche;
  const s = (seg: number) => seg * fps;

  const noche = entre(frame, m.noche - s(0.2), m.noche + s(0.6));
  const hormona = entre(frame, m.hormona - s(0.1), m.hormona + s(0.6));
  const salen = entre(frame, m.hormona + s(0.3), m.pareja + s(0.6));
  const pareja = entre(frame, m.pareja - s(0.1), m.bueno - s(0.1));
  const camino = entre(frame, m.bueno, duracion);
  const hora =
    frame < m.noche
      ? 15
      : frame < m.bueno
        ? Math.floor(interpolate(frame, [m.noche, m.bueno], [23, 26], { extrapolateRight: "clamp" })) % 24
        : 2 + Math.floor(camino);

  const superficie = (
    <SuperficiePiel poros={POROS} noche={noche}>
      {/* Luna */}
      <g opacity={noche} transform={`translate(880 ${interpolate(noche, [0, 1], [-100, 300])})`}>
        <circle r={70} fill="#f4f1e6" />
        <circle cx={28} cy={-18} r={62} fill="#2a2c45" />
      </g>
      {/* Melatonina que sube */}
      {hormona > 0
        ? Array.from({ length: 10 }, (_, k) => {
            const a = ((frame - m.hormona + k * 22) % 160) / 160;
            return <Melatonina key={k} x={80 + ((k * 97) % 900)} y={1500 - a * 1200} escala={1.2} opacidad={hormona * Math.sin(Math.PI * Math.max(0, a))} />;
          })
        : null}
      {/* Ácaros saliendo de los poros */}
      {POROS.map((p, k) => {
        if (k === 5 || k === 6) return null;
        const dir = random(`d${k}`) * 360;
        const sale = salen * (0.6 + 0.4 * random(`s${k}`));
        const rad = (dir * Math.PI) / 180;
        return (
          <Acaro key={k} x={p.x + Math.sin(rad) * 120 * sale} y={p.y - Math.cos(rad) * 120 * sale} escala={0.45} rot={dir} frame={frame} camina={salen > 0 && salen < 1 ? 1 : 0} brillo={hormona} opacidad={0.3 + 0.7 * sale} />
        );
      })}
      {/* La pareja: dos ácaros que se encuentran */}
      {[POROS[5], POROS[6]].map((p, k) => {
        const t = Math.max(salen * 0.25, pareja);
        const x = interpolate(t, [0, 1], [p.x, ENCUENTRO.x + (k ? 40 : -40)]);
        const y = interpolate(t, [0, 1], [p.y, ENCUENTRO.y]);
        const rot = (Math.atan2(ENCUENTRO.x - p.x, -(ENCUENTRO.y - p.y)) * 180) / Math.PI;
        return <Acaro key={`p${k}`} x={x} y={y} escala={0.55} rot={rot} frame={frame} camina={pareja > 0 && pareja < 1 ? 1 : 0} brillo={hormona} opacidad={0.3 + 0.7 * Math.max(salen, pareja)} />;
      })}
    </SuperficiePiel>
  );

  const regla = (
    <AbsoluteFill style={{ background: "#141724" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect x={REGLA.x - 20} y={REGLA.y} width={REGLA.ancho + 40} height={90} rx={10} fill="#e6d9b8" />
        {Array.from({ length: 11 }, (_, k) => (
          <line key={k} x1={REGLA.x + k * 80} x2={REGLA.x + k * 80} y1={REGLA.y} y2={REGLA.y + (k % 5 === 0 ? 60 : 34)} stroke="#3a2f22" strokeWidth={k % 5 === 0 ? 5 : 3} />
        ))}
        {["0", "1 cm"].map((t, k) => (
          <text key={t} x={REGLA.x + k * 800} y={REGLA.y + 140} textAnchor="middle" fill={COLOR.texto} fontFamily={FUENTE.mono} fontWeight={700} fontSize={32}>
            {t}
          </text>
        ))}
        <path d={`M ${REGLA.x} ${REGLA.y - 30} L ${REGLA.x + camino * REGLA.ancho} ${REGLA.y - 30}`} stroke={COLOR.verde} strokeWidth={6} strokeDasharray="4 12" strokeLinecap="round" />
        <Acaro x={REGLA.x + camino * REGLA.ancho} y={REGLA.y - 30} escala={0.6} rot={90} frame={frame} camina={1} />
        <Reloj x={540} y={640} minutos={camino * 60} />
      </svg>
    </AbsoluteFill>
  );

  return (
    <Escena name="Noche">
      <Sfx efecto="whoosh" desde={m.noche} volumen={0.2} />
      <Sfx efecto="brillo" desde={m.hormona} volumen={0.3} />
      <Sfx efecto="estirar" desde={m.pareja} volumen={0.2} />
      <Sfx efecto="tap" desde={m.bueno} volumen={0.4} />
      <Planos
        planos={[
          {
            desde: 0,
            contenido: (
              <Cortes
                cortes={[
                  { desde: 0, zoom: 1.1, foco: [540, 900] },
                  { desde: m.noche, zoom: 1, foco: [540, 900] },
                  { desde: m.hormona, zoom: 1.3, foco: [540, 820] },
                ]}
              >
                {superficie}
              </Cortes>
            ),
          },
          {
            desde: m.pareja - s(0.1),
            contenido: (
              <Cortes cortes={[{ desde: m.pareja, zoom: 2, foco: [ENCUENTRO.x, ENCUENTRO.y - 40] }]}>{superficie}</Cortes>
            ),
          },
          { desde: m.bueno - s(0.1), contenido: regla },
        ]}
      />
      <AbsoluteFill style={{ opacity: frame < m.pareja - s(0.1) ? 1 : 0 }}>
        <HudEtiqueta ancla={{ x: 500, y: 760 }} caja={{ x: 110, y: 470 }} texto={T.melatonina} color="#9fb7ff" aparece={m.hormona + s(0.3)} tamano={30} />
      </AbsoluteFill>
      <HudEtiqueta ancla={{ x: 540, y: 820 }} caja={{ x: 110, y: 470 }} texto={T.pareja} color={COLOR.magenta} aparece={m.pareja + s(0.4)} desaparece={m.bueno - s(0.1)} tamano={30} />
      <AbsoluteFill style={{ opacity: frame >= m.bueno ? 1 : 0 }}>
        <HudEtiqueta ancla={{ x: 940, y: 1060 }} caja={{ x: 700, y: 900 }} texto={T.velocidad} color={COLOR.verde} aparece={m.centimetro} tamano={30} />
        <HudEtiqueta ancla={{ x: 620, y: 600 }} caja={{ x: 700, y: 470 }} texto={T.hora} color="#9fb7ff" aparece={m.centimetro + s(0.3)} tamano={30} />
      </AbsoluteFill>
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={hora} unidad=" h" color={noche > 0.5 ? "#9fb7ff" : COLOR.naranja} aparece={s(0.2)} />
    </Escena>
  );
};
