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
  private monogramPath = viewChild.required<ElementRef<SVGPathElement>>('monogramPath');
  private monogramLetter = viewChild.required<ElementRef<HTMLDivElement>>('monogramLetter');
  private statusTerminal = viewChild.required<ElementRef<HTMLDivElement>>('statusTerminal');
  private progressBar = viewChild.required<ElementRef<HTMLDivElement>>('progressBar');
  private percentText = viewChild.required<ElementRef<HTMLSpanElement>>('percentText');
  private glitchOverlay = viewChild.required<ElementRef<HTMLDivElement>>('glitchOverlay');
  private loaderFlash = viewChild.required<ElementRef<HTMLDivElement>>('loaderFlash');
  private laserSwipe = viewChild.required<ElementRef<HTMLDivElement>>('laserSwipe');

  loaded = output<void>();
  private animFrameId?: number;

  ngOnInit() {
    // Freeze scroll during loading sequence
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    // Safely restore scrolling behavior when preloader is removed from DOM
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  ngAfterViewInit() {
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
    const monogram = this.monogramPath().nativeElement;
    const monogramLetterEl = this.monogramLetter().nativeElement;
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
    const monogramLength = monogram.getTotalLength() || 450;
    monogram.style.strokeDasharray = `${monogramLength} ${monogramLength}`;
    monogram.style.strokeDashoffset = `${monogramLength}`;

    // Micro-terminal log feed definition
    const logs = [
      { pct: 5, text: 'SYS: CONNECTING TO DISTRIBUTED NODE...' },
      { pct: 12, text: 'SYS: SOCKET ESTABLISHED // PORT 443' },
      { pct: 20, text: 'MONGO: INGESTING SCHEMA DEFINITIONS' },
      { pct: 28, text: 'DB: CLIENT POOL ONLINE (12 NODES)' },
      { pct: 36, text: 'CACHE: RESOLVING GRAPH COMPACT' },
      { pct: 45, text: 'WEBGL: CONTEXT LOADED SUCCESS' },
      { pct: 54, text: 'SHADER: COMPILING VERTEX_GLSL... OK' },
      { pct: 63, text: 'SHADER: COMPILING FRAGMENT_GLSL... OK' },
      { pct: 72, text: 'SYS: MOUNTING CLIENT ROUTER TREE' },
      { pct: 80, text: 'HYDRATING: ASSETS PRE-CACHING' },
      { pct: 90, text: 'SYS: BOOTING INTERACTION ENGINE' },
      { pct: 97, text: 'SYS: CORE ONLINE // PORTFOLIO READY' }
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
        const monoOffset = monogramLength - (rounded / 100) * monogramLength;
        monogram.style.strokeDashoffset = `${monoOffset}`;
        
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

    // Fade in filled monogram letter letter at 85% progress
    tl.to(monogramLetterEl, {
      opacity: 1,
      duration: 0.65,
      ease: 'power2.out'
    }, 2.4);

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
}