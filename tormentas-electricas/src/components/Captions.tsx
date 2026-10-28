import React, { useMemo } from "react";
import { createTikTokStyleCaptions, type TikTokPage } from "@remotion/captions";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { CAPTIONS } from "../timeline";
import { C, DISPLAY } from "../theme";

const SWITCH_CAPTIONS_EVERY_MS = 1100;

const clean = (text: string) => text.trim().replace(/[.,:…]+$/, "");

// Misma regla que scripts/generar_voz.py: sin minúsculas = palabra clave.
const isKeyword = (text: string) => {
  const core = clean(text);
  return !core.startsWith("@") && !/[a-záéíóúñü]/.test(core) && (/\d/.test(core) || core.replace(/[^A-ZÁÉÍÓÚÑÜ]/g, "").length >= 2);
};

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = page.startMs + (frame / fps) * 1000;

  return (
    <AbsoluteFill style={{ top: 1250, height: 330, left: 70, right: 70, width: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", columnGap: 26, rowGap: 4, textAlign: "center" }}>
        {page.tokens.map((token, i) => {
          const word = clean(token.text);
          const keyword = isKeyword(word);
          const handle = word.startsWith("@");
          const since = ((nowMs - token.fromMs) / 1000) * fps;
          const active = nowMs >= token.fromMs && nowMs < token.toMs;
          const color = keyword ? C.yellow : handle ? C.electric : C.white;
          return (
            <span
              key={`${token.fromMs}-${i}`}
              style={{
                fontFamily: DISPLAY,
                fontWeight: 900,
                fontSize: handle ? 66 : keyword ? 104 : 88,
                lineHeight: 1.08,
                letterSpacing: keyword ? -1 : -0.5,
                color,
                WebkitTextStroke: "14px #000",
                paintOrder: "stroke fill",
                textShadow: keyword ? `0 0 34px ${C.yellow}88, 0 8px 0 rgba(0,0,0,0.55)` : "0 8px 0 rgba(0,0,0,0.55)",
                opacity: interpolate(since, [-1, 0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                scale: interpolate(since, [0, 7], [keyword ? 0.5 : 0.75, active && !keyword ? 1.04 : 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.spring({ damping: 12 }),
                }),
                translate: interpolate(since, [0, 6], ["0px 26px", "0px 0px"], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                }),
                rotate: keyword ? interpolate(since, [0, 8], ["-4deg", "-1.5deg"], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : "0deg",
                display: "inline-block",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC = () => {
  const { fps } = useVideoConfig();
  const { pages } = useMemo(
    () => createTikTokStyleCaptions({ captions: CAPTIONS, combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS }),
    [],
  );

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const next = pages[index + 1] ?? null;
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const lastToken = page.tokens[page.tokens.length - 1];
        const holdUntil = Math.round(((lastToken.toMs + 450) / 1000) * fps);
        const endFrame = next ? Math.min(Math.round((next.startMs / 1000) * fps), holdUntil) : holdUntil;
        if (endFrame <= startFrame) {
          return null;
        }
        return (
          <Sequence key={index} name="Subtítulo" from={startFrame} durationInFrames={endFrame - startFrame}>
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
