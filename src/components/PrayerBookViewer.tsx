"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, FileText, HelpCircle, Lock, Maximize2, Minimize2, MoveVertical, SlidersHorizontal, X } from "lucide-react";
import { Eyebrow, Reveal } from "./ui";

const TOTAL_PAGES = 208;
const BASE_PDF_PATH = "/assets/asalatu-nadwat-prayer-book.pdf";

const getPageContent = (page: number) => {
  const customPages: Record<number, { title: string; arabic: string; transliteration: string; translation: string }> = {
    1: {
      title: "Opening — Bismillāhir-Rahmānir-Rahīm",
      arabic: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      transliteration: "Bismillāhir-Rahmānir-Rahīm",
      translation: "In the name of Allah, the Most Gracious, the Most Merciful. We open this gathering with His praise alone.",
    },
    2: {
      title: "The Gathering Dhikr — Yaa Lateef",
      arabic: "يَا لَطِيفُ يَا لَطِيفُ يَا لَطِيفُ",
      transliteration: "Yaa Lateef, Yaa Lateef, Yaa Lateef",
      translation: "O Most Kind, O Most Subtle — be gentle with us in all that destiny brings, seen and unseen.",
    },
    3: {
      title: "Du‘ā for Relief and Sufficiency",
      arabic: "اَللَّٰهُمَّ ٱكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
      transliteration: "Allāhumma-kfinī bi-halālika ‘an harāmika wa-aghninī bi-fadlika ‘amman siwāk",
      translation: "O Allah, suffice us with what is lawful, and enrich us by Your favour from need of any besides You.",
    },
    4: {
      title: "Supplication for Goodness in Both Worlds",
      arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      transliteration: "Rabbanā ātinā fid-dunyā hasanatan wa-fil-ākhirati hasanatan wa-qinā ‘adhāban-nār",
      translation: "Our Lord, grant us good in this world and good in the Hereafter, and shield us from the punishment of the Fire.",
    },
  };

  if (customPages[page]) return customPages[page];

  return {
    title: `Asalatu Nadwat Prayer Book — Supplication Page ${page}`,
    arabic: page % 2 === 0 ? "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ • يَا لَطِيفُ" : "أَسْتَغْفِرُ ٱللَّٰهَ ٱلْعَظِيمَ وَأَتُوبُ إِلَيْهِ",
    transliteration: `Official Asalatu Nadwat Supplications — Page ${page} of ${TOTAL_PAGES}`,
    translation: `Page ${page} of the official 208-page Asalatu Nadwat prayer book. Click "Open Fullscreen Reader" to view the exact high-resolution PDF page.`,
  };
};

