"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, FileText, Lock, Maximize2, Minimize2, Search, SlidersHorizontal } from "lucide-react";
import { Eyebrow, Reveal } from "./ui";

const TOTAL_PAGES = 208;

export default function PrayerBookViewer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState("1");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToPage = (page: number) => {
    const clamped = Math.max(1, Math.min(TOTAL_PAGES, page));
    setCurrentPage(clamped);
    setInputPage(String(clamped));
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(inputPage, 10);
    if (!isNaN(p)) {
      goToPage(p);
    }
  };

  const pdfSrc = `/assets/asalatu-nadwat-prayer-book.pdf#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=1`;

  return (
    <section id="prayer-book" className="border-t border-ink/10 bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Column: Information & Page Selector */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Reveal>
                <Eyebrow>09 — Prayer book</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="font-display text-balance mt-5 text-4xl leading-tight font-light tracking-tight text-ink sm:text-5xl">
                  Official Asalatu Prayer Book
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-5 text-[15px] leading-relaxed text-faded">
                  Read the complete 208-page official Nadwat prayer book right inside your browser. Use the page controls, swipe strip, or jump to any page.
                </p>
              </Reveal>

              {/* Jump to Page Box */}
              <Reveal delay={0.16}>
                <div className="mt-8 border border-ink/15 bg-white p-5 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-fern flex items-center gap-1.5">
                      <SlidersHorizontal className="h-4 w-4" /> Go to Page
                    </span>
                    <span className="font-mono text-xs font-semibold text-pine bg-pine/10 px-2.5 py-1 rounded-full">
                      Page {currentPage} of {TOTAL_PAGES}
                    </span>
                  </div>

                  {/* Direct Page Input Form */}
                  <form onSubmit={handleInputSubmit} className="mt-4 flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min={1}
                        max={TOTAL_PAGES}
                        value={inputPage}
                        onChange={(e) => setInputPage(e.target.value)}
                        placeholder="Page #"
                        className="w-full rounded-lg border border-ink/20 bg-mist px-3.5 py-2.5 text-sm font-semibold text-ink focus:border-pine focus:bg-white focus:outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-faded">
                        / {TOTAL_PAGES}
                      </span>
                    </div>
                    <button
                      type="submit"
                      className="bg-vivid px-4 py-2.5 text-xs font-semibold text-white rounded-lg hover:bg-vivid-deep transition-colors shadow-sm"
                    >
                      Jump
                    </button>
                  </form>

                  {/* Dropdown Quick Select */}
                  <div className="mt-3">
                    <label htmlFor="page-select-dropdown" className="sr-only">Select Page</label>
                    <select
                      id="page-select-dropdown"
                      value={currentPage}
                      onChange={(e) => goToPage(Number(e.target.value))}
                      className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-xs font-medium text-ink focus:border-pine focus:outline-none"
                    >
                      {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
                        <option key={p} value={p}>
                          Page {p} of {TOTAL_PAGES}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Jump Shortcuts */}
                  <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-ink/10 text-xs">
                    <span className="text-[11px] font-semibold text-faded mr-1">Quick Jump:</span>
                    {[1, 25, 50, 75, 100, 150, 208].map((p) => (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
                          currentPage === p
                            ? "bg-pine text-white font-bold"
                            : "bg-mist text-ink/70 hover:bg-pine/10 hover:text-pine"
                        }`}
                      >
                        p.{p}
                      </button>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Protection Notice */}
              <Reveal delay={0.2}>
                <div className="mt-6 flex items-start gap-3 border border-fern/30 bg-fern/5 p-4 rounded-lg text-xs text-pine shadow-sm">
                  <Lock className="h-4 w-4 shrink-0 text-fern mt-0.5" />
                  <div>
                    <span className="font-semibold block text-ink">Read-Only Official Book</span>
                    <span className="text-[11px] leading-relaxed text-faded">
                      On-screen reading enabled. Downloads and printing are disabled to preserve accuracy.
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.24}>
              <button
                onClick={() => setIsFullscreen(true)}
                className="mt-6 flex w-full items-center justify-center gap-2.5 bg-pine px-6 py-3.5 text-sm font-semibold text-white hover:bg-ink transition-all shadow-md rounded-lg"
              >
                <Maximize2 className="h-4 w-4 text-sage" />
                <span>Open Fullscreen Reader</span>
              </button>
            </Reveal>
          </div>

          {/* Right Column: PDF Reader + Flip Navigation Bar */}
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <div className="border border-ink/15 bg-white shadow-[0_30px_60px_-40px_rgba(10,46,35,0.35)] rounded-xl overflow-hidden">
                {/* Header Control Bar */}
                <div className="flex flex-wrap items-center justify-between border-b border-ink/10 bg-pine px-5 py-3.5 text-white gap-3">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-sage" />
                    <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-sage">
                      Asalatu Nadwat PDF
                    </span>
                  </div>

                  {/* Center Flip Controls */}
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                      aria-label="Previous Page"
                      className="p-1 hover:text-sage disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="font-mono text-xs font-semibold px-1">
                      Page <strong className="text-sage">{currentPage}</strong> / {TOTAL_PAGES}
                    </span>
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= TOTAL_PAGES}
                      aria-label="Next Page"
                      className="p-1 hover:text-sage disabled:opacity-30 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="inline-flex items-center gap-1.5 bg-vivid px-3 py-1.5 text-xs font-semibold text-white hover:bg-vivid-deep transition-all rounded"
                  >
                    {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Full Screen Reader"}</span>
                  </button>
                </div>

                {/* Horizontal Swipeable / Scrollable Page Strip */}
                <div className="border-b border-ink/10 bg-mist px-4 py-2 flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-faded shrink-0">
                    Pages:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin max-w-full">
                    {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`h-7 min-w-7 px-2 flex items-center justify-center rounded text-xs font-mono transition-all shrink-0 ${
                          currentPage === p
                            ? "bg-vivid text-white font-bold scale-105 shadow-sm"
                            : "bg-white text-ink/70 hover:bg-pine/10 hover:text-pine border border-ink/10"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Embedded PDF iframe */}
                <div
                  onContextMenu={(e) => e.preventDefault()}
                  className="relative w-full bg-slate-900 overflow-hidden select-none"
                  style={{ height: "760px" }}
                >
                  <iframe
                    key={currentPage}
                    src={pdfSrc}
                    className="w-full h-full border-0 select-none"
                    title={`Asalatu Nadwat Official Prayer Book PDF Viewer - Page ${currentPage}`}
                  />
                </div>

                {/* Bottom Navigation Flip Bar */}
                <div className="flex items-center justify-between border-t border-ink/10 bg-cream px-6 py-3.5 text-xs text-ink">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="inline-flex items-center gap-1.5 bg-white border border-ink/20 px-4 py-2 font-semibold rounded hover:bg-mist hover:border-pine disabled:opacity-30 transition-all shadow-sm"
                  >
                    <ChevronLeft className="h-4 w-4 text-pine" /> Previous Page
                  </button>

                  <div className="font-mono text-xs text-faded flex items-center gap-1">
                    <span>Reading Page</span>
                    <span className="font-bold text-pine">{currentPage}</span>
                    <span>of</span>
                    <span className="font-bold text-ink">{TOTAL_PAGES}</span>
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= TOTAL_PAGES}
                    className="inline-flex items-center gap-1.5 bg-vivid px-4 py-2 font-semibold text-white rounded hover:bg-vivid-deep disabled:opacity-30 transition-all shadow-sm"
                  >
                    Next Page <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Fullscreen PDF Reader Modal with Flip & Selector */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-md p-3 sm:p-6"
          >
            {/* Modal Header Controls */}
            <div className="flex flex-wrap items-center justify-between bg-pine px-6 py-3.5 text-white rounded-t-xl gap-3">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-sage" />
                <span className="font-display text-lg font-light">Asalatu Nadwat — Official Prayer Book</span>
                <span className="hidden sm:inline-block text-xs font-mono bg-white/10 px-2.5 py-0.5 rounded text-white/80">
                  Page {currentPage} of {TOTAL_PAGES}
                </span>
              </div>

              {/* Fullscreen Flip Buttons */}
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="p-1 hover:text-sage disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-mono text-xs font-semibold">
                  {currentPage} / {TOTAL_PAGES}
                </span>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= TOTAL_PAGES}
                  className="p-1 hover:text-sage disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => setIsFullscreen(false)}
                className="inline-flex items-center gap-2 bg-vivid px-4 py-2 text-xs font-semibold text-white hover:bg-vivid-deep transition-all rounded-lg"
              >
                <Minimize2 className="h-4 w-4" /> Exit Fullscreen
              </button>
            </div>

            {/* Modal Swipeable Strip */}
            <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/60 shrink-0">
                Jump Page:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin max-w-full">
                {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`h-7 min-w-7 px-2 flex items-center justify-center rounded text-xs font-mono transition-all shrink-0 ${
                      currentPage === p
                        ? "bg-vivid text-white font-bold scale-105"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Iframe */}
            <div
              onContextMenu={(e) => e.preventDefault()}
              className="relative flex-1 w-full bg-slate-900 select-none rounded-b-xl overflow-hidden"
            >
              <iframe
                key={currentPage}
                src={pdfSrc}
                className="w-full h-full border-0 select-none"
                title={`Fullscreen Asalatu Nadwat PDF Viewer - Page ${currentPage}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
