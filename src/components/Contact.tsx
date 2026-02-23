"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

/* ═══════════════════════════════════════════════════════
   Inline SVG Icons (no external deps)
   ═══════════════════════════════════════════════════════ */
function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function GraduationCapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   Copy-to-clipboard email row
   ═══════════════════════════════════════════════════════ */
interface EmailRowProps {
  email: string;
  label: string;
  icon: React.ReactNode;
  delay?: number;
}

function EmailRow({ email, label, icon, delay = 0 }: EmailRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [email]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay }}
      className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card px-5 py-4 transition-all duration-300 hover:border-border-hover hover:bg-card-hover"
    >
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-foreground transition-colors duration-300 group-hover:bg-accent/20">
        {icon}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium tracking-[0.15em] text-muted-foreground/70 uppercase">
          {label}
        </p>
        <a
          href={`mailto:${email}`}
          className="mt-0.5 block truncate text-sm text-foreground/90 transition-colors duration-200 hover:text-accent-foreground"
        >
          {email}
        </a>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        aria-label={copied ? "Copied!" : `Copy ${email}`}
        className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent text-muted-foreground/50 transition-all duration-200 hover:border-border-hover hover:bg-card-hover hover:text-foreground"
      >
        {copied ? (
          <CheckIcon className="h-4 w-4 text-emerald-400" />
        ) : (
          <CopyIcon className="h-4 w-4" />
        )}

        {/* Tooltip */}
        <span
          className={`pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-medium transition-all duration-200 ${copied
              ? "bg-emerald-500/20 text-emerald-400 opacity-100"
              : "bg-card text-muted-foreground opacity-0 group-hover:opacity-100"
            }`}
        >
          {copied ? "Copied!" : "Copy"}
        </span>
      </button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   Social link card
   ═══════════════════════════════════════════════════════ */
interface SocialCardProps {
  href: string;
  label: string;
  handle: string;
  icon: React.ReactNode;
  delay?: number;
}

function SocialCard({ href, label, handle, icon, delay = 0 }: SocialCardProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay }}
      className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card px-5 py-4 transition-all duration-300 hover:border-accent/40 hover:bg-card-hover"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-foreground transition-colors duration-300 group-hover:bg-accent/20">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium tracking-[0.15em] text-muted-foreground/70 uppercase">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm text-foreground/90 transition-colors duration-200 group-hover:text-accent-foreground">
          {handle}
        </p>
      </div>
      {/* Arrow */}
      <svg
        className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </motion.a>
  );
}

/* ═══════════════════════════════════════════════════════
   Main Contact Section
   ═══════════════════════════════════════════════════════ */
export default function Contact() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          title="Contact"
          subtitle="Open to opportunities, collaborations, and interesting conversations."
        />

        <div className="space-y-10">
          {/* ── Email Addresses ── */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4 }}
              className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-muted-foreground/50 uppercase"
            >
              Email
            </motion.p>
            <div className="space-y-3">
              <EmailRow
                email="rayaan.attari@gmail.com"
                label="Professional"
                icon={<MailIcon className="h-5 w-5" />}
                delay={0.05}
              />
              <EmailRow
                email="rta2125@columbia.edu"
                label="Academic"
                icon={<GraduationCapIcon className="h-5 w-5" />}
                delay={0.1}
              />
            </div>
          </div>

          {/* ── Professional Profiles ── */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-muted-foreground/50 uppercase"
            >
              Professional Profiles
            </motion.p>
            <div className="grid gap-3 sm:grid-cols-2">
              <SocialCard
                href="https://github.com/attarira"
                label="GitHub"
                handle="attarira"
                icon={<GithubIcon className="h-5 w-5" />}
                delay={0.15}
              />
              <SocialCard
                href="https://www.linkedin.com/in/attarira"
                label="LinkedIn"
                handle="Rayaan Attari"
                icon={<LinkedInIcon className="h-5 w-5" />}
                delay={0.2}
              />
            </div>
          </div>

          {/* ── Location & Phone ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/40 pt-6"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PhoneIcon className="h-4 w-4 text-muted-foreground/60" />
              <span>(321) 890-7155</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPinIcon className="h-4 w-4 text-muted-foreground/60" />
              <span>New York, NY</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
