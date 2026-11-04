"use client";

import { m } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { site, whatsappLink } from "@/content/site";
import { buttonClass } from "@/components/ui/Button";
import { IconClock, IconGlobe, IconPercent, IconWhatsApp } from "@/components/ui/Icons";
import { HeroPhone } from "./HeroPhone";

const benefitIcons = { clock: IconClock, percent: IconPercent, globe: IconGlobe };

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
            <a href={whatsappLink(t.hero.ctaMessage)} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "group text-base")}>
              <IconWhatsApp className="transition-transform group-hover:scale-110" />
              {t.hero.cta}
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

      {/* beneficios */}
      <ul
        style={rise(0.4)}
        aria-label={t.benefits.label}
        className="rise mx-auto mt-20 grid max-w-6xl gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3"
      >
        {site.benefits.map((b) => {
          const Icon = benefitIcons[b.icon];
          return (
            <li key={b.title.es} className="flex items-center gap-4 bg-bg/90 px-5 py-5 backdrop-blur sm:flex-col sm:gap-3 sm:px-6 sm:py-8 sm:text-center">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary sm:size-14">
                <Icon width={24} height={24} />
              </span>
              <span>
                <span className="block font-display text-lg font-semibold leading-tight sm:text-xl">{l(b.title)}</span>
                <span className="mt-1 block text-sm text-muted">{l(b.text)}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
