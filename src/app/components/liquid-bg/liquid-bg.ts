import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, HostListener, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  angle: number;
  speed: number;
  phase: number;
}

@Component({
  selector: 'app-liquid-bg',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #canvasEl 
            style="position: fixed; 
                   top: 0; 
                   left: 0; 
                   width: 100vw; 
                   height: 100vh; 
                   z-index: 1; 
                   pointer-events: none;
                   filter: blur(14px) saturate(140%);
                   opacity: 0.38;
                   mix-blend-mode: screen;
                   will-change: transform;">
    </canvas>
  `,
})
export class LiquidBg implements OnInit, OnDestroy, AfterViewInit {
  private canvasRef = viewChild.required<HTMLCanvasElement | ElementRef<HTMLCanvasElement>>('canvasEl');
  
  private particles: Particle[] = [];
  private numParticles = 250;
  private animationFrameId?: number;
  
  private mouseX = -1000;
  private mouseY = -1000;
  private lastScrollY = 0;
  private scrollVelocity = 0;

  ngOnInit() {
    this.lastScrollY = window.scrollY;
  }

  ngAfterViewInit() {
    this.setupCanvasSize();
    this.initParticles();
    this.startAnimation();
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);
  }

  private getCanvasElement(): HTMLCanvasElement {
    const ref = this.canvasRef();
    return ref instanceof ElementRef ? ref.nativeElement : ref;
  }

  private setupCanvasSize() {
    const canvas = this.getCanvasElement();
    // Low resolution rendering for high-performance canvas blur filter
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 2;
  }

  private onResize = () => {
    this.setupCanvasSize();
    this.initParticles();
  };

  private initParticles() {
    const canvas = this.getCanvasElement();
    const w = canvas.width;
    const h = canvas.height;
    this.particles = [];

    for (let i = 0; i < this.numParticles; i++) {
      // 80% gold, 20% stark silver-white
      const isGold = Math.random() > 0.2;
      const size = Math.random() * 5 + 1.5;
      
      const r = isGold ? 197 : 245;
      const g = isGold ? 168 : 245;
      const b = isGold ? 128 : 247;
      const alpha = Math.random() * 0.45 + 0.15;

      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size,
        alpha,
        color: `rgba(${r}, ${g}, ${b},`,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.22 + 0.08,
        phase: Math.random() * 100
      });
    }
  }

  private startAnimation() {
    const canvas = this.getCanvasElement();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      this.draw(ctx, canvas.width, canvas.height);
      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  private draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.clearRect(0, 0, width, height);

    const time = Date.now() * 0.0008;

    // Track scroll velocity decay
    const currentScrollY = window.scrollY;
    const diff = currentScrollY - this.lastScrollY;
    this.scrollVelocity += (diff * 0.12 - this.scrollVelocity) * 0.085;
    this.lastScrollY = currentScrollY;
    this.scrollVelocity *= 0.96; // dampening

    // Mouse coordinates scale factor
    const scaleMouseX = this.mouseX / 2;
    const scaleMouseY = this.mouseY / 2;

    this.particles.forEach(p => {
      // 1. Organic flow-field movement (curl noise approximation)
      p.angle = Math.sin(p.x * 0.01 + time + p.phase) * Math.cos(p.y * 0.01 - time * 0.5);
      
      // Calculate velocities
      let targetVx = Math.cos(p.angle) * p.speed;
      let targetVy = Math.sin(p.angle) * p.speed;

      // Add scroll velocity factor (streaks particles vertically on scroll)
      targetVy += this.scrollVelocity * 0.22;

      // 2. Mouse gravity: attract particles nearby
      if (this.mouseX !== -1000) {
        const dx = scaleMouseX - p.x;
        const dy = scaleMouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Attraction radius
        if (dist < width * 0.35) {
          const force = (width * 0.35 - dist) / (width * 0.35);
          // Pull particles towards the cursor
          targetVx += (dx / dist) * force * 0.9;
          targetVy += (dy / dist) * force * 0.9;
        }
      }

      // Smooth interpolation (lerping velocities)
      p.vx += (targetVx - p.vx) * 0.06;
      p.vy += (targetVy - p.vy) * 0.06;

      // Update positions
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around canvas boundaries
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // 3. Render particle (stretch along velocity vector if moving fast, i.e., scrolling)
      ctx.beginPath();
      const velocityMag = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      
      // Draw as a stretched ellipse if velocity is high (scroll streaks)
      if (velocityMag > 1.2) {
        ctx.ellipse(
          p.x, p.y, 
          p.size * 0.8, 
          p.size * (1 + velocityMag * 0.35), 
          Math.atan2(p.vy, p.vx) + Math.PI / 2, 
          0, Math.PI * 2
        );
      } else {
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      }

      ctx.fillStyle = `${p.color}${p.alpha})`;
      ctx.fill();
    });
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  @HostListener('window:mouseleave')
  onMouseLeave() {
    this.mouseX = -1000;
    this.mouseY = -1000;
  }

  @HostListener('window:scroll')
  onScroll() {
    // Scroll event updates scroll positions
  }
}
