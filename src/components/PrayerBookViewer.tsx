"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight, FileText, Lock, Maximize2, Minimize2, Eye } from "lucide-react";
import { PRAYER_PAGES } from "@/lib/site";
import { Eyebrow, Reveal, TiltCard } from "./ui";

const PDF_PATH = "/assets/asalatu-nadwat-prayer-book.pdf#toolbar=0&navpanes=0&scrollbar=1";

export default function PrayerBookViewer() {
  const [viewMode, setViewMode] = useState<"pdf" | "interactive">("pdf");
  const [page, setPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const total = PRAYER_PAGES.length;
  const doc = PRAYER_PAGES[page - 1];

  return (
    <section id="prayer-book" className="border-t border-ink/10 bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Column: Information & View Mode Switcher */}
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow>09 — Prayer book</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display text-balance mt-5 text-4xl leading-tight font-light tracking-tight text-ink sm:text-5xl">
                Read the official prayer book
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 text-[15px] leading-relaxed text-faded">
                The official Asalatu Nadwat prayer book is provided below for complete online reading.
                Reading is preserved strictly inside the site so the text maintains its sacred accuracy.
              </p>
            </Reveal>

            {/* View Mode Toggle */}
            <Reveal delay={0.15}>
              <div className="mt-8 border border-ink/15 bg-white p-2 rounded-lg shadow-sm flex flex-col gap-2">
                <button
                  onClick={() => setViewMode("pdf")}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all rounded ${
                    viewMode === "pdf"
                      ? "bg-pine text-white shadow-sm"
                      : "text-ink/70 hover:bg-mist hover:text-ink"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-sage" />
                    <span>Official PDF Book (View Only)</span>
                  </span>
                  <Eye className="h-4 w-4 opacity-75" />
                </button>

                <button
                  onClick={() => setViewMode("interactive")}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all rounded ${
                    viewMode === "interactive"
                      ? "bg-pine text-white shadow-sm"
                      : "text-ink/70 hover:bg-mist hover:text-ink"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen className="h-4 w-4 text-sage" />
                    <span>Interactive Supplications</span>
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-75" />
                </button>
              </div>
            </Reveal>

            {/* Protection Notice */}
            <Reveal delay={0.18}>
              <div className="mt-6 flex items-start gap-3 border border-fern/30 bg-fern/5 p-4 rounded-lg text-xs text-pine">
                <Lock className="h-4 w-4 shrink-0 text-fern mt-0.5" />
                <div>
                  <span className="font-semibold block text-ink">Read-Only Document</span>
                  <span>This PDF document is enabled for on-screen reading only. Downloads and printing have been restricted to preserve the original publication.</span>
                </div>
              </div>
            </Reveal>

            {/* Interactive Index */}
            {viewMode === "interactive" && (
              <Reveal delay={0.22}>
                <ol className="mt-6 space-y-1">
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
            )}
          </div>

          {/* Right Column: PDF Viewer or Interactive Cards */}
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              {viewMode === "pdf" ? (
                <div className="border border-ink/15 bg-white shadow-[0_30px_60px_-40px_rgba(10,46,35,0.35)] rounded-lg overflow-hidden">
                  {/* PDF Reader Header Bar */}
                  <div className="flex items-center justify-between border-b border-ink/10 bg-pine px-6 py-4 text-white">
                    <span className="inline-flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.24em] text-sage">
                      <FileText className="h-4 w-4 text-sage" /> Official Asalatu Nadwat PDF Book
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-white/70 bg-white/10 px-2.5 py-1 rounded">
                        <Lock className="h-3 w-3 text-sage" /> View-Only Mode
                      </span>
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="inline-flex items-center gap-1.5 bg-vivid px-3 py-1.5 text-xs font-semibold text-white hover:bg-vivid-deep transition-all rounded"
                      >
                        {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                        <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Full Screen Reader"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Embedded PDF iframe */}
                  <div
                    onContextMenu={(e) => e.preventDefault()}
                    className="relative w-full bg-slate-900 overflow-hidden select-none"
                    style={{ height: "760px" }}
                  >
                    <iframe
                      src={PDF_PATH}
                      className="w-full h-full border-0 select-none"
                      title="Asalatu Nadwat Official Prayer Book PDF Viewer"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-ink/10 bg-cream px-6 py-3 text-xs text-faded">
                    <span>Asalatu Nadwat — Official Prayer Book</span>
                    <span className="font-mono">Read-Only Digital Version</span>
                  </div>
                </div>
              ) : (
                <div className="border border-ink/15 bg-white shadow-[0_30px_60px_-40px_rgba(10,46,35,0.35)] rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4 sm:px-10">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-fern">
                      <BookOpen className="h-4 w-4" /> Nadwat Supplications Guide
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
              )}
            </Reveal>
          </div>
        </div>
      </div>

      {/* Fullscreen PDF Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-md p-4 sm:p-6"
          >
            <div className="flex items-center justify-between bg-pine px-6 py-4 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-sage" />
                <span className="font-display text-lg font-light">Asalatu Nadwat — Official Prayer Book</span>
                <span className="hidden sm:inline-block text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-white/80">Read Only</span>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="inline-flex items-center gap-2 bg-vivid px-4 py-2 text-xs font-semibold text-white hover:bg-vivid-deep transition-all rounded"
              >
                <Minimize2 className="h-4 w-4" /> Exit Fullscreen
              </button>
            </div>
            <div
              onContextMenu={(e) => e.preventDefault()}
              className="relative flex-1 w-full bg-slate-900 select-none rounded-b-lg overflow-hidden"
            >
              <iframe
                src={PDF_PATH}
                className="w-full h-full border-0 select-none"
                title="Fullscreen Asalatu Nadwat PDF Viewer"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
