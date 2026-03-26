"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import DashboardShell from "@/components/layout/DashboardShell";
import { getConversations, getMessages, type Conversation, type Message } from "@/lib/api/messages";

type DisplayConv = {
  id: string;
  name: string;
  property: string;
  lastMessage: string;
  time: string;
  unread: number;
  initials: string;
};

type DisplayMessage = {
  id: string;
  from: "host" | "guest";
  text: string;
  time: string;
};

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function toDisplayConv(c: Conversation): DisplayConv {
  return {
    id: c.id,
    name: c.guestName,
    property: c.propertyName,
    lastMessage: c.lastMessage,
    time: formatTime(c.lastMessageAt),
    unread: c.unreadHost,
    initials: c.guestInitials,
  };
}

function toDisplayMessage(m: Message): DisplayMessage {
  return {
    id: m.id,
    from: m.fromRole,
    text: m.text,
    time: formatTime(m.createdAt),
  };
}

export default function HostMessagesPage() {
  const t = useTranslations("dashboard.host.messages");
  const [conversations, setConversations] = useState<DisplayConv[]>([]);
  const [activeConv, setActiveConv] = useState<DisplayConv | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getConversations("usr-host-001")
      .then((data) => {
        const mapped = data.map(toDisplayConv);
        setConversations(mapped);
        if (mapped.length > 0) {
          setActiveConv(mapped[0]);
        }
      })
      .catch((err) => console.error("Failed to load conversations", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    getMessages(activeConv.id)
      .then((data) => setMessages(data.map(toDisplayMessage)))
      .catch((err) => console.error("Failed to load messages", err));
  }, [activeConv]);

  const filteredConvs = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.property.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: String(prev.length + 1), from: "host", text: newMessage.trim(), time: "Now" },
    ]);
    setNewMessage("");
  };

  return (
    <DashboardShell role="host" activeItem="messages">
      <main className="flex-1 flex flex-col overflow-hidden h-screen">
        <div className="flex flex-1 overflow-hidden">
          {/* Conversation List */}
          <aside className="w-80 bg-surface-container-low flex flex-col border-r border-surface-container-high flex-shrink-0">
            {/* Header */}
            <div className="p-6 flex-shrink-0">
              <h1 className="text-xl font-headline text-on-surface mb-1">{t("title")}</h1>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest font-label">
                {t("subtitle")}
              </p>
            </div>

            {/* Search */}
            <div className="px-4 pb-4 flex-shrink-0">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-base">
                  search
                </span>
                <input
                  className="w-full bg-surface-container-high border-none rounded-lg pl-10 pr-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none"
                  placeholder={t("searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {isLoading && (
                <p className="text-xs text-on-surface-variant px-4 py-6 text-center">Loading...</p>
              )}
              {filteredConvs.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConv(conv)}
                  className={`w-full text-left px-4 py-4 transition-all hover:bg-surface-container ${
                    activeConv?.id === conv.id ? "bg-surface-container border-r-2 border-primary" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                      {conv.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="text-sm font-bold text-on-surface truncate">{conv.name}</span>
                        <span className="text-[10px] text-on-surface-variant/60 flex-shrink-0 ml-2">{conv.time}</span>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">
                        {conv.property}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-on-surface-variant truncate">{conv.lastMessage}</p>
                        {conv.unread > 0 && (
                          <span className="w-4 h-4 rounded-full bg-primary text-on-primary text-[9px] font-bold flex items-center justify-center flex-shrink-0 ml-2">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="bg-surface-container-low px-6 py-4 flex items-center gap-4 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                {activeConv?.initials}
              </div>
              <div>
                <p className="font-bold text-on-surface">{activeConv?.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-primary font-bold">
                  {activeConv?.property}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-base">info</span>
                </button>
                <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-base">more_vert</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === "host" ? "justify-end" : "justify-start"}`}
                >
                  {msg.from === "guest" && (
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-on-surface flex-shrink-0 mr-3 mt-auto">
                      {activeConv?.initials}
                    </div>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md ${
                      msg.from === "host"
                        ? "bg-primary/10 border-r-2 border-primary rounded-2xl rounded-tr-sm"
                        : "bg-surface-container-high rounded-2xl rounded-tl-sm"
                    } px-4 py-3`}
                  >
                    <p className="text-sm text-on-surface leading-relaxed">{msg.text}</p>
                    <p className="text-[10px] text-on-surface-variant/50 mt-1 text-right">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="bg-surface-container-low px-6 py-4 flex-shrink-0">
              <div className="flex items-center gap-3 bg-surface-container-high rounded-xl px-4 py-2">
                <input
                  className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-on-surface-variant/40"
                  placeholder={t("typeMessage")}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center flex-shrink-0 transition-opacity disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-on-primary text-base">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}
