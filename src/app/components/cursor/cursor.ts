import { Component, ElementRef, HostListener, OnInit, OnDestroy, viewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cursor-dot" #dot [class.hovered]="isHovered()"></div>
    <div class="cursor-ring" #ring>
      {{ cursorLabel() }}
    </div>
  `,
  styleUrl: './cursor.css',
})
export class Cursor implements OnInit, OnDestroy {
  private dotRef = viewChild.required<ElementRef<HTMLDivElement>>('dot');
  private ringRef = viewChild.required<ElementRef<HTMLDivElement>>('ring');

  isHovered = signal(false);
  cursorLabel = signal('');

  ngOnInit() {
    // Hide default cursor initial setup
    document.body.style.cursor = 'none';
  }

  ngOnDestroy() {
    document.body.style.cursor = 'default';
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const dot = this.dotRef().nativeElement;
    const ring = this.ringRef().nativeElement;
    
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Instant position for inner dot
    gsap.set(dot, { x: mouseX, y: mouseY });

    // Smooth inertia lag position for outer ring
    gsap.to(ring, {
      x: mouseX,
      y: mouseY,
      duration: 0.15,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  // Global Event Delegation to monitor hover transitions on elements
  @HostListener('window:mouseover', ['$event'])
  onMouseOver(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target) return;

    // Check for custom data-cursor-label attribute
    const labelEl = target.closest('[data-cursor-label]') as HTMLElement;
    if (labelEl) {
      const label = labelEl.getAttribute('data-cursor-label') || '';
      this.cursorLabel.set(label);
      this.isHovered.set(true);
      
      const ring = this.ringRef().nativeElement;
      gsap.to(ring, {
        width: 72,
        height: 72,
        backgroundColor: 'rgba(197, 168, 128, 0.12)',
        borderColor: 'var(--color-accent)',
        color: 'var(--color-accent)',
        duration: 0.45,
        ease: 'back.out(1.5)',
        overwrite: 'auto'
      });
      return;
    }

    // Check if target matches general interactive elements
    const isInteractive = 
      target.tagName === 'A' || 
      target.tagName === 'BUTTON' || 
      target.closest('a') !== null ||
      target.closest('button') !== null;

    if (isInteractive) {
      this.isHovered.set(true);
      
      let label = 'LINK';
      const anchor = target.closest('a');
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        label = 'GOTO';
      }
      this.cursorLabel.set(label);

      const ring = this.ringRef().nativeElement;
      gsap.to(ring, {
        width: 58,
        height: 58,
        backgroundColor: 'rgba(197, 168, 128, 0.08)',
        borderColor: 'var(--color-accent)',
        color: 'var(--color-accent)',
        duration: 0.45,
        ease: 'back.out(1.5)',
        overwrite: 'auto'
      });
    }
  }

  @HostListener('window:mouseout', ['$event'])
  onMouseOut(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target) return;

    const labelEl = target.closest('[data-cursor-label]') as HTMLElement;
    const isInteractive = 
      target.tagName === 'A' || 
      target.tagName === 'BUTTON' || 
      target.closest('a') !== null ||
      target.closest('button') !== null;

    if (labelEl || isInteractive) {
      const relatedTarget = event.relatedTarget as HTMLElement;
      if (relatedTarget) {
        if (labelEl && labelEl.contains(relatedTarget)) return;
        if (target.contains(relatedTarget)) return;
      }

      this.isHovered.set(false);
      this.cursorLabel.set('');

      const ring = this.ringRef().nativeElement;
      gsap.to(ring, {
        width: 26,
        height: 26,
        backgroundColor: 'transparent',
        borderColor: 'rgba(197, 168, 128, 0.4)',
        color: 'transparent',
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  }
}
