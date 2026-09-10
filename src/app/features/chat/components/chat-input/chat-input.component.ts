import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, SendHorizontal, Terminal } from 'lucide-angular';
import { ButtonComponent } from '@/shared/ui/button/button.component';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ButtonComponent],
  templateUrl: './chat-input.component.html',
})
export class ChatInputComponent {
  readonly loading = input<boolean>(false);
  readonly send = output<string>();

  prompt = signal<string>('');

  readonly Terminal = Terminal;
  readonly SendHorizontal = SendHorizontal;

  onSubmit(): void {
    const text = this.prompt().trim();
    if (!text || this.loading()) return;
    this.send.emit(text);
    this.prompt.set('');
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSubmit();
    }
  }
}
