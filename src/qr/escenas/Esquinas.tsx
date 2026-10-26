import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { aPantallaQR, DISPOSICION, ESQUINAS, N, TarjetaQr, Visor } from "../componentes/Qr";
import { TEXTOS } from "../guion-qr";
import { MarcasQr } from "../linea-qr";

export type PropsEsquinas = { marcas: MarcasQr["esquinas"]; duracion: number };

export const Esquinas: React.FC<PropsEsquinas> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.esquinas;
  const s = (seg: number) => seg * fps;

  const giro = resorte(frame, fps, m.girado, { damping: 12, stiffness: 90 });
  const d = { ...DISPOSICION, escala: 0.92, rot: -38 * giro + flotar(frame, 200, 1.5), cy: DISPOSICION.cy + flotar(frame, 220, 5) };
  const M = d.modulo;
  const lado = N * M;
  const brillo = entre(frame, s(0.2), s(0.6)) * (0.75 + 0.25 * Math.sin(frame / 6));
  const triangulo = entre(frame, m.camara, m.camara + s(0.5));
  const visor = entre(frame, m.camara - s(0.2), m.camara + s(0.1));
  const [a, b, c] = ESQUINAS.map(([r, cc]) => ({ x: (cc + 0.5) * M, y: (r + 0.5) * M }));
  const pEsquina = aPantallaQR(ESQUINAS[0][0], ESQUINAS[0][1], d);
  const pVertice = aPantallaQR(ESQUINAS[2][0], ESQUINAS[2][1], d);

  return (
    <Escena name="Esquinas">
      {ESQUINAS.map((_, k) => (
        <Sfx key={k} efecto="pop" desde={s(0.2) + k * 6} />
      ))}
      <Sfx efecto="bip" desde={m.camara + s(0.4)} volumen={0.22} />
      <Sfx efecto="whoosh" desde={m.girado} volumen={0.2} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <TarjetaQr d={d} o={{ esquinas: brillo, frame }}>
          {ESQUINAS.map(([r, cc], k) => {
            const pulso = ((frame + k * 10) % 40) / 40;
            return (
              <rect
                key={k}
                x={(cc - 3.5 - pulso * 1.5) * M - M * 0.5}
                y={(r - 3.5 - pulso * 1.5) * M - M * 0.5}
                width={(8 + pulso * 3) * M}
                height={(8 + pulso * 3) * M}
                rx={12}
                fill="none"
                stroke={COLOR.verde}
                strokeWidth={4}
                opacity={brillo * (1 - pulso)}
              />
            );
          })}
          {/* La cámara une las tres esquinas: así sabe dónde está y para qué lado gira */}
          <path
            d={`M${b.x} ${b.y} L${a.x} ${a.y} L${c.x} ${c.y}`}
            fill="none"
            stroke={COLOR.verde}
            strokeWidth={6}
            strokeDasharray={`${triangulo * 2 * lado} ${2 * lado}`}
            strokeLinecap="round"
          />
        </TarjetaQr>
        <Visor cx={d.cx} cy={d.cy} lado={lado * 0.92 + 150} barrido={entre(frame, m.camara, m.camara + s(0.7))} opacidad={visor} />
      </svg>

      <AbsoluteFill>
        <HudEtiqueta ancla={pEsquina} caja={{ x: pEsquina.x - 20, y: pEsquina.y - 190 }} texto={T.esquina} color={COLOR.verde} aparece={s(0.5)} desaparece={m.girado} />
        <HudEtiqueta ancla={pVertice} caja={{ x: pVertice.x + 40, y: pVertice.y + 200 }} texto={T.orientacion} color={COLOR.azul} aparece={m.girado + s(0.3)} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={interpolate(giro, [0, 1], [0, 38])} unidad="°" color={COLOR.azul} aparece={m.camara} />
    </Escena>
  );
};
