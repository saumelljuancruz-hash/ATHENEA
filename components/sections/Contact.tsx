"use client";

import { useEffect, useId, useState } from "react";
import { plans, type PlanId } from "@/content/pricing";
import { site, whatsappLink } from "@/content/site";
import { useLang } from "@/lib/i18n";
import { useQuote } from "@/lib/quote";
import { usd } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClass } from "@/components/ui/Button";
import { IconMail, IconWhatsApp } from "@/components/ui/Icons";

export function Contact() {
  const { t, l } = useLang();
  const { planId } = useQuote();
  const [business, setBusiness] = useState("");
  const [country, setCountry] = useState("");
  const [instagram, setInstagram] = useState("");
  const [plan, setPlan] = useState<PlanId | "unsure">(planId);
  const [error, setError] = useState(false);

  // Si el visitante eligió un plan más arriba, lo preseleccionamos.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza con el plan elegido en otra sección
    setPlan(planId);
  }, [planId]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business.trim()) {
      setError(true);
      document.getElementById("contact-business")?.focus();
      return;
    }
    const chosen = plans.find((p) => p.id === plan);
    const ig = instagram.trim();
    const message = [
      t.contact.msgIntro,
      "",
      `• ${t.contact.msgBusiness}: ${business.trim()}`,
      country.trim() && `• ${t.contact.msgCountry}: ${country.trim()}`,
      ig && `• ${t.contact.msgInstagram}: ${ig.startsWith("@") || ig.startsWith("http") ? ig : `@${ig}`}`,
      `• ${t.contact.msgPlan}: ${chosen ? `${l(chosen.name)} (${usd(chosen.price)})` : t.contact.planUnsure}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contacto" aria-labelledby="contact-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="grain relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-primary/20 via-surface to-surface p-6 sm:rounded-[2.5rem] sm:p-12 lg:p-16">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/30 blur-[100px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-accent/15 blur-[100px]" />

        <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="h-px w-6 bg-primary" aria-hidden />
              {t.contact.eyebrow}
            </p>
            <h2 id="contact-title" className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl">
              {t.contact.title}
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{t.contact.subtitle}</p>
            <p className="mt-8 text-sm text-muted">{t.contact.orWhatsapp}</p>
            <a href={whatsappLink(t.contact.fabMessage)} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-2 font-semibold hover:text-primary">
              <IconWhatsApp width={18} height={18} />
              {site.whatsappDisplay}
            </a>
            <p className="mt-5 text-sm text-muted">{t.contact.orEmail}</p>
            <a href={`mailto:${site.email}`} className="mt-1 inline-flex items-center gap-2 break-all font-semibold hover:text-primary">
              <IconMail width={18} height={18} className="shrink-0" />
              {site.email}
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-3xl border border-line bg-bg/80 p-5 backdrop-blur sm:p-7">
              <Field
                id="contact-business"
                label={t.contact.business}
                placeholder={t.contact.businessPlaceholder}
                value={business}
                onChange={(v) => {
                  setBusiness(v);
                  if (v.trim()) setError(false);
                }}
                required
                error={error ? t.contact.required : undefined}
                autoComplete="organization"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="contact-country" label={t.contact.country} placeholder={t.contact.countryPlaceholder} value={country} onChange={setCountry} autoComplete="country-name" />
                <Field id="contact-ig" label={t.contact.instagram} placeholder={t.contact.instagramPlaceholder} value={instagram} onChange={setInstagram} />
              </div>
              <div>
                <label htmlFor="contact-plan" className="mb-1.5 block text-sm font-semibold">
                  {t.contact.plan}
                </label>
                <select
                  id="contact-plan"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value as PlanId | "unsure")}
                  className="w-full appearance-none rounded-2xl border border-line bg-surface bg-[length:18px] bg-[right_1rem_center] bg-no-repeat px-4 py-3.5 pr-10 outline-none transition-colors focus:border-primary"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {l(p.name)} · {usd(p.price)}
                    </option>
                  ))}
                  <option value="unsure">{t.contact.planUnsure}</option>
                </select>
              </div>
              <button type="submit" className={buttonClass("whatsapp", "w-full text-base")}>
                <IconWhatsApp />
                {t.contact.submit}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  required,
  error,
  autoComplete,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}) {
  const errId = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        autoComplete={autoComplete}
        className={`w-full rounded-2xl border bg-surface px-4 py-3.5 outline-none transition-colors placeholder:text-muted/60 focus:border-primary ${error ? "border-danger" : "border-line"}`}
      />
      {error && (
        <p id={errId} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
