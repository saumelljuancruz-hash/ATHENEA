"use client";

import { LayoutGroup } from "framer-motion";
import { demoRestaurants } from "@/content/demo-menus";
import { useLang } from "@/lib/i18n";
import { useDemoStyle } from "@/lib/demo-style";
import { scrollToId } from "@/lib/format";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClass } from "@/components/ui/Button";
import { IconArrowRight, IconSparkle } from "@/components/ui/Icons";
import { DemoApp } from "@/components/demo/DemoApp";

/**
 * DISEÑOS CONCEPTUALES
 * Tarjetas de los restaurantes ficticios de content/demo-menus.ts.
 * "Ver demo" abre la demo interactiva con ese estilo ya elegido.
 */
export function Portfolio() {
  const { t, l } = useLang();
  const { setDemoId } = useDemoStyle();

  const openDemo = (id: (typeof demoRestaurants)[number]["id"]) => {
    setDemoId(id);
    scrollToId("demo");
  };

  return (
    <Section id="proyectos" labelledBy="work-title">
      <SectionHeading id="work-title" eyebrow={t.work.eyebrow} title={t.work.title} subtitle={t.work.subtitle} />

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {demoRestaurants.map((r, i) => (
          <Reveal as="li" key={r.id} delay={0.08 * i} className="h-full">
            <article
              aria-labelledby={`concept-${r.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-fg/20 hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)]"
            >
              {/* mockup */}
              <div
                className="relative flex h-[300px] items-end justify-center overflow-hidden pt-10"
                style={{ background: `radial-gradient(circle at 50% 110%, ${r.theme.primary}66, transparent 65%), linear-gradient(160deg, ${r.theme.primary}22, transparent 60%)` }}
              >
                <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-line bg-bg/85 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <IconSparkle width={13} height={13} className="text-accent" />
                  {t.work.badge}
                </span>
                <MiniPhone>
                  <DemoApp restaurant={r} preview />
                </MiniPhone>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  <span aria-hidden>{r.emoji} </span>
                  {l(r.label)}
                </p>
                <h3 id={`concept-${r.id}`} className="mt-1.5 font-display text-xl font-semibold">
                  {r.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{l(r.concept)}</p>
                <button
                  type="button"
                  onClick={() => openDemo(r.id)}
                  aria-label={t.work.viewLabel(r.name)}
                  className={buttonClass("outline", "group/btn mt-5 w-full")}
                >
                  {t.work.view}
                  <IconArrowRight width={18} height={18} className="transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>

      <p className="mt-6 text-center text-sm text-muted">{t.work.note}</p>
    </Section>
  );
}

/** Celular en miniatura: muestra la demo real reducida y sin interacción. */
function MiniPhone({ children }: { children: React.ReactNode }) {
  // La pantalla se dibuja a 280 × 590 px y se reduce al 60%.
  return (
    <div
      aria-hidden
      inert
      className="relative -mb-24 w-[186px] shrink-0 rounded-[30px] bg-gradient-to-b from-[#3a332d] via-[#1b1714] to-[#2a241f] p-[7px] shadow-[0_30px_60px_-25px_rgb(0_0_0/0.6)] transition-transform duration-500 group-hover:-translate-y-3"
    >
      <div className="relative h-[354px] w-[172px] overflow-hidden rounded-[24px] bg-black">
        <span className="absolute left-1/2 top-1.5 z-50 h-[14px] w-[52px] -translate-x-1/2 rounded-full bg-black" />
        <div className="absolute left-0 top-0 h-[590px] w-[287px] origin-top-left scale-[0.6]">
          {/* LayoutGroup separa las animaciones de esta copia de las de la demo real */}
          <LayoutGroup id="concept-preview">{children}</LayoutGroup>
        </div>
      </div>
    </div>
  );
}
