"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden px-6 lg:px-16 bg-[#0B1121]"
    >
      {/* ─── ATMOSPHERIC LIGHTING & VIGNETTE ─── */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_0%_0%,_rgba(56,189,248,0.15)_0%,_transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_100%_100%,_rgba(15,23,42,0.8)_0%,_transparent_70%)]" />

      {/* ─── BACKGROUND: Subtle Geometric Nodes & Data-Links ─── */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,1) 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}
      />
      {/* Connecting lines illusion */}
      <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="data-links" width="96" height="96" patternUnits="userSpaceOnUse">
            <path d="M0 0L96 96M96 0L0 96" stroke="white" strokeWidth="1" fill="none"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#data-links)" />
      </svg>

      {/* ─── Gradient overlay for overall vignette text readability ─── */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(90deg, rgba(11,17,33,0.9) 0%, rgba(11,17,33,0.4) 50%, rgba(11,17,33,0) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* ─── LEFT: Text Content ─── */}
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl whitespace-nowrap">
              Rayaan Attari
            </h1>

          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="mt-8 text-base font-light leading-relaxed text-slate-300 sm:text-lg"
          >
            Over the past 3+ years, I’ve worked across healthcare, fintech,
            and enterprise software, focusing on making machine learning
            practical, scalable, and reliable in production. I build
            operational systems where decisions have real constraints, using ML
            and agent-driven workflows to help teams make better real-time
            decisions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <a
              href="#projects"
              className="inline-flex items-center rounded-xl bg-white/5 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-md border border-white/10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]"
            >
              View Projects
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl bg-white/5 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-md border border-white/10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]"
            >
              Download Resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center rounded-xl bg-white/5 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-md border border-white/10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]"
            >
              Contact
            </a>
          </motion.div>
        </div>

        {/* ─── RIGHT: Headshot ─── */}
        <div className="order-first mb-8 flex w-full justify-center lg:order-none lg:mb-0 lg:justify-end lg:pr-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative flex items-center justify-center p-4"
          >
            {/* Soft blue neon outer glow */}
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl z-0" />
            
            <div className="relative z-10 h-64 w-64 sm:h-72 sm:w-72 lg:h-[22rem] lg:w-[22rem] xl:h-[26rem] xl:w-[26rem] rounded-full overflow-hidden border-[8px] border-slate-800/80 bg-slate-900 shadow-[0_0_50px_rgba(56,189,248,0.25)] ring-1 ring-blue-400/30">
              {/* Secondary internal "halo" light */}
              <div className="absolute inset-0 pointer-events-none z-20 rounded-full shadow-[inset_0_0_30px_rgba(186,230,253,0.4)] mix-blend-overlay" />
              <Image
                src="/headshot.jpg"
                alt="Rayaan Attari"
                fill
                className="object-cover object-center z-10"
                sizes="(max-width: 768px) 256px, (max-width: 1024px) 288px, 416px"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
