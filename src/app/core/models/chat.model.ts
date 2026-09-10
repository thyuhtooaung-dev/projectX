export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning?: string;
  createdAt?: string;
}

export interface ConversationItem {
  id: number;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationDetail extends ConversationItem {
  messages: ChatMessage[];
}

export interface AiModel {
  id: string;
  name: string;
  description: string;
}

export type StreamEventType =
  | 'session'
  | 'modelUsed'
  | 'reasoning'
  | 'token'
  | 'error'
  | 'done';

export interface StreamEvent {
  type: StreamEventType;
  content?: string;
  conversationId?: number;
  modelUsed?: string;
  message?: string;
}
