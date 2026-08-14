import { Directive, ElementRef, HostListener, OnInit, OnDestroy, inject, input } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[appGlitch]',
  standalone: true
})
export class GlitchDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private originalText = '';
  private glitchInterval?: any;
  private glyphs = 'XØÆ█▓▒░$#%&';

  ngOnInit() {
    this.originalText = this.el.nativeElement.textContent || '';
  }

  ngOnDestroy() {
    this.stopGlitch();
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.startGlitch();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.stopGlitch();
  }

  private startGlitch() {
    this.stopGlitch();
    const nativeEl = this.el.nativeElement as HTMLElement;
    
    this.glitchInterval = setInterval(() => {
      // 1. Random position offsets & chromatic text shadow wiggles
      const sx1 = Math.random() * 4 - 2;
      const sy1 = Math.random() * 4 - 2;
      const sx2 = Math.random() * 4 - 2;
      const sy2 = Math.random() * 4 - 2;
      
      const px = Math.random() * 2 - 1;
      const py = Math.random() * 2 - 1;

      gsap.set(nativeEl, {
        x: px,
        y: py,
        textShadow: `${sx1}px ${sy1}px 0 rgba(197, 168, 128, 0.75), ${sx2}px ${sy2}px 0 rgba(226, 226, 229, 0.75)`
      });

      // 2. Character scrambling (scramble 1-2 random letters)
      if (Math.random() > 0.5) {
        const textArr = Array.from(this.originalText);
        const scrambleCount = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < scrambleCount; i++) {
          const randIdx = Math.floor(Math.random() * textArr.length);
          if (textArr[randIdx] !== ' ') {
            textArr[randIdx] = this.glyphs[Math.floor(Math.random() * this.glyphs.length)];
          }
        }
        nativeEl.textContent = textArr.join('');
      } else {
        nativeEl.textContent = this.originalText;
      }
    }, 70);
  }

  private stopGlitch() {
    if (this.glitchInterval) {
      clearInterval(this.glitchInterval);
      this.glitchInterval = undefined;
    }

    const nativeEl = this.el.nativeElement as HTMLElement;
    nativeEl.textContent = this.originalText;
    
    gsap.set(nativeEl, {
      x: 0,
      y: 0,
      textShadow: 'none'
    });
  }
}
