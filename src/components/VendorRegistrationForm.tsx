"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CreditCard, Download, Layers, Lock, ShieldCheck, Sparkles, Store, Zap } from "lucide-react";
import { EVENT } from "@/lib/site";
import { Eyebrow, Reveal, TiltCard } from "./ui";

const CATEGORIES = [
  { id: "food", title: "Food & Drinks", price: 65000, desc: "Prepared meals, snacks, cold drinks & refreshments." },
  { id: "clothing", title: "Clothing & Adire", desc: "Modest wear, all-white garments, caps & Adire attire.", price: 50000 },
  { id: "books", title: "Islamic Materials & Books", desc: "Prayer books, Qur’ans, tasbīh counters & educational items.", price: 40000 },
  { id: "accessories", title: "Accessories & Perfumes", desc: "Non-alcoholic attar perfumes, miswak & accessories.", price: 45000 },
  { id: "services", title: "Services & Tech", desc: "Charging booths, photography services & media.", price: 55000 },
  { id: "others", title: "Others", desc: "General approved halal products & exhibits.", price: 45000 },
];

const GUIDELINES = [
  "Sell only approved, lawful (Halal) products and services consistent with Islamic values.",
  "Maintain cleanliness, hygiene and proper waste disposal within and around allocated spaces.",
  "Food vendors must observe appropriate food safety, hygiene standards and clean serving utensils.",
  "Operate strictly within assigned stall/space and comply with setup (06:00 WAT) and closing times.",
  "Avoid unauthorized electrical connections, open flames, or hazardous equipment.",
  "Ensure prices are fair, transparent and clearly communicated to customers.",
  "Vendors and staff must conduct themselves respectfully and comply with event security instructions.",
  "Vendor spaces cannot be transferred or sublet without prior written approval.",
  "Vendors are responsible for safeguarding their goods, equipment and personal belongings.",
];

