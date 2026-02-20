"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center px-6"
    >
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="mb-4 text-sm font-medium tracking-widest text-accent-foreground uppercase">
            ML Engineer · Healthcare AI · Fintech · Cloud Infrastructure
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Rayaan Attari
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        >
          Machine Learning Engineer with 3+ years of experience building and
          deploying real-world AI systems across healthcare, fintech, and
          enterprise software. MS CS @ Columbia · Focused on LLM-powered
          products, intelligent agents, and real-time ML systems that solve
          practical problems.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#projects"
            className="inline-flex items-center rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-all duration-200 hover:bg-foreground/90"
          >
            View Projects
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:border-border-hover hover:bg-card"
          >
            Download Resume
          </a>
          <a
            href="#contact"
            className="inline-flex items-center rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:border-border-hover hover:bg-card"
          >
            Contact
          </a>
        </motion.div>
      </div>

      {/* Subtle gradient accent */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>
    </section>
  );
}
