import { Component, ElementRef, OnInit, HostListener, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

interface Project {
  id: number;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  tech: string[];
  link: string;
}

@Component({
  selector: 'app-project-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-preview.html',
  styleUrl: './project-preview.css',
})
export class ProjectPreview implements OnInit {
  activeProjectId = input<number | null>(null);
  projects = input<Project[]>([]);

  private containerRef = viewChild.required<ElementRef<HTMLDivElement>>('previewContainer');

  ngOnInit() {
    // Component init
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const container = this.containerRef().nativeElement;

    // Follow the cursor with a spring damping inertia lag
    gsap.to(container, {
      x: event.clientX,
      y: event.clientY,
      duration: 0.4,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  }
}
