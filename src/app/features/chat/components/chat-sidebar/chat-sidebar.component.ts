import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import {
  Bot,
  LucideAngularModule,
  MessageSquare,
  Plus,
  Trash2,
} from 'lucide-angular';
import type { ConversationItem } from '@/core/models/chat.model';
import { ButtonComponent } from '@/shared/ui/button/button.component';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonComponent],
  templateUrl: './chat-sidebar.component.html',
})
export class ChatSidebarComponent {
  readonly conversations = input.required<ConversationItem[]>();
  readonly activeConversationId = input<number | null>(null);

  readonly selectConversation = output<number>();
  readonly newChat = output<void>();
  readonly deleteConversation = output<number>();

  readonly Bot = Bot;
  readonly Plus = Plus;
  readonly MessageSquare = MessageSquare;
  readonly Trash2 = Trash2;

  onDelete(e: MouseEvent, id: number): void {
    e.stopPropagation();
    this.deleteConversation.emit(id);
  }
}
