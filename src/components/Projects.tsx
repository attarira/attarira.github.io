"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import SectionHeading from "./SectionHeading";

const ArrowIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    className="transition-transform duration-200 group-hover:translate-x-0.5"
  >
    <path
      d="M6 3L11 8L6 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Projects"
          subtitle="Selected work across healthcare AI, fintech ML systems, and cloud infrastructure."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="group flex flex-col rounded-xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-border-hover hover:bg-card-hover"
            >
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {project.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {project.description}
              </p>

              <div className="mt-4 space-y-2">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-muted">Problem:</span>{" "}
                  {project.problem}
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-muted">Impact:</span>{" "}
                  {project.outcome}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-background px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center gap-4 pt-5">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-200 hover:text-foreground"
                  aria-label={`View ${project.title} source code on GitHub`}
                >
                  Source
                  <ArrowIcon />
                </a>
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-200 hover:text-foreground"
                    aria-label={`View ${project.title} live demo`}
                  >
                    Demo
                    <ArrowIcon />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
