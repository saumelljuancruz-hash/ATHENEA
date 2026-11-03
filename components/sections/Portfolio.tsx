"use client";

import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { useState } from "react";
import { projects, type Project } from "@/content/projects";
import { useLang } from "@/lib/i18n";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Modal } from "@/components/ui/Modal";
import { buttonClass } from "@/components/ui/Button";
import { IconArrowRight, IconChevronLeft, IconChevronRight, IconExternal, IconX } from "@/components/ui/Icons";

export function Portfolio() {
  const { t, l } = useLang();
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <Section id="proyectos" labelledBy="work-title">
      <SectionHeading id="work-title" eyebrow={t.work.eyebrow} title={t.work.title} subtitle={t.work.subtitle} />

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal as="li" key={p.id} delay={0.08 * i} className="h-full">
              <button
                type="button"
                onClick={() => setSelected(p)}
                aria-haspopup="dialog"
                className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-line bg-surface text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-fg/20 hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={p.images[0].src}
                    alt={l(p.images[0].alt)}
                    fill
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{l(p.category)}</span>
                  <span
                    aria-hidden
                    className="absolute bottom-4 right-4 grid size-11 translate-y-2 place-items-center rounded-full text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                    style={{ background: p.accent ?? "var(--primary)" }}
                  >
                    <IconArrowRight />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                  <p className="mt-1.5 text-sm text-muted">{l(p.summary)}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {t.work.view}
                    <IconArrowRight width={16} height={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
          </Reveal>
        ))}
      </ul>

      <Modal open={!!selected} onClose={() => setSelected(null)} labelledBy="project-title">
        {selected && <ProjectDetail project={selected} onClose={() => setSelected(null)} />}
      </Modal>
    </Section>
  );
}

function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const { t, l } = useLang();
  const [index, setIndex] = useState(0);
  const total = project.images.length;
  const go = (d: number) => setIndex((i) => (i + d + total) % total);
  const img = project.images[index];

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-2">
        <AnimatePresence initial={false} mode="popLayout">
          <m.div key={img.src} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0">
            <Image src={img.src} alt={l(img.alt)} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </m.div>
        </AnimatePresence>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.work.close}
          data-autofocus
          className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/75"
        >
          <IconX />
        </button>
        {total > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label={t.work.prev} className="absolute left-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/75">
              <IconChevronLeft />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t.work.next} className="absolute right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/75">
              <IconChevronRight />
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {project.images.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full bg-white transition-all ${i === index ? "w-5" : "w-1.5 opacity-50"}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{l(project.category)}</p>
        <h3 id="project-title" className="mt-2 font-display text-3xl font-semibold">
          {project.name}
        </h3>
        <p className="mt-4 leading-relaxed text-muted">{l(project.description)}</p>

        <p className="mt-6 text-sm font-semibold">{t.work.includes}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {project.features.map((f) => (
            <li key={f.es} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm">
              {l(f)}
            </li>
          ))}
        </ul>

        <div className="mt-8">
          {project.url ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className={buttonClass("primary")}>
              {t.work.visit}
              <IconExternal width={18} height={18} />
            </a>
          ) : (
            <span className={buttonClass("outline", "pointer-events-none opacity-70")}>{t.work.soon}</span>
          )}
        </div>
      </div>
    </div>
  );
}
