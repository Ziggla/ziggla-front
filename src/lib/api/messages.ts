import rawData from "@/data/mock/conversations.json";
import { mockFetch } from "./client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Conversation {
  id: string;
  bookingId: string;
  propertyId: string;
  propertyName: string;
  hostId: string;
  guestId: string;
  guestName: string;
  guestInitials: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadHost: number;
}

export interface Message {
  id: string;
  conversationId: string;
  fromUserId: string;
  fromRole: "guest" | "host";
  text: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Internal shape of the JSON
// ---------------------------------------------------------------------------

interface ConversationsData {
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;
}

const data = rawData as ConversationsData;

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/** Returns all conversations for a given host. */
export async function getConversations(
  hostId: string
): Promise<Conversation[]> {
  const filtered = data.conversations.filter((c) => c.hostId === hostId);
  return mockFetch(filtered, `/conversations?hostId=${hostId}`);
}

/** Returns all messages for a given conversation. */
export async function getMessages(
  conversationId: string
): Promise<Message[]> {
  const messages = data.messagesByConversation[conversationId] ?? [];
  return mockFetch(messages, `/conversations/${conversationId}/messages`);
}
