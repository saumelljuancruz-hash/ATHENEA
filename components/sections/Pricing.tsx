"use client";

import { AnimatePresence, m } from "framer-motion";
import { useState } from "react";
import { comparison, plans, type CompareValue, type PlanId } from "@/content/pricing";
import { useLang } from "@/lib/i18n";
import { useQuote } from "@/lib/quote";
import { usd, scrollToId } from "@/lib/format";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { IconCheck, IconChevronDown, IconMinus } from "@/components/ui/Icons";

export function Pricing() {
  const { t, l } = useLang();
  const { setPlanId } = useQuote();
  const [showTable, setShowTable] = useState(false);

  const choose = (id: PlanId) => {
    setPlanId(id);
    scrollToId("presupuesto");
  };

  return (
    <Section id="planes" labelledBy="pricing-title" className="bg-surface/40">
      <SectionHeading id="pricing-title" eyebrow={t.pricing.eyebrow} title={t.pricing.title} subtitle={t.pricing.subtitle} />

      <div className="grid items-stretch gap-5 lg:grid-cols-3 lg:gap-6">
        {plans.map((plan, i) => {
          const hi = plan.highlighted;
          return (
            <Reveal key={plan.id} delay={0.08 * i} className={`h-full ${hi ? "lg:-my-4" : ""}`}>
              <article
                aria-labelledby={`plan-${plan.id}`}
                className={`relative flex h-full flex-col rounded-3xl border p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-8 ${
                  hi
                    ? "border-primary bg-gradient-to-b from-primary/15 to-surface shadow-[0_30px_80px_-30px_var(--glow)]"
                    : "border-line bg-surface"
                }`}
              >
                {hi && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-fg shadow-lg">
                    ★ {t.pricing.popular}
                  </span>
                )}
                <h3 id={`plan-${plan.id}`} className="font-display text-2xl font-semibold">
                  {l(plan.name)}
                </h3>
                <p className="mt-2 min-h-12 text-sm text-muted">{l(plan.tagline)}</p>
                <p className="mt-5 flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-muted">USD</span>
                  <span className="font-display text-6xl font-semibold tracking-tight">{plan.price}</span>
                  <span className="text-sm text-muted">{t.pricing.oneTime}</span>
                </p>
                <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-muted">
                  <span>⏱ {l(plan.delivery)}</span>
                  <span>✎ {t.pricing.revisions(plan.revisions)}</span>
                </p>
                <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6">
                  {plan.features.map((f, j) => (
                    <li key={f.es} className={`flex items-start gap-3 text-sm ${j === 0 && i > 0 ? "font-semibold" : ""}`}>
                      <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${hi ? "bg-primary text-primary-fg" : "bg-basil/20 text-basil"}`}>
                        <IconCheck width={12} height={12} strokeWidth={3.5} />
                      </span>
                      {l(f)}
                    </li>
                  ))}
                </ul>
                <Button variant={hi ? "primary" : "outline"} className="mt-8 w-full" onClick={() => choose(plan.id)}>
                  {t.pricing.choose(l(plan.name))}
                </Button>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* tabla comparativa */}
      <div className="mt-12 text-center">
        <button
          type="button"
          onClick={() => setShowTable((s) => !s)}
          aria-expanded={showTable}
          aria-controls="compare-table"
          className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold hover:bg-surface"
        >
          {showTable ? t.pricing.compareHide : t.pricing.compareShow}
          <m.span animate={{ rotate: showTable ? 180 : 0 }}>
            <IconChevronDown width={18} height={18} />
          </m.span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showTable && (
          <m.div
            id="compare-table"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-surface">
              <table className="w-full text-[13px] sm:text-sm">
                <caption className="sr-only">{t.pricing.compareShow}</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="w-[40%] p-3 text-left font-semibold text-muted sm:p-4">
                      {t.pricing.feature}
                    </th>
                    {plans.map((p) => (
                      <th key={p.id} scope="col" className={`px-1 py-3 text-center font-display text-sm font-semibold sm:p-4 sm:text-base ${p.highlighted ? "text-primary" : ""}`}>
                        {l(p.name)}
                        <span className="block font-sans text-xs font-normal text-muted">{usd(p.price)}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.label.es} className="border-b border-line last:border-0">
                      <th scope="row" className="p-3 text-left font-normal sm:p-4">
                        {l(row.label)}
                      </th>
                      {plans.map((p) => (
                        <td key={p.id} className={`px-1 py-3 text-center sm:p-4 ${p.highlighted ? "bg-primary/5" : ""}`}>
                          <Cell value={row.values[p.id]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

function Cell({ value }: { value: CompareValue }) {
  const { t, l } = useLang();
  if (value === true)
    return (
      <span className="inline-grid size-6 place-items-center rounded-full bg-basil/20 text-basil">
        <IconCheck width={14} height={14} strokeWidth={3} />
        <span className="sr-only">{t.pricing.included}</span>
      </span>
    );
  if (value === false)
    return (
      <span className="inline-grid size-6 place-items-center text-muted/50">
        <IconMinus width={14} height={14} />
        <span className="sr-only">{t.pricing.notIncluded}</span>
      </span>
    );
  return <span className="font-semibold">{l(value)}</span>;
}
