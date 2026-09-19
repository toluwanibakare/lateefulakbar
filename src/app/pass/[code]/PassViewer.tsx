"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, Share2, Check, Loader2, Calendar, MapPin, Ticket, ShieldCheck, UserCheck } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export default function PassViewer({ passCode }: { passCode: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passData, setPassData] = useState<{
    passCode: string;
    referralCode: string;
    qrCodeDataUrl: string;
    registration: {
      fullName: string;
      email: string;
      phone: string;
      ticketType: string;
      passCode: string;
      referralCode: string;
    };
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/register/pass?code=${encodeURIComponent(passCode)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.passCode) {
          setPassData(data);
          setTimeout(() => {
            drawCanvas(data.registration?.fullName || "Guest", data.passCode, null);
          }, 200);
        } else {
          setError(data.error || "Pass not found. Please check your pass code.");
        }
      })
      .catch((err) => {
        console.error("Error fetching pass:", err);
        setError("Failed to load pass details. Please check your internet connection.");
      })
      .finally(() => setLoading(false));
  }, [passCode]);

  const drawCanvas = (name: string, id: string, imgUrl: string | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const templateWidth = 810;
    const templateHeight = 1080;
    canvas.width = templateWidth;
    canvas.height = templateHeight;

    const bgImg = new window.Image();
    bgImg.src = "/I_will_be_attending.png";

    const renderPhoto = (userImg: HTMLImageElement | null) => {
      ctx.drawImage(bgImg, 0, 0, templateWidth, templateHeight);

      const cx = 405;
      const cy = 415;
      const radius = 208;

      if (userImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const scale = Math.max((radius * 2) / userImg.width, (radius * 2) / userImg.height);
        const w = userImg.width * scale;
        const h = userImg.height * scale;
        const x = cx - w / 2;
        const y = cy - h / 2;

        ctx.drawImage(userImg, x, y, w, h);
        ctx.restore();
      }
    };

    let loadedUserImg: HTMLImageElement | null = null;
    let bgLoaded = false;
    let userLoaded = false;

    const checkDone = () => {
      if (bgLoaded && (!imgUrl || userLoaded)) {
        renderPhoto(loadedUserImg);
      }
    };

    bgImg.onload = () => {
      bgLoaded = true;
      checkDone();
    };
    bgImg.onerror = () => {
      bgLoaded = true;
      checkDone();
    };

    if (imgUrl) {
      loadedUserImg = new window.Image();
      loadedUserImg.src = imgUrl;
      loadedUserImg.onload = () => {
        userLoaded = true;
        checkDone();
      };
      loadedUserImg.onerror = () => {
        userLoaded = true;
        checkDone();
      };
    } else {
      checkDone();
    }
  };

  const onPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onloadend = () => {
      const dataUrl = r.result as string;
      setPhoto(dataUrl);
      if (passData) {
        drawCanvas(passData.registration.fullName, passData.passCode, dataUrl);
      }
    };
    r.readAsDataURL(file);
  };

  const download = () => {
    const c = canvasRef.current;
    if (!c) return;
    const a = document.createElement("a");
    a.download = `LateefulAkbar-Pass-${passCode}.png`;
    a.href = c.toDataURL("image/png");
    a.click();
  };

  const referralLink = passData
    ? `${typeof window !== "undefined" ? window.location.origin : "https://lateefulakbar.com"}/register?ref=${passData.referralCode}`
    : "";

  return (
    <>
      <PageHeader
        eyebrow="Official Pass & Accreditation"
        title={<>Event Ticket: {passCode}</>}
        intro="Alhamdulillah! Your official attendance pass for Lateeful-Ul-Akbar 2027 is verified and active."
        image="/assets/crowd-12.jpg"
      />

      <section className="bg-cream/40 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-pine" />
              <p className="mt-4 text-base font-medium text-faded">Loading your event ticket details...</p>
            </div>
          ) : error ? (
            <div className="mx-auto max-w-md border border-red-300 bg-red-50 p-8 text-center rounded-xl">
              <p className="text-lg font-semibold text-red-700">{error}</p>
              <p className="mt-2 text-sm text-red-600">Please make sure the link in your email is complete.</p>
              <Link
                href="/register"
                className="mt-6 inline-block bg-pine px-6 py-3 text-sm font-semibold text-white rounded-lg hover:bg-vivid"
              >
                Register for Pass
              </Link>
            </div>
          ) : passData ? (
            <div className="grid gap-12 lg:grid-cols-12">
              {/* Left Column: Canvas Artwork preview */}
              <div className="lg:col-span-6">
                <div className="border border-pine/20 bg-white p-6 shadow-xl rounded-2xl">
                  <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-pine">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" /> Printable Pass Artwork
                    </span>
                    <span className="font-mono text-xs font-bold text-pine">{passCode}</span>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-lg border border-ink/10">
                    <canvas ref={canvasRef} className="w-full h-auto bg-white" />
                  </div>

                  <div className="mt-6 border-t border-ink/10 pt-4 text-center">
                    <p className="text-xs text-faded font-medium">Add or change photo on your flyer artwork:</p>
                    <label className="mt-3 inline-flex cursor-pointer items-center gap-2 border border-pine px-5 py-2.5 text-xs font-semibold text-pine hover:bg-vivid hover:text-white rounded-lg transition-colors">
                      <UserCheck className="h-4 w-4" />
                      <span>{photo ? "Change Photo on Flyer" : "Upload Your Photo"}</span>
                      <input type="file" accept="image/*" onChange={onPhotoUpload} className="hidden" />
                    </label>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={download}
                      className="flex w-full items-center justify-center gap-2 bg-vivid py-4 text-sm font-bold text-white shadow-md hover:bg-vivid-deep rounded-xl transition-all"
                    >
                      <Download className="h-5 w-5" /> Download Printable Pass Artwork
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Ticket details & QR Code */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div className="border border-ink/15 bg-white p-6 sm:p-8 shadow-sm rounded-2xl">
                  <div className="flex items-center justify-between border-b border-ink/10 pb-5">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-fern">Verified Pass</span>
                      <h3 className="font-display text-2xl font-bold text-ink mt-0.5">{passData.registration.fullName}</h3>
                    </div>
                    {passData.qrCodeDataUrl && (
                      <div className="h-16 w-16 overflow-hidden rounded-lg border border-ink/15 p-1 bg-white">
                        {/* eslint-disable-next-html-element-suppress */}
                        <img src={passData.qrCodeDataUrl} alt="QR Code" className="h-full w-full object-contain" />
                      </div>
                    )}
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <Ticket className="h-5 w-5 text-pine shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-faded">Pass Code</p>
                        <p className="font-mono text-lg font-bold text-pine">{passCode}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-pine shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-faded">Event Date & Time</p>
                        <p className="text-sm font-medium text-ink">Sunday, Jan 24, 2027 &bull; 9:00 AM - 5:00 PM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-pine shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-faded">Venue</p>
                        <p className="text-sm font-medium text-ink">Tafawa Balewa Square (TBS) Main Bowl, Lagos Island</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <UserCheck className="h-5 w-5 text-pine shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-faded">Attendance Type</p>
                        <p className="text-sm font-medium text-ink">{passData.registration.ticketType || "Physical at TBS"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Referral Box */}
                  <div className="mt-8 border border-emerald-500/30 bg-emerald-500/10 p-5 rounded-xl">
                    <p className="text-xs font-bold uppercase tracking-wider text-pine">
                      Your Referral Link & Code
                    </p>
                    <p className="mt-1 text-xs text-faded">
                      Share your custom referral link. Friends and family registering through your link will count toward your referral total on the event leaderboard.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={referralLink}
                        className="min-w-0 flex-1 border border-ink/20 bg-white px-3 py-2 text-xs font-mono text-ink rounded-lg focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(referralLink);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="inline-flex shrink-0 items-center gap-1.5 bg-pine px-4 py-2 text-xs font-semibold text-white rounded-lg hover:bg-vivid transition-colors"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-amber-300" /> : <Share2 className="h-3.5 w-3.5" />}
                        <span>{copied ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                    <p className="mt-2 text-[11px] text-faded font-medium">
                      Code: <span className="font-mono font-bold text-pine">{passData.referralCode}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  <button
                    onClick={download}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-vivid py-3.5 text-sm font-bold text-white hover:bg-vivid-deep rounded-xl shadow transition-colors"
                  >
                    <Download className="h-4 w-4" /> Download Pass
                  </button>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center border border-ink/20 bg-white px-6 py-3.5 text-sm font-semibold text-ink hover:border-pine hover:text-pine rounded-xl transition-colors"
                  >
                    Register Another Guest
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
