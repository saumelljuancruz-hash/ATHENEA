"use client";

import { m, useScroll } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { IconDoc, IconGlobe, IconKey } from "@/components/ui/Icons";

const guaranteeIcons = [IconKey, IconGlobe, IconDoc];

export function Process() {
  const { t } = useLang();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });

  return (
    <Section id="proceso" labelledBy="process-title" className="bg-surface/40">
      <SectionHeading id="process-title" eyebrow={t.process.eyebrow} title={t.process.title} subtitle={t.process.subtitle} />

      <div className="mx-auto max-w-3xl">
        <ol ref={listRef} className="relative space-y-10 sm:space-y-14">
          {/* línea del timeline */}
          <span aria-hidden className="absolute bottom-6 left-[23px] top-6 w-0.5 bg-line sm:left-[31px]" />
          <m.span
            aria-hidden
            style={{ scaleY: scrollYProgress }}
            className="absolute bottom-6 left-[23px] top-6 w-0.5 origin-top bg-gradient-to-b from-primary to-accent sm:left-[31px]"
          />
          {t.process.steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={0.05} className="relative flex gap-5 sm:gap-8">
              <m.span
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "0px 0px -30% 0px" }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border-4 border-bg bg-primary font-display text-xl font-semibold text-primary-fg shadow-[0_0_0_1px_var(--line)] sm:size-16 sm:text-2xl"
              >
                {i + 1}
              </m.span>
              <div className="flex-1 rounded-3xl border border-line bg-surface p-5 sm:p-6">
                <h3 className="font-display text-xl font-semibold sm:text-2xl">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <ul className="mt-14 grid gap-3 sm:grid-cols-3">
          {t.process.guarantees.map((g, i) => {
            const Icon = guaranteeIcons[i % guaranteeIcons.length];
            return (
              <Reveal as="li" key={g.title} delay={0.08 * i} className="flex items-start gap-3 rounded-2xl border border-basil/30 bg-basil/10 p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-basil/20 text-basil">
                  <Icon width={18} height={18} />
                </span>
                <span>
                  <span className="block font-semibold">{g.title}</span>
                  <span className="block text-sm text-muted">{g.text}</span>
                </span>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
