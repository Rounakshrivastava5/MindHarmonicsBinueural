import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  color: string;
}

@Component({
  selector: 'app-ambient-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ambient-bg-wrapper">
      <!-- Animated Liquid Gradient Orbs -->
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="orb orb-4"></div>

      <!-- Particle Canvas Overlay -->
      <canvas #canvas class="particle-canvas"></canvas>
    </div>
  `,
  styles: [`
    .ambient-bg-wrapper {
      position: fixed;
      inset: 0;
      z-index: -1;
      overflow: hidden;
      pointer-events: none;
      background: var(--bg-main);
      transition: background 0.5s ease;
    }

    /* Floating Liquid Aurora Orbs */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      opacity: 0.45;
      mix-blend-mode: screen;
      will-change: transform;
    }

    .orb-1 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, rgba(99, 102, 241, 0) 70%);
      top: -100px;
      left: -100px;
      animation: floatOrb1 22s infinite ease-in-out alternate;
    }

    .orb-2 {
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.75) 0%, rgba(6, 182, 212, 0) 70%);
      bottom: -150px;
      right: -100px;
      animation: floatOrb2 26s infinite ease-in-out alternate;
    }

    .orb-3 {
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.7) 0%, rgba(139, 92, 246, 0) 70%);
      top: 35%;
      left: 45%;
      animation: floatOrb3 20s infinite ease-in-out alternate;
    }

    .orb-4 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.5) 0%, rgba(245, 158, 11, 0) 70%);
      bottom: 20%;
      left: 10%;
      animation: floatOrb4 24s infinite ease-in-out alternate;
    }

    .particle-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    /* Floating Keyframe Animations */
    @keyframes floatOrb1 {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(120px, 150px) scale(1.15); }
      100% { transform: translate(-60px, 200px) scale(0.95); }
    }

    @keyframes floatOrb2 {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(-140px, -180px) scale(1.2); }
      100% { transform: translate(80px, -100px) scale(0.9); }
    }

    @keyframes floatOrb3 {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(-180px, 120px) scale(1.1); }
      100% { transform: translate(140px, -160px) scale(1.05); }
    }

    @keyframes floatOrb4 {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(160px, -140px) scale(1.15); }
      100% { transform: translate(-100px, -80px) scale(0.95); }
    }
  `]
})
export class AmbientBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  themeService = inject(ThemeService);

  private animFrameId: number | null = null;
  private particles: Particle[] = [];
  private ctx: CanvasRenderingContext2D | null = null;

  ngAfterViewInit() {
    this.initCanvas();
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener('resize', this.onResize);
  }

  private onResize = () => {
    this.initCanvas();
  };

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.ctx = canvas.getContext('2d');

    // Create 45 ambient floating particles
    const particleColors = ['#6366f1', '#06b6d4', '#8b5cf6', '#38bdf8', '#f59e0b'];
    this.particles = [];
    
    for (let i = 0; i < 45; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.5 + 1.0,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1,
        maxAlpha: Math.random() * 0.6 + 0.2,
        color: particleColors[Math.floor(Math.random() * particleColors.length)]
      });
    }

    this.render();
  }

  private render = () => {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.ctx) return;

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Pulse alpha
      p.alpha += (Math.random() - 0.5) * 0.01;
      p.alpha = Math.max(0.1, Math.min(p.maxAlpha, p.alpha));

      // Draw particle glow
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
      this.ctx.restore();
    }

    this.animFrameId = requestAnimationFrame(this.render);
  };
}
