import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, viewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ArchNode {
  id: string;
  name: string;
  sub: string;
  x: number;
  y: number;
  status: 'OPTIMAL' | 'WARMING' | 'LOAD' | 'FAILOVER' | 'HIT';
  latency: number;
  icon: string;
}

export interface Packet {
  id: number;
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
  label?: string;
}

export interface ServiceItem {
  name: string;
  tech: string;
  status: string;
  latency: number;
}

@Component({
  selector: 'app-architecture-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './architecture-simulator.html',
  styleUrl: './architecture-simulator.css'
})
export class ArchitectureSimulator implements OnInit, OnDestroy, AfterViewInit {
  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('archCanvas');

  activeMode = signal<'normal' | 'load_test' | 'cache_miss' | 'db_failover'>('normal');
  concurrencyRate = signal<number>(2400);
  avgLatency = signal<number>(14.2);
  throughputP99 = signal<number>(28.5);
  cacheHitRatio = signal<number>(98.4);
  activeStatus = signal<string>('SYS.READY // CLUSTER ONLINE');

  nodes: ArchNode[] = [
    { id: 'CLIENT', name: 'Client Traffic', sub: 'Edge Requests', x: 0.1, y: 0.5, status: 'OPTIMAL', latency: 2, icon: '🌐' },
    { id: 'CDN', name: 'Cloudflare Edge', sub: 'WAF & SSL', x: 0.26, y: 0.5, status: 'OPTIMAL', latency: 4, icon: '⚡' },
    { id: 'GW', name: 'Go API Gateway', sub: 'Rate Limiting / Router', x: 0.44, y: 0.35, status: 'OPTIMAL', latency: 8, icon: '🛡️' },
    { id: 'REDIS', name: 'Redis Cache', sub: 'Session / Auth Store', x: 0.44, y: 0.68, status: 'OPTIMAL', latency: 1.5, icon: '🚀' },
    { id: 'SRV', name: 'Microservices', sub: 'Go / Node / Gemini AI', x: 0.68, y: 0.35, status: 'OPTIMAL', latency: 16, icon: '🧠' },
    { id: 'DB', name: 'PostgreSQL Pool', sub: 'Primary + Read Replicas', x: 0.68, y: 0.68, status: 'OPTIMAL', latency: 18, icon: '💾' },
    { id: 'K8S', name: 'K8s Cluster', sub: 'Auto-Scaling Pods', x: 0.9, y: 0.5, status: 'OPTIMAL', latency: 3, icon: '☸️' }
  ];

  services = signal<ServiceItem[]>([
    { name: 'Go API Gateway', tech: 'Go / Gin Router', status: 'RUNNING', latency: 1.4 },
    { name: 'Auth & Redis Store', tech: 'Redis Cluster / JWT', status: 'RUNNING', latency: 1.2 },
    { name: 'Gemini AI Engine', tech: 'PyTorch / Gemini API', status: 'RUNNING', latency: 110.5 },
    { name: 'PostgreSQL Primary', tech: 'PG 16 / RLS Isolation', status: 'PRIMARY', latency: 3.8 },
    { name: 'Kafka Event Bus', tech: 'Distributed Messaging', status: 'STREAMING', latency: 0.6 }
  ]);

  packets: Packet[] = [];
  logs = signal<string[]>([
    '[INIT] System Architecture Telemetry Engine Active',
    '[OK] Distributed Cluster Status: 100% Operational',
    '[NET] Edge ingress connected on port 443'
  ]);

  cliHistory = signal<string[]>([
    '$ system-cli --version',
    'Senior Fullstack System Architecture CLI v4.2.0',
    'Type a command or click quick action buttons below...',
    '$ status',
    '[OK] Cluster Nodes: 7/7 Operational | P99 Latency: 14.2ms'
  ]);

  currentInput = '';

  private animId?: number;
  private packetIdCounter = 0;

  ngOnInit() {}

  ngOnDestroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  ngAfterViewInit() {
    this.startCanvasAnimation();
  }

