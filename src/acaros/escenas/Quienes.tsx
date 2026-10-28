import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar, resorte } from "../../comun/anim";
import { Cortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Acaro, CortePiel, Pestanas, raizPestana } from "../componentes/Piel";
import { TEXTOS } from "../guion-acaros";
import { MarcasAcaros } from "../linea-acaros";

export type PropsQuienes = { marcas: MarcasAcaros["quienes"]; duracion: number };

// Regla de 1 mm: 800 px por milímetro.
const REGLA = { x: 140, y: 1000, ancho: 800 };
const FOLICULOS = [300, 780];

export const Quienes: React.FC<PropsQuienes> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.quienes;
  const s = (seg: number) => seg * fps;

  const regla = entre(frame, m.tercio - s(0.1), m.tercio + s(0.6));
  const tres = [0, 1, 2].map((k) => resorte(frame, fps, m.tercio + s(0.3) + k * 8, { damping: 13 }));
  const glandula = entre(frame, m.grasa - s(0.2), m.grasa + s(0.5));

  const presentacion = (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #2a2c31, #16171a 70%)" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Acaro
          x={540}
          y={880 + flotar(frame, 150, 10)}
          escala={3.4}
          rot={interpolate(frame, [0, m.tercio], [-18, 12])}
          frame={frame}
          camina={1}
        />
      </svg>
    </AbsoluteFill>
  );

  const reglaPlano = (
    <AbsoluteFill style={{ background: "#16171a" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g opacity={regla}>
          <rect x={REGLA.x - 20} y={REGLA.y} width={REGLA.ancho + 40} height={90} rx={10} fill="#e6d9b8" />
          {Array.from({ length: 11 }, (_, k) => (
            <line
              key={k}
              x1={REGLA.x + k * 80}
              x2={REGLA.x + k * 80}
              y1={REGLA.y}
              y2={REGLA.y + (k % 5 === 0 ? 60 : 34)}
              stroke="#3a2f22"
              strokeWidth={k % 5 === 0 ? 5 : 3}
            />
          ))}
          {["0", "0,5", "1 mm"].map((t, k) => (
            <text
              key={t}
              x={REGLA.x + k * 400}
              y={REGLA.y + 140}
              textAnchor="middle"
              fill={COLOR.texto}
              fontFamily={FUENTE.mono}
              fontWeight={700}
              fontSize={32}
            >
              {t}
            </text>
          ))}
        </g>
        {tres.map((t, k) => (
          <Acaro
            key={k}
            x={REGLA.x + 120 + k * 240 + (1 - t) * 300}
            y={REGLA.y - 70}
            escala={1.15}
            rot={90}
            frame={frame}
            camina={1 - t}
            opacidad={t}
          />
        ))}
        <g opacity={tres[0]}>
          <path
            d={`M ${REGLA.x + 10} ${REGLA.y - 150} L ${REGLA.x + 10} ${REGLA.y - 170} L ${REGLA.x + 230} ${REGLA.y - 170} L ${REGLA.x + 230} ${REGLA.y - 150}`}
            fill="none"
            stroke={COLOR.verde}
            strokeWidth={4}
          />
          <text
            x={REGLA.x + 120}
            y={REGLA.y - 190}
            textAnchor="middle"
            fill={COLOR.verde}
            fontFamily={FUENTE.mono}
            fontWeight={700}
            fontSize={40}
          >
            {T.medida}
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );

  const acarosEnFoliculo = (fx: number, n: number) =>
    Array.from({ length: n }, (_, k) => (
      <Acaro
        key={`${fx}${k}`}
        x={fx - 10 + k * 18}
        y={760 + k * 150}
        escala={0.7}
        rot={180 + (k % 2 ? 6 : -6)}
        frame={frame}
      />
    ));

  const corte = (zoom: [number, number], g: number) => (
    <Cortes
      cortes={[
        { desde: 0, zoom: zoom[0], foco: [FOLICULOS[0], 860] },
        { desde: m.grasa, zoom: zoom[1], foco: [FOLICULOS[0] + 70, 790] },
      ]}
    >
      <CortePiel foliculos={FOLICULOS} glandula={g}>
        {FOLICULOS.map((fx) => acarosEnFoliculo(fx, 3))}
      </CortePiel>
    </Cortes>
  );

  const pestanas = (
    <AbsoluteFill
      style={{
        scale: String(
          interpolate(frame, [m.pestanas, m.grasa], [1.05, 1.18], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        ),
      }}
    >
      <Pestanas
        frame={frame}
        detras={[2, 4, 6].map((k) => {
          const r = raizPestana(k);
          return <Acaro key={k} x={r.x - 4} y={r.y + 20} escala={1.05} rot={190} frame={frame} />;
        })}
      />
    </AbsoluteFill>
  );

  return (
    <Escena name="Quienes">
      <Sfx efecto="pop" desde={m.demodex} volumen={0.3} />
      <Sfx efecto="tap" desde={m.tercio + s(0.3)} volumen={0.3} />
      <Sfx efecto="whoosh" desde={m.cabeza - s(0.1)} volumen={0.2} />
      <Sfx efecto="estirar" desde={m.pestanas} volumen={0.2} />
      <Sfx efecto="burbujeo" desde={m.grasa} volumen={0.25} />
      <Planos
        planos={[
          { desde: 0, contenido: presentacion },
          { desde: m.tercio - s(0.1), contenido: reglaPlano },
          { desde: m.cabeza - s(0.1), contenido: corte([1.25, 1.25], 0) },
          { desde: m.pestanas - s(0.1), contenido: pestanas },
          { desde: m.grasa - s(0.1), contenido: corte([1.6, 2.2], glandula) },
        ]}
      />
      <AbsoluteFill>
        <HudEtiqueta
          ancla={{ x: 600, y: 600 }}
          caja={{ x: 640, y: 470 }}
          texto={T.nombre}
          color={COLOR.verde}
          aparece={m.demodex + s(0.1)}
          desaparece={m.tercio - s(0.1)}
          tamano={30}
        />
        <HudEtiqueta
          ancla={{ x: 330, y: 760 }}
          caja={{ x: 520, y: 470 }}
          texto={T.poro}
          color={COLOR.azul}
          aparece={m.cabeza + s(0.3)}
          desaparece={m.pestanas - s(0.1)}
          tamano={28}
        />
        <HudEtiqueta
          ancla={{ x: 540, y: 960 }}
          caja={{ x: 110, y: 470 }}
          texto={T.pestana}
          color={COLOR.verde}
          aparece={m.pestanas + s(0.3)}
          desaparece={m.grasa - s(0.1)}
          tamano={28}
        />
        <HudEtiqueta
          ancla={{ x: 560, y: 780 }}
          caja={{ x: 560, y: 470 }}
          texto={T.grasa}
          color="#e8c45a"
          aparece={m.grasa + s(0.3)}
          tamano={28}
        />
      </AbsoluteFill>
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud
        etiqueta={T.contador}
        valor={0.3}
        decimales={1}
        unidad=" mm"
        color={COLOR.verde}
        aparece={m.tercio + s(0.4)}
      />
    </Escena>
  );
};
