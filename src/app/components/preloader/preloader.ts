import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, viewChild, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preloader.html',
  styleUrl: './preloader.css',
})
export class Preloader implements OnInit, OnDestroy, AfterViewInit {
  private loaderBg = viewChild.required<ElementRef<HTMLDivElement>>('loaderBg');
  private centerAssembly = viewChild.required<ElementRef<HTMLDivElement>>('centerAssembly');
  private progressCircle = viewChild.required<ElementRef<SVGCircleElement>>('progressCircle');
  private monogramPath = viewChild<ElementRef<SVGPathElement>>('monogramPath');
  private monogramLetter = viewChild<ElementRef<HTMLDivElement>>('monogramLetter');
  private statusTerminal = viewChild.required<ElementRef<HTMLDivElement>>('statusTerminal');
  private progressBar = viewChild.required<ElementRef<HTMLDivElement>>('progressBar');
  private percentText = viewChild.required<ElementRef<HTMLSpanElement>>('percentText');
  private glitchOverlay = viewChild.required<ElementRef<HTMLDivElement>>('glitchOverlay');
  private loaderFlash = viewChild.required<ElementRef<HTMLDivElement>>('loaderFlash');
  private laserSwipe = viewChild.required<ElementRef<HTMLDivElement>>('laserSwipe');
  private loaderCanvas = viewChild<ElementRef<HTMLCanvasElement>>('loaderCanvas');

  loaded = output<void>();
  private animFrameId?: number;

