"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Droplets, Layers, Video, Wifi, Wind, Home, ShieldCheck, X, Loader2 } from "lucide-react";
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
  { id: "venue", title: "TBS Venue Rental", text: "Main bowl rental and facility access for Tafawa Balewa Square.", icon: Home, image: "/assets/crowd-12.jpg", target: 0, raised: 0, unit: "facility", unitPrice: 22500000 },
  { id: "tents", title: "6 Marquee Tents (25m x 100m)", text: "Large shaded marquee tents (25m x 100m) for assembly rows.", icon: Home, image: "/assets/donation-tents.jpg", target: 6, raised: 0, unit: "tents", unitPrice: 4000000 },
  { id: "led", title: "40 Digital LED Screens", text: "High-definition digital LED display screens around the bowl.", icon: Video, image: "/assets/donation-media.jpg", target: 40, raised: 0, unit: "screens", unitPrice: 250000 },
  { id: "stage", title: "Stage Setup & Infrastructure", text: "Main elevated stage, podium, backdrop, and structure.", icon: Layers, image: "/assets/crowd-11.jpg", target: 0, raised: 0, unit: "setup", unitPrice: 7500000 },
  { id: "water", title: "2,000 Cartons Nestlé Water (60cl)", text: "Nestlé bottled water cartons (60cl) served to worshippers.", icon: Droplets, image: "/assets/donation-water.jpg", target: 2000, raised: 0, unit: "cartons", unitPrice: 3600 },
  { id: "sound", title: "Professional Sound System", text: "High-grade arena audio speakers, amplifiers and mics.", icon: Video, image: "/assets/crowd-08.jpg", target: 0, raised: 0, unit: "system", unitPrice: 6000000 },
  { id: "power", title: "Generators, Fuel (Diesel/PMS) & Security", text: "Heavy-duty power generators, fuel supply, and site security.", icon: Wind, image: "/assets/drone-wide.png", target: 0, raised: 0, unit: "power", unitPrice: 5000000 },
  { id: "cooling", title: "Cooling (Regular & Mist Fans)", text: "Industrial standing fans and mist cooling fans across rows.", icon: Wind, image: "/assets/donation-cooling.jpg", target: 1000, raised: 0, unit: "fans", unitPrice: 3000 },
  { id: "internet", title: "Internet & Media Production Equipment", text: "Dedicated high-speed internet, livestream encoders, and cameras.", icon: Wifi, image: "/assets/donation-internet.jpg", target: 0, raised: 0, unit: "setup", unitPrice: 2900000 },
  { id: "ads", title: "Digital Advertising & Publicity", text: "Publicity, billboards, social media, and digital awareness.", icon: Video, image: "/assets/event-banner.png", target: 0, raised: 0, unit: "campaign", unitPrice: 1380000 },
  { id: "mats", title: "White Prayer Mats", text: "White prayer mats per roll laid before dawn.", icon: Layers, image: "/assets/praying_mat.jpeg", target: 1000, raised: 0, unit: "rolls", unitPrice: 85000 },
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

  // Transactions Monitor Modal State
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [transactionsList, setTransactionsList] = useState<any[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");

  useEffect(() => {
    // Check if user returned from Paystack redirect with reference/trxref
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('reference') || params.get('trxref');
    if (ref) {
      fetch(`/api/paystack/verify?reference=${encodeURIComponent(ref)}`)
        .then((res) => res.json())
        .then((vData) => {
          if (vData.success) {
            console.log('Payment verified successfully:', vData.data);
          }
        })
        .catch((err) => console.error('Error verifying returning payment:', err));
    }

    // Fetch live donation campaigns & threshold data from MySQL database
    fetch('/api/donate')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.campaigns) && data.campaigns.length > 0) {
          const dbCampaigns: Campaign[] = data.campaigns.map((dbC: any) => {
            const titleLower = dbC.title.toLowerCase();
            const fallbackImg = titleLower.includes("water")
              ? "/assets/donation-water.jpg"
              : titleLower.includes("fan") || titleLower.includes("cool")
              ? "/assets/donation-cooling.jpg"
              : titleLower.includes("tent") || titleLower.includes("canopy")
              ? "/assets/donation-tents.jpg"
              : titleLower.includes("broadcast") || titleLower.includes("media") || titleLower.includes("tv")
              ? "/assets/donation-media.jpg"
              : "/assets/praying_mat.jpeg";

            return {
              id: String(dbC.id),
              title: dbC.title,
              text: dbC.description || "Community donation project for Lateeful Akbar 2027",
              icon: titleLower.includes("tent") || titleLower.includes("canopy") ? Home : titleLower.includes("fan") || titleLower.includes("cool") ? Wind : titleLower.includes("water") ? Droplets : titleLower.includes("mat") ? Layers : Video,
              image: (!dbC.image_url || dbC.image_url.includes("user-donation-media")) ? fallbackImg : dbC.image_url,
              target: Number(dbC.target_qty) || 0,
              raised: dbC.current_qty || 0,
              unit: titleLower.includes("tent") || titleLower.includes("canopy") ? "tents" : titleLower.includes("mat") ? "mats" : titleLower.includes("water") ? "packs" : titleLower.includes("fan") ? "fans" : "items",
              unitPrice: Number(dbC.unit_price) || 0,
            };
          });
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
      } else {
        // Use Paystack Inline Popup client side
        const paystackKey = data.publicKey || process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_2c7e896530c8018102ab4d741c95b997e534ba2e';
        const loadScript = () =>
          new Promise((resolve) => {
            if ((window as any).PaystackPop) return resolve(true);
            const script = document.createElement("script");
            script.src = "https://js.paystack.co/v1/inline.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });

        const loaded = await loadScript();
        if (loaded && (window as any).PaystackPop) {
          const handler = (window as any).PaystackPop.setup({
            key: paystackKey,
            email: email || 'donor@example.com',
            amount: Math.round(totalPay * 100),
            currency: "NGN",
            onClose: function () {
              setSubmitting(false);
            },
            callback: function (response: any) {
              fetch('/api/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  donorName: name || 'Anonymous',
                  email,
                  amount: totalPay,
                  category: open.title,
                  txRef: response.reference || response.trxref,
                  mode: data.mode || 'live',
                }),
              }).catch((err) => console.error('Error logging completed donation:', err));

              setDone(true);
              setCampaigns((list) =>
                list.map((c) => (c.id === open.id ? { ...c, raised: c.raised + (open.unitPrice ? qty : 1) } : c))
              );
              setSubmitting(false);
            },
          });
          handler.openIframe();
          return;
        }

        alert(data.error || 'Failed to initialize Paystack gateway');
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
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
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


        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => {
            const Icon = c.icon;
            const hasTargetQty = c.target > 0;
            const isPriceThreshold = !hasTargetQty && Boolean(c.unitPrice);
            const pct = hasTargetQty ? Math.min(100, Math.round((c.raised / c.target) * 100)) : 0;

            return (
              <div key={c.id}>
                <TiltCard className="group h-full border border-ink/15 bg-white transition-all hover:border-vivid hover:shadow-xl">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pine/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-display text-2xl font-normal">{c.title}</h3>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-6">
                    <p className="text-sm leading-relaxed text-faded">{c.text}</p>

                    <div className="mt-6 space-y-3">
                      {hasTargetQty ? (
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
                          {Boolean(c.unitPrice) && (
                            <div className="mt-2 text-xs font-bold text-pine">
                              ₦{fmt(c.unitPrice!)} per item
                            </div>
                          )}
                        </div>
                      ) : isPriceThreshold ? (
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-vivid bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200/60 inline-block font-bold">
                            Target Threshold: ₦{fmt(c.unitPrice!)}
                          </div>
                          <p className="text-[11px] text-faded">Deposit any amount towards reaching this ₦ target.</p>
                        </div>
                      ) : (
                        <div className="text-xs font-semibold text-pine bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200/60 inline-block">
                          Open Voluntary Donation
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
              </div>
            );
          })}
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
              onClick={() => setOpen(null)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto border border-ink/15 bg-white p-6 shadow-2xl sm:p-8 rounded-xl"
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
                    {open.target > 0 && open.unitPrice ? (
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
                          Custom Donation Amount (₦) {open.target === 0 && open.unitPrice ? `(Target: ₦${fmt(open.unitPrice)})` : ''}
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
                        className="w-full bg-vivid py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-vivid-deep disabled:opacity-40 flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                            <span>Processing Payment...</span>
                          </>
                        ) : (
                          `Complete ₦${fmt(totalPay)} Donation`
                        )}
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

        {/* Transactions Monitor Modal */}
        {showTransactionsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTransactionsModal(false)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-ink/15 bg-white p-6 shadow-2xl sm:p-8 rounded-2xl space-y-6"
            >
              <button
                onClick={() => setShowTransactionsModal(false)}
                className="absolute top-4 right-4 text-faded hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-ink/10 pb-4">
                <div>
                  <Eyebrow>Transparency & Verification</Eyebrow>
                  <h3 className="font-display mt-1 text-2xl font-light text-pine">
                    Recent Donation Transactions
                  </h3>
                </div>

                {/* Item Filter Dropdown */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-faded uppercase tracking-wider">Filter by Item:</label>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="bg-cream border border-ink/15 rounded-xl px-3 py-1.5 text-xs text-ink font-semibold focus:outline-none focus:border-vivid"
                  >
                    <option value="All">All Items ({transactionsList.length})</option>
                    {Array.from(new Set(transactionsList.map((t) => t.category))).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-ink/15 text-faded uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-3">Donor</th>
                      <th className="py-3 px-3">Item / Category</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Mode</th>
                      <th className="py-3 px-3">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10">
                    {transactionsList
                      .filter((t) => selectedCategoryFilter === "All" || t.category === selectedCategoryFilter)
                      .map((t, idx) => (
                        <tr key={idx} className="hover:bg-cream/60">
                          <td className="py-3.5 px-3 font-bold text-ink">{t.donor_name || "Anonymous"}</td>
                          <td className="py-3.5 px-3 font-semibold text-pine">{t.category}</td>
                          <td className="py-3.5 px-3 font-extrabold text-vivid">₦{Number(t.amount).toLocaleString()}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              t.mode === 'live'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {t.mode === 'live' ? 'LIVE' : 'TEST'}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-faded font-mono">
                            {new Date(t.created_at).toLocaleDateString()} {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    {transactionsList.filter((t) => selectedCategoryFilter === "All" || t.category === selectedCategoryFilter).length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-faded">
                          No transactions found for &quot;{selectedCategoryFilter}&quot;.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
