import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTRA_SALE, entre, flotar } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { NUMEROS } from "../cabeza";
import { aLienzo, Telefono, Ubicacion } from "../componentes/Telefono";
import { TEXTOS } from "../guion-faceid";
import { MarcasFaceId } from "../linea-faceid";

export type PropsPrivacidad = { marcas: MarcasFaceId["privacidad"]; duracion: number };

const CHIP = { x: 0, y: 150, lado: 130 };

export const Privacidad: React.FC<PropsPrivacidad> = ({ marcas }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.privacidad;
  const s = (seg: number) => seg * fps;

  const tel: Ubicacion = { x: 540, y: 820 + flotar(frame, 150, 6), rot: flotar(frame, 210, 1.5), escala: 1.2 };
  const cierre = Math.max(s(0.9), marcas.telefono - s(0.25));
  const entra = entre(frame, s(0.15), cierre - s(0.1), ENTRA_SALE);
  const tapa = entre(frame, cierre, cierre + s(0.2));
  const chip = aLienzo([CHIP.x, CHIP.y], tel);

  return (
    <Escena name="Privacidad">
      <Sfx efecto="candado" desde={cierre + s(0.15)} />
      <Telefono ubicacion={tel} pantalla="bloqueado" apertura={0}>
        {/* Vista "rayos X": chip con una caja fuerte. */}
        <g opacity={0.95}>
          <rect x={-CHIP.lado / 2 - 18} y={CHIP.y - CHIP.lado / 2 - 18} width={CHIP.lado + 36} height={CHIP.lado + 36} rx={14} fill="#15171b" stroke={`${COLOR.verde}66`} strokeWidth={2} />
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i}>
              <rect x={-CHIP.lado / 2 - 30} y={CHIP.y - 50 + i * 20} width={12} height={6} fill="#3a3d44" />
              <rect x={CHIP.lado / 2 + 18} y={CHIP.y - 50 + i * 20} width={12} height={6} fill="#3a3d44" />
            </g>
          ))}
          <rect x={-CHIP.lado / 2} y={CHIP.y - CHIP.lado / 2} width={CHIP.lado} height={CHIP.lado} rx={10} fill="#0c0d10" stroke={COLOR.verde} strokeWidth={2.5} />
          <rect
            x={-CHIP.lado / 2}
            y={CHIP.y - CHIP.lado / 2}
            width={CHIP.lado}
            height={CHIP.lado * tapa}
            rx={10}
            fill={COLOR.verde}
            opacity={0.85}
          />
        </g>
      </Telefono>

      {/* El mapa numérico baja hasta el chip */}
      <div
        style={{
          position: "absolute",
          left: chip[0],
          top: interpolate(entra, [0, 1], [260, chip[1]]),
          translate: "-50% -50%",
          scale: String(interpolate(entra, [0, 1], [1, 0.32])),
          opacity: 1 - tapa,
          background: "rgba(8,9,11,0.8)",
          border: `1px solid ${COLOR.azul}88`,
          borderRadius: 8,
          padding: "10px 16px",
          fontFamily: FUENTE.mono,
          fontSize: 22,
          lineHeight: 1.4,
          color: COLOR.azul,
          whiteSpace: "pre",
        }}
      >
        {NUMEROS.slice(0, 6).join("\n")}
      </div>

      <AbsoluteFill>
        <HudEtiqueta ancla={{ x: chip[0] + 90, y: chip[1] }} caja={{ x: chip[0] + 150, y: chip[1] + 230 }} texto={T.chip} color={COLOR.verde} aparece={s(0.3)} tamano={22} desaparece={cierre + s(0.2)} />
        <HudEtiqueta ancla={{ x: chip[0] - 90, y: chip[1] }} caja={{ x: chip[0] - 120, y: chip[1] + 230 }} lado="izquierda" texto={T.etiqueta} color={COLOR.verde} aparece={cierre + s(0.25)} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={0} unidad="bytes" color={COLOR.verde} aparece={s(0.2)} />
    </Escena>
  );
};
