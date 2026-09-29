import { CommonModule } from '@angular/common';
import { Component, ElementRef, effect, inject, input } from '@angular/core';
import {
  Bot,
  CircleAlert,
  LoaderCircle,
  LucideAngularModule,
} from 'lucide-angular';
import type { ChatMessage } from '@/core/models/chat.model';
import { MessageItemComponent } from '@/features/chat/components/message-item/message-item.component';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, MessageItemComponent],
  templateUrl: './message-list.component.html',
})
export class MessageListComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly messages = input.required<ChatMessage[]>();
  readonly loading = input<boolean>(false);
  readonly error = input<string>('');
  readonly modelUsed = input<string>('');

  readonly Bot = Bot;
  readonly LoaderCircle = LoaderCircle;
  readonly CircleAlert = CircleAlert;

  constructor() {
    effect(() => {
      this.messages();
      this.loading();
      this.scrollToBottom();
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const el = this.host.nativeElement as HTMLElement;
      el.scrollTop = el.scrollHeight;
    }, 40);
  }
}
