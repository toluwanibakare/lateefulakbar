"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch live donation stats from MySQL
    fetch('/api/donate')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categoryTotals) {
          setCampaigns((prev) =>
            prev.map((c) => {
              const liveCatTotal = data.categoryTotals[c.title];
              return liveCatTotal ? { ...c, raised: c.raised + liveCatTotal } : c;
            })
          );
        }
      })
      .catch((err) => console.error('Error fetching donation stats:', err));
  }, []);

  const total = open
    ? open.unitPrice
      ? qty * open.unitPrice
      : parseFloat(amount) || 0
    : 0;

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (total <= 0 || !open) return;

    setSubmitting(true);
    try {
      await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: name || 'Anonymous',
          email,
          amount: total,
          category: open.title,
        }),
      });

      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === open.id
            ? { ...c, raised: c.raised + (c.unitPrice ? qty : total) }
            : c
        )
      );
      setDone(true);
    } catch (err) {
      console.error('Error submitting donation:', err);
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    setOpen(null);
    setDone(false);
    setQty(1);
    setAmount("");
    setName("");
    setEmail("");
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
              Every mat, every pack of water, every fan at the Auditorium is funded by people who
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
                          <Image
                            src={c.image}
                            alt={c.title}
                            fill
                            sizes="128px"
                            className="img-true object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display text-xl tracking-tight text-ink group-hover:text-fern">
                            {c.title}
                          </h3>
                          <p className="mt-1 text-xs text-faded line-clamp-2">{c.text}</p>
                          <div className="mt-3 max-w-xs">
                            <div className="flex justify-between text-[11px] font-semibold text-faded">
                              <span>{pct}% funded</span>
                              <span>
                                {c.unit
                                  ? `${fmt(c.raised)} / ${fmt(c.target)} ${c.unit}`
                                  : `₦${fmt(c.raised)} / ₦${fmt(c.target)}`}
                              </span>
                            </div>
                            <div className="mt-1 h-1.5 w-full bg-ink/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-vivid transition-all duration-500 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setOpen(c)}
                        className="w-full xs:w-auto shrink-0 bg-vivid px-5 py-2.5 text-xs font-semibold text-white hover:bg-vivid-deep transition-colors rounded-md shadow-sm"
                      >
                        Give {c.unitPrice ? `₦${fmt(c.unitPrice)}` : "Sadaqah"}
                      </button>
                    </article>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="absolute inset-0 bg-pine/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg border border-white/20 bg-white p-6 sm:p-8 shadow-2xl rounded-2xl overflow-hidden"
            >
              <button
                onClick={close}
                className="absolute right-4 top-4 text-faded hover:text-ink transition-colors p-1"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              {!done ? (
                <form onSubmit={pay} className="space-y-5">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fern">
                      Sadaqah Jariyah
                    </span>
                    <h3 className="font-display mt-1 text-2xl text-ink font-semibold">
                      Sponsor {open.title}
                    </h3>
                    <p className="mt-1 text-xs text-faded">{open.text}</p>
                  </div>

                  {open.unitPrice ? (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-faded mb-2">
                        Quantity ({open.unit}) — ₦{fmt(open.unitPrice)} each
                      </label>
                      <div className="flex items-center gap-3">
                        {[1, 5, 10, 25, 50].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setQty(n)}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                              qty === n
                                ? "bg-vivid text-white border-vivid"
                                : "border-ink/20 text-ink hover:border-vivid"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-faded mb-2">
                        Amount in Naira (₦)
                      </label>
                      <input
                        type="number"
                        required
                        min="500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g. 5,000"
                        className="w-full border border-ink/20 px-4 py-3 text-sm text-ink focus:border-vivid focus:outline-none rounded-lg"
                      />
                    </div>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-faded mb-1">
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Leave blank for Anonymous"
                        className="w-full border border-ink/20 px-3.5 py-2.5 text-xs text-ink focus:border-vivid focus:outline-none rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-faded mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="For receipt & updates"
                        className="w-full border border-ink/20 px-3.5 py-2.5 text-xs text-ink focus:border-vivid focus:outline-none rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="border-t border-ink/10 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-faded block">Total Sadaqah</span>
                      <span className="font-display text-2xl font-bold text-vivid">
                        ₦{fmt(total)}
                      </span>
                    </div>
                    <button
                      type="submit"
                      disabled={submitting || total <= 0}
                      className="bg-vivid px-6 py-3 text-sm font-semibold text-white hover:bg-vivid-deep disabled:opacity-40 transition-colors rounded-lg shadow-md"
                    >
                      {submitting ? "Processing..." : "Complete Sadaqah"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-6 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-ink">
                    JazakAllahu Khairan!
                  </h3>
                  <p className="text-sm text-faded max-w-sm mx-auto">
                    Your sadaqah of <strong>₦{fmt(total)}</strong> for{" "}
                    <strong>{open.title}</strong> has been recorded. May Allah bless your wealth and grant you abundant reward.
                  </p>
                  <button
                    onClick={close}
                    className="mt-4 bg-vivid px-6 py-2.5 text-xs font-semibold text-white hover:bg-vivid-deep transition-colors rounded-lg"
                  >
                    Done
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
