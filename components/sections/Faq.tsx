"use client";

import { AnimatePresence, m } from "framer-motion";
import { useState } from "react";
import { faq } from "@/content/faq";
import { whatsappLink } from "@/content/site";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { IconPlus, IconWhatsApp } from "@/components/ui/Icons";

export function Faq() {
  const { t, l } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" labelledBy="faq-title">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <SectionHeading id="faq-title" align="left" eyebrow={t.faq.eyebrow} title={t.faq.title} />
          <Reveal className="hidden lg:block">
            <p className="text-muted">{t.faq.more}</p>
            <a href={whatsappLink(t.contact.fabMessage)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
              <IconWhatsApp width={18} height={18} />
              {t.faq.ask}
            </a>
          </Reveal>
        </div>

        <Reveal>
          <ul className="divide-y divide-line rounded-3xl border border-line bg-surface">
            {faq.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q.es}>
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold sm:p-6 sm:text-lg"
                    >
                      {l(item.q)}
                      <m.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        className={`grid size-8 shrink-0 place-items-center rounded-full transition-colors ${isOpen ? "bg-primary text-primary-fg" : "bg-surface-2"}`}
                      >
                        <IconPlus width={16} height={16} />
                      </m.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        id={`faq-a-${i}`}
                        role="region"
                        aria-labelledby={`faq-q-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-6 leading-relaxed text-muted sm:px-6">{l(item.a)}</p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
