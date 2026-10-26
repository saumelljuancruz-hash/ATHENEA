import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { aPantallaQR, Chip, DISPOSICION, N, oscuro, TarjetaQr } from "../componentes/Qr";
import { CONTENIDO_QR, TEXTOS } from "../guion-qr";
import { MarcasQr } from "../linea-qr";

export type PropsBinario = { marcas: MarcasQr["binario"]; duracion: number };

const LUPA = { radio: 150, aumento: 3.2 };
/** Recorrido de la lupa sobre la zona de datos (fila, columna). */
const recorrido = (t: number): [number, number] => [22 - 6 * Math.sin(t * Math.PI), 10 + 16 * t];

export const Binario: React.FC<PropsBinario> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.binario;
  const s = (seg: number) => seg * fps;

  const d = { ...DISPOSICION, cy: 690 + flotar(frame, 220, 4), escala: 0.88 };
  const M = d.modulo * d.escala;
  const verLupa = entre(frame, s(0.3), s(0.7));
  const avance = entre(frame, s(0.3), duracion - s(0.3), (t) => t);
  const [fr, fc] = recorrido(avance);
  const centro = aPantallaQR(fr, fc, d);
  const bitsTotales = CONTENIDO_QR.length * 8;
  const bits = Math.round(bitsTotales * entre(frame, m.negro, m.link + s(0.6), (t) => t));
  const texto = CONTENIDO_QR.slice(0, Math.round(CONTENIDO_QR.length * entre(frame, m.link - s(0.2), m.link + s(1.0), (t) => t)));

  // Tira de bits: los módulos que va pasando la lupa, en orden.
  const tira = Array.from({ length: 30 }, (_, k) => {
    const [r, c] = recorrido(Math.max(0, avance - k * 0.012));
    return oscuro(Math.round(r), Math.round(c)) ? "1" : "0";
  }).join("");

  const modulosLupa: React.ReactNode[] = [];
  const alcance = Math.ceil(LUPA.radio / (M * LUPA.aumento)) + 1;
  for (let r = Math.floor(fr) - alcance; r <= Math.ceil(fr) + alcance; r++) {
    for (let c = Math.floor(fc) - alcance; c <= Math.ceil(fc) + alcance; c++) {
      if (r < 0 || c < 0 || r >= N || c >= N) continue;
      const x = centro.x + (c - fc) * M * LUPA.aumento;
      const y = centro.y + (r - fr) * M * LUPA.aumento;
      const negro = oscuro(r, c);
      const t = M * LUPA.aumento * 0.92;
      modulosLupa.push(
        <g key={`${r}-${c}`}>
          <rect x={x - t / 2} y={y - t / 2} width={t} height={t} rx={8} fill={negro ? "#15171b" : "#eef0f3"} />
          <text x={x} y={y + 13} textAnchor="middle" fontFamily={FUENTE.mono} fontWeight={700} fontSize={36} fill={negro ? COLOR.verde : "#9aa0a8"}>
            {negro ? 1 : 0}
          </text>
        </g>,
      );
    }
  }

  return (
    <Escena name="Binario">
      <Sfx efecto="pop" desde={m.negro} />
      <Sfx efecto="pop" desde={m.blanco} />
      <Sfx efecto="bip" desde={m.link + s(1.0)} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <TarjetaQr d={d} o={{ frame }} />
        <defs>
          <clipPath id="lupa">
            <circle cx={centro.x} cy={centro.y} r={LUPA.radio * verLupa} />
          </clipPath>
        </defs>
        <g opacity={verLupa}>
          <circle cx={centro.x + 12} cy={centro.y + 22} r={LUPA.radio} fill="#000" opacity={0.35} />
          <g clipPath="url(#lupa)">
            <rect x={centro.x - LUPA.radio} y={centro.y - LUPA.radio} width={LUPA.radio * 2} height={LUPA.radio * 2} fill="#eef0f3" />
            {modulosLupa}
          </g>
          <circle cx={centro.x} cy={centro.y} r={LUPA.radio * verLupa} fill="none" stroke={COLOR.verde} strokeWidth={7} />
          <line
            x1={centro.x + LUPA.radio * 0.72}
            y1={centro.y + LUPA.radio * 0.72}
            x2={centro.x + LUPA.radio * 1.15}
            y2={centro.y + LUPA.radio * 1.15}
            stroke="#5d626c"
            strokeWidth={22}
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Tira de bits que se va leyendo */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 150,
          top: 1105,
          textAlign: "center",
          fontFamily: FUENTE.mono,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 4,
          color: COLOR.verde,
          opacity: entre(frame, m.negro, m.negro + s(0.3)) * (1 - entre(frame, m.link - s(0.2), m.link)),
        }}
      >
        {tira}
      </div>
      <AbsoluteFill>
        {texto.length > 0 ? <Chip x={505} y={1125} texto={texto} color={COLOR.azul} escala={resorte(frame, fps, m.link - s(0.2), { damping: 14 })} mono /> : null}
        <HudEtiqueta ancla={{ x: centro.x - LUPA.radio, y: centro.y }} caja={{ x: centro.x - LUPA.radio - 30, y: centro.y - 210 }} lado="izquierda" texto={T.uno} color={COLOR.verde} aparece={m.negro} tamano={26} />
        <HudEtiqueta ancla={{ x: centro.x + LUPA.radio, y: centro.y - 20 }} caja={{ x: centro.x + LUPA.radio + 10, y: centro.y - 240 }} texto={T.cero} color={COLOR.textoSuave} aparece={m.blanco} tamano={26} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={bits} color={COLOR.verde} aparece={m.negro} extra={`de ${bitsTotales}`} />
    </Escena>
  );
};
