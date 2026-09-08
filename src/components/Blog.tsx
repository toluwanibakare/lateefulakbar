"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/site";
import { Eyebrow, Reveal } from "./ui";

export default function Blog() {
  const [lead, ...rest] = BLOG_POSTS;
  return (
    <section id="blog" className="border-t border-ink/10 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
        <Reveal>
          <Eyebrow>08 - Blog</Eyebrow>
        </Reveal>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <Reveal delay={0.06}>
            <h2 className="font-display text-balance max-w-xl text-4xl leading-tight font-light tracking-tight text-ink sm:text-5xl">
              Blogs towards the gathering
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="max-w-sm text-sm leading-relaxed text-faded">
              Short reads on the meaning, the logistics and the memories. New entries until the gates open.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <Link href={`/blog/${lead.slug}`} className="group block cursor-pointer">
              <div className="relative aspect-[16/10] overflow-hidden bg-mist">
                <Image src={lead.image} alt={lead.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="img-true object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
              </div>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-fern">
                {lead.category} - {lead.date} - {lead.read}
              </p>
              <h3 className="font-display mt-2 max-w-lg text-3xl leading-tight tracking-tight text-ink group-hover:text-fern sm:text-4xl">
                {lead.title}
              </h3>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-faded">{lead.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-pine">
                Read the story <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </Reveal>

          <div className="flex flex-col divide-y divide-ink/10 border-y border-ink/10">
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <Link href={`/blog/${p.slug}`} className="group grid cursor-pointer gap-5 py-6 sm:grid-cols-[180px_1fr] sm:items-center">
                  <div className="relative aspect-[16/10] overflow-hidden bg-mist sm:aspect-[4/3]">
                    <Image src={p.image} alt={p.title} fill sizes="240px" className="img-true object-cover transition-transform duration-700 group-hover:scale-[1.05]" loading="lazy" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fern">
                      {p.category} - {p.date} - {p.read}
                    </p>
                    <h3 className="font-display mt-1.5 text-2xl leading-snug tracking-tight text-ink group-hover:text-fern">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-faded">{p.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}

            <div className="bg-cream p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fern">Dispatches</p>
              <p className="mt-2 text-sm leading-relaxed text-faded">
                Get gate announcements and new blog posts by email. One message a week, nothing else.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex gap-2">
                <input type="email" required placeholder="you@example.com" aria-label="Email address" className="min-w-0 flex-1 border border-ink/20 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-pine focus:outline-none" />
                <button type="submit" className="shrink-0 bg-vivid px-5 py-3 text-sm font-semibold text-white hover:bg-vivid-deep">
                  Follow
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
