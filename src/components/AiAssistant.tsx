"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";

type Msg = { id: string; from: "bot" | "user"; text: string };

const CHIPS = [
  "When and where is it?",
  "What should I wear?",
  "Where do I park?",
  "How do I register?",
  "How do I give sadaqah?",
];

function answer(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("when") || s.includes("where") || s.includes("date") || s.includes("venue") || s.includes("time"))
    return "Sunday, January 24, 2027 at Tafawa Balewa Square, Main Bowl, Lagos Island. Gates open early morning; the grand du'a peaks in the afternoon.";
  if (s.includes("wear") || s.includes("dress") || s.includes("white"))
    return "Strictly all white: clean, modest white attire for every attendee, brothers and sisters alike.";
  if (s.includes("park") || s.includes("car") || s.includes("bus") || s.includes("drive") || s.includes("venue") || s.includes("direction") || s.includes("location"))
    return "No vehicles inside the Main Bowl — perimeter lots only. See the Venue page (/venue) for the map, gates, parking and a Google Maps route from your location.";
  if (s.includes("register") || s.includes("pass") || s.includes("accredit") || s.includes("ticket"))
    return "Registration is free on the Register page (/register). Three short steps and your printable pass artwork is generated with a referral code.";
  if (s.includes("sadaqah") || s.includes("tithe"))
    return "Sadaqah is open, tithe-style giving of any amount on the Sadaqah page (/sadaqah).";
  if (s.includes("donate") || s.includes("give") || s.includes("pay") || s.includes("support") || s.includes("fund"))
    return "Support funds a specific campaign — water, mats, fans, tents — on the Support page (/donate) with live targets. For open giving of any amount, see Sadaqah (/sadaqah).";
  if (s.includes("founder") || s.includes("convener") || s.includes("missioner") || s.includes("lawal") || s.includes("sheikh") || s.includes("shaikh"))
    return "The Convener & Chief Missioner is Shaikh Dr. Abdur Rahman Ade Lawal: Al-Azhar trained, PhD in Mass Communication, IVLP alumnus, author and counsellor.";
  if (s.includes("stream") || s.includes("live") || s.includes("watch") || s.includes("online") || s.includes("count") || s.includes("tasbih") || s.includes("tasbīh") || s.includes("dhikr count"))
    return "The live broadcast and worldwide Yaa Lateef tasbīh live on the Live page (/live). Venue and route help is on /venue.";
  if (s.includes("salam") || s.includes("hello") || s.includes("hi"))
    return "Wa alaykum as-salam. Ask me about the date, venue, dress code, parking, registration or sadaqah.";
  return "Lateef ul-il-Akbar-Il-A’azam is Nadwat's grand dhikr gathering on Sunday, January 24, 2027 at TBS Lagos. Ask me about the date, dress code, parking, registration or giving.";
}

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "w", from: "bot", text: "As-salamu alaykum. I guide guests of Lateeful Akbar: dates, venue, dress, parking, passes and giving. What do you need?" },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing, open]);

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setMsgs((m) => [...m, { id: String(Date.now()), from: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { id: String(Date.now() + 1), from: "bot", text: answer(text) }]);
      setTyping(false);
    }, 650);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="fixed right-5 bottom-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-vivid text-white shadow-xl transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="fixed right-4 bottom-22 z-[60] flex h-[540px] w-[calc(100%-2rem)] max-w-md flex-col overflow-hidden border border-ink/15 bg-white shadow-2xl sm:right-6"
          >
            <div className="flex items-center gap-3 border-b border-ink/10 bg-vivid px-5 py-4 text-white">
              <span className="relative block h-9 w-auto">
                <Image src="/assets/nadwa-logo.png" alt="" width={90} height={30} className="h-9 w-auto bg-white object-contain px-1" />
              </span>
              <div>
                <p className="text-sm font-semibold">Nadwat Guide</p>
                <p className="text-[11px] text-white/70">Answers from the event handbook</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-cream px-4 py-4">
              {msgs.map((m) => (
                <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <p
                    className={`max-w-[82%] px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      m.from === "user" ? "bg-vivid text-white" : "border border-ink/10 bg-white text-ink"
                    }`}
                  >
                    {m.text}
                  </p>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <p className="flex gap-1 border border-ink/10 bg-white px-4 py-3" aria-label="Typing">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-vivid" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </p>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="flex gap-1.5 overflow-x-auto border-t border-ink/10 bg-white px-3 pt-2.5">
              {CHIPS.map((c) => (
                <button key={c} onClick={() => send(c)} className="shrink-0 border border-ink/15 px-3 py-1.5 text-[11px] font-medium text-fern hover:border-pine">
                  {c}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex gap-2 border-t border-ink/10 bg-white p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the event..."
                aria-label="Ask about the event"
                className="min-w-0 flex-1 border border-ink/20 px-3.5 py-2.5 text-sm text-ink focus:border-pine focus:outline-none"
              />
              <button type="submit" aria-label="Send" className="bg-vivid px-4 text-white hover:bg-vivid-deep">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
