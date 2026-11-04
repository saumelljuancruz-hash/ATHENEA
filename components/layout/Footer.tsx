"use client";

import { useEffect, useState } from "react";
import { site, whatsappLink } from "@/content/site";
import { useLang } from "@/lib/i18n";
import { Logo } from "./Logo";

export function Footer() {
  const { t } = useLang();
  // El año se calcula en el navegador para que la página siga siendo estática.
  const [year, setYear] = useState(2026);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- año actual del visitante
    setYear(new Date().getFullYear());
  }, []);
  const links = [
    ["#demo", t.nav.demo],
    ["#proyectos", t.nav.work],
    ["#planes", t.nav.pricing],
    ["#presupuesto", t.nav.quote],
    ["#faq", t.nav.faq],
  ] as const;

  return (
    <footer className="border-t border-line px-4 pb-28 pt-12 sm:px-6 sm:pb-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm text-muted">{t.footer.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {links.map(([href, label]) => (
              <li key={href}>
                <a href={href} className="text-muted hover:text-fg">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="space-y-1.5 text-sm">
          <li>
            <a href={whatsappLink(t.contact.fabMessage)} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-fg">
              WhatsApp: {site.whatsappDisplay}
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`} className="text-muted hover:text-fg">
              {site.email}
            </a>
          </li>
          {site.instagram && (
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-fg">
                Instagram
              </a>
            </li>
          )}
        </ul>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:justify-between">
        <p>
          © {year} {site.name}. {t.footer.rights}
        </p>
        <p>{t.footer.madeWith}</p>
      </div>
    </footer>
  );
}
