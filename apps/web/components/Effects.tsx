"use client";

import { useEffect, useRef } from "react";
import type { Effects as EffectsConfig } from "@relic/schema";

// matchMedia is missing in some environments (jsdom in tests, very old
// browsers), so a missing api means "no", never a crash.
const matches = (query: string) =>
  typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(query).matches;

const reducedMotion = () => matches("(prefers-reduced-motion: reduce)");

const finePointer = () => matches("(hover: hover) and (pointer: fine)");

function ActiveEffects({ effects }: { effects: EffectsConfig }) {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const cursor = effects.cursor;
  const wantsCursor = cursor === "dot" || cursor === "ring" || cursor === "glow";

  // custom cursor. only for a real mouse, only shown once it has actually moved,
  // and the native pointer is hidden only while ours is painted.
  useEffect(() => {
    if (!wantsCursor || !finePointer()) return;

    const root = document.documentElement;
    const reduce = reducedMotion();
    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let frame = 0;
    let visible = false;

    const els = () => [dotRef.current, ringRef.current, glowRef.current].filter(Boolean) as HTMLDivElement[];

    const paint = () => {
      const at = (el: HTMLElement | null, px: number, py: number) => {
        if (el) el.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
      };
      at(dotRef.current, x, y);
      at(ringRef.current, rx, ry);
      at(glowRef.current, rx, ry);
    };

    const tick = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      paint();
      // settle instead of spinning forever once the trailing ring has caught up
      if (Math.abs(x - rx) < 0.1 && Math.abs(y - ry) < 0.1) {
        rx = x;
        ry = y;
        paint();
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const show = (on: boolean) => {
      visible = on;
      for (const el of els()) el.classList.toggle("is-visible", on);
      root.classList.toggle("relic-cursor", on);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        rx = x;
        ry = y;
        show(true);
      }
      if (reduce) {
        rx = x;
        ry = y;
        paint();
      } else if (!frame) {
        frame = requestAnimationFrame(tick);
      }
    };

    const onOver = (e: PointerEvent) => {
      const hit = (e.target as Element | null)?.closest?.("a, button");
      ringRef.current?.classList.toggle("is-hover", Boolean(hit));
    };

    const onLeave = () => show(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      cancelAnimationFrame(frame);
      root.classList.remove("relic-cursor");
    };
  }, [wantsCursor]);

  // particles: sharp on high-dpi screens, linked into constellations, nudged by
  // the pointer, and paused whenever the tab is hidden.
  useEffect(() => {
    if (!effects.particles.enabled || reducedMotion()) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    const pointer = { x: -9999, y: -9999 };
    const accent = getComputedStyle(canvas).getPropertyValue("--accent").trim() || "#7c5cff";

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // fewer dots on small screens so a phone doesn't pay for a desktop's worth
    const area = Math.min(1, (w * h) / (1440 * 900));
    const count = Math.max(12, Math.round(effects.particles.density * (0.45 + 0.55 * area)));
    const dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));

    const LINK = 120;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = accent;
      ctx.strokeStyle = accent;

      for (const d of dots) {
        const dx = d.x - pointer.x;
        const dy = d.y - pointer.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 14400 && dist2 > 0.01) {
          const f = (1 - Math.sqrt(dist2) / 120) * 0.6;
          d.x += (dx / Math.sqrt(dist2)) * f;
          d.y += (dy / Math.sqrt(dist2)) * f;
        }
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) { d.x = 0; d.vx = Math.abs(d.vx); }
        if (d.x > w) { d.x = w; d.vx = -Math.abs(d.vx); }
        if (d.y < 0) { d.y = 0; d.vy = Math.abs(d.vy); }
        if (d.y > h) { d.y = h; d.vy = -Math.abs(d.vy); }
      }

      ctx.lineWidth = 0.6;
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i]!;
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            ctx.globalAlpha = (1 - Math.sqrt(d2) / LINK) * 0.22;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 0.55;
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [effects.particles.enabled, effects.particles.density]);

  // tilt: the card leans toward the pointer and a soft light follows it.
  useEffect(() => {
    if (!effects.tilt || !finePointer() || reducedMotion()) return;
    const card = canvasRef.current?.closest(".page")?.querySelector<HTMLElement>(".card")
      ?? document.querySelector<HTMLElement>(".page .card");
    if (!card) return;

    let frame = 0;
    let px = 0;
    let py = 0;

    const apply = () => {
      frame = 0;
      const r = card.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, ((px - r.left) / r.width) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, ((py - r.top) / r.height) * 2 - 1));
      card.style.setProperty("--ry", `${(nx * 6).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${(-ny * 6).toFixed(2)}deg`);
      card.style.setProperty("--mx", `${(((px - r.left) / r.width) * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${(((py - r.top) / r.height) * 100).toFixed(1)}%`);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      card.classList.add("is-tilting");
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const reset = () => {
      card.classList.remove("is-tilting");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", reset);
      reset();
    };
  }, [effects.tilt]);

  // audio. autoplay usually gets blocked, so wait for the first gesture, and
  // clean those listeners up if we unmount before it happens.
  useEffect(() => {
    const audio = effects.audio;
    if (!audio) return;

    const el = new Audio(audio.src);
    el.volume = audio.volume;
    el.loop = audio.loop;
    let alive = true;

    const onGesture = () => {
      removeGesture();
      if (alive) el.play().catch(() => {});
    };
    const removeGesture = () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };

    el.play().catch(() => {
      if (!alive) return;
      window.addEventListener("pointerdown", onGesture);
      window.addEventListener("keydown", onGesture);
    });

    return () => {
      alive = false;
      removeGesture();
      el.pause();
      // src = "" makes some browsers request the page url as media
      el.removeAttribute("src");
      el.load();
    };
  }, [effects.audio]);

  if (!effects.particles.enabled && !wantsCursor && !effects.tilt) {
    return null;
  }

  return (
    <>
      {effects.particles.enabled ? <canvas ref={canvasRef} className="particles" aria-hidden /> : null}
      {cursor === "glow" ? <div ref={glowRef} className="cursor-glow" aria-hidden /> : null}
      {cursor === "ring" ? <div ref={ringRef} className="cursor-ring" aria-hidden /> : null}
      {wantsCursor ? <div ref={dotRef} className="cursor-dot" aria-hidden /> : null}
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
