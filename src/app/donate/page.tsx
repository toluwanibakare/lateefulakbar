import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SadaqahGiving from "@/components/SadaqahGiving";
import { Reveal } from "@/components/ui";

export const metadata = {
  title: "Support — You can support our needs to host the event",
  description: "Pick a campaign — mats, water, fans, broadcast, tents — with a live progress target.",
};

export default function DonatePage() {
  return (
    <>
      <PageHeader
        eyebrow="Support & Sadaqah"
        title={<>You can support our needs to host the event</>}
        intro="Support is targeted giving: choose a campaign with a live target — mats, water, cooling, broadcast, tents — and watch the bar move. For open, voluntary giving of any amount, see Sadaqah."
        image="/assets/crowd-31.jpg"
      />
      <section className="bg-cream border-b border-ink/10 py-12">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
          <Reveal>
            <p className="text-xs uppercase font-semibold tracking-[0.24em] text-fern">
              The Spiritual Reward of Giving
            </p>
            <blockquote className="font-display mt-4 text-xl sm:text-2xl font-light italic leading-relaxed text-ink">
              “The example of those who spend their wealth in the way of Allah is like a seed [of grain] which grows seven spikes; in each spike is a hundred grains. And Allah multiplies [His reward] for whom He wills. And Allah is all-Encompassing and Knowing.”
            </blockquote>
            <p className="mt-2 text-xs font-semibold tracking-wider text-pine uppercase">[Surah Al-Baqarah 2:261]</p>
            <div className="mt-6 space-y-2 text-sm leading-relaxed text-faded">
              <p>
                Giving Sadaqah (voluntary charity) for the sake of Allah brings immense rewards, multiplies like a growing harvest, and protects the giver from hardships.
              </p>
              <p className="font-medium text-ink italic">
                The Prophet Muhammad ﷺ said: “Give charity without delay, for it stands in the way of calamity.” (Sunan al-Tirmidhi)
              </p>
            </div>
          </Reveal>
        </div>
      </section>
      <SadaqahGiving />
      <section className="border-t border-ink/10 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-5 border border-ink/15 bg-cream p-6 sm:flex-row sm:items-center sm:p-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fern">
                  Prefer open giving?
                </p>
                <h2 className="font-display mt-2 text-2xl tracking-tight text-ink sm:text-3xl">
                  Sadaqah is the simple, voluntary way.
                </h2>
              </div>
              <Link
                href="/sadaqah"
                className="shrink-0 bg-vivid px-7 py-3.5 text-sm font-semibold text-white hover:bg-vivid-deep"
              >
                Go to Sadaqah
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
