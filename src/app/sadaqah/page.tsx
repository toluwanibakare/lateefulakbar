import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SadaqahQuickGive from "@/components/SadaqahQuickGive";
import { Reveal } from "@/components/ui";

export const metadata = {
  title: "Sadaqah — Give Any Amount",
  description: "Simple tithe-style sadaqah: any amount, securely through Paystack. Pools into wherever the gathering needs it most.",
};

const FAQS = [
  { q: "Is Sadaqah different from Donate?", a: "Yes. Sadaqah is open, free-will giving of any amount — like setting aside a tithe — pooled where needed most. Donate funds a specific campaign (mats, water, fans) with a live target bar." },
  { q: "How do I pay?", a: "Through Paystack — card, bank transfer, USSD or Verve. You get a receipt by email and SMS immediately." },
  { q: "Can I give monthly?", a: "Yes. Choose “Make it monthly” on the form and your sadaqah repeats until you cancel from your receipt link." },
  { q: "Can I give anonymously?", a: "Yes. Tick “Give anonymously” and your name is kept off every public mention. The reward remains with Allah." },
];

export default function SadaqahPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sadaqah"
        title={<>Sadaqah, kept simple</>}
        arabic="وَمَا تُنفِقُوا مِنْ خَيْرٍ فَلِلَّهِ"
        intro="Whatever good you give is for Allah. Set aside any amount — once or monthly — and pay in under a minute through Paystack. This is the tithe-style giving; campaigns with targets live under Donate."
        image="/assets/crowd-08.jpg"
      />
      <SadaqahQuickGive />
      <section className="border-t border-ink/10 bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-20">
          <Reveal>
            <h2 className="font-display text-3xl font-light tracking-tight text-ink sm:text-4xl">
              Questions, answered plainly
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-px bg-ink/10 md:grid-cols-2">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={Math.min(i * 0.05, 0.15)} className="bg-cream">
                <div className="h-full bg-cream p-6 sm:p-8">
                  <h3 className="text-[15px] font-semibold text-ink">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-faded">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <p className="mt-8 text-sm text-faded">
              Funding something specific?{" "}
              <Link href="/donate" className="font-semibold text-pine underline underline-offset-4 hover:text-fern">
                Browse Donate campaigns
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
