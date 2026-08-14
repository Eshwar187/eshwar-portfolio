import { Directive, ElementRef, OnInit, OnDestroy, inject, input } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Directive({
  selector: '[appParallax]',
  standalone: true
})
export class ParallaxDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private triggerInstance?: ScrollTrigger;

  // Parallax translation speed factor
  speed = input<number>(0.15); 

  ngOnInit() {
    this.initParallax();
  }

  ngOnDestroy() {
    if (this.triggerInstance) {
      this.triggerInstance.kill();
    }
  }

  private initParallax() {
    const nativeEl = this.el.nativeElement as HTMLElement;

    this.triggerInstance = ScrollTrigger.create({
      trigger: nativeEl,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        // Center the progression around 0
        const range = 140 * this.speed();
        const yVal = (self.progress - 0.5) * -range;
        gsap.set(nativeEl, { y: yVal });
      }
    });
  }
}
