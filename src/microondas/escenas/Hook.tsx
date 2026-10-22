import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta } from "../../comun/Hud";
import { Bucle, Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { ContenedorVista } from "../../comun/vista";
import { aLienzoMO, Microondas, MO } from "../componentes/Microondas";
import { DefsEsferas, MoleculaAgua, repartir } from "../componentes/Moleculas";
import { TEXTOS } from "../guion-microondas";
import { MarcasMicroondas } from "../linea-microondas";
import { AREA_MOLECULAS, MO_ESCENA } from "./encuadres";

export type PropsHook = { marcas: MarcasMicroondas["hook"]; duracion: number };

const MOLECULAS = repartir(15, AREA_MOLECULAS, 34, 60, "hook");

export const Hook: React.FC<PropsHook> = ({ marcas }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.hook;
  const s = (seg: number) => seg * fps;

  // Zoom violento: atraviesa la comida hasta llegar a las moléculas.
  const inicioZoom = Math.max(s(0.8), marcas.agua - s(0.4));
  const finZoom = inicioZoom + s(0.6);
  const acercar = interpolate(frame, [0, inicioZoom], [1, 1.14], { extrapolateRight: "clamp" });
  const zoom = acercar * interpolate(frame, [inicioZoom, finZoom], [1, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.exp),
  });
  const comida = aLienzoMO(MO.comidaFrente, MO_ESCENA);
  const moleculas = entre(frame, finZoom - s(0.15), finZoom + s(0.3));
  const escalaMoleculas = interpolate(moleculas, [0, 1], [2.6, 1]);

  const etiquetada = MOLECULAS.reduce((a, b) => (Math.hypot(b.x - 560, b.y - 760) < Math.hypot(a.x - 560, a.y - 760) ? b : a));

  return (
    <Escena entrada={false} name="Hook">
      <Bucle efecto="microondas" desde={0} duracion={finZoom + 10} />
      <Sfx efecto="whoosh" desde={inicioZoom} volumen={0.4} />

      {moleculas < 1 ? (
        <ContenedorVista
          vista={{ zoom, giro: 0, foco: comida, destino: comida }}
          style={{ filter: zoom > 3 ? `blur(${Math.min(16, (zoom - 3) / 2)}px)` : undefined, opacity: 1 - moleculas }}
        >
          <Microondas ubicacion={MO_ESCENA} rot={frame * 0.035} display={`0:${String(30 - Math.floor(frame / fps)).padStart(2, "0")}`} />
        </ContenedorVista>
      ) : null}

      {moleculas > 0 ? (
        <AbsoluteFill
          style={{
            opacity: moleculas,
            scale: String(escalaMoleculas),
            filter: moleculas < 1 ? `blur(${(1 - moleculas) * 12}px)` : undefined,
          }}
        >
          <svg width={1080} height={1920}>
            <DefsEsferas />
            {MOLECULAS.map((m, i) => (
              <MoleculaAgua
                key={i}
                x={m.x + Math.sin(frame * 0.9 + m.fase) * 4}
                y={m.y + Math.cos(frame * 0.8 + m.fase) * 4}
                r={m.r}
                angulo={m.base + 28 * Math.sin(frame * 0.45 + m.fase)}
                temp={0.05}
              />
            ))}
          </svg>
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill>
        <HudEtiqueta
          ancla={{ x: etiquetada.x, y: etiquetada.y - etiquetada.r }}
          caja={{ x: etiquetada.x + 60, y: etiquetada.y - etiquetada.r - 130 + flotar(frame, 90, 3) }}
          texto={T.agua}
          color={COLOR.verde}
          aparece={finZoom + s(0.15)}
          tamano={26}
        />
      </AbsoluteFill>

      <ContadorHud
        etiqueta={T.contador}
        prefijo="×"
        valor={Math.round(Math.pow(10, Math.log10(zoom) + (7 - Math.log10(zoom)) * moleculas))}
        color={COLOR.verde}
        aparece={4}
      />
    </Escena>
  );
};
