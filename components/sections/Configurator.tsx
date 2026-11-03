"use client";

import { AnimatePresence, m } from "framer-motion";
import { depositPercent, extras, maintenance, plans } from "@/content/pricing";
import { whatsappLink } from "@/content/site";
import { useLang } from "@/lib/i18n";
import { useQuote } from "@/lib/quote";
import { usd } from "@/lib/format";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { buttonClass } from "@/components/ui/Button";
import { IconCheck, IconWhatsApp } from "@/components/ui/Icons";

export function Configurator() {
  const { t, l } = useLang();
  const { planId, setPlanId, extraIds, toggleExtra, maintenanceId, setMaintenanceId } = useQuote();

  const plan = plans.find((p) => p.id === planId)!;
  const chosenExtras = extras.filter((e) => extraIds.includes(e.id));
  const maint = maintenance.find((m) => m.id === maintenanceId)!;
  const total = plan.price + chosenExtras.reduce((s, e) => s + e.price, 0);
  const deposit = Math.round((total * depositPercent) / 100);

  const message = [
    t.quote.msgIntro,
    "",
    `• ${t.quote.msgPlan}: ${l(plan.name)} (${usd(plan.price)})`,
    `• ${t.quote.msgExtras}: ${chosenExtras.length ? chosenExtras.map((e) => `${l(e.name)} (${usd(e.price)})`).join(", ") : t.quote.noExtras}`,
    `• ${t.quote.msgMaintenance}: ${l(maint.name)}${maint.monthly ? ` (${usd(maint.monthly)}${t.quote.perMonth})` : ""}`,
    "",
    `*${t.quote.msgTotal}: ${usd(total)}*`,
    "",
    t.quote.msgClose,
  ].join("\n");

  return (
    <Section id="presupuesto" labelledBy="quote-title">
      <SectionHeading id="quote-title" eyebrow={t.quote.eyebrow} title={t.quote.title} subtitle={t.quote.subtitle} />

      <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          {/* 1. plan */}
          <Reveal>
            <fieldset>
              <legend className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">{t.quote.step1}</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {plans.map((p) => (
                  <OptionCard key={p.id} type="radio" name="plan" checked={planId === p.id} onChange={() => setPlanId(p.id)}>
                    <span className="font-display text-lg font-semibold">{l(p.name)}</span>
                    <span className="mt-1 block text-sm text-muted">{usd(p.price)}</span>
                  </OptionCard>
                ))}
              </div>
            </fieldset>
          </Reveal>

          {/* 2. extras */}
          <Reveal>
            <fieldset>
              <legend className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">{t.quote.step2}</legend>
              <div className="grid gap-3">
                {extras.map((e) => (
                  <OptionCard key={e.id} type="checkbox" name="extras" checked={extraIds.includes(e.id)} onChange={() => toggleExtra(e.id)}>
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{l(e.name)}</span>
                      <span className="shrink-0 font-semibold">+{usd(e.price)}</span>
                    </span>
                    <span className="mt-1 block text-sm text-muted">{l(e.description)}</span>
                  </OptionCard>
                ))}
              </div>
            </fieldset>
          </Reveal>

          {/* 3. mantenimiento */}
          <Reveal>
            <fieldset>
              <legend className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">{t.quote.step3}</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {maintenance.map((m) => (
                  <OptionCard key={m.id} type="radio" name="maintenance" checked={maintenanceId === m.id} onChange={() => setMaintenanceId(m.id)}>
                    <span className="font-semibold">{l(m.name)}</span>
                    <span className="mt-1 block text-sm font-semibold text-primary">
                      {m.monthly ? `${usd(m.monthly)}${t.quote.perMonth}` : "—"}
                    </span>
                    <span className="mt-1 block text-xs leading-snug text-muted">{l(m.description)}</span>
                  </OptionCard>
                ))}
              </div>
            </fieldset>
          </Reveal>
        </div>

        {/* resumen */}
        <Reveal className="lg:sticky lg:top-24">
          <aside aria-labelledby="quote-summary" className="relative overflow-hidden rounded-3xl border border-primary/40 bg-surface p-6 shadow-[0_30px_80px_-40px_var(--glow)] sm:p-8">
            <div aria-hidden className="absolute -right-20 -top-20 size-56 rounded-full bg-primary/20 blur-3xl" />
            <h3 id="quote-summary" className="relative font-display text-2xl font-semibold">
              {t.quote.summary}
            </h3>

            <dl className="relative mt-6 space-y-3 text-sm">
              <Row label={`${t.quote.plan} ${l(plan.name)}`} value={usd(plan.price)} />
              <AnimatePresence initial={false}>
                {chosenExtras.map((e) => (
                  <m.div key={e.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <Row label={l(e.name)} value={`+${usd(e.price)}`} muted />
                  </m.div>
                ))}
              </AnimatePresence>
            </dl>

            <div className="relative mt-5 border-t border-dashed border-line pt-5">
              <p className="text-sm text-muted">{t.quote.total}</p>
              <p className="font-display text-5xl font-semibold tracking-tight" aria-live="polite">
                <AnimatedNumber value={total} format={usd} duration={0.6} />
              </p>
              {maint.monthly > 0 && (
                <p className="mt-1 text-sm text-muted">
                  + {t.quote.monthly} {l(maint.name)}: <span className="font-semibold text-fg">{usd(maint.monthly)}{t.quote.perMonth}</span>
                </p>
              )}
            </div>

            <div className="relative mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-bg/70 p-3">
                <p className="text-xs text-muted">{t.quote.deposit}</p>
                <p className="mt-0.5 font-semibold">
                  <AnimatedNumber value={deposit} format={usd} duration={0.6} />
                </p>
              </div>
              <div className="rounded-2xl bg-bg/70 p-3">
                <p className="text-xs text-muted">{t.quote.onDelivery}</p>
                <p className="mt-0.5 font-semibold">
                  <AnimatedNumber value={total - deposit} format={usd} duration={0.6} />
                </p>
              </div>
            </div>

            <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className={buttonClass("whatsapp", "relative mt-6 w-full text-base")}>
              <IconWhatsApp />
              {t.quote.send}
            </a>
            <p className="relative mt-3 text-center text-xs text-muted">{t.quote.note}</p>
          </aside>
        </Reveal>
      </div>
    </Section>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-0.5">
      <dt className={muted ? "text-muted" : "font-semibold"}>{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

/** Tarjeta seleccionable basada en un input nativo (accesible con teclado). */
function OptionCard({
  type,
  name,
  checked,
  onChange,
  children,
}: {
  type: "radio" | "checkbox";
  name: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`relative block cursor-pointer rounded-2xl border p-4 pr-11 transition-all duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
        checked ? "border-primary bg-primary/10" : "border-line bg-surface hover:border-fg/25"
      }`}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span
        aria-hidden
        className={`absolute right-4 top-4 grid size-5 place-items-center border-2 transition-colors ${type === "radio" ? "rounded-full" : "rounded-md"} ${
          checked ? "border-primary bg-primary text-primary-fg" : "border-line"
        }`}
      >
        <AnimatePresence>
          {checked && (
            <m.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <IconCheck width={12} height={12} strokeWidth={3.5} />
            </m.span>
          )}
        </AnimatePresence>
      </span>
      {children}
    </label>
  );
}
