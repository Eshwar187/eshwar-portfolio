import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, HostListener, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-visualizer',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #canvasEl style="width: 100%; height: 100%; display: block; border-radius: inherit; pointer-events: none;"></canvas>`,
})
export class AudioVisualizer implements OnInit, OnDestroy, AfterViewInit {
  private canvasRef = viewChild.required<HTMLCanvasElement | ElementRef<HTMLCanvasElement>>('canvasEl');

  private animationFrameId?: number;
  private targetAmplitudes: number[] = [];
  private currentAmplitudes: number[] = [];
  private numBars = 24;
  private globalIntensity = 0.15; // silent idle wiggle

  ngOnInit() {
    this.initBars();
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

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    // Excite the visualizer on any typing action!
    this.globalIntensity = 1.1;
    
    // Add random excitement spike to individual bars
    for (let i = 0; i < this.numBars; i++) {
      if (Math.random() > 0.4) {
        this.targetAmplitudes[i] = Math.random() * 0.95 + 0.05;
      }
    }
  }

  private getCanvasElement(): HTMLCanvasElement {
    const ref = this.canvasRef();
    return ref instanceof ElementRef ? ref.nativeElement : ref;
  }

  private setupCanvasSize() {
    const canvas = this.getCanvasElement();
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }

  private onResize = () => {
    this.setupCanvasSize();
  };

  private initBars() {
    this.targetAmplitudes = [];
    this.currentAmplitudes = [];
    for (let i = 0; i < this.numBars; i++) {
      this.targetAmplitudes.push(0);
      this.currentAmplitudes.push(0);
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
    ctx.save();
    
    // Scale for High-DPI screens
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const logicalWidth = width / window.devicePixelRatio;
    const logicalHeight = height / window.devicePixelRatio;

    const barWidth = logicalWidth / this.numBars - 2;
    const centerY = logicalHeight / 2;
    const maxBarHeight = logicalHeight * 0.85;

    // Decay global intensity exponentially
    this.globalIntensity = Math.max(0.12, this.globalIntensity * 0.935);

    const time = Date.now() * 0.005;

    for (let i = 0; i < this.numBars; i++) {
      // 1. Slow, drift idle values (sine waves)
      const idleValue = Math.sin(time + i * 0.45) * 0.08 + 0.1;

      // 2. Interpolate targets
      this.targetAmplitudes[i] += (idleValue - this.targetAmplitudes[i]) * 0.08;
      this.currentAmplitudes[i] += (this.targetAmplitudes[i] - this.currentAmplitudes[i]) * 0.16;

      const scale = this.currentAmplitudes[i] * this.globalIntensity;
      const barHeight = scale * maxBarHeight;

      // 3. Render glowing bars
      const x = i * (barWidth + 2);
      const y = centerY - barHeight / 2;

      // Color nodes: Neon Pink/Purple highlights depending on height
      const grad = ctx.createLinearGradient(x, y, x, y + barHeight);
      grad.addColorStop(0, 'rgba(255, 0, 85, 0.95)');    // Neon Pink
      grad.addColorStop(0.5, 'rgba(157, 78, 221, 0.75)'); // Purple
      grad.addColorStop(1, 'rgba(0, 240, 255, 0.95)');   // Neon Cyan

      ctx.fillStyle = grad;
      ctx.beginPath();
      // Draw rounded capsule bars
      if (barHeight > 4) {
        ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
        ctx.fill();
      } else {
        // Draw tiny dot when silent
        ctx.arc(x + barWidth / 2, centerY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
        ctx.fill();
      }
    }

    ctx.restore();
  }
}
