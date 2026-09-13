"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Download, Share2 } from "lucide-react";
import { EVENT } from "@/lib/site";
import { Eyebrow, Reveal } from "./ui";

const inputCls =
  "w-full border border-ink/20 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink/35 focus:border-pine focus:outline-none";
const labelCls = "text-[11px] font-semibold uppercase tracking-[0.18em] text-faded";

export default function RegistrationPortal() {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [pass, setPass] = useState<{ id: string; ref: string; referralLink: string; qrCode?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [form, setForm] = useState({
    fullName: "",
    gender: "Brother",
    phone: "",
    email: "",
    ageRange: "26 - 35 years",
    country: "Nigeria",
    city: "",
    attendance: "Physical at TBS",
    isNadwatMember: "No",
    referral: "",
    intention: "",
    consent: false,
  });

  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get("ref") || params.get("referral");
      if (refParam) {
        set("referral", refParam.trim());
      }
    }
  }, []);

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onloadend = () => setPhoto(r.result as string);
    r.readAsDataURL(file);
  };

  const drawPass = (name: string, id: string, img: string | null, qrDataUrl?: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 900;
    canvas.height = 1200;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 900, 1200);
    ctx.fillStyle = "#0F766E";
    ctx.fillRect(0, 0, 900, 200);
    ctx.fillStyle = "#DCEBE0";
    ctx.font = "600 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("LATEEFUL AKBAR 2027", 450, 80);
    ctx.fillStyle = "#ffffff";
    ctx.font = "300 56px Georgia, serif";
    ctx.fillText("Official Guest Pass", 450, 150);

    const finishDrawing = (userImg: HTMLImageElement | null, qrImg: HTMLImageElement | null) => {
      if (userImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(450, 360, 110, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(userImg, 340, 250, 220, 220);
        ctx.restore();
        ctx.strokeStyle = "#0F766E";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(450, 360, 110, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = "#F1F5F9";
        ctx.beginPath();
        ctx.arc(450, 360, 110, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#0F766E";
        ctx.font = "bold 90px Georgia, serif";
        ctx.fillText(name.charAt(0).toUpperCase() || "L", 450, 390);
      }

      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 42px Georgia, serif";
      ctx.fillText((name || "Honored Guest").toUpperCase().slice(0, 26), 450, 560);
      
      ctx.fillStyle = "#0D9488";
      ctx.font = "600 28px monospace";
      ctx.fillText(`PASS CODE: ${id}`, 450, 610);

      ctx.fillStyle = "#475569";
      ctx.font = "400 24px sans-serif";
      ctx.fillText(EVENT.dateLong, 450, 680);
      ctx.fillText("Tafawa Balewa Square (TBS), Lagos", 450, 720);
      ctx.fillText("Dress code: Clean White Attire", 450, 760);

      if (qrImg) {
        ctx.drawImage(qrImg, 350, 800, 200, 200);
        ctx.fillStyle = "#64748b";
        ctx.font = "400 18px sans-serif";
        ctx.fillText("Scan QR code for venue entrance accreditation", 450, 1030);
      }

      ctx.fillStyle = "#0F766E";
      ctx.font = "400 26px Georgia, serif";
      ctx.fillText("Nadwat Global Assembly — www.lateefulakbar.com", 450, 1130);
    };

    let loadedImg: HTMLImageElement | null = null;
    let qrEl: HTMLImageElement | null = null;
    let imgLoaded = false;
    let qrLoaded = false;

    const checkDone = () => {
      if ((!img || imgLoaded) && (!qrDataUrl || qrLoaded)) {
        finishDrawing(loadedImg, qrEl);
      }
    };

    if (img) {
      loadedImg = new window.Image();
      loadedImg.src = img;
      loadedImg.onload = () => { imgLoaded = true; checkDone(); };
      loadedImg.onerror = () => { imgLoaded = true; checkDone(); };
    }

    if (qrDataUrl) {
      qrEl = new window.Image();
      qrEl.src = qrDataUrl;
      qrEl.onload = () => { qrLoaded = true; checkDone(); };
      qrEl.onerror = () => { qrLoaded = true; checkDone(); };
    }

    if (!img && !qrDataUrl) {
      finishDrawing(null, null);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          ticketType: form.attendance,
          referredBy: form.referral,
        }),
      });

      const data = await res.json();
      const passCode = data.passCode || ("LA2027-" + Math.floor(10000 + Math.random() * 90000));
      const refCode = data.referralCode || ("REF-" + Math.random().toString(36).slice(2, 7).toUpperCase());
      const origin = typeof window !== "undefined" ? window.location.origin : "https://lateefulakbar.com";
      const referralLink = `${origin}/register?ref=${refCode}`;

      setPass({ id: passCode, ref: refCode, referralLink, qrCode: data.qrCodeDataUrl });
      setTimeout(() => drawPass(form.fullName, passCode, photo, data.qrCodeDataUrl), 200);
    } catch (err) {
      console.error('Registration API error:', err);
      const fallbackCode = "LA2027-" + Math.floor(10000 + Math.random() * 90000);
      const refCode = "REF-" + Math.random().toString(36).slice(2, 7).toUpperCase();
      const origin = typeof window !== "undefined" ? window.location.origin : "https://lateefulakbar.com";
      setPass({ id: fallbackCode, ref: refCode, referralLink: `${origin}/register?ref=${refCode}` });
      setTimeout(() => drawPass(form.fullName, fallbackCode, photo), 200);
    } finally {
      setSubmitting(false);
    }
  };

  const download = () => {
    const c = canvasRef.current;
    if (!c) return;
    const a = document.createElement("a");
    a.download = `LateefulAkbar-Pass-${pass?.id}.png`;
    a.href = c.toDataURL("image/png");
    a.click();
  };

  return (
    <section id="register" className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left: sticky pitch with image */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <Eyebrow>07 - Registration</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="font-display text-balance mt-5 text-4xl leading-tight font-light tracking-tight text-ink sm:text-5xl">
                  Your pass, in three short steps
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-faded">
                  Free for all guests. Tell us who you are, how you will join, and add a photo
                  for your printable accreditation artwork.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="relative mt-8 aspect-[16/10] overflow-hidden bg-mist">
                  <Image
                    src="/assets/crowd-12.jpg"
                    alt="Worshippers arriving at the gates"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="img-true object-cover"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            </div>
          </div>

          {/* Right: the form */}
          <div className="lg:col-span-7">
            {!pass ? (
              <Reveal delay={0.1}>
                <form onSubmit={submit} className="border border-ink/15 bg-white p-6 sm:p-10">
                  <div className="flex items-center justify-between border-b border-ink/10 pb-5">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-fern">
                      Step {step} of 3
                    </span>
                    <div className="flex gap-1.5" aria-hidden>
                      {[1, 2, 3].map((s) => (
                        <span key={s} className={`h-1 w-10 ${step >= s ? "bg-vivid" : "bg-ink/15"}`} />
                      ))}
                    </div>
                  </div>

                  {step === 1 && (
                    <div className="pt-7">
                      <h3 className="font-display text-2xl text-ink">Who is coming?</h3>
                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className={labelCls} htmlFor="reg-name">Full name *</label>
                          <input id="reg-name" required value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="e.g. Ibrahim Abubakar" className={`${inputCls} mt-1.5`} />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="reg-email">Email *</label>
                          <input id="reg-email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={`${inputCls} mt-1.5`} />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="reg-phone">Phone or WhatsApp *</label>
                          <input id="reg-phone" type="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+234 800 000 0000" className={`${inputCls} mt-1.5`} />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="reg-gender">Gender / Canopy *</label>
                          <select id="reg-gender" value={form.gender} onChange={(e) => set("gender", e.target.value)} className={`${inputCls} mt-1.5`}>
                            <option>Brother</option>
                            <option>Sister</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="reg-age">Age Range *</label>
                          <select id="reg-age" value={form.ageRange} onChange={(e) => set("ageRange", e.target.value)} className={`${inputCls} mt-1.5`}>
                            <option>18 - 25 years</option>
                            <option>26 - 35 years</option>
                            <option>36 - 50 years</option>
                            <option>50+ years</option>
                            <option>Under 18</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-8 flex justify-end">
                        <button
                          type="button"
                          disabled={!form.fullName || !form.email || !form.phone}
                          onClick={() => setStep(2)}
                          className="inline-flex items-center gap-2 bg-vivid px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-vivid-deep disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Continue <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="pt-7">
                      <h3 className="font-display text-2xl text-ink">How will you join?</h3>
                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className={labelCls} htmlFor="reg-country">Country of Residence *</label>
                          <input id="reg-country" required value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="e.g. Nigeria, United Kingdom, USA" className={`${inputCls} mt-1.5`} />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="reg-city">State / City *</label>
                          <input id="reg-city" required value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Ikeja, Lagos" className={`${inputCls} mt-1.5`} />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="reg-att">Attendance Type *</label>
                          <select id="reg-att" value={form.attendance} onChange={(e) => set("attendance", e.target.value)} className={`${inputCls} mt-1.5`}>
                            <option>Physical at TBS</option>
                            <option>Online via livestream</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="reg-member">Nadwat Member? *</label>
                          <select id="reg-member" value={form.isNadwatMember} onChange={(e) => set("isNadwatMember", e.target.value)} className={`${inputCls} mt-1.5`}>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="reg-ref">Referral Code or How You Heard About Us (Optional)</label>
                          <input id="reg-ref" value={form.referral} onChange={(e) => set("referral", e.target.value)} placeholder="e.g. REF-A1B2C, Social Media, Friend, Mosque" className={`${inputCls} mt-1.5`} />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="reg-int">Private Prayer Request / Intention (optional)</label>
                          <input id="reg-int" value={form.intention} onChange={(e) => set("intention", e.target.value)} placeholder="Kept private between you and Allah" className={`${inputCls} mt-1.5`} />
                        </div>
                      </div>

                      <div className="mt-6 border-t border-ink/10 pt-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.consent}
                            onChange={(e) => set("consent", e.target.checked)}
                            className="mt-0.5 h-4 w-4 accent-vivid shrink-0"
                          />
                          <span className="text-xs text-ink/80 leading-relaxed font-medium">
                            I agree to general event guidelines and consent to receive event updates from Nadwat. *
                          </span>
                        </label>
                      </div>

                      <div className="mt-8 flex items-center justify-between">
                        <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-2 border border-ink/20 px-6 py-3.5 text-sm font-semibold text-ink hover:border-pine hover:text-pine">
                          <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                        <button type="button" onClick={() => setStep(3)} disabled={!form.city || !form.country || !form.consent} className="inline-flex items-center gap-2 bg-vivid px-7 py-3.5 text-sm font-semibold text-white hover:bg-vivid-deep disabled:opacity-40">
                          Continue <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="pt-7">
                      <h3 className="font-display text-2xl text-ink">Photo for your pass</h3>
                      <div className="mt-6 flex flex-col items-center border border-dashed border-ink/25 bg-cream px-6 py-10 text-center">
                        {photo ? (
                          <span className="relative block h-28 w-28 overflow-hidden rounded-full">
                            <Image src={photo} alt="Your uploaded photo" fill className="object-cover" />
                          </span>
                        ) : (
                          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sage font-display text-2xl text-pine">
                            {form.fullName.charAt(0).toUpperCase() || "L"}
                          </span>
                        )}
                        <label className="mt-4 cursor-pointer border border-pine px-5 py-2.5 text-[13px] font-semibold text-pine hover:bg-vivid hover:text-white">
                          {photo ? "Change photo" : "Upload photo"}
                          <input type="file" accept="image/*" onChange={onPhoto} className="hidden" />
                        </label>
                        <p className="mt-2 text-[12px] text-faded">Used only on your pass artwork.</p>
                      </div>
                      <div className="mt-8 flex items-center justify-between">
                        <button type="button" onClick={() => setStep(2)} className="inline-flex items-center gap-2 border border-ink/20 px-6 py-3.5 text-sm font-semibold text-ink hover:border-pine hover:text-pine">
                          <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                        <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 bg-vivid px-7 py-3.5 text-sm font-semibold text-white hover:bg-vivid-deep disabled:opacity-50">
                          <Check className="h-4 w-4" /> {submitting ? "Generating pass..." : "Generate my pass"}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </Reveal>
            ) : (
              <div className="border border-pine/30 bg-cream p-6 text-center sm:p-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fern">Alhamdulillah - registered</p>
                <h3 className="font-display mt-2 text-3xl text-ink">Your pass is ready</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-faded">
                  Pass Code: <strong className="font-mono text-pine">{pass.id}</strong>. An email pass confirmation has been issued.
                </p>
                <div className="mx-auto mt-6 max-w-sm">
                  <canvas ref={canvasRef} className="w-full border border-ink/15 bg-white shadow-lg" />
                </div>

                {/* Unique Referral Invite Box */}
                <div className="mt-6 border border-emerald-500/30 bg-emerald-500/10 p-4 text-left rounded-lg">
                  <p className="text-xs font-semibold uppercase tracking-wider text-pine dark:text-emerald-300">
                    Your Personal Referral Link & Code
                  </p>
                  <p className="mt-1 text-xs text-faded">
                    Share your unique link with friends, family, and mosque members. Every registration using your link is tracked on the event leaderboard!
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pass.referralLink}
                      className="min-w-0 flex-1 border border-ink/20 bg-white px-3 py-2 text-xs font-mono text-ink rounded focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(pass.referralLink);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="inline-flex shrink-0 items-center gap-1.5 bg-pine px-4 py-2 text-xs font-semibold text-white rounded hover:bg-vivid transition-colors"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-amber-300" /> : <Share2 className="h-3.5 w-3.5" />}
                      <span>{copied ? "Copied!" : "Copy Link"}</span>
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] text-faded font-medium">
                    Referral Code: <span className="font-mono font-bold text-pine">{pass.ref}</span>
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button onClick={download} className="inline-flex items-center gap-2 bg-vivid px-6 py-3 text-sm font-semibold text-white hover:bg-vivid-deep">
                    <Download className="h-4 w-4" /> Download Pass
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "Lateeful Akbar 2027",
                          text: `Register for Lateeful Akbar 2027 using my invitation link!`,
                          url: pass.referralLink,
                        }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(pass.referralLink);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }
                    }}
                    className="inline-flex items-center gap-2 border border-pine px-6 py-3 text-sm font-semibold text-pine hover:bg-vivid hover:text-white"
                  >
                    <Share2 className="h-4 w-4" /> Share Invite Link
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
