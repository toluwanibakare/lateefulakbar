"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Heart, Menu, X } from "lucide-react";
import { EVENT } from "@/lib/site";

/* Desktop: Sadaqah is intentionally NOT here — Donate leads instead.
   Sadaqah lives as its own page (/sadaqah), linked from Donate, Home and Footer.
   "About" carries the event story, with a dropdown to the Founder page. */
const ABOUT_LINKS = [
  { label: "About the event", href: "/about", desc: "What, when, where — and why it matters" },
  { label: "The gathering", href: "/gathering", desc: "The day in full: atmosphere & order" },
  { label: "Founder", href: "/founder", desc: "Shaikh Dr. Abdur Rahman Ade Lawal" },
];

const LINKS: {
  label: string;
  href: string;
  live?: boolean;
  children?: { label: string; href: string; desc: string }[];
}[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about", children: ABOUT_LINKS },
  { label: "Gallery", href: "/gallery" },
  { label: "Donate", href: "/donate" },
  { label: "Blog", href: "/blog" },
  { label: "Venue", href: "/venue" },
  { label: "Live", href: "/live", live: true },
];

const ALL_LINKS = [
  { label: "Home", href: "/" },
  { label: "About the event", href: "/about" },
  { label: "The gathering", href: "/gathering" },
  { label: "Founder", href: "/founder" },
  { label: "Gallery", href: "/gallery" },
  { label: "Donate", href: "/donate" },
  { label: "Sadaqah", href: "/sadaqah" },
  { label: "Register", href: "/register" },
  { label: "Blog", href: "/blog" },
  { label: "Prayer Book", href: "/prayer-book" },
  { label: "Live", href: "/live" },
  { label: "Venue", href: "/venue" },
];

