import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, HostListener, viewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
}

@Component({
  selector: 'app-glass-orb',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #canvasEl style="width: 100%; height: 100%; display: block; border-radius: inherit; cursor: pointer;"></canvas>`,
})
export class GlassOrb implements OnInit, OnDestroy, AfterViewInit {
  private canvasRef = viewChild.required<HTMLCanvasElement | ElementRef<HTMLCanvasElement>>('canvasEl');

  private points: Point3D[] = [];
  private numPoints = 180;
  private radius = 120;
  private angleX = 0.005;
  private angleY = 0.008;
  private rotationX = 0;
  private rotationY = 0;
  private animationFrameId?: number;
  private morphFactor = signal(0.15); // Morph factor wiggles on hover
  private isHovered = false;

  private mouseX = 0;
  private mouseY = 0;
  private targetRotationX = 0;
  private targetRotationY = 0;

  private lastScrollY = 0;
  private scrollVelocity = 0;

  @HostListener('window:scroll')
  onScroll() {
    const currentScrollY = window.scrollY;
    const diff = currentScrollY - this.lastScrollY;
    this.scrollVelocity += diff * 0.003;
    this.lastScrollY = currentScrollY;
  }

  ngOnInit() {
    this.lastScrollY = window.scrollY;
    this.initPoints();
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
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }

  private onResize = () => {
    this.setupCanvasSize();
  };

  private initPoints() {
    // Generate a Fibonacci sphere for uniform point distribution
    this.points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians

    for (let i = 0; i < this.numPoints; i++) {
      const y = 1 - (i / (this.numPoints - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y

      const theta = phi * i; // Golden angle increment

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      this.points.push({
        x: x * this.radius,
        y: y * this.radius,
        z: z * this.radius,
        baseX: x * this.radius,
        baseY: y * this.radius,
        baseZ: z * this.radius,
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
    ctx.save();
    
    // Scale for High-DPI screens
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const logicalWidth = width / window.devicePixelRatio;
    const logicalHeight = height / window.devicePixelRatio;
    
    const centerX = logicalWidth / 2;
    const centerY = logicalHeight / 2;
    const fov = 400; // Perspective field of view

    // Smooth inertia for mouse rotation offsets
    this.rotationX += (this.targetRotationX - this.rotationX) * 0.08;
    this.rotationY += (this.targetRotationY - this.rotationY) * 0.08;

    // Decay scroll momentum
    this.scrollVelocity *= 0.94;

    const currentAngleX = this.angleX + this.rotationY;
    const currentAngleY = this.angleY + this.rotationX + this.scrollVelocity;

    const cosX = Math.cos(currentAngleX);
    const sinX = Math.sin(currentAngleX);
    const cosY = Math.cos(currentAngleY);
    const sinY = Math.sin(currentAngleY);

    const time = Date.now() * 0.0015;
    const activeMorph = this.isHovered ? 0.35 : 0.12;

    // Projected coordinates storage
    const projected: { x: number; y: number; z: number; size: number }[] = [];

    this.points.forEach((p, idx) => {
      // 1. Organic Liquid Morphing displacement (3D waves)
      // Displace along spherical normal vectors using sine waves
      const normalX = p.baseX / this.radius;
      const normalY = p.baseY / this.radius;
      const normalZ = p.baseZ / this.radius;

      const noise = Math.sin(normalX * 4 + time) * Math.cos(normalY * 4 - time * 0.8) * Math.sin(normalZ * 4 + time * 0.5);
      const disp = noise * this.radius * activeMorph;

      const currentX = p.baseX + normalX * disp;
      const currentY = p.baseY + normalY * disp;
      const currentZ = p.baseZ + normalZ * disp;

      // 2. 3D Rotation Math
      // Y-axis rotation
      let x1 = currentX * cosY - currentZ * sinY;
      let z1 = currentZ * cosY + currentX * sinY;
      
      // X-axis rotation
      let y2 = currentY * cosX - z1 * sinX;
      let z2 = z1 * cosX + currentY * sinX;

      // Update actual point coordinates
      p.x = x1;
      p.y = y2;
      p.z = z2;

      // 3. Perspective Projection
      const scale = fov / (fov + z2);
      const screenX = centerX + x1 * scale;
      const screenY = centerY + y2 * scale;
      
      // Relative node size based on depth
      const size = Math.max(1, (z2 + this.radius) / (this.radius * 2) * 4.2 + 0.8);

      projected.push({
        x: screenX,
        y: screenY,
        z: z2,
        size: size
      });
    });

    // 4. Draw wireframe connecting lines (glass plexus net)
    // Connect points that are mathematically close to each other
    ctx.lineWidth = 0.55;
    for (let i = 0; i < projected.length; i++) {
      const p1 = projected[i];
      const orig1 = this.points[i];
      let connections = 0;

      for (let j = i + 1; j < projected.length; j++) {
        // Connect only if they are near each other on the Fibonacci sphere
        const orig2 = this.points[j];
        const dx = orig1.baseX - orig2.baseX;
        const dy = orig1.baseY - orig2.baseY;
        const dz = orig1.baseZ - orig2.baseZ;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 46 && connections < 4) {
          const p2 = projected[j];
          
          // Connectors color based on Z-depth (front is gold, back is muted silver)
          const avgZ = (p1.z + p2.z) / 2;
          const zDepthRatio = Math.max(0, Math.min(1, (avgZ + this.radius) / (this.radius * 2))); // 0 to 1
          
          // Interpolate color values: Front (gold) vs Back (silver/translucent)
          const r = Math.floor(197 - zDepthRatio * 77);
          const g = Math.floor(168 - zDepthRatio * 48);
          const b = Math.floor(128 - zDepthRatio * 3);
          const alpha = (1 - zDepthRatio) * 0.4 + 0.05;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.stroke();
          
          connections++;
        }
      }
    }

    // 5. Draw glowing nodes
    projected.forEach((p) => {
      const zDepthRatio = Math.max(0, Math.min(1, (p.z + this.radius) / (this.radius * 2))); // 0 to 1
      
      // Node colors based on depth (Front = silver/white, Back = gold)
      const r = Math.floor(245 - zDepthRatio * 48);
      const g = Math.floor(245 - zDepthRatio * 77);
      const b = Math.floor(247 - zDepthRatio * 119);
      const alpha = (1 - zDepthRatio) * 0.75 + 0.15;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.fill();
    });

    ctx.restore();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const canvas = this.getCanvasElement();
    const rect = canvas.getBoundingClientRect();
    
    // Normalize coordinates centered on canvas
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    // Scale rotations
    this.targetRotationX = (x / rect.width) * 0.18;
    this.targetRotationY = (y / rect.height) * -0.18;
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isHovered = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isHovered = false;
    this.targetRotationX = 0;
    this.targetRotationY = 0;
  }
}
