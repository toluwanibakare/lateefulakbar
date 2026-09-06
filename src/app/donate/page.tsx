import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SadaqahGiving from "@/components/SadaqahGiving";
import { Reveal } from "@/components/ui";

export const metadata = {
  title: "Donate — Fund a Need at the Square",
  description: "Pick a campaign — mats, water, fans, broadcast, tents — and give through Paystack with a live progress target.",
};

export default function DonatePage() {
  return (
    <>
      <PageHeader
        eyebrow="Donate"
        title={<>Fund exactly what the Square needs</>}
        intro="Donate is targeted giving: choose a campaign with a live target — mats, water, cooling, broadcast, tents — and watch the bar move. For open, tithe-style giving of any amount, see Sadaqah."
        image="/assets/crowd-31.jpg"
      />
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
                  Sadaqah is the simple, tithe-style way — any amount via Paystack.
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
