"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { EVENT } from "@/lib/site";

/** Smooth page scroll progress bar fixed at top of screen */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-1 origin-left bg-gradient-to-r from-vivid via-fern to-gilt"
      style={{ scaleX }}
      aria-hidden
    />
  );
}

/** Floating smooth back to top button */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-pine text-white shadow-2xl transition-colors hover:bg-vivid border border-white/20"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/** Standard Scroll Reveal wrapper with noticeable slide, blur, and scale */
export function Reveal({
  children,
  delay = 0,
  y = 48,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y, scale: 0.97, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Advanced Directional FadeIn Reveal */
export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.85,
  distance = 48,
  blur = true,
  className,
}: {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  distance?: number;
  blur?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  const offsets = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...offsets[direction],
        scale: direction !== "none" ? 0.97 : 1,
        filter: blur ? "blur(8px)" : "blur(0px)",
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** ScaleIn Reveal */
export function ScaleIn({
  children,
  delay = 0,
  duration = 0.85,
  scale = 0.88,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  scale?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, scale, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Stagger Parent Container */
export function StaggerContainer({
  children,
  staggerDelay = 0.12,
  className,
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Stagger Child Item */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 44, scale: 0.95, filter: "blur(6px)" },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Interactive Tilt & Floating Card */
export function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.025 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`transition-all duration-300 hover:shadow-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

/** Parallax Image Wrapper */
export function ParallaxImage({
  children,
  offset = 60,
  className = "",
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.05, 1.12]);
  const reduce = useReducedMotion();

  if (reduce) return <div className={`overflow-hidden ${className}`}>{children}</div>;

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y, scale }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/** Word-by-word dynamic headline reveal */
export function TextReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;

  const words = text.split(" ");
  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.04,
            delayChildren: delay,
          },
        },
      }}
      className={`inline-block ${className}`}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 pr-2 align-bottom">
          <motion.span
            variants={{
              hidden: { y: "100%", opacity: 0, filter: "blur(6px)" },
              show: {
                y: "0%",
                opacity: 1,
                filter: "blur(0px)",
                transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Animated Count-up for Numbers */
export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  prefix = "",
  suffix = "",
}: {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const current = Math.floor(progress * (to - from) + from);
      setCount(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [inView, from, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] ${
        light ? "text-white/70" : "text-fern"
      }`}
    >
      <span className={`inline-block h-px w-10 ${light ? "bg-white/50" : "bg-vivid/70"}`} aria-hidden />
      {children}
    </p>
  );
}

export function useCountdown(targetISO: string) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date(targetISO).getTime();
    const tick = () => {
      const d = Math.max(0, target - Date.now());
      setT({
        days: Math.floor(d / 86400000),
        hours: Math.floor((d % 86400000) / 3600000),
        minutes: Math.floor((d % 3600000) / 60000),
        seconds: Math.floor((d % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);
  return t;
}

export function CountdownStrip({ dark = false }: { dark?: boolean }) {
  const t = useCountdown(EVENT.targetISO);
  const cells = [
    { v: t.days, l: "Days" },
    { v: t.hours, l: "Hours" },
    { v: t.minutes, l: "Minutes" },
    { v: t.seconds, l: "Seconds" },
  ];
  return (
    <div className={`flex items-stretch ${dark ? "text-white" : "text-ink"}`} aria-label="Countdown">
      {cells.map((c, i) => (
        <div key={c.l} className="flex items-stretch">
          <div className="flex flex-col items-start px-5 first:pl-0 last:pr-0 sm:px-7">
            <span className="font-display text-4xl font-light tabular-nums sm:text-5xl">
              {String(c.v).padStart(2, "0")}
            </span>
            <span
              className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] ${
                dark ? "text-white/60" : "text-faded"
              }`}
            >
              {c.l}
            </span>
          </div>
          {i < cells.length - 1 && (
            <span aria-hidden className={`w-px self-stretch ${dark ? "bg-white/20" : "bg-ink/15"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
