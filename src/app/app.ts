import { Component, signal, HostListener, OnInit, AfterViewInit, OnDestroy, ElementRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cursor } from './components/cursor/cursor';
import { Preloader } from './components/preloader/preloader';
import { LiquidBg } from './components/liquid-bg/liquid-bg';
import { MagneticDirective } from './directives/magnetic';
import { ParallaxDirective } from './directives/parallax';
import { GlitchDirective } from './directives/glitch';
import { gsap } from 'gsap';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  speed: number;
  phase: number;
  color: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cursor, Preloader, LiquidBg, MagneticDirective, ParallaxDirective, GlitchDirective],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  isLoaded = signal(false);

  // Live HUD Telemetry Signals
  cpuTemp = signal<string>('42.8');
  heapUsage = signal<string>('34.2');
  netLatency = signal<number>(14);
  addrHex = signal<string>('0x8F4C');
  private telemetryInterval?: any;

  // Floating particles properties
  private particles: Particle[] = [];
  private numParticles = 75;
  private animFrameId?: number;
  private canvasEl?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D | null;
  private mouse = { x: -1000, y: -1000 };
  
  // Scroll speed tracking
  private lastScrollY = 0;
  private scrollVelocity = 0;

  ngOnInit() {
    this.lastScrollY = window.scrollY;
    this.startTelemetryUpdates();
  }

  ngAfterViewInit() {
    this.initParticlesCanvas();
    this.updateScrollProgress();
  }

  ngOnDestroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.telemetryInterval) {
      clearInterval(this.telemetryInterval);
    }
  }

  private startTelemetryUpdates() {
    this.telemetryInterval = setInterval(() => {
      const temp = (41 + Math.random() * 5).toFixed(1);
      this.cpuTemp.set(temp);

      const heap = (32 + Math.random() * 6).toFixed(1);
      this.heapUsage.set(heap);

      const lat = Math.floor(10 + Math.random() * 12);
      this.netLatency.set(lat);

      const hexAddresses = ['0x8F4C', '0x9E2A', '0x7B1D', '0xAC5E', '0x3D8B', '0x6C9F'];
      const randAddr = hexAddresses[hexAddresses.length - 1 - Math.floor(Math.random() * hexAddresses.length)];
      this.addrHex.set(randAddr);
    }, 1000);
  }

  private initParticlesCanvas() {
    this.canvasEl = this.el.nativeElement.querySelector('#canvas-particles') as HTMLCanvasElement;
    if (!this.canvasEl) return;
    this.ctx = this.canvasEl.getContext('2d');
    
    this.resizeCanvas();
    this.generateParticles();
    this.animateParticles();
  }

  private resizeCanvas = () => {
    if (!this.canvasEl) return;
    this.canvasEl.width = window.innerWidth * window.devicePixelRatio;
    this.canvasEl.height = window.innerHeight * window.devicePixelRatio;
    this.canvasEl.style.width = `${window.innerWidth}px`;
    this.canvasEl.style.height = `${window.innerHeight}px`;
  };

  private generateParticles() {
    if (!this.canvasEl) return;
    const w = this.canvasEl.width / window.devicePixelRatio;
    const h = this.canvasEl.height / window.devicePixelRatio;
    this.particles = [];

    for (let i = 0; i < this.numParticles; i++) {
      const isGold = Math.random() > 0.35;
      const size = Math.random() * 2.5 + 0.6;
      const color = isGold ? '255, 59, 48' : '241, 245, 249'; // Crimson Amber or Pure Steel
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size,
        alpha: Math.random() * 0.4 + 0.1,
        speed: Math.random() * 0.15 + 0.05,
        phase: Math.random() * 100,
        color
      });
    }
  }

  private animateParticles() {
    const loop = () => {
      if (!this.ctx || !this.canvasEl) return;
      
      const w = this.canvasEl.width / window.devicePixelRatio;
      const h = this.canvasEl.height / window.devicePixelRatio;

      this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      this.ctx.save();
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Track scroll velocity decay
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - this.lastScrollY;
      this.scrollVelocity += (diff * 0.08 - this.scrollVelocity) * 0.1;
      this.lastScrollY = currentScrollY;
      this.scrollVelocity *= 0.94;

      this.particles.forEach(p => {
        // Drift angle using wave calculations
        const time = Date.now() * 0.0004;
        const driftAngle = Math.sin(p.x * 0.015 + time + p.phase) * Math.cos(p.y * 0.015 - time);
        
        let targetVx = Math.cos(driftAngle) * p.speed;
        let targetVy = Math.sin(driftAngle) * p.speed + this.scrollVelocity * 0.15;

        // Repel from mouse
        if (this.mouse.x !== -1000) {
          const dx = p.x - this.mouse.x;
          const dy = p.y - this.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repelRadius = 150;
          if (dist < repelRadius) {
            const force = (repelRadius - dist) / repelRadius;
            targetVx += (dx / dist) * force * 0.7;
            targetVy += (dy / dist) * force * 0.7;
          }
        }

        // Apply velocities
        p.vx += (targetVx - p.vx) * 0.08;
        p.vy += (targetVy - p.vy) * 0.08;
        
        p.x += p.vx;
        p.y += p.vy;

        // Boundary wrapping
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Render particle
        this.ctx!.beginPath();
        const vel = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        
        // Stretch particle into a streak if moving fast
        if (vel > 1.0) {
          const angle = Math.atan2(p.vy, p.vx);
          this.ctx!.ellipse(
            p.x, p.y, 
            p.size * 0.7, 
            p.size * (1 + vel * 0.4), 
            angle + Math.PI / 2, 
            0, Math.PI * 2
          );
        } else {
          this.ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }

        this.ctx!.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        this.ctx!.shadowBlur = vel > 1.2 ? 6 : 0;
        this.ctx!.shadowColor = `rgba(${p.color}, ${p.alpha * 0.5})`;
        this.ctx!.fill();
      });

      this.ctx.restore();
      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
    this.generateParticles();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;

    if (!this.isLoaded()) return;

    const grid = document.querySelector('.bg-grid-perspective') as HTMLElement;
    if (grid) {
      const nx = (event.clientX / window.innerWidth) - 0.5;
      const ny = (event.clientY / window.innerHeight) - 0.5;

      // Shift grid in 2D (no 3D tilts)
      const shiftX = nx * 30;
      const shiftY = ny * 30;

      gsap.to(grid, {
        x: shiftX,
        y: shiftY,
        duration: 0.85,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  }

  @HostListener('window:mouseleave')
  onMouseLeave() {
    this.mouse.x = -1000;
    this.mouse.y = -1000;
  }

  @HostListener('window:scroll')
  onScroll() {
    this.updateScrollProgress();
  }

  private updateScrollProgress() {
    const progressBar = this.el.nativeElement.querySelector('.scroll-progress-bar') as HTMLElement;
    if (!progressBar) return;
    
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    const pct = (window.scrollY / docHeight) * 100;
    progressBar.style.width = `${pct}%`;

    // Also update the vertical HUD track progress height
    const verticalProgress = this.el.nativeElement.querySelector('.scroll-track-progress') as HTMLElement;
    if (verticalProgress) {
      verticalProgress.style.height = `${pct}%`;
    }
  }

  onPreloaderFinished() {
    this.isLoaded.set(true);
    
    // Dispatch system-wide loaded event to synchronize Home page's entrance timeline
    document.dispatchEvent(new CustomEvent('app-loaded'));
    
    // Staggered load-in sequence for navigation bar and side-deck sidebars
    setTimeout(() => {
      const header = document.querySelector('.editorial-header') as HTMLElement;
      const logo = document.querySelector('.header-logo') as HTMLElement;
      const links = document.querySelectorAll('.nav-link');
      const leftSidebar = document.querySelector('.hud-sidebar-left') as HTMLElement;
      const rightSidebar = document.querySelector('.hud-sidebar-right') as HTMLElement;
      
      if (header) {
        // Prepare initial states
        gsap.set(header, { y: -80, opacity: 0 });
        gsap.set([logo, ...Array.from(links)], { y: -15, opacity: 0 });
        
        if (leftSidebar) gsap.set(leftSidebar, { x: -80, opacity: 0 });
        if (rightSidebar) gsap.set(rightSidebar, { x: 80, opacity: 0 });
        
        // Execute timelines
        const tl = gsap.timeline();
        
        // 1. Slide and fade sidebars first to frame the viewport
        if (leftSidebar && rightSidebar) {
          tl.to([leftSidebar, rightSidebar], {
            x: 0,
            opacity: 1,
            duration: 1.15,
            ease: 'power3.out',
            stagger: 0.12
          }, 0);
        }

        // 2. Animate central capsule header
        tl.to(header, {
          y: 0,
          opacity: 1,
          duration: 0.95,
          ease: 'power4.out'
        }, 0.3);

        // 3. Stagger nav items reveal
        tl.to([logo, ...Array.from(links)], {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.07,
          ease: 'power3.out'
        }, '-=0.55');
      }
    }, 40);
  }
}
