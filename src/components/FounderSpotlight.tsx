"use client";

import Image from "next/image";
import { GraduationCap, BookOpenText, HeartHandshake, Globe2, Quote } from "lucide-react";
import { Eyebrow, FadeIn, ScaleIn, StaggerContainer, StaggerItem, TiltCard } from "./ui";

const CREDENTIALS = [
  { icon: GraduationCap, t: "Ph.D, Mass Communication", d: "Scholarship with a strategist’s clarity." },
  { icon: BookOpenText, t: "Al-Azhar trained", d: "Grounded in classical Islamic learning." },
  { icon: Globe2, t: "U.S. IVLP alumnus", d: "A global outlook on faith and civic life." },
  { icon: HeartHandshake, t: "Counsellor & author", d: "Marriages mended, books that guide homes." },
];

export default function FounderSpotlight() {
  return (
    <section id="founder" className="overflow-hidden bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
        <FadeIn direction="up">
          <Eyebrow>The vision - Convener</Eyebrow>
        </FadeIn>

        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Portrait - tall, archival, with caption plate */}
          <ScaleIn className="lg:col-span-5" delay={0.06}>
            <figure>
              <TiltCard className="shadow-xl">
                <div className="relative aspect-[3/4] overflow-hidden bg-sage">
                  <Image
                    src="/assets/founder-portrait.jpg"
                    alt="Shaikh Dr. Abdur Rahman Ade Lawal in white, hands raised in du‘a"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="img-true object-cover object-top transition-transform duration-700 hover:scale-105"
                    priority={false}
                  />
                </div>
              </TiltCard>
              <figcaption className="flex items-baseline justify-between border-b border-ink/15 py-3">
                <span className="font-display text-lg text-ink font-medium">
                  Shaikh Dr. Abdur Rahman Ade Lawal
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fern">
                  The Convener
                </span>
              </figcaption>
              <p className="mt-2 text-xs leading-relaxed text-faded">
                Ph.D, Mnipr - Nadwat Global Assembly. Photographed in the all-white of the
                gathering.
              </p>
            </figure>
          </ScaleIn>

          {/* Editorial text */}
          <div className="lg:col-span-7 lg:pl-6">
            <FadeIn direction="up" delay={0.1} blur>
              <Quote className="h-8 w-8 text-gilt" aria-hidden />
              <blockquote className="font-display text-balance mt-4 text-3xl leading-[1.15] font-light tracking-tight text-ink sm:text-[2.75rem]">
                “When a people agree to ask Allah with one heart, He answers in ways no
                committee can plan.”
              </blockquote>
            </FadeIn>
            <FadeIn direction="up" delay={0.16}>
              <div className="mt-7 grid gap-6 text-[15px] leading-relaxed text-faded sm:grid-cols-2">
                <p>
                  Shaikh Dr. Lawal convenes Lateeful-Ul-Akbar as an act of return - away from
                  noise, toward the quiet power of collective dhikr. His call is simple: dress
                  alike, sit together, and let the Name <em className="text-ink font-semibold">Yaa Lateef</em> do
                  its work on hardened hearts.
                </p>
                <p>
                  Under his leadership Nadwat has grown into a disciplined spiritual family -
                  educated, hospitable, and exact about order. The Square’s calm on the day is no
                  accident; it is his imprint.
                </p>
              </div>
            </FadeIn>
            <StaggerContainer staggerDelay={0.06} className="mt-8 grid gap-px bg-ink/10 sm:grid-cols-2">
              {CREDENTIALS.map((c) => (
                <StaggerItem key={c.t} className="bg-cream">
                  <TiltCard className="h-full">
                    <div className="flex h-full gap-3 bg-cream p-5">
                      <c.icon className="h-5 w-5 shrink-0 text-fern" />
                      <div>
                        <h3 className="text-sm font-semibold text-ink">{c.t}</h3>
                        <p className="mt-1 text-[13px] text-faded">{c.d}</p>
                      </div>
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
            <FadeIn direction="up" delay={0.25}>
              <TiltCard className="relative mt-8 aspect-[16/7] overflow-hidden shadow-md">
                <Image
                  src="/assets/crowd-15.jpg"
                  alt="The founder leading dhikr among worshippers"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="img-true object-cover transition-transform duration-700 hover:scale-105"
                />
              </TiltCard>
              <p className="mt-2 text-xs text-faded italic">Leading the recitation - previous seating.</p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
