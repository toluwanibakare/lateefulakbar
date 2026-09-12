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
  { id: "mats", title: "Prayer Mats & Rugs", text: "Clean mats for the canopies, laid before dawn.", icon: Layers, image: "/assets/praying_mat.jpeg", target: 500, raised: 310, unit: "mats", unitPrice: 15000 },
  { id: "water", title: "Water & Hydration Points", text: "Cool packs moved through the rows all morning.", icon: Droplets, image: "/assets/donation-water.jpg", target: 1000, raised: 780, unit: "packs", unitPrice: 5000 },
  { id: "cooling", title: "Provide Cooling Fans", text: "Industrial fans and shade for the midday heat.", icon: Wind, image: "/assets/donation-cooling.jpg", target: 200, raised: 134, unit: "fans", unitPrice: 25000 },
  { id: "media", title: "Nadwat TV Live Broadcast", text: "Cameras, drone and HD livestream production.", icon: Video, image: "/assets/user-donation-media.jpg", target: 50, raised: 22, unit: "units", unitPrice: 100000 },
];

function fmt(n: number) {
  return n.toLocaleString("en-NG");
}

export default function SadaqahGiving() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL);
  const [open, setOpen] = useState<Campaign | null>(null);
  const [qty, setQty] = useState(1);
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch live donation campaigns & threshold data from MySQL database
    fetch('/api/donate')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.campaigns) && data.campaigns.length > 0) {
          const dbCampaigns: Campaign[] = data.campaigns.map((dbC: any) => ({
            id: String(dbC.id),
            title: dbC.title,
            text: dbC.description || "Community donation project for Lateeful Akbar 2027",
            icon: dbC.title.toLowerCase().includes("fan") ? Wind : dbC.title.toLowerCase().includes("water") ? Droplets : dbC.title.toLowerCase().includes("mat") ? Layers : Video,
            image: dbC.image_url || "/assets/praying_mat.jpeg",
            target: dbC.target_qty || 100,
            raised: dbC.current_qty || 0,
            unit: "units",
            unitPrice: Number(dbC.unit_price) || 25000,
          }));
          setCampaigns(dbCampaigns);
        } else {
          setCampaigns(INITIAL);
        }
      })
      .catch((err) => {
        console.error('Error fetching donation campaigns:', err);
        setCampaigns(INITIAL);
      });
  }, []);

  const totalPay = open?.unitPrice ? open.unitPrice * Math.max(1, qty) : Number(amount) || 0;

  const pay = async () => {
    if (!open || !totalPay) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/paystack/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: name || 'Anonymous',
          email,
          amount: totalPay,
          category: open.title,
        }),
      });

      const data = await res.json();
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else if (data.success) {
        setDone(true);
        setCampaigns((list) =>
          list.map((c) => (c.id === open.id ? { ...c, raised: c.raised + (open.unitPrice ? qty : 1) } : c))
        );
      } else {
        alert(data.error || 'Failed to process donation');
      }
    } catch (err) {
      console.error('Failed to log donation:', err);
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="border-t border-ink/10 bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="max-w-3xl">
          <FadeIn>
            <Eyebrow>Donation & Sadaqah Campaigns</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h2 className="font-display mt-4 text-3xl font-light tracking-tight sm:text-5xl">
              Equip the assembly — item by item, mat by mat.
            </h2>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="mt-4 text-base leading-relaxed text-faded sm:text-lg">
              You can sponsor specific physical needs for the gathering — water, prayer mats, cooling fans, or broadcast coverage. Each campaign tracks items needed and current progress set by organizers.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => {
            const Icon = c.icon;
            const pct = Math.min(100, Math.round((c.raised / c.target) * 100));

            return (
              <StaggerItem key={c.id}>
                <TiltCard className="group h-full border border-ink/15 bg-white transition-all hover:border-vivid hover:shadow-xl">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pine/70 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-pine backdrop-blur-md shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-display text-2xl font-normal">{c.title}</h3>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-6">
                    <p className="text-sm leading-relaxed text-faded">{c.text}</p>

                    <div className="mt-6 space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-ink">
                            {fmt(c.raised)} / {fmt(c.target)} {c.unit || "raised"}
                          </span>
                          <span className="text-vivid font-bold">{pct}%</span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden bg-mist rounded-full">
                          <div className="h-full bg-vivid transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>

                      {c.unitPrice && (
                        <div className="text-xs font-bold text-pine">
                          ₦{fmt(c.unitPrice)} per item
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setOpen(c);
                          setQty(1);
                          setAmount("");
                          setDone(false);
                        }}
                        className="mt-2 w-full bg-mist py-3 text-xs font-bold uppercase tracking-wider text-pine hover:bg-vivid hover:text-white transition-colors"
                      >
                        Sponsor this campaign
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg border border-ink/15 bg-white p-6 shadow-2xl sm:p-8"
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute top-4 right-4 text-faded hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>

              {!done ? (
                <>
                  <Eyebrow>Sponsor Campaign</Eyebrow>
                  <h3 className="font-display mt-2 text-2xl font-light text-ink sm:text-3xl">
                    {open.title}
                  </h3>
                  <p className="mt-1 text-xs text-faded">{open.text}</p>

                  <div className="mt-6 space-y-4">
                    {open.unitPrice ? (
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-faded">
                          Number of items (₦{fmt(open.unitPrice)} each)
                        </label>
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            onClick={() => setQty((q) => Math.max(1, q - 1))}
                            className="flex h-10 w-10 items-center justify-center border border-ink/20 font-bold"
                          >
                            -
                          </button>
                          <span className="font-mono text-lg font-bold">{qty}</span>
                          <button
                            onClick={() => setQty((q) => q + 1)}
                            className="flex h-10 w-10 items-center justify-center border border-ink/20 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-faded">
                          Custom Donation Amount (₦)
                        </label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="e.g. 50000"
                          className="mt-2 w-full border border-ink/20 p-3 font-mono text-base"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-faded">
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Anonymous"
                        className="mt-2 w-full border border-ink/20 p-3 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-faded">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="mt-2 w-full border border-ink/20 p-3 text-xs"
                      />
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between text-sm font-bold text-pine mb-4">
                        <span>Total Contribution:</span>
                        <span className="font-mono text-lg">₦{fmt(totalPay)}</span>
                      </div>

                      <button
                        onClick={pay}
                        disabled={submitting || !totalPay}
                        className="w-full bg-vivid py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-vivid-deep disabled:opacity-40"
                      >
                        {submitting ? "Processing..." : `Complete ₦${fmt(totalPay)} Donation`}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mist text-vivid">
                    <ShieldCheck className="h-8 w-8 text-vivid" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-pine">JazakAllah Khair!</h3>
                  <p className="text-xs text-faded max-w-sm mx-auto">
                    Your contribution of ₦{fmt(totalPay)} towards {open.title} has been received. May Allah reward your generosity abundantly.
                  </p>
                  <button
                    onClick={() => setOpen(null)}
                    className="mt-4 bg-vivid px-6 py-2.5 text-xs font-bold uppercase text-white"
                  >
                    Close
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
