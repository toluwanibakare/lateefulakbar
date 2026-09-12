"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, MapPin, Volume2, VolumeX } from "lucide-react";
import { EVENT, FILM, HERO_SEQUENCE } from "@/lib/site";
import { CountdownStrip } from "./ui";

/**
 * Cinematic hero: film opens, then dissolves into a slow
 * crossfading sequence of real gathering frames. No carousel chrome.
 */
export default function Hero() {
  const [phase, setPhase] = useState<"film" | "stills">("film");
  const [frame, setFrame] = useState(0);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 900], [0, 180]);
  const yFg = useTransform(scrollY, [0, 900], [0, -60]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hero_film_muted");
      if (saved !== null) {
        setMuted(saved === "true");
      }
    } catch {}
  }, []);

  const toggleMuted = () => {
    setMuted((m) => {
      const next = !m;
      try {
        localStorage.setItem("hero_film_muted", String(next));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    if (phase === "film" && videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
      } catch {}
      videoRef.current.muted = muted;
      const promise = videoRef.current.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.warn("Autoplay with sound blocked by browser, falling back to muted play:", err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [phase, muted]);

  useEffect(() => {
    if (phase !== "stills" || reduce) return;
    const id = setInterval(() => {
      setFrame((f) => {
        if (f + 1 >= HERO_SEQUENCE.length) {
          setPhase("film");
          return 0;
        }
        return f + 1;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [phase, reduce]);

  return (
    <section id="top" className="relative flex min-h-screen w-full max-w-full flex-col overflow-hidden bg-ink text-white">
      {/* --- Backdrop --- */}
      <motion.div style={{ y: yBg }} className="absolute inset-0" aria-hidden>
        {phase === "film" ? (
          <video
            ref={videoRef}
            key="hero-film"
            src={FILM}
            autoPlay
            muted={muted}
            playsInline
            preload="auto"
            onEnded={() => {
              setFrame(0);
              setPhase("stills");
            }}
            className="h-full w-full object-cover"
          />
        ) : (
          <AnimatePresence mode="sync">
            <motion.div
              key={HERO_SEQUENCE[frame]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div className={reduce ? "h-full w-full" : "animate-kenburns h-full w-full"}>
                <Image
                  src={HERO_SEQUENCE[frame]}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="img-true object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        {/* Balanced cinematic veils — clear vibrant imagery with sharp text contrast */}
        <div className="absolute inset-0 bg-pine/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061711] via-[#061711]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061711]/70 via-[#061711]/30 to-transparent" />
      </motion.div>

      {/* --- Foreground --- */}
      <motion.div
        style={{ y: yFg }}
        className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-16 pt-32 sm:px-6 sm:pb-20"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          lang="ar"
          className="font-arabic text-xl text-white sm:text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
        >
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
        >
          Nadwat Global Assembly presents
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.18 }}
          className="font-display mt-3 max-w-full font-light tracking-tight leading-none"
        >
          <span className="block text-[clamp(1.25rem,5vw,4.5rem)] font-light leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] break-words">
            Lateef ul-il-Akbar-Il-A’azam
          </span>
          <span className="font-display mt-3 block text-[clamp(0.9rem,2.8vw,2rem)] font-light text-emerald-300 tracking-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Yaa Lateef, The Most Kind
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.32 }}
          className="mt-6 flex max-w-2xl flex-col gap-4"
        >
          <p className="text-[15px] leading-relaxed text-white/95 sm:text-lg font-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            The Grandeur Gathering Of Sublime Minds. Tens of thousands in white — breathing the same dhikr, Seeking Allah’s kindness in a unified tone.
          </p>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium tracking-wide text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-400" /> {EVENT.venue}
            </span>
            <span className="hidden h-3 w-px bg-white/40 sm:block" aria-hidden />
            <span>{EVENT.dateLong}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.44 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <a
            href="/register"
            className="bg-white text-emerald-950 hover:bg-emerald-100 px-7 py-3.5 text-sm font-bold shadow-lg transition-colors"
          >
            Reserve your place - free
          </a>
          <a
            href="#venue"
            className="bg-vivid text-white hover:bg-vivid-deep px-6 py-3.5 text-sm font-semibold transition-colors flex items-center gap-2 shadow-md"
          >
            <MapPin className="h-4 w-4" />
            Locate Event & Venue
          </a>
          <a
            href="/gathering"
            className="border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Feel the gathering
          </a>
          <div className="ml-1 flex items-center gap-2">
            {phase === "film" ? (
              <>
                <button
                  onClick={toggleMuted}
                  className="inline-flex h-11 w-11 items-center justify-center border border-white/30 text-white hover:bg-white/10"
                  aria-label={muted ? "Unmute film" : "Mute film"}
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setPhase("stills")}
                  className="px-4 py-2 text-xs font-medium tracking-wide text-white/70 underline-offset-4 hover:text-white hover:underline"
                >
                  Skip film
                </button>
              </>
            ) : (
              <button
                onClick={() => setPhase("film")}
                className="px-4 py-2 text-xs font-medium tracking-wide text-white/70 underline-offset-4 hover:text-white hover:underline"
              >
                Replay highlight film
              </button>
            )}
          </div>
        </motion.div>

        {/* countdown as quiet editorial strip, not a box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-12 border-t border-white/20 pt-6"
        >
          <CountdownStrip dark />
        </motion.div>
      </motion.div>

      <a
        href="/gathering"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/60 transition-colors hover:text-white md:flex"
        aria-label="Scroll to gathering"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  );
}
