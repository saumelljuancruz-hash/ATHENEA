import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Telefono } from "../../faceid/componentes/Telefono";
import { Caminante, CarritoLateral, MapaCiudad, PantallaMapa } from "../componentes/Ciudad";
import { DATOS, TEXTOS } from "../guion-trafico";
import { MarcasTrafico } from "../linea-trafico";

export type PropsCarrito = { marcas: MarcasTrafico["carrito"]; duracion: number };

/** Calle de costado, vacía: veredas, edificios y faroles. */
const CalleLateral: React.FC<{ avance: number }> = ({ avance }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="cieloBerlin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1f2a3a" />
        <stop offset="100%" stopColor="#3a4658" />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#cieloBerlin)" />
    {/* Edificios que pasan lento */}
    {Array.from({ length: 9 }, (_, k) => {
      const x = ((k * 190 - avance * 0.6) % 1710 + 1710) % 1710 - 300;
      const alto = 380 + ((k * 137) % 260);
      return (
        <g key={k}>
          <rect x={x} y={1150 - alto} width={170} height={alto} fill={k % 2 ? "#2a2d33" : "#30343c"} />
          {Array.from({ length: Math.floor(alto / 70) }, (_, j) => (
            <rect key={j} x={x + 24} y={1150 - alto + 30 + j * 70} width={120} height={30} rx={4} fill="#ffd27a" opacity={(k + j) % 3 === 0 ? 0.35 : 0.08} />
          ))}
        </g>
      );
    })}
    <rect x={0} y={1150} width={1080} height={40} fill="#4a4e57" />
    <rect x={0} y={1190} width={1080} height={1100} fill="#2f3238" />
    {Array.from({ length: 8 }, (_, k) => (
      <rect key={k} x={((k * 200 - avance) % 1600 + 1600) % 1600 - 200} y={1330} width={110} height={12} rx={6} fill="#d9dce3" opacity={0.6} />
    ))}
  </svg>
);

export const Carrito: React.FC<PropsCarrito> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.carrito;
  const s = (seg: number) => seg * fps;

  const cantidad = interpolate(frame, [m.celulares - s(0.2), m.celulares + s(1.6)], [0, DATOS.celulares], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rojo = entre(frame, m.rojo - s(0.2), m.rojo + s(0.9));
  const banner = resorte(frame, fps, m.embotellamiento, { damping: 12 });
  const avance = frame * 2.2;
  const pin = resorte(frame, fps, m.berlin, { damping: 11 });

  // La calle va más arriba para que los subtítulos no tapen el carrito.
  const calle = (
    <AbsoluteFill style={{ background: "#2f3238" }}>
      <AbsoluteFill style={{ translate: "0 -280px" }}>
        <CalleLateral avance={avance} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <CarritoLateral x={420} y={1250} escala={1.1} cantidad={cantidad} frame={frame} rueda={avance} />
          <Caminante x={760} y={1300} escala={1.5} frame={frame} />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );

  return (
    <Escena name="Carrito">
      <Sfx efecto="ping" desde={m.berlin} volumen={0.25} />
      <Sfx efecto="burbujeo" desde={m.celulares} volumen={0.25} />
      <Sfx efecto="bip" desde={m.rojo} volumen={0.25} />
      <Sfx efecto="pop" desde={m.embotellamiento} volumen={0.35} />
      <Planos
        planos={[
          {
            desde: 0,
            contenido: (
              <AbsoluteFill style={{ scale: String(interpolate(frame, [0, m.celulares], [1.05, 1.25])) }}>
                <MapaCiudad frame={frame}>
                  <g transform={`translate(540 ${1000 - 40 * pin}) scale(${pin})`}>
                    <path d="M0 0 C -40 -50 -60 -80 -60 -110 A 60 60 0 1 1 60 -110 C 60 -80 40 -50 0 0 Z" fill={COLOR.rojo} />
                    <circle cx={0} cy={-110} r={22} fill="#fff" />
                  </g>
                </MapaCiudad>
              </AbsoluteFill>
            ),
          },
          { desde: m.celulares - s(0.15), contenido: <AbsoluteFill style={{ scale: "1.55", transformOrigin: "40% 62%" }}>{calle}</AbsoluteFill> },
          { desde: m.caminar - s(0.1), contenido: <AbsoluteFill style={{ scale: String(interpolate(frame, [m.caminar, m.paso], [1, 1.08])) }}>{calle}</AbsoluteFill> },
          {
            desde: m.paso - s(0.1),
            contenido: (
              <AbsoluteFill style={{ background: "#16171a" }}>
                <Telefono ubicacion={{ x: 520, y: 880 + flotar(frame, 160, 5), rot: -4 + 2 * banner, escala: 1.3 }} pantalla="apagada">
                  <PantallaMapa rojo={rojo} banner={banner} frame={frame} texto={T.embotellamiento} />
                </Telefono>
              </AbsoluteFill>
            ),
          },
          { desde: m.vacia - s(0.1), contenido: <AbsoluteFill style={{ scale: String(interpolate(frame, [m.vacia, duracion], [1.15, 1.25])) }}>{calle}</AbsoluteFill> },
        ]}
      />

      <AbsoluteFill>
        <HudEtiqueta ancla={{ x: 540, y: 880 }} caja={{ x: 600, y: 760 }} texto={T.lugar} color={COLOR.rojo} aparece={m.berlin + s(0.2)} desaparece={m.celulares - s(0.2)} tamano={26} />
        <HudEtiqueta ancla={{ x: 760, y: 830 }} caja={{ x: 560, y: 560 }} lado="izquierda" texto={T.velocidad} color={COLOR.azul} aparece={m.caminar + s(0.3)} desaparece={m.paso - s(0.1)} tamano={26} />
        <HudEtiqueta ancla={{ x: 540, y: 880 }} caja={{ x: 120, y: 560 }} texto={T.vacia} color={COLOR.verde} aparece={m.vacia + s(0.2)} tamano={26} />
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 150,
          top: 300,
          textAlign: "center",
          fontFamily: FUENTE.inter,
          fontWeight: 800,
          fontSize: 78,
          color: COLOR.rojo,
          opacity: frame >= m.paso && frame < m.vacia ? banner : 0,
          scale: String(0.8 + 0.2 * banner),
          textShadow: `0 0 40px ${COLOR.rojo}88`,
        }}
      >
        {T.embotellamiento}
      </div>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={cantidad} color={COLOR.verde} aparece={m.celulares - s(0.2)} />
    </Escena>
  );
};
