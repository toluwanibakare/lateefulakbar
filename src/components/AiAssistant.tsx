"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  Car,
  Heart,
  MapPin,
  MessageSquare,
  Radio,
  Send,
  Shirt,
  Sparkles,
  Ticket,
  User,
  X,
} from "lucide-react";

type Msg = { id: string; from: "bot" | "user"; text: string; time: string };

const CHIPS = [
  { label: "When & Where?", icon: MapPin, query: "When and where is it?" },
  { label: "Dress Code", icon: Shirt, query: "What should I wear?" },
  { label: "Parking & Route", icon: Car, query: "Where do I park?" },
  { label: "Free Pass", icon: Ticket, query: "How do I register?" },
  { label: "Sadaqah Giving", icon: Heart, query: "How do I give sadaqah?" },
  { label: "Live Stream", icon: Radio, query: "How to watch live stream?" },
];

function answer(q: string): string {
  const s = q.toLowerCase();
  if (
    s.includes("when") ||
    s.includes("where") ||
    s.includes("date") ||
    s.includes("venue") ||
    s.includes("time")
  )
    return "Sunday, January 24, 2027 at Tafawa Balewa Square (TBS Main Bowl), Lagos Island. Gates open early morning; the grand collective du'a peaks in the afternoon. View route details at /venue.";
  if (s.includes("wear") || s.includes("dress") || s.includes("white"))
    return "Strictly all white: clean, dignified white attire for every honored attendee, brothers and sisters alike.";
  if (
    s.includes("park") ||
    s.includes("car") ||
    s.includes("bus") ||
    s.includes("drive") ||
    s.includes("direction") ||
    s.includes("location")
  )
    return "Vehicles are parked at designated perimeter lots only. Check the interactive map and navigation options on the Venue page (/venue).";
  if (
    s.includes("register") ||
    s.includes("pass") ||
    s.includes("accredit") ||
    s.includes("ticket")
  )
    return "Guest registration is completely free. Visit /register to fill out your details and generate a personalized pass. For vendors see /vendors, and for press see /media-accreditation.";
  if (s.includes("sadaqah") || s.includes("tithe"))
    return "Sadaqah is open voluntary charity of any amount. You can participate on the Sadaqah page (/sadaqah).";
  if (
    s.includes("donate") ||
    s.includes("give") ||
    s.includes("pay") ||
    s.includes("support") ||
    s.includes("fund")
  )
    return "Campaign support funds essential gathering amenities (water, mats, audio, security). Explore options on /donate or give open Sadaqah at /sadaqah.";
  if (
    s.includes("founder") ||
    s.includes("convener") ||
    s.includes("missioner") ||
    s.includes("lawal") ||
    s.includes("sheikh") ||
    s.includes("shaikh")
  )
    return "The Convener & Chief Missioner is Shaikh Dr. Abdur Rahman Ade Lawal: Al-Azhar trained Islamic scholar, PhD in Mass Communication, author and leader. Learn more at /founder.";
  if (
    s.includes("stream") ||
    s.includes("live") ||
    s.includes("watch") ||
    s.includes("online") ||
    s.includes("count") ||
    s.includes("tasbih") ||
    s.includes("tasbīh") ||
    s.includes("dhikr count")
  )
    return "Join the global livestream and log your Yaa Lateef count in real-time at /live.";
  if (s.includes("salam") || s.includes("hello") || s.includes("hi"))
    return "Wa alaykum as-salam. Welcome! Ask me anything about event dates, venue location, dress code, registration, or giving.";
  return "Lateeful-Ul-Akbar Li-A’azam is Nadwat's grand assembly on Sunday, January 24, 2027 at TBS Lagos. You can ask me about registration (/register), venue details (/venue), or giving (/sadaqah).";
}

function parseTextWithLinks(text: string) {
  const routeRegex =
    /(\/(?:venue|register|vendors|media-accreditation|donate|sadaqah|live|founder|about|gathering|prayer-book))/g;
  const parts = text.split(routeRegex);
  return parts.map((part, i) => {
    if (
      part.startsWith("/") &&
      [
        "/venue",
        "/register",
        "/vendors",
        "/media-accreditation",
        "/donate",
        "/sadaqah",
        "/live",
        "/founder",
        "/about",
        "/gathering",
        "/prayer-book",
      ].includes(part)
    ) {
      return (
        <Link
          key={i}
          href={part}
          className="inline-flex items-center gap-1 font-semibold text-vivid hover:text-vivid-deep dark:text-emerald-400 dark:hover:text-emerald-300 underline underline-offset-2 transition-colors mx-0.5"
        >
          {part} <ArrowUpRight className="h-3 w-3" />
        </Link>
      );
    }
    return part;
  });
}

