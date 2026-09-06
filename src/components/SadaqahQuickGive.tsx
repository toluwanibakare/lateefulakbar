"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, HeartHandshake, Lock, ShieldCheck } from "lucide-react";
import { Eyebrow, Reveal } from "./ui";

const PRESETS = [1000, 2500, 5000, 10000, 25000, 50000];

function fmt(n: number) {
  return n.toLocaleString("en-NG");
}

const IMPACT = [
  { amount: "₦1,000", text: "Cold water for a row of guests through the morning dhikr." },
  { amount: "₦5,000", text: "A share in mats, shade and sound for the Square." },
  { amount: "₦25,000", text: "A full cooling fan hour — relief for hundreds at midday." },
];

/**
 * Sadaqah — free-will giving, tithe-style.
 * Simple amount → Paystack. Separate from Donate (targeted campaigns).
 */
export default function SadaqahQuickGive() {
  const [amount, setAmount] = useState<number | null>(5000);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [monthly, setMonthly] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [done, setDone] = useState(false);

  const effective = custom ? parseFloat(custom) || 0 : amount || 0;

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    if (effective < 100 || !name || !email) return;
    // Frontend phase: simulate Paystack handoff. Wire to Paystack inline here later.
    setDone(true);
  };

  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-12">
        {/* Left: meaning */}
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow>Sadaqah — like a tithe, from the heart</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display text-balance mt-5 text-4xl leading-tight font-light tracking-tight text-ink sm:text-5xl">
              Give any amount. Allah multiplies the rest.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-faded">
              Sadaqah here is simple free-will giving — the way a tithe is set aside willingly,
              not tied to one item. It pools into wherever the gathering needs it most: water,
              mats, sound, shade, broadcast. Paid securely through Paystack in under a minute.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="font-arabic mt-6 text-2xl leading-loose text-fern" lang="ar">
              مَا عِندَكُمْ يَنفَدُ وَمَا عِندَ ٱللَّٰهِ بَاقٍ
            </p>
            <p className="mt-2 max-w-md text-[13px] text-faded italic">
              What you possess ends, and what is with Allah remains. (Qur’an 16:96)
            </p>
          </Reveal>
          <div className="mt-8 space-y-0 border-y border-ink/10">
            {IMPACT.map((r, i) => (
              <Reveal key={r.amount} delay={i * 0.05}>
                <div className="flex gap-5 border-b border-ink/10 py-5 last:border-0">
                  <span className="font-display w-24 shrink-0 text-xl text-pine">{r.amount}</span>
                  <p className="text-sm leading-relaxed text-faded">{r.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <p className="mt-6 flex items-start gap-2 text-[12px] leading-relaxed text-faded">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-fern" />
              Funding a specific need instead — mats, fans, tents? Visit Donate to pick a
              campaign with a live target. Sadaqah here is the open, general giving.
            </p>
            <a
              href="/donate"
              className="mt-3 inline-flex border-b border-pine/40 pb-0.5 text-sm font-semibold text-pine hover:border-pine"
            >
              See Donate campaigns →
            </a>
          </Reveal>
        </div>

        {/* Right: Paystack card */}
        <div className="lg:col-span-6">
          <Reveal delay={0.1}>
            <div className="border border-ink/15 bg-white shadow-[0_30px_60px_-40px_rgba(10,46,35,0.35)]">
              <div className="flex items-center justify-between bg-pine px-6 py-4 text-white sm:px-8">
                <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em]">
                  <HeartHandshake className="h-4 w-4 text-sage" /> Give Sadaqah
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-white/70">
                  <Lock className="h-3.5 w-3.5" /> Paystack secured
                </span>
              </div>

              {!done ? (
                <form onSubmit={pay} className="p-6 sm:p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faded">
                    1 — Choose an amount (₦)
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setAmount(p);
                          setCustom("");
                        }}
                        className={`border py-3 font-mono text-sm font-semibold transition-colors ${
                          !custom && amount === p
                            ? "border-pine bg-vivid text-white"
                            : "border-ink/15 text-ink hover:border-pine"
                        }`}
                      >
                        ₦{fmt(p)}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min={100}
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="Or type any amount — e.g. 7500"
                    aria-label="Custom amount in naira"
                    className="mt-3 w-full border border-ink/20 bg-white px-4 py-3.5 font-mono text-lg text-ink placeholder:text-sm placeholder:text-ink/35 focus:border-pine focus:outline-none"
                  />

                  <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.2em] text-faded">
                    2 — Your details for receipt
                  </p>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="sq-name" className="text-[12px] font-medium text-faded">Full name</label>
                      <input
                        id="sq-name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Aisha Bello"
                        className="mt-1.5 w-full border border-ink/20 px-4 py-3 text-[15px] focus:border-pine focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="sq-email" className="text-[12px] font-medium text-faded">Email for receipt</label>
                      <input
                        id="sq-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="mt-1.5 w-full border border-ink/20 px-4 py-3 text-[15px] focus:border-pine focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setMonthly((m) => !m)}
                      aria-pressed={monthly}
                      className={`border px-4 py-2 text-[12px] font-semibold transition-colors ${
                        monthly ? "border-pine bg-mist text-pine" : "border-ink/15 text-faded"
                      }`}
                    >
                      {monthly ? "✓ Monthly sadaqah" : "Make it monthly"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnonymous((a) => !a)}
                      aria-pressed={anonymous}
                      className={`border px-4 py-2 text-[12px] font-semibold transition-colors ${
                        anonymous ? "border-pine bg-mist text-pine" : "border-ink/15 text-faded"
                      }`}
                    >
                      {anonymous ? "✓ Give anonymously" : "Give anonymously"}
                    </button>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-y border-ink/10 py-4">
                    <span className="text-sm text-faded">
                      Total {monthly ? "· monthly" : "· one-time"}
                    </span>
                    <span className="font-display text-3xl text-pine">₦{fmt(effective)}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={effective < 100 || !name || !email}
                    className="mt-6 w-full bg-vivid py-4 text-sm font-semibold text-white transition-colors hover:bg-vivid-deep disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continue with Paystack — ₦{fmt(effective)}
                  </button>
                  <p className="mt-3 text-center text-[12px] text-faded">
                    Card · Bank transfer · USSD · Verve — receipt by email & SMS.
                  </p>
                </form>
              ) : (
                <div className="p-8 text-center sm:p-12">
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <BadgeCheck className="mx-auto h-10 w-10 text-fern" />
                      <p className="font-arabic mt-4 text-2xl text-fern" lang="ar">جَزَاكَ ٱللَّٰهُ خَيْرًا</p>
                      <h3 className="font-display mt-2 text-3xl text-ink">
                        Received{name && !anonymous ? `, ${name.split(" ")[0]}` : ""}.
                      </h3>
                      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-faded">
                        Your {monthly ? "monthly " : ""}sadaqah of ₦{fmt(effective)} has been
                        recorded. A Paystack receipt is on its way to {email}. May Allah accept
                        it and multiply it.
                      </p>
                      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={() => setDone(false)}
                          className="flex-1 border border-pine py-3.5 text-sm font-semibold text-pine hover:bg-vivid hover:text-white"
                        >
                          Give again
                        </button>
                        <a
                          href="/donate"
                          className="flex-1 bg-pine py-3.5 text-center text-sm font-semibold text-white hover:bg-vivid"
                        >
                          Fund a campaign
                        </a>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
