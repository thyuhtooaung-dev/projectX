import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Cpu, LucideAngularModule, Plus, Terminal } from 'lucide-angular';
import type { AiModel } from '@/core/models/chat.model';
import { BadgeComponent } from '@/shared/ui/badge/badge.component';
import { ButtonComponent } from '@/shared/ui/button/button.component';
import { ModelSelectComponent } from '@/shared/ui/dropdown/model-select.component';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ModelSelectComponent,
    BadgeComponent,
    ButtonComponent,
  ],
  templateUrl: './chat-header.component.html',
})
export class ChatHeaderComponent {
  readonly conversationId = input<number | null>(null);
  readonly conversationTitle = input<string | undefined>();
  readonly modelUsed = input<string>('');
  readonly availableModels = input.required<AiModel[]>();
  readonly selectedModelId = input.required<string>();

  readonly modelSelected = output<string>();
  readonly newChat = output<void>();

  readonly Terminal = Terminal;
  readonly Plus = Plus;
  readonly Cpu = Cpu;
}
