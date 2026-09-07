"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { EVENT } from "@/lib/site";
import { Reveal } from "./ui";

export default function Footer() {
  return (
    <footer className="bg-white">
      {/* Closing invitation on white */}
      <div className="border-t border-ink/10">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 sm:px-6 md:grid-cols-2 md:py-20">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-fern">
              Final call
            </p>
            <h2 className="font-display text-balance mt-4 text-4xl leading-tight font-light tracking-tight text-ink sm:text-6xl">
              Come in white. Leave renewed.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-[15px] leading-relaxed text-faded">
              {EVENT.dateLong} at {EVENT.venue}. Registration is free, water is provided, and
              the tasbīh already runs past a hundred thousand.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 bg-fern px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-vivid"
              >
                Register free
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 border border-ink/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-paper"
              >
                Donate
              </Link>
              <Link
                href="/sadaqah"
                className="inline-flex items-center gap-2 px-2 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-pine underline underline-offset-4 hover:text-fern"
              >
                Give Sadaqah
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Deep green closing statement */}
      <div className="relative overflow-hidden bg-pine text-white">
        <div className="pattern-lattice-light absolute inset-0 opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 pt-14 sm:px-6">
          <div className="grid gap-10 pb-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="inline-flex flex-row items-center gap-4 bg-white p-4">
                <Image src="/assets/nadwa-logo.png" alt="Nadwat Global Assembly logo" width={170} height={54} className="h-11 w-auto shrink-0 object-contain" />
                <span aria-hidden className="h-10 w-px shrink-0 bg-ink/15" />
                <Image src="/assets/lateef-logo.png" alt="Lateeful Ul Akbar Il Aazam logo" width={210} height={58} className="h-10 w-auto shrink-0 object-contain" />
              </div>
              <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-white/70">
                An Islamic society for spiritual growth, collective du’a, dhikr and community
                unity upon the Qur’an and Sunnah.
              </p>
            </div>

            <nav className="md:col-span-3" aria-label="Footer">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sage">Gathering</p>
              <ul className="mt-4 space-y-2.5 text-sm text-white/80">
                {[
                  ["About the event", "/about"],
                  ["The gathering", "/gathering"],
                  ["Founder", "/founder"],
                  ["Gallery", "/gallery"],
                  ["Registration", "/register"],
                  ["Venue", "/venue"],
                ].map(([label, href]) => (
                  <li key={href}><Link href={href} className="hover:text-white">{label}</Link></li>
                ))}
              </ul>
            </nav>

            <nav className="md:col-span-2" aria-label="More">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sage">Giving & More</p>
              <ul className="mt-4 space-y-2.5 text-sm text-white/80">
                {[
                  ["Donate", "/donate"],
                  ["Sadaqah", "/sadaqah"],
                  ["Journal", "/journal"],
                  ["Prayer book", "/prayer-book"],
                  ["Live", "/live"],
                ].map(([label, href]) => (
                  <li key={href}><Link href={href} className="hover:text-white">{label}</Link></li>
                ))}
              </ul>
            </nav>

            <div className="md:col-span-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sage">Contact</p>
              <ul className="mt-4 space-y-3 text-sm text-white/80">
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-sage" />
                  <a href="mailto:Lateefulakbar@gmail.com" className="hover:text-white">Lateefulakbar@gmail.com</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-sage" />
                  <a href="tel:+2347047000765" className="hover:text-white">+234 704 700 0765</a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  <span>Nadwat Mosque, Lagos State, Nigeria</span>
                </li>
              </ul>
              <div className="mt-4 flex items-center gap-3">
                <a
                  href="https://www.instagram.com/lateefulakbar"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Lateeful Akbar on Instagram"
                  className="inline-flex h-10 w-10 items-center justify-center border border-white/20 text-white/80 transition-colors hover:border-sage hover:text-white"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
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
                  className="inline-flex h-10 w-10 items-center justify-center border border-white/20 text-white/80 transition-colors hover:border-sage hover:text-white"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
                <span className="text-[13px] text-white/60">@lateefulakbar</span>
              </div>
            </div>
          </div>

          <p aria-hidden className="font-display text-outline relative -mb-4 hidden w-full overflow-hidden text-center text-[13vw] leading-none font-semibold tracking-tight whitespace-nowrap select-none md:block">
            YAA LATEEF
          </p>

          <div className="relative flex flex-col items-center justify-between gap-3 border-t border-white/15 py-6 text-[12px] text-white/60 sm:flex-row">
            <p>© {new Date().getFullYear()} Nadwat Global Assembly. All rights reserved.</p>
            <p lang="ar" className="font-arabic text-sm text-white/70">يَا لَطِيفُ</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
