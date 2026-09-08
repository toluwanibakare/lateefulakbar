"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Lock, Maximize2, Minimize2 } from "lucide-react";
import { Eyebrow, Reveal } from "./ui";

const PDF_PATH = "/assets/asalatu-nadwat-prayer-book.pdf#toolbar=0&navpanes=0&scrollbar=1";

export default function PrayerBookViewer() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <section id="prayer-book" className="border-t border-ink/10 bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Column: Information & Protection Notice */}
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

            {/* Protection Notice */}
            <Reveal delay={0.18}>
              <div className="mt-6 flex items-start gap-3 border border-fern/30 bg-fern/5 p-5 rounded-lg text-xs text-pine shadow-sm">
                <Lock className="h-4 w-4 shrink-0 text-fern mt-0.5" />
                <div>
                  <span className="font-semibold block text-ink text-sm">Read-Only Official Document</span>
                  <span className="mt-1 block leading-relaxed text-faded">
                    This PDF document is enabled for on-screen reading only. Downloads and printing are restricted to preserve the original publication.
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.22}>
              <button
                onClick={() => setIsFullscreen(true)}
                className="mt-6 flex w-full items-center justify-center gap-2.5 bg-pine px-6 py-3.5 text-sm font-semibold text-white hover:bg-ink transition-all shadow-md rounded-lg"
              >
                <Maximize2 className="h-4 w-4 text-sage" />
                <span>Open Fullscreen Reader</span>
              </button>
            </Reveal>
          </div>

          {/* Right Column: PDF Viewer */}
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
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
                  style={{ height: "780px" }}
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
