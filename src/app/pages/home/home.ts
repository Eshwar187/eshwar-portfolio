import { Component, signal, AfterViewInit, OnDestroy, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassOrb } from '../../components/glass-orb/glass-orb';
import { MagneticDirective } from '../../directives/magnetic';
import { TextRevealDirective } from '../../directives/text-reveal';
import { StaggerRevealDirective } from '../../directives/stagger-reveal';
import { InteractiveTextDirective } from '../../directives/interactive-text';
import { ParallaxDirective } from '../../directives/parallax';
import { ScrollDrawDirective } from '../../directives/scroll-draw';
import { DecodeTextDirective } from '../../directives/decode-text';
import { GlitchDirective } from '../../directives/glitch';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  tech: string[];
  link: string;
}

interface SkillNode {
  id: string;
  name: string;
  category: string;
  level: number;
  stack: string[];
  latency: number;
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
  screenX: number;
  screenY: number;
  projectedScale: number;
  projectedAlpha: number;
  radius: number;
  baseRadius: number;
  isHovered: boolean;
  rx: number;
  ry: number;
  seedX: number;
  seedY: number;
  color: string;
}

import { ArchitectureSimulator } from '../../components/architecture-simulator/architecture-simulator';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    GlassOrb,
    ArchitectureSimulator,
    MagneticDirective, 
    TextRevealDirective,
    StaggerRevealDirective,
    InteractiveTextDirective,
    ParallaxDirective,
    ScrollDrawDirective,
    DecodeTextDirective,
    GlitchDirective
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit, OnDestroy {
  selectedProject = signal<Project | null>(null);
  formState = signal<'idle' | 'submitting' | 'success'>('idle');
  hoveredSkillNode = signal<SkillNode | null>(null);
  skillNodes: SkillNode[] = [];
  activeLogs = signal<string[]>([]);
  currentTimeStr = signal<string>('');
  
  // Project Hover Decryption Logs
  project1Logs = signal<string[]>([]);
  project2Logs = signal<string[]>([]);
  formLogs = signal<string[]>([]);
  private projectHoverTimers: any[] = [];
  private idleLogsInterval?: any;
  private hoverLogsTimeout: any[] = [];
  private clockInterval?: any;

  // Developer Analytics State
  isSyncing = signal(false);
  syncLogs = signal<string[]>([]);
  hoveredTile = signal<any>(null);
  contributionTiles = signal<any[]>([]);
  tooltipX = 0;
  tooltipY = 0;

  // GitHub Real-Time Data Signals
  githubYTD = signal<number>(2842);
  githubActiveRepos = signal<number>(111);
  githubStreak = signal<number>(54);
  developerBio = signal<string>('Designing low-latency distributed systems, high-performance web components & rich physics-based user interfaces.');

  private langGoCircle = viewChild<ElementRef<SVGCircleElement>>('langGoCircle');
  private langTsCircle = viewChild<ElementRef<SVGCircleElement>>('langTsCircle');
  private langRustCircle = viewChild<ElementRef<SVGCircleElement>>('langRustCircle');
  private leetEasyCircle = viewChild<ElementRef<SVGCircleElement>>('leetEasyCircle');
  private leetMedCircle = viewChild<ElementRef<SVGCircleElement>>('leetMedCircle');
  private leetHardCircle = viewChild<ElementRef<SVGCircleElement>>('leetHardCircle');
  private leetSolvedText = viewChild<ElementRef<HTMLSpanElement>>('leetSolvedText');
  private heatmapGridEl = viewChild<ElementRef<HTMLDivElement>>('heatmapGrid');
  private contribTotalEl = viewChild<ElementRef<HTMLSpanElement>>('contribTotal');

  constructor() {
    this.initializeContributions();
    this.initializeTelemetryLogs();
    this.initLiveClock();
    this.fetchGitHubData();
  }

  private initLiveClock() {
    const updateTime = () => {
      const now = new Date();
      const pad = (n: number) => n < 10 ? '0' + n : n;
      const hrs = pad(now.getHours());
      const mins = pad(now.getMinutes());
      const secs = pad(now.getSeconds());
      this.currentTimeStr.set(`${hrs}:${mins}:${secs}`);
    };
    updateTime();
    this.clockInterval = setInterval(updateTime, 1000);
  }

  private initializeTelemetryLogs() {
    this.activeLogs.set([
      'active connection nodes: 19',
      'memory allocation map check: OK',
      'Aether connection sweeps: active'
    ]);
    this.startIdleLogs();
  }

  private startIdleLogs() {
    if (this.idleLogsInterval) {
      clearInterval(this.idleLogsInterval);
    }
    
    const randomIdleLogs = [
      'SYS // diagnostics check: nominal',
      'MEM // active heap allocation: ok',
      'NET // link load 1.14 Gb/s // status: stable',
      'HUD // canvas render rate: 60 FPS',
      'SEC // security handshake complete // TLS 1.3',
      'ENV // compilation caching: active',
      'AETHER // scanning interaction nodes...',
      'DB // client pool sync: complete',
      'CACHE // indexing query hash maps: active'
    ];

    this.idleLogsInterval = setInterval(() => {
      if (this.hoveredSkillNode()) return;

      const current = this.activeLogs();
      const nextLog = randomIdleLogs[Math.floor(Math.random() * randomIdleLogs.length)];
      
      const nextList = [...current.slice(-2), nextLog];
      this.activeLogs.set(nextList);
    }, 2800);
  }

  private initializeContributions() {
    const tiles = [];
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 370);
    
    for (let i = 0; i <= 370; i++) {
      const current = new Date(start);
      current.setDate(start.getDate() + i);
      const dateString = current.toISOString().split('T')[0];
      
      const r = Math.random();
      let count = 0;
      let level = 0;
      
      if (r > 0.45) {
        if (r < 0.75) {
          count = Math.floor(Math.random() * 3) + 1;
          level = 1;
        } else if (r < 0.9) {
          count = Math.floor(Math.random() * 3) + 4;
          level = 2;
        } else if (r < 0.98) {
          count = Math.floor(Math.random() * 4) + 7;
          level = 3;
        } else {
          count = Math.floor(Math.random() * 6) + 11;
          level = 4;
        }
      }
      
      tiles.push({ date: dateString, count, level });
    }
    
    this.contributionTiles.set(tiles);
  }

  async fetchGitHubData() {
    try {
      // 1. Fetch profile details (repos & bio)
      const userRes = await fetch('https://api.github.com/users/Eshwar187');
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.public_repos !== undefined) {
          this.githubActiveRepos.set(userData.public_repos);
        }
        if (userData.bio) {
          this.developerBio.set(userData.bio);
        }
      }

      // 2. Fetch contributions calendar (YTD commits & tiles & streak)
      const contribRes = await fetch('https://github-contributions-api.deno.dev/Eshwar187.json');
      if (contribRes.ok) {
        const contribData = await contribRes.json();
        
        if (contribData.totalContributions !== undefined) {
          this.githubYTD.set(contribData.totalContributions);
        } else if (contribData.total !== undefined) {
          this.githubYTD.set(contribData.total.lastYear || contribData.total);
        }

        if (contribData.contributions && Array.isArray(contribData.contributions)) {
          const flattenedDays = contribData.contributions.flatMap((week: any) => week);
          
          // Sort chronologically
          flattenedDays.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

          const tiles = flattenedDays.map((day: any) => {
            let lvl = 0;
            if (day.contributionLevel === 'FIRST_QUARTILE') lvl = 1;
            else if (day.contributionLevel === 'SECOND_QUARTILE') lvl = 2;
            else if (day.contributionLevel === 'THIRD_QUARTILE') lvl = 3;
            else if (day.contributionLevel === 'FOURTH_QUARTILE') lvl = 4;
            else if (day.contributionLevel === 'NONE') lvl = 0;
            else {
              if (day.contributionCount > 10) lvl = 4;
              else if (day.contributionCount > 5) lvl = 3;
              else if (day.contributionCount > 2) lvl = 2;
              else if (day.contributionCount > 0) lvl = 1;
            }
            return {
              date: day.date,
              count: day.contributionCount || 0,
              level: lvl
            };
          });

          this.contributionTiles.set(tiles.slice(-371));

          // Calculate longest active streak
          let currentStreak = 0;
          let longestStreak = 0;
          for (const tile of tiles) {
            if (tile.count > 0) {
              currentStreak++;
              if (currentStreak > longestStreak) {
                longestStreak = currentStreak;
              }
            } else {
              currentStreak = 0;
            }
          }
          this.githubStreak.set(longestStreak);
        }
      }
    } catch (err) {
      console.warn('Failed to retrieve live GitHub metrics, relying on fallback.', err);
    }
  }

  updateTooltipPos(event: MouseEvent) {
    const grid = this.heatmapGridEl()?.nativeElement;
    if (grid) {
      const card = grid.closest('.heatmap-container-wrapper') as HTMLElement;
      if (card) {
        const cardRect = card.getBoundingClientRect();
        this.tooltipX = event.clientX - cardRect.left;
        this.tooltipY = event.clientY - cardRect.top;
      }
    }
  }

  async syncLiveFeed() {
    if (this.isSyncing()) return;
    this.isSyncing.set(true);
    this.syncLogs.set([]);

    const totalEl = this.contribTotalEl()?.nativeElement;
    const leetEl = this.leetSolvedText()?.nativeElement;
    const gridEl = this.heatmapGridEl()?.nativeElement;
    
    const goCircle = this.langGoCircle()?.nativeElement;
    const tsCircle = this.langTsCircle()?.nativeElement;
    const rustCircle = this.langRustCircle()?.nativeElement;

    const easyC = this.leetEasyCircle()?.nativeElement;
    const medC = this.leetMedCircle()?.nativeElement;
    const hardC = this.leetHardCircle()?.nativeElement;

    const addLog = (msg: string) => {
      this.syncLogs.update(prev => [...prev, msg]);
    };

    addLog('Establishing connection to api.github.com...');
    await new Promise(resolve => setTimeout(resolve, 220));
    addLog('Connection secured // SSL Handshake successful');
    await new Promise(resolve => setTimeout(resolve, 220));
    addLog('Querying repository logs for user: Eshwar187...');

    let profileFetched = false;
    let contribsFetched = false;
    let fetchedRepos = this.githubActiveRepos();
    let fetchedYTD = this.githubYTD();
    let fetchedStreak = this.githubStreak();
    let fetchedBio = this.developerBio();
    let fetchedTiles = this.contributionTiles();

    try {
      const userRes = await fetch('https://api.github.com/users/Eshwar187');
      if (userRes.ok) {
        const userData = await userRes.json();
        fetchedRepos = userData.public_repos ?? fetchedRepos;
        fetchedBio = userData.bio ?? fetchedBio;
        profileFetched = true;
        addLog(`> Fetch user profile success // public_repos: ${fetchedRepos}`);
      } else {
        addLog(`> Fetch user profile warning: status ${userRes.status}`);
      }
    } catch (e: any) {
      addLog(`> Fetch user profile error: ${e.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 220));
    addLog('Querying contributions endpoint from deno.dev...');

    try {
      const contribRes = await fetch('https://github-contributions-api.deno.dev/Eshwar187.json');
      if (contribRes.ok) {
        const contribData = await contribRes.json();
        fetchedYTD = contribData.totalContributions ?? (contribData.total?.lastYear ?? fetchedYTD);
        
        if (contribData.contributions && Array.isArray(contribData.contributions)) {
          const flattenedDays = contribData.contributions.flatMap((week: any) => week);
          flattenedDays.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          const tiles = flattenedDays.map((day: any) => {
            let lvl = 0;
            if (day.contributionLevel === 'FIRST_QUARTILE') lvl = 1;
            else if (day.contributionLevel === 'SECOND_QUARTILE') lvl = 2;
            else if (day.contributionLevel === 'THIRD_QUARTILE') lvl = 3;
            else if (day.contributionLevel === 'FOURTH_QUARTILE') lvl = 4;
            return {
              date: day.date,
              count: day.contributionCount || 0,
              level: lvl
            };
          });

          fetchedTiles = tiles.slice(-371);

          let currentStreak = 0;
          let longestStreak = 0;
          for (const tile of tiles) {
            if (tile.count > 0) {
              currentStreak++;
              if (currentStreak > longestStreak) {
                longestStreak = currentStreak;
              }
            } else {
              currentStreak = 0;
            }
          }
          fetchedStreak = longestStreak;
          contribsFetched = true;
          addLog(`> Ingestion success // YTD: ${fetchedYTD} commits // Streak: ${fetchedStreak} days`);
        }
      } else {
        addLog(`> Contributions query warning: status ${contribRes.status}`);
      }
    } catch (e: any) {
      addLog(`> Contributions query error: ${e.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 220));
    addLog('Processing telemetry metrics and layout grids...');
    await new Promise(resolve => setTimeout(resolve, 220));
    addLog('Updating contribution node mapping...');
    await new Promise(resolve => setTimeout(resolve, 220));
    addLog('[SUCCESS] Real-time repository synchronization complete.');

    const oldYTD = this.githubYTD();
    const oldStreak = this.githubStreak();
    const oldRepos = this.githubActiveRepos();

    this.githubYTD.set(fetchedYTD);
    this.githubActiveRepos.set(fetchedRepos);
    this.githubStreak.set(fetchedStreak);
    this.developerBio.set(fetchedBio);
    this.contributionTiles.set(fetchedTiles);

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          this.isSyncing.set(false);
          this.syncLogs.set([]);
        }, 1500);
      }
    });

    if (totalEl) {
      const valObj = { val: oldYTD };
      tl.to(valObj, {
        val: fetchedYTD,
        duration: 1.8,
        ease: 'power1.inOut',
        onUpdate: () => {
          totalEl.textContent = Math.floor(valObj.val + Math.random() * 12 - 6).toString();
        },
        onComplete: () => {
          totalEl.textContent = fetchedYTD.toLocaleString();
        }
      }, 0);
    }

    if (leetEl) {
      const valObj = { val: 642 };
      tl.to(valObj, {
        val: 648,
        duration: 1.8,
        ease: 'power1.inOut',
        onUpdate: () => {
          leetEl.textContent = Math.floor(valObj.val + Math.random() * 10 - 5).toString();
        },
        onComplete: () => {
          leetEl.textContent = '648';
        }
      }, 0);
    }

    if (goCircle && tsCircle && rustCircle) {
      tl.to(goCircle, { strokeDashoffset: 314.16, duration: 0.6, ease: 'power2.in' }, 0);
      tl.to(tsCircle, { strokeDashoffset: 251.33, duration: 0.6, ease: 'power2.in' }, 0.05);
      tl.to(rustCircle, { strokeDashoffset: 188.50, duration: 0.6, ease: 'power2.in' }, 0.1);

      tl.to(goCircle, { strokeDashoffset: 314.16 * (1 - 0.47), duration: 1.2, ease: 'elastic.out(1, 0.75)' }, 0.6);
      tl.to(tsCircle, { strokeDashoffset: 251.33 * (1 - 0.36), duration: 1.2, ease: 'elastic.out(1, 0.75)' }, 0.65);
      tl.to(rustCircle, { strokeDashoffset: 188.50 * (1 - 0.12), duration: 1.2, ease: 'elastic.out(1, 0.75)' }, 0.7);
    }

    if (easyC && medC && hardC) {
      tl.to([easyC, medC, hardC], { strokeDasharray: '0 238.76', duration: 0.6, ease: 'power2.in' }, 0);
      
      tl.to(easyC, { strokeDasharray: '88.43 238.76', strokeDashoffset: 0, duration: 1.2, ease: 'elastic.out(1, 0.75)' }, 0.6);
      tl.to(medC, { strokeDasharray: '117.16 238.76', strokeDashoffset: -88.43, duration: 1.2, ease: 'elastic.out(1, 0.75)' }, 0.65);
      tl.to(hardC, { strokeDasharray: '33.16 238.76', strokeDashoffset: -205.59, duration: 1.2, ease: 'elastic.out(1, 0.75)' }, 0.7);
    }

    if (gridEl) {
      const tiles = Array.from(gridEl.querySelectorAll('.heatmap-tile')) as HTMLElement[];
      tl.to(tiles, {
        opacity: 0.3,
        scale: 0.8,
        duration: 0.35,
        stagger: {
          amount: 0.8,
          grid: [7, 53],
          from: 'center'
        },
        ease: 'power2.inOut'
      }, 0);

      tl.to(tiles, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: {
          amount: 0.8,
          grid: [7, 53],
          from: 'center'
        },
        ease: 'elastic.out(1, 0.5)'
      }, 0.55);
    }
  }

  projects: Project[] = [
    {
      id: 1,
      title: 'GitInsights',
      summary: 'Full-stack platform built to analyze Git repositories and visualize contribution metrics.',
      description: 'Built a full-stack platform to analyze Git repositories and visualize contribution metrics. Designed secure authentication and optimized database queries (reduced response time by ~30%). Developed dynamic dashboards for real-time repository insights.',
      tags: ['React.js', 'Node.js', 'PostgreSQL', 'Git API'],
      tech: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'Git REST API', 'JWT Auth', 'Chart.js', 'CSS Grid'],
      link: 'https://github.com/Eshwar187/GitInsights'
    },
    {
      id: 2,
      title: 'Kerno',
      summary: 'Multi-tenant CRM SaaS platform featuring Gemini AI churn analysis and Razorpay billing.',
      description: 'Architected a multi-tenant CRM SaaS utilizing Supabase Row-Level Security to enforce workspace data isolation across 12 database tables. Engineered a Gemini AI churn prediction engine that scores customer behavior, producing automated warning narratives. Integrated Razorpay subscription billing with secure webhooks and freemium tier access controls.',
      tags: ['Next.js 14', 'Supabase', 'Gemini AI', 'Razorpay'],
      tech: ['Next.js 14', 'Supabase Auth & DB', 'Gemini API', 'Razorpay SDK', 'Resend Mail', 'Tailwind CSS', 'Vercel'],
      link: 'https://github.com/Eshwar187/Kerno'
    }
  ];

  // Canvas Animation properties
  // Canvas Animation properties
  private canvasAnimationIds: number[] = [];
  private scrollTriggers: ScrollTrigger[] = [];

  // Hero Canvas State
  isHoveredHero = false;
  mouseHero = { x: -1000, y: -1000 };
  heroWaveHeightMultiplier = 3.5; // Starts large for entry surge
  
  // Aura DB (Constellation) State
  isHoveredAura = false;
  private auraShockwave = { x: 0, y: 0, radius: 0, maxRadius: 280, active: false };
  
  // Quantum UI (3D geometry) State
  isHoveredQuantum = false;
  mouseQuantum = { x: 0, y: 0 };
  quantumExplosionFactor = 0; // Vertices break apart on click
  
  // Aether CI (Sine Waves) State
  isHoveredAether = false;
  mouseAether = { x: 0, y: 0 };
  private aetherRipples: { x: number; y: number; progress: number; maxRadius: number }[] = [];

  // Skills Playground State
  isHoveredSkills = false;
  mouseSkills = { x: -1000, y: -1000 };
  private skillSparks: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];
  private skillDataPackets: { x: number; y: number; z: number; startNode: number; endNode: number; progress: number; speed: number }[] = [];
  private skillsTime = 0;
  private skillsRotX = 0;
  private skillsRotY = 0;

  // Transmitter Wave State
  transmitterIntensity = 0;

  ngAfterViewInit() {
    this.initBuoyancySway();
    this.initProjectCanvases();
    this.initSkillsCanvas();
    
    // Check if preloader is active. If not, trigger immediately
    const preloader = document.querySelector('app-preloader');
    if (!preloader) {
      this.initScrollRevealAnimations();
      this.initAnalyticsScrollTriggers();
      this.runCinematicHeroIntro();
    } else {
      const onLoad = () => {
        this.initScrollRevealAnimations();
        this.initAnalyticsScrollTriggers();
        this.runCinematicHeroIntro();
        document.removeEventListener('app-loaded', onLoad);
      };
      document.addEventListener('app-loaded', onLoad);
    }
  }

  private runCinematicHeroIntro() {
    // 1. Set initial hidden states of hero elements (no 3D tilts or wild scales)
    gsap.set('.bg-grid-perspective', { scale: 1.15, opacity: 0 });
    
    // Title characters start blurred, shifted down, and transparent
    gsap.set('.hero-title .interactive-char', { y: 40, filter: 'blur(10px)', opacity: 0 });
    
    // Sub-text elements start with a polygon mask representing a bottom crop slit reveal
    gsap.set(['.hero-tag', '.hero-subtitle', '.hero-tagline', '.hero-actions', '.hero-scroll-prompt'], {
      y: 30,
      opacity: 0,
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)'
    });

    // Telemetry card starts shifted right with 0 opacity
    gsap.set('.telemetry-hud-card', { x: 40, opacity: 0 });

    // 2. Trigger the orchestrated cinematic GSAP timeline
    const tl = gsap.timeline();
    
    // Fade and scale perspective grid background
    tl.to('.bg-grid-perspective', { 
      scale: 1.0, 
      opacity: 0.85, 
      duration: 2.0, 
      ease: 'power3.out' 
    }, 0);
    
    // Surge the hero canvas wave heights and settle elastically
    tl.to(this, { 
      heroWaveHeightMultiplier: 1.0, 
      duration: 2.2, 
      ease: 'power2.out' 
    }, 0);

    // Slide and clip-mask reveal Creative Portfolio tag
    tl.to('.hero-tag', { 
      y: 0, 
      opacity: 1,
      clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
      duration: 1.1, 
      ease: 'power3.out' 
    }, 0.2);

    // Stagger reveal of title characters "ESHWAR." with a blurred slide-up
    tl.to('.hero-title .interactive-char', { 
      y: 0, 
      opacity: 1, 
      filter: 'blur(0px)',
      duration: 0.95, 
      stagger: 0.04, 
      ease: 'power3.out' 
    }, 0.35);

    // Slide and clip-mask reveal subtitle
    tl.to('.hero-subtitle', { 
      y: 0, 
      opacity: 1,
      clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
      duration: 1.1, 
      ease: 'power3.out' 
    }, 0.7);

    // Slide and clip-mask reveal tagline description
    tl.to('.hero-tagline', { 
      y: 0, 
      opacity: 1,
      clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
      duration: 1.1, 
      ease: 'power3.out' 
    }, 0.85);

    // Slide and clip-mask reveal telemetry card
    tl.to('.telemetry-hud-card', {
      x: 0,
      opacity: 1,
      duration: 1.4,
      ease: 'power3.out'
    }, 0.75);

    // Slide and clip-mask reveal hero action buttons group
    tl.to('.hero-actions', { 
      y: 0, 
      opacity: 1,
      clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
      duration: 1.1, 
      ease: 'power3.out' 
    }, 0.95);

    // Slide and clip-mask reveal scroll indicator
    tl.to('.hero-scroll-prompt', { 
      y: 0, 
      opacity: 0.7,
      clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
      duration: 1.1, 
      ease: 'power3.out' 
    }, 1.1);
  }

  private initAnalyticsScrollTriggers() {
    const goCircle = this.langGoCircle()?.nativeElement;
    const tsCircle = this.langTsCircle()?.nativeElement;
    const rustCircle = this.langRustCircle()?.nativeElement;
    
    if (goCircle && tsCircle && rustCircle) {
      gsap.set(goCircle, { strokeDashoffset: 314.16 });
      gsap.set(tsCircle, { strokeDashoffset: 251.33 });
      gsap.set(rustCircle, { strokeDashoffset: 188.50 });

      const langTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.languages-card',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
      
      langTl.fromTo('.languages-svg',
        { rotate: -270, scale: 0.6, opacity: 0 },
        { rotate: -90, scale: 1, opacity: 1, duration: 1.6, ease: 'elastic.out(1, 0.75)' },
        0
      );
      
      langTl.to(goCircle, { strokeDashoffset: 314.16 * (1 - 0.48), duration: 1.5, ease: 'power3.out' }, 0.1);
      langTl.to(tsCircle, { strokeDashoffset: 251.33 * (1 - 0.35), duration: 1.5, ease: 'power3.out' }, 0.25);
      langTl.to(rustCircle, { strokeDashoffset: 188.50 * (1 - 0.12), duration: 1.5, ease: 'power3.out' }, 0.4);
    }

    const easyC = this.leetEasyCircle()?.nativeElement;
    const medC = this.leetMedCircle()?.nativeElement;
    const hardC = this.leetHardCircle()?.nativeElement;
    const solvedTextEl = this.leetSolvedText()?.nativeElement;

    if (easyC && medC && hardC && solvedTextEl) {
      gsap.set(easyC, { strokeDasharray: '0 238.76', strokeDashoffset: 0 });
      gsap.set(medC, { strokeDasharray: '0 238.76', strokeDashoffset: -89.26 });
      gsap.set(hardC, { strokeDasharray: '0 238.76', strokeDashoffset: -205.16 });

      const leetTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.leetcode-card',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });

      leetTl.fromTo('.donut-svg', 
        { rotate: -270, scale: 0.6, opacity: 0 },
        { rotate: -90, scale: 1, opacity: 1, duration: 1.6, ease: 'elastic.out(1, 0.75)' },
        0
      );

      leetTl.to(easyC, { strokeDasharray: '89.26 238.76', duration: 1.4, ease: 'power3.out' }, 0.1);
      leetTl.to(medC, { strokeDasharray: '115.90 238.76', duration: 1.4, ease: 'power3.out' }, 0.2);
      leetTl.to(hardC, { strokeDasharray: '33.47 238.76', duration: 1.4, ease: 'power3.out' }, 0.3);

      const countObj = { val: 0 };
      leetTl.to(countObj, {
        val: 642,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          solvedTextEl.textContent = Math.floor(countObj.val).toString();
        }
      }, 0.1);
    }

    const gridEl = this.heatmapGridEl()?.nativeElement;
    if (gridEl) {
      const tiles = gridEl.querySelectorAll('.heatmap-tile');
      gsap.set(tiles, { opacity: 0, scale: 0.1 });

      const trigger = ScrollTrigger.create({
        trigger: '.heatmap-card',
        start: 'top 80%',
        onEnter: () => {
          gsap.to(tiles, {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            stagger: {
              amount: 1.3,
              grid: [7, 53],
              from: 'start'
            },
            ease: 'power2.out'
          });
        }
      });
      this.scrollTriggers.push(trigger);
    }
  }

  ngOnDestroy() {
    // Stop all active canvas requestAnimationFrame cycles
    this.canvasAnimationIds.forEach(id => cancelAnimationFrame(id));
    this.canvasAnimationIds = [];

    // Kill scroll triggers
    this.scrollTriggers.forEach(t => t.kill());
    this.scrollTriggers = [];

    // Clean up telemetry logs timers
    if (this.idleLogsInterval) {
      clearInterval(this.idleLogsInterval);
    }
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
    this.hoverLogsTimeout.forEach(t => clearTimeout(t));
    this.hoverLogsTimeout = [];
  }

  // 1. Organic sways for titles and containers
  private initBuoyancySway() {
    const cards = document.querySelectorAll('.project-row');
    cards.forEach((card, idx) => {
      gsap.to(card, {
        y: '+=15',
        duration: 4.0 + idx * 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }

  // 2. Smooth scroll-triggered fade-up reveal animations
  private initScrollRevealAnimations() {
    // Reveal each .scroll-reveal element with a smooth fade-up + scale (excluding bento grid cards which are animated via CSS)
    const revealEls = document.querySelectorAll('.scroll-reveal:not(.profile-bento-grid .scroll-reveal)');
    revealEls.forEach((el) => {
      gsap.set(el, { opacity: 0, y: 60, scale: 0.97 });

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top bottom-=80',
        end: 'top center',
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            ease: 'power3.out'
          });
        }
      });
      this.scrollTriggers.push(trigger);
    });

    // Staggered bento cards reveal using CSS transition states triggered by ScrollTrigger
    const bentoGrid = document.querySelector('.profile-bento-grid');
    if (bentoGrid) {
      const trigger = ScrollTrigger.create({
        trigger: bentoGrid,
        start: 'top bottom-=100',
        once: true,
        onEnter: () => {
          bentoGrid.classList.add('bento-visible');
        }
      });
      this.scrollTriggers.push(trigger);
    }

    // Stagger reveal for skill category cards
    const skillCards = document.querySelectorAll('.skill-category-card');
    if (skillCards.length > 0) {
      gsap.set(skillCards, { opacity: 0, y: 50, scale: 0.96 });
      const skillTrigger = ScrollTrigger.create({
        trigger: '.skills-matrix-grid',
        start: 'top bottom-=80',
        once: true,
        onEnter: () => {
          gsap.to(skillCards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            stagger: 0.14,
            ease: 'power3.out'
          });
        }
      });
      this.scrollTriggers.push(skillTrigger);
    }

    // Sections fade in smoothly with stagger
    const sections = document.querySelectorAll('section');
    sections.forEach((sec) => {
      const trigger = ScrollTrigger.create({
        trigger: sec,
        start: 'top bottom-=50',
        end: 'top center',
        once: true,
        onEnter: () => {
          gsap.fromTo(sec, 
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }
          );
        }
      });
      this.scrollTriggers.push(trigger);
    });

    // Project detail columns slide in from left/right
    const detailCols = document.querySelectorAll('.project-details-col');
    detailCols.forEach((col, idx) => {
      const fromX = idx % 2 === 0 ? -80 : 80;
      gsap.set(col, { opacity: 0, x: fromX });

      const trigger = ScrollTrigger.create({
        trigger: col,
        start: 'top bottom-=60',
        once: true,
        onEnter: () => {
          gsap.to(col, {
            opacity: 1,
            x: 0,
            duration: 1.0,
            ease: 'power3.out'
          });
        }
      });
      this.scrollTriggers.push(trigger);
    });

    // Mockup columns slide in from opposite direction
    const mockupCols = document.querySelectorAll('.project-mockup-col');
    mockupCols.forEach((col, idx) => {
      const fromX = idx % 2 === 0 ? 80 : -80;
      gsap.set(col, { opacity: 0, x: fromX });

      const trigger = ScrollTrigger.create({
        trigger: col,
        start: 'top bottom-=60',
        once: true,
        onEnter: () => {
          gsap.to(col, {
            opacity: 1,
            x: 0,
            duration: 1.0,
            delay: 0.15,
            ease: 'power3.out'
          });
        }
      });
      this.scrollTriggers.push(trigger);
    });

    // Animate showcase & section headers with a clip-path reveal
    const headers = document.querySelectorAll('.showcase-header, .skills-header, .contact-header');
    headers.forEach((header) => {
      gsap.set(header, { opacity: 0, y: 30 });

      const trigger = ScrollTrigger.create({
        trigger: header,
        start: 'top bottom-=40',
        once: true,
        onEnter: () => {
          gsap.to(header, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
          });
        }
      });
      this.scrollTriggers.push(trigger);
    });

    // Skills & Contact containers
    const containers = document.querySelectorAll('.skills-physics-wrapper, .transmitter-grid');
    containers.forEach((container) => {
      gsap.set(container, { opacity: 0, y: 50, scale: 0.98 });

      const trigger = ScrollTrigger.create({
        trigger: container,
        start: 'top bottom-=60',
        once: true,
        onEnter: () => {
          gsap.to(container, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            ease: 'power3.out'
          });
        }
      });
      this.scrollTriggers.push(trigger);
    });
  }

  // 2. Initialize the HTML5 Canvases for handcrafted mockup art
  private initProjectCanvases() {
    const heroCanvas = document.getElementById('canvas-hero') as HTMLCanvasElement;
    if (heroCanvas) this.setupHeroCanvas(heroCanvas);

    const auraCanvas = document.getElementById('canvas-aura') as HTMLCanvasElement;
    if (auraCanvas) this.setupAuraCanvas(auraCanvas);

    const quantumCanvas = document.getElementById('canvas-quantum') as HTMLCanvasElement;
    if (quantumCanvas) this.setupQuantumCanvas(quantumCanvas);

    const aetherCanvas = document.getElementById('canvas-aether') as HTMLCanvasElement;
    if (aetherCanvas) this.setupAetherCanvas(aetherCanvas);

    const transmitterCanvas = document.getElementById('canvas-transmitter') as HTMLCanvasElement;
    if (transmitterCanvas) this.setupTransmitterCanvas(transmitterCanvas);

    const contactBgCanvas = document.getElementById('canvas-contact-bg') as HTMLCanvasElement;
    if (contactBgCanvas) this.setupContactBgCanvas(contactBgCanvas);
  }

  // HERO: Waving 3D golden topography mesh
  private setupHeroCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouseHero.x = e.clientX - rect.left;
      this.mouseHero.y = e.clientY - rect.top;
      this.isHoveredHero = true;
    });

    canvas.addEventListener('mouseleave', () => {
      this.mouseHero.x = -1000;
      this.mouseHero.y = -1000;
      this.isHoveredHero = false;
    });

    // Grid coordinates
    const cols = 22;
    const rows = 12;
    const spacingX = 42;
    const spacingY = 28;
    const fov = 380;

    let time = 0;
    let scrollSpeed = 0;
    let lastScroll = window.scrollY;

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      const centerX = w / 2;
      const centerY = h / 2 + 50;

      // Track scroll delta
      const currScroll = window.scrollY;
      scrollSpeed += (Math.abs(currScroll - lastScroll) * 0.15 - scrollSpeed) * 0.1;
      lastScroll = currScroll;
      scrollSpeed *= 0.94;

      time += 0.01 + scrollSpeed * 0.004;

      const grid: { x: number; y: number; z: number }[][] = [];

      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          const flatX = (c - cols / 2) * spacingX;
          const flatY = (r - rows / 2) * spacingY + 80;

          // 3D displacement waves
          let z = Math.sin(c * 0.35 + time) * Math.cos(r * 0.38 - time * 0.8) * (20 + scrollSpeed * 1.5) * this.heroWaveHeightMultiplier;

          // Mouse warp crater
          if (this.isHoveredHero && this.mouseHero.x !== -1000) {
            const dx = (flatX + centerX) - this.mouseHero.x;
            const dy = (flatY + centerY) - this.mouseHero.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
              const force = (150 - dist) / 150;
              z -= force * 45;
            }
          }

          // Draw flat 2D topographic waving grid (no 3D tilts or perspective scale)
          grid[r].push({
            x: centerX + flatX,
            y: centerY + flatY - z * 0.75, // wave offset directly on Y-axis
            z: z
          });
        }
      }

      // Draw connections
      ctx.lineWidth = 0.45;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = grid[r][c];
          const depthAlpha = Math.max(0.02, (1 - (p.z + 100) / 280) * 0.22);
          ctx.strokeStyle = `rgba(197, 168, 128, ${depthAlpha})`;

          if (c < cols - 1) {
            const right = grid[r][c + 1];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(right.x, right.y);
            ctx.stroke();
          }
          if (r < rows - 1) {
            const down = grid[r + 1][c];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(down.x, down.y);
            ctx.stroke();
          }
        }
      }

      ctx.restore();
      this.canvasAnimationIds[4] = requestAnimationFrame(draw);
    };

    this.canvasAnimationIds[4] = requestAnimationFrame(draw);
  }

  // AURA DB: Click shockwaves
  private setupAuraCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);

    // Click handler for shockwaves
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left - rect.width / 2);
      const clickY = (e.clientY - rect.top - rect.height / 2);
      this.triggerAuraShockwave(clickX, clickY);
    });

    const numPoints = 45;
    const points: { x: number; y: number; baseX: number; baseY: number; vx: number; vy: number; ox: number; oy: number }[] = [];
    
    for (let i = 0; i < numPoints; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 90;
      const x = dist * Math.cos(angle);
      const y = dist * Math.sin(angle);

      points.push({
        x: x,
        y: y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        ox: 0,
        oy: 0
      });
    }

    let morphProgress = 0;
    let time = 0;

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      const centerX = w / 2;
      const centerY = h / 2;

      time += 0.02;

      // Adjust morph target based on hover
      if (this.isHoveredAura) {
        morphProgress += (1 - morphProgress) * 0.1;
      } else {
        morphProgress += (0 - morphProgress) * 0.06;
      }

      const projected: { x: number; y: number; size: number }[] = [];

      points.forEach((p, i) => {
        // Apply drift velocities
        p.baseX += p.vx;
        p.baseY += p.vy;

        // Bounce within flat boundary radius 130
        const currentDist = Math.sqrt(p.baseX * p.baseX + p.baseY * p.baseY);
        if (currentDist > 130) {
          const normalX = p.baseX / currentDist;
          const normalY = p.baseY / currentDist;
          const dot = p.vx * normalX + p.vy * normalY;
          p.vx = p.vx - 2 * dot * normalX;
          p.vy = p.vy - 2 * dot * normalY;
          
          p.baseX = normalX * 129;
          p.baseY = normalY * 129;
        }

        // Concentric target patterns
        let targetX = 0;
        let targetY = 0;
        if (i < 5) {
          const angle = (i / 5) * Math.PI * 2 + time * 0.2;
          targetX = Math.cos(angle) * 30;
          targetY = Math.sin(angle) * 30;
        } else if (i < 20) {
          const angle = ((i - 5) / 15) * Math.PI * 2 - time * 0.1;
          targetX = Math.cos(angle) * 75;
          targetY = Math.sin(angle) * 75;
        } else {
          const angle = ((i - 20) / 25) * Math.PI * 2 + time * 0.05;
          targetX = Math.cos(angle) * 120;
          targetY = Math.sin(angle) * 120;
        }

        // Blend position states
        let finalX = p.baseX * (1 - morphProgress) + targetX * morphProgress;
        let finalY = p.baseY * (1 - morphProgress) + targetY * morphProgress;

        // Shockwave deflection physics
        if (this.auraShockwave.active) {
          const dx = finalX - this.auraShockwave.x;
          const dy = finalY - this.auraShockwave.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const waveRadius = this.auraShockwave.radius;

          if (dist < waveRadius && dist > waveRadius - 60) {
            const force = (1 - Math.abs(dist - waveRadius) / 60) * 36;
            p.ox += (dx / (dist || 1)) * force;
            p.oy += (dy / (dist || 1)) * force;
          }
        }
        
        // Decay offset back to zero elastically
        p.ox += (0 - p.ox) * 0.08;
        p.oy += (0 - p.oy) * 0.08;

        finalX += p.ox;
        finalY += p.oy;

        const screenX = centerX + finalX;
        const screenY = centerY + finalY;
        const size = 1.8 + Math.sin(time * 2 + i) * 0.6;

        projected.push({ x: screenX, y: screenY, size });
      });

      // Draw wire constellation links (2D distance based)
      ctx.lineWidth = 0.55;
      for (let i = 0; i < projected.length; i++) {
        let links = 0;
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 55 && links < 3) {
            const p1 = projected[i];
            const p2 = projected[j];
            const alpha = (1 - dist / 55) * 0.35;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(197, 168, 128, ${alpha})`;
            ctx.stroke();
            links++;
          }
        }
      }

      // Draw shockwave ring visually on canvas
      if (this.auraShockwave.active) {
        ctx.beginPath();
        ctx.arc(centerX + this.auraShockwave.x, centerY + this.auraShockwave.y, this.auraShockwave.radius, 0, Math.PI * 2);
        const ratio = this.auraShockwave.radius / this.auraShockwave.maxRadius;
        ctx.strokeStyle = `rgba(197, 168, 128, ${0.4 * (1 - ratio)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw nodes
      projected.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = '#fafafc';
        ctx.fill();
        ctx.strokeStyle = 'rgba(197, 168, 128, 0.6)';
        ctx.lineWidth = 0.75;
        ctx.stroke();
      });

      ctx.restore();
      this.canvasAnimationIds[0] = requestAnimationFrame(draw);
    };

    this.canvasAnimationIds[0] = requestAnimationFrame(draw);
  }

  private triggerAuraShockwave(x: number, y: number) {
    this.auraShockwave.x = x;
    this.auraShockwave.y = y;
    this.auraShockwave.radius = 0;
    this.auraShockwave.active = true;

    gsap.to(this.auraShockwave, {
      radius: this.auraShockwave.maxRadius,
      duration: 0.9,
      ease: 'power2.out',
      onComplete: () => {
        this.auraShockwave.active = false;
      }
    });
  }

  // QUANTUM UI: Concentric 2D cybernetic target HUD
  private setupQuantumCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);

    // Click trigger for fragmentation
    canvas.addEventListener('click', () => {
      this.triggerQuantumExplosion();
    });

    let angle1 = 0;
    let angle2 = 0;
    let currentX = 0;
    let currentY = 0;
    let pulseTime = 0;

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      const centerX = w / 2;
      const centerY = h / 2;

      // Rotation angles
      angle1 += 0.007;
      angle2 -= 0.011;
      pulseTime += 0.04;

      // Mouse tracking
      const targetMouseX = this.isHoveredQuantum ? this.mouseQuantum.x : 0;
      const targetMouseY = this.isHoveredQuantum ? this.mouseQuantum.y : 0;
      currentX += (targetMouseX - currentX) * 0.08;
      currentY += (targetMouseY - currentY) * 0.08;

      // Shifted center based on mouse (2D Parallax)
      const shiftedX = centerX + currentX * 0.12;
      const shiftedY = centerY + currentY * 0.12;

      // Radii based on explosion factor
      const exp = this.quantumExplosionFactor;
      const r1 = 80 * (1 + exp * 0.35); // outer
      const r2 = 50 * (1 + exp * 0.5);  // middle
      const r3 = 20 * (1 + exp * 0.7);  // inner

      ctx.strokeStyle = '#c5a880';
      ctx.fillStyle = '#fafafc';

      // 1. Draw Outer Segmented Ring (Rotating)
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const start = angle1 + i * Math.PI / 2;
        const end = start + Math.PI / 2 - 0.25;
        ctx.beginPath();
        ctx.arc(shiftedX, shiftedY, r1, start, end);
        ctx.strokeStyle = `rgba(197, 168, 128, ${0.45 * (1 - exp * 0.2)})`;
        ctx.stroke();

        // Draw small tick/triangle on the starting edge of outer segments
        const tx = shiftedX + Math.cos(start) * r1;
        const ty = shiftedY + Math.sin(start) * r1;
        ctx.beginPath();
        ctx.arc(tx, ty, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#c5a880';
        ctx.fill();
      }

      // 2. Draw Middle Dashed Ring (Counter-Rotating)
      ctx.beginPath();
      ctx.arc(shiftedX, shiftedY, r2, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(250, 250, 252, ${0.15 * (1 - exp * 0.2)})`;
      ctx.lineWidth = 0.75;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Draw middle ticks rotating on middle circle
      const numMiddleNodes = 3;
      for (let i = 0; i < numMiddleNodes; i++) {
        const a = angle2 + (i / numMiddleNodes) * Math.PI * 2;
        const nx = shiftedX + Math.cos(a) * r2;
        const ny = shiftedY + Math.sin(a) * r2;
        
        ctx.beginPath();
        ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fafafc';
        ctx.fill();
        ctx.strokeStyle = '#c5a880';
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      // 3. Draw Inner Ring and Center Dot
      ctx.beginPath();
      ctx.arc(shiftedX, shiftedY, r3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(197, 168, 128, ${0.7 * (1 - exp * 0.3)})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Center glowing dot
      ctx.beginPath();
      ctx.arc(shiftedX, shiftedY, 3 + Math.sin(pulseTime) * 0.75, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(250, 250, 252, ${0.9 - exp * 0.4})`;
      ctx.fill();

      // 4. Draw crosshairs (lines radiating out from inner ring to outer ring)
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = `rgba(197, 168, 128, ${0.25 * (1 - exp * 0.4)})`;
      const dirs = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
      dirs.forEach(d => {
        const xStart = shiftedX + Math.cos(d) * (r3 + 4);
        const xEnd = shiftedX + Math.cos(d) * (r1 - 4);
        const yStart = shiftedY + Math.sin(d) * (r3 + 4);
        const yEnd = shiftedY + Math.sin(d) * (r1 - 4);
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();
      });

      // 5. Technical stats text overlay (top-left and bottom-right of canvas)
      ctx.fillStyle = 'rgba(197, 168, 128, 0.45)';
      ctx.font = '7px monospace';
      ctx.fillText(`SYS.LOCK: ${exp > 0 ? 'WARNING' : 'STABLE'}`, 15, 20);
      ctx.fillText(`ROT.DEG: ${( (angle1 * 180 / Math.PI) % 360 ).toFixed(1)}°`, 15, 30);
      
      const statusValue = (0.7 + Math.sin(pulseTime * 0.5) * 0.25).toFixed(3);
      ctx.fillText(`INDEX.EVAL: ${statusValue}`, w - 85, h - 20);
      ctx.fillText(`SHLD.CAP: 98.41%`, w - 85, h - 10);

      // Pulse graph in the bottom left
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.2)';
      ctx.lineWidth = 0.5;
      ctx.moveTo(15, h - 15);
      for (let x = 0; x < 40; x++) {
        const y = h - 15 + Math.sin(x * 0.3 + pulseTime) * 6 * (1 - exp * 0.5);
        ctx.lineTo(15 + x, y);
      }
      ctx.stroke();

      ctx.restore();
      this.canvasAnimationIds[1] = requestAnimationFrame(draw);
    };

    this.canvasAnimationIds[1] = requestAnimationFrame(draw);
  }

  private triggerQuantumExplosion() {
    const tl = gsap.timeline();
    tl.to(this, { quantumExplosionFactor: 2.2, duration: 0.4, ease: 'power3.out' });
    tl.to(this, { quantumExplosionFactor: 0, duration: 1.5, ease: 'elastic.out(1.15, 0.4)' });
  }

  // AETHER CI: Wave ripple propagation on click
  private setupAetherCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      this.triggerAetherRipple(clickX, clickY);
    });

    let phase = 0;
    let flowSpeed = 0.02;

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      const targetSpeed = this.isHoveredAether ? 0.058 : 0.018;
      flowSpeed += (targetSpeed - flowSpeed) * 0.08;
      phase += flowSpeed;

      const cursorY = this.isHoveredAether ? this.mouseAether.y : h / 2;

      // Draw waves
      for (let waveIdx = 0; waveIdx < 3; waveIdx++) {
        ctx.beginPath();
        ctx.lineWidth = waveIdx === 0 ? 1.5 : 0.75;
        
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        if (waveIdx === 0) {
          grad.addColorStop(0, 'rgba(197, 168, 128, 0.05)');
          grad.addColorStop(0.5, 'rgba(197, 168, 128, 0.45)');
          grad.addColorStop(1, 'rgba(197, 168, 128, 0.05)');
        } else {
          grad.addColorStop(0, 'rgba(250, 250, 252, 0.02)');
          grad.addColorStop(0.5, 'rgba(250, 250, 252, 0.22)');
          grad.addColorStop(1, 'rgba(250, 250, 252, 0.02)');
        }
        ctx.strokeStyle = grad;

        const baseHeight = h / 2 + (waveIdx - 1) * 22;
        ctx.moveTo(0, baseHeight);

        const segments = 45;
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments) * w;
          const angle = (x * 0.012) - phase + (waveIdx * 1.5);
          let amplitude = 18 + Math.sin(phase * 0.5) * 8;
          
          if (this.isHoveredAether) {
            const cursorInfluence = Math.max(0, 1 - Math.abs(x - this.mouseAether.x) / (w * 0.4));
            amplitude += cursorInfluence * 15;
          }

          let y = baseHeight + Math.sin(angle) * amplitude + (cursorY - h / 2) * 0.15;

          // Apply click ripple deformation
          this.aetherRipples.forEach(r => {
            const dist = Math.abs(x - r.x);
            const waveRadius = r.progress * r.maxRadius;
            
            if (dist < waveRadius && dist > waveRadius - 60) {
              const force = (1 - (waveRadius - dist) / 60) * 36 * (1 - r.progress);
              y += Math.sin((dist - waveRadius) * 0.12) * force;
            }
          });

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      ctx.restore();
      this.canvasAnimationIds[2] = requestAnimationFrame(draw);
    };

    this.canvasAnimationIds[2] = requestAnimationFrame(draw);
  }

  private triggerAetherRipple(x: number, y: number) {
    const ripple = { x, y, progress: 0, maxRadius: 300 };
    this.aetherRipples.push(ripple);

    gsap.to(ripple, {
      progress: 1,
      duration: 1.15,
      ease: 'power2.out',
      onComplete: () => {
        this.aetherRipples = this.aetherRipples.filter(r => r !== ripple);
      }
    });
  }

  // Transmitter wave oscilloscope simulation setup
  private setupTransmitterCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);

    let phase = 0;

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      // Exponential decay of transmitter signal intensity
      this.transmitterIntensity *= 0.95;
      if (this.transmitterIntensity < 0.001) this.transmitterIntensity = 0;

      const baseFreq = 0.015;
      const freqMultiplier = 1 + this.transmitterIntensity * 1.5;
      const phaseSpeed = 0.03 + this.transmitterIntensity * 0.08;
      phase += phaseSpeed;

      // Telemetry label updating
      const telemetryEl = document.getElementById('wave-telemetry');
      if (telemetryEl) {
        if (this.transmitterIntensity > 0.05) {
          const ghz = (0.12 + this.transmitterIntensity * 0.48).toFixed(2);
          telemetryEl.textContent = `TELEMETRY: Transmitting... // ${ghz} GHz // ACTIVE`;
          telemetryEl.classList.add('transmitting-active');
        } else {
          telemetryEl.textContent = `TELEMETRY: Rest state // 0.12 GHz`;
          telemetryEl.classList.remove('transmitting-active');
        }
      }

      // Draw Grid Backdrop
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.04)';
      ctx.lineWidth = 0.5;
      const gridSize = 30;
      
      // Vertical grid lines
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      // Horizontal grid lines
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Subtler Half-grid subdivisions
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.beginPath();
      for (let x = gridSize / 2; x < w; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = gridSize / 2; y < h; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // Bounding HUD Box with solid Corner Ticks
      const padding = 12;
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(padding, padding, w - padding * 2, h - padding * 2);

      // Corner tick marks (solid lines)
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.45)';
      ctx.lineWidth = 1.5;
      const tickSize = 10;
      
      // Top-Left L-tick
      ctx.beginPath();
      ctx.moveTo(padding + tickSize, padding);
      ctx.lineTo(padding, padding);
      ctx.lineTo(padding, padding + tickSize);
      ctx.stroke();

      // Top-Right L-tick
      ctx.beginPath();
      ctx.moveTo(w - padding - tickSize, padding);
      ctx.lineTo(w - padding, padding);
      ctx.lineTo(w - padding, padding + tickSize);
      ctx.stroke();

      // Bottom-Left L-tick
      ctx.beginPath();
      ctx.moveTo(padding + tickSize, h - padding);
      ctx.lineTo(padding, h - padding);
      ctx.lineTo(padding, h - padding - tickSize);
      ctx.stroke();

      // Bottom-Right L-tick
      ctx.beginPath();
      ctx.moveTo(w - padding - tickSize, h - padding);
      ctx.lineTo(w - padding, h - padding);
      ctx.lineTo(w - padding, h - padding - tickSize);
      ctx.stroke();

      // Center crosshair (Horizontal & Vertical Dotted lines)
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.2)';
      ctx.lineWidth = 0.75;
      ctx.setLineDash([2, 4]);
      
      // Center horizontal
      ctx.beginPath();
      ctx.moveTo(padding, h / 2);
      ctx.lineTo(w - padding, h / 2);
      ctx.stroke();
      
      // Center vertical
      ctx.beginPath();
      ctx.moveTo(w / 2, padding);
      ctx.lineTo(w / 2, h - padding);
      ctx.stroke();
      
      ctx.setLineDash([]); // Reset line dash

      // Small Center Reticle Circles
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.25)';
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(197, 168, 128, 0.08)';
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 22, 0, Math.PI * 2);
      ctx.stroke();

      // Draw three distinct translucent glowing sine waves
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        let strokeStyle = '';
        let lineWidth = 1.0;
        let amp = 0;

        if (layer === 0) {
          // Main wave
          strokeStyle = `rgba(197, 168, 128, ${0.4 + this.transmitterIntensity * 0.5})`;
          lineWidth = 1.8;
          amp = 18 + this.transmitterIntensity * 38;
        } else if (layer === 1) {
          // Secondary wave
          strokeStyle = `rgba(250, 250, 252, ${0.2 + this.transmitterIntensity * 0.3})`;
          lineWidth = 1.0;
          amp = 12 + this.transmitterIntensity * 24;
        } else {
          // Background subtle wave
          strokeStyle = `rgba(197, 168, 128, ${0.1 + this.transmitterIntensity * 0.2})`;
          lineWidth = 0.75;
          amp = 8 + this.transmitterIntensity * 15;
        }

        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;

        const baseHeight = h / 2;
        ctx.moveTo(0, baseHeight);

        const segments = 60;
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments) * w;
          const angle = (x * baseFreq * freqMultiplier) - phase + (layer * Math.PI / 3);
          const y = baseHeight + Math.sin(angle) * amp + Math.cos(angle * 0.5) * (amp * 0.3);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw Coordinates Tracking on top (HUD Labels)
      ctx.font = '7px Menlo, Monaco, Consolas, "Courier New", monospace';
      ctx.fillStyle = 'rgba(197, 168, 128, 0.4)';
      
      // Top Left Stats Readout
      ctx.fillText('REF_CLOCK // EXT_INT', padding + 15, padding + 15);
      const sweepRate = (60.0 + (Math.random() - 0.5) * 0.2).toFixed(2);
      ctx.fillText(`SWEEP_RATE: ${sweepRate} Hz`, padding + 15, padding + 25);
      
      // Top Right Stats Readout
      ctx.textAlign = 'right';
      ctx.fillText('SYS_STAT: NOMINAL', w - padding - 15, padding + 15);
      const intensityPct = (this.transmitterIntensity * 100).toFixed(1);
      ctx.fillText(`BURST_INTENSITY: ${intensityPct}%`, w - padding - 15, padding + 25);
      
      // Bottom Right Stats Readout
      ctx.fillText('CH: 05 // BEACON_ACTIVE', w - padding - 15, h - padding - 15);
      ctx.textAlign = 'left';

      // Dynamic Coordinate Tag following the wave's center point
      const trackingX = w / 2;
      const trackingAngle = (trackingX * baseFreq * freqMultiplier) - phase;
      const trackingAmp = 18 + this.transmitterIntensity * 38;
      const trackingY = h / 2 + Math.sin(trackingAngle) * trackingAmp + Math.cos(trackingAngle * 0.5) * (trackingAmp * 0.3);
      
      // Small crosshair tracking node
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(trackingX, trackingY, 3, 0, Math.PI * 2);
      ctx.stroke();
      
      // Tiny dotted horizontal line leading to label
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.setLineDash([1, 2]);
      ctx.beginPath();
      ctx.moveTo(trackingX + 3, trackingY);
      ctx.lineTo(trackingX + 20, trackingY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Dynamic text label next to tracking node
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(`[Y: ${trackingY.toFixed(1)}]`, trackingX + 23, trackingY + 2.5);

      // Warning text flashing when transmission is high
      if (this.transmitterIntensity > 0.15) {
        ctx.save();
        ctx.fillStyle = `rgba(197, 168, 128, ${Math.sin(Date.now() * 0.02) * 0.4 + 0.5})`;
        ctx.font = 'bold 9px Menlo, Monaco, Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('<< SIGNAL BURST EMISSION ACTIVE >>', w / 2, h - padding - 15);
        ctx.restore();
      }

      ctx.restore();
      this.canvasAnimationIds[5] = requestAnimationFrame(draw);
    };

    this.canvasAnimationIds[5] = requestAnimationFrame(draw);
  }

  // Interactive Background Signal Particle Canvas for Contact Deck
  private setupContactBgCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; vx: number; vy: number; radius: number; alpha: number; pulse: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * 1000,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.5,
        radius: 1 + Math.random() * 2.2,
        alpha: 0.15 + Math.random() * 0.45,
        pulse: Math.random() * Math.PI * 2
      });
    }

    let phase = 0;

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      phase += 0.015;

      // Draw subtle expanding signal radar rings
      const centerX = w / 2;
      const centerY = h / 2;
      for (let r = 1; r <= 3; r++) {
        const radius = ((phase * 35 + r * 110) % (w * 0.5));
        const ringAlpha = Math.max(0, 0.1 * (1 - radius / (w * 0.5)));
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(197, 168, 128, ${ringAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw ascending telemetry spark particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.03;

        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        const currentAlpha = p.alpha + Math.sin(p.pulse) * 0.1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197, 168, 128, ${Math.max(0.05, currentAlpha)})`;
        ctx.shadowColor = 'rgba(197, 168, 128, 0.6)';
        ctx.shadowBlur = 8;
        ctx.fill();
      }

      ctx.restore();
      this.canvasAnimationIds[7] = requestAnimationFrame(draw);
    };

    this.canvasAnimationIds[7] = requestAnimationFrame(draw);
  }

  // Triggered on contact form keyup/input to accelerate transmitter signals
  onFormInput() {
    this.transmitterIntensity = Math.min(2.0, this.transmitterIntensity + 0.45);

    const possibleLogs = [
      '> [INPUT] Intercepted coordinate data stream...',
      '> [PACKET] Buffering transmission payload...',
      '> [ENCRYPT] Applying Hashing-Cipher SHA-256...',
      '> [SOCKET] Checking handshake response... OK',
      '> [STATUS] Subspace channel open // 0.48 GHz',
      '> [SMTP] Server ready for outbound packaging',
      '> [TELEMETRY] Core temperature: 38.4C // STABLE'
    ];

    const current = this.formLogs();
    if (current.length < possibleLogs.length) {
      this.formLogs.update(logs => [...logs, possibleLogs[logs.length]]);
    } else {
      const randIdx = Math.floor(Math.random() * possibleLogs.length);
      if (randIdx >= 4) {
        const temp = (36 + Math.random() * 8).toFixed(1);
        possibleLogs[6] = `> [TELEMETRY] Core temperature: ${temp}C // STABLE`;
        const freq = (0.35 + Math.random() * 0.4).toFixed(2);
        possibleLogs[4] = `> [STATUS] Subspace channel open // ${freq} GHz`;
      }
      this.formLogs.set(possibleLogs);
    }
  }

  onProjectHover(projectId: number) {
    this.clearProjectHoverTimers();

    const targetSignal = projectId === 1 ? this.project1Logs : this.project2Logs;
    targetSignal.set([]);

    const logLines = projectId === 1 
      ? [
          '> SYSTEM: INITIATE DECRYPTION ROUTINE',
          '> TARGET: git_insights.sys',
          '> PORT: AURA_GATEWAY // SECURE',
          '> RUNNING: git fetch --all --quiet',
          '> LOADING: commit_stream_index.db',
          '> PARSING: 847 commits analyzed [OK]',
          '> COMPILING: metrics_render_engine.ts [OK]',
          '> STATUS: DECRYPTION COMPLETE [SUCCESS]'
        ]
      : [
          '> SYSTEM: INITIATE DECRYPTION ROUTINE',
          '> TARGET: kerno_crm.sys',
          '> PORT: QUANTUM_STREAM // ENCRYPTED',
          '> RUNNING: node index.js --mode=neural',
          '> LOADING: synaptic_weights_v4.bin',
          '> PARSING: 4,096 activation layers [OK]',
          '> COMPILING: cluster_matrix_map.ts [OK]',
          '> STATUS: DECRYPTION COMPLETE [SUCCESS]'
        ];

    let currentLine = 0;
    const addNextLine = () => {
      if (currentLine < logLines.length) {
        targetSignal.update(logs => [...logs, logLines[currentLine]]);
        currentLine++;
        const nextDelay = 70 + Math.random() * 100;
        const timer = setTimeout(addNextLine, nextDelay);
        this.projectHoverTimers.push(timer);
      }
    };

    addNextLine();
  }

  onProjectLeave(projectId: number) {
    this.clearProjectHoverTimers();
    if (projectId === 1) {
      this.project1Logs.set([]);
    } else {
      this.project2Logs.set([]);
    }
  }

  private clearProjectHoverTimers() {
    this.projectHoverTimers.forEach(t => clearTimeout(t));
    this.projectHoverTimers = [];
  }

  // 4. INTERACTIVE BENTO GRID SKILLS & TELEMETRY MONITOR
  private initSkillsCanvas() {
    this.initSkillNodes();
    this.setupSkillsTelemetryCanvas();
    this.setupPingTelemetryCanvas();
  }

  getSkillsByCategory(category: string): SkillNode[] {
    return this.skillNodes.filter(node => node.category === category);
  }

  onSkillHover(skill: SkillNode) {
    this.skillNodes.forEach(node => {
      node.isHovered = (node.id === skill.id);
    });
    this.hoveredSkillNode.set(skill);

    // Spawn data packets along same category
    const targets = this.skillNodes.filter(n => n.category === skill.category && n.id !== skill.id);
    targets.forEach(target => {
      this.skillDataPackets.push({
        startNode: skill,
        endNode: target,
        progress: 0,
        speed: 0.015 + Math.random() * 0.015,
        color: skill.color || '#c5a880'
      } as any);
    });

    // Clear idle logs timer
    if (this.idleLogsInterval) {
      clearInterval(this.idleLogsInterval);
      this.idleLogsInterval = null;
    }

    // Clear any pending hover timeouts
    this.hoverLogsTimeout.forEach(t => clearTimeout(t));
    this.hoverLogsTimeout = [];

    // Trigger dynamic logging sequence
    this.activeLogs.set(['[INIT] mounting ' + skill.name.toLowerCase() + ' node...']);

    this.hoverLogsTimeout.push(
      setTimeout(() => {
        this.activeLogs.set([
          '[INIT] mounting ' + skill.name.toLowerCase() + ' node...',
          '[PARSE] analyzing stack: ' + skill.stack.slice(0, 3).join(', ')
        ]);
      }, 150)
    );

    this.hoverLogsTimeout.push(
      setTimeout(() => {
        this.activeLogs.set([
          '[INIT] mounting ' + skill.name.toLowerCase() + ' node...',
          '[PARSE] analyzing stack: ' + skill.stack.slice(0, 3).join(', '),
          '[COMPILE] optimizing level: ' + skill.level + '%'
        ]);
      }, 300)
    );

    this.hoverLogsTimeout.push(
      setTimeout(() => {
        this.activeLogs.set([
          '[INIT] mounting ' + skill.name.toLowerCase() + ' node...',
          '[PARSE] analyzing stack: ' + skill.stack.slice(0, 3).join(', '),
          '[COMPILE] optimizing level: ' + skill.level + '%',
          '[SUCCESS] compiled in ' + skill.latency + 'ms // OK'
        ]);
      }, 450)
    );
  }

  onSkillLeave() {
    this.skillNodes.forEach(node => {
      node.isHovered = false;
    });
    this.hoveredSkillNode.set(null);

    // Clear hover timeouts
    this.hoverLogsTimeout.forEach(t => clearTimeout(t));
    this.hoverLogsTimeout = [];

    // Restore default logs
    this.activeLogs.set([
      'active connection nodes: 19',
      'memory allocation map check: OK',
      'Aether connection sweeps: active'
    ]);
    
    this.startIdleLogs();
  }

  private initSkillNodes() {
    this.skillNodes = [];
    const skillsData = [
      // Core Engine (Left-Top)
      { id: 'PY', name: 'Python', category: 'CORE ENGINE', level: 90, stack: ['Django', 'FastAPI', 'PyTorch', 'Pandas'], latency: 14, rx: -0.65, ry: -0.52, color: '#c5a880' },
      { id: 'JS', name: 'JavaScript', category: 'CORE ENGINE', level: 95, stack: ['ES6+', 'Node.js', 'React', 'Angular'], latency: 8, rx: -0.75, ry: -0.15, color: '#c5a880' },
      { id: 'JV', name: 'Java', category: 'CORE ENGINE', level: 85, stack: ['Spring Boot', 'Hibernate', 'JUnit'], latency: 19, rx: -0.85, ry: -0.45, color: '#c5a880' },
      { id: 'CP', name: 'C++', category: 'CORE ENGINE', level: 80, stack: ['STL', 'CMake', 'CUDA', 'OpenGL'], latency: 5, rx: -0.9, ry: -0.3, color: '#c5a880' },
      { id: 'SQL', name: 'SQL', category: 'CORE ENGINE', level: 92, stack: ['PostgreSQL', 'MongoDB', 'Indexing', 'Query Optimization'], latency: 11, rx: -0.5, ry: -0.22, color: '#c5a880' },
      
      // Client Frameworks (Right-Top)
      { id: 'RC', name: 'React.js', category: 'CLIENT FRAMEWORKS', level: 94, stack: ['Redux', 'Hooks', 'Next.js', 'Vite'], latency: 12, rx: 0.65, ry: -0.52, color: '#58a6ff' },
      { id: 'NX', name: 'Next.js', category: 'CLIENT FRAMEWORKS', level: 90, stack: ['App Router', 'SSR', 'Vercel', 'Tailwind'], latency: 16, rx: 0.85, ry: -0.4, color: '#58a6ff' },
      { id: 'ND', name: 'Node.js', category: 'CLIENT FRAMEWORKS', level: 92, stack: ['Express', 'NestJS', 'Sockets', 'Streams'], latency: 10, rx: 0.52, ry: -0.2, color: '#58a6ff' },
      { id: 'EX', name: 'Express.js', category: 'CLIENT FRAMEWORKS', level: 88, stack: ['REST APIs', 'Middleware', 'Router'], latency: 9, rx: 0.78, ry: -0.15, color: '#58a6ff' },
      
      // Data Architecture (Right-Bottom)
      { id: 'PG', name: 'PostgreSQL', category: 'DATA ARCHITECTURE', level: 92, stack: ['Row-Level Security', 'JSONB', 'Replication'], latency: 14, rx: 0.6, ry: 0.45, color: '#3fb950' },
      { id: 'MG', name: 'MongoDB', category: 'DATA ARCHITECTURE', level: 85, stack: ['Aggregation', 'Mongoose', 'Scaling'], latency: 18, rx: 0.75, ry: 0.25, color: '#3fb950' },
      
      // Cloud & DevOps (Left-Bottom)
      { id: 'AWS', name: 'AWS', category: 'CLOUD & DEVOPS', level: 88, stack: ['S3', 'EC2', 'Lambda', 'ECS'], latency: 28, rx: -0.55, ry: 0.45, color: '#f0883e' },
      { id: 'DK', name: 'Docker', category: 'CLOUD & DEVOPS', level: 90, stack: ['Containers', 'Compose', 'Buildkit'], latency: 8, rx: -0.4, ry: 0.2, color: '#f0883e' },
      { id: 'K8S', name: 'Kubernetes', category: 'CLOUD & DEVOPS', level: 82, stack: ['Pods', 'Deployments', 'Services', 'Helm'], latency: 34, rx: -0.75, ry: 0.35, color: '#f0883e' },
      
      // AI & Data Science (Center / Top-Center)
      { id: 'NLP', name: 'NLP', category: 'ARTIFICIAL INTELLIGENCE', level: 85, stack: ['SpaCy', 'NLTK', 'Word2Vec'], latency: 42, rx: -0.2, ry: -0.65, color: '#bc8cff' },
      { id: 'TR', name: 'Transformers', category: 'ARTIFICIAL INTELLIGENCE', level: 88, stack: ['Hugging Face', 'BERT', 'Attention'], latency: 55, rx: 0.2, ry: -0.65, color: '#bc8cff' },
      { id: 'AI', name: 'Generative AI', category: 'ARTIFICIAL INTELLIGENCE', level: 90, stack: ['OpenAI API', 'Gemini API', 'LangChain', 'LlamaIndex'], latency: 48, rx: 0.0, ry: -0.45, color: '#bc8cff' },
      { id: 'PD', name: 'Pandas', category: 'ARTIFICIAL INTELLIGENCE', level: 90, stack: ['DataFrame', 'Data Cleaning', 'NumPy'], latency: 24, rx: -0.22, ry: -0.15, color: '#bc8cff' },
      { id: 'NP', name: 'NumPy', category: 'ARTIFICIAL INTELLIGENCE', level: 92, stack: ['Arrays', 'Matrix Math', 'Linear Algebra'], latency: 15, rx: 0.22, ry: -0.15, color: '#bc8cff' }
    ];

    skillsData.forEach(sd => {
      this.skillNodes.push({
        id: sd.id,
        name: sd.name,
        category: sd.category,
        level: sd.level,
        stack: sd.stack,
        latency: sd.latency,
        x: 0, y: 0, z: 0,
        baseX: 0, baseY: 0, baseZ: 0,
        vx: 0, vy: 0, vz: 0,
        screenX: 0, screenY: 0,
        projectedScale: 1,
        projectedAlpha: 1,
        radius: 3.5, baseRadius: 3.5,
        isHovered: false,
        rx: sd.rx,
        ry: sd.ry,
        seedX: Math.random() * Math.PI * 2,
        seedY: Math.random() * Math.PI * 2,
        color: sd.color
      });
    });
  }

  private setupSkillsTelemetryCanvas() {
    const canvas = document.getElementById('canvas-skills-telemetry') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    // Track mouse gestures on the canvas
    let mouseX = -1000;
    let mouseY = -1000;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      // Translate mouse coordinates to CSS pixel space of the canvas
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      // Find closest node
      let closestNode: SkillNode | null = null;
      let minDist = 22; // px radius threshold
      this.skillNodes.forEach(node => {
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          minDist = dist;
          closestNode = node;
        }
      });

      if (closestNode) {
        if (this.hoveredSkillNode()?.id !== (closestNode as SkillNode).id) {
          this.onSkillHover(closestNode as SkillNode);
        }
      } else {
        if (this.hoveredSkillNode()) {
          this.onSkillLeave();
        }
      }
    });

    canvas.addEventListener('mouseleave', () => {
      mouseX = -1000;
      mouseY = -1000;
      this.onSkillLeave();
    });

    let phase = 0;
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      const centerX = w / 2;
      const centerY = h / 2;

      phase += 0.015;

      // 1. Draw Grid Backdrop
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 0.5;
      
      // Vertical grid lines
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw L-ticks in corners
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.25)';
      ctx.lineWidth = 1;
      // Top-left
      ctx.beginPath(); ctx.moveTo(6, 12); ctx.lineTo(6, 6); ctx.lineTo(12, 6); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(w - 6, 12); ctx.lineTo(w - 6, 6); ctx.lineTo(w - 12, 6); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(6, h - 12); ctx.lineTo(6, h - 6); ctx.lineTo(12, h - 6); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(w - 6, h - 12); ctx.lineTo(w - 6, h - 6); ctx.lineTo(w - 12, h - 6); ctx.stroke();

      // Faint central circular layout ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, w * 0.35, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Update Node Coordinates based on scale and buoyancy drift
      this.skillNodes.forEach(node => {
        const driftX = Math.sin(phase * 1.2 + node.seedX) * 6;
        const driftY = Math.cos(phase * 0.9 + node.seedY) * 6;
        node.x = centerX + node.rx * (w * 0.44) + driftX;
        node.y = centerY + node.ry * (h * 0.36) + driftY;
      });

      const hovered = this.hoveredSkillNode();

      // 3. Spawns Background system packets
      if (Math.random() < 0.012 && this.skillDataPackets.length < 8) {
        const start = this.skillNodes[Math.floor(Math.random() * this.skillNodes.length)];
        const categoryNodes = this.skillNodes.filter(n => n.category === start.category && n.id !== start.id);
        if (categoryNodes.length > 0) {
          const end = categoryNodes[Math.floor(Math.random() * categoryNodes.length)];
          this.skillDataPackets.push({
            startNode: start,
            endNode: end,
            progress: 0,
            speed: 0.008 + Math.random() * 0.012,
            color: 'rgba(255, 255, 255, 0.22)'
          } as any);
        }
      }

      // Update and draw packets
      for (let i = this.skillDataPackets.length - 1; i >= 0; i--) {
        const packet = this.skillDataPackets[i] as any;
        packet.progress += packet.speed;
        if (packet.progress >= 1.0) {
          this.skillDataPackets.splice(i, 1);
          continue;
        }

        const px = packet.startNode.x + (packet.endNode.x - packet.startNode.x) * packet.progress;
        const py = packet.startNode.y + (packet.endNode.y - packet.startNode.y) * packet.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.0, 0, Math.PI * 2);
        ctx.fillStyle = packet.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = packet.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. Draw links between nodes of the same category
      this.skillNodes.forEach((node, i) => {
        this.skillNodes.forEach((otherNode, j) => {
          if (i >= j) return;
          if (node.category === otherNode.category) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            
            const activeHover = (hovered && hovered.category === node.category);
            ctx.strokeStyle = activeHover 
              ? node.color + '44' // brighter glow on hover
              : 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = activeHover ? 0.95 : 0.5;
            ctx.stroke();
          }
        });
      });

      // Draw dashed integrated discipline links
      ctx.save();
      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 0.55;
      const bridges = [
        ['SQL', 'PG'],
        ['JS', 'RC'],
        ['ND', 'DK'],
        ['AI', 'PY'],
        ['AWS', 'PG']
      ];
      bridges.forEach(([id1, id2]) => {
        const n1 = this.skillNodes.find(n => n.id === id1);
        const n2 = this.skillNodes.find(n => n.id === id2);
        if (n1 && n2) {
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      });
      ctx.restore();

      // 5. Draw Node circles
      this.skillNodes.forEach(node => {
        const isActiveNode = (hovered && hovered.id === node.id);
        const isSameCategory = (hovered && hovered.category === node.category);

        if (isActiveNode) {
          // Crosshairs
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(0, node.y); ctx.lineTo(w, node.y);
          ctx.moveTo(node.x, 0); ctx.lineTo(node.x, h);
          ctx.stroke();

          // Reticle ring
          ctx.beginPath();
          ctx.arc(node.x, node.y, 8 + Math.sin(phase * 4.5) * 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = node.color + '66';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Active node drawing
          ctx.beginPath();
          ctx.arc(node.x, node.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 12;
          ctx.shadowColor = node.color;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Text label draw
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 7.5px monospace';
          ctx.fillText(`[${node.id}] ${node.name.toUpperCase()}`, node.x + 9, node.y - 3);
          ctx.fillStyle = node.color;
          ctx.font = '5.5px monospace';
          ctx.fillText(`${node.level}% COGNITIVE LOAD`, node.x + 9, node.y + 4.5);
        } else if (isSameCategory) {
          // Connected nodes in category draw
          ctx.beginPath();
          ctx.arc(node.x, node.y, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = node.color + 'cc';
          ctx.fill();
        } else if (hovered) {
          // Faded out other category nodes
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2.0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.fill();
        } else {
          // Default state (no hover)
          ctx.beginPath();
          ctx.arc(node.x, node.y, 3.0, 0, Math.PI * 2);
          ctx.fillStyle = node.color + '88';
          ctx.fill();
        }
      });

      // 6. Draw Dashboard Telemetry Text Readouts
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.font = '6.5px monospace';
      
      // Top-Left Info
      ctx.fillText('SYS: COGNITIVE_PLEXUS_MATRIX // v3.0.5', 14, 18);
      
      // Bottom-Left Info
      ctx.fillText(`ACTIVE NODE: ${hovered ? hovered.name.toUpperCase() : 'NONE'}`, 14, h - 14);

      // System load calculation
      const calculatedLoad = Math.floor(hovered ? (hovered.level + Math.sin(phase * 3) * 2) : (22 + Math.sin(phase * 0.5) * 4));
      
      // Top-Right Info
      ctx.fillText(`MATRIX LOAD: ${calculatedLoad}% // OK`, w - 110, 18);
      
      // Bottom-Right Info
      ctx.fillText('PLEXUS RENDER: 60 FPS // STABLE', w - 128, h - 14);

      ctx.restore();
      this.canvasAnimationIds[3] = requestAnimationFrame(draw);
    };

    draw();
  }

  private setupPingTelemetryCanvas() {
    const canvas = document.getElementById('canvas-ping-telemetry') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    const pings = Array(32).fill(14);
    let frameCount = 0;

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      // Update ping value every 15 frames
      frameCount++;
      if (frameCount % 15 === 0) {
        const lastVal = pings[pings.length - 1];
        const change = (Math.random() - 0.5) * 3;
        const newVal = Math.max(10, Math.min(28, lastVal + change));
        pings.shift();
        pings.push(newVal);
      }

      // Draw faint grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 0.5;

      const levels = [10, 20, 28];
      levels.forEach(lvl => {
        const y = h - ((lvl - 8) / 24) * h;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.font = '5px monospace';
        ctx.fillText(`${lvl}ms`, 4, y - 2);
      });

      // Plot ping array
      ctx.beginPath();
      const points: { x: number; y: number }[] = [];
      pings.forEach((val, i) => {
        const x = (i / (pings.length - 1)) * w;
        const y = h - ((val - 8) / 24) * h;
        points.push({ x, y });
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.strokeStyle = 'var(--color-accent)';
      ctx.lineWidth = 1.25;
      ctx.stroke();

      // Draw fill gradient
      if (points.length > 0) {
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(197, 168, 128, 0.08)');
        grad.addColorStop(1, 'rgba(197, 168, 128, 0.0)');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Draw active pulsing circle
      if (points.length > 0) {
        const last = points[points.length - 1];
        ctx.beginPath();
        ctx.arc(last.x, last.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#c5a880';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
      this.canvasAnimationIds[6] = requestAnimationFrame(draw);
    };

    draw();
  }

  // Mouse tilt parameters mapping
  onQuantumMouseMove(event: MouseEvent, cardEl: HTMLElement) {
    const rect = cardEl.getBoundingClientRect();
    this.mouseQuantum.x = event.clientX - rect.left - rect.width / 2;
    this.mouseQuantum.y = event.clientY - rect.top - rect.height / 2;
  }

  onAetherMouseMove(event: MouseEvent, cardEl: HTMLElement) {
    const rect = cardEl.getBoundingClientRect();
    this.mouseAether.x = event.clientX - rect.left;
    this.mouseAether.y = event.clientY - rect.top;
  }

  // Mouse glow tracking for project cards
  onCardMouseGlow(event: MouseEvent) {
    const card = (event.currentTarget as HTMLElement);
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  }

  openProject(project: Project) {
    this.selectedProject.set(project);
    
    setTimeout(() => {
      const overlay = document.querySelector('.editorial-modal-overlay') as HTMLElement;
      const panel = document.querySelector('.editorial-modal-panel') as HTMLElement;
      
      if (overlay && panel) {
        // Set initial hidden states for panel and sub-elements
        gsap.set(overlay, { opacity: 0 });
        gsap.set(panel, { y: 50, scale: 0.95, opacity: 0 });
        
        const subtitle = panel.querySelector('.modal-subtitle');
        const title = panel.querySelector('.modal-title');
        const desc = panel.querySelector('.modal-desc');
        const badges = panel.querySelectorAll('.modal-tech-badge');
        const actions = panel.querySelector('.modal-actions');
        
        gsap.set([subtitle, title, desc, actions], { y: 20, opacity: 0 });
        gsap.set(badges, { scale: 0.8, opacity: 0 });

        const tl = gsap.timeline();
        tl.to(overlay, { opacity: 1, duration: 0.45, ease: 'power2.out' });
        tl.to(panel, { 
          y: 0, 
          scale: 1, 
          opacity: 1, 
          duration: 0.65, 
          ease: 'power3.out' 
        }, '-=0.25');
        
        // Slide up modal sub-contents in staggered fashion
        tl.to(subtitle, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.4');
        tl.to(title, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.35');
        tl.to(desc, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3');
        
        // Stagger zoom-in tech badges
        if (badges.length > 0) {
          tl.to(badges, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(1.5)' }, '-=0.25');
        }
        
        // Fade in button actions
        tl.to(actions, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2');
      }
    }, 40);
  }

  closeProject() {
    const overlay = document.querySelector('.editorial-modal-overlay') as HTMLElement;
    const panel = document.querySelector('.editorial-modal-panel') as HTMLElement;
    
    if (overlay && panel) {
      const tl = gsap.timeline({
        onComplete: () => {
          this.selectedProject.set(null);
        }
      });
      tl.to(panel, { y: 40, scale: 0.94, opacity: 0, duration: 0.35, ease: 'power3.in' });
      tl.to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.3');
    } else {
      this.selectedProject.set(null);
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.formState.set('submitting');
    
    this.formLogs.update(logs => [
      ...logs, 
      '> [COMPILE] INITIATING SOCKET EMISSION...', 
      '> [SOCKET] CONNECTING TO SMTP RELAY...', 
      '> [SMTP] HANDSHAKE ESTABLISHED'
    ]);
    
    setTimeout(() => {
      this.formState.set('success');
      this.formLogs.update(logs => [
        ...logs, 
        '> [SMTP] MAIL TRANSMITTED SUCCESSFULLY [SUCCESS]', 
        '> [SOCKET] CLOSED SAFE'
      ]);
      const form = event.target as HTMLFormElement;
      form.reset();
    }, 1500);
  }
}
