"use client";

import { m } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { site } from "@/content/site";
import { buttonClass } from "@/components/ui/Button";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { IconArrowRight } from "@/components/ui/Icons";
import { HeroPhone } from "./HeroPhone";

export function Hero() {
  const { t, l } = useLang();

  // Animación CSS: arranca sin esperar a que cargue JavaScript (mejor LCP).
  const rise = (delay: number, keepVisible = false) =>
    ({ "--d": `${delay}s`, ...(keepVisible ? { "--rise-from": 1 } : {}) }) as React.CSSProperties;

  return (
    <section id="inicio" aria-labelledby="hero-title" className="grain relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pt-36">
      {/* fondo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 right-[-10%] size-[520px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute bottom-0 left-[-10%] size-[420px] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(var(--line)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div className="text-center lg:text-left">
          <p style={rise(0)} className="rise mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3.5 py-1.5 text-xs font-medium text-muted backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-basil opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-basil" />
            </span>
            {t.hero.eyebrow}
          </p>

          <h1
            id="hero-title"
            style={rise(0.08, true)}
            className="rise font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-[4.4rem]"
          >
            {t.hero.titleA}{" "}
            <span className="relative whitespace-nowrap italic text-primary">
              {t.hero.titleHighlight}
              <svg aria-hidden viewBox="0 0 220 14" className="absolute -bottom-2 left-0 w-full text-accent" preserveAspectRatio="none">
                <m.path
                  d="M2 10 C 50 2, 120 2, 218 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.7, ease: "easeInOut" }}
                />
              </svg>
            </span>
            {t.hero.titleB}
          </h1>

          <p style={rise(0.16, true)} className="rise mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty lg:mx-0">
            {t.hero.subtitle}
          </p>

          <div style={rise(0.24)} className="rise mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a href="#contacto" className={buttonClass("primary", "group text-base")}>
              {t.hero.cta}
              <IconArrowRight className="transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#demo" className={buttonClass("outline", "text-base")}>
              {t.hero.secondary}
            </a>
          </div>

          <p style={rise(0.32)} className="rise mt-6 text-sm text-muted">
            {t.hero.trust}
          </p>
        </div>

        <div className="px-6 sm:px-0">
          <HeroPhone />
        </div>
      </div>

      {/* contadores */}
      <dl
        style={rise(0.4)}
        aria-label={t.stats.label}
        className="rise mx-auto mt-20 grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-4"
      >
        {site.stats.map((s) => (
          <div key={s.label.es} className="flex flex-col-reverse gap-1 bg-bg/90 px-5 py-6 text-center backdrop-blur sm:py-8">
            <dt className="text-xs text-muted sm:text-sm">{l(s.label)}</dt>
            <dd className="font-display text-4xl font-semibold text-fg sm:text-5xl">
              <AnimatedNumber value={s.value} startOnView duration={1.6} />
              <span className="text-primary">{s.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
