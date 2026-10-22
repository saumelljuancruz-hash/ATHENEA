import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Bucle, Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { ContenedorVista } from "../../comun/vista";
import { aLienzoMO, Microondas, MO, puntoMO, rebotes } from "../componentes/Microondas";
import { DefsEsferas, MoleculaAgua, repartir } from "../componentes/Moleculas";
import { Termometro } from "../componentes/Termometro";
import { DATOS, TEXTOS } from "../guion-microondas";
import { MarcasMicroondas } from "../linea-microondas";
import { AREA_MOLECULAS, faseAcelerada, MO_ESCENA } from "./encuadres";

export type PropsMagnetron = { marcas: MarcasMicroondas["magnetron"]; duracion: number };

const MOLECULAS = repartir(9, AREA_MOLECULAS, 52, 74, "magnetron");
const CAJA = { x0: MO.puerta.x0 + 12, x1: MO.puerta.x1 - 8, y0: MO.puerta.y0 + 12, y1: MO.puerta.y1 - 12 };

export const Magnetron: React.FC<PropsMagnetron> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.magnetron;
  const s = (seg: number) => seg * fps;

  const brillo = entre(frame, m.magnetron, m.magnetron + s(0.4)) * (0.75 + 0.25 * Math.sin(frame / 4));
  const ondas = entre(frame, m.ondas, m.ondas + s(1.6), Easing.out(Easing.quad));

  // Zoom a la comida hasta las moléculas.
  const inicioZoom = m.girar - s(0.45);
  const finZoom = inicioZoom + s(0.55);
  const zoom = interpolate(frame, [inicioZoom, finZoom], [1, 26], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.exp),
  });
  const comida = aLienzoMO(MO.comidaCorte, MO_ESCENA);
  const verMoleculas = entre(frame, finZoom - s(0.15), finZoom + s(0.3));

  // Giro: la frecuencia sube "cada vez más rápido".
  const t = Math.max(0, (frame - m.girar) / fps);
  const fase = faseAcelerada(t, 0.5, 6, Math.max(0.5, (m.millones - m.girar) / fps + 0.6));
  const giros = DATOS.girosPorSegundo * Math.pow(entre(frame, m.girar, m.millones + s(0.6), Easing.linear), 2.2);

  // Roce: suben la agitación y la temperatura.
  const calor = entre(frame, m.roce - s(0.2), m.calientan + s(0.9), Easing.inOut(Easing.quad));
  const verTermo = entre(frame, m.roce - s(0.3), m.roce);

  // Punto de rebote en la pared izquierda (para la etiqueta).
  const rebote = rebotes(MO.salida, -2.5, CAJA, 2600)[1];
  const pRebote = puntoMO(rebote, MO_ESCENA);
  const pMagnetron = puntoMO([MO.magnetron[0], MO.magnetron[1] - 62], MO_ESCENA);
  const pOnda = puntoMO([MO.salida[0] - 120, MO.salida[1] + 70], MO_ESCENA);

  return (
    <Escena name="Magnetron">
      <Bucle efecto="microondas" desde={0} duracion={finZoom + 10} />
      <Sfx efecto="whoosh" desde={inicioZoom} volumen={0.35} />
      <Sfx efecto="burbujeo" desde={m.calientan} />

      {verMoleculas < 1 ? (
        <ContenedorVista
          vista={{ zoom, giro: 0, foco: comida, destino: comida }}
          style={{ filter: zoom > 3 ? `blur(${Math.min(16, (zoom - 3) / 2)}px)` : undefined, opacity: 1 - verMoleculas }}
        >
          <Microondas ubicacion={{ ...MO_ESCENA, y: MO_ESCENA.y + flotar(frame, 200, 4) }} modo="corte" rot={frame * 0.035} ondas={ondas} fase={frame * 0.3} magnetron={brillo} />
        </ContenedorVista>
      ) : null}

      {verMoleculas > 0 ? (
        <AbsoluteFill style={{ opacity: verMoleculas, scale: String(interpolate(verMoleculas, [0, 1], [2.4, 1])) }}>
          <svg width={1080} height={1920}>
            <DefsEsferas />
            {/* Campo que se invierte: líneas de onda que barren la escena */}
            {[0, 1, 2, 3].map((k) => {
              const y = 380 + k * 250;
              const d = Array.from({ length: 60 }, (_, i) => {
                const x = 160 + i * 14;
                return `${i ? "L" : "M"}${x},${y + 26 * Math.sin(i * 0.35 - fase * 0.25)}`;
              }).join("");
              return <path key={k} d={d} fill="none" stroke={COLOR.verde} strokeOpacity={0.22} strokeWidth={3} />;
            })}
            {MOLECULAS.map((mol, i) => {
              const agitacion = 3 + 14 * calor;
              const ang = (a: number) => mol.base + 75 * Math.sin(a + mol.fase * 0.3);
              const x = mol.x + Math.sin(frame * 1.3 + mol.fase) * agitacion;
              const y = mol.y + Math.cos(frame * 1.1 + mol.fase * 2) * agitacion;
              const temp = calor * (0.85 + 0.15 * random(`t${i}`));
              const rapido = Math.min(1, (fase / (2 * Math.PI)) / 12);
              return (
                <g key={i}>
                  {/* Estela de giro cuando va rápido */}
                  {rapido > 0.2
                    ? [0.35, 0.7].map((d) => (
                        <MoleculaAgua key={d} x={x} y={y} r={mol.r} angulo={ang(fase - d)} temp={temp} opacidad={0.18 * rapido} />
                      ))
                    : null}
                  <MoleculaAgua x={x} y={y} r={mol.r} angulo={ang(fase)} temp={temp} />
                </g>
              );
            })}
            {/* Chispas de roce */}
            {calor > 0.05
              ? Array.from({ length: 10 }, (_, k) => {
                  const ciclo = Math.floor(frame / 5) + k * 7;
                  const x = 220 + random(`cx${ciclo}`) * 680;
                  const y = 360 + random(`cy${ciclo}`) * 800;
                  const a = random(`ca${ciclo}`) * Math.PI;
                  return (
                    <g key={k} opacity={calor * (0.4 + 0.6 * random(`co${ciclo}`))}>
                      <line x1={x - Math.cos(a) * 14} y1={y - Math.sin(a) * 14} x2={x + Math.cos(a) * 14} y2={y + Math.sin(a) * 14} stroke={COLOR.naranjaCalor} strokeWidth={3} strokeLinecap="round" />
                      <line x1={x - Math.sin(a) * 8} y1={y + Math.cos(a) * 8} x2={x + Math.sin(a) * 8} y2={y - Math.cos(a) * 8} stroke="#ffd29a" strokeWidth={2} strokeLinecap="round" />
                    </g>
                  );
                })
              : null}
          </svg>
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill>
        <HudEtiqueta ancla={pMagnetron} caja={{ x: pMagnetron.x - 60, y: pMagnetron.y - 170 }} lado="izquierda" texto={T.magnetron} color={COLOR.verde} aparece={m.magnetron} desaparece={inicioZoom} tamano={26} />
        <HudEtiqueta ancla={pOnda} caja={{ x: pOnda.x - 200, y: pOnda.y - 330 }} lado="izquierda" texto={T.ondas} color={COLOR.verde} aparece={m.ondas + s(0.5)} desaparece={inicioZoom} />
        <HudEtiqueta ancla={pRebote} caja={{ x: 100, y: MO_ESCENA.y + 320 }} texto={T.paredes} color={COLOR.azul} aparece={m.ondas + s(1.2)} desaparece={inicioZoom} tamano={22} />
      </AbsoluteFill>

      <Termometro x={70} y={520} alto={460} t={calor} min={DATOS.tempInicial} max={DATOS.tempFinal} etiqueta={T.termometro} opacidad={verTermo} />

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      {frame >= m.girar - s(0.2) ? (
        <ContadorHud etiqueta={T.contador} valor={giros} unidad={T.unidad} color={COLOR.verde} aparece={m.girar - s(0.2)} />
      ) : null}
    </Escena>
  );
};
