import React, { useEffect, useRef } from 'react';

const InteractiveHeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const c = canvas;
    const context = ctx;

    let width = 0;
    let height = 0;
    let animationId = 0;
    const particles: { x: number; y: number; z: number; r: number; vx: number; vy: number }[] = [];
    // adapt settings for mobile / low-power
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = (navigator as any)?.connection;
    const saveData = connection?.saveData;
    const lowPower = (typeof window !== 'undefined' && window.innerWidth < 768) || !!saveData || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);

    if (prefersReducedMotion) return; // respect user preference

    const settings = lowPower
      ? { PARTICLE_COUNT: 30, lines: false, maxDpr: 1, fps: 30, pointerThrottle: 40 }
      : { PARTICLE_COUNT: 120, lines: true, maxDpr: 2, fps: 60, pointerThrottle: 16 };

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, settings.maxDpr);
      width = window.innerWidth;
      height = window.innerHeight;
      c.width = Math.floor(width * dpr);
      c.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < settings.PARTICLE_COUNT; i++) {
        const z = Math.random() * 1.8 + 0.2;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          r: (1.5 + Math.random() * 2) * (1 / z),
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
        });
      }
    }

    function draw() {
      if (!context) return;
      context.clearRect(0, 0, width, height);

      // subtle gradient background
      const g = context.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, 'rgba(6, 95, 212, 0.12)');
      g.addColorStop(1, 'rgba(99, 102, 241, 0.08)');
      context.fillStyle = g;
      context.fillRect(0, 0, width, height);

      // compute pointer influence
      const px = pointer.x || width / 2;
      const py = pointer.y || height / 2;

      for (const p of particles) {
        // move
        p.x += p.vx * (1 / p.z);
        p.y += p.vy * (1 / p.z);

        // wrap
        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50;
        if (p.y > height + 50) p.y = -50;

        // distance to pointer => strong repulsion within 200px radius
        const dx = p.x - px;
        const dy = p.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
        if (dist < 200) {
          const force = (1 - dist / 200) * 6 * (1 / p.z);
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // draw
        context.beginPath();
        const alpha = Math.max(0.12, 1 - p.z * 0.7);
        context.fillStyle = `rgba(10,20,60,${alpha})`;
        context.arc(p.x, p.y, Math.max(0.8, p.r), 0, Math.PI * 2);
        context.fill();
      }

      // connecting lines for nearby particles (cheap, limited)
      if (settings.lines) {
        context.beginPath();
        let drawn = 0;
        for (let i = 0; i < particles.length; i++) {
          const a = particles[i];
          for (let j = i + 1; j < particles.length && drawn < 120; j++) {
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90) {
              const lineAlpha = 0.08 * (1 - dist / 90);
              context.strokeStyle = `rgba(6,95,212,${lineAlpha})`;
              context.lineWidth = 1;
              context.beginPath();
              context.moveTo(a.x, a.y);
              context.lineTo(b.x, b.y);
              context.stroke();
              drawn++;
            }
          }
        }
      }
    }

    function animate() {
      draw();
      animationId = requestAnimationFrame(animate);
    }

    let lastPointerTime = 0;
    function onMouseMove(e: MouseEvent) {
      const now = performance.now();
      if (now - lastPointerTime < settings.pointerThrottle) return;
      lastPointerTime = now;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    }

    function onTouchMove(e: TouchEvent) {
      if (!e.touches || !e.touches[0]) return;
      const now = performance.now();
      if (now - lastPointerTime < settings.pointerThrottle) return;
      lastPointerTime = now;
      pointer.x = e.touches[0].clientX;
      pointer.y = e.touches[0].clientY;
    }

    let lastFrame = 0;
    const fpsInterval = 1000 / settings.fps;
    function animateLoop(t: number) {
      if (t - lastFrame >= fpsInterval) {
        draw();
        lastFrame = t;
      }
      animationId = requestAnimationFrame(animateLoop);
    }

    function onResize() {
      resize();
      initParticles();
    }

    let paused = false;
    function onVisibilityChange() {
      if (document.hidden) {
        paused = true;
        cancelAnimationFrame(animationId);
      } else if (paused) {
        paused = false;
        animationId = requestAnimationFrame(animateLoop);
      }
    }

    resize();
    initParticles();
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true } as any);
    document.addEventListener('visibilitychange', onVisibilityChange);

    animationId = requestAnimationFrame(animateLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove as any);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default InteractiveHeroBackground;
