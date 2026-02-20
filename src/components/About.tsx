"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="About" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-4"
        >
          <p className="text-base leading-relaxed text-muted">
            I&apos;m a Machine Learning Engineer with 3+ years of experience
            building and deploying real-world AI systems across healthcare,
            fintech, and enterprise software. My work sits at the intersection
            of applied machine learning, product, and infrastructure — from
            early prototypes to production systems running in the cloud on GCP
            and AWS.
          </p>
          <p className="text-base leading-relaxed text-muted">
            Most recently, I&apos;ve been the founding ML engineer at Routerr
            Health, a healthcare startup working to make Hospital-at-Home care
            actually scalable. Our goal is simple but hard: get the right
            clinician to the right patient at the right time. I focus on
            building the intelligence behind that process so care teams can move
            faster, operate more efficiently, and ultimately deliver better
            patient outcomes.
          </p>
          <p className="text-base leading-relaxed text-muted">
            Before that, I worked in fintech at Avati, building predictive risk
            models used by banks to catch early signs of portfolio risk and
            prevent major losses. At Perficient, I helped modernize large
            enterprise platforms by migrating legacy systems to cloud-native
            microservices on Google Cloud.
          </p>
          <p className="text-base leading-relaxed text-muted">
            I&apos;m especially interested in building LLM-powered products,
            intelligent agents, and real-time ML systems that solve practical
            problems. My core tools include Python, PyTorch, TensorFlow,
            LangChain, RAG pipelines, Docker, Kubernetes, and modern cloud
            platforms.
          </p>

          <div className="pt-4">
            <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase mb-3">
              Education
            </h3>
            <div className="space-y-3">
              <div className="rounded-xl border border-border/60 bg-card p-4">
                <p className="text-sm font-semibold text-foreground">
                  Columbia University
                </p>
                <p className="text-xs text-muted">
                  Master of Science — Computer Science · Aug 2024 — Dec 2025
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-4">
                <p className="text-sm font-semibold text-foreground">
                  Grinnell College
                </p>
                <p className="text-xs text-muted">
                  Bachelor of Arts — Computer Science &amp; Mathematics · Aug
                  2018 — May 2022
                </p>
                <p className="text-xs text-accent-foreground mt-1">
                  Phi Beta Kappa · Honors in CS · Dean&apos;s List (x8)
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase mb-3">
              Certifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Google Cloud — ML Engineer",
                "Scrum Fundamentals Certified",
                "AT&T Summer Learning Academy Extern",
              ].map((cert) => (
                <span
                  key={cert}
                  className="rounded-full border border-border/60 bg-card px-3 py-1 text-xs text-muted"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
