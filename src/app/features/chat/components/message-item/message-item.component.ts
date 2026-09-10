import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  Bot,
  Brain,
  ChevronDown,
  LucideAngularModule,
  User,
} from 'lucide-angular';
import { MarkdownComponent } from 'ngx-markdown';
import type { ChatMessage } from '@/core/models/chat.model';
import { BadgeComponent } from '@/shared/ui/badge/badge.component';

@Component({
  selector: 'app-message-item',
  standalone: true,
  imports: [
    CommonModule,
    MarkdownComponent,
    LucideAngularModule,
    BadgeComponent,
  ],
  templateUrl: './message-item.component.html',
})
export class MessageItemComponent {
  readonly message = input.required<ChatMessage>();
  readonly isLatest = input<boolean>(false);
  readonly isLoading = input<boolean>(false);

  readonly User = User;
  readonly Bot = Bot;
  readonly Brain = Brain;
  readonly ChevronDown = ChevronDown;
}
