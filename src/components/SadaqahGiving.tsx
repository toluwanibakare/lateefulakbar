"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Droplets, Layers, Video, Wifi, Wind, Home, ShieldCheck, X } from "lucide-react";
import { Eyebrow, FadeIn, StaggerContainer, StaggerItem, TiltCard } from "./ui";

type Campaign = {
  id: string;
  title: string;
  text: string;
  icon: typeof Droplets;
  image: string;
  target: number;
  raised: number;
  unit?: string;
  unitPrice?: number;
};

const INITIAL: Campaign[] = [
  { id: "mats", title: "Prayer mats", text: "Clean mats for the canopies, laid before dawn.", icon: Layers, image: "/assets/praying_mat.jpeg", target: 1000, raised: 640, unit: "mats", unitPrice: 3500 },
  { id: "water", title: "Water", text: "Cool packs moved through the rows all morning.", icon: Droplets, image: "/assets/donation-water.jpg", target: 2000, raised: 1350, unit: "packs", unitPrice: 1500 },
  { id: "cooling", title: "Cooling fans", text: "Industrial fans and shade for the midday heat.", icon: Wind, image: "/assets/donation-cooling.jpg", target: 700, raised: 410, unit: "fans", unitPrice: 25000 },
  { id: "internet", title: "Broadcast internet", text: "Uplink for the millions watching worldwide.", icon: Wifi, image: "/assets/donation-internet.jpg", target: 2000000, raised: 1450000 },
  { id: "media", title: "Media facility", text: "Cameras, drone and livestream production.", icon: Video, image: "/assets/user-donation-media.jpg", target: 3500000, raised: 2800000 },
  { id: "tents", title: "Tents and canopy", text: "The great white canopies over the Square.", icon: Home, image: "/assets/user-donation-tents.jpg", target: 5000000, raised: 3200000 },
];

function fmt(n: number) {
  return n.toLocaleString("en-NG");
}

