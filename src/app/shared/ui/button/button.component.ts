import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

export type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

@Component({
  selector: 'app-button, button[app-button]',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.type]': 'type()',
  },
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('default');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input<boolean>(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly class = input<string>('');

  readonly classes = computed(() => {
    const base =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none';

    const variants: Record<ButtonVariant, string> = {
      default:
        'bg-zinc-100 text-zinc-900 shadow-sm hover:bg-white active:bg-zinc-200',
      secondary:
        'bg-zinc-800 text-zinc-100 border border-zinc-700/80 shadow-xs hover:bg-zinc-700/80 active:bg-zinc-700',
      outline:
        'border border-zinc-700 bg-transparent text-zinc-200 shadow-xs hover:bg-zinc-800 hover:text-zinc-100',
      ghost:
        'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 active:bg-zinc-800',
      destructive:
        'bg-red-950/80 text-red-300 border border-red-800/60 shadow-xs hover:bg-red-900/80 active:bg-red-900',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'h-8 rounded-md px-2.5 text-xs',
      md: 'h-9 px-3.5 py-1.5 text-sm',
      lg: 'h-10 rounded-md px-6 text-base',
      icon: 'h-8 w-8 p-0 rounded-md',
    };

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]} ${this.class()}`;
  });
}
