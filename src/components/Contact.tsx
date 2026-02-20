"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const contactLinks = [
  {
    label: "rayaan.attari@gmail.com",
    href: "mailto:rayaan.attari@gmail.com",
    description: "Email",
  },
  {
    label: "github.com/attarira",
    href: "https://github.com/attarira",
    description: "GitHub",
  },
  {
    label: "linkedin.com/in/attarira",
    href: "https://www.linkedin.com/in/attarira",
    description: "LinkedIn",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Contact"
          subtitle="Open to opportunities, collaborations, and interesting conversations."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="grid gap-4 sm:grid-cols-3"
        >
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={
                link.href.startsWith("mailto")
                  ? undefined
                  : "noopener noreferrer"
              }
              className="group rounded-xl border border-border/60 bg-card p-5 transition-all duration-300 hover:border-border-hover hover:bg-card-hover"
            >
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {link.description}
              </p>
              <p className="mt-2 text-sm text-foreground transition-colors duration-200 group-hover:text-accent-foreground">
                {link.label}
              </p>
            </a>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-sm text-muted-foreground"
        >
          📞 (321) 890-7155 · New York, NY
        </motion.p>
      </div>
    </section>
  );
}
