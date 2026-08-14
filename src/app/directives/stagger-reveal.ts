import { Directive, ElementRef, OnInit, OnDestroy, inject, input } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[appStaggerReveal]',
  standalone: true
})
export class StaggerRevealDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private observer?: IntersectionObserver;

  // The CSS selector target for staggered child elements
  selector = input.required<string>();
  delay = input<number>(0);

  ngOnInit() {
    this.initObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private initObserver() {
    const nativeEl = this.el.nativeElement as HTMLElement;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = nativeEl.querySelectorAll(this.selector());
          if (items.length > 0) {
            // Lock target child elements in initial hidden state
            gsap.set(items, { y: 30, opacity: 0 });
            
            // Execute staggered GSAP reveal
            gsap.to(items, {
              y: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.12,
              delay: this.delay() / 1000,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          }
          this.observer?.unobserve(nativeEl);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -5% 0px'
    });

    this.observer.observe(nativeEl);
  }
}
