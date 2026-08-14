import { Directive, ElementRef, HostListener, OnInit, inject } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[appRowHover]',
  standalone: true
})
export class RowHoverDirective implements OnInit {
  private el = inject(ElementRef);
  private pill?: HTMLDivElement;

  ngOnInit() {
    const nativeEl = this.el.nativeElement as HTMLElement;
    
    // Ensure relative positioning for correct absolute coordinates positioning
    nativeEl.style.position = 'relative';
    
    // Create the sliding highlight pill element
    this.pill = document.createElement('div');
    this.pill.className = 'row-highlight-pill';
    this.pill.style.position = 'absolute';
    this.pill.style.top = '12%';
    this.pill.style.height = '76%';
    this.pill.style.width = '180px';
    this.pill.style.backgroundColor = 'var(--color-accent-dim)';
    this.pill.style.borderRadius = '40px';
    this.pill.style.pointerEvents = 'none';
    this.pill.style.zIndex = '0';
    this.pill.style.opacity = '0';
    this.pill.style.transform = 'translate(-50%, 0) scale(0.85)';
    this.pill.style.mixBlendMode = 'multiply'; // editorial overlay color blending
    
    // Position original elements above the highlight pill
    const children = Array.from(nativeEl.children);
    children.forEach(child => {
      if (child instanceof HTMLElement && child.tagName !== 'svg') {
        child.style.position = 'relative';
        child.style.zIndex = '2';
      }
    });
    
    nativeEl.appendChild(this.pill);
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.pill) return;
    gsap.to(this.pill, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.pill) return;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    
    // Track cursor X coordinates inside row
    gsap.to(this.pill, {
      left: x,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (!this.pill) return;
    gsap.to(this.pill, {
      opacity: 0,
      scale: 0.85,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }
}
