"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass, Heart, Mail, MapPin, Phone, Send } from "lucide-react";
import { EVENT } from "@/lib/site";
import { FadeIn, StaggerContainer, StaggerItem } from "./ui";

export default function Footer() {
  return (
    <footer className="bg-paper dark:bg-[#061711] text-ink transition-colors">
      {/* Closing invitation callout */}
      <div className="border-t border-ink/10 dark:border-white/10 bg-cream/50 dark:bg-[#081f17]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 sm:px-6 md:grid-cols-2 md:py-20">
          <FadeIn direction="right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-vivid dark:text-emerald-400">
              Final Call
            </p>
            <h2 className="font-display text-balance mt-4 text-3xl leading-tight font-light tracking-tight text-ink dark:text-white sm:text-5xl">
              Attend with a multitude of prayer points and feel fulfilled, inspired and certain of the efficacy of the supplications
            </h2>
          </FadeIn>
          <FadeIn direction="left" delay={0.1}>
            <p className="max-w-md text-[15px] leading-relaxed text-faded dark:text-emerald-100/80">
              {EVENT.dateLong} at {EVENT.venue}. Registration is free, water is provided, and
              the tasbīh already runs past a hundred thousand.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 bg-vivid dark:bg-emerald-600 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all hover:bg-vivid-deep hover:shadow-md hover:scale-105"
              >
                Register free
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 border border-ink/20 dark:border-white/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink dark:text-white transition-all hover:bg-paper dark:hover:bg-white/10 hover:scale-105"
              >
                Donate
              </Link>
              <Link
                href="/sadaqah"
                className="inline-flex items-center gap-2 px-2 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-vivid dark:text-emerald-400 underline underline-offset-4 hover:text-vivid-deep transition-colors"
              >
                Give Sadaqah
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Main footer content */}
      <div className="relative overflow-hidden bg-[#0c4a34] dark:bg-[#030f0b] text-white border-t border-emerald-500/20">
        {/* Star lattice pattern */}
        <div className="pattern-lattice-light absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-5 pt-14 sm:px-6">
          <StaggerContainer staggerDelay={0.08} className="grid gap-10 pb-12 md:grid-cols-12">
            <StaggerItem className="md:col-span-4">
              <div className="inline-flex flex-row items-center gap-4 bg-white dark:bg-emerald-950/80 p-4 shadow-md rounded-lg border border-transparent dark:border-emerald-500/30">
                <Image
                  src="/assets/nadwa-logo.png"
                  alt="Nadwat Global Assembly logo"
                  width={170}
                  height={54}
                  className="h-11 w-auto shrink-0 object-contain dark:brightness-0 dark:invert"
                />
                <span aria-hidden className="h-10 w-px shrink-0 bg-ink/15 dark:bg-white/30" />
                <Image
                  src="/assets/lateef-logo.png"
                  alt="Lateeful Ul Akbar Il Aazam logo"
                  width={210}
                  height={58}
                  className="h-10 w-auto shrink-0 object-contain dark:brightness-0 dark:invert"
                />
              </div>
              <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-emerald-100/80">
                An Islamic society for spiritual growth, collective du’a, dhikr and community
                unity upon the Qur’an and Sunnah.
              </p>
            </StaggerItem>

            <StaggerItem className="md:col-span-3">
              <nav aria-label="Footer">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-400">
                  <Compass className="h-3.5 w-3.5 text-amber-300" />
                  <span>Gathering & Portals</span>
                </p>
                <ul className="mt-4 space-y-2.5 text-sm text-white/90">
                  {[
                    ["About the event", "/about"],
                    ["The gathering", "/gathering"],
                    ["Convener", "/founder"],
                    ["Guest Registration", "/register"],
                    ["Vendor Registration", "/vendors"],
                    ["Media Accreditation", "/media-accreditation"],
                    ["Venue", "/venue"],
                  ].map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className="hover:text-emerald-300 transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </StaggerItem>

            <StaggerItem className="md:col-span-2">
              <nav aria-label="More">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-400">
                  <Heart className="h-3.5 w-3.5 text-amber-300" />
                  <span>Giving & More</span>
                </p>
                <ul className="mt-4 space-y-2.5 text-sm text-white/90">
                  {[
                    ["Donate", "/donate"],
                    ["Sadaqah", "/sadaqah"],
                    ["Blog", "/blog"],
                    ["Prayer book", "/prayer-book"],
                    ["Live Stream", "/live"],
                  ].map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className="hover:text-emerald-300 transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </StaggerItem>

            <StaggerItem className="md:col-span-3">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-400">
                <Send className="h-3.5 w-3.5 text-amber-300" />
                <span>Contact</span>
              </p>
              <ul className="mt-4 space-y-3 text-sm text-white/90">
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                  <a
                    href={`mailto:${EVENT.email}`}
                    className="hover:text-emerald-300 transition-colors"
                  >
                    {EVENT.email}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                  <a
                    href="tel:+2347047000765"
                    className="hover:text-emerald-300 transition-colors"
                  >
                    +234 704 700 0765
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Nadwat Mosque, Lagos State, Nigeria</span>
                </li>
              </ul>
              <div className="mt-5 flex items-center gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61593953164009"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Lateeful Akbar on Facebook"
                  className="inline-flex h-10 w-10 items-center justify-center border border-white/20 text-white/90 transition-all hover:border-emerald-400 hover:text-emerald-300 hover:scale-110 rounded-lg"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/lateefulakbar"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Lateeful Akbar on Instagram"
                  className="inline-flex h-10 w-10 items-center justify-center border border-white/20 text-white/90 transition-all hover:border-emerald-400 hover:text-emerald-300 hover:scale-110 rounded-lg"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@lateefulakbar"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Lateeful Akbar on TikTok"
                  className="inline-flex h-10 w-10 items-center justify-center border border-white/20 text-white/90 transition-all hover:border-emerald-400 hover:text-emerald-300 hover:scale-110 rounded-lg"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
                <span className="text-[13px] text-emerald-300/80 font-medium">@lateefulakbar</span>
              </div>
            </StaggerItem>
          </StaggerContainer>

          <div className="w-full max-w-full overflow-hidden" aria-hidden>
            <p className="font-display text-outline relative -mb-4 hidden w-full text-center text-[11vw] leading-none font-semibold tracking-tight whitespace-nowrap select-none md:block opacity-60">
              YAA LATEEF
            </p>
          </div>

          <div className="relative flex flex-col items-center justify-between gap-3 border-t border-white/15 py-6 text-[12px] text-white/70 sm:flex-row">
            <p>© {new Date().getFullYear()} Nadwat Global Assembly. All rights reserved.</p>
            <p lang="ar" className="font-arabic text-base text-emerald-300">
              يَا لَطِيفُ
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
