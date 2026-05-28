import Link from "next/link";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coming Soon | Portfolio',
  description: 'This feature or project is currently under construction and will be available soon.',
};

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center font-sans">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-md p-8 text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20">
          <svg className="h-8 w-8 text-accent animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground/90">
          Coming Soon
        </h1>
        
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          This project link is currently being updated. I&apos;m actively working on adding the source code, demo, or documentation. Please check back later!
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-6 py-2.5 text-sm font-medium transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="transition-transform group-hover:-translate-x-1"
          >
            <path
              d="M10 13L5 8L10 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Return Home
        </Link>
      </div>
    </div>
  );
}
