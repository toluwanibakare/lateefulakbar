"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Car,
  ChevronDown,
  Download,
  Eye,
  Layers,
  MapPin,
  Maximize2,
  Navigation,
  ShieldCheck,
  Tent,
  X,
} from "lucide-react";
import { EVENT } from "@/lib/site";
import { Eyebrow, FadeIn, TiltCard } from "./ui";

const PINS = [
  { id: "gate", name: "Main gate", x: "18%", y: "60%", text: "Accreditation and QR scanning. Arrive early." },
  { id: "brothers", name: "Brothers canopy", x: "44%", y: "38%", text: "Ordered seating for men, stewarded by section." },
  { id: "sisters", name: "Sisters canopy", x: "44%", y: "72%", text: "Ordered seating for women, with water points." },
  { id: "stage", name: "Stage", x: "76%", y: "55%", text: "Convener, scholars and reciters. Restricted access." },
  { id: "media", name: "Media zone", x: "64%", y: "28%", text: "Accredited cameras and the broadcast hub." },
  { id: "parking", name: "Parking", x: "12%", y: "22%", text: "Perimeter lots only. Nothing parks inside the Bowl." },
  { id: "medical", name: "Medical", x: "82%", y: "80%", text: "First aid, ambulance and help desk." },
];

const RULES = [
  { icon: ShieldCheck, t: "All white", d: "Clean, modest, all white attire for every attendee, in the Nadwat tradition." },
  { icon: Car, t: "No vehicles in the main Bowl", d: "All cars and buses use the perimeter lots outside the Square." },
  { icon: Tent, t: "Seat where allocated", d: "Seats fill first come, first served. Stewards direct each section." },
  { icon: MapPin, t: "Respect restricted zones", d: "Stage, media and service lanes need official tags. Screening at entry." },
];

const VENUE_LAT = 6.4475;
const VENUE_LNG = 3.398;

