export type ChatRole = "customer" | "assistant" | "agent" | "system";

export type ChatAttachment = {
  /** "image" | "file" for uploads, "reference" for assistant illustration tags */
  type: "image" | "file" | "reference";
  url: string;
  name: string;
  size?: number;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  name?: string | null;
  content: string;
  attachments: ChatAttachment[];
  reactions: Record<string, string[]>;
  createdAt: string;
  readAt?: string | null;
  pending?: boolean;
};

export type ChatConversation = {
  id: string;
  title: string;
  mode: "ai" | "queued" | "live" | "closed";
  status: "open" | "closed";
  assignedAgentId: string | null;
  customerUnread: number;
  lastMessageAt: string;
  pinned: boolean;
};


export const GUEST_STORAGE_KEY = "ethhs-guest-chat-v1";
