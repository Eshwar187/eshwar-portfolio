import { Directive, ElementRef, OnInit, OnDestroy, inject, input } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Directive({
  selector: '[appScrollDraw]',
  standalone: true
})
export class ScrollDrawDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private triggerInstance?: ScrollTrigger;

  delay = input<number>(0);

  ngOnInit() {
    this.initScrollDraw();
  }

  ngOnDestroy() {
    if (this.triggerInstance) {
      this.triggerInstance.kill();
    }
  }

  private initScrollDraw() {
    const nativeEl = this.el.nativeElement as HTMLElement;
    const paths = nativeEl.querySelectorAll('path');

    if (paths.length === 0) return;

    // Set up initial dash states
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });

    // Trigger drawing timeline on screen entry
    this.triggerInstance = ScrollTrigger.create({
      trigger: nativeEl,
      start: 'top bottom-=10%',
      onEnter: () => {
        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: 2.0,
          delay: this.delay() / 1000,
          stagger: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      },
      onLeaveBack: () => {
        paths.forEach(path => {
          const length = path.getTotalLength();
          gsap.to(path, {
            strokeDashoffset: length,
            duration: 1.2,
            ease: 'power2.in',
            overwrite: 'auto'
          });
        });
      }
    });
  }
}
