"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Heart, Users, MapPin } from "lucide-react";
import Hero from "@/components/Hero";
import VenueMapAndRules from "@/components/VenueMapAndRules";
import {
  AnimatedCounter,
  CountdownStrip,
  Eyebrow,
  FadeIn,
  ParallaxImage,
  Reveal,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  TiltCard,
} from "@/components/ui";
import { BLOG_POSTS, EVENT, GALLERY, PRAYER_PAGES } from "@/lib/site";

function ViewMore({ href, children = "View more", dark = false }: { href: string; children?: string; dark?: boolean }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-sm font-semibold ${dark ? "text-white" : "text-pine"}`}
    >
      <span className={`border-b ${dark ? "border-emerald-400/50 text-emerald-400 group-hover:border-emerald-300 group-hover:text-emerald-300" : "border-pine/40 group-hover:border-pine"} pb-0.5 transition-colors`}>{children}</span>
      <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${dark ? "text-emerald-400 group-hover:text-emerald-300" : ""}`} />
    </Link>
  );
}

export default function Home() {
  const preview = GALLERY.slice(0, 4);

  return (
    <div className="min-h-screen bg-white font-body text-ink overflow-hidden">
      <main>
        <Hero />

        {/* Dynamic Quick Stat Banner */}
        <section className="border-y border-ink/10 bg-pine text-white py-8">
          <div className="mx-auto max-w-7xl px-5 sm:px-6">
            <StaggerContainer staggerDelay={0.15} className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <StaggerItem className="flex flex-col items-center text-center">
                <span className="font-display text-3xl sm:text-4xl font-light text-sage">
                  <AnimatedCounter to={200000} suffix="+" />
                </span>
                <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                  Worshippers Expected
                </span>
              </StaggerItem>
              <StaggerItem className="flex flex-col items-center text-center">
                <span className="font-display text-3xl sm:text-4xl font-light text-sage">
                  <AnimatedCounter to={500} suffix="k+" />
                </span>
                <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                  Supplications Raised
                </span>
              </StaggerItem>
              <StaggerItem className="flex flex-col items-center text-center">
                <span className="font-display text-3xl sm:text-4xl font-light text-sage">
                  <AnimatedCounter to={100} suffix="%" />
                </span>
                <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                  Unified Dhikr Tone
                </span>
              </StaggerItem>
              <StaggerItem className="flex flex-col items-center text-center">
                <span className="font-display text-3xl sm:text-4xl font-light text-sage">
                  Free Access
                </span>
                <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                  All Gates Open
                </span>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* Gathering teaser */}
        <section className="bg-paper">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
            <FadeIn direction="right" blur>
              <Eyebrow>The gathering</Eyebrow>
              <h2 className="font-display text-balance mt-4 text-4xl leading-tight font-light tracking-tight sm:text-5xl">
                One day. One square. One voice.
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-faded">
                Lateef ul-il-Akbar-Il-A’azam is Nadwat&apos;s grand seating of dhikr — tens of
                thousands in white under the Name Yaa Lateef. No headline acts; the crowd&apos;s
                recitation is the event.
              </p>
              <div className="mt-6">
                <ViewMore href="/gathering">Explore the gathering</ViewMore>
              </div>
            </FadeIn>
            <FadeIn direction="left" delay={0.15}>
              <TiltCard className="overflow-hidden shadow-xl">
                <div className="relative aspect-[16/11] overflow-hidden bg-mist">
                  <Image src="/assets/crowd-67.jpg" alt="A sea of worshippers in white at TBS" fill sizes="(max-width: 1024px) 100vw, 50vw" className="img-true object-cover transition-transform duration-700 hover:scale-105" />
                </div>
              </TiltCard>
              <p className="mt-3 text-xs text-faded italic">Previous seating — the Square in white.</p>
            </FadeIn>
          </div>
        </section>

        {/* Founder teaser */}
        <section className="border-t border-ink/10 bg-cream">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-12">
            <ScaleIn className="lg:col-span-4">
              <TiltCard className="shadow-lg">
                <div className="relative aspect-[3/4] overflow-hidden bg-sage">
                  <Image src="/assets/founder-portrait.jpg" alt="Shaikh Dr. Abdur Rahman Ade Lawal" fill sizes="(max-width: 1024px) 100vw, 33vw" className="img-true object-cover object-top transition-transform duration-700 hover:scale-105" />
                </div>
              </TiltCard>
            </ScaleIn>
            <div className="lg:col-span-8">
              <FadeIn direction="up">
                <Eyebrow>The convener</Eyebrow>
              </FadeIn>
              <FadeIn direction="up" delay={0.1} blur>
                <blockquote className="font-display text-balance mt-4 text-3xl leading-snug font-light tracking-tight sm:text-4xl">
                  “When a people agree to ask Allah with one heart, He answers in ways no
                  committee can plan.”
                </blockquote>
                <p className="mt-4 text-sm text-faded">
                  Shaikh Dr. Abdur Rahman Ade Lawal — Chief Missioner, Nadwat Global Assembly.
                </p>
              </FadeIn>
              <FadeIn direction="up" delay={0.2}>
                <div className="mt-6">
                  <ViewMore href="/founder">Meet the convener</ViewMore>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Gallery preview */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <FadeIn direction="up">
                <Eyebrow>Gallery</Eyebrow>
                <h2 className="font-display mt-4 max-w-xl text-4xl font-light tracking-tight sm:text-5xl">
                  Kept as it was
                </h2>
              </FadeIn>
              <FadeIn direction="left" delay={0.1}>
                <ViewMore href="/gallery">Open the full archive</ViewMore>
              </FadeIn>
            </div>
            <StaggerContainer staggerDelay={0.08} className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {preview.map((g) => (
                <StaggerItem key={g.src}>
                  <TiltCard>
                    <Link href="/gallery" className="group block">
                      <span className="relative block aspect-[3/4] overflow-hidden bg-mist">
                        <Image src={g.src} alt={g.label} fill sizes="(max-width: 768px) 50vw, 25vw" className="img-true object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      </span>
                      <span className="mt-2 block text-[12px] leading-snug text-faded">{g.label}</span>
                    </Link>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Support vs Sadaqah — the split, explained briefly */}
        <section className="border-t border-ink/10 bg-cream">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24">
            <FadeIn direction="up">
              <Eyebrow>Giving — two clear paths</Eyebrow>
            </FadeIn>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <FadeIn direction="right" delay={0.1}>
                <TiltCard className="h-full">
                  <div className="flex h-full flex-col border border-ink/15 bg-white p-6 sm:p-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fern">Support</p>
                    <h3 className="font-display mt-2 text-3xl tracking-tight">You can support our needs to host the event</h3>
                    <p className="mt-3 text-sm leading-relaxed text-faded">
                      Mats, water, cooling fans, broadcast, tents — pick a campaign, watch the bar
                      move, and contribute directly.
                    </p>
                    <div className="relative mt-5 aspect-[16/8] overflow-hidden bg-mist">
                      <Image src="/assets/crowd-31.jpg" alt="Prayer mats laid for the gathering" fill sizes="(max-width: 1024px) 100vw, 45vw" className="img-true object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href="/donate" className="inline-flex items-center gap-2 bg-vivid px-6 py-3 text-sm font-semibold text-white hover:bg-vivid-deep transition-all hover:shadow-lg">
                        Support Now <ArrowUpRight className="h-4 w-4" />
                      </Link>
                      <span className="self-center font-mono text-[11px] text-faded">1,000 mats · 2,000 water packs · 700 fans…</span>
                    </div>
                  </div>
                </TiltCard>
              </FadeIn>
              <FadeIn direction="left" delay={0.2}>
                <TiltCard className="h-full">
                  <div className="flex h-full flex-col bg-pine p-6 text-white sm:p-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sage">Sadaqah</p>
                    <h3 className="font-display mt-2 text-3xl tracking-tight">Simple voluntary giving</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/75">
                      Any amount, given with sincerity — pooled where the gathering needs it most.
                    </p>
                    <p lang="ar" className="font-arabic mt-5 text-xl text-sage/90">يَـٰٓأَيُّهَا ٱللَّذِينَ ءَامَنُوٓا۟ إِن تَنصُرُوا۟ ٱللَّهَ يَنصُرْكُمْ وَيُثَبِّتْ أَقْدَامَكُمْ</p>
                    <p className="mt-2 text-xs italic text-sage/80">
                      “O believers! If you stand up for Allah, He will help you and make your steps firm.” — Q 47:7
                    </p>
                    <div className="mt-6">
                      <Link href="/sadaqah" className="inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-semibold text-pine hover:bg-mist transition-all hover:shadow-lg">
                        Give Sadaqah <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </TiltCard>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Register teaser */}
        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
            <FadeIn direction="right">
              <TiltCard className="shadow-lg">
                <div className="relative aspect-[16/10] overflow-hidden bg-mist">
                  <Image src="/assets/crowd-12.jpg" alt="Worshippers arriving at the gates" fill sizes="(max-width: 1024px) 100vw, 50vw" className="img-true object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                </div>
              </TiltCard>
            </FadeIn>
            <FadeIn direction="left" delay={0.15}>
              <Eyebrow>Registration — free</Eyebrow>
              <h2 className="font-display mt-4 text-4xl font-light tracking-tight sm:text-5xl">
                Your pass in three short steps
              </h2>
              <ol className="mt-5 space-y-2.5 text-sm text-faded">
                <li><strong className="text-ink">1.</strong> Who is coming — name, contact, canopy</li>
                <li><strong className="text-ink">2.</strong> How you join — city, physical or online</li>
                <li><strong className="text-ink">3.</strong> Photo — printed on your pass artwork</li>
              </ol>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/register" className="bg-vivid px-7 py-3.5 text-sm font-semibold text-white hover:bg-vivid-deep transition-all hover:shadow-lg">
                  Start registration
                </Link>
                <span className="self-center text-[12px] text-faded">{EVENT.dateLong} · {EVENT.dressCode}</span>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Location & Directions */}
        <section className="border-t border-ink/10 bg-cream">
          <VenueMapAndRules />
        </section>

        {/* Blog teaser */}
        <section className="border-t border-ink/10 bg-paper">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <FadeIn direction="up">
                <Eyebrow>Blog</Eyebrow>
                <h2 className="font-display mt-4 text-4xl font-light tracking-tight sm:text-5xl">
                  Blogs towards the gathering
                </h2>
              </FadeIn>
              <FadeIn direction="left" delay={0.1}>
                <ViewMore href="/blog">All posts</ViewMore>
              </FadeIn>
            </div>
            <StaggerContainer staggerDelay={0.1} className="mt-10 grid gap-8 md:grid-cols-3">
              {BLOG_POSTS.map((p) => (
                <StaggerItem key={p.slug}>
                  <TiltCard>
                    <Link href={`/blog/${p.slug}`} className="group block">
                      <span className="relative block aspect-[16/10] overflow-hidden bg-mist">
                        <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="img-true object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      </span>
                      <span className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.2em] text-fern">{p.category} · {p.read}</span>
                      <span className="font-display mt-1.5 block text-xl leading-snug tracking-tight group-hover:text-fern transition-colors">{p.title}</span>
                    </Link>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Prayer book + Live + Venue teasers */}
        <section className="border-t border-ink/10 bg-white">
          <StaggerContainer staggerDelay={0.12} className="mx-auto grid max-w-7xl gap-6 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-3">
            <StaggerItem>
              <TiltCard className="h-full">
                <div className="flex h-full flex-col border border-ink/15 bg-cream p-0 overflow-hidden group">
                  <div
                    style={{ aspectRatio: "603 / 855" }}
                    className="relative w-full overflow-hidden bg-emerald-950 flex items-center justify-center group"
                  >
                    <Image
                      src="/assets/prayerbook_cover.png"
                      alt="Official Asalatu Prayer Book Cover"
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-emerald-500/30 text-white pointer-events-none">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">208 Pages</span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fern">Prayer book</p>
                      <h3 className="font-display mt-2 text-2xl tracking-tight text-ink">Read the supplications</h3>
                    </div>
                    <div className="mt-6">
                      <ViewMore href="/prayer-book">Open the book</ViewMore>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </StaggerItem>
            <StaggerItem>
              <TiltCard className="h-full">
                <div className="flex h-full flex-col bg-pine p-6 text-white sm:p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sage">Live Tasbīh</p>
                  <h3 className="font-display mt-3 text-2xl tracking-tight">The Square, wherever you are</h3>
                  <div className="mt-5 border-t border-white/15 pt-5">
                    <CountdownStrip dark />
                  </div>
                  <div className="mt-6">
                    <Link href="/live" className="group inline-flex items-center gap-2 text-sm font-semibold text-white">
                      <span className="border-b border-white/40 pb-0.5 transition-colors group-hover:border-white">Watch & join the the supplication</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </TiltCard>
            </StaggerItem>
            <StaggerItem>
              <TiltCard className="h-full">
                <div className="flex h-full flex-col border border-ink/15 bg-white p-0">
                  <div className="relative aspect-[16/9] overflow-hidden bg-mist">
                    <Image src="/assets/drone-wide.png" alt="Aerial view of Tafawa Balewa Square" fill sizes="(max-width: 1024px) 100vw, 33vw" className="img-true object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fern">Venue</p>
                    <h3 className="font-display mt-3 text-2xl tracking-tight">Tafawa Balewa Square</h3>
                    <p className="mt-2 text-sm leading-relaxed text-faded">Gates, canopies, parking, medical — plus your route from anywhere.</p>
                    <div className="mt-6"><ViewMore href="/venue">Plan your visit</ViewMore></div>
                  </div>
                </div>
              </TiltCard>
            </StaggerItem>
          </StaggerContainer>
        </section>
      </main>
    </div>
  );
}
