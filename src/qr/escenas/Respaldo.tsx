import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { aPantallaQR, Chip, DISPOSICION, N, TarjetaQr, Visor } from "../componentes/Qr";
import { DATOS, TEXTOS } from "../guion-qr";
import { MarcasQr } from "../linea-qr";

export type PropsRespaldo = { marcas: MarcasQr["respaldo"]; duracion: number };

const MANCHA = { r: 21, c: 22, radio: 8 };

export const Respaldo: React.FC<PropsRespaldo> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.respaldo;
  const s = (seg: number) => seg * fps;

  const d = { ...DISPOSICION, rot: flotar(frame, 260, 2), cy: DISPOSICION.cy + flotar(frame, 220, 5) };
  const lado = N * d.modulo;
  const respaldo = entre(frame, m.respaldo - s(0.2), m.respaldo + s(0.4)) * (1 - 0.7 * entre(frame, m.mancha, m.mancha + s(0.4)));
  const mancha = entre(frame, m.mancha - s(0.1), m.mancha + s(0.7));
  const reconstruccion = entre(frame, m.reconstruir - s(0.1), m.reconstruir + s(1.2));
  const logo = resorte(frame, fps, m.logo, { damping: 12, stiffness: 140 });
  const escaneo = entre(frame, m.logo + s(0.3), m.logo + s(1.0));
  const leido = resorte(frame, fps, m.logo + s(1.0), { damping: 11, stiffness: 180 });
  const pMancha = aPantallaQR(MANCHA.r, MANCHA.c, d);
  const pRespaldo = aPantallaQR(9, 14, d);
  const pLogo = aPantallaQR((N - 1) / 2, (N - 1) / 2 + 4.6, d);

  return (
    <Escena name="Respaldo">
      <Sfx efecto="pop" desde={m.respaldo} />
      <Sfx efecto="tap" desde={m.mancha} volumen={0.4} />
      <Sfx efecto="brillo" desde={m.reconstruir + s(0.2)} />
      <Sfx efecto="pop" desde={m.logo} />
      <Sfx efecto="bip" desde={m.logo + s(1.0)} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <TarjetaQr
          d={d}
          o={{
            respaldo,
            dano: { ...MANCHA, nivel: mancha },
            reconstruccion,
            logo,
            frame,
          }}
        />
        <Visor cx={d.cx} cy={d.cy} lado={lado + 140} barrido={escaneo} opacidad={entre(frame, m.logo + s(0.15), m.logo + s(0.3))} />
      </svg>

      <AbsoluteFill>
        <HudEtiqueta ancla={pRespaldo} caja={{ x: pRespaldo.x + 40, y: pRespaldo.y - 230 }} texto={T.respaldo} color={COLOR.azul} aparece={m.respaldo + s(0.2)} desaparece={m.mancha} />
        <HudEtiqueta ancla={pMancha} caja={{ x: pMancha.x - 40, y: pMancha.y + 300 }} lado="izquierda" texto={T.danado} color={COLOR.naranjaCalor} aparece={m.mancha + s(0.3)} desaparece={m.reconstruir} />
        <HudEtiqueta ancla={pMancha} caja={{ x: pMancha.x - 40, y: pMancha.y + 300 }} lado="izquierda" texto={`✓ ${T.reconstruido}`} color={COLOR.verde} aparece={m.reconstruir + s(0.9)} desaparece={m.logo} />
        <HudEtiqueta ancla={pLogo} caja={{ x: pLogo.x + 60, y: pLogo.y + 330 }} lado="izquierda" texto={T.logo} color={COLOR.verde} aparece={m.logo + s(0.5)} tamano={22} />
        <Chip x={505} y={290} texto="✓ QR leído" color={COLOR.verde} escala={leido} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={DATOS.danoMaximo * mancha} unidad="%" color={COLOR.naranjaCalor} aparece={m.mancha} />
    </Escena>
  );
};