  setMode(mode: 'normal' | 'load_test' | 'cache_miss' | 'db_failover') {
    this.activeMode.set(mode);
    if (mode === 'normal') {
      this.concurrencyRate.set(2400);
      this.avgLatency.set(14.2);
      this.throughputP99.set(28.5);
      this.cacheHitRatio.set(98.4);
      this.activeStatus.set('SYS.NORMAL // STABLE INGRESS');
      this.services.set([
        { name: 'Go API Gateway', tech: 'Go / Gin Router', status: 'RUNNING', latency: 1.4 },
        { name: 'Auth & Redis Store', tech: 'Redis Cluster / JWT', status: 'RUNNING', latency: 1.2 },
        { name: 'Gemini AI Engine', tech: 'PyTorch / Gemini API', status: 'RUNNING', latency: 110.5 },
        { name: 'PostgreSQL Primary', tech: 'PG 16 / RLS Isolation', status: 'PRIMARY', latency: 3.8 },
        { name: 'Kafka Event Bus', tech: 'Distributed Messaging', status: 'STREAMING', latency: 0.6 }
      ]);
      this.addLog('[MODE] Switched to Nominal Production Ingress');
    } else if (mode === 'load_test') {
      this.concurrencyRate.set(18500);
      this.avgLatency.set(22.8);
      this.throughputP99.set(45.1);
      this.cacheHitRatio.set(97.1);
      this.activeStatus.set('SYS.STRESS // 18.5k REQ/S CONCURRENCY');
      this.services.set([
        { name: 'Go API Gateway', tech: 'Go / Gin Router', status: 'HIGH LOAD', latency: 4.8 },
        { name: 'Auth & Redis Store', tech: 'Redis Cluster / JWT', status: 'WARM', latency: 2.1 },
        { name: 'Gemini AI Engine', tech: 'PyTorch / Gemini API', status: 'BURST', latency: 145.2 },
        { name: 'PostgreSQL Primary', tech: 'PG 16 / RLS Isolation', status: 'BUSY', latency: 9.4 },
        { name: 'Kafka Event Bus', tech: 'Distributed Messaging', status: 'STREAMING', latency: 1.1 }
      ]);
      this.addLog('[WARM] High Concurrency Load Test Executing: 18.5k req/s');
      this.execCommand('status');
    } else if (mode === 'cache_miss') {
      this.concurrencyRate.set(4100);
      this.avgLatency.set(48.6);
      this.throughputP99.set(92.0);
      this.cacheHitRatio.set(12.3);
      this.activeStatus.set('SYS.CACHE_MISS // BYPASS TO DB LAYER');
      this.services.set([
        { name: 'Go API Gateway', tech: 'Go / Gin Router', status: 'RUNNING', latency: 1.6 },
        { name: 'Auth & Redis Store', tech: 'Redis Cluster / JWT', status: 'DEGRADED', latency: 18.2 },
        { name: 'Gemini AI Engine', tech: 'PyTorch / Gemini API', status: 'RUNNING', latency: 112.0 },
        { name: 'PostgreSQL Primary', tech: 'PG 16 / RLS Isolation', status: 'HIGH QPS', latency: 24.5 },
        { name: 'Kafka Event Bus', tech: 'Distributed Messaging', status: 'STREAMING', latency: 0.8 }
      ]);
      this.addLog('[ALERT] Cache Eviction Test: Querying PostgreSQL Direct');
    } else if (mode === 'db_failover') {
      this.concurrencyRate.set(6200);
      this.avgLatency.set(31.4);
      this.throughputP99.set(58.0);
      this.cacheHitRatio.set(96.8);
      this.activeStatus.set('SYS.FAILOVER // REPLICA 02 PROMOTED');
      this.services.set([
        { name: 'Go API Gateway', tech: 'Go / Gin Router', status: 'RUNNING', latency: 2.1 },
        { name: 'Auth & Redis Store', tech: 'Redis Cluster / JWT', status: 'RUNNING', latency: 1.4 },
        { name: 'Gemini AI Engine', tech: 'PyTorch / Gemini API', status: 'RUNNING', latency: 115.0 },
        { name: 'PostgreSQL Replica 02', tech: 'PG Promoted Primary', status: 'FAILOVER', latency: 6.2 },
        { name: 'Kafka Event Bus', tech: 'Distributed Messaging', status: 'STREAMING', latency: 0.7 }
      ]);
      this.addLog('[HA] Primary DB Heartbeat Timed Out -> Replica Promoted');
    }
  }