export default function VenueMapAndRules() {
  const [pin, setPin] = useState("gate");
  const [openRule, setOpenRule] = useState<number | null>(0);
  const [dist, setDist] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"2d" | "aerial">("2d");
  const [fullscreenMap, setFullscreenMap] = useState(false);

  const locate = () => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: la, longitude: lo } = pos.coords;
        const R = 6371;
        const dLa = ((VENUE_LAT - la) * Math.PI) / 180;
        const dLo = ((VENUE_LNG - lo) * Math.PI) / 180;
        const a =
          Math.sin(dLa / 2) ** 2 +
          Math.cos((la * Math.PI) / 180) * Math.cos((VENUE_LAT * Math.PI) / 180) * Math.sin(dLo / 2) ** 2;
        setDist(Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))));
      },
      () => setDist(null)
    );
  };

  const current = PINS.find((p) => p.id === pin);

  return (
    <section id="venue" className="border-t border-ink/10 bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
        <FadeIn direction="up">
          <Eyebrow>11 - Venue Layout & Directions</Eyebrow>
        </FadeIn>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <FadeIn direction="right" delay={0.06}>
            <h2 className="font-display text-balance max-w-2xl text-4xl leading-tight font-light tracking-tight text-ink sm:text-5xl">
              Tafawa Balewa Square 2D Map & Venue Guide
            </h2>
          </FadeIn>
          <FadeIn direction="left" delay={0.12}>
            <p className="max-w-sm text-sm leading-relaxed text-faded">
              Official 2D layout map, gate assignments, canopy seating, and route assistance for Tafawa Balewa Square.
            </p>
          </FadeIn>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* Left Column: Interactive Map Viewer */}
          <div className="lg:col-span-7">
            <FadeIn direction="right">
              <TiltCard className="overflow-hidden border border-ink/15 bg-white shadow-lg">
                {/* Map Control Bar */}
                <div className="flex flex-wrap items-center justify-between border-b border-ink/10 bg-paper dark:bg-pine p-3 sm:px-5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("2d")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        viewMode === "2d"
                          ? "bg-vivid text-white shadow-sm"
                          : "bg-mist dark:bg-white/10 text-ink dark:text-sage hover:bg-sage/50"
                      }`}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>Official 2D Map</span>
                    </button>
                    <button
                      onClick={() => setViewMode("aerial")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        viewMode === "aerial"
                          ? "bg-vivid text-white shadow-sm"
                          : "bg-mist dark:bg-white/10 text-ink dark:text-sage hover:bg-sage/50"
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Aerial View</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setFullscreenMap(true)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-vivid dark:text-emerald-400 hover:underline"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Expand Fullscreen</span>
                    </button>
                    <a
                      href="/assets/NADWAT 2D MAP.png"
                      download="NADWAT-2D-VENUE-MAP.png"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-pine dark:text-sage hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Download 2D Map</span>
                    </a>
                  </div>
                </div>

                {/* Map Display Container */}
                <div
                  className="relative aspect-[16/10] bg-mist cursor-pointer group overflow-hidden"
                  onClick={() => setFullscreenMap(true)}
                >
                  <Image
                    src={viewMode === "2d" ? "/assets/NADWAT 2D MAP.png" : "/assets/drone-wide.png"}
                    alt={
                      viewMode === "2d"
                        ? "Nadwat Official 2D Layout Map of Tafawa Balewa Square"
                        : "Aerial view of Tafawa Balewa Square during assembly"
                    }
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="img-true object-contain transition-transform duration-500 group-hover:scale-105"
                    priority
                  />

                  {/* Point of Interest Overlay Pins */}
                  {PINS.map((p) => (
                    <button
                      key={p.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPin(p.id);
                      }}
                      style={{ left: p.x, top: p.y }}
                      aria-label={p.name}
                      className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold transition-all shadow-md rounded-full ${
                        pin === p.id
                          ? "bg-vivid text-white scale-110 ring-2 ring-white z-20"
                          : "bg-white/95 text-pine hover:bg-white z-10"
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{p.name}</span>
                    </button>
                  ))}

                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] text-white rounded">
                    Tap map to enlarge
                  </div>
                </div>

                {current && (
                  <div className="flex items-center justify-between gap-4 border-t border-ink/10 px-5 py-4 bg-paper dark:bg-pine">
                    <div>
                      <p className="text-sm font-semibold text-ink">{current.name}</p>
                      <p className="mt-0.5 text-[13px] text-faded">{current.text}</p>
                    </div>
                  </div>
                )}
              </TiltCard>
            </FadeIn>

            {/* Route Planning Widget */}
            <FadeIn direction="up" delay={0.15}>
              <div className="mt-6 border-2 border-vivid bg-cream p-5 shadow-md sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-vivid text-white shadow-sm">
                      <Navigation className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-semibold text-ink">
                        Find Your Route to Tafawa Balewa Square
                      </h4>
                      <p className="text-xs text-faded">
                        {dist !== null
                          ? `You are approximately ${dist} km from the venue.`
                          : "Locate your live distance and open direct Google Maps directions."}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={locate}
                      className="inline-flex items-center gap-2 bg-pine px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-ink transition-all hover:scale-105"
                    >
                      <MapPin className="h-4 w-4 text-sage" />
                      <span>Locate My Distance</span>
                    </button>
                    <a
                      href="https://www.google.com/maps/place/TAFAWA+BALEWA+SQUARE+MANAGEMENT+BOARD/@6.4470597,3.4022796,21z/data=!4m17!1m10!4m9!1m4!2m2!1d7.4705944!2d9.0802621!4e1!1m3!2m2!1d3.398!2d6.4475!3m5!1s0x103b8b171e80facf:0x3327c8431972bd22!8m2!3d6.447135!4d3.4024354!16s%2Fg%2F11k0tbk0kh?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-vivid px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-vivid-deep transition-all hover:scale-105"
                    >
                      <span>Take me to the event</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: House Rules & Walkthrough Video */}
          <div className="lg:col-span-5">
            <FadeIn direction="left" delay={0.08}>
              <TiltCard className="h-full">
                <div className="border border-ink/15 bg-white p-6 sm:p-8 shadow-md">
                  <h3 className="font-display text-2xl tracking-tight text-ink font-medium">
                    Event Rules of the Square
                  </h3>
                  <p className="mt-1 text-[13px] text-faded">
                    {EVENT.dateLong} - {EVENT.venue}
                  </p>
                  <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                    {RULES.map((r, i) => (
                      <div key={r.t}>
                        <button
                          onClick={() => setOpenRule(openRule === i ? null : i)}
                          className="flex w-full items-center justify-between gap-3 py-4 text-left"
                        >
                          <span className="flex items-center gap-3">
                            <r.icon className="h-5 w-5 text-fern" />
                            <span className="text-sm font-semibold text-ink">{r.t}</span>
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-faded transition-transform duration-300 ${
                              openRule === i ? "rotate-180 text-vivid" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {openRule === i && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="pb-4 pl-8 text-[13px] leading-relaxed text-faded"
                            >
                              {r.d}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                  <div className="relative mt-6 aspect-video overflow-hidden bg-mist rounded">
                    <video
                      src="/assets/lateef-highlight-video.mp4"
                      controls
                      preload="none"
                      poster="/assets/crowd-49.jpg"
                      className="h-full w-full object-cover"
                      aria-label="Venue walkthrough film"
                    />
                  </div>
                  <p className="mt-2 text-[12px] text-faded italic">
                    Walkthrough film from the previous seating.
                  </p>
                </div>
              </TiltCard>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Fullscreen Map Lightbox Modal */}
      <AnimatePresence>
        {fullscreenMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-black/90 p-4 sm:p-8 backdrop-blur-md"
            onClick={() => setFullscreenMap(false)}
          >
            <div className="flex items-center justify-between pb-4 text-white">
              <div>
                <h3 className="font-display text-xl font-semibold">
                  Nadwat Official 2D Layout Map
                </h3>
                <p className="text-xs text-white/70">
                  Tafawa Balewa Square Main Bowl Assembly Ground
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="/assets/NADWAT 2D MAP.png"
                  download="NADWAT-2D-VENUE-MAP.png"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 bg-vivid px-4 py-2 text-xs font-semibold text-white rounded-lg hover:bg-vivid-deep"
                >
                  <Download className="h-4 w-4" />
                  <span>Download High-Res 2D Map</span>
                </a>
                <button
                  onClick={() => setFullscreenMap(false)}
                  className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div
              className="relative flex-1 w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src="/assets/NADWAT 2D MAP.png"
                alt="Full resolution Nadwat 2D Layout Map"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
