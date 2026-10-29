import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Finger } from "../components/Finger";
import { Phone, TEAL } from "../components/Props";
import { Background, Label, Panel, Watermark } from "../components/Ui";
import { C, DISPLAY, MONO } from "../theme";
import { ApolloIllo, ArrobaIllo, BatteryIllo, MicIllo, QrIllo, ShutterIllo } from "./Illustrations";
import { FactSlide, H, Highlight, SwipeHint, W } from "./Slide";

/** Portada: título en dos niveles con la palabra clave gigante y el celular encima. */
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg, width: W, height: H }}>
    <Background tint="#0c2a2e" />
    <Watermark top={58} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center" }}>
      <Highlight text="*6* cosas de tu" size={100} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: 212, lineHeight: 0.9, letterSpacing: -8, color: C.yellow, textShadow: `0 0 60px ${C.yellow}55` }}>
      CELULAR
    </div>
    {/* Íconos de los 6 datos flotando alrededor del celular */}
    {[
      { text: "¡CLIC!", x: 70, y: 560, rot: -8 },
      { text: "@", x: 130, y: 760, rot: 6 },
      { text: "80%", x: 80, y: 930, rot: -5 },
      { text: "4 KB", x: 790, y: 520, rot: 7 },
      { text: "QR", x: 840, y: 700, rot: -6 },
    ].map((s) => (
      <div key={s.text} style={{ position: "absolute", left: s.x, top: s.y, rotate: `${s.rot}deg` }}>
        <Panel glow={TEAL} style={{ padding: "8px 18px" }}>
          <Label size={44} mono color={TEAL}>
            {s.text}
          </Label>
        </Panel>
      </div>
    ))}
    {/* El celular pisa la parte de abajo de la palabra, como un objeto en primer plano */}
    <div style={{ position: "absolute", left: 540 - 150, top: 380, rotate: "-8deg" }}>
      <Phone width={300} ui={0}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
          <Label size={260} color={C.yellow}>
            ?
          </Label>
        </div>
      </Phone>
    </div>
    <div style={{ position: "absolute", left: 650 - 150, top: 700, transformOrigin: "50% 0%", rotate: "-22deg" }}>
      <Finger width={300} rim={0.5} rimColor={TEAL} />
    </div>
    <div style={{ position: "absolute", left: 70, top: 1040, width: 520 }}>
      <Highlight text="que *nadie te explicó.*" size={78} accent={TEAL} />
    </div>
    <SwipeHint side="left" />
  </AbsoluteFill>
);

export const Slide1: React.FC = () => (
  <FactSlide index={1} number={1} tint="#0b1730" title="El *¡CLIC!* de la cámara es *falso*" body="Tu celular no tiene obturador mecánico: ese sonido es *una grabación*. En Japón ni siquiera lo podés apagar.">
    <ShutterIllo />
  </FactSlide>
);

export const Slide2: React.FC = () => (
  <FactSlide index={2} number={2} tint="#141d33" title="El *agujerito* al lado de la cámara es un *micrófono*" body="En muchos celulares, *graba el sonido de tus videos* y ayuda a limpiar el ruido de fondo.">
    <MicIllo />
  </FactSlide>
);

export const Slide3: React.FC = () => (
  <FactSlide index={3} number={3} tint="#0c2a2e" title="Un *QR* se lee aunque le falte hasta el *30%*" body="Guarda la información repetida a propósito: con la corrección más alta, *recupera lo que falta*.">
    <QrIllo />
  </FactSlide>
);

export const Slide4: React.FC = () => (
  <FactSlide index={4} number={4} tint="#1d1436" title="La *@* era una medida de *peso*" body="En español se llama arroba por una vieja unidad de peso: *unos 11,5 kilos*.">
    <ArrobaIllo />
  </FactSlide>
);

export const Slide5: React.FC = () => (
  <FactSlide index={5} number={5} tint="#0b1730" title="Tu celular tiene *2 millones* de veces más memoria que el *Apolo 11*" body={"La computadora que llevó al hombre a la Luna tenía *unos 4\u00a0KB de RAM*. Un celular común, 8\u00a0GB."}>
    <ApolloIllo />
  </FactSlide>
);

export const Slide6: React.FC = () => (
  <FactSlide index={6} number={6} tint="#0c2a2e" title="Cargarlo al *100%* todas las noches lo *gasta*" body="Las baterías de litio sufren llenas o vacías. *Entre 20 y 80%* duran más años: activá la carga optimizada.">
    <BatteryIllo />
  </FactSlide>
);

const SpeechBubble: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M 14 18 H 86 Q 94 18 94 26 V 64 Q 94 72 86 72 H 44 L 24 90 V 72 H 14 Q 6 72 6 64 V 26 Q 6 18 14 18 Z" fill={TEAL} />
    <circle cx={32} cy={45} r={6} fill="#04231e" />
    <circle cx={50} cy={45} r={6} fill="#04231e" />
    <circle cx={68} cy={45} r={6} fill="#04231e" />
  </svg>
);

const Bookmark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 260 340">
    <path d="M 30 20 H 230 V 320 L 130 240 L 30 320 Z" fill={C.yellow} stroke={C.yellow} strokeWidth={22} strokeLinejoin="round" />
  </svg>
);

/** Cierre: comentar el número, guardar y seguir. */
export const Closing: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg, width: W, height: H }}>
    <Background tint="#0c2a2e" />
    <Watermark top={58} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 160, textAlign: "center" }}>
      <Highlight text="¿Cuál *NO* sabías?" size={112} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", gap: 22 }}>
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div key={n} style={{ width: 118, height: 118, borderRadius: "50%", border: `5px solid ${TEAL}`, background: "rgba(62,224,192,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 60, color: C.white }}>
          {n}
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 490, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
      <SpeechBubble size={80} />
      <Label size={56}>Comentá el número</Label>
    </div>
    <div
      style={{
        position: "absolute",
        left: 120,
        right: 120,
        top: 600,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "34px 30px 36px",
        borderRadius: 48,
        background: "linear-gradient(160deg, rgba(24,38,72,0.95), rgba(6,10,22,0.95))",
        border: `2px solid ${TEAL}55`,
        boxShadow: `0 0 60px ${TEAL}33, 0 40px 80px rgba(0,0,0,0.6)`,
      }}
    >
      <Img src={staticFile("logo.png")} style={{ width: 150, height: 150, borderRadius: "50%", border: `5px solid ${TEAL}`, boxShadow: `0 0 50px ${TEAL}55` }} />
      <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 60, color: C.white, marginTop: 24, letterSpacing: -1 }}>@nadietelo.explico</div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 32, color: C.dim, marginTop: 8 }}>Datos curiosos, bien explicados</div>
      <div style={{ marginTop: 30, width: 440, height: 100, borderRadius: 28, background: C.electricDeep, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${C.electricDeep}aa` }}>
        <Label size={48}>Seguir</Label>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
      <Bookmark size={56} />
      <Highlight text="*Guardalo* y mostráselo a alguien" size={46} />
    </div>
  </AbsoluteFill>
);

export const SLIDES = [Cover, Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Closing];

/** El carrusel como una secuencia: cada frame es un slide. */
export const Carrusel: React.FC = () => {
  const frame = useCurrentFrame();
  const Current = SLIDES[Math.min(frame, SLIDES.length - 1)];
  return <Current />;
};
