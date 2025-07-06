import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { mergeClasses } from '../utilities/merge-classes';
import { IRippleDirective } from '../directives/i-ripple.directive';
import { NgIcon } from '@ng-icons/core';
import { IUiIconsProvider } from '../i-ui-icons.provider';

export type ButtonVariant = 'default' | 'destructive' | 'secondary' | 'outline' | 'ghost' | 'link' | 'icon' | 'anchor';
export type ButtonSize = 'default' | 'sm' | 'md' | 'lg' | 'icon';


const buttonBaseClasses =
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ' +
  'transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ' +
  'disabled:pointer-events-none disabled:opacity-50';

const buttonVariantClasses: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
  outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  icon: 'p-2 rounded-full flex items-center justify-center bg-transparent hover:bg-accent',
  anchor: 'bg-transparent text-primary underline hover:bg-accent',
};

const buttonSizeClasses: Record<ButtonSize, string> = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 rounded-md px-3 text-xs',
  md: 'h-9 rounded-md px-4',
  lg: 'h-10 rounded-md px-8',
  icon: 'h-9 w-9 p-0',
};

@Component({
  selector: 'i-button',
  standalone: true,
  imports: [CommonModule, IRippleDirective, NgIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [IUiIconsProvider],
  template: `
  <button
    [attr.type]="type()"
    [attr.aria-disabled]="disabled()"
    [disabled]="disabled()"
    [ngClass]="computedClasses() + ' i-ui-btn'"
    [style.position]="'relative'"
    [style.overflow]="'hidden'"
    (click)="onClick($event)"
    iRipple
  >
    <ng-container *ngIf="loader(); else buttonContent">
      <ng-icon [name]="icon() || 'featherLoader'" class="mr-2 animate-spin" [style.width]="'1em'" [style.height]="'1em'"></ng-icon>
      <span class="sr-only"><ng-content></ng-content></span>
    </ng-container>
    <ng-template #buttonContent>
      <ng-container *ngIf="icon() && iconPosition() === 'left'">
        <ng-icon [name]="icon()" class="mr-2" [style.width]="'1em'" [style.height]="'1em'"></ng-icon>
      </ng-container>
      <ng-container *ngIf="variant() === 'icon'; else showText">
        <span class="sr-only"><ng-content></ng-content></span>
      </ng-container>
      <ng-template #showText>
        <ng-content></ng-content>
      </ng-template>
      <ng-container *ngIf="icon() && iconPosition() === 'right'">
        <ng-icon [name]="icon()" class="ml-2" [style.width]="'1em'" [style.height]="'1em'"></ng-icon>
      </ng-container>
    </ng-template>
  </button>
  `,
  styles: [
    `.loader { display: inline-block; width: 1em; height: 1em; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; }
     @keyframes spin { 100% { transform: rotate(360deg); } }

     .i-ui-btn {
       transition: box-shadow 0.18s cubic-bezier(.4,0,.2,1),
                   background 0.18s cubic-bezier(.4,0,.2,1),
                   color 0.18s cubic-bezier(.4,0,.2,1),
                   transform 0.12s cubic-bezier(.4,0,.2,1);
       will-change: box-shadow, background, color, transform;
     }
     .i-ui-btn:hover:not(:disabled),
     .i-ui-btn:focus-visible:not(:disabled) {
       box-shadow: 0 4px 24px 0 rgba(0,0,0,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.08);
       transform: translateY(-2px) scale(1.03);
       filter: brightness(1.08);
     }
     .i-ui-btn:active:not(:disabled) {
       box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
       transform: scale(0.97);
       filter: brightness(0.97);
     }
     .i-ui-btn:disabled {
       filter: grayscale(0.2) brightness(0.92);
       cursor: not-allowed;
     }
    `
  ],
})
export class IButtonComponent {
  /**
   * Button variant: 'default', 'outline', 'ghost', 'link', etc.
   */
  variant = input<ButtonVariant>('default');
  /**
   * Button type: 'button', 'submit', or 'reset'. Default is 'button'.
   */
  type = input<'button' | 'submit' | 'reset'>('button');
  /**
   * Loader state
   */
  loader = input<boolean>(false);
  /**
   * Render as anchor
   */
  anchor = input<boolean>(false);
  /**
   * Href for anchor
   */
  href = input<string>('');
  /**
   * Button size: 'sm', 'md', 'lg'.
   */
  size = input<ButtonSize>('md');
  /**
   * Disabled state
   */
  disabled = input<boolean>(false);
  /**
   * Custom classes from the user
   */
  class = input<string>('');
  /**
   * Icon name to show (from built-in icon set)
   */
  icon = input<string | undefined>(undefined);

  /**
   * Icon position: 'left' or 'right'. Default is 'left'.
   */
  iconPosition = input<'left' | 'right'>('left');

  iconOnly = input<boolean>(false);

  computedClasses = computed(() => {
    return mergeClasses(
      buttonBaseClasses,
      buttonVariantClasses[this.variant() as ButtonVariant],
      buttonSizeClasses[this.size() as ButtonSize],
      this.class()
    );
  });

  onClick(event: Event) {
    if (this.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    // Play click sound
    this.playClickSound();
  }

  private playClickSound() {
    // A short, subtle click sound using Web Audio API
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 180;
      gain.gain.value = 0.08;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
      osc.onended = () => ctx.close();
    } catch { }
  }
}
