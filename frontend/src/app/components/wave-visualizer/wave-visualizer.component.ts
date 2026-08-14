import { Component, ElementRef, Input, ViewChild, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wave-visualizer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="visualizer-wrapper">
      <canvas #waveCanvas></canvas>
    </div>
  `,
  styles: [`
    .visualizer-wrapper {
      width: 100%;
      height: 100%;
      min-height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      overflow: hidden;
      background: rgba(10, 15, 30, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  `]
})
export class WaveVisualizerComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('waveCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() isPlaying = false;
  @Input() beatFreq = 6.0; // Hz
  @Input() primaryColor = '#6366f1';
  @Input() secondaryColor = '#06b6d4';

  private animationId: number | null = null;
  private phase = 0;

  ngAfterViewInit() {
    this.startAnimation();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isPlaying'] && !changes['isPlaying'].firstChange) {
      if (this.isPlaying) {
        this.startAnimation();
      }
    }
  }

  ngOnDestroy() {
    this.stopAnimation();
  }

  private startAnimation() {
    this.stopAnimation();
    const render = () => {
      this.drawWave();
      this.animationId = requestAnimationFrame(render);
    };
    render();
  }

  private stopAnimation() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private drawWave() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 80);

    ctx.clearRect(0, 0, width, height);

    const speed = this.isPlaying ? 0.05 + (this.beatFreq * 0.005) : 0.01;
    this.phase += speed;

    const centerY = height / 2;
    const amplitude = this.isPlaying ? height * 0.3 : height * 0.1;

    // Left Channel Sine Curve
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = this.primaryColor;
    for (let x = 0; x < width; x++) {
      const y = centerY + Math.sin(x * 0.02 + this.phase) * amplitude;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Right Channel Sine Curve (Frequency Shifted by beatFreq)
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = this.secondaryColor;
    const beatShift = (this.beatFreq / 10.0) * 0.01;
    for (let x = 0; x < width; x++) {
      const y = centerY + Math.sin(x * (0.02 + beatShift) + this.phase * 1.2) * (amplitude * 0.85);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}
