import { CommonModule } from '@angular/common';
import {
  Component,
  type ElementRef,
  effect,
  input,
  ViewChild,
} from '@angular/core';
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
  @ViewChild('scrollContainer')
  private scrollContainer!: ElementRef<HTMLDivElement>;

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
      this.scrollToBottom();
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer?.nativeElement) {
        this.scrollContainer.nativeElement.scrollTop =
          this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 40);
  }
}
