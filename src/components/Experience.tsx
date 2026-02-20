"use client";

import { motion } from "framer-motion";
import { experiences } from "@/data/experience";
import SectionHeading from "./SectionHeading";

export default function Experience() {
  return (
    <section id="experience" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Experience"
          subtitle="3+ years building AI systems across healthcare, fintech, and enterprise software."
        />

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute top-0 bottom-0 left-0 w-px bg-border md:left-1/2 md:-translate-x-px"
            aria-hidden="true"
          />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.role}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
              >
                {/* Timeline dot */}
                <div
                  className="absolute top-2 left-0 z-10 h-2.5 w-2.5 -translate-x-1 rounded-full border-2 border-accent bg-background md:left-1/2 md:-translate-x-[5px]"
                  aria-hidden="true"
                />

                {/* Content card */}
                <div
                  className={`ml-6 w-full md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                    }`}
                >
                  <div className="rounded-xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-border-hover hover:bg-card-hover">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-base font-semibold text-foreground">
                        {exp.role}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {exp.dates}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-accent-foreground">
                      {exp.company}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {exp.achievements.map((achievement, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm leading-relaxed text-muted"
                        >
                          <span
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground"
                            aria-hidden="true"
                          />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
