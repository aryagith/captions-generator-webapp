'use client';

import { useEffect, useRef } from 'react';

const COLORS = [
  ['#3b82f6', '#22d3ee', '#4ade80'],
  ['#22c55e', '#a3e635', '#facc15'],
  ['#f59e0b', '#f97316', '#ef4444'],
  ['#06b6d4', '#3b82f6', '#8b5cf6'],
  ['#ef4444', '#f43f5e', '#fbbf24'],
  ['#14b8a6', '#2dd4bf', '#38bdf8'],
];

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgba(hex, a) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

function createBlobs(w, h) {
  return COLORS.map((pair, i) => {
    const r = Math.min(w, h) * (0.18 + (i % 3) * 0.045);
    return {
      x: w * (0.18 + Math.random() * 0.64),
      y: h * (0.2 + Math.random() * 0.55),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.22,
      r,
      baseR: r,
      phase: Math.random() * Math.PI * 2,
      speed: 0.004 + Math.random() * 0.006,
      colors: pair,
      mass: 0.75 + Math.random() * 0.5,
      stretch: 1,
      squash: 1,
      angle: 0,
    };
  });
}

export default function ChromaBackground() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const mouse = {
      x: 0.5,
      y: 0.5,
      tx: 0.5,
      ty: 0.5,
      vx: 0,
      vy: 0,
      px: 0.5,
      py: 0.5,
    };
    let blobs = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let t = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!blobs.length) {
        blobs = createBlobs(w, h);
      } else {
        blobs.forEach((b, i) => {
          b.baseR = Math.min(w, h) * (0.18 + (i % 3) * 0.045);
        });
      }
    }

    function onPointer(e) {
      mouse.tx = e.clientX / w;
      mouse.ty = e.clientY / h;
    }

    function onLeave() {
      mouse.tx = 0.5;
      mouse.ty = 0.5;
    }

    function paintFrame() {
      t += 1;

      mouse.vx = mouse.tx - mouse.px;
      mouse.vy = mouse.ty - mouse.py;
      mouse.px = mouse.tx;
      mouse.py = mouse.ty;

      mouse.x += (mouse.tx - mouse.x) * 0.07;
      mouse.y += (mouse.ty - mouse.y) * 0.07;

      const mx = mouse.x * w;
      const my = mouse.y * h;
      const reach = Math.min(w, h) * 0.42;

      for (const b of blobs) {
        const buoyancy = Math.sin(t * b.speed + b.phase) * 0.04;
        b.vy += buoyancy * (0.45 / b.mass);
        b.vx += Math.sin(t * b.speed * 0.7 + b.phase) * 0.008;
        b.vy += Math.cos(t * b.speed * 0.9 + b.phase * 1.3) * 0.006;

        const dx = mx - b.x;
        const dy = my - b.y;
        const dist = Math.hypot(dx, dy) || 1;
        const influence = Math.max(0, 1 - dist / reach);

        // Gentle viscous pull — keep lava motion primary
        const pull = influence * influence * 0.022 * b.mass;
        b.vx += (dx / dist) * pull;
        b.vy += (dy / dist) * pull;

        // Mild reshape when the pointer is nearby
        const inside = Math.max(0, 1 - dist / (b.baseR * 1.05));
        const speedBoost = Math.min(0.18, Math.hypot(mouse.vx, mouse.vy) * 2.5);
        const targetStretch = 1 + inside * 0.28 + speedBoost * inside;
        const targetSquash = 1 - inside * 0.16;
        b.stretch += (targetStretch - b.stretch) * 0.06;
        b.squash += (targetSquash - b.squash) * 0.06;

        const targetAngle =
          inside > 0.08
            ? Math.atan2(dy, dx) + Math.PI / 2
            : b.angle + Math.sin(t * b.speed + b.phase) * 0.015;
        let da = targetAngle - b.angle;
        while (da > Math.PI) da -= Math.PI * 2;
        while (da < -Math.PI) da += Math.PI * 2;
        b.angle += da * (0.035 + inside * 0.04);

        b.r = b.baseR * (1 + inside * 0.12 + influence * 0.03);

        b.vx *= 0.978;
        b.vy *= 0.978;
        // Cap velocity so mouse can't fling blobs
        const speed = Math.hypot(b.vx, b.vy);
        const maxSpeed = 1.35;
        if (speed > maxSpeed) {
          b.vx = (b.vx / speed) * maxSpeed;
          b.vy = (b.vy / speed) * maxSpeed;
        }
        b.x += b.vx;
        b.y += b.vy;

        const pad = b.r * 0.3;
        if (b.x < pad) {
          b.x = pad;
          b.vx *= -0.55;
        } else if (b.x > w - pad) {
          b.x = w - pad;
          b.vx *= -0.55;
        }
        if (b.y < pad) {
          b.y = pad;
          b.vy *= -0.5;
        } else if (b.y > h - pad) {
          b.y = h - pad;
          b.vy *= -0.5;
        }
      }

      for (let i = 0; i < blobs.length; i++) {
        for (let j = i + 1; j < blobs.length; j++) {
          const a = blobs[i];
          const b = blobs[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 1;
          const min = (a.r + b.r) * 0.5;
          if (dist < min * 1.7) {
            const force = ((min * 1.7 - dist) / (min * 1.7)) * 0.01;
            const nx = dx / dist;
            const ny = dy / dist;
            const sign = dist < min * 0.65 ? -1 : 1;
            a.vx += nx * force * sign;
            a.vy += ny * force * sign;
            b.vx -= nx * force * sign;
            b.vy -= ny * force * sign;
          }
        }
      }

      ctx.clearRect(0, 0, w, h);
      // Keep pure color on black — no additive white blowout
      ctx.globalCompositeOperation = 'source-over';

      for (const b of blobs) {
        const [c0, c1, c2] = b.colors;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);
        ctx.scale(b.stretch, b.squash);

        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, b.r);
        g.addColorStop(0, rgba(c0, 0.9));
        g.addColorStop(0.2, rgba(c1, 0.7));
        g.addColorStop(0.45, rgba(c2 || c1, 0.4));
        g.addColorStop(0.7, rgba(c1, 0.14));
        g.addColorStop(0.88, rgba(c0, 0.04));
        g.addColorStop(1, rgba(c0, 0));

        ctx.beginPath();
        ctx.fillStyle = g;
        ctx.arc(0, 0, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      wrap.style.setProperty('--mx', String(mouse.x));
      wrap.style.setProperty('--my', String(mouse.y));
    }

    function step() {
      paintFrame();
      raf = requestAnimationFrame(step);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onPointer, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    if (reduced) {
      paintFrame();
    } else {
      raf = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="chroma-scene" ref={wrapRef} aria-hidden="true">
      <div className="liquid-field">
        <canvas ref={canvasRef} className="liquid-canvas" />
      </div>
      <div className="grain-layer grain-fine" />
      <div className="grain-layer grain-soft" />
    </div>
  );
}
