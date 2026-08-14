import { Directive, ElementRef, OnInit, inject, input } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[appInteractiveText]',
  standalone: true
})
export class InteractiveTextDirective implements OnInit {
  private el = inject(ElementRef);
  
  strength = input<number>(12); // Repulsion/attraction range in pixels
  scrambleWeight = input<boolean>(true);

  ngOnInit() {
    this.splitText();
  }

  private splitText() {
    const nativeEl = this.el.nativeElement as HTMLElement;
    const text = nativeEl.textContent || '';
    if (!text.trim()) return;

    nativeEl.innerHTML = '';
    
    // Split text into words, then words into characters, keeping spaces
    const words = text.split(' ');
    words.forEach((word, wordIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';
      
      const chars = Array.from(word);
      chars.forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.style.display = 'inline-block';
        charSpan.style.transformStyle = 'preserve-3d';
        charSpan.style.willChange = 'transform, font-weight';
        charSpan.classList.add('interactive-char');
        
        // Add hover interaction
        this.attachHoverInteraction(charSpan);
        
        wordSpan.appendChild(charSpan);
      });

      nativeEl.appendChild(wordSpan);

      // Add a space span between words except for the last word
      if (wordIdx < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.innerHTML = '&nbsp;';
        spaceSpan.style.display = 'inline-block';
        nativeEl.appendChild(spaceSpan);
      }
    });
  }

  private attachHoverInteraction(span: HTMLSpanElement) {
    span.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = span.getBoundingClientRect();
      const spanCenterX = rect.left + rect.width / 2;
      const spanCenterY = rect.top + rect.height / 2;

      // Distance from mouse to center of span
      const deltaX = e.clientX - spanCenterX;
      const deltaY = e.clientY - spanCenterY;

      // Magnetic pull: pull slightly towards the mouse (inverted delta * strength factor)
      const moveX = (deltaX / rect.width) * this.strength();
      const moveY = (deltaY / rect.height) * this.strength();

      // Dynamically scramble font weight based on cursor distance
      if (this.scrambleWeight()) {
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDist = Math.sqrt((rect.width * rect.width) / 4 + (rect.height * rect.height) / 4);
        const ratio = Math.max(0, Math.min(1, 1 - distance / maxDist));
        
        // Scramble font-weight between 300 (light) and 900 (heavy)
        const weight = Math.floor(300 + ratio * 600);
        span.style.fontWeight = `${weight}`;
      }

      gsap.to(span, {
        x: moveX,
        y: moveY,
        scale: 1.25,
        color: 'var(--color-accent)',
        textShadow: '0 0 12px rgba(197, 168, 128, 0.35)',
        duration: 0.2,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    span.addEventListener('mouseleave', () => {
      // Elastic return to center
      gsap.to(span, {
        x: 0,
        y: 0,
        scale: 1,
        color: '',
        textShadow: 'none',
        duration: 0.85,
        ease: 'elastic.out(1.2, 0.4)',
        overwrite: 'auto',
        onComplete: () => {
          if (this.scrambleWeight()) {
            span.style.fontWeight = '';
          }
        }
      });
    });
  }
}
