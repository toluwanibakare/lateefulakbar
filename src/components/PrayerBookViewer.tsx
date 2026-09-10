"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, FileText, HelpCircle, Lock, Maximize2, Minimize2, MoveVertical, SlidersHorizontal, Touchpad, X } from "lucide-react";
import { Eyebrow, Reveal } from "./ui";

const TOTAL_PAGES = 208;
const BASE_PDF_PATH = "/assets/asalatu-nadwat-prayer-book.pdf";

export default function PrayerBookViewer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState("1");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructionOverlay, setShowInstructionOverlay] = useState(false);

  const mainIframeRef = useRef<HTMLIFrameElement>(null);
  const modalIframeRef = useRef<HTMLIFrameElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);
  const modalActiveBtnRef = useRef<HTMLButtonElement>(null);

  const goToPage = (page: number) => {
    const clamped = Math.max(1, Math.min(TOTAL_PAGES, page));
    setCurrentPage(clamped);
    setInputPage(String(clamped));
  };

  // Instant iframe page navigation using persistent DOM iframe without unmounting
  useEffect(() => {
    const targetUrl = `${BASE_PDF_PATH}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=1`;

    if (mainIframeRef.current) {
      try {
        if (mainIframeRef.current.contentWindow) {
          mainIframeRef.current.contentWindow.location.replace(targetUrl);
        } else {
          mainIframeRef.current.src = targetUrl;
        }
      } catch {
        mainIframeRef.current.src = targetUrl;
      }
    }

    if (modalIframeRef.current) {
      try {
        if (modalIframeRef.current.contentWindow) {
          modalIframeRef.current.contentWindow.location.replace(targetUrl);
        } else {
          modalIframeRef.current.src = targetUrl;
        }
      } catch {
        modalIframeRef.current.src = targetUrl;
      }
    }

    // Auto-scroll active page button into view inside horizontal strip
    if (activeBtnRef.current) {
      activeBtnRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
    if (modalActiveBtnRef.current) {
      modalActiveBtnRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [currentPage, isFullscreen]);

  // Keyboard left/right arrow navigation & Escape dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowInstructionOverlay(false);
        setIsFullscreen(false);
      }
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "SELECT") return;
      if (e.key === "ArrowLeft") {
        goToPage(currentPage - 1);
      } else if (e.key === "ArrowRight") {
        goToPage(currentPage + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage]);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(inputPage, 10);
    if (!isNaN(p)) {
      goToPage(p);
    }
  };

  const initialPdfSrc = `${BASE_PDF_PATH}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=1`;

  return (
    <section id="prayer-book" className="border-t border-ink/10 bg-cream">
      <div className="mx-auto max-w-7xl px-3.5 py-8 xs:px-5 sm:px-6 sm:py-16 md:py-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Information & Page Selector */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              <Reveal>
                <Eyebrow>09 — Prayer book</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="font-display text-balance mt-3 sm:mt-5 text-2xl xs:text-3xl leading-tight font-light tracking-tight text-ink sm:text-4xl">
                  Official Asalatu Prayer Book
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-3 text-xs xs:text-sm sm:text-[15px] leading-relaxed text-faded">
                  Read the complete 208-page official Nadwat prayer book right inside your browser. Optimized for both mobile devices and desktop screens.
                </p>
              </Reveal>

              {/* Prayer Book Cover Image Card */}
              <Reveal delay={0.14}>
                <div className="relative mt-4 overflow-hidden rounded-xl border border-ink/15 shadow-md group aspect-[3/4] max-w-[180px] xs:max-w-[200px] sm:max-w-[220px] mx-auto lg:mx-0">
                  <Image
                    src="/assets/prayerbook_cover.png"
                    alt="Asalatu Nadwat Prayer Book Cover"
                    fill
                    sizes="(max-width: 768px) 200px, 240px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">Prayer Book Cover</span>
                    <span className="text-xs font-semibold text-white/90">208 Pages • Read-Only</span>
                  </div>
                </div>
              </Reveal>

              {/* Jump to Page Box */}
              <Reveal delay={0.16}>
                <div className="mt-5 border border-ink/15 bg-white p-3.5 xs:p-4 sm:p-5 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-fern flex items-center gap-1.5">
                      <SlidersHorizontal className="h-4 w-4" /> Go to Page
                    </span>
                    <span className="font-mono text-xs font-semibold text-pine bg-pine/10 px-2.5 py-1 rounded-full">
                      Page {currentPage} / {TOTAL_PAGES}
                    </span>
                  </div>

                  {/* Direct Page Input Form */}
                  <form onSubmit={handleInputSubmit} className="mt-3 flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min={1}
                        max={TOTAL_PAGES}
                        value={inputPage}
                        onChange={(e) => setInputPage(e.target.value)}
                        placeholder="Page #"
                        className="w-full rounded-lg border border-ink/20 bg-mist px-3 py-2 text-base sm:text-sm font-semibold text-ink focus:border-pine focus:bg-white focus:outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-faded">
                        / {TOTAL_PAGES}
                      </span>
                    </div>
                    <button
                      type="submit"
                      className="bg-vivid px-4 py-2 text-xs font-semibold text-white rounded-lg hover:bg-vivid-deep transition-colors shadow-sm min-h-[40px] touch-manipulation"
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
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-3 border-t border-ink/10 text-xs">
                    <span className="text-[11px] font-semibold text-faded mr-1">Quick Jump:</span>
                    {[1, 25, 50, 75, 100, 150, 208].map((p) => (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors touch-manipulation ${
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
                <div className="mt-4 flex items-start gap-2.5 border border-fern/30 bg-fern/5 p-3 sm:p-4 rounded-lg text-xs text-pine shadow-sm">
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
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="flex w-full items-center justify-center gap-2 bg-pine px-4 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-ink transition-all shadow-md rounded-lg touch-manipulation min-h-[44px]"
                >
                  <Maximize2 className="h-4 w-4 text-sage" />
                  <span>Open Fullscreen Reader</span>
                </button>
                <button
                  onClick={() => setShowInstructionOverlay(true)}
                  className="flex w-full items-center justify-center gap-2 border border-ink/20 bg-white px-4 py-2.5 text-xs font-semibold text-ink hover:border-pine hover:text-pine transition-all rounded-lg touch-manipulation min-h-[44px]"
                >
                  <HelpCircle className="h-4 w-4 text-fern" />
                  <span>How to Swipe & Scroll Book</span>
                </button>
              </div>
            </Reveal>
          </div>

          {/* Right Column: PDF Document Reader */}
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <div className="border border-ink/15 bg-white shadow-[0_30px_60px_-40px_rgba(10,46,35,0.35)] rounded-xl overflow-hidden relative">
                {/* Header Control Bar */}
                <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between border-b border-ink/10 bg-pine px-3 py-2.5 sm:px-5 sm:py-3.5 text-white gap-2">
                  <div className="flex items-center justify-between xs:justify-start gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-sage shrink-0" />
                      <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.16em] text-sage truncate">
                        Asalatu Nadwat PDF
                      </span>
                    </div>
                    <button
                      onClick={() => setIsFullscreen(true)}
                      className="inline-flex xs:hidden items-center gap-1 bg-vivid px-2.5 py-1 text-[11px] font-semibold text-white rounded"
                    >
                      <Maximize2 className="h-3 w-3" /> Fullscreen
                    </button>
                  </div>

                  {/* Center Flip Controls */}
                  <div className="flex items-center justify-center gap-2 bg-white/10 px-2.5 py-1 rounded-lg">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                      aria-label="Previous Page"
                      className="p-1 hover:text-sage disabled:opacity-30 transition-colors touch-manipulation"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="font-mono text-[11px] sm:text-xs font-semibold px-1">
                      Page <strong className="text-sage">{currentPage}</strong> / {TOTAL_PAGES}
                    </span>
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= TOTAL_PAGES}
                      aria-label="Next Page"
                      className="p-1 hover:text-sage disabled:opacity-30 transition-colors touch-manipulation"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="hidden xs:flex items-center gap-1.5">
                    <button
                      onClick={() => setShowInstructionOverlay(true)}
                      className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/20 transition-all rounded touch-manipulation"
                      title="Show Guide"
                    >
                      <HelpCircle className="h-3.5 w-3.5 text-sage" />
                      <span>Guide</span>
                    </button>
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="inline-flex items-center gap-1.5 bg-vivid px-3 py-1.5 text-xs font-semibold text-white hover:bg-vivid-deep transition-all rounded touch-manipulation"
                    >
                      {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                      <span>{isFullscreen ? "Exit" : "Fullscreen"}</span>
                    </button>
                  </div>
                </div>

                  {/* Horizontal Swipeable / Scrollable Page Strip */}
                  <div className="border-b border-ink/10 bg-mist px-3 py-2 flex items-center gap-2">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-faded shrink-0">
                      Pages:
                    </span>
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin max-w-full touch-pan-x">
                      {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          ref={currentPage === p ? activeBtnRef : null}
                          onClick={() => goToPage(p)}
                          className={`h-7 min-w-7 px-2 flex items-center justify-center rounded text-xs font-mono transition-all shrink-0 touch-manipulation ${
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

                  {/* Embedded PDF iframe & Container */}
                  <div
                    onContextMenu={(e) => e.preventDefault()}
                    className="relative w-full h-[440px] xs:h-[540px] sm:h-[680px] lg:h-[760px] bg-slate-900 overflow-hidden select-none"
                  >
                    <iframe
                      ref={mainIframeRef}
                      src={initialPdfSrc}
                      className="w-full h-full border-0 select-none"
                      title="Asalatu Nadwat Official Prayer Book PDF Viewer"
                    />

                    {/* Dimmed Overlay Guide Modal inside the PDF Reader */}
                    <AnimatePresence>
                      {showInstructionOverlay && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setShowInstructionOverlay(false)}
                          className="absolute inset-0 z-30 flex items-center justify-center bg-ink/85 backdrop-blur-md p-3 sm:p-6 cursor-pointer text-white"
                        >
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-md w-full bg-pine border border-white/20 p-4 xs:p-5 sm:p-8 rounded-2xl shadow-2xl text-center max-h-[90vh] overflow-y-auto"
                          >
                            <button
                              onClick={() => setShowInstructionOverlay(false)}
                              className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
                              aria-label="Close guide"
                            >
                              <X className="h-5 w-5" />
                            </button>

                            {/* Animated Vertical Swipe/Scroll Gesture Icon */}
                            <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-vivid/20 border border-vivid/40">
                              <motion.div
                                animate={{ y: [-12, 12, -12], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="flex flex-col items-center text-sage"
                              >
                                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 rotate-90" />
                                <MoveVertical className="h-5 w-5 sm:h-6 sm:w-6 my-[-4px]" />
                                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 rotate-90" />
                              </motion.div>
                            </div>

                            <h3 className="font-display mt-4 text-xl sm:text-2xl font-light text-white tracking-tight">
                              Swipe & Scroll to Read
                            </h3>
                            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/85">
                              Scroll or swipe up/down inside the book to turn pages smoothly, or use the page bar and jump input above.
                            </p>

                            <div className="mt-4 grid grid-cols-3 gap-2 text-left text-[10px] sm:text-[11px] border-t border-white/15 pt-3.5 text-white/80">
                              <div className="flex flex-col items-center text-center">
                                <span className="text-sm sm:text-base">👆</span>
                                <span className="mt-1 font-semibold">Swipe / Scroll</span>
                                <span className="text-[9px] sm:text-[10px] text-white/60">inside reader</span>
                              </div>
                              <div className="flex flex-col items-center text-center">
                                <span className="text-sm sm:text-base">🔢</span>
                                <span className="mt-1 font-semibold">Page Bar</span>
                                <span className="text-[9px] sm:text-[10px] text-white/60">tap page #</span>
                              </div>
                              <div className="flex flex-col items-center text-center">
                                <span className="text-sm sm:text-base">↔️</span>
                                <span className="mt-1 font-semibold">Arrow Keys</span>
                                <span className="text-[9px] sm:text-[10px] text-white/60">left / right</span>
                              </div>
                            </div>

                            <button
                              onClick={() => setShowInstructionOverlay(false)}
                              className="mt-5 w-full bg-vivid py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white rounded-lg hover:bg-vivid-deep transition-all shadow-lg touch-manipulation"
                            >
                              Got It — Start Reading
                            </button>
                            <p className="mt-2 text-[10px] sm:text-[11px] text-white/50">Tap anywhere or press Esc to close</p>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bottom Navigation Flip Bar */}
                  <div className="flex items-center justify-between border-t border-ink/10 bg-cream px-3 py-2.5 sm:px-6 sm:py-3.5 text-xs text-ink gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="inline-flex items-center gap-1 sm:gap-1.5 bg-white border border-ink/20 px-3 py-2 sm:px-4 font-semibold rounded hover:bg-mist hover:border-pine disabled:opacity-30 transition-all shadow-sm touch-manipulation min-h-[38px]"
                    >
                      <ChevronLeft className="h-4 w-4 text-pine" />
                      <span className="hidden sm:inline">Previous Page</span>
                      <span className="inline sm:hidden">Prev</span>
                    </button>

                    <div className="font-mono text-[11px] sm:text-xs text-faded flex items-center gap-1">
                      <span className="hidden xs:inline">Reading</span>
                      <span>Page</span>
                      <span className="font-bold text-pine">{currentPage}</span>
                      <span>/</span>
                      <span className="font-bold text-ink">{TOTAL_PAGES}</span>
                    </div>

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= TOTAL_PAGES}
                      className="inline-flex items-center gap-1 sm:gap-1.5 bg-vivid px-3 py-2 sm:px-4 font-semibold text-white rounded hover:bg-vivid-deep disabled:opacity-30 transition-all shadow-sm touch-manipulation min-h-[38px]"
                    >
                      <span className="hidden sm:inline">Next Page</span>
                      <span className="inline sm:hidden">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Fullscreen PDF Reader Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-md p-1.5 sm:p-4 md:p-6"
          >
            {/* Modal Header Controls */}
            <div className="flex flex-wrap items-center justify-between bg-pine px-3 py-2 sm:px-6 sm:py-3.5 text-white rounded-t-xl gap-2">
              <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-sage shrink-0" />
                <span className="font-display text-xs sm:text-lg font-light truncate max-w-[140px] xs:max-w-[240px] sm:max-w-none">
                  Asalatu Nadwat — Prayer Book
                </span>
                <span className="hidden sm:inline-block text-xs font-mono bg-white/10 px-2.5 py-0.5 rounded text-white/80">
                  Page {currentPage} of {TOTAL_PAGES}
                </span>
              </div>

              {/* Fullscreen Flip Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1 rounded-lg">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="p-1 hover:text-sage disabled:opacity-30 transition-colors touch-manipulation"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-mono text-[11px] sm:text-xs font-semibold">
                  {currentPage} / {TOTAL_PAGES}
                </span>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= TOTAL_PAGES}
                  className="p-1 hover:text-sage disabled:opacity-30 transition-colors touch-manipulation"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => setIsFullscreen(false)}
                className="inline-flex items-center gap-1.5 bg-vivid px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white hover:bg-vivid-deep transition-all rounded-lg touch-manipulation"
              >
                <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Exit Fullscreen</span>
                <span className="inline xs:hidden">Exit</span>
              </button>
            </div>

            {/* Modal Swipeable Strip */}
            <div className="bg-slate-800 px-3 py-1.5 sm:px-4 flex items-center gap-2 border-b border-white/10">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/60 shrink-0">
                Jump:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin max-w-full touch-pan-x">
                {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    ref={currentPage === p ? modalActiveBtnRef : null}
                    onClick={() => goToPage(p)}
                    className={`h-7 min-w-7 px-2 flex items-center justify-center rounded text-xs font-mono transition-all shrink-0 touch-manipulation ${
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

            {/* Modal Iframe (Persistent Node) */}
            <div
              onContextMenu={(e) => e.preventDefault()}
              className="relative flex-1 w-full h-full min-h-0 bg-slate-900 select-none rounded-b-xl overflow-hidden"
            >
              <iframe
                ref={modalIframeRef}
                src={initialPdfSrc}
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
