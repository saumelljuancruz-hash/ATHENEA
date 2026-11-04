"use client";

import { m } from "framer-motion";
import { demoRestaurants } from "@/content/demo-menus";
import { useLang } from "@/lib/i18n";
import { useDemoStyle } from "@/lib/demo-style";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { IconCheck } from "@/components/ui/Icons";
import { DemoApp } from "@/components/demo/DemoApp";

export function Demo() {
  const { t, l } = useLang();
  const { demoId: activeId, setDemoId: setActiveId } = useDemoStyle();
  const restaurant = demoRestaurants.find((r) => r.id === activeId)!;

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = demoRestaurants[(index + dir + demoRestaurants.length) % demoRestaurants.length];
    setActiveId(next.id);
    document.getElementById(`demo-style-${next.id}`)?.focus();
  };

  return (
    <Section id="demo" labelledBy="demo-title" className="overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 -z-10 size-[600px] -translate-x-1/2 rounded-full blur-[140px] transition-colors duration-700" style={{ background: `${restaurant.theme.primary}22` }} />

      <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-20">
        <div>
          <SectionHeading id="demo-title" align="left" eyebrow={t.demo.eyebrow} title={t.demo.title} subtitle={t.demo.subtitle} />

          <Reveal>
            <p id="demo-style-label" className="mb-3 text-sm font-semibold text-muted">
              {t.demo.styleLabel}
            </p>
            <div role="radiogroup" aria-labelledby="demo-style-label" className="inline-grid w-full grid-cols-3 gap-1 rounded-2xl border border-line bg-surface p-1 sm:w-auto">
              {demoRestaurants.map((r, i) => {
                const on = r.id === activeId;
                return (
                  <button
                    key={r.id}
                    id={`demo-style-${r.id}`}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    tabIndex={on ? 0 : -1}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    onClick={() => setActiveId(r.id)}
                    className={`relative isolate flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors sm:flex-row sm:gap-2 sm:px-5 sm:text-sm ${on ? "text-primary-fg" : "text-muted hover:text-fg"}`}
                  >
                    {on && <m.span layoutId="demo-style-pill" className="absolute inset-0 -z-10 rounded-xl bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                    <span aria-hidden className="text-lg leading-none">
                      {r.emoji}
                    </span>
                    {l(r.label)}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <ul className="mt-8 hidden gap-3 sm:grid sm:grid-cols-2">
            {t.demo.points.map((p, i) => (
              <Reveal as="li" key={p} delay={0.05 * i} className="flex items-start gap-3 rounded-2xl border border-line bg-surface/60 p-4 text-sm">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-basil/15 text-basil">
                    <IconCheck width={14} height={14} strokeWidth={3} />
                  </span>
                  {p}
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal y={40} className="w-full lg:w-[320px]">
          <div role="region" aria-label={t.demo.phoneLabel}>
            <PhoneFrame className="max-w-[320px]">
              {/* key: al cambiar de estilo se monta una demo nueva (carrito vacío) con un fundido */}
              <m.div
                key={restaurant.id}
                initial={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <DemoApp restaurant={restaurant} />
              </m.div>
            </PhoneFrame>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
