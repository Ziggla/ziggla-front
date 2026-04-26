"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import ChatPanel from "@/components/chat/ChatPanel";
import { getBookings, type Booking } from "@/lib/api/bookings";
import { createConversation } from "@/lib/api/conversations";

export default function UserMessagesPage() {
  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [propertyId, setPropertyId] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (open) {
      getBookings()
        .then(setBookings)
        .catch(() => {});
    }
  }, [open]);

  async function handleStart() {
    if (!propertyId || !text.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      await createConversation({
        property_id: propertyId,
        text: text.trim(),
      });
      setOpen(false);
      setText("");
      setPropertyId("");
      setRefreshKey((k) => k + 1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <DashboardShell role="user" activeItem="messages">
      <main className="flex-1 bg-background px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-headline text-3xl text-on-surface">Messages</h1>
          <button
            onClick={() => setOpen(true)}
            className="gold-gradient text-on-primary px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">add</span>
            New conversation
          </button>
        </div>

        <ChatPanel key={refreshKey} role="user" />

        {open && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-surface-container-low rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <h2 className="font-headline text-xl text-on-surface">
                Message a host
              </h2>
              <p className="text-on-surface-variant text-sm">
                Pick one of your stays to start a conversation with the host.
              </p>
              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="w-full bg-surface-container-high rounded-lg p-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">— Select a property —</option>
                {Array.from(
                  new Map(bookings.map((b) => [b.property.id, b])).values(),
                ).map((b) => (
                  <option key={b.id} value={b.property.id}>
                    {b.property.name}
                  </option>
                ))}
              </select>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message…"
                rows={4}
                className="w-full bg-surface-container-high rounded-lg p-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              {error && <p className="text-error text-xs">{error}</p>}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="px-5 py-2 text-on-surface-variant text-xs font-bold uppercase tracking-widest hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStart}
                  disabled={!propertyId || !text.trim() || sending}
                  className="gold-gradient text-on-primary px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest disabled:opacity-40"
                >
                  {sending ? "Sending…" : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </DashboardShell>
  );
}
