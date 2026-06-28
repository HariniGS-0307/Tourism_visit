"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ── Inline SVG icons — no Lucide import, eliminates all hydration mismatches ──
function IconX({ className = "w-5 h-5" }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
}
function IconSend({ className = "w-4 h-4" }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
}
function IconBot({ className = "w-4 h-4" }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>;
}
function IconSparkles({ className = "w-6 h-6" }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
}
function IconMountain({ className = "w-7 h-7" }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>;
}
function IconRefresh({ className = "w-4 h-4" }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>;
}
function IconChevronDown({ className = "w-7 h-7" }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>;
}

interface Message {
  role: "USER" | "ASSISTANT";
  content: string;
  isError?: boolean;
}

const QUICK_REPLIES = [
  { emoji: "🏕️", label: "Camping in Bhandardara" },
  { emoji: "🐯", label: "Wildlife safaris in Pench" },
  { emoji: "🥾", label: "Trekking in Harishchandragad" },
  { emoji: "🌊", label: "Water sports on Konkan coast" },
];

// Render markdown-ish content: **bold**, /listings/id links, [text](url) links
function renderContent(text: string) {
  // Split on /listings/ID patterns first
  const parts = text.split(/(\/listings\/[a-z0-9]+)/gi);

  return (
    <span className="whitespace-pre-wrap leading-relaxed">
      {parts.map((part, i) => {
        if (/^\/listings\/[a-z0-9]+$/i.test(part)) {
          const id = part.split("/").pop();
          return (
            <Link
              key={i}
              href={part}
              className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full hover:bg-emerald-500/30 transition-colors mx-0.5 border border-emerald-300"
              target="_blank"
            >
              View listing ↗
            </Link>
          );
        }

        // Render [text](url) markdown links
        const mdLink = part.split(/(\[[^\]]+\]\([^)]+\))/g);
        return mdLink.map((seg, j) => {
          const mdMatch = seg.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (mdMatch) {
            return (
              <Link
                key={`${i}-${j}`}
                href={mdMatch[2]}
                className="text-emerald-600 underline hover:text-emerald-800 font-medium"
              >
                {mdMatch[1]}
              </Link>
            );
          }
          // Render **bold**
          const boldParts = seg.split(/\*\*(.+?)\*\*/g);
          return boldParts.map((bp, k) =>
            k % 2 === 1 ? (
              <strong key={`${i}-${j}-${k}`} className="font-semibold">
                {bp}
              </strong>
            ) : (
              <span key={`${i}-${j}-${k}`}>{bp}</span>
            )
          );
        });
      })}
    </span>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ASSISTANT",
      content:
        "Namaste! 🙏 I'm your Maharashtra Adventures AI concierge. Ask me about treks, camping, wildlife safaris, pricing, or availability — I'll find the best options for you!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(
    () => `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setHasOpenedOnce(true);
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Nudge user after 8 seconds if they haven't opened the chat
  useEffect(() => {
    if (hasOpenedOnce) return;
    const timer = setTimeout(() => {
      if (!isOpen) setUnreadCount(1);
    }, 8000);
    return () => clearTimeout(timer);
  }, [hasOpenedOnce, isOpen]);

  const handleSend = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: Message = { role: "USER", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      // Retry up to 2 times on network/server errors
      let attempts = 0;
      const maxAttempts = 2;

      while (attempts < maxAttempts) {
        attempts++;
        try {
          const res = await fetch("/api/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, message: trimmed, history: messages }),
          });

          const data = (await res.json()) as {
            response?: string;
            error?: string;
            quotaExhausted?: boolean;
          };

          if (res.status === 429) {
            setMessages((prev) => [
              ...prev,
              {
                role: "ASSISTANT",
                content: "⏳ You're sending messages really fast! Wait a moment and try again.",
                isError: true,
              },
            ]);
          } else if (!res.ok) {
            // On server error, use the friendly fallback if available
            const reply = data.response ?? data.error ?? "I hit a small snag — try again in a moment! You can also browse [/explore](/explore) 🏔️";
            setMessages((prev) => [
              ...prev,
              { role: "ASSISTANT", content: reply, isError: !data.response },
            ]);
          } else {
            const reply =
              data.response ??
              "I'm not sure about that. Try browsing [/explore](/explore)!";
            setMessages((prev) => [
              ...prev,
              { role: "ASSISTANT", content: reply, isError: data.quotaExhausted },
            ]);
            if (!isOpen) setUnreadCount((n) => n + 1);
          }
          break; // success — stop retrying
        } catch {
          if (attempts < maxAttempts) {
            // Brief pause before retry
            await new Promise((r) => setTimeout(r, 800));
            continue;
          }
          setMessages((prev) => [
            ...prev,
            {
              role: "ASSISTANT",
              content:
                "Connection issue 📡 Check your internet and try again, or browse [/explore](/explore) for adventures!",
              isError: true,
            },
          ]);
        }
      }

      setIsLoading(false);
    },
    [isLoading, isOpen, messages, sessionId]
  );

  const handleReset = () => {
    setMessages([
      {
        role: "ASSISTANT",
        content:
          "Namaste! 🙏 I'm your Maharashtra Adventures AI concierge. Ask me about treks, camping, wildlife safaris, pricing, or availability — I'll find the best options for you!",
      },
    ]);
    setInput("");
  };

  if (!mounted) {
    // Render the launch button immediately — it has no hydration-sensitive content.
    // Only skip the full chat panel until client is ready.
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI concierge"
          className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 focus:ring-offset-2"
        >
          <IconMountain className="w-7 h-7 text-white" />
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20" />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ── Floating Launch Button ─────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Tooltip nudge */}
        {!isOpen && unreadCount > 0 && (
          <div className="bg-white border border-emerald-200 text-gray-800 text-sm font-medium px-4 py-2.5 rounded-2xl shadow-xl max-w-[200px] text-center animate-fade-in-up">
            <span className="text-base">🏔️</span>
            <br />
            <span className="text-xs text-gray-600">Ask me about adventures!</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close AI concierge" : "Open AI concierge"}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 focus:ring-offset-2
            ${isOpen
              ? "bg-gray-700 hover:bg-gray-800 rotate-0"
              : "bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 hover:scale-110 hover:shadow-emerald-500/40"
            }`}
        >
          {isOpen ? (
            <IconChevronDown className="w-7 h-7 text-white" />
          ) : (
            <>
              <IconMountain className="w-7 h-7 text-white" />
              {/* Ping ring */}
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20" />
            </>
          )}

          {/* Unread badge */}
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Chat Panel ────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed bottom-28 right-4 sm:right-6 z-50 flex flex-col
            w-[calc(100vw-2rem)] sm:w-[420px]
            h-[580px] max-h-[85vh]
            bg-white rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.18)] border border-gray-100
            overflow-hidden animate-in slide-in-from-bottom-5"
        >
          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-600 px-5 py-4 shrink-0 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute top-2 right-10 w-10 h-10 bg-white/10 rounded-full" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                  <IconSparkles className="w-6 h-6 text-white" />
                  {/* Online dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-white text-base leading-tight">
                      Maha AI Concierge
                    </h3>
                    <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      Beta
                    </span>
                  </div>
                  <p className="text-emerald-100 text-xs font-medium mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                    Gemini AI · Adventure Expert
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  title="Start new chat"
                  className="w-8 h-8 text-emerald-100 hover:text-white hover:bg-white/15 rounded-xl transition-colors flex items-center justify-center"
                >
                  <IconRefresh className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 text-emerald-100 hover:text-white hover:bg-white/15 rounded-xl transition-colors flex items-center justify-center"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Capabilities strip */}
            <div className="relative flex gap-2 mt-3 overflow-x-auto no-scrollbar">
              {["🥾 Treks", "🏕️ Camping", "🐯 Safaris", "🌊 Water Sports", "💰 Pricing"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="shrink-0 bg-white/15 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap border border-white/20"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>

          {/* ── Messages ───────────────────────────────────────────── */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-slate-50/80 to-white"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "ASSISTANT" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <IconBot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed
                    ${msg.role === "USER"
                      ? "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-tr-sm"
                      : msg.isError
                      ? "bg-amber-50 border border-amber-200 text-amber-900 rounded-tl-sm"
                      : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm"
                    }`}
                >
                  {msg.role === "ASSISTANT" ? renderContent(msg.content) : msg.content}
                </div>

                {msg.role === "USER" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <span className="text-white text-xs font-bold">You</span>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <IconBot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-sm flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "160ms" }} />
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "320ms" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Quick Reply chips (first message only) ─────────────── */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 pb-2 pt-1 shrink-0 bg-white border-t border-gray-50">
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
                Popular questions
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {QUICK_REPLIES.map(({ emoji, label }) => (
                  <button
                    key={label}
                    onClick={() => handleSend(label)}
                    className="flex items-center gap-1.5 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-gray-700 hover:text-emerald-700 text-xs font-medium px-3 py-2 rounded-xl transition-all text-left"
                  >
                    <span className="text-base leading-none">{emoji}</span>
                    <span className="line-clamp-1">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Input ──────────────────────────────────────────────── */}
          <div className="px-4 pb-4 pt-2 bg-white shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-2 focus-within:border-emerald-400 focus-within:bg-white transition-all shadow-sm"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about treks, prices, availability..."
                disabled={isLoading}
                maxLength={500}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1 text-gray-900 placeholder:text-gray-400 outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl flex items-center justify-center shrink-0 hover:from-emerald-400 hover:to-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md hover:scale-105"
              >
                <IconSend className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-gray-400 text-center mt-1.5 font-medium">
              Powered by Google Gemini · Adventure data is live
            </p>
          </div>
        </div>
      )}
    </>
  );
}
