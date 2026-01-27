export type Folder = "inbox" | "sent" | "bounced" | "all";

export type MessageStatus = "interested" | "not_interested" | "out_of_office" | null;

export type ReadState = "unread" | "read" | "all";

export interface Message {
  id: string;
  threadId: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  };
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  status: MessageStatus;
  folder: Folder;
  campaign?: string;
  senderAccount?: string;
}

export interface Thread {
  id: string;
  leadName: string;
  leadEmail: string;
  leadCompany?: string;
  subject: string;
  lastMessagePreview: string;
  lastMessageTimestamp: string;
  messageCount: number;
  isRead: boolean;
  status: MessageStatus;
  folder: Folder;
  campaign?: string;
  senderAccount?: string;
  messages: Message[];
}

export interface InboxFilters {
  folder: Folder;
  status: MessageStatus | "all";
  readState: ReadState;
  campaign: string | "all";
  senderAccount: string | "all";
  search: string;
}