export default function PrayerBookViewer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState("1");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructionOverlay, setShowInstructionOverlay] = useState(false);

  const modalIframeRef = useRef<HTMLIFrameElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);
  const modalActiveBtnRef = useRef<HTMLButtonElement>(null);

  const goToPage = (page: number) => {
    const clamped = Math.max(1, Math.min(TOTAL_PAGES, page));
    setCurrentPage(clamped);
    setInputPage(String(clamped));
  };

  useEffect(() => {
    const targetUrl = `${BASE_PDF_PATH}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=1`;

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

    if (activeBtnRef.current) {
      activeBtnRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
    if (modalActiveBtnRef.current) {
      modalActiveBtnRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [currentPage, isFullscreen]);

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

  const pdfSrc = `${BASE_PDF_PATH}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=1`;
  const activeContent = getPageContent(currentPage);

  return (
    <section id="prayer-book" className="border-t border-ink/10 bg-cream">
      <div className="mx-auto max-w-7xl px-3.5 py-8 xs:px-5 sm:px-6 sm:py-16 md:py-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
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
                  Read the complete 208-page official Nadwat prayer book. Browse supplications right on your screen or open the full-screen reader.
                </p>
              </Reveal>

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

                  <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-3 border-t border-ink/10 text-xs">
                    <span className="text-[11px] font-semibold text-faded mr-1">Quick Jump:</span>
                    {[1, 25, 50, 75, 100, 150, 208].map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={(e) => { e.preventDefault(); goToPage(p); }}
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
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  className="flex w-full items-center justify-center gap-2 bg-pine px-4 py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-ink transition-all shadow-md rounded-lg touch-manipulation min-h-[44px]"
                >
                  <Maximize2 className="h-4 w-4 text-sage" />
                  <span>Open Fullscreen PDF Reader</span>
                </button>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <div className="border border-ink/15 bg-white shadow-xl rounded-2xl overflow-hidden relative flex flex-col justify-between min-h-[480px] xs:min-h-[520px]">
                
                <div className="bg-pine text-white px-4 py-3 sm:px-6 sm:py-4 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-sage shrink-0" />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-sage block">
                        Digital Supplication Card
                      </span>
                      <span className="text-[11px] text-white/70 font-mono">
                        Page {currentPage} of {TOTAL_PAGES}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFullscreen(true)}
                    className="inline-flex items-center justify-center gap-1.5 bg-vivid hover:bg-vivid-deep text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm touch-manipulation"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>Open Fullscreen Reader</span>
                  </button>
                </div>

                <div className="border-b border-ink/10 bg-mist px-3 py-2 sm:px-4 flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-faded shrink-0">
                    Pages:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin max-w-full touch-pan-x">
                    {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
                      <button
                        type="button"
                        key={p}
                        ref={currentPage === p ? activeBtnRef : null}
                        onClick={(e) => { e.preventDefault(); goToPage(p); }}
                        className={`h-8 min-w-8 sm:h-7 sm:min-w-7 px-2 flex items-center justify-center rounded text-xs font-mono transition-all shrink-0 touch-manipulation ${
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

                <div className="p-5 xs:p-6 sm:p-10 flex-1 flex flex-col justify-center text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-fern block">
                    {activeContent.title}
                  </span>
                  <p lang="ar" className="font-arabic mt-6 text-2xl xs:text-3xl sm:text-4xl leading-loose text-pine px-2 select-all">
                    {activeContent.arabic}
                  </p>
                  <p className="mt-6 text-sm xs:text-base font-semibold text-ink/90 italic max-w-lg mx-auto">
                    "{activeContent.transliteration}"
                  </p>
                  <p className="mt-4 text-xs xs:text-sm leading-relaxed text-faded max-w-xl mx-auto border-t border-ink/10 pt-4">
                    {activeContent.translation}
                  </p>
                </div>

                <div className="bg-cream border-t border-ink/10 px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); goToPage(currentPage - 1); }}
                    disabled={currentPage <= 1}
                    className="inline-flex items-center gap-1.5 bg-white border border-ink/20 px-3.5 py-2 sm:px-4 font-semibold text-ink rounded-lg disabled:opacity-30 touch-manipulation hover:bg-mist transition-all shadow-sm min-h-[38px]"
                  >
                    <ChevronLeft className="h-4 w-4 text-pine" />
                    <span>Previous Page</span>
                  </button>

                  <div className="font-mono text-xs font-semibold text-pine bg-pine/10 px-3 py-1.5 rounded-full">
                    Page <strong className="text-pine">{currentPage}</strong> / {TOTAL_PAGES}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); goToPage(currentPage + 1); }}
                    disabled={currentPage >= TOTAL_PAGES}
                    className="inline-flex items-center gap-1.5 bg-vivid px-3.5 py-2 sm:px-4 font-semibold text-white rounded-lg disabled:opacity-30 touch-manipulation hover:bg-vivid-deep transition-all shadow-sm min-h-[38px]"
                  >
                    <span>Next Page</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-md p-1.5 sm:p-4 md:p-6"
          >
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

              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1 rounded-lg">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); goToPage(currentPage - 1); }}
                  disabled={currentPage <= 1}
                  className="p-1 hover:text-sage disabled:opacity-30 transition-colors touch-manipulation"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-mono text-[11px] sm:text-xs font-semibold">
                  {currentPage} / {TOTAL_PAGES}
                </span>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); goToPage(currentPage + 1); }}
                  disabled={currentPage >= TOTAL_PAGES}
                  className="p-1 hover:text-sage disabled:opacity-30 transition-colors touch-manipulation"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="inline-flex items-center gap-1.5 bg-vivid px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white hover:bg-vivid-deep transition-all rounded-lg touch-manipulation"
              >
                <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Exit Fullscreen</span>
                <span className="inline xs:hidden">Exit</span>
              </button>
            </div>

            <div className="bg-slate-800 px-3 py-1.5 sm:px-4 flex items-center gap-2 border-b border-white/10">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/60 shrink-0">
                Jump:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin max-w-full touch-pan-x">
                {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
                  <button
                    type="button"
                    key={p}
                    ref={currentPage === p ? modalActiveBtnRef : null}
                    onClick={(e) => { e.preventDefault(); goToPage(p); }}
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

            <div
              onContextMenu={(e) => e.preventDefault()}
              className="relative flex-1 w-full h-full min-h-0 bg-slate-900 select-none rounded-b-xl overflow-hidden"
            >
              <iframe
                ref={modalIframeRef}
                src={pdfSrc}
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