function getTimeStr() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: "welcome",
      from: "bot",
      text: "As-salamu alaykum! I am the Nadwat Guide. How can I assist you with Lateeful-Ul-Akbar 2027 today?",
      time: getTimeStr(),
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgs, typing, open]);

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;

    const time = getTimeStr();
    setMsgs((m) => [...m, { id: String(Date.now()), from: "user", text, time }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { id: String(Date.now() + 1), from: "bot", text: answer(text), time: getTimeStr() },
      ]);
      setTyping(false);
    }, 550);
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div className="fixed right-5 bottom-5 z-[60] sm:right-6 sm:bottom-6">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close Nadwat Guide chat" : "Open Nadwat Guide chat"}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-vivid text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-vivid-deep focus:outline-none focus:ring-4 focus:ring-vivid/30 active:scale-95"
        >
          {!open && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
            </span>
          )}

          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <MessageSquare className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed right-4 bottom-22 z-[60] flex h-[580px] w-[calc(100%-2rem)] max-w-sm sm:max-w-md flex-col overflow-hidden rounded-2xl border border-ink/15 dark:border-white/15 bg-white dark:bg-pine shadow-[0_25px_60px_-15px_rgba(10,46,35,0.35)] sm:right-6"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-pine via-pine to-fern px-5 py-4 text-white">
              <div className="pattern-lattice-light absolute inset-0 opacity-20" aria-hidden />
              <div className="relative flex items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 p-1.5 backdrop-blur-md border border-white/20">
                  <Image
                    src="/assets/nadwa-logo.png"
                    alt="Nadwat Logo"
                    width={36}
                    height={36}
                    className="h-full w-auto object-contain brightness-0 invert"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-semibold tracking-wide">
                      Nadwat Guide
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300 border border-emerald-400/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live AI
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70">
                    Official assembly assistant & handbook
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="relative rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-cream/70 dark:bg-cream/5 px-4 py-5 scrollbar-thin">
              {msgs.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-2 ${
                    m.from === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
                      m.from === "user"
                        ? "bg-vivid text-white"
                        : "bg-pine text-sage dark:bg-white/10 dark:text-emerald-300"
                    }`}
                  >
                    {m.from === "user" ? (
                      <User className="h-3.5 w-3.5" />
                    ) : (
                      <Bot className="h-3.5 w-3.5" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`group relative max-w-[82%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
                      m.from === "user"
                        ? "rounded-br-xs bg-vivid text-white"
                        : "rounded-bl-xs border border-ink/10 dark:border-white/10 bg-white dark:bg-pine text-ink dark:text-sage"
                    }`}
                  >
                    <div>{parseTextWithLinks(m.text)}</div>
                    <span
                      className={`mt-1 block text-[10px] ${
                        m.from === "user" ? "text-white/70 text-right" : "text-faded dark:text-white/40"
                      }`}
                    >
                      {m.time}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Typing animation */}
              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pine text-sage">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="rounded-2xl rounded-bl-xs border border-ink/10 dark:border-white/10 bg-white dark:bg-pine px-4 py-3 text-xs text-faded dark:text-sage shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium">Checking handbook</span>
                      <span className="flex gap-1">
                        {[0, 1, 2].map((d) => (
                          <span
                            key={d}
                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-vivid"
                            style={{ animationDelay: `${d * 0.15}s` }}
                          />
                        ))}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="border-t border-ink/10 dark:border-white/10 bg-white dark:bg-pine/90 px-3 py-2.5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-faded dark:text-white/50 px-1">
                Suggested topics
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {CHIPS.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.label}
                      onClick={() => send(c.query)}
                      className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink/15 dark:border-white/15 bg-paper dark:bg-pine/60 px-3 py-1.5 text-[11px] font-medium text-ink dark:text-sage transition-all hover:border-vivid hover:bg-vivid/10 hover:text-vivid dark:hover:text-emerald-400"
                    >
                      <Icon className="h-3 w-3 text-fern dark:text-emerald-400 group-hover:text-vivid" />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 border-t border-ink/10 dark:border-white/10 bg-paper dark:bg-pine p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about dates, dress code, pass..."
                aria-label="Ask about the event"
                className="min-w-0 flex-1 rounded-xl border border-ink/20 dark:border-white/20 bg-white dark:bg-pine/80 px-4 py-2.5 text-xs text-ink dark:text-white placeholder:text-faded dark:placeholder:text-white/40 focus:border-vivid focus:outline-none focus:ring-2 focus:ring-vivid/20"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-vivid text-white transition-all hover:bg-vivid-deep disabled:opacity-40 disabled:hover:bg-vivid shadow-sm"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
