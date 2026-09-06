"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Hero from "@/components/Hero";
import { CountdownStrip, Eyebrow, Reveal } from "@/components/ui";
import { BLOG_POSTS, EVENT, GALLERY, PRAYER_PAGES } from "@/lib/site";

function ViewMore({ href, children = "View more" }: { href: string; children?: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-sm font-semibold text-pine"
    >
      <span className="border-b border-pine/40 pb-0.5 group-hover:border-pine">{children}</span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export default function Home() {
  const preview = GALLERY.slice(0, 4);

  return (
    <div className="min-h-screen bg-white font-body text-ink">
      <main>
        <Hero />

        {/* Gathering teaser */}
        <section className="bg-paper">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>The gathering</Eyebrow>
              <h2 className="font-display text-balance mt-4 text-4xl leading-tight font-light tracking-tight sm:text-5xl">
                One morning. One square. One voice.
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-faded">
                Lateeful-Ul-Akbar Li-A’azam is Nadwat&apos;s grand sitting of dhikr — tens of
                thousands in white under the Name Yā Lateef. No headline acts; the crowd&apos;s
                recitation is the event.
              </p>
              <div className="mt-6">
                <ViewMore href="/gathering">Explore the gathering</ViewMore>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative aspect-[16/11] overflow-hidden bg-mist">
                <Image src="/assets/crowd-67.jpg" alt="A sea of worshippers in white at TBS" fill sizes="(max-width: 1024px) 100vw, 50vw" className="img-true object-cover" />
              </div>
              <p className="mt-2 text-xs text-faded italic">Previous sitting — the Square in white.</p>
            </Reveal>
          </div>
        </section>

        {/* Founder teaser */}
        <section className="border-t border-ink/10 bg-cream">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <div className="relative aspect-[3/4] overflow-hidden bg-sage">
                <Image src="/assets/founder-portrait.jpg" alt="Shaikh Dr. Abdur Rahman Ade Lawal" fill sizes="(max-width: 1024px) 100vw, 33vw" className="img-true object-cover object-top" />
              </div>
            </Reveal>
            <div className="lg:col-span-8">
              <Reveal>
                <Eyebrow>The founder</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <blockquote className="font-display text-balance mt-4 text-3xl leading-snug font-light tracking-tight sm:text-4xl">
                  “When a people agree to ask Allah with one heart, He answers in ways no
                  committee can plan.”
                </blockquote>
                <p className="mt-4 text-sm text-faded">
                  Shaikh Dr. Abdur Rahman Ade Lawal — Chief Missioner, Nadwat Global Assembly.
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-6">
                  <ViewMore href="/founder">Meet the vision</ViewMore>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Gallery preview */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Reveal>
                <Eyebrow>Gallery</Eyebrow>
                <h2 className="font-display mt-4 max-w-xl text-4xl font-light tracking-tight sm:text-5xl">
                  Kept as it was
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <ViewMore href="/gallery">Open the full archive</ViewMore>
              </Reveal>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {preview.map((g, i) => (
                <Reveal key={g.src} delay={i * 0.06}>
                  <Link href="/gallery" className="group block">
                    <span className="relative block aspect-[3/4] overflow-hidden bg-mist">
                      <Image src={g.src} alt={g.label} fill sizes="(max-width: 768px) 50vw, 25vw" className="img-true object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
                    </span>
                    <span className="mt-2 block text-[12px] leading-snug text-faded">{g.label}</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Donate vs Sadaqah — the split, explained briefly */}
        <section className="border-t border-ink/10 bg-cream">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24">
            <Reveal>
              <Eyebrow>Giving — two clear paths</Eyebrow>
            </Reveal>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <Reveal delay={0.06}>
                <div className="flex h-full flex-col border border-ink/15 bg-white p-6 sm:p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fern">Donate</p>
                  <h3 className="font-display mt-2 text-3xl tracking-tight">Fund a need with a target</h3>
                  <p className="mt-3 text-sm leading-relaxed text-faded">
                    Mats, water, cooling fans, broadcast, tents — pick a campaign, watch the bar
                    move, give through Paystack.
                  </p>
                  <div className="relative mt-5 aspect-[16/8] overflow-hidden bg-mist">
                    <Image src="/assets/crowd-31.jpg" alt="Prayer mats laid for the gathering" fill sizes="(max-width: 1024px) 100vw, 45vw" className="img-true object-cover" loading="lazy" />
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/donate" className="inline-flex items-center gap-2 bg-vivid px-6 py-3 text-sm font-semibold text-white hover:bg-vivid-deep">
                      Donate <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <span className="self-center font-mono text-[11px] text-faded">1,000 mats · 2,000 water packs · 700 fans…</span>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="flex h-full flex-col bg-pine p-6 text-white sm:p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sage">Sadaqah</p>
                  <h3 className="font-display mt-2 text-3xl tracking-tight">Simple giving, like a tithe</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">
                    Any amount, once or monthly — pooled where the gathering needs it most. Paid
                    in under a minute through Paystack.
                  </p>
                  <p lang="ar" className="font-arabic mt-5 text-xl text-sage/90">مَا عِندَكُمْ يَنفَدُ وَمَا عِندَ ٱللَّٰهِ بَاقٍ</p>
                  <div className="mt-6">
                    <Link href="/sadaqah" className="inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-semibold text-pine hover:bg-mist">
                      Give Sadaqah <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Register teaser */}
        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-[16/10] overflow-hidden bg-mist">
                <Image src="/assets/crowd-12.jpg" alt="Worshippers arriving at the gates" fill sizes="(max-width: 1024px) 100vw, 50vw" className="img-true object-cover" loading="lazy" />
              </div>
            </Reveal>
            <Reveal delay={0.08}>
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
                <Link href="/register" className="bg-vivid px-7 py-3.5 text-sm font-semibold text-white hover:bg-vivid-deep">
                  Start registration
                </Link>
                <span className="self-center text-[12px] text-faded">{EVENT.dateLong} · {EVENT.dressCode}</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Journal teaser */}
        <section className="border-t border-ink/10 bg-paper">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Reveal>
                <Eyebrow>Journal</Eyebrow>
                <h2 className="font-display mt-4 text-4xl font-light tracking-tight sm:text-5xl">
                  Notes toward the Square
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <ViewMore href="/journal">All entries</ViewMore>
              </Reveal>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {BLOG_POSTS.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.06}>
                  <Link href={`/journal/${p.slug}`} className="group block">
                    <span className="relative block aspect-[16/10] overflow-hidden bg-mist">
                      <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="img-true object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
                    </span>
                    <span className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.2em] text-fern">{p.category} · {p.read}</span>
                    <span className="font-display mt-1.5 block text-xl leading-snug tracking-tight group-hover:text-fern">{p.title}</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Prayer book + Live + Venue teasers */}
        <section className="border-t border-ink/10 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-3">
            <Reveal>
              <div className="flex h-full flex-col border border-ink/15 bg-cream p-6 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fern">Prayer book</p>
                <h3 className="font-display mt-3 text-2xl tracking-tight">Read the supplications</h3>
                <p lang="ar" className="font-arabic mt-4 text-xl leading-loose text-pine">{PRAYER_PAGES[0].arabic}</p>
                <p className="mt-2 text-sm text-faded">{PRAYER_PAGES[0].transliteration}</p>
                <div className="mt-6"><ViewMore href="/prayer-book">Open the book</ViewMore></div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex h-full flex-col bg-pine p-6 text-white sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sage">Live Tasbīh</p>
                <h3 className="font-display mt-3 text-2xl tracking-tight">The Square, wherever you are</h3>
                <div className="mt-5 border-t border-white/15 pt-5">
                  <CountdownStrip dark />
                </div>
                <div className="mt-6">
                  <Link href="/live" className="group inline-flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="border-b border-white/40 pb-0.5 group-hover:border-white">Watch & join the Tasbīh</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="flex h-full flex-col border border-ink/15 bg-white p-0">
                <div className="relative aspect-[16/9] overflow-hidden bg-mist">
                  <Image src="/assets/drone-wide.png" alt="Aerial view of Tafawa Balewa Square" fill sizes="(max-width: 1024px) 100vw, 33vw" className="img-true object-cover" loading="lazy" />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fern">Venue</p>
                  <h3 className="font-display mt-3 text-2xl tracking-tight">Tafawa Balewa Square</h3>
                  <p className="mt-2 text-sm leading-relaxed text-faded">Gates, canopies, parking, medical — plus your route from anywhere.</p>
                  <div className="mt-6"><ViewMore href="/venue">Plan your visit</ViewMore></div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}
