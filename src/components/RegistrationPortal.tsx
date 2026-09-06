"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Download, Share2 } from "lucide-react";
import { EVENT } from "@/lib/site";
import { Eyebrow, Reveal } from "./ui";

const inputCls =
  "w-full border border-ink/20 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink/35 focus:border-pine focus:outline-none";
const labelCls = "text-[11px] font-semibold uppercase tracking-[0.18em] text-faded";

export default function RegistrationPortal() {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [pass, setPass] = useState<{ id: string; ref: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [form, setForm] = useState({
    fullName: "",
    gender: "Brother",
    phone: "",
    email: "",
    city: "",
    attendance: "Physical at TBS",
    referral: "",
    intention: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onloadend = () => setPhoto(r.result as string);
    r.readAsDataURL(file);
  };

  const drawPass = (name: string, id: string, img: string | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 900;
    canvas.height = 1200;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 900, 1200);
    ctx.fillStyle = "#0B3D2E";
    ctx.fillRect(0, 0, 900, 200);
    ctx.fillStyle = "#DCEBE0";
    ctx.font = "600 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("NADWAT GLOBAL ASSEMBLY", 450, 80);
    ctx.fillStyle = "#ffffff";
    ctx.font = "300 64px Georgia, serif";
    ctx.fillText("Lateeful-Ul-Akbar", 450, 150);
    const draw = (photoEl: HTMLImageElement | null) => {
      if (photoEl) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(450, 430, 130, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(photoEl, 320, 300, 260, 260);
        ctx.restore();
      }
      ctx.fillStyle = "#0A2E23";
      ctx.font = "600 40px sans-serif";
      ctx.fillText((name || "Honored Guest").toUpperCase().slice(0, 26), 450, 640);
      ctx.fillStyle = "#1A5C45";
      ctx.font = "500 30px monospace";
      ctx.fillText(id, 450, 690);
      ctx.fillStyle = "#4C6A5E";
      ctx.font = "400 26px sans-serif";
      ctx.fillText(EVENT.dateLong, 450, 770);
      ctx.fillText("Tafawa Balewa Square, Lagos", 450, 810);
      ctx.fillText("Dress code: all white", 450, 850);
      ctx.fillStyle = "#0B3D2E";
      ctx.font = "400 30px Georgia, serif";
      ctx.fillText("Ya Lateef, the Most Gentle", 450, 1050);
    };
    if (img) {
      const el = new window.Image();
      el.src = img;
      el.onload = () => draw(el);
      el.onerror = () => draw(null);
    } else {
      draw(null);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = "LA-" + Math.floor(100000 + Math.random() * 900000);
    const ref = "REF" + Math.random().toString(36).slice(2, 7).toUpperCase();
    setPass({ id, ref });
    setTimeout(() => drawPass(form.fullName, id, photo), 200);
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
                          <label className={labelCls} htmlFor="reg-name">Full name</label>
                          <input id="reg-name" required value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="e.g. Ibrahim Abubakar" className={`${inputCls} mt-1.5`} />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="reg-email">Email</label>
                          <input id="reg-email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={`${inputCls} mt-1.5`} />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="reg-phone">Phone or WhatsApp</label>
                          <input id="reg-phone" type="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+234 800 000 0000" className={`${inputCls} mt-1.5`} />
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelCls} htmlFor="reg-gender">Seating canopy</label>
                          <select id="reg-gender" value={form.gender} onChange={(e) => set("gender", e.target.value)} className={`${inputCls} mt-1.5`}>
                            <option>Brother</option>
                            <option>Sister</option>
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
                          <label className={labelCls} htmlFor="reg-city">City</label>
                          <input id="reg-city" required value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Ikeja, Lagos" className={`${inputCls} mt-1.5`} />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="reg-att">Attendance</label>
                          <select id="reg-att" value={form.attendance} onChange={(e) => set("attendance", e.target.value)} className={`${inputCls} mt-1.5`}>
                            <option>Physical at TBS</option>
                            <option>Online via livestream</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="reg-ref">Referral code (optional)</label>
                          <input id="reg-ref" value={form.referral} onChange={(e) => set("referral", e.target.value)} placeholder="e.g. REF123" className={`${inputCls} mt-1.5`} />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="reg-int">Private intention (optional)</label>
                          <input id="reg-int" value={form.intention} onChange={(e) => set("intention", e.target.value)} placeholder="Kept between you and Allah" className={`${inputCls} mt-1.5`} />
                        </div>
                      </div>
                      <div className="mt-8 flex items-center justify-between">
                        <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-2 border border-ink/20 px-6 py-3.5 text-sm font-semibold text-ink hover:border-pine hover:text-pine">
                          <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                        <button type="button" onClick={() => setStep(3)} disabled={!form.city} className="inline-flex items-center gap-2 bg-vivid px-7 py-3.5 text-sm font-semibold text-white hover:bg-vivid-deep disabled:opacity-40">
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
                        <button type="submit" className="inline-flex items-center gap-2 bg-vivid px-7 py-3.5 text-sm font-semibold text-white hover:bg-vivid-deep">
                          <Check className="h-4 w-4" /> Generate my pass
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
                  Show this at the gates for accreditation. Your referral code is{" "}
                  <strong className="font-mono text-pine">{pass.ref}</strong>.
                </p>
                <div className="mx-auto mt-6 max-w-sm">
                  <canvas ref={canvasRef} className="w-full border border-ink/15 bg-white shadow-lg" />
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button onClick={download} className="inline-flex items-center gap-2 bg-vivid px-6 py-3 text-sm font-semibold text-white hover:bg-vivid-deep">
                    <Download className="h-4 w-4" /> Download PNG
                  </button>
                  <button
                    onClick={() => navigator.share?.({ title: "Lateeful Akbar 2027", text: `I will be at Lateeful Akbar 2027. Join with my code ${pass.ref}` }).catch(() => {})}
                    className="inline-flex items-center gap-2 border border-pine px-6 py-3 text-sm font-semibold text-pine hover:bg-vivid hover:text-white"
                  >
                    <Share2 className="h-4 w-4" /> Share invite
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
