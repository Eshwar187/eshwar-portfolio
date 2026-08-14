import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective {
  private el = inject(ElementRef);
  
  // Custom strength of the magnetic pull
  strength = input<number>(0.28);

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const nativeEl = this.el.nativeElement as HTMLElement;
    const rect = nativeEl.getBoundingClientRect();
    
    // Center coordinates
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    // Distance vectors
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    
    // Soft translation offsets
    const targetX = dx * this.strength();
    const targetY = dy * this.strength();
    
    gsap.to(nativeEl, {
      x: targetX,
      y: targetY,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    const nativeEl = this.el.nativeElement as HTMLElement;
    
    // Spring elastic snap back
    gsap.to(nativeEl, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1.2, 0.4)',
      overwrite: 'auto'
    });
  }
}