export default function SadaqahGiving() {
  const [campaigns, setCampaigns] = useState(INITIAL);
  const [open, setOpen] = useState<Campaign | null>(null);
  const [qty, setQty] = useState(1);
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);

  const total = open
    ? open.unitPrice
      ? qty * open.unitPrice
      : parseFloat(amount) || 0
    : 0;

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    if (total <= 0 || !open) return;
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === open.id
          ? { ...c, raised: c.raised + (c.unitPrice ? qty : total) }
          : c
      )
    );
    setDone(true);
  };

  const close = () => {
    setOpen(null);
    setDone(false);
    setQty(1);
    setAmount("");
  };

  return (
    <section id="donate" className="border-t border-ink/10 bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
        <FadeIn direction="up">
          <Eyebrow>Donate — fund a need</Eyebrow>
        </FadeIn>
        <div className="mt-5 grid gap-8 lg:grid-cols-12">
          <FadeIn direction="right" delay={0.06} className="lg:col-span-5" blur>
            <h2 className="font-display text-balance text-4xl leading-tight font-light tracking-tight text-ink sm:text-5xl">
              Give water. Give shade. Share the reward.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-faded">
              Every mat, every pack of water, every fan at the Square is funded by people who
              could not attend but refused to miss the reward. Choose a need below and give.
              This is sadaqah jariyah, in the plainest sense.
            </p>
            <p className="font-arabic mt-6 text-xl text-fern" lang="ar">
              يَـٰٓأَيُّهَا ٱللَّذِينَ ءَامَنُوٓا۟ إِن تَنصُرُوا۟ ٱللَّهَ يَنصُرْكُمْ وَيُثَبِّتْ أَقْدَامَكُمْ
            </p>
            <p className="mt-2 text-[13px] text-faded italic">
              “O believers! If you stand up for Allah, He will help you and make your steps firm.” (Qur’an 47:7)
            </p>
          </FadeIn>

          <div className="lg:col-span-7">
            <StaggerContainer staggerDelay={0.06} className="divide-y divide-ink/10 border-y border-ink/10">
              {campaigns.map((c) => {
                const pct = Math.min(100, Math.round((c.raised / c.target) * 100));
                return (
                  <StaggerItem key={c.id}>
                    <article className="group flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4 py-5 transition-colors hover:bg-white/40 px-2 rounded-lg">
                      <div className="flex items-start xs:items-center gap-4 min-w-0 flex-1">
                        <div className="relative aspect-[4/3] w-24 xs:w-28 sm:w-32 shrink-0 overflow-hidden bg-mist rounded-lg shadow-sm border border-ink/10">
                          <Image src={c.image} alt={c.title} fill sizes="160px" className="img-true object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <c.icon className="h-4 w-4 text-fern shrink-0" />
                            <h3 className="text-[15px] font-semibold text-ink truncate">{c.title}</h3>
                            <span className="text-[11px] font-semibold text-fern shrink-0">{pct}% funded</span>
                          </div>
                          <p className="mt-1 text-[13px] text-faded leading-normal">{c.text}</p>
                          <div className="mt-2.5 h-1.5 w-full bg-ink/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-vivid rounded-full"
                            />
                          </div>
                          <p className="mt-1.5 font-mono text-[11px] text-faded">
                            {c.unit
                              ? `${fmt(c.raised)} of ${fmt(c.target)} ${c.unit} - ₦${fmt(c.unitPrice!)} each`
                              : `₦${fmt(c.raised)} of ₦${fmt(c.target)}`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setOpen(c); setDone(false); }}
                        className="h-fit shrink-0 border border-pine px-5 py-2.5 text-[13px] font-semibold text-pine transition-all hover:bg-vivid hover:text-white hover:shadow-md rounded-lg self-end xs:self-center"
                      >
                        Give
                      </button>
                    </article>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-faded">
              <ShieldCheck className="h-4 w-4 text-fern" />
              Secured checkout. Receipts by email.
              <a href="/sadaqah" className="font-semibold text-pine underline underline-offset-4 hover:text-fern">
                Prefer open Sadaqah giving?
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Giving dialog */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60 backdrop-blur-sm p-0 sm:items-center sm:p-6" onClick={close}>
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] w-full max-w-lg overflow-y-auto bg-white p-6 sm:p-8 shadow-2xl rounded-t-2xl sm:rounded-xl"
            >
              {!done ? (
                <form onSubmit={pay}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-ink/10 shadow-sm bg-mist">
                        <Image src={open.image} alt={open.title} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fern">Donate</p>
                        <h3 className="font-display mt-0.5 text-xl sm:text-2xl text-ink font-medium">{open.title}</h3>
                      </div>
                    </div>
                    <button type="button" onClick={close} aria-label="Close" className="p-1 text-faded hover:text-ink">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {open.unitPrice ? (
                    <div className="mt-6">
                      <label className="text-[12px] font-semibold uppercase tracking-wider text-faded">
                        How many {open.unit}?
                      </label>
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {[1, 2, 5, 10].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setQty(n)}
                            className={`border py-2.5 text-sm font-semibold transition-all ${
                              qty === n ? "border-pine bg-vivid text-white shadow-sm" : "border-ink/15 text-ink hover:border-pine"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <label htmlFor="sadaqah-amount" className="text-[12px] font-semibold uppercase tracking-wider text-faded">
                        Amount (₦)
                      </label>
                      <input
                        id="sadaqah-amount"
                        type="number"
                        min={100}
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g. 50000"
                        className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 font-mono text-lg text-ink focus:border-pine focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="mt-4">
                    <label htmlFor="sadaqah-name" className="text-[12px] font-semibold uppercase tracking-wider text-faded">
                      Your name
                    </label>
                    <input
                      id="sadaqah-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aisha Bello"
                      className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-ink focus:border-pine focus:outline-none"
                    />
                  </div>

                  <div className="mt-6 flex items-center justify-between border-y border-ink/10 py-4">
                    <span className="text-sm text-faded">Total</span>
                    <span className="font-display text-3xl text-pine font-light">₦{fmt(total)}</span>
                  </div>

                  <button type="submit" className="mt-6 w-full bg-vivid py-4 text-sm font-semibold text-white transition-all hover:bg-vivid-deep hover:shadow-lg">
                    Continue to Support
                  </button>
                </form>
              ) : (
                <div className="py-6 text-center">
                  <p className="font-arabic text-2xl text-fern" lang="ar">جَزَاكَ ٱللَّٰهُ خَيْرًا</p>
                  <h3 className="font-display mt-3 text-3xl text-ink">Received with thanks{name ? `, ${name.split(" ")[0]}` : ""}.</h3>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-faded">
                    Your contribution to {open.title.toLowerCase()} has been recorded. May Allah
                    accept it and multiply it.
                  </p>
                  <button onClick={close} className="mt-8 w-full border border-pine py-3.5 text-sm font-semibold text-pine hover:bg-vivid hover:text-white transition-all">
                    Return to the needs
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
