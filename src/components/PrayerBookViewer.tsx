"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { PRAYER_PAGES } from "@/lib/site";
import { Eyebrow, Reveal } from "./ui";

export default function PrayerBookViewer() {
  const [page, setPage] = useState(1);
  const total = PRAYER_PAGES.length;
  const doc = PRAYER_PAGES[page - 1];

  return (
    <section id="prayer-book" className="border-t border-ink/10 bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow>09 - Prayer book</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display text-balance mt-5 text-4xl leading-tight font-light tracking-tight text-ink sm:text-5xl">
                Read the supplications here
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 text-[15px] leading-relaxed text-faded">
                The official Nadwat prayer book, set for the screen. Arabic, transliteration
                and translation on every page. Reading stays inside the site so the text keeps
                its accuracy.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <ol className="mt-8 space-y-1">
                {PRAYER_PAGES.map((p) => (
                  <li key={p.page}>
                    <button
                      onClick={() => setPage(p.page)}
                      className={`flex w-full items-center gap-4 border-l-2 px-4 py-3 text-left transition-colors ${
                        page === p.page
                          ? "border-pine bg-white"
                          : "border-ink/10 hover:border-fern hover:bg-white/60"
                      }`}
                    >
                      <span className={`font-mono text-xs ${page === p.page ? "text-pine" : "text-faded"}`}>
                        {String(p.page).padStart(2, "0")}
                      </span>
                      <span className={`text-sm font-medium ${page === p.page ? "text-ink" : "text-faded"}`}>
                        {p.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <div className="border border-ink/15 bg-white shadow-[0_30px_60px_-40px_rgba(10,46,35,0.35)]">
                <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4 sm:px-10">
                  <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-fern">
                    <BookOpen className="h-4 w-4" /> Nadwat Prayer Book
                  </span>
                  <span className="font-mono text-[12px] text-faded">
                    {page} / {total}
                  </span>
                </div>

                <div className="px-6 py-10 text-center sm:px-12 sm:py-14">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={page}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35 }}
                    >
                      <h3 className="font-display text-2xl tracking-tight text-ink sm:text-3xl">{doc.title}</h3>
                      <p lang="ar" className="font-arabic mx-auto mt-8 max-w-2xl text-3xl leading-[2] text-pine sm:text-4xl">
                        {doc.arabic}
                      </p>
                      <div className="rule-gilt mx-auto mt-8 max-w-[120px]" aria-hidden />
                      <p className="mx-auto mt-6 max-w-xl font-mono text-sm text-ink/80 italic">{doc.transliteration}</p>
                      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-faded">
                        {doc.translation}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between border-t border-ink/10 px-6 py-4 sm:px-10">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="inline-flex items-center gap-2 border border-ink/20 px-5 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-pine hover:text-pine disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                  <div className="flex gap-1.5" aria-hidden>
                    {PRAYER_PAGES.map((p) => (
                      <span key={p.page} className={`h-1 w-6 ${page >= p.page ? "bg-vivid" : "bg-ink/15"}`} />
                    ))}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(total, p + 1))}
                    disabled={page === total}
                    className="inline-flex items-center gap-2 bg-vivid px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-vivid-deep disabled:opacity-30"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
