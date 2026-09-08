import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { BLOG_POSTS } from "@/lib/site";
import { Reveal } from "@/components/ui";

const BODIES: Record<string, string[]> = {
  "sea-of-white": [
    "Tafawa Balewa Square holds noise well — it was built for parades and crowds. On the day of the seating, it held silence better. Forty thousand people in white, breathing the same dhikr, and the loudest thing for long stretches was water being passed hand to hand.",
    "Stewards will tell you the order is the worship. Sections settle by canopy, shoes aligned, mats edge to edge. From the drone the Square stops looking like a crowd and starts looking like cloth — one fabric, briefly unseamed by the service lanes.",
    "If you come for the first time, come early. Watch the Square fill. That slow whitening of the stands is the closest thing Lagos has to dawn arriving twice.",
  ],
  "ya-lateef": [
    "Al-Lateef — the Most Gentle, the Most Subtle. The kindness that arrives before you ask, the opening that appears inside difficulty without breaking anything. Scholars linger on this Name because it answers the quiet fear: that our affairs are too tangled for mercy to find.",
    "At the gathering the Name is recited long and low, led from the stage and answered by the whole Square. There is no hurry in it. Guests are asked to bring one private need and hold it lightly through the recitation — the asking is the worship.",
    "Come with ablution, come in white, come having forgiven one person. That is the whole preparation the convener asks of first-time guests.",
  ],
  "tbs-logistics": [
    "Brothers sit in the ordered canopy on one side, sisters under the great canopy on the other — stewarded by section, first come first served. Elders and guests with medical needs are seated nearest the service lanes; tell a steward at the gate and you will be walked there.",
    "Water moves through the rows all morning, funded by sadaqah. Fans hold the midday heat under the canopies. There are no vehicles inside the Bowl — all cars and buses use the perimeter lots outside the Square.",
    "Gates open at 08:00 with accreditation and QR scanning. The opening and Bismillah follow at 09:30, the long Yaa Lateef seating at 10:30, reflections at midday, and the grand du‘ā — the day's peak — at 14:00. Dispersal is orderly, section by section.",
  ],
};

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export default async function BlogArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();
  const body = BODIES[post.slug] ?? [post.excerpt];
  const others = BLOG_POSTS.filter((p) => p.slug !== post.slug);

  return (
    <>
      <PageHeader
        eyebrow={`${post.category} — ${post.date} — ${post.read}`}
        title={<>{post.title}</>}
        intro={post.excerpt}
        image={post.image}
      />
      <article className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6 md:py-20">
          <Reveal>
            <div className="relative aspect-[16/9] overflow-hidden bg-mist">
              <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" className="img-true object-cover" priority />
            </div>
          </Reveal>
          <div className="mt-10 space-y-6">
            {body.map((para, i) => (
              <Reveal key={i} delay={Math.min(i * 0.05, 0.15)}>
                <p className={`leading-relaxed text-faded ${i === 0 ? "font-display text-xl text-ink sm:text-2xl" : "text-[15px] sm:text-base"}`}>
                  {para}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-wrap gap-3 border-t border-ink/10 pt-8">
              <Link href="/register" className="bg-vivid px-6 py-3 text-sm font-semibold text-white hover:bg-vivid-deep">
                Register free
              </Link>
              <Link href="/blog" className="border border-ink/20 px-6 py-3 text-sm font-semibold text-ink hover:border-pine hover:text-pine">
                ← All blog posts
              </Link>
            </div>
          </Reveal>
        </div>
      </article>
      <section className="border-t border-ink/10 bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fern">Keep reading</p>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {others.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group grid gap-4 sm:grid-cols-[200px_1fr] sm:items-center">
                <span className="relative block aspect-[16/10] overflow-hidden bg-mist">
                  <Image src={p.image} alt="" fill sizes="300px" className="img-true object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                </span>
                <span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fern">{p.category} — {p.read}</span>
                  <span className="font-display mt-1 block text-xl tracking-tight text-ink group-hover:text-fern">{p.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
