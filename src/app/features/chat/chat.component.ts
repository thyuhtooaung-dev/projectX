import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '@/core/services/chat.service';
import { ChatHeaderComponent } from './components/chat-header/chat-header.component';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ChatSidebarComponent } from './components/chat-sidebar/chat-sidebar.component';
import { MessageListComponent } from './components/message-list/message-list.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    ChatSidebarComponent,
    ChatHeaderComponent,
    MessageListComponent,
    ChatInputComponent,
  ],
  templateUrl: './chat.component.html',
})
export class ChatComponent {
  readonly chatService = inject(ChatService);
  private readonly router = inject(Router);

  readonly id = input<string | undefined>();

  constructor() {
    effect(() => {
      const routeId = this.id();
      if (routeId) {
        const numId = parseInt(routeId, 10);
        if (!Number.isNaN(numId)) {
          void this.chatService.loadConversation(numId);
        }
      } else {
        this.chatService.startNewChat();
      }
    });
  }

  onSelectConversation(convId: number): void {
    void this.router.navigate(['/c', convId]);
  }

  onNewChat(): void {
    this.chatService.startNewChat();
    void this.router.navigate(['/']);
  }

  onDeleteConversation(convId: number): void {
    void this.chatService.deleteConversation(convId);
    if (this.chatService.currentConversationId() === convId) {
      void this.router.navigate(['/']);
    }
  }

  onModelSelected(modelId: string): void {
    this.chatService.selectModel(modelId);
  }

  onSendMessage(prompt: string): void {
    void this.chatService.sendMessage(prompt);
  }
}
