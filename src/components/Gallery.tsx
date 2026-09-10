"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Expand, ExternalLink, X } from "lucide-react";
import { GALLERY, type GalleryItem } from "@/lib/site";
import { Eyebrow, FadeIn, TiltCard } from "./ui";

const FILTERS = ["All", "Gathering", "People", "Atmosphere", "Drone"] as const;

export default function Gallery() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [active, setActive] = useState<GalleryItem | null>(null);

  const items = GALLERY.filter((g) => filter === "All" || g.category === filter);

  return (
    <section id="gallery" className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
        <FadeIn direction="up">
          <Eyebrow>05 - The archive</Eyebrow>
        </FadeIn>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <FadeIn direction="right" delay={0.06}>
            <h2 className="font-display text-balance max-w-2xl text-4xl leading-tight font-light tracking-tight text-ink sm:text-5xl">
              Previous seatings, kept as they were
            </h2>
          </FadeIn>
          <FadeIn direction="left" delay={0.12}>
            <p className="max-w-sm text-sm leading-relaxed text-faded">
              Fifteen frames from the Square. No staging, no stock. Select any image to view it
              full screen.
            </p>
          </FadeIn>
        </div>

        <FadeIn direction="up" delay={0.16}>
          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter gallery">
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`relative px-4 py-2 text-[12px] font-semibold tracking-wide transition-all ${
                  filter === f
                    ? "bg-vivid text-white shadow-md scale-105"
                    : "border border-ink/15 text-ink/70 hover:border-pine hover:text-pine"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </FadeIn>

        <motion.div layout className="mt-8 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
          <AnimatePresence mode="popLayout">
            {items.map((g) => (
              <motion.figure
                layout
                key={g.src}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative break-inside-avoid overflow-hidden bg-mist"
              >
                <TiltCard>
                  <button onClick={() => setActive(g)} className="block w-full" aria-label={`View ${g.label}`}>
                    <Image
                      src={g.src}
                      alt={g.label}
                      width={800}
                      height={1000}
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="img-true h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </button>
                  <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-ink/70 to-transparent p-3 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-left text-[12px] font-medium leading-snug text-white">{g.label}</span>
                    <Expand className="h-4 w-4 shrink-0 text-white/80" />
                  </figcaption>
                </TiltCard>
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* External Pixieset Link Button at bottom of every category */}
        <FadeIn direction="up" delay={0.2}>
          <div className="mt-12 flex flex-col items-center justify-center border-t border-ink/10 pt-10 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-faded mb-3">
              Showing {items.length} archived frames in {filter}
            </p>
            <a
              href="https://nadwatmedia.pixieset.com/lateefulakbar20226/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-pine px-7 py-4 text-xs sm:text-sm font-semibold text-white rounded-xl hover:bg-ink transition-all shadow-lg group touch-manipulation"
            >
              <span>View Full Photo Gallery on Pixieset</span>
              <ExternalLink className="h-4 w-4 text-sage transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </FadeIn>
      </div>

      {/* Full screen viewer */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex flex-col bg-ink/95 p-4 backdrop-blur-md sm:p-8"
            onClick={() => setActive(null)}
          >
            <div className="flex items-center justify-between text-white">
              <p className="max-w-xl text-sm font-medium">{active.label}</p>
              <button aria-label="Close viewer" className="p-2 transition-colors hover:text-sage">
                <X className="h-6 w-6" />
              </button>
            </div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative mx-auto mt-4 w-full max-w-5xl flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={active.src} alt={active.label} fill sizes="90vw" className="object-contain" />
            </motion.div>
            <p className="mt-4 text-center text-[11px] uppercase tracking-[0.24em] text-white/50">
              {active.category} - Lateeful Ul Akbar archive
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