export default function VendorRegistrationForm() {
  const [step, setStep] = useState(1);
  const [logo, setLogo] = useState<string | null>(null);
  const [pass, setPass] = useState<{ id: string; code: string; ref: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [form, setForm] = useState({
    businessName: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    socialHandle: "",
    category: "Food & Drinks",
    description: "",
    spaces: "1",
    electricity: "No",
    powerDetails: "",
    staffCount: "2",
    agreed: false,
  });

  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const selectedCategoryObj = CATEGORIES.find((c) => c.title === form.category) || CATEGORIES[0];
  const totalPrice = selectedCategoryObj.price * parseInt(form.spaces || "1", 10) + (form.electricity === "Yes" ? 15000 : 0);

  const onLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onloadend = () => setLogo(r.result as string);
    r.readAsDataURL(file);
  };

  const drawBadge = (name: string, brand: string, code: string, cat: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 1100;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 800, 1100);

    // Top Header
    ctx.fillStyle = "#0B3D2E";
    ctx.fillRect(0, 0, 800, 180);

    ctx.fillStyle = "#DCEBE0";
    ctx.font = "600 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("OFFICIAL ACCREDITED VENDOR PASS", 400, 60);

    ctx.fillStyle = "#ffffff";
    ctx.font = "300 50px Georgia, serif";
    ctx.fillText("Lateeful-Ul-Akbar 2027", 400, 130);

    // Badge Body
    ctx.fillStyle = "#0A2E23";
    ctx.font = "700 36px sans-serif";
    ctx.fillText((brand || "VENDOR BRAND").toUpperCase(), 400, 320);

    ctx.fillStyle = "#1A5C45";
    ctx.font = "500 24px sans-serif";
    ctx.fillText(`Contact: ${name}`, 400, 370);

    ctx.fillStyle = "#C89D3C";
    ctx.font = "700 28px monospace";
    ctx.fillText(`STALL CODE: ${code}`, 400, 430);

    ctx.fillStyle = "#4C6A5E";
    ctx.font = "400 22px sans-serif";
    ctx.fillText(`Category: ${cat}`, 400, 480);
    ctx.fillText(`Date: ${EVENT.dateLong}`, 400, 520);
    ctx.fillText("Venue: Tafawa Balewa Square (Perimeter Vendor Zone)", 400, 560);

    // Approved Stamp Box
    ctx.strokeStyle = "#0B3D2E";
    ctx.lineWidth = 4;
    ctx.strokeRect(200, 640, 400, 120);

    ctx.fillStyle = "#0B3D2E";
    ctx.font = "800 32px sans-serif";
    ctx.fillText("APPROVED & PAID", 400, 710);

    ctx.fillStyle = "#4C6A5E";
    ctx.font = "400 18px sans-serif";
    ctx.fillText("Authorized by Nadwat Vendor Committee", 400, 950);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) return;

    const id = "VND-" + Math.floor(1000 + Math.random() * 9000);
    const code = "ZONE-" + (form.category.charAt(0).toUpperCase()) + "-" + Math.floor(10 + Math.random() * 90);
    const ref = "PAY-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    setPass({ id, code, ref });
    setTimeout(() => drawBadge(form.contactPerson, form.businessName, code, form.category), 200);
  };

  const downloadPass = () => {
    const c = canvasRef.current;
    if (!c) return;
    const a = document.createElement("a");
    a.download = `VendorPass-${form.businessName.replace(/\s+/g, "_")}.png`;
    a.href = c.toDataURL("image/png");
    a.click();
  };

  return (
    <section className="bg-paper py-16 sm:py-24 border-b border-ink/10">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Column: Category choices & Info */}
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>Vendor Stalls & Accreditation</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-4 text-3xl font-light text-ink sm:text-5xl leading-tight">
                Exhibit your brand at the Square
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-4 text-base leading-relaxed text-faded">
                Join hundreds of halal food vendors, clothing brands, Islamic booksellers, and service providers at Tafawa Balewa Square during Lateeful Akbar 2027.
              </p>
            </Reveal>

            {/* Vendor Category Pricing Cards */}
            <Reveal delay={0.16}>
              <div className="mt-8 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-fern">Stall Pricing & Categories</p>
                <div className="grid gap-2.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => set("category", cat.title)}
                      className={`flex items-center justify-between border p-4 text-left transition-all rounded-lg ${
                        form.category === cat.title
                          ? "border-pine bg-white shadow-md ring-1 ring-pine"
                          : "border-ink/15 bg-cream/50 hover:bg-white"
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-sm text-ink block">{cat.title}</span>
                        <span className="text-xs text-faded leading-normal block mt-0.5">{cat.desc}</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-pine shrink-0 ml-3">
                        ₦{cat.price.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Interactive Registration Form & Payment */}
          <div className="lg:col-span-7">
            {!pass ? (
              <Reveal delay={0.1}>
                <form onSubmit={handleSubmit} className="border border-ink/15 bg-white p-6 sm:p-10 shadow-lg rounded-xl">
                  {/* Step Progress */}
                  <div className="flex items-center justify-between border-b border-ink/10 pb-5">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-fern">
                      Vendor Registration — Step {step} of 3
                    </span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map((s) => (
                        <span key={s} className={`h-1.5 w-8 rounded-full ${step >= s ? "bg-vivid" : "bg-ink/15"}`} />
                      ))}
                    </div>
                  </div>

                  {/* STEP 1: Vendor Information */}
                  {step === 1 && (
                    <div className="pt-6">
                      <h3 className="font-display text-2xl text-ink">Vendor & Business Information</h3>
                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Business / Brand Name *
                          </label>
                          <input
                            required
                            value={form.businessName}
                            onChange={(e) => set("businessName", e.target.value)}
                            placeholder="e.g. Al-Barakah Halal Foods & Drinks"
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Contact Person Full Name *
                          </label>
                          <input
                            required
                            value={form.contactPerson}
                            onChange={(e) => set("contactPerson", e.target.value)}
                            placeholder="e.g. Alhaji Mustapha Lawal"
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Phone / WhatsApp Number *
                          </label>
                          <input
                            required
                            type="tel"
                            value={form.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            placeholder="+234 800 000 0000"
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Email Address *
                          </label>
                          <input
                            required
                            type="email"
                            value={form.email}
                            onChange={(e) => set("email", e.target.value)}
                            placeholder="vendor@brand.com"
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Social Media Handle
                          </label>
                          <input
                            value={form.socialHandle}
                            onChange={(e) => set("socialHandle", e.target.value)}
                            placeholder="@yourbrandname"
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Business Address
                          </label>
                          <input
                            value={form.address}
                            onChange={(e) => set("address", e.target.value)}
                            placeholder="Store / Office Address in Nigeria or Abroad"
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Vendor Category *
                          </label>
                          <select
                            value={form.category}
                            onChange={(e) => set("category", e.target.value)}
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c.id} value={c.title}>
                                {c.title} — ₦{c.price.toLocaleString()}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Brief Description of Products / Services
                          </label>
                          <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => set("description", e.target.value)}
                            placeholder="List main products or food menu items being brought to the event..."
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Upload Logo / Brand Artwork
                          </label>
                          <div className="mt-1.5 flex items-center gap-4 border border-dashed border-ink/20 bg-mist p-4 rounded-lg">
                            {logo && (
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-ink/20">
                                <Image src={logo} alt="Logo preview" fill className="object-cover" />
                              </div>
                            )}
                            <label className="cursor-pointer bg-pine px-4 py-2 text-xs font-semibold text-white rounded hover:bg-ink">
                              {logo ? "Change Logo" : "Upload File"}
                              <input type="file" accept="image/*" onChange={onLogo} className="hidden" />
                            </label>
                            <span className="text-xs text-faded">PNG or JPG, max 5MB</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button
                          type="button"
                          disabled={!form.businessName || !form.contactPerson || !form.phone || !form.email}
                          onClick={() => setStep(2)}
                          className="inline-flex items-center gap-2 bg-vivid px-7 py-3.5 text-sm font-semibold text-white rounded-lg hover:bg-vivid-deep disabled:opacity-40"
                        >
                          Continue to Setup <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Space, Power & Compliance Guidelines */}
                  {step === 2 && (
                    <div className="pt-6">
                      <h3 className="font-display text-2xl text-ink">Stall Setup & Power Requirements</h3>
                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Number of Stall Spaces Required *
                          </label>
                          <select
                            value={form.spaces}
                            onChange={(e) => set("spaces", e.target.value)}
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          >
                            <option value="1">1 Stall Space</option>
                            <option value="2">2 Stall Spaces (Double)</option>
                            <option value="3">3 Stall Spaces</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Number of Vendor Staff *
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={form.staffCount}
                            onChange={(e) => set("staffCount", e.target.value)}
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Electricity Required?
                          </label>
                          <select
                            value={form.electricity}
                            onChange={(e) => set("electricity", e.target.value)}
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          >
                            <option value="No">No — Standard Space</option>
                            <option value="Yes">Yes (+₦15,000 generator hookup)</option>
                          </select>
                        </div>

                        {form.electricity === "Yes" && (
                          <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                              Estimated Power Equipment
                            </label>
                            <input
                              value={form.powerDetails}
                              onChange={(e) => set("powerDetails", e.target.value)}
                              placeholder="e.g. Freezers, warmers, blender..."
                              className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                            />
                          </div>
                        )}
                      </div>

                      {/* Compliance Guidelines Accordion/Box */}
                      <div className="mt-8 border border-fern/30 bg-cream p-5 rounded-xl">
                        <span className="font-bold text-sm text-pine flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-fern" /> Vendor Compliance Guidelines
                        </span>
                        <ul className="mt-3 space-y-2 text-xs text-faded list-disc pl-4 leading-relaxed">
                          {GUIDELINES.map((g, idx) => (
                            <li key={idx}>{g}</li>
                          ))}
                        </ul>

                        <label className="mt-5 flex items-start gap-3 border-t border-ink/10 pt-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.agreed}
                            onChange={(e) => set("agreed", e.target.checked)}
                            className="mt-0.5 h-4 w-4 accent-vivid shrink-0"
                          />
                          <span className="text-xs text-ink font-medium leading-normal">
                            I have read and agree to comply with the Lateeful Akbar Vendor Guidelines and all applicable safety, hygiene and event regulations. *
                          </span>
                        </label>
                      </div>

                      <div className="mt-8 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="inline-flex items-center gap-2 border border-ink/20 px-6 py-3 text-sm font-semibold text-ink rounded hover:border-pine"
                        >
                          <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                        <button
                          type="button"
                          disabled={!form.agreed}
                          onClick={() => setStep(3)}
                          className="inline-flex items-center gap-2 bg-vivid px-7 py-3.5 text-sm font-semibold text-white rounded-lg hover:bg-vivid-deep disabled:opacity-40"
                        >
                          Proceed to Payment <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Summary & Pay Online */}
                  {step === 3 && (
                    <div className="pt-6">
                      <h3 className="font-display text-2xl text-ink">Payment & Instant Approval</h3>
                      <p className="mt-1 text-sm text-faded">Review stall breakdown and complete online payment for instant approval badge.</p>

                      <div className="mt-6 border border-ink/15 bg-mist p-5 rounded-xl space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-faded">Business:</span>
                          <span className="font-semibold text-ink">{form.businessName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-faded">Contact Person:</span>
                          <span className="font-semibold text-ink">{form.contactPerson} ({form.phone})</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-faded">Stall Category:</span>
                          <span className="font-semibold text-ink">{form.category}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-faded">Spaces Allocated:</span>
                          <span className="font-semibold text-ink">{form.spaces} Space(s)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-faded">Power Hookup:</span>
                          <span className="font-semibold text-ink">{form.electricity === "Yes" ? "Yes (+₦15,000)" : "None"}</span>
                        </div>

                        <div className="border-t border-ink/15 pt-3 flex justify-between items-center">
                          <span className="font-bold text-base text-ink">Total Amount:</span>
                          <span className="font-mono text-xl font-extrabold text-vivid">
                            ₦{totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-8 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="inline-flex items-center gap-2 border border-ink/20 px-6 py-3 text-sm font-semibold text-ink rounded hover:border-pine"
                        >
                          <ArrowLeft className="h-4 w-4" /> Back
                        </button>

                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 bg-vivid px-8 py-4 text-sm font-bold uppercase tracking-wider text-white rounded-lg hover:bg-vivid-deep transition-all shadow-lg"
                        >
                          <CreditCard className="h-4 w-4" /> Pay Online & Get Approval
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </Reveal>
            ) : (
              /* Approved Vendor Badge */
              <div className="border border-pine/30 bg-cream p-6 text-center sm:p-10 rounded-xl shadow-xl">
                <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-fern bg-fern/10 px-3 py-1 rounded-full">
                  Alhamdulillah — Vendor Approved
                </span>
                <h3 className="font-display mt-3 text-3xl text-ink">Stall Pass Approved</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-faded">
                  Your stall code is <strong className="font-mono text-pine">{pass.code}</strong>. Payment reference <strong className="font-mono text-faded">{pass.ref}</strong>.
                </p>

                <div className="mx-auto mt-6 max-w-sm">
                  <canvas ref={canvasRef} className="w-full border border-ink/15 bg-white shadow-2xl rounded-lg" />
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={downloadPass}
                    className="inline-flex items-center gap-2 bg-vivid px-6 py-3 text-sm font-semibold text-white rounded-lg hover:bg-vivid-deep shadow-md"
                  >
                    <Download className="h-4 w-4" /> Download Official Vendor Pass
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
