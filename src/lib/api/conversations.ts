import { apiFetch } from "./client";

export interface MessageParticipant {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
}

export interface ConversationProperty {
  id: string;
  name: string;
  slug: string;
}

export interface ConversationSummary {
  id: string;
  property: ConversationProperty;
  host: MessageParticipant;
  guest: MessageParticipant;
  last_message: string | null;
  last_message_at: string | null;
  unread_host: number;
  unread_guest: number;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  from_user_id: string;
  text: string;
  read_at: string | null;
  created_at: string;
}

export interface ConversationDetail extends ConversationSummary {
  messages: ChatMessage[];
}

export function listConversations(): Promise<ConversationSummary[]> {
  return apiFetch<ConversationSummary[]>("/conversations");
}

export function getConversation(id: string): Promise<ConversationDetail> {
  return apiFetch<ConversationDetail>(`/conversations/${id}`);
}

export function createConversation(payload: {
  property_id: string;
  booking_id?: string;
  text: string;
}): Promise<ConversationDetail> {
  return apiFetch<ConversationDetail>("/conversations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function sendMessage(id: string, text: string): Promise<ChatMessage> {
  return apiFetch<ChatMessage>(`/conversations/${id}/messages`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export function markRead(id: string): Promise<ConversationSummary> {
  return apiFetch<ConversationSummary>(`/conversations/${id}/read`, {
    method: "PATCH",
  });
}
