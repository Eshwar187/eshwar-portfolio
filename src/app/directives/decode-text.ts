import { Directive, ElementRef, OnInit, OnDestroy, inject, input } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[appDecodeText]',
  standalone: true
})
export class DecodeTextDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private observer?: IntersectionObserver;
  private glyphs = '!@#$%^&*()_+-=[]{}|;:,.<>?/~';
  
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
    const targetText = nativeEl.textContent || '';
    
    // Clear initial text to prevent flash of content
    nativeEl.textContent = '';

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            this.scrambleText(targetText);
          }, this.delay());
          this.observer?.unobserve(nativeEl);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -5% 0px'
    });

    this.observer.observe(nativeEl);
  }

  private scrambleText(targetText: string) {
    const nativeEl = this.el.nativeElement as HTMLElement;
    const length = targetText.length;
    const obj = { val: 0 };

    gsap.to(obj, {
      val: length,
      duration: 1.4,
      ease: 'none',
      onUpdate: () => {
        const resolvedChars = Math.floor(obj.val);
        let output = '';

        for (let i = 0; i < length; i++) {
          if (i < resolvedChars) {
            output += targetText[i];
          } else if (targetText[i] === ' ' || targetText[i] === ',' || targetText[i] === '[' || targetText[i] === ']') {
            output += targetText[i];
          } else {
            output += this.glyphs[Math.floor(Math.random() * this.glyphs.length)];
          }
        }
        nativeEl.textContent = output;
      },
      onComplete: () => {
        nativeEl.textContent = targetText;
      }
    });
  }
}
