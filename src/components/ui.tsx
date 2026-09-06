"use client";

import { motion, useReducedMotion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { EVENT } from "@/lib/site";

export function Reveal({
  children,
  delay = 0,
  y = 28,
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
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
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
