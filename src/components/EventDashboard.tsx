"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Minus, Plus, Radio, Send } from "lucide-react";
import { Eyebrow, Reveal } from "./ui";

export default function EventDashboard() {
  const [taps, setTaps] = useState(0);
  const [manual, setManual] = useState("");
  const [global, setGlobal] = useState(128450);
  const [thanks, setThanks] = useState(false);
  const [mode, setMode] = useState<"tap" | "manual">("tap");

  useEffect(() => {
    // Fetch initial global tasbih count from MySQL
    fetch("/api/tasbih")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.count) {
          setGlobal(data.count);
        }
      })
      .catch((err) => console.error("Error loading tasbih count:", err));
  }, []);

  const tap = () => {
    setTaps((t) => t + 1);
    if (typeof window !== "undefined" && navigator.vibrate) navigator.vibrate(12);
  };

  const submitTaps = async () => {
    if (!taps) return;
    const currentTaps = taps;
    
    // Optimistic update
    setGlobal((g) => g + currentTaps);
    setThanks(true);
    setTaps(0);

    try {
      const res = await fetch("/api/tasbih", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increment: currentTaps }),
      });
      const data = await res.json();
      if (data.success && data.count) {
        setGlobal(data.count);
      }
    } catch (err) {
      console.error("Failed to post tasbih count:", err);
    } finally {
      setTimeout(() => {
        setThanks(false);
      }, 3500);
    }
  };

  const submitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = parseInt(manual.replace(/,/g, ""), 10);
    if (!v || v <= 0) return;

    // Optimistic update
    setGlobal((g) => g + v);
    setThanks(true);
    setManual("");

    try {
      const res = await fetch("/api/tasbih", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increment: v }),
      });
      const data = await res.json();
      if (data.success && data.count) {
        setGlobal(data.count);
      }
    } catch (err) {
      console.error("Failed to post manual tasbih count:", err);
    } finally {
      setTimeout(() => {
        setThanks(false);
      }, 3500);
    }
  };

  return (
    <section id="live-dashboard" className="border-t border-ink/10 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
        <Reveal>
          <Eyebrow>Live — Tasbīh</Eyebrow>
        </Reveal>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <Reveal delay={0.06}>
            <h2 className="font-display text-balance max-w-2xl text-4xl leading-tight font-light tracking-tight text-ink dark:text-white sm:text-5xl">
              Watch and chant Yaa Lateef wherever you are
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="max-w-sm text-sm leading-relaxed text-faded dark:text-slate-400">
              Watch the broadcast on the day, and add your own Yaa Lateef recitations to the
              worldwide live tasbīh.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* Broadcast */}
          <Reveal className="lg:col-span-7">
            <div className="border border-ink/15 bg-ink">
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  Live from National Mosque Auditorium
                </span>
                <span className="font-mono text-[11px] text-white/60">Nadwat TV</span>
              </div>
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.youtube.com/embed/0x1LqBHjWWE?rel=0"
                  title="Lateeful Akbar live broadcast"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="h-full w-full border-0"
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border border-ink/15 dark:border-slate-800 bg-cream dark:bg-slate-800 px-5 py-4">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-ink dark:text-white">
                <Radio className="h-4 w-4 text-teal-600 dark:text-teal-400" /> Main Auditorium Feed - Abuja
              </p>
              <a href="/venue" className="text-[13px] font-semibold text-teal-700 dark:text-teal-400 underline-offset-4 hover:underline">
                Plan your route
              </a>
            </div>
          </Reveal>

          {/* Tasbīh */}
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="flex h-full flex-col border border-ink/15 dark:border-slate-800 bg-cream dark:bg-slate-800">
              <div className="relative overflow-hidden bg-teal-700 px-6 py-6 text-center text-white">
                <div className="pattern-lattice-light absolute inset-0 opacity-40" aria-hidden />
                <p lang="ar" className="font-arabic relative text-xl text-white/85">
                  التَّسْبِيح
                </p>
                <p className="relative mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">
                  Worldwide Yaa Lateef Tasbīh (Live)
                </p>
                <p className="font-display relative mt-1 text-5xl font-light tabular-nums sm:text-6xl text-amber-300">
                  {global.toLocaleString()}
                </p>
              </div>

              <div className="flex gap-1 border-b border-ink/10 dark:border-slate-700 bg-white dark:bg-slate-900 p-1.5">
                {(["tap", "manual"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 text-[12px] font-semibold tracking-wide transition-colors ${
                      mode === m ? "bg-teal-700 text-white" : "text-faded dark:text-slate-400 hover:text-teal-700"
                    }`}
                  >
                    {m === "tap" ? "Tap Tasbīh" : "Manual entry"}
                  </button>
                ))}
              </div>

              <div className="flex flex-1 flex-col justify-center px-6 py-8">
                {mode === "tap" ? (
                  <div className="flex flex-col items-center gap-5">
                    <p className="font-display text-6xl font-light tabular-nums text-ink dark:text-white">{taps}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setTaps((t) => Math.max(0, t - 1))}
                        aria-label="Subtract one"
                        className="flex h-12 w-12 items-center justify-center border border-ink/20 dark:border-slate-700 text-ink dark:text-white hover:border-teal-700 hover:text-teal-700"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <button
                        onClick={tap}
                        className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-teal-700 text-white shadow-[0_18px_40px_-18px_rgba(11,61,46,0.7)] transition-transform hover:scale-[1.03] active:scale-95"
                      >
                        <Plus className="h-7 w-7" />
                        <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em]">Tap +1</span>
                      </button>
                      <span className="w-12" aria-hidden />
                    </div>
                    <button
                      onClick={submitTaps}
                      disabled={!taps}
                      className="inline-flex w-full items-center justify-center gap-2 bg-teal-700 py-3.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-30"
                    >
                      <Send className="h-4 w-4" /> Submit {taps} recitations
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submitManual} className="space-y-4">
                    <div>
                      <label htmlFor="dhikr-manual" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faded dark:text-slate-400">
                        Your tally from misbaha or hand tasbīh
                      </label>
                      <input
                        id="dhikr-manual"
                        value={manual}
                        onChange={(e) => setManual(e.target.value)}
                        placeholder="e.g. 1,250"
                        inputMode="numeric"
                        className="mt-2 w-full border border-ink/20 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5 font-mono text-xl text-ink dark:text-white focus:border-teal-700 focus:outline-none"
                      />
                    </div>
                    <button type="submit" disabled={!manual} className="inline-flex w-full items-center justify-center gap-2 bg-teal-700 py-3.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-30">
                      <Send className="h-4 w-4" /> Submit manual tasbīh
                    </button>
                  </form>
                )}

                <AnimatePresence>
                  {thanks && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-5 flex items-center justify-center gap-2 border border-teal-500/30 bg-teal-50 dark:bg-teal-950/60 px-4 py-3 text-[13px] font-medium text-teal-800 dark:text-teal-200"
                    >
                      <CheckCircle2 className="h-4 w-4 text-teal-600" /> JazakAllah khair. Added to the worldwide total.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
