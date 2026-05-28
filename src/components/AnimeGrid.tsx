"use client";

import { useEffect, useRef, useCallback } from "react";
import { animate, stagger } from "animejs";

/* ─── Grid Configuration ─── */
const COLS = 24;
const ROWS = 12;
const CELL = 52;           // px spacing between dots
const DOT_RADIUS = 2.5;
const TOTAL = COLS * ROWS;  // 288 dots
const SVG_W = COLS * CELL;
const SVG_H = ROWS * CELL;
const DOTS = Array.from({ length: TOTAL }, (_, i) => ({
  cx: (i % COLS) * CELL + CELL / 2,
  cy: Math.floor(i / COLS) * CELL + CELL / 2,
}));

/* ─── Colours ─── */
const COLOR_REST = "#27272a";
const COLOR_ACTIVE = "#a1a1aa";

/* ─── Component ─── */
export default function AnimeGrid() {
  const svgRef = useRef<SVGSVGElement>(null);
  const throttleRef = useRef(false);

  /* ── Convert mouse coords → closest grid index ── */
  const getIndex = useCallback((clientX: number, clientY: number): number => {
    const svg = svgRef.current;
    if (!svg) return Math.floor(TOTAL / 2);
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * SVG_W;
    const y = ((clientY - rect.top) / rect.height) * SVG_H;
    const col = Math.max(0, Math.min(COLS - 1, Math.round((x - CELL / 2) / CELL)));
    const row = Math.max(0, Math.min(ROWS - 1, Math.round((y - CELL / 2) / CELL)));
    return row * COLS + col;
  }, []);

  /* ── Stagger ripple from a given index ── */
  const triggerRipple = useCallback((fromIndex: number) => {
    const circles = svgRef.current?.querySelectorAll(".gd");
    if (!circles) return;

    animate(circles, {
      r: [
        { to: 5, duration: 300, ease: "outElastic(1, 0.5)" },
        { to: DOT_RADIUS, duration: 600, ease: "outElastic(1, 0.5)" },
      ],
      fill: [
        { to: COLOR_ACTIVE, duration: 150 },
        { to: COLOR_REST, duration: 800 },
      ],
      opacity: [
        { to: 1, duration: 150 },
        { to: 0.5, duration: 800 },
      ],
      delay: stagger(35, {
        grid: [COLS, ROWS],
        from: fromIndex,
      }),
    });
  }, []);

  /* ── Rebound: gently return all dots to rest state ── */
  const triggerRebound = useCallback(() => {
    const circles = svgRef.current?.querySelectorAll(".gd");
    if (!circles) return;

    animate(circles, {
      r: DOT_RADIUS,
      fill: COLOR_REST,
      opacity: 0.5,
      duration: 1200,
      ease: "outElastic(1, 0.5)",
      delay: stagger(12, { grid: [COLS, ROWS], from: "center" }),
    });
  }, []);

  /* ── Mouse event handlers ── */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const onMove = (e: MouseEvent) => {
      if (throttleRef.current) return;
      throttleRef.current = true;
      // Throttle: only trigger every 350ms
      setTimeout(() => { throttleRef.current = false; }, 350);
      triggerRipple(getIndex(e.clientX, e.clientY));
    };

    const onLeave = () => {
      throttleRef.current = false;
      triggerRebound();
    };

    svg.addEventListener("mousemove", onMove);
    svg.addEventListener("mouseleave", onLeave);
    return () => {
      svg.removeEventListener("mousemove", onMove);
      svg.removeEventListener("mouseleave", onLeave);
    };
  }, [getIndex, triggerRipple, triggerRebound]);

  /* ── Initial fade-in animation (lightweight) ── */
  useEffect(() => {
    // Small delay to let the page render first
    const id = setTimeout(() => {
      const circles = svgRef.current?.querySelectorAll(".gd");
      if (!circles) return;
      animate(circles, {
        opacity: [0, 0.5],
        duration: 1000,
        ease: "outQuad",
        delay: stagger(8, { grid: [COLS, ROWS], from: "center" }),
      });
    }, 100);
    return () => clearTimeout(id);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ cursor: "crosshair" }}
    >
      {DOTS.map((d, i) => (
        <circle
          key={i}
          className="gd"
          cx={d.cx}
          cy={d.cy}
          r={DOT_RADIUS}
          fill={COLOR_REST}
          opacity={0}
        />
      ))}
    </svg>
  );
}
