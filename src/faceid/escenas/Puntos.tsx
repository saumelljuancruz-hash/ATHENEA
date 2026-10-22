import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTRA_SALE, entre, flotar } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Bucle, Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { proyectar, ZONAS } from "../cabeza";
import { aPantalla, Vista } from "../../comun/vista";
import { Escenario } from "../componentes/Escenario";
import { aLienzo, SENSORES } from "../componentes/Telefono";
import { DATOS, TEXTOS } from "../guion-faceid";
import { MarcasFaceId } from "../linea-faceid";
import { CAM_BUSTO, conYaw, TEL_ESCENA } from "./encuadres";

export type PropsPuntos = { marcas: MarcasFaceId["puntos"]; duracion: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Puntos: React.FC<PropsPuntos> = ({ marcas, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.puntos;
  const s = (seg: number) => seg * fps;

  // 1) Zoom al notch del teléfono → 2) vuelve al busto mientras los puntos viajan → 3) se deforman.
  const finZoom = Math.min(marcas.camara + s(0.8), marcas.deforman - s(1.1));
  const zoom = entre(frame, 0, s(0.7), ENTRA_SALE) * (1 - entre(frame, finZoom, finZoom + s(0.9), ENTRA_SALE));
  const tel = { ...TEL_ESCENA, y: TEL_ESCENA.y + flotar(frame, 160, 5) };
  const focoNotch = aLienzo([30, -293], tel);
  const vista: Vista = {
    zoom: lerp(1, 2.8, zoom),
    giro: lerp(0, -TEL_ESCENA.rot, zoom),
    foco: [lerp(540, focoNotch[0], zoom), lerp(960, focoNotch[1], zoom)],
    destino: [lerp(540, 470, zoom), lerp(960, 960, zoom)],
  };

  const viaje = entre(frame, finZoom + s(0.2), marcas.deforman);
  const aterrizaje = entre(frame, marcas.deforman - s(0.15), marcas.deforman + s(0.9));
  // Al deformarse, la cabeza gira para que se lea la profundidad.
  const yaw = lerp(-0.25, 0.1, entre(frame, 0, marcas.deforman)) + 0.55 * Math.sin(Math.PI * 0.5 * entre(frame, marcas.deforman, duracion));
  const cam = conYaw(CAM_BUSTO, yaw + flotar(frame, 120, 0.04), { escala: 285 });

  const sensor = (k: keyof typeof SENSORES) => aPantalla(aLienzo(SENSORES[k], tel), vista);
  const zona = (k: keyof typeof ZONAS) => {
    const p = proyectar(ZONAS[k], cam);
    return aPantalla([p.x, p.y], vista);
  };
  const nariz = zona("nariz");
  const pomulo = zona(yaw > 0 ? "pomuloIzq" : "pomuloDer");
  const frente = zona("frente");
  const rayo = sensor("proyector");

  return (
    <Escena name="Puntos">
      <Bucle efecto="zumbido" desde={0} duracion={marcas.deforman + s(1)} volumen={0.16} />
      <Sfx efecto="bip" desde={marcas.deforman + s(0.9)} />

      <Escenario
        cam={cam}
        vista={vista}
        busto={{ luz: 0.55 }}
        desenfoqueBusto={zoom * 10}
        puntos={{ aparicion: Math.max(viaje, 0.35 * zoom), aterrizaje, rayos: Math.max(zoom, viaje * (1 - aterrizaje)) }}
        telefono={{ ubicacion: tel, pantalla: zoom > 0.15 ? "apagada" : "bloqueado", emision: 0.6 + 0.4 * Math.abs(Math.sin(frame / 6)) }}
      />

      <AbsoluteFill>
        <HudEtiqueta ancla={sensor("proyector")} caja={{ x: sensor("proyector").x - 60, y: sensor("proyector").y - 300 }} lado="izquierda" texto={T.proyector} color={COLOR.magenta} aparece={marcas.proyector + 8} desaparece={finZoom} />
        <HudEtiqueta ancla={sensor("iluminador")} caja={{ x: sensor("iluminador").x - 70, y: sensor("iluminador").y - 140 }} lado="izquierda" texto={T.iluminador} color={COLOR.magenta} aparece={marcas.proyector + s(0.7)} desaparece={finZoom} />
        <HudEtiqueta ancla={{ x: rayo.x + 210, y: rayo.y - 470 }} caja={{ x: rayo.x + 120, y: rayo.y - 560 }} lado="izquierda" texto={T.infrarroja} color={COLOR.magenta} aparece={marcas.infrarroja} desaparece={finZoom} tamano={22} />
        <HudEtiqueta ancla={sensor("camaraIR")} caja={{ x: sensor("camaraIR").x + 10, y: sensor("camaraIR").y + 170 }} texto={T.camara} color={COLOR.azul} aparece={marcas.camara} desaparece={finZoom} />

        <HudEtiqueta ancla={nariz} caja={{ x: nariz.x + 150, y: nariz.y + 40 }} texto={T.nariz} color={COLOR.azul} aparece={marcas.nariz} />
        <HudEtiqueta ancla={pomulo} caja={{ x: pomulo.x - 110, y: pomulo.y + 150 }} lado="izquierda" texto={T.pomulos} color={COLOR.azul} aparece={marcas.pomulos} />
        <HudEtiqueta ancla={frente} caja={{ x: frente.x + 170, y: frente.y - 90 }} texto={T.frente} color={COLOR.azul} aparece={marcas.frente} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      {frame >= marcas.deforman - s(0.2) ? (
        <ContadorHud
          etiqueta={T.contador}
          valor={DATOS.relieveMm * aterrizaje}
          unidad="mm"
          color={COLOR.azul}
          aparece={marcas.deforman - s(0.2)}
        />
      ) : (
        <ContadorHud etiqueta={TEXTOS.hook.contador} prefijo="+" valor={DATOS.puntos} unidad={TEXTOS.hook.unidad} color={COLOR.magenta} aparece={0} sale={s(0.6)} />
      )}
    </Escena>
  );
};
