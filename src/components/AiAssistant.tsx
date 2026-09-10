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
  Ticket,
  User,
  X,
  Headphones,
  RotateCcw,
} from "lucide-react";

type QuickButton = {
  label: string;
  action: 'link' | 'support' | 'query';
  target: string;
};

type Msg = {
  id: string;
  from: "bot" | "user";
  text: string;
  time: string;
  buttons?: QuickButton[];
  isSupportHandoff?: boolean;
};

const CHIPS = [
  { label: "When & Where?", icon: MapPin, query: "When and where is the event held?" },
  { label: "Free Registration", icon: Ticket, query: "How do I register for an event pass?" },
  { label: "Sadaqah Giving", icon: Heart, query: "How can I give Sadaqah and donate?" },
  { label: "Digital Tasbīh", icon: Radio, query: "Tell me about the Digital Tasbīh counter" },
  { label: "Customer Support", icon: Headphones, query: "I want to talk to human support agent" },
];

function getTimeStr() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const DEFAULT_WELCOME: Msg = {
  id: "welcome",
  from: "bot",
  text: "Assalamu Alaikum! I am Noor AI, your guide for Lateeful Akbar 2027. How can I assist you today with registration, schedule, donations, or support?",
  time: getTimeStr(),
  buttons: [
    { label: "🎟️ Register Pass", action: "link", target: "/register" },
    { label: "💚 Donate / Sadaqah", action: "link", target: "/donate" },
    { label: "📿 Digital Tasbīh", action: "link", target: "/tasbih" },
    { label: "💬 Talk to Support Agent", action: "support", target: "support_handoff" },
  ],
};

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sessionId] = useState(() => `session_${Math.random().toString(36).substring(2, 9)}`);
  const [msgs, setMsgs] = useState<Msg[]>([DEFAULT_WELCOME]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on initial client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("noor_chat_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMsgs(parsed);
        }
      }
    } catch (err) {
      console.error("Error loading chat history from localStorage:", err);
    }
  }, []);

  // Persist chat history to localStorage whenever messages update
  useEffect(() => {
    try {
      if (msgs.length > 0) {
        localStorage.setItem("noor_chat_history", JSON.stringify(msgs));
      }
    } catch (err) {
      console.error("Error saving chat history to localStorage:", err);
    }
  }, [msgs]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgs, typing, open]);

  const clearChat = () => {
    setMsgs([DEFAULT_WELCOME]);
    try {
      localStorage.removeItem("noor_chat_history");
    } catch (err) {
      console.error("Error clearing localStorage:", err);
    }
  };

  const send = async (raw?: string, isSupportOverride?: boolean) => {
    const text = (raw ?? input).trim();
    if (!text && !isSupportOverride) return;
    if (typing) return;

    const time = getTimeStr();
    const userMsgText = isSupportOverride ? "Requesting human customer support agent..." : text;

    setMsgs((m) => [...m, { id: String(Date.now()), from: "user", text: userMsgText, time }]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsgText,
          sessionId,
          isSupportRequest: isSupportOverride,
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setMsgs((m) => [
          ...m,
          {
            id: String(Date.now() + 1),
            from: "bot",
            text: data.reply,
            time: getTimeStr(),
            buttons: data.buttons,
            isSupportHandoff: data.isSupportHandoff,
          },
        ]);
      } else {
        throw new Error("No reply");
      }
    } catch {
      setMsgs((m) => [
        ...m,
        {
          id: String(Date.now() + 1),
          from: "bot",
          text: "Assalamu Alaikum! For complete event registration, schedule, and donations, please use the links below or contact customer support.",
          time: getTimeStr(),
          buttons: [
            { label: "🎟️ Register Pass", action: "link", target: "/register" },
            { label: "💚 Donate & Sadaqah", action: "link", target: "/donate" },
            { label: "📿 Tasbīh Counter", action: "link", target: "/tasbih" },
          ],
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div className="fixed right-5 bottom-5 z-[60] sm:right-6 sm:bottom-6">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close AI Guide chat" : "Open AI Guide chat"}
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
            className="fixed right-4 bottom-22 z-[60] flex h-[580px] w-[calc(100%-2rem)] max-w-sm sm:max-w-md flex-col overflow-hidden rounded-2xl border border-ink/15 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl sm:right-6"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-white/10 bg-pine px-5 py-4 text-white">
              <div className="relative flex items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md border border-white/20">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base tracking-wide text-white">
                      Noor AI Assistant
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-medium text-emerald-200 border border-emerald-300/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-white/80">
                    Lateeful Akbar 2027 Knowledge Assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  title="Clear chat history"
                  className="relative rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Clear chat"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="relative rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-cream dark:bg-slate-950 px-4 py-5 scrollbar-thin">
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
                        : "bg-pine text-sage dark:bg-slate-800 dark:text-emerald-300"
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
                    className={`group relative max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
                      m.from === "user"
                        ? "rounded-br-xs bg-vivid text-white"
                        : "rounded-bl-xs border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 text-ink dark:text-slate-100"
                    }`}
                  >
                    <div>{m.text}</div>

                    {/* Interactive Navigation Quick Action Buttons */}
                    {m.buttons && m.buttons.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-ink/10 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                        {m.buttons.map((btn, idx) => (
                          btn.action === 'support' ? (
                            <button
                              key={idx}
                              onClick={() => send("Switch to customer support", true)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-all"
                            >
                              {btn.label}
                            </button>
                          ) : (
                            <Link
                              key={idx}
                              href={btn.target}
                              onClick={() => setOpen(false)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-mist dark:bg-slate-800 text-pine dark:text-emerald-300 hover:bg-sage dark:hover:bg-slate-700 border border-ink/15 dark:border-slate-700 transition-all"
                            >
                              {btn.label} <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          )
                        ))}
                      </div>
                    )}

                    <span
                      className={`mt-1 block text-[10px] ${
                        m.from === "user" ? "text-white/70 text-right" : "text-faded dark:text-slate-500"
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
                  <div className="rounded-2xl rounded-bl-xs border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs text-faded dark:text-slate-400 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium">Noor AI is thinking</span>
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
            <div className="border-t border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-faded dark:text-slate-500 px-1">
                Suggested Quick Topics
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {CHIPS.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.label}
                      onClick={() => send(c.query, c.label === "Customer Support")}
                      className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink/15 dark:border-slate-800 bg-cream dark:bg-slate-800/60 px-3 py-1.5 text-[11px] font-medium text-ink dark:text-slate-200 transition-all hover:border-vivid hover:bg-vivid/10 hover:text-vivid dark:hover:text-emerald-300"
                    >
                      <Icon className="h-3 w-3 text-vivid dark:text-emerald-400 group-hover:text-vivid-deep" />
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
              className="flex items-center gap-2 border-t border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Noor AI about passes, venue, schedule..."
                aria-label="Ask about the event"
                className="min-w-0 flex-1 rounded-xl border border-ink/20 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 py-2.5 text-xs text-ink dark:text-white placeholder:text-faded dark:placeholder:text-slate-500 focus:border-vivid focus:outline-none focus:ring-2 focus:ring-vivid/20"
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
