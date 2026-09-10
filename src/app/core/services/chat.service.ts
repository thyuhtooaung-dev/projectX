import { isPlatformBrowser } from '@angular/common';
import {
  computed,
  Injectable,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import type {
  AiModel,
  ChatMessage,
  ConversationDetail,
  ConversationItem,
  StreamEvent,
} from '@/core/models/chat.model';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly baseUrl = environment.apiBaseUrl;

  readonly conversations = signal<ConversationItem[]>([]);
  readonly currentConversationId = signal<number | null>(null);

  readonly messages = signal<ChatMessage[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string>('');
  readonly availableModels = signal<AiModel[]>([]);
  readonly selectedModelId = signal<string>('');
  readonly modelUsed = signal<string>('');

  readonly currentConversation = computed(() => {
    const id = this.currentConversationId();
    if (!id) return null;
    return this.conversations().find((c) => c.id === id) || null;
  });

  constructor() {
    if (this.isBrowser) {
      void this.loadModels();
      void this.loadConversations();
    }
  }

  async loadModels(): Promise<void> {
    try {
      const res = await fetch(`${this.baseUrl}/chat/models`);
      if (res.ok) {
        const data: AiModel[] = await res.json();
        this.availableModels.set(data);
        if (data.length > 0) {
          const currentId = this.selectedModelId();
          const isValid = currentId && data.some((m) => m.id === currentId);
          if (!isValid) {
            this.selectedModelId.set(data[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load AI models:', err);
    }
  }

  async loadConversations(): Promise<void> {
    try {
      const res = await fetch(`${this.baseUrl}/conversations`);
      if (res.ok) {
        const data: ConversationItem[] = await res.json();
        this.conversations.set(data);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  }

  async loadConversation(id: number): Promise<void> {
    if (this.loading() || this.currentConversationId() === id) return;

    this.loading.set(true);
    this.error.set('');

    try {
      const res = await fetch(`${this.baseUrl}/conversations/${id}`);
      if (!res.ok) throw new Error(`Failed to load conversation #${id}`);

      const data: ConversationDetail = await res.json();
      this.currentConversationId.set(data.id);
      this.messages.set(
        (data.messages || []).map((m) => ({
          role: m.role,
          content: m.content,
          reasoning: m.reasoning,
          createdAt: m.createdAt,
        })),
      );
    } catch (err) {
      this.error.set((err as Error)?.message || 'Error loading conversation.');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteConversation(id: number): Promise<void> {
    try {
      const res = await fetch(`${this.baseUrl}/conversations/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok && res.status !== 204) {
        throw new Error('Failed to delete conversation');
      }

      this.conversations.update((list) => list.filter((c) => c.id !== id));

      if (this.currentConversationId() === id) {
        this.startNewChat();
      }
    } catch (err) {
      this.error.set(
        (err as Error)?.message || 'Could not delete conversation.',
      );
    }
  }

  selectModel(modelId: string): void {
    this.selectedModelId.set(modelId);
  }

  startNewChat(): void {
    this.currentConversationId.set(null);
    this.modelUsed.set('');
    this.messages.set([]);
    this.error.set('');
  }

  async sendMessage(prompt: string): Promise<void> {
    const trimmed = prompt.trim();
    if (!trimmed || this.loading()) return;

    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    this.messages.update((msgs) => [...msgs, userMessage]);
    this.loading.set(true);
    this.error.set('');

    const payload: {
      prompt: string;
      conversationId?: number;
      model?: string;
    } = {
      prompt: trimmed,
    };

    const currentId = this.currentConversationId();
    if (currentId) {
      payload.conversationId = currentId;
    }

    const currentModel = this.selectedModelId();
    if (currentModel) {
      payload.model = currentModel;
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Server returned status ${response.status}: ${response.statusText}`,
        );
      }

      if (!response.body) {
        throw new Error('ReadableStream is not supported by your browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let assistantMessageAdded = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine.startsWith('data:')) continue;

          const dataStr = trimmedLine.replace(/^data:\s*/, '');
          if (!dataStr) continue;

          try {
            const eventData: StreamEvent = JSON.parse(dataStr);

            if (eventData.type === 'session' && eventData.conversationId) {
              this.currentConversationId.set(eventData.conversationId);
              void this.loadConversations();
            } else if (eventData.type === 'modelUsed' && eventData.modelUsed) {
              this.modelUsed.set(eventData.modelUsed);
            } else if (eventData.type === 'reasoning') {
              if (!assistantMessageAdded) {
                this.messages.update((msgs) => [
                  ...msgs,
                  {
                    role: 'assistant',
                    content: '',
                    reasoning: eventData.content || '',
                  },
                ]);
                assistantMessageAdded = true;
              } else {
                this.messages.update((msgs) => {
                  const updated = [...msgs];
                  const lastIdx = updated.length - 1;
                  updated[lastIdx] = {
                    ...updated[lastIdx],
                    reasoning:
                      (updated[lastIdx].reasoning || '') +
                      (eventData.content || ''),
                  };
                  return updated;
                });
              }
            } else if (eventData.type === 'token') {
              if (!assistantMessageAdded) {
                this.messages.update((msgs) => [
                  ...msgs,
                  {
                    role: 'assistant',
                    content: eventData.content || '',
                    reasoning: '',
                  },
                ]);
                assistantMessageAdded = true;
              } else {
                this.messages.update((msgs) => {
                  const updated = [...msgs];
                  const lastIdx = updated.length - 1;
                  updated[lastIdx] = {
                    ...updated[lastIdx],
                    content:
                      updated[lastIdx].content + (eventData.content || ''),
                  };
                  return updated;
                });
              }
            } else if (eventData.type === 'error') {
              this.error.set(
                eventData.message || 'Error received from AI stream.',
              );
            } else if (eventData.type === 'done') {
              this.loading.set(false);
              setTimeout(() => void this.loadConversations(), 2500);
            }
          } catch (err) {
            console.warn('Failed to parse SSE line:', line, err);
          }
        }
      }
    } catch (err) {
      console.error('Streaming request failed:', err);
      this.error.set(
        (err as Error)?.message || 'Error communicating with server.',
      );
    } finally {
      this.loading.set(false);
    }
  }
}
