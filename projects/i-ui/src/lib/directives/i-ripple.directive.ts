import { Directive, ElementRef, HostListener, Renderer2, input } from '@angular/core';


@Directive({
  selector: '[iRipple]',
  standalone: true,
})
export class IRippleDirective {
  /**
   * Ripple color (optional, defaults to currentColor)
   */
  rippleColor = input<string | undefined>('currentColor');

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent) {
    const host = this.el.nativeElement as HTMLElement;
    const rect = host.getBoundingClientRect();
    // Calculate the farthest corner distance from the click point
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const distTL = Math.hypot(clickX, clickY);
    const distTR = Math.hypot(rect.width - clickX, clickY);
    const distBL = Math.hypot(clickX, rect.height - clickY);
    const distBR = Math.hypot(rect.width - clickX, rect.height - clickY);
    const maxDist = Math.max(distTL, distTR, distBL, distBR);
    // Make the ripple a perfect circle, centered on the click, and just large enough to cover the farthest corner
    const size = maxDist * 2.1;
    // Bubble pop: center the ripple exactly at the click point
    const x = clickX - size / 2;
    const y = clickY - size / 2;

    const ripple = this.renderer.createElement('span');
    this.renderer.setStyle(ripple, 'position', 'absolute');
    // Inherit border radius from host for perfect fit
    let hostBorderRadius = '50%';
    try {
      const computedStyle = getComputedStyle(host);
      hostBorderRadius = computedStyle.borderRadius || '50%';
      // If borderRadius is 0 or empty, fallback to 50% for circles, else use px value
      if (!hostBorderRadius || hostBorderRadius === '0px' || hostBorderRadius === '0') {
        // If the host is perfectly round (width == height), use 50%
        if (host.offsetWidth === host.offsetHeight) {
          hostBorderRadius = '50%';
        } else {
          hostBorderRadius = '8px'; // fallback for rectangles
        }
      }
    } catch {}
    this.renderer.setStyle(ripple, 'border-radius', hostBorderRadius);
    this.renderer.setStyle(ripple, 'pointer-events', 'none');
    this.renderer.setStyle(ripple, 'width', `${size}px`);
    this.renderer.setStyle(ripple, 'height', `${size}px`);
    this.renderer.setStyle(ripple, 'left', `${x}px`);
    this.renderer.setStyle(ripple, 'top', `${y}px`);
    this.renderer.setStyle(ripple, 'background', this.rippleColor() || 'currentColor');
    this.renderer.setStyle(ripple, 'opacity', '0.15');
    this.renderer.setStyle(ripple, 'backdrop-filter', 'blur(6px)');
    this.renderer.setStyle(ripple, 'box-shadow', '0 4px 16px 0 rgba(0,0,0,0.12)');
    this.renderer.setStyle(ripple, 'transform', 'scale(0)');
    this.renderer.setStyle(ripple, 'transition',
      'transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms cubic-bezier(0.22, 1, 0.36, 1), filter 320ms cubic-bezier(0.22, 1, 0.36, 1)');
    this.renderer.setStyle(ripple, 'z-index', '2');
    this.renderer.setStyle(ripple, 'pointer-events', 'none');
    this.renderer.addClass(ripple, 'i-ripple');

    // Ensure the host is relative/overflow-hidden
    const computedStyle = getComputedStyle(host);
    if (computedStyle.position === 'static') {
      this.renderer.setStyle(host, 'position', 'relative');
    }
    this.renderer.setStyle(host, 'overflow', 'hidden');

    this.renderer.appendChild(host, ripple);
    // Force style recalculation
    void ripple.offsetWidth;
    this.renderer.setStyle(ripple, 'transform', 'scale(1)');
    this.renderer.setStyle(ripple, 'filter', 'blur(0px)');

    // Bubble pop: fade out and shrink after expansion
    setTimeout(() => {
      this.renderer.setStyle(ripple, 'opacity', '0');
      this.renderer.setStyle(ripple, 'transform', 'scale(1.25)');
      this.renderer.setStyle(ripple, 'filter', 'blur(8px)');
      setTimeout(() => {
        if (ripple.parentNode === host) {
          this.renderer.removeChild(host, ripple);
        }
      }, 320);
    }, 220);
  }
}
