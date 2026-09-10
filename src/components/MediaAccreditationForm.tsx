"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Camera, Check, Download, FileText, Lock, Radio, ShieldCheck, Tv, Video } from "lucide-react";
import { EVENT } from "@/lib/site";
import { Eyebrow, Reveal } from "./ui";

const MEDIA_TYPES = [
  "TV",
  "Radio",
  "Newspaper",
  "Online Blog",
  "Digital Media",
  "Content Creator",
  "Photographer",
  "Videographer",
  "Other",
];

const COVERAGE_TYPES = [
  "Photography",
  "Video",
  "Interviews",
  "Live Updates",
  "Livestream",
  "Written Report",
  "Social Content",
];

const COMPLIANCE_ITEMS = [
  "I understand that submitting this form does not guarantee accreditation.",
  "I agree to wear/display my official media accreditation throughout the event.",
  "I will only access areas authorised for my accreditation level.",
  "I will comply with photography, recording, interview, security and privacy instructions issued by the organisers.",
  "I understand that accreditation may be withdrawn for violation of event guidelines.",
  "I agree not to transfer my Media Pass/QR Code to another person.",
];

export default function MediaAccreditationForm() {
  const [step, setStep] = useState(1);
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ id: string; ref: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    orgName: "",
    mediaType: "Digital Media",
    role: "Photographer / Journalist",
    socialHandles: "",
    purpose: "Event Coverage & Editorial Photography",
    coverageType: "Photography",
    crewCount: "1",
    crewDetails: "",
    equipment: "Camera body, 24-70mm lens, tripod",
    mediaZone: "Yes",
    interviewAccess: "No",
    specialRequests: "",
    agreements: Array(COMPLIANCE_ITEMS.length).fill(false),
    declaration: false,
  });

  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const toggleAgreement = (idx: number) => {
    const next = [...form.agreements];
    next[idx] = !next[idx];
    set("agreements", next);
  };

  const allAgreed = form.agreements.every(Boolean) && form.declaration;

  const onLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onloadend = () => setLogoFile(r.result as string);
    r.readAsDataURL(file);
  };

  const drawMediaPass = (name: string, org: string, id: string, type: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 1100;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 800, 1100);

    // Header
    ctx.fillStyle = "#0B3D2E";
    ctx.fillRect(0, 0, 800, 180);

    ctx.fillStyle = "#DCEBE0";
    ctx.font = "600 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("OFFICIAL PRESS & MEDIA PASS", 400, 60);

    ctx.fillStyle = "#ffffff";
    ctx.font = "300 48px Georgia, serif";
    ctx.fillText("Lateeful-Ul-Akbar 2027", 400, 130);

    // Press Body
    ctx.fillStyle = "#B91C1C";
    ctx.fillRect(250, 220, 300, 50);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 24px sans-serif";
    ctx.fillText("ACCREDITED MEDIA", 400, 255);

    ctx.fillStyle = "#0A2E23";
    ctx.font = "700 36px sans-serif";
    ctx.fillText((name || "MEDIA REPRESENTATIVE").toUpperCase(), 400, 340);

    ctx.fillStyle = "#1A5C45";
    ctx.font = "600 26px sans-serif";
    ctx.fillText(org.toUpperCase(), 400, 395);

    ctx.fillStyle = "#C89D3C";
    ctx.font = "700 26px monospace";
    ctx.fillText(`PRESS ID: ${id}`, 400, 460);

    ctx.fillStyle = "#4C6A5E";
    ctx.font = "400 22px sans-serif";
    ctx.fillText(`Type: ${type}`, 400, 510);
    ctx.fillText(`Date: ${EVENT.dateLong}`, 400, 550);
    ctx.fillText("Venue: Tafawa Balewa Square (Media Zone Authorized)", 400, 590);

    // QR & Signature Seal Box
    ctx.strokeStyle = "#0B3D2E";
    ctx.lineWidth = 3;
    ctx.strokeRect(200, 670, 400, 140);

    ctx.fillStyle = "#0B3D2E";
    ctx.font = "700 26px sans-serif";
    ctx.fillText("MEDIA ZONE CLEARANCE", 400, 730);

    ctx.fillStyle = "#4C6A5E";
    ctx.font = "400 18px sans-serif";
    ctx.fillText("Issued by Nadwat Media & Communications Bureau", 400, 775);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAgreed) return;

    const id = "PRESS-" + Math.floor(10000 + Math.random() * 90000);
    const ref = "MEDIA-" + Math.random().toString(36).slice(2, 7).toUpperCase();

    setSubmitted({ id, ref });
    setTimeout(() => drawMediaPass(form.fullName, form.orgName, id, form.mediaType), 200);
  };

  const downloadPass = () => {
    const c = canvasRef.current;
    if (!c) return;
    const a = document.createElement("a");
    a.download = `MediaAccreditation-${submitted?.id}.png`;
    a.href = c.toDataURL("image/png");
    a.click();
  };

  return (
    <section className="bg-paper py-16 sm:py-24 border-b border-ink/10">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left: Media Information */}
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>Press & Media Accreditation</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-4 text-3xl font-light text-ink sm:text-5xl leading-tight">
                Cover Lateeful Akbar 2027
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-4 text-base leading-relaxed text-faded">
                We welcome accredited journalists, television crews, radio broadcasters, photographers, bloggers, and digital media creators. Submitting this form requests access to the official Media Zone, stage interviews, and press clearance.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-8 border border-fern/30 bg-cream p-5 rounded-xl space-y-4">
                <span className="font-bold text-sm text-pine flex items-center gap-2">
                  <Camera className="h-4 w-4 text-fern" /> Media Access Benefits
                </span>
                <ul className="space-y-2 text-xs text-faded list-disc pl-4 leading-relaxed">
                  <li>Access to designated elevated Media Zone at Tafawa Balewa Square.</li>
                  <li>Official Press Badge & Media Zone Clearance Pass.</li>
                  <li>Interview access with scholars, convener, and organizing committee (upon approval).</li>
                  <li>High-speed dedicated broadcast network uplink for live reporting.</li>
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Right: Media Accreditation Form */}
          <div className="lg:col-span-7">
            {!submitted ? (
              <Reveal delay={0.1}>
                <form onSubmit={handleSubmit} className="border border-ink/15 bg-white p-6 sm:p-10 shadow-lg rounded-xl">
                  {/* Step Progress */}
                  <div className="flex items-center justify-between border-b border-ink/10 pb-5">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-fern">
                      Media Accreditation — Step {step} of 3
                    </span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map((s) => (
                        <span key={s} className={`h-1.5 w-8 rounded-full ${step >= s ? "bg-vivid" : "bg-ink/15"}`} />
                      ))}
                    </div>
                  </div>

                  {/* STEP 1: Personal & Media Organisation Info */}
                  {step === 1 && (
                    <div className="pt-6">
                      <h3 className="font-display text-2xl text-ink">Personal & Media Organisation Info</h3>
                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Full Name *
                          </label>
                          <input
                            required
                            value={form.fullName}
                            onChange={(e) => set("fullName", e.target.value)}
                            placeholder="e.g. Maryam Bello"
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
                            placeholder="press@media.com"
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            City / State *
                          </label>
                          <input
                            required
                            value={form.city}
                            onChange={(e) => set("city", e.target.value)}
                            placeholder="e.g. Lagos, Nigeria"
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Media Organisation / Blog / Platform Name *
                          </label>
                          <input
                            required
                            value={form.orgName}
                            onChange={(e) => set("orgName", e.target.value)}
                            placeholder="e.g. Nadwat Media / National Daily / Muslim Voices Blog"
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Media Type *
                          </label>
                          <select
                            value={form.mediaType}
                            onChange={(e) => set("mediaType", e.target.value)}
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          >
                            {MEDIA_TYPES.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Position / Role *
                          </label>
                          <input
                            required
                            value={form.role}
                            onChange={(e) => set("role", e.target.value)}
                            placeholder="e.g. Photojournalist / Senior Editor"
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Social Media Handles / Website URL
                          </label>
                          <input
                            value={form.socialHandles}
                            onChange={(e) => set("socialHandles", e.target.value)}
                            placeholder="https://instagram.com/yourplatform or @twitterhandle"
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Upload Company / Media House Logo *
                          </label>
                          <div className="mt-1.5 flex items-center gap-4 border border-dashed border-ink/20 bg-mist p-4 rounded-lg">
                            {logoFile && (
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-ink/20 bg-white p-1">
                                <Image src={logoFile} alt="Company logo preview" fill className="object-contain" />
                              </div>
                            )}
                            <label className="cursor-pointer bg-pine px-4 py-2 text-xs font-semibold text-white rounded hover:bg-ink">
                              {logoFile ? "Change Logo" : "Upload Company Logo"}
                              <input type="file" accept="image/*" onChange={onLogoUpload} className="hidden" />
                            </label>
                            <span className="text-xs text-faded">Official Organization or Media House Logo (PNG, JPG, SVG)</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button
                          type="button"
                          disabled={!form.fullName || !form.phone || !form.email || !form.orgName}
                          onClick={() => setStep(2)}
                          className="inline-flex items-center gap-2 bg-vivid px-7 py-3.5 text-sm font-semibold text-white rounded-lg hover:bg-vivid-deep disabled:opacity-40"
                        >
                          Continue to Coverage Details <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Coverage Information & Equipment */}
                  {step === 2 && (
                    <div className="pt-6">
                      <h3 className="font-display text-2xl text-ink">Coverage Scope & Technical Equipment</h3>
                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Purpose of Coverage *
                          </label>
                          <input
                            required
                            value={form.purpose}
                            onChange={(e) => set("purpose", e.target.value)}
                            placeholder="e.g. Feature documentary, live news bulletin, photo essay..."
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Coverage Type *
                          </label>
                          <select
                            value={form.coverageType}
                            onChange={(e) => set("coverageType", e.target.value)}
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          >
                            {COVERAGE_TYPES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Number of Crew Members *
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={form.crewCount}
                            onChange={(e) => set("crewCount", e.target.value)}
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Names & Roles of Additional Crew Members
                          </label>
                          <textarea
                            rows={2}
                            value={form.crewDetails}
                            onChange={(e) => set("crewDetails", e.target.value)}
                            placeholder="e.g. John Doe (Cameraman), Jane Smith (Sound engineer)"
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Equipment Being Brought (Camera, Tripod, Drone, Lighting, etc.)
                          </label>
                          <input
                            value={form.equipment}
                            onChange={(e) => set("equipment", e.target.value)}
                            placeholder="e.g. 2 DSLR cameras, 1 video camera, wireless mics"
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Require access to Media Zone?
                          </label>
                          <select
                            value={form.mediaZone}
                            onChange={(e) => set("mediaZone", e.target.value)}
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          >
                            <option value="Yes">Yes — Elevated Media Platform</option>
                            <option value="No">No — General Press Area</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-faded block">
                            Interview Access Required?
                          </label>
                          <select
                            value={form.interviewAccess}
                            onChange={(e) => set("interviewAccess", e.target.value)}
                            className="w-full mt-1.5 border border-ink/20 bg-mist px-4 py-3 text-sm text-ink rounded focus:border-pine focus:bg-white focus:outline-none"
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes — Press Conference / Convener Interview</option>
                          </select>
                        </div>
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
                          onClick={() => setStep(3)}
                          className="inline-flex items-center gap-2 bg-vivid px-7 py-3.5 text-sm font-semibold text-white rounded-lg hover:bg-vivid-deep"
                        >
                          Continue to Compliance Declarations <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Compliance & Declaration */}
                  {step === 3 && (
                    <div className="pt-6">
                      <h3 className="font-display text-2xl text-ink">Media Compliance & Guidelines Agreement</h3>
                      <p className="mt-1 text-sm text-faded">Please review and check all official press accreditation rules.</p>

                      <div className="mt-6 space-y-3 border border-ink/15 bg-mist p-5 rounded-xl">
                        {COMPLIANCE_ITEMS.map((item, idx) => (
                          <label key={idx} className="flex items-start gap-3 cursor-pointer py-1.5 border-b border-ink/10 last:border-0">
                            <input
                              type="checkbox"
                              checked={form.agreements[idx]}
                              onChange={() => toggleAgreement(idx)}
                              className="mt-0.5 h-4 w-4 accent-vivid shrink-0"
                            />
                            <span className="text-xs text-ink leading-relaxed font-medium">{item} *</span>
                          </label>
                        ))}

                        <label className="flex items-start gap-3 pt-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.declaration}
                            onChange={(e) => set("declaration", e.target.checked)}
                            className="mt-0.5 h-4 w-4 accent-vivid shrink-0"
                          />
                          <span className="text-xs font-bold text-pine leading-relaxed">
                            Declaration: I confirm that the information provided is accurate and agree to abide by the Lateeful Akbar Media Accreditation Guidelines. *
                          </span>
                        </label>
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
                          disabled={!allAgreed}
                          className="inline-flex items-center gap-2 bg-vivid px-8 py-4 text-sm font-bold uppercase tracking-wider text-white rounded-lg hover:bg-vivid-deep disabled:opacity-40 shadow-lg"
                        >
                          [ SUBMIT FOR ACCREDITATION ]
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </Reveal>
            ) : (
              /* Media Pass Certificate */
              <div className="border border-pine/30 bg-cream p-6 text-center sm:p-10 rounded-xl shadow-xl">
                <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-600 bg-red-100 px-3 py-1 rounded-full">
                  Media Application Submitted
                </span>
                <h3 className="font-display mt-3 text-3xl text-ink">Press Pass Issued</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-faded">
                  Your Press ID is <strong className="font-mono text-pine">{submitted.id}</strong>. Reference <strong className="font-mono text-faded">{submitted.ref}</strong>.
                </p>

                <div className="mx-auto mt-6 max-w-sm">
                  <canvas ref={canvasRef} className="w-full border border-ink/15 bg-white shadow-2xl rounded-lg" />
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={downloadPass}
                    className="inline-flex items-center gap-2 bg-vivid px-6 py-3 text-sm font-semibold text-white rounded-lg hover:bg-vivid-deep shadow-md"
                  >
                    <Download className="h-4 w-4" /> Download Official Press Badge
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
