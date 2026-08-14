import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, HostListener, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
}

@Component({
  selector: 'app-plexus-bg',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #canvasEl style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1; pointer-events: none;"></canvas>`,
})
export class PlexusBg implements OnInit, OnDestroy, AfterViewInit {
  private canvasRef = viewChild.required<HTMLCanvasElement | ElementRef<HTMLCanvasElement>>('canvasEl');
  
  private particles: Particle[] = [];
  private numParticles = 75;
  private maxDistance = 115;
  private mouseX = -1000;
  private mouseY = -1000;
  private animationFrameId?: number;

  ngOnInit() {
    // Initialize particles density based on viewport dimensions
    this.initParticles();
  }

  ngAfterViewInit() {
    this.setupCanvasSize();
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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private onResize = () => {
    this.setupCanvasSize();
    this.initParticles();
  };

  private initParticles() {
    this.particles = [];
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Density calculation to run efficiently on high-res monitors
    this.numParticles = Math.min(80, Math.floor((width * height) / 16000));

    for (let i = 0; i < this.numParticles; i++) {
      const radius = Math.random() * 1.8 + 0.8;
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: radius,
        baseRadius: radius
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

    // Update physics loop & render particle nodes
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Bounce vectors on boundaries
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Cursor gravity math
      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 220) {
        // Soft suction pull toward mouse location
        const force = (220 - dist) / 2200;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
        // Nodes swell as they approach pointer focus
        p.radius = p.baseRadius + (220 - dist) / 45;
      } else {
        p.radius = p.baseRadius;
        // Damping velocities back to standard slow drift speed limit
        const limit = 0.7;
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (currentSpeed > limit) {
          p.vx *= 0.94;
          p.vy *= 0.94;
        }
      }

      // Draw glowing nodes
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      
      if (dist < 220) {
        ctx.fillStyle = 'rgba(255, 111, 67, 0.85)';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ff6f43';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.shadowBlur = 0;
      }
      
      ctx.fill();
      ctx.shadowBlur = 0; // reset shadow state immediately
    });

    // Draw connection lines
    for (let i = 0; i < this.particles.length; i++) {
      const p1 = this.particles[i];
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.maxDistance) {
          const alpha = (1 - dist / this.maxDistance) * 0.16;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          
          // Connectors near cursor highlight in terracotta color and widen stroke
          const mouseDist1 = Math.sqrt((this.mouseX - p1.x) ** 2 + (this.mouseY - p1.y) ** 2);
          if (mouseDist1 < 200) {
            ctx.strokeStyle = `rgba(255, 111, 67, ${alpha * 2.2})`;
            ctx.lineWidth = 1.3;
          } else {
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.7;
          }
          ctx.stroke();
        }
      }
    }
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

  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent) {
    // Send a blast force ripple from mouse click coordinate
    this.particles.forEach(p => {
      const dx = p.x - event.clientX;
      const dy = p.y - event.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 260) {
        const force = (260 - dist) / 12;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    });
  }
}
