"use client";

import { useEffect, useRef } from "react";
import type { Effects as EffectsConfig } from "@relic/schema";

function ActiveEffects({ effects }: { effects: EffectsConfig }) {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const wantsCursor = effects.cursor === "dot" || effects.cursor === "ring" || effects.cursor === "glow";

  useEffect(() => {
    if (!wantsCursor) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [wantsCursor]);

  useEffect(() => {
    if (!effects.particles.enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const count = effects.particles.density;
    const dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.4,
    }));

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#7c5cff";
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.35;
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", onResize);
    draw();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [effects.particles.enabled, effects.particles.density]);

  useEffect(() => {
    const audio = effects.audio;
    if (!audio) return;

    const el = new Audio(audio.src);
    el.volume = audio.volume;
    el.loop = audio.loop;

    const tryPlay = () => {
      el.play().catch(() => {
        // autoplay got blocked, which is what browsers do. try again on the
        // first gesture instead of popping an unmute button at people.
        const once = () => {
          el.play().catch(() => {});
          window.removeEventListener("pointerdown", once);
          window.removeEventListener("keydown", once);
        };
        window.addEventListener("pointerdown", once, { once: true });
        window.addEventListener("keydown", once, { once: true });
      });
    };

    tryPlay();

    return () => {
      el.pause();
      el.src = "";
    };
  }, [effects.audio]);

  if (!effects.particles.enabled && !wantsCursor) {
    return null;
  }

  return (
    <>
      {effects.particles.enabled ? <canvas ref={canvasRef} className="particles" aria-hidden /> : null}
      {wantsCursor ? (
        <>
          <div ref={dotRef} className="cursor-dot" aria-hidden />
          <div ref={ringRef} className="cursor-ring" aria-hidden />
        </>
      ) : null}
    </>
  );
}

// opt in per profile. nothing configured means this renders nothing and attaches
// no listeners, so the page is just the html the server sent.
export default function Effects({ effects }: { effects: EffectsConfig }) {
  const wantsCursor = effects.cursor === "dot" || effects.cursor === "ring" || effects.cursor === "glow";
  const hasEffects = wantsCursor || effects.particles.enabled || Boolean(effects.audio) || Boolean(effects.tilt);

  if (!hasEffects) {
    return null;
  }

  return <ActiveEffects effects={effects} />;
}