const ABOUT_HREFS = ABOUT_LINKS.map((l) => l.href);

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const isHome = pathname === "/";
  const solid = scrolled || !isHome;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropOpen(false);
  }, [pathname]);

  const linkCls = (active: boolean) =>
    `text-[13px] font-medium tracking-wide transition-colors ${
      solid
        ? active
          ? "text-pine underline underline-offset-8 decoration-vivid"
          : "text-ink/75 hover:text-pine"
        : active
          ? "text-white underline underline-offset-8"
          : "text-white/85 hover:text-white"
    }`;

  const aboutActive = pathname === "/about" || ABOUT_HREFS.includes(pathname);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid
            ? "bg-paper shadow-[0_1px_0_rgba(10,46,35,0.12),0_8px_30px_-18px_rgba(10,46,35,0.45)]"
            : "bg-transparent"
        }`}
      >
        <div
          className={`border-b transition-colors ${solid ? "border-ink/10" : "border-white/15"}`}
        >
          <div
            className={`mx-auto flex max-w-7xl items-center justify-between px-5 py-1.5 text-[11px] uppercase tracking-[0.18em] transition-colors sm:px-6 ${
              solid ? "text-faded" : "text-white/75"
            }`}
          >
            <span>Nadwat Global Assembly - {EVENT.dateShort}</span>
            <span className={`hidden font-semibold sm:block ${solid ? "text-fern" : "text-white/85"}`}>
              {EVENT.dressCode} - TBS Main Bowl
            </span>
          </div>
        </div>

        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          {/* Both logos, shown fully. No circles, no backgrounds, no cropping. */}
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label="Home">
            <Image
              src="/assets/nadwa-logo.png"
              alt="Nadwat Global Assembly logo"
              width={150}
              height={48}
              className={`h-8 w-auto shrink-0 object-contain transition-all sm:h-11 ${
                solid
                  ? "brightness-100"
                  : "brightness-0 invert drop-shadow-[0_1px_10px_rgba(255,255,255,0.4)]"
              }`}
              priority
            />
            <span
              aria-hidden
              className={`h-7 w-px shrink-0 transition-colors sm:h-9 ${solid ? "bg-ink/15" : "bg-white/30"}`}
            />
            <Image
              src="/assets/lateef-logo.png"
              alt="Lateeful Ul Akbar Il Aazam logo"
              width={220}
              height={60}
              className="h-7 w-auto min-w-0 object-contain sm:h-10"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {LINKS.map((l) => {
              if (!l.children) {
                const active = pathname === l.href;
                if (l.label === "Donate") {
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={`group inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-[13px] font-bold leading-none tracking-wide transition-all shadow-sm ${
                        solid
                          ? "bg-vivid text-white hover:bg-vivid-deep"
                          : "bg-vivid text-white hover:bg-vivid-deep border border-white/20"
                      }`}
                    >
                      <Heart className="h-3.5 w-3.5 shrink-0 fill-white text-white animate-pulse" />
                      <span className="leading-none">Donate</span>
                    </Link>
                  );
                }
                return (
                  <Link key={l.href} href={l.href} className={linkCls(active)}>
                    {l.live && (
                      <span className="relative mr-1.5 inline-flex h-2 w-2" aria-hidden>
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                      </span>
                    )}
                    {l.label}
                  </Link>
                );
              }
              return (
                <div
                  key={l.href}
                  className="group relative"
                  onMouseEnter={() => setDropOpen(true)}
                  onMouseLeave={() => setDropOpen(false)}
                >
                  <Link
                    href={l.href}
                    className={`${linkCls(aboutActive)} inline-flex items-center gap-1`}
                    aria-haspopup="true"
                    aria-expanded={dropOpen}
                    onFocus={() => setDropOpen(true)}
                  >
                    {l.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${dropOpen ? "rotate-180" : ""}`}
                    />
                  </Link>
                  <div
                    className={`absolute top-full left-1/2 z-50 w-80 -translate-x-1/2 pt-4 transition-all duration-200 ${
                      dropOpen
                        ? "visible opacity-100 translate-y-0"
                        : "invisible opacity-0 -translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0"
                    }`}
                  >
                    <div className="border border-ink/10 bg-white p-2 shadow-[0_30px_60px_-30px_rgba(10,46,35,0.4)]">
                      {l.children.map((c) => {
                        const active = pathname === c.href;
                        return (
                          <Link
                            key={c.href}
                            href={c.href}
                            onClick={() => setDropOpen(false)}
                            className={`block px-4 py-3 transition-colors hover:bg-cream ${
                              active ? "bg-cream" : ""
                            }`}
                          >
                            <span className={`text-sm font-semibold ${active ? "text-fern" : "text-ink"}`}>
                              {c.label}
                            </span>
                            <span className="mt-0.5 block text-[12px] leading-snug text-faded">
                              {c.desc}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/register"
              className={`group hidden items-center gap-1.5 px-5 py-2.5 text-[13px] font-semibold transition-colors sm:inline-flex ${
                solid ? "bg-vivid text-white hover:bg-vivid-deep" : "bg-white text-pine hover:bg-mist"
              }`}
            >
              Register free
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className={`inline-flex h-10 w-10 items-center justify-center transition-colors lg:hidden ${
                solid ? "text-ink" : "text-white"
              }`}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Full screen mobile menu on white with green type */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-paper text-ink"
          >
            <div className="pattern-lattice absolute inset-0 opacity-60" aria-hidden />
            <div className="relative flex items-center justify-center px-5 py-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/nadwa-logo.png"
                  alt="Nadwat Global Assembly logo"
                  width={120}
                  height={38}
                  className="h-9 w-auto object-contain"
                />
                <Image
                  src="/assets/lateef-logo.png"
                  alt="Lateeful Ul Akbar Il Aazam logo"
                  width={170}
                  height={46}
                  className="h-8 w-auto object-contain"
                />
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-5 p-2">
                <X className="h-7 w-7" />
              </button>
            </div>
            <nav className="relative flex flex-1 flex-col justify-start gap-1 overflow-y-auto px-8 py-6" aria-label="Mobile">
              {ALL_LINKS.map((l, i) => {
                const active = pathname === l.href;
                const isSub = l.label === "The gathering" || l.label === "Founder";
                return (
                  <motion.div
                    key={l.href + l.label}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i, duration: 0.4 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`font-display flex items-baseline justify-between border-b border-ink/10 py-3.5 font-light tracking-tight ${
                        isSub ? "pl-5 text-2xl text-ink/80" : "text-3xl"
                      } ${active ? "text-fern" : ""}`}
                    >
                      {l.label}
                      {l.label === "Donate" && (
                        <span className="bg-vivid px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                          Give
                        </span>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
            <p className="relative px-8 pb-10 text-xs uppercase tracking-[0.24em] text-faded">
              {EVENT.dateLong} - {EVENT.venue}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
