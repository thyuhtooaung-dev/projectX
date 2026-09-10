import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  Check,
  ChevronDown,
  Cpu,
  LucideAngularModule,
  Sparkles,
} from 'lucide-angular';
import type { AiModel } from '@/core/models/chat.model';

@Component({
  selector: 'app-model-select',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="relative inline-block text-left">
      <button
        type="button"
        (click)="toggleOpen()"
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 text-xs font-mono text-zinc-200 transition-colors cursor-pointer select-none shadow-xs"
      >
        <lucide-icon [img]="Cpu" class="w-3.5 h-3.5 text-zinc-400"></lucide-icon>
        <span class="max-w-44 truncate font-medium">{{ selectedModelName() }}</span>
        <lucide-icon
          [img]="ChevronDown"
          class="w-3.5 h-3.5 text-zinc-400 transition-transform duration-200"
          [class.rotate-180]="isOpen()"
        ></lucide-icon>
      </button>

      @if (isOpen()) {
        <div
          class="absolute left-0 mt-1.5 w-72 origin-top-left rounded-lg bg-[#18181b] border border-zinc-800 shadow-xl z-50 p-1.5 space-y-1 font-sans text-xs animate-in fade-in zoom-in-95 duration-100"
        >
          <div class="px-2.5 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            Select OpenRouter Model
          </div>

          @for (model of models(); track model.id) {
            <button
              type="button"
              (click)="onSelect(model.id)"
              class="w-full flex items-start gap-2 px-2.5 py-2 rounded-md transition-colors text-left cursor-pointer"
              [class.bg-zinc-800]="selectedModelId() === model.id"
              [class.text-white]="selectedModelId() === model.id"
              [class.hover:bg-zinc-800/60]="selectedModelId() !== model.id"
              [class.text-zinc-300]="selectedModelId() !== model.id"
            >
              <div class="mt-0.5 shrink-0">
                @if (selectedModelId() === model.id) {
                  <lucide-icon [img]="Check" class="w-3.5 h-3.5 text-blue-400"></lucide-icon>
                } @else {
                  <lucide-icon [img]="Sparkles" class="w-3.5 h-3.5 text-zinc-500"></lucide-icon>
                }
              </div>
              <div class="min-w-0 flex-1">
                <div class="font-medium text-xs truncate">{{ model.name }}</div>
                <div class="text-[11px] text-zinc-400 truncate mt-0.5">
                  {{ model.description }}
                </div>
              </div>
            </button>
          } @empty {
            <div class="px-3 py-2 text-zinc-500 text-xs">No models available.</div>
          }
        </div>
      }
    </div>
  `,
})
export class ModelSelectComponent {
  private readonly el = inject(ElementRef);

  readonly models = input.required<AiModel[]>();
  readonly selectedModelId = input.required<string>();
  readonly modelSelected = output<string>();

  readonly isOpen = signal<boolean>(false);

  readonly Cpu = Cpu;
  readonly ChevronDown = ChevronDown;
  readonly Check = Check;
  readonly Sparkles = Sparkles;

  selectedModelName(): string {
    const current = this.models().find((m) => m.id === this.selectedModelId());
    return current ? current.name : this.selectedModelId() || 'Select Model';
  }

  toggleOpen(): void {
    this.isOpen.update((v) => !v);
  }

  onSelect(id: string): void {
    this.modelSelected.emit(id);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
