"use client";

import { m } from "framer-motion";
import { useId, useState } from "react";
import { plans } from "@/content/pricing";
import { useLang } from "@/lib/i18n";
import { usd } from "@/lib/format";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { IconCheck, IconX } from "@/components/ui/Icons";

const proPrice = plans.find((p) => p.id === "pro")?.price ?? 380;

export function Compare() {
  const { t } = useLang();
  const [orders, setOrders] = useState(300);
  const [ticket, setTicket] = useState(20);
  const [commission, setCommission] = useState(25);

  const monthly = orders * ticket * (commission / 100);
  const yearly = monthly * 12;
  const paybackDays = monthly > 0 ? Math.ceil(proPrice / (monthly / 30)) : null;

  return (
    <Section id="ahorro" labelledBy="compare-title" className="bg-surface/40">
      <SectionHeading id="compare-title" eyebrow={t.compare.eyebrow} title={t.compare.title} subtitle={t.compare.subtitle} />

      {/* comparación */}
      <div className="grid gap-4 md:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-3xl border border-line bg-surface p-6 sm:p-8">
            <p className="mb-5 flex items-center gap-3 font-display text-xl font-semibold text-muted sm:text-2xl">
              <span className="grid size-10 place-items-center rounded-2xl bg-danger/10 text-2xl">📱</span>
              {t.compare.appsTitle}
            </p>
            <ul className="space-y-3">
              {t.compare.appsItems.map((item, i) => (
                <m.li
                  key={item}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.45 }}
                  className="flex items-start gap-3 text-muted"
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-danger/15 text-danger">
                    <IconX width={14} height={14} strokeWidth={3} />
                  </span>
                  <span className="line-through decoration-danger/40 decoration-1">{item}</span>
                </m.li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative h-full overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/15 via-surface to-surface p-6 sm:p-8">
            <div aria-hidden className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/20 blur-3xl" />
            <p className="relative mb-5 flex items-center gap-3 font-display text-xl font-semibold sm:text-2xl">
              <span className="grid size-10 place-items-center rounded-2xl bg-primary/15 text-2xl">🍽️</span>
              {t.compare.webTitle}
            </p>
            <ul className="relative space-y-3">
              {t.compare.webItems.map((item, i) => (
                <m.li
                  key={item}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + 0.1 * i, duration: 0.45 }}
                  className="flex items-start gap-3 font-medium"
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-basil/20 text-basil">
                    <IconCheck width={14} height={14} strokeWidth={3} />
                  </span>
                  {item}
                </m.li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* calculadora */}
      <Reveal delay={0.1}>
        <div className="mt-6 grid overflow-hidden rounded-3xl border border-line bg-surface lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-7 p-6 sm:p-8">
            <h3 className="font-display text-2xl font-semibold">{t.compare.calcTitle}</h3>
            <Slider label={t.compare.orders} value={orders} min={0} max={3000} step={10} onChange={setOrders} />
            <Slider label={t.compare.ticket} value={ticket} min={1} max={150} step={1} onChange={setTicket} prefix="$" />
            <Slider label={t.compare.commission} value={commission} min={0} max={40} step={1} onChange={setCommission} suffix="%" />
          </div>

          <div className="flex flex-col justify-center gap-6 border-t border-line bg-surface-2/60 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <div>
              <p className="text-sm text-muted">{t.compare.monthly}</p>
              <p className="font-display text-4xl font-semibold text-danger sm:text-5xl" aria-live="polite">
                <AnimatedNumber value={monthly} format={usd} duration={0.5} />
              </p>
            </div>
            <div className="h-px bg-line" />
            <div>
              <p className="text-sm text-muted">{t.compare.yearly}</p>
              <p className="font-display text-5xl font-semibold text-basil sm:text-6xl" aria-live="polite">
                <AnimatedNumber value={yearly} format={usd} duration={0.6} />
              </p>
            </div>
            <p className="rounded-2xl bg-bg/60 p-4 text-sm leading-relaxed">
              💡 {paybackDays ? t.compare.payback(paybackDays) : t.compare.paybackNone}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  prefix = "",
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  const id = useId();
  const fill = ((Math.min(value, max) - min) / (max - min)) * 100;
  const clamp = (v: number) => Math.max(min, Math.min(v, max * 10));
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <label htmlFor={`${id}-n`} className="text-sm font-semibold">
          {label}
        </label>
        <div className="flex items-center rounded-xl border border-line bg-bg px-3 py-1.5 focus-within:border-primary">
          {prefix && <span className="text-muted">{prefix}</span>}
          <input
            id={`${id}-n`}
            type="number"
            inputMode="numeric"
            min={min}
            value={value}
            onChange={(e) => onChange(clamp(Number(e.target.value) || 0))}
            className="w-16 bg-transparent text-right font-semibold tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          {suffix && <span className="text-muted">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={Math.min(value, max)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range w-full"
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
      />
    </div>
  );
}
