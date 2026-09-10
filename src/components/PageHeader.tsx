"use client";

import Link from "next/link";
import { Reveal } from "./ui";

export default function PageHeader({
  eyebrow,
  title,
  intro,
  arabic,
  image,
  imageAlt = "",
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  arabic?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-pine pt-24 xs:pt-28 sm:pt-36 text-white">
      <div className="pattern-lattice-light absolute inset-0 opacity-25" aria-hidden />
      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-pine via-pine/80 to-pine/60" />
        </>
      )}
      <div className="relative mx-auto max-w-7xl px-4 xs:px-5 pb-10 pt-6 sm:px-6 md:pb-20">
        <Reveal>
          <p className="flex items-center gap-2 text-[10px] xs:text-[11px] font-medium uppercase tracking-[0.24em] text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-sage">{eyebrow}</span>
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="font-display text-balance mt-3 sm:mt-4 max-w-4xl text-3xl xs:text-4xl leading-[1.05] font-light tracking-tight sm:text-5xl md:text-6xl">
            {title}
          </h1>
        </Reveal>
        {arabic && (
          <Reveal delay={0.14}>
            <p lang="ar" className="font-arabic mt-3 sm:mt-4 text-lg xs:text-xl text-sage/90 sm:text-2xl">
              {arabic}
            </p>
          </Reveal>
        )}
        {intro && (
          <Reveal delay={0.18}>
            <p className="mt-3.5 sm:mt-5 max-w-2xl text-xs xs:text-sm sm:text-base leading-relaxed text-white/80">
              {intro}
            </p>
          </Reveal>
        )}
        {imageAlt ? <span className="sr-only">{imageAlt}</span> : null}
      </div>
    </section>
  );
}