  ngOnInit() {
    // Freeze scroll during loading sequence
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    // Safely restore scrolling behavior when preloader is removed from DOM
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  ngAfterViewInit() {
    const canvasEl = this.loaderCanvas()?.nativeElement;
    if (canvasEl) this.setupQuantumVortexCanvas(canvasEl);

    this.runPreloaderTimeline();

    // Fail-safe to ensure scroll is ALWAYS restored and preloader is hidden even if animations clash
    setTimeout(() => {
      const bg = this.loaderBg().nativeElement;
      if (bg && bg.style.display !== 'none') {
        console.warn('Preloader fail-safe triggered to prevent page freeze.');
        gsap.killTweensOf([bg, this.centerAssembly().nativeElement]);
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        this.loaded.emit();
        gsap.to(bg, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            bg.style.display = 'none';
          }
        });
      }
    }, 4500);
  }

  private runPreloaderTimeline() {
    const bg = this.loaderBg().nativeElement;
    const assembly = this.centerAssembly().nativeElement;
    const circle = this.progressCircle().nativeElement;
    const monogram = this.monogramPath()?.nativeElement;
    const monogramLetterEl = this.monogramLetter()?.nativeElement;
    const terminal = this.statusTerminal().nativeElement;
    const progressBarEl = this.progressBar().nativeElement;
    const percentSpan = this.percentText().nativeElement;
    const overlay = this.glitchOverlay().nativeElement;
    const flash = this.loaderFlash().nativeElement;
    const laserSwipe = this.laserSwipe().nativeElement;

    // SVG parameters - safe retrieval without baseVal error risks
    const circleRadius = Number(circle.getAttribute('r') || 56);
    const circleCircumference = circleRadius * 2 * Math.PI;
    
    // Set initial dasharray & dashoffset for rings
    circle.style.strokeDasharray = `${circleCircumference} ${circleCircumference}`;
    circle.style.strokeDashoffset = `${circleCircumference}`;

    // SVG monogram path length
    const monogramLength = monogram ? (monogram.getTotalLength() || 450) : 0;
    if (monogram) {
      monogram.style.strokeDasharray = `${monogramLength} ${monogramLength}`;
      monogram.style.strokeDashoffset = `${monogramLength}`;
    }

    // Micro-terminal log feed definition tailored for Eshwar J.
    const logs = [
      { pct: 5, text: 'ARCHITECT // ESHWAR J. BOOTSTRAP' },
      { pct: 14, text: 'SYS: INITIALIZING HIGH-PERFORMANCE ENGINE' },
      { pct: 24, text: 'STACK: ANGULAR 19 // SIGNAL REACTIVITY' },
      { pct: 34, text: 'CLUSTER: GOLANG MICROSERVICES ONLINE' },
      { pct: 44, text: 'AI: GEMINI HYBRID INTELLIGENCE PIPELINE' },
      { pct: 54, text: 'DATABASE: POSTGRES & REDIS L2 CACHE' },
      { pct: 65, text: 'K8S: MULTI-REGION TELEMETRY SYNCED' },
      { pct: 76, text: 'UI/UX: 2D GLASSMORPHIC HUD COMPASS READY' },
      { pct: 86, text: 'SECURITY: ZERO-TRUST HANDSHAKE VERIFIED' },
      { pct: 95, text: 'SYS: ARCHITECT CONTROL DECK INITIALIZED' },
      { pct: 100, text: 'WELCOME TO ESHWAR J. PORTFOLIO // 60 FPS' }
    ];

    let logIndex = 0;
    
    // Clear initial placeholder log in template
    terminal.innerHTML = '';

    const countObj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        this.triggerShutterExit(bg, assembly, flash, laserSwipe);
      }
    });

    // 1. Progress bar animate width from 0 to 100%
    tl.to(countObj, {
      val: 100,
      duration: 3.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        const rounded = Math.floor(countObj.val);
        
        // Render digit with occasional digital noise glitch
        if (Math.random() < 0.08 && rounded < 100) {
          const hexChars = '0123456789ABCDEF';
          const glitchStr = hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)];
          percentSpan.textContent = glitchStr;
        } else {
          percentSpan.textContent = rounded < 10 ? `0${rounded}` : `${rounded}`;
        }
        
        progressBarEl.style.width = `${rounded}%`;

        // SVG progress offset fill
        const offset = circleCircumference - (rounded / 100) * circleCircumference;
        circle.style.strokeDashoffset = `${offset}`;

        // SVG monogram draw fill
        if (monogram) {
          const monoOffset = monogramLength - (rounded / 100) * monogramLength;
          monogram.style.strokeDashoffset = `${monoOffset}`;
        }
        
        // Append log elements dynamically based on thresholds
        while (logIndex < logs.length && rounded >= logs[logIndex].pct) {
          const logLine = document.createElement('div');
          logLine.className = 'hud-log-line';
          logLine.textContent = `> ${logs[logIndex].text}`;
          terminal.appendChild(logLine);
          
          // Keep only the last 4 log lines visible to mimic a real rolling terminal screen
          while (terminal.childNodes.length > 4) {
            terminal.removeChild(terminal.firstChild!);
          }
          
          terminal.scrollTop = terminal.scrollHeight;
          logIndex++;
        }
      }
    }, 0);

    if (monogramLetterEl) {
      tl.to(monogramLetterEl, {
        opacity: 1,
        duration: 0.65,
        ease: 'power2.out'
      }, 2.4);
    }

    // Random micro-glitch overlay triggers
    const triggerMicroGlitch = () => {
      if (Math.random() < 0.06 && countObj.val < 100) {
        overlay.style.opacity = (Math.random() * 0.12).toString();
        setTimeout(() => {
          overlay.style.opacity = '0';
        }, 40 + Math.random() * 60);
      }
      if (countObj.val < 100) {
        setTimeout(triggerMicroGlitch, 150);
      }
    };
    triggerMicroGlitch();
  }

  private triggerShutterExit(bg: HTMLElement, assembly: HTMLElement, flash: HTMLElement, laserSwipe: HTMLElement) {
    const exitTl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        this.loaded.emit();
        bg.style.display = 'none';
      }
    });

    // 1. Digital energy burst flash overlay
    exitTl.to(flash, {
      opacity: 0.95,
      duration: 0.08,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    }, 0);

    // 2. High-speed zoom portal zoom-out animation
    exitTl.to(assembly, {
      scale: 5.5,
      filter: 'blur(20px)',
      opacity: 0,
      duration: 1.0,
      ease: 'power3.in'
    }, 0.04);

    // 3. Laser swipe sweep down screen (cinematic transition)
    exitTl.fromTo(laserSwipe,
      { y: -50, opacity: 0 },
      { y: window.innerHeight + 50, opacity: 1, duration: 1.0, ease: 'power3.inOut' },
      0.02
    );

    // Fade out laser swipe at the very end
    exitTl.to(laserSwipe, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in'
    }, 0.75);

    // Fade out parent loader container with slight scale up expansion
    exitTl.to(bg, {
      scale: 1.05,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.inOut'
    }, 0.4);
  }

  // Background Quantum Swirl Particle Vortex Canvas
  private setupQuantumVortexCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);

    const particleCount = 80;
    const particles: { angle: number; radius: number; speed: number; size: number; alpha: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 80 + Math.random() * 320,
        speed: 0.005 + Math.random() * 0.015,
        size: 1.2 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.6
      });
    }

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      const centerX = w / 2;
      const centerY = h / 2;

      // Draw spiral particle vortex
      for (const p of particles) {
        p.angle += p.speed;
        p.radius -= 0.25;
        if (p.radius < 40) {
          p.radius = 320 + Math.random() * 50;
        }

        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * p.radius;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197, 168, 128, ${p.alpha * (p.radius / 320)})`;
        ctx.shadowColor = 'rgba(197, 168, 128, 0.8)';
        ctx.shadowBlur = 10;
        ctx.fill();

        // Connect nearby particles with subtle laser neural threads
        for (const other of particles) {
          const ox = centerX + Math.cos(other.angle) * other.radius;
          const oy = centerY + Math.sin(other.angle) * other.radius;
          const dist = Math.hypot(x - ox, y - oy);
          if (dist < 40) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(ox, oy);
            ctx.strokeStyle = `rgba(197, 168, 128, ${0.12 * (1 - dist / 40)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.restore();
      this.animFrameId = requestAnimationFrame(draw);
    };

    this.animFrameId = requestAnimationFrame(draw);
  }
}