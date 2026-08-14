import { Directive, ElementRef, OnInit, OnDestroy, inject, input } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[appTextReveal]',
  standalone: true,
})
export class TextRevealDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private observer?: IntersectionObserver;
  
  // Custom delay multiplier in milliseconds
  delay = input<number>(0);

  ngOnInit() {
    this.prepareText();
    this.initObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private prepareText() {
    const nativeEl = this.el.nativeElement as HTMLElement;
    const textContent = nativeEl.textContent || '';
    
    // Clear text content
    nativeEl.innerHTML = '';
    
    // Split into characters (keeping spaces)
    const chars = Array.from(textContent);
    
    // Wrap each character in a clip mask
    nativeEl.innerHTML = chars.map(char => {
      if (char === ' ') {
        return `<span style="display: inline-block;">&nbsp;</span>`;
      }
      return `
        <span class="reveal-char-mask" style="display: inline-block; overflow: hidden; vertical-align: bottom;">
          <span class="reveal-char-inner" style="display: inline-block; transform: translateY(100%); opacity: 0; transition: none; will-change: transform, opacity;">
            ${char}
          </span>
        </span>
      `;
    }).join('');
  }

  private initObserver() {
    const nativeEl = this.el.nativeElement as HTMLElement;
    const inners = nativeEl.querySelectorAll('.reveal-char-inner');
    if (inners.length === 0) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Play fluid, staggered character reveal with elastic overshoot
          gsap.to(inners, {
            y: '0%',
            opacity: 1,
            duration: 0.95,
            stagger: 0.024,
            delay: this.delay() / 1000,
            ease: 'back.out(1.2)',
            overwrite: 'auto'
          });
          
          this.observer?.unobserve(nativeEl);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -8% 0px'
    });

    this.observer.observe(nativeEl);
  }
}
