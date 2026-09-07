import PageHeader from "@/components/PageHeader";
import FounderSpotlight from "@/components/FounderSpotlight";
import { Reveal } from "@/components/ui";

export const metadata = {
  title: "The Founder — Shaikh Dr. Abdur Rahman Ade Lawal",
  description: "The vision behind Lateeful-Ul-Akbar: Shaikh Dr. Abdur Rahman Ade Lawal, Chief Missioner of Nadwat Global Assembly.",
};

export default function FounderPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Founder"
        title={<>Shaikh Dr. Abdur Rahman Ade Lawal — The Founder & Visionary</>}
        intro="Shaikh Dr. Abdur Rahman Ade Lawal convenes Lateeful-Ul-Akbar as an act of return — away from noise, toward the quiet power of collective dhikr. Al-Azhar trained, Ph.D in Mass Communication, counsellor and author."
        image="/assets/crowd-15.jpg"
      />
      <FounderSpotlight />
      <section className="border-t border-ink/10 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <h2 className="font-display text-3xl font-light tracking-tight text-ink sm:text-4xl">
                Why he gathers the city in white
              </h2>
              <div className="mt-5 space-y-5 text-[15px] leading-relaxed text-faded">
                <p>
                  The instruction is deliberate: dress alike so no one stands out, sit together so
                  no one is a stranger, and recite one Name until hardened hearts soften. The
                  Square&apos;s calm on the day — elders beside youth, first-time guests beside
                  scholars — is his imprint: disciplined, hospitable, exact about order.
                </p>
                <p>
                  Under his leadership Nadwat Global Assembly has grown into a spiritual family
                  raised on the Qur&apos;an and Sunnah — educated, united, and committed to
                  collective du&apos;ā as a civic act. Lateeful-Ul-Akbar is its largest expression:
                  a city asking with one voice.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-5">
              <div className="border border-ink/15 bg-cream p-6 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fern">
                  At a glance
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-faded">
                  <li><strong className="text-ink">Chief Missioner,</strong> Nadwat Global Assembly</li>
                  <li><strong className="text-ink">Al-Azhar trained,</strong> grounded in classical learning</li>
                  <li><strong className="text-ink">Ph.D, Mass Communication</strong> — scholarship with clarity</li>
                  <li><strong className="text-ink">U.S. IVLP alumnus</strong> — faith and civic life, globally</li>
                  <li><strong className="text-ink">Counsellor & author</strong> — marriages mended, homes guided</li>
                </ul>
                <a href="/gathering" className="mt-6 inline-flex border-b border-pine/40 pb-0.5 text-sm font-semibold text-pine hover:border-pine">
                  Understand the gathering →
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
