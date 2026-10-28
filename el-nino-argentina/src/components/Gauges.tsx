import React from "react";
import { lerpColor } from "./anim";
import { Label, Panel } from "./Ui";
import { C, MONO } from "../theme";

const MAX = 2.5;

/** Termómetro de anomalía: cuántos grados por encima de lo normal está el Pacífico. */
export const AnomalyThermometer: React.FC<{ value: number; height: number; threshold?: number; showValue?: boolean; hideScale?: number }> = ({
  value,
  height,
  threshold = 1,
  showValue = true,
  hideScale = 0,
}) => {
  const tubeTop = 30;
  const tubeBottom = height - 110;
  const y = (v: number) => tubeBottom - ((tubeBottom - tubeTop) * Math.min(v, MAX)) / MAX;
  const color = lerpColor("#ff9a3c", "#ff2e2e", Math.min(1, value / 2));
  return (
    <div style={{ position: "relative", width: 360, height }}>
      <svg width={360} height={height} style={{ position: "absolute", overflow: "visible" }}>
        <rect x={150} y={tubeTop - 30} width={60} height={tubeBottom - tubeTop + 60} rx={30} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.45)" strokeWidth={4} />
        <circle cx={180} cy={tubeBottom + 50} r={62} fill={color} />
        <rect x={162} y={y(value)} width={36} height={tubeBottom + 20 - y(value)} rx={18} fill={color} />
        {[0, 0.5, 1, 1.5, 2, 2.5].map((v) => (
          <g key={v} opacity={v > 0.5 ? 1 - hideScale : 1}>
            <line x1={124} x2={146} y1={y(v)} y2={y(v)} stroke="#fff" strokeWidth={4} opacity={0.7} />
            <text x={116} y={y(v) + 11} textAnchor="end" fontFamily={MONO} fontWeight={800} fontSize={30} fill="#fff" opacity={0.75}>
              {v === 0 ? "0" : `+${String(v).replace(".", ",")}`}
            </text>
          </g>
        ))}
        <g opacity={threshold}>
          <line x1={140} x2={300} y1={y(0.5)} y2={y(0.5)} stroke={C.yellow} strokeWidth={5} strokeDasharray="14 10" />
          <text x={230} y={y(0.5) - 16} fontFamily={MONO} fontWeight={800} fontSize={26} fill={C.yellow}>
            EL NIÑO
          </text>
        </g>
      </svg>
      {showValue ? (
        <div style={{ position: "absolute", left: 228, top: Math.min(y(value), tubeBottom - 40) - 36 }}>
          <Panel glow={color} style={{ padding: "6px 16px" }}>
            <Label size={46} mono color={color}>
              +{value.toFixed(1).replace(".", ",")} °C
            </Label>
          </Panel>
        </div>
      ) : null}
    </div>
  );
};

export const Donut: React.FC<{ percent: number; size: number }> = ({ percent, size }) => {
  const r = size / 2 - 30;
  const len = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={44} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#ff4a2e"
        strokeWidth={44}
        strokeLinecap="round"
        strokeDasharray={`${(len * percent) / 100} ${len}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: "drop-shadow(0 0 18px #ff4a2e)" }}
      />
      <text x={size / 2} y={size / 2 + 40} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={120} fill="#fff">
        {Math.round(percent)}%
      </text>
    </svg>
  );
};

const RainIcon: React.FC<{ rain: number; frame: number }> = ({ rain, frame }) => (
  <svg width={96} height={96} viewBox="0 0 96 96">
    <path d="M 24 56 C 10 56 8 36 24 34 C 26 20 44 14 54 24 C 70 18 84 30 78 44 C 90 46 88 60 76 60 L 26 60 Z" fill={rain > 0.5 ? "#9fb3d6" : "#5d6d8c"} />
    {rain > 0.5
      ? [30, 48, 66].map((x, i) => <line key={x} x1={x} y1={68 + ((frame + i * 5) % 14)} x2={x - 6} y2={80 + ((frame + i * 5) % 14)} stroke={C.negative} strokeWidth={6} strokeLinecap="round" />)
      : null}
  </svg>
);

/** El widget del clima del celular: con signos de pregunta o con lluvia. */
export const WeatherWidget: React.FC<{ months: string[]; rain: number; frame: number; title: string }> = ({ months, rain, frame, title }) => (
  <Panel style={{ padding: "20px 26px", borderRadius: 36, width: 460 }}>
    <Label size={28} color={C.dim} style={{ marginBottom: 14 }}>
      {title}
    </Label>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {months.map((m, i) => (
        <div key={m} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Label size={28} mono>
            {m}
          </Label>
          {rain > i / months.length ? (
            <RainIcon rain={1} frame={frame} />
          ) : (
            <div style={{ width: 96, height: 96, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Label size={72} color={C.yellow} style={{ rotate: `${Math.sin(frame / 6 + i) * 8}deg` }}>
                ?
              </Label>
            </div>
          )}
        </div>
      ))}
    </div>
  </Panel>
);
