'use client';

import { useEffect, useRef } from 'react';

const CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>{}[];:=+-*/\\|!@#$%^&';
const FONT_SIZE = 14;

// Falling katakana/hex rain behind the UI, canvas-driven for performance at
// full-viewport scale. Colors are read from CSS vars so it follows theme swaps.
export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / FONT_SIZE);
      drops = Array(columns).fill(1);
    };
    resize();
    window.addEventListener('resize', resize);

    const style = getComputedStyle(document.documentElement);
    const getColor = (name: string) => style.getPropertyValue(name).trim() || '#888';

    const interval = setInterval(() => {
      const primary = getColor('--primary');
      const cyan = getColor('--cyan');
      const bg = getColor('--background');

      ctx.fillStyle = `color-mix(in oklch, ${bg} 8%, transparent)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_SIZE}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        ctx.fillStyle = Math.random() > 0.5 ? primary : cyan;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 50);

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(interval);
    };
  }, []);

  return <canvas ref={canvasRef} className="hud-matrix" aria-hidden="true" />;
}
