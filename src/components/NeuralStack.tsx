"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

/* ═══════════════════════════════════════════════
   Colour Palette — subtle cyan on charcoal
   ═══════════════════════════════════════════════ */
const P = "rgba(56,189,248,";
const C = {
  stroke: `${P}0.15)`,
  strokeHi: `${P}0.28)`,
  fill: `${P}0.03)`,
  node: `${P}0.10)`,
  nodeHi: `${P}0.22)`,
  glow: `${P}0.55)`,
  glowBright: `${P}0.85)`,
  label: `${P}0.22)`,
  skillTag: `${P}0.65)`,
  skillTagBg: `${P}0.06)`,
};

/* ═══════════════════════════════════════════════
   Skill labels per layer (from skills.ts)
   ═══════════════════════════════════════════════ */
const LAYER_SKILLS = {
  input: ["PostgreSQL", "PySpark", "ETL Pipelines", "Apache Spark"],
  network: ["PyTorch", "TensorFlow", "LLMs", "RAG Pipelines"],
  output: ["GCP", "Docker", "Kubernetes", "FastAPI"],
};

/* ═══════════════════════════════════════════════
   Layer 1 — Input / Data Grid (Top)
   ═══════════════════════════════════════════════ */
function InputLayer() {
  const cols = 8;
  const rows = 4;
  const gap = 30;
  const ox = (280 - (cols - 1) * gap) / 2 + 10;
  const oy = 40;

  return (
    <svg viewBox="0 0 300 170" className="ns-svg" aria-hidden="true">
      <rect
        x="0.5" y="0.5" width="299" height="169" rx="6"
        fill={C.fill} stroke={C.stroke} strokeWidth="0.75"
      />
      <text x="12" y="18" fill={C.label} fontSize="8" fontFamily="var(--font-mono)">
        input_data
      </text>

      {Array.from({ length: cols * rows }, (_, i) => (
        <circle
          key={i}
          className="ns-prox"
          cx={ox + (i % cols) * gap}
          cy={oy + Math.floor(i / cols) * gap}
          r="2.5"
          fill={C.node}
          stroke={C.stroke}
          strokeWidth="0.5"
          data-base-r="2.5"
        />
      ))}

      {/* Skill tags — hidden by default, revealed on hover */}
      {LAYER_SKILLS.input.map((skill, i) => (
        <g key={skill} className="ns-skill ns-skill-input" opacity="0">
          <rect
            x={15 + i * 72} y="148" width={65} height="16" rx="3"
            fill={C.skillTagBg} stroke={C.strokeHi} strokeWidth="0.5"
          />
          <text
            x={15 + i * 72 + 32.5} y="159" textAnchor="middle"
            fill={C.skillTag} fontSize="7" fontFamily="var(--font-mono)"
          >
            {skill}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   Layer 2 — Neural Network (Middle)
   ═══════════════════════════════════════════════ */
function NetworkLayer() {
  const cols = [
    { n: 4, x: 60 },
    { n: 6, x: 150 },
    { n: 3, x: 240 },
  ];
  const yOf = (count: number, i: number) => {
    const s = 110 / (count + 1);
    return 34 + s * (i + 1);
  };

  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let l = 0; l < cols.length - 1; l++) {
    for (let a = 0; a < cols[l].n; a++) {
      for (let b = 0; b < cols[l + 1].n; b++) {
        lines.push({
          x1: cols[l].x, y1: yOf(cols[l].n, a),
          x2: cols[l + 1].x, y2: yOf(cols[l + 1].n, b),
        });
      }
    }
  }

  /* Pick 8 representative connection paths for data pulse animation */
  const pulseLines = [0, 5, 10, 15, 24, 28, 32, 38].filter(i => i < lines.length);

  return (
    <svg viewBox="0 0 300 170" className="ns-svg" aria-hidden="true">
      <rect
        x="0.5" y="0.5" width="299" height="169" rx="6"
        fill={C.fill} stroke={C.strokeHi} strokeWidth="0.75"
      />
      <text x="12" y="18" fill={C.label} fontSize="8" fontFamily="var(--font-mono)">
        neural_process
      </text>

      {/* Connection lines */}
      {lines.map((l, i) => (
        <line
          key={`l-${i}`}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={C.stroke} strokeWidth="0.4"
          className="ns-conn"
        />
      ))}

      {/* Nodes */}
      {cols.flatMap((col, ci) =>
        Array.from({ length: col.n }, (_, ni) => (
          <circle
            key={`n-${ci}-${ni}`}
            className="ns-prox ns-node"
            cx={col.x}
            cy={yOf(col.n, ni)}
            r="4.5"
            fill={ci === 1 ? C.nodeHi : C.node}
            stroke={C.strokeHi}
            strokeWidth="0.6"
            data-base-r="4.5"
          />
        ))
      )}

      {/* Data pulse dots traveling along connections */}
      {pulseLines.map((li, i) => {
        const l = lines[li];
        return (
          <circle
            key={`p-${i}`}
            className="ns-pulse"
            cx={l.x1}
            cy={l.y1}
            r="2"
            fill={C.glowBright}
            opacity="0"
            data-x1={l.x1} data-y1={l.y1}
            data-x2={l.x2} data-y2={l.y2}
          />
        );
      })}

      {/* Skill tags */}
      {LAYER_SKILLS.network.map((skill, i) => (
        <g key={skill} className="ns-skill ns-skill-network" opacity="0">
          <rect
            x={15 + i * 72} y="148" width={65} height="16" rx="3"
            fill={C.skillTagBg} stroke={C.strokeHi} strokeWidth="0.5"
          />
          <text
            x={15 + i * 72 + 32.5} y="159" textAnchor="middle"
            fill={C.skillTag} fontSize="7" fontFamily="var(--font-mono)"
          >
            {skill}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   Layer 3 — Output / Inference (Bottom)
   ═══════════════════════════════════════════════ */
function OutputLayer() {
  const bars = [
    { h: 50, x: 45 },
    { h: 90, x: 95 },
    { h: 35, x: 145 },
    { h: 68, x: 195 },
    { h: 105, x: 245 },
  ];
  const bw = 28;
  const base = 155;

  return (
    <svg viewBox="0 0 300 170" className="ns-svg" aria-hidden="true">
      <rect
        x="0.5" y="0.5" width="299" height="169" rx="6"
        fill={C.fill} stroke={C.stroke} strokeWidth="0.75"
      />
      <text x="12" y="18" fill={C.label} fontSize="8" fontFamily="var(--font-mono)">
        inference_output
      </text>

      {bars.map((b, i) => (
        <rect
          key={i}
          className="ns-prox ns-bar"
          x={b.x}
          y={base - b.h}
          width={bw}
          height={b.h}
          rx="3"
          fill={i === 4 ? C.nodeHi : C.node}
          stroke={C.strokeHi}
          strokeWidth="0.5"
        />
      ))}

      <circle
        className="ns-glow"
        cx={259} cy={base - 105 - 14} r="4" fill={C.glow}
      />

      {/* Skill tags */}
      {LAYER_SKILLS.output.map((skill, i) => (
        <g key={skill} className="ns-skill ns-skill-output" opacity="0">
          <rect
            x={15 + i * 72} y="148" width={65} height="16" rx="3"
            fill={C.skillTagBg} stroke={C.strokeHi} strokeWidth="0.5"
          />
          <text
            x={15 + i * 72 + 32.5} y="159" textAnchor="middle"
            fill={C.skillTag} fontSize="7" fontFamily="var(--font-mono)"
          >
            {skill}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   NeuralStack — Main Composition
   ═══════════════════════════════════════════════ */
const BASE_RX = 55;
const BASE_RZ = -25;
const PARTICLE_POOL = 15;

export default function NeuralStack() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0, inside: false });
  const activeLayer = useRef<string | null>(null);

  /* ════════════════════════════════════════════
     1. Mouse-move parallax (lerped RAF)
        + proximity glow + cursor trail
     ════════════════════════════════════════════ */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const stack = stackRef.current;
    if (!wrapper || !stack) return;

    let tRx = BASE_RX, tRz = BASE_RZ;
    let cRx = BASE_RX, cRz = BASE_RZ;
    let raf: number;

    /* Proximity glow logic */
    const updateProximityGlow = () => {
      if (!mousePos.current.inside) return;
      const { x: mx, y: my } = mousePos.current;

      // Find each layer's SVG and update nodes near cursor
      const svgs = wrapper.querySelectorAll<SVGSVGElement>(".ns-svg");
      svgs.forEach((svg) => {
        const rect = svg.getBoundingClientRect();
        // Convert mouse to SVG viewBox coords
        const svgX = ((mx - rect.left) / rect.width) * 300;
        const svgY = ((my - rect.top) / rect.height) * 170;

        const proxNodes = svg.querySelectorAll<SVGElement>(".ns-prox");
        proxNodes.forEach((node) => {
          const cx = parseFloat(node.getAttribute("cx") || node.getAttribute("x") || "0");
          const cy = parseFloat(node.getAttribute("cy") || node.getAttribute("y") || "0");
          const dist = Math.sqrt((svgX - cx) ** 2 + (svgY - cy) ** 2);
          const intensity = Math.max(0, 1 - dist / 80); // radius of influence = 80 SVG units

          if (intensity > 0) {
            const baseR = parseFloat(node.getAttribute("data-base-r") || "0");
            if (node.tagName === "circle" && baseR) {
              node.setAttribute("r", String(baseR + intensity * 3));
            }
            node.style.fill = `rgba(56,189,248,${0.1 + intensity * 0.5})`;
            node.style.filter = intensity > 0.3 ? `drop-shadow(0 0 ${intensity * 6}px rgba(56,189,248,0.4))` : "";
          } else {
            const baseR = node.getAttribute("data-base-r");
            if (node.tagName === "circle" && baseR) {
              node.setAttribute("r", baseR);
            }
            node.style.fill = "";
            node.style.filter = "";
          }
        });
      });
    };

    /* Determine which layer zone the cursor is in */
    const detectLayerZone = (ny: number): string | null => {
      if (ny < -0.15) return "input";
      if (ny > 0.15) return "output";
      if (ny >= -0.15 && ny <= 0.15) return "network";
      return null;
    };

    const tick = () => {
      cRx += (tRx - cRx) * 0.07;
      cRz += (tRz - cRz) * 0.07;
      stack.style.transform = `rotateX(${cRx}deg) rotateZ(${cRz}deg)`;
      updateProximityGlow();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const r = wrapper.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      tRx = BASE_RX + ny * 25;
      tRz = BASE_RZ + nx * 25;
      mousePos.current = { x: e.clientX, y: e.clientY, inside: true };

      /* Detect layer zone for skill labels */
      const zone = detectLayerZone(ny);
      if (zone !== activeLayer.current) {
        // Hide previous layer skills
        if (activeLayer.current) {
          const prev = wrapper.querySelectorAll(`.ns-skill-${activeLayer.current}`);
          animate(prev, { opacity: 0, duration: 300, ease: "outQuad" });
        }
        // Show new layer skills
        if (zone) {
          const next = wrapper.querySelectorAll(`.ns-skill-${zone}`);
          animate(next, {
            opacity: [0, 1],
            translateY: [6, 0],
            duration: 500,
            ease: "outElastic(1, 0.5)",
            delay: stagger(80),
          });
        }
        activeLayer.current = zone;
      }
    };

    const onLeave = () => {
      tRx = BASE_RX;
      tRz = BASE_RZ;
      mousePos.current.inside = false;

      // Reset all proximity nodes
      wrapper.querySelectorAll<SVGElement>(".ns-prox").forEach((node) => {
        const baseR = node.getAttribute("data-base-r");
        if (node.tagName === "circle" && baseR) node.setAttribute("r", baseR);
        node.style.fill = "";
        node.style.filter = "";
      });

      // Hide all skill labels
      if (activeLayer.current) {
        const prev = wrapper.querySelectorAll(`.ns-skill-${activeLayer.current}`);
        animate(prev, { opacity: 0, duration: 400, ease: "outQuad" });
        activeLayer.current = null;
      }
    };

    wrapper.addEventListener("mousemove", onMove);
    wrapper.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      wrapper.removeEventListener("mousemove", onMove);
      wrapper.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ════════════════════════════════════════════
     2. Cursor trail particles
     ════════════════════════════════════════════ */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const trail = trailRef.current;
    if (!wrapper || !trail) return;

    let throttle = false;

    const spawnParticle = (e: MouseEvent) => {
      if (throttle) return;
      throttle = true;
      setTimeout(() => { throttle = false; }, 60);

      // Limit pool
      if (trail.childElementCount >= PARTICLE_POOL) {
        trail.removeChild(trail.firstChild!);
      }

      const rect = wrapper.getBoundingClientRect();
      const dot = document.createElement("div");
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const angle = Math.random() * Math.PI * 2;
      const drift = 30 + Math.random() * 40;

      Object.assign(dot.style, {
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: "4px",
        height: "4px",
        borderRadius: "50%",
        background: C.glowBright,
        boxShadow: `0 0 8px 2px ${C.glow}`,
        pointerEvents: "none",
        willChange: "transform, opacity",
      });

      trail.appendChild(dot);

      animate(dot, {
        translateX: Math.cos(angle) * drift,
        translateY: Math.sin(angle) * drift,
        scale: [1, 0],
        opacity: [0.7, 0],
        duration: 800 + Math.random() * 400,
        ease: "outQuad",
        onComplete: () => { dot.remove(); },
      });
    };

    wrapper.addEventListener("mousemove", spawnParticle);
    return () => wrapper.removeEventListener("mousemove", spawnParticle);
  }, []);

  /* ════════════════════════════════════════════
     3. Floating animation (staggered per layer)
     ════════════════════════════════════════════ */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    animate(el.querySelectorAll(".ns-float"), {
      translateY: [-6, 6],
      duration: 3200,
      loop: true,
      alternate: true,
      ease: "inOutSine",
      delay: stagger(550),
    });
  }, []);

  /* ════════════════════════════════════════════
     4. Data pulse animation along connections
     ════════════════════════════════════════════ */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const pulses = el.querySelectorAll<SVGCircleElement>(".ns-pulse");
    pulses.forEach((dot, i) => {
      const x1 = parseFloat(dot.dataset.x1 || "0");
      const y1 = parseFloat(dot.dataset.y1 || "0");
      const x2 = parseFloat(dot.dataset.x2 || "0");
      const y2 = parseFloat(dot.dataset.y2 || "0");

      // Animate the cx/cy attributes to travel along the connection line
      animate(dot, {
        cx: [x1, x2],
        cy: [y1, y2],
        opacity: [
          { to: 0.8, duration: 200 },
          { to: 0.8, duration: 1200 },
          { to: 0, duration: 400 },
        ],
        duration: 1800,
        loop: true,
        ease: "inOutQuad",
        delay: i * 350 + Math.random() * 300,
      });
    });
  }, []);

  /* ════════════════════════════════════════════
     5. Vertical flow particles (existing)
     ════════════════════════════════════════════ */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    animate(el.querySelectorAll(".ns-particle"), {
      translateY: [0, 300],
      opacity: [
        { to: 0.7, duration: 400 },
        { to: 0, duration: 2100 },
      ],
      duration: 2800,
      loop: true,
      ease: "inOutQuad",
      delay: stagger(550),
    });
  }, []);

  /* ════════════════════════════════════════════
     6. Node pulse (ambient, when not hovered)
     ════════════════════════════════════════════ */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    animate(el.querySelectorAll(".ns-node"), {
      opacity: [0.5, 1],
      duration: 2000,
      loop: true,
      alternate: true,
      ease: "inOutSine",
      delay: stagger(80, { from: "center" }),
    });
  }, []);

  /* ════════════════════════════════════════════
     7. Output bar shimmer + result glow
     ════════════════════════════════════════════ */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    animate(el.querySelectorAll(".ns-bar"), {
      opacity: [0.5, 1],
      duration: 2400,
      loop: true,
      alternate: true,
      ease: "inOutSine",
      delay: stagger(350),
    });

    animate(el.querySelectorAll(".ns-glow"), {
      opacity: [0.4, 1],
      duration: 1400,
      loop: true,
      alternate: true,
      ease: "inOutSine",
    });
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative flex h-full w-full items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Cursor trail container */}
      <div
        ref={trailRef}
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
        aria-hidden="true"
      />

      <div
        ref={stackRef}
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${BASE_RX}deg) rotateZ(${BASE_RZ}deg)`,
          width: "460px",
          height: "440px",
          willChange: "transform",
        }}
      >
        {/* ── Layer 1: Input (Top, closest) ── */}
        <div
          className="absolute inset-x-0 top-0"
          style={{ transform: "translateZ(120px)" }}
        >
          <div className="ns-float" style={{ willChange: "transform" }}>
            <InputLayer />
          </div>
        </div>

        {/* ── Layer 2: Network (Middle) ── */}
        <div
          className="absolute inset-x-0 top-0"
          style={{ transform: "translateZ(0px)" }}
        >
          <div className="ns-float" style={{ willChange: "transform" }}>
            <NetworkLayer />
          </div>
        </div>

        {/* ── Layer 3: Output (Bottom, furthest) ── */}
        <div
          className="absolute inset-x-0 top-0"
          style={{ transform: "translateZ(-120px)" }}
        >
          <div className="ns-float" style={{ willChange: "transform" }}>
            <OutputLayer />
          </div>
        </div>

        {/* ── Flow particles (vertical) ── */}
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="ns-particle absolute rounded-full"
            style={{
              left: `${18 + i * 16}%`,
              top: "5%",
              width: 4,
              height: 4,
              background: C.glow,
              boxShadow: `0 0 10px 3px ${C.glow}`,
              opacity: 0,
              transform: "translateZ(50px)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
