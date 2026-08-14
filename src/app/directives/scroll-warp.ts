import { Directive, ElementRef, OnInit, OnDestroy, inject, input } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Directive({
  selector: '[appScrollWarp]',
  standalone: true
})
export class ScrollWarpDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private scrollTriggerInstance?: ScrollTrigger;

  maxSkew = input<number>(10); // Max skew angle in degrees
  maxScale = input<number>(1.06); // Max scale stretching factor

  ngOnInit() {
    this.initScrollWarp();
  }

  ngOnDestroy() {
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.kill();
    }
  }

  private initScrollWarp() {
    const nativeEl = this.el.nativeElement as HTMLElement;

    // Create fast tweener functions for smooth property updates
    const skewTo = gsap.quickTo(nativeEl, 'skewY', { duration: 0.3, ease: 'power2.out' });
    const scaleTo = gsap.quickTo(nativeEl, 'scaleY', { duration: 0.35, ease: 'power2.out' });

    this.scrollTriggerInstance = ScrollTrigger.create({
      trigger: nativeEl,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        
        // Calculate skew (dependent on direction and speed of scroll)
        // velocity is px/sec, typical scrolls are in range 0 - 3000
        let skew = (velocity / 400);
        skew = Math.max(-this.maxSkew(), Math.min(this.maxSkew(), skew));

        // Calculate stretch scale (always positive, stretches along Y-axis)
        let scale = 1 + Math.abs(velocity) / 10000;
        scale = Math.max(1, Math.min(this.maxScale(), scale));

        skewTo(skew);
        scaleTo(scale);
      },
      onLeave: () => this.reset(skewTo, scaleTo),
      onLeaveBack: () => this.reset(skewTo, scaleTo),
      onRefresh: () => this.reset(skewTo, scaleTo)
    });
  }

  private reset(skewTo: Function, scaleTo: Function) {
    skewTo(0);
    scaleTo(1);
  }
}
