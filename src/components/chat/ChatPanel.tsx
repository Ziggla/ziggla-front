"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getConversation,
  listConversations,
  markRead,
  sendMessage,
  type ConversationDetail,
  type ConversationSummary,
} from "@/lib/api/conversations";
import { useAuth } from "@/lib/auth/AuthContext";

const POLL_INTERVAL_MS = 5000;

interface Props {
  role: "user" | "host";
}

export default function ChatPanel({ role }: Props) {
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [active, setActive] = useState<ConversationDetail | null>(null);
  const [draft, setDraft] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial list + polling
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function tick() {
      try {
        const list = await listConversations();
        if (cancelled) return;
        setConversations(list);
        if (!activeId && list.length > 0) setActiveId(list[0].id);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) {
          setLoadingList(false);
          timer = setTimeout(tick, POLL_INTERVAL_MS);
        }
      }
    }
    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [activeId]);

  // Poll active conversation messages
  useEffect(() => {
    if (!activeId) {
      setActive(null);
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function tick() {
      try {
        const detail = await getConversation(activeId!);
        if (cancelled) return;
        setActive(detail);
        markRead(activeId!).catch(() => {});
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) timer = setTimeout(tick, POLL_INTERVAL_MS);
      }
    }
    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [activeId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [active?.messages.length]);

  async function handleSend() {
    if (!activeId || !draft.trim() || sending) return;
    const text = draft.trim();
    setSending(true);
    setError(null);
    try {
      await sendMessage(activeId, text);
      setDraft("");
      const detail = await getConversation(activeId);
      setActive(detail);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  const counterpartName = useMemo(() => {
    if (!active) return "";
    const p = role === "host" ? active.guest : active.host;
    return `${p.first_name} ${p.last_name}`.trim() || p.first_name;
  }, [active, role]);

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
      {/* Conversation list */}
      <aside className="col-span-12 md:col-span-4 bg-surface-container-low rounded-xl overflow-hidden flex flex-col">
        <header className="px-4 py-3 border-b border-outline-variant/20">
          <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
            Conversations
          </h2>
        </header>
        <div className="flex-1 overflow-y-auto">
          {loadingList && (
            <p className="p-4 text-on-surface-variant text-sm">Loading…</p>
          )}
          {!loadingList && conversations.length === 0 && (
            <p className="p-4 text-on-surface-variant text-sm">
              No conversations yet.
            </p>
          )}
          {conversations.map((c) => {
            const counterpart = role === "host" ? c.guest : c.host;
            const unread = role === "host" ? c.unread_host : c.unread_guest;
            const isActive = c.id === activeId;
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full text-left px-4 py-3 border-b border-outline-variant/10 transition-colors ${
                  isActive
                    ? "bg-surface-container-high"
                    : "hover:bg-surface-container"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-on-surface text-sm truncate">
                    {counterpart.first_name} {counterpart.last_name}
                  </span>
                  {unread > 0 && (
                    <span className="bg-primary text-on-primary text-[10px] font-bold rounded-full px-2 py-0.5">
                      {unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-on-surface-variant truncate italic">
                  {c.property.name}
                </p>
                {c.last_message && (
                  <p className="text-xs text-on-surface-variant truncate mt-1">
                    {c.last_message}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Active conversation */}
      <section className="col-span-12 md:col-span-8 bg-surface-container-low rounded-xl flex flex-col overflow-hidden">
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant text-sm">
            Select a conversation to start chatting.
          </div>
        ) : (
          <>
            <header className="px-6 py-4 border-b border-outline-variant/20">
              <p className="text-xs uppercase tracking-widest text-primary">
                {active.property.name}
              </p>
              <h3 className="font-headline text-lg text-on-surface">
                {counterpartName}
              </h3>
            </header>
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-3 bg-surface-container-lowest/30"
            >
              {active.messages.map((m) => {
                const mine = m.from_user_id === userId;
                return (
                  <div
                    key={m.id}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                        mine
                          ? "bg-primary text-on-primary rounded-br-sm"
                          : "bg-surface-container-high text-on-surface rounded-bl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>
                      <p
                        className={`text-[10px] mt-1 opacity-70 ${
                          mine ? "text-on-primary" : "text-on-surface-variant"
                        }`}
                      >
                        {new Date(m.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <footer className="border-t border-outline-variant/20 p-4 flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message…"
                className="flex-1 bg-surface-container-high rounded-lg px-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/40 outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!draft.trim() || sending}
                className="gold-gradient text-on-primary px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {sending ? "…" : "Send"}
              </button>
            </footer>
          </>
        )}
        {error && (
          <p className="text-error text-xs px-6 py-2 bg-error/5">{error}</p>
        )}
      </section>
    </div>
  );
}
