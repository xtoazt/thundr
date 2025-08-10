import React, { useEffect, useRef } from "react";

type ParticlesProps = {
  className?: string;
  /** Approx particle count at 1440x900. Scales with viewport. */
  baseCount?: number;
  /** 0-1 opacity for strokes */
  opacity?: number;
  /** Whether to draw connecting lines between nearby particles */
  link?: boolean;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
};

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * Canvas-based particle field with subtle motion and link lines.
 * Colors follow the brand gradient: blue → purple → pink.
 */
export const Particles: React.FC<ParticlesProps> = ({
  className,
  baseCount = 120,
  opacity = 0.5,
  link = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.clientWidth * ratio);
      canvas.height = Math.floor(canvas.clientHeight * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const area = canvas.clientWidth * canvas.clientHeight;
      const density = baseCount / (1440 * 900); // normalized density
      const count = Math.max(40, Math.floor(area * density));
      initParticles(count, canvas.clientWidth, canvas.clientHeight);
    };

    const initParticles = (count: number, w: number, h: number) => {
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: rand(0, w),
          y: rand(0, h),
          vx: rand(-0.25, 0.25),
          vy: rand(-0.25, 0.25),
          size: rand(0.6, 1.8),
          // hues across blue(210) -> purple(265) -> pink(320)
          hue: rand(210, 320),
        });
      }
      particlesRef.current = particles;
    };

    const step = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      const particles = particlesRef.current;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // gentle wrap
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // slow hue drift for shimmering effect
        p.hue += 0.02;
        if (p.hue > 320) p.hue = 210;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${Math.min(0.9, opacity + 0.2)})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (link) {
        // draw lines between nearby particles
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist2 = dx * dx + dy * dy;
            const maxDist = 140;
            if (dist2 < maxDist * maxDist) {
              const t = 1 - Math.sqrt(dist2) / maxDist;
              const hue = (a.hue + b.hue) / 2;
              ctx.strokeStyle = `hsla(${hue}, 80%, 65%, ${opacity * t})`;
              ctx.lineWidth = Math.max(0.4, t * 1.2);
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(step);
    };

    resize();
    animationRef.current = requestAnimationFrame(step);
    window.addEventListener("resize", resize);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [baseCount, opacity, link]);

  return (
    <canvas
      ref={canvasRef}
      className={[
        "pointer-events-none fixed inset-0 z-0 opacity-60",
        className || "",
      ].join(" ")}
    />
  );
};

export default Particles;


