"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import ChatPanel from "@/components/chat/ChatPanel";

export default function HostMessagesPage() {
  return (
    <DashboardShell role="host" activeItem="messages">
      <main className="flex-1 bg-background px-8 py-10">
        <h1 className="font-headline text-3xl text-on-surface mb-6">Messages</h1>
        <ChatPanel role="host" />
      </main>
    </DashboardShell>
  );
}