  execCommand(cmd: string) {
    const cleanCmd = cmd.trim().toLowerCase();
    const history = [...this.cliHistory(), `$ ${cmd}`];

    if (cleanCmd === 'status') {
      history.push(`[OK] Ingress Rate: ${this.concurrencyRate()} req/s | P99: ${this.throughputP99()}ms | Status: ${this.activeStatus()}`);
    } else if (cleanCmd === 'benchmark') {
      history.push('[BENCH] Executing 100k requests test across 12 pods...');
      history.push('[OK] 99.98% Success Rate | P50: 14.2ms | Max Throughput: 52,000 req/s');
    } else if (cleanCmd === 'services') {
      this.services().forEach(s => {
        history.push(`  • ${s.name} (${s.tech}) -> ${s.status} [${s.latency}ms]`);
      });
    } else if (cleanCmd === 'stack') {
      history.push('Senior Fullstack Tech Stack:');
      history.push('  Languages: Go, TypeScript, Python, C++, SQL');
      history.push('  Backend: Node.js, Express, Gin, PostgreSQL, Redis, Kafka');
      history.push('  Frontend: Angular, Next.js, React, Canvas2D, GSAP');
      history.push('  DevOps: Docker, K8s, Terraform, GitHub Actions, Vercel');
    } else if (cleanCmd === 'clear') {
      this.cliHistory.set([]);
      return;
    } else {
      history.push(`Unknown command: '${cmd}'. Available: status, benchmark, services, stack, clear`);
    }

    this.cliHistory.set(history.slice(-14));
  }

  onCliSubmit(e: Event) {
    e.preventDefault();
    if (!this.currentInput.trim()) return;
    this.execCommand(this.currentInput);
    this.currentInput = '';
  }

  private addLog(msg: string) {
    const timeStr = new Date().toISOString().substring(11, 19);
    const updated = [`[${timeStr}] ${msg}`, ...this.logs().slice(0, 4)];
    this.logs.set(updated);
  }

  private startCanvasAnimation() {
    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);

    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      // Connections topology definition
      const links: [number, number, string][] = [
        [0, 1, 'rgba(255, 59, 48, 0.3)'], // Client -> CDN
        [1, 2, 'rgba(255, 59, 48, 0.3)'], // CDN -> GW
        [2, 3, 'rgba(56, 189, 248, 0.35)'],// GW -> Redis
        [2, 4, 'rgba(255, 59, 48, 0.3)'], // GW -> Services
        [3, 5, 'rgba(16, 185, 129, 0.35)'],// Redis -> DB
        [4, 5, 'rgba(255, 59, 48, 0.3)'], // Services -> DB
        [4, 6, 'rgba(245, 158, 11, 0.35)'],// Services -> K8s
        [5, 6, 'rgba(255, 59, 48, 0.3)']  // DB -> K8s
      ];

      // Draw connection vectors
      links.forEach(([from, to, strokeColor]) => {
        const n1 = this.nodes[from];
        const n2 = this.nodes[to];
        const x1 = n1.x * w;
        const y1 = n1.y * h;
        const x2 = n2.x * w;
        const y2 = n2.y * h;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Spawn traffic packets based on active mode
      const spawnChance = this.activeMode() === 'load_test' ? 0.18 : 0.05;
      if (Math.random() < spawnChance) {
        const linkChoice = links[Math.floor(Math.random() * links.length)];
        this.packets.push({
          id: ++this.packetIdCounter,
          fromNode: linkChoice[0],
          toNode: linkChoice[1],
          progress: 0,
          speed: 0.015 + Math.random() * 0.015,
          color: this.activeMode() === 'cache_miss' ? '#ff3b30' : '#ff5252'
        });
      }

      // Update and draw packets
      for (let i = this.packets.length - 1; i >= 0; i--) {
        const p = this.packets[i];
        p.progress += p.speed;
        if (p.progress >= 1) {
          this.packets.splice(i, 1);
          continue;
        }

        const n1 = this.nodes[p.fromNode];
        const n2 = this.nodes[p.toNode];
        const px = (n1.x + (n2.x - n1.x) * p.progress) * w;
        const py = (n1.y + (n2.y - n1.y) * p.progress) * h;

        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw nodes
      this.nodes.forEach((node) => {
        const nx = node.x * w;
        const ny = node.y * h;

        ctx.beginPath();
        ctx.arc(nx, ny, 15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(13, 13, 16, 0.85)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 59, 48, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Node label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8.5px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, nx, ny - 20);

        ctx.fillStyle = 'rgba(255, 59, 48, 0.8)';
        ctx.font = '7px monospace';
        ctx.fillText(node.sub, nx, ny + 24);
      });

      ctx.restore();
      this.animId = requestAnimationFrame(render);
    };

    this.animId = requestAnimationFrame(render);
  }
}
