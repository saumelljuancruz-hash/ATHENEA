import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { Chip, DISPOSICION, N, TarjetaQr, Visor } from "../componentes/Qr";
import { CONTENIDO_QR, DATOS, TEXTOS } from "../guion-qr";
import { MarcasQr } from "../linea-qr";

export type PropsHook = { marcas: MarcasQr["hook"]; duracion: number };

export const Hook: React.FC<PropsHook> = ({ marcas }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.hook;

  const d = { ...DISPOSICION, rot: flotar(frame, 240, 2), cy: DISPOSICION.cy + flotar(frame, 200, 5) };
  const lado = N * d.modulo;
  // Una calcomanía tapa casi un tercio del código (sin tocar las esquinas).
  const tapa = resorte(frame, fps, marcas.tapar, { damping: 15, stiffness: 120 });
  const escaneo = entre(frame, marcas.lee - 0.7 * fps, marcas.lee);
  const leido = resorte(frame, fps, marcas.lee, { damping: 11, stiffness: 180 });

  return (
    <Escena entrada={false} name="Hook">
      <Sfx efecto="tap" desde={marcas.tapar + 4} volumen={0.4} />
      <Sfx efecto="bip" desde={marcas.lee} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <TarjetaQr d={d} o={{ revelado: 0.35 + 0.65 * entre(frame, 0, 0.4 * fps), frame }}>
          <g transform={`translate(${lado * 0.47 + (1 - tapa) * 700} ${lado * 0.4}) rotate(${-8 + (1 - tapa) * 30})`}>
            <rect x={0} y={0} width={lado * 0.5} height={lado * 0.55} rx={18} fill="#ff7a3d" />
            <rect x={12} y={12} width={lado * 0.5 - 24} height={lado * 0.55 - 24} rx={12} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={3} strokeDasharray="10 8" />
          </g>
        </TarjetaQr>
        <Visor cx={d.cx} cy={d.cy} lado={lado + 140} barrido={escaneo} opacidad={entre(frame, marcas.lee - 0.8 * fps, marcas.lee - 0.6 * fps)} color={leido > 0.1 ? COLOR.verde : COLOR.texto} />
      </svg>
      <AbsoluteFill>
        <Chip x={505} y={300} texto={`✓ ${T.leido}`} color={COLOR.verde} escala={leido} />
        <Chip x={505} y={1180} texto={CONTENIDO_QR} color={COLOR.azul} escala={resorte(frame, fps, marcas.lee + 8, { damping: 12 })} mono />
      </AbsoluteFill>
      <ContadorHud etiqueta={T.tapado} valor={interpolate(tapa, [0, 1], [0, DATOS.danoMaximo], { extrapolateRight: "clamp" })} unidad="%" color={COLOR.naranjaCalor} aparece={marcas.tapar} />
    </Escena>
  );
};
