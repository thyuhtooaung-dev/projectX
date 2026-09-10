import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'destructive'
  | 'active';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  },
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('default');
  readonly class = input<string>('');

  readonly classes = computed(() => {
    const base =
      'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-mono font-medium transition-colors select-none';

    const variants: Record<BadgeVariant, string> = {
      default: 'bg-zinc-800 text-zinc-200 border border-zinc-700/80',
      secondary: 'bg-zinc-900 text-zinc-400 border border-zinc-800',
      outline: 'border border-zinc-700 text-zinc-300',
      destructive: 'bg-red-950/60 text-red-400 border border-red-800/60',
      active: 'bg-blue-950/60 text-blue-400 border border-blue-800/60',
    };

    return `${base} ${variants[this.variant()]} ${this.class()}`;
  });
}
