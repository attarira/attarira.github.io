"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface DemoShellProps<T> {
  title: string;
  fetchData: () => Promise<T>;
  children: (data: T | null, isLoading: boolean, isError: boolean) => React.ReactNode;
}

export default function DemoShell<T>({ title, fetchData, children }: DemoShellProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const fetchRef = useRef(fetchData);
  fetchRef.current = fetchData;
  const hasFetched = useRef(false);

  const executeFetch = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setData(null);

    try {
      const response = await fetchRef.current();
      setData(response);
    } catch (err) {
      console.error("Demo Fetch Error:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      executeFetch();
    }
  }, [executeFetch]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Portfolio-level Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/#projects"
              className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-200 group-hover:-translate-x-1"
              >
                <path
                  d="M10 13L5 8L10 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Projects
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <h1 className="text-sm font-semibold tracking-wide text-foreground/90">
              {title}{" "}
              <span className="text-accent ml-1 uppercase text-[10px] tracking-widest border border-accent/30 rounded-full px-2 py-0.5 bg-accent/5">
                Live Demo
              </span>
            </h1>
          </div>

          <button
            onClick={executeFetch}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-4 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className={isLoading ? "animate-spin" : ""}
            >
              <path
                d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C9.65685 2 11.1569 2.67157 12.2426 3.75736L14 5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 2V5.5H10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Reset Demo
          </button>
        </div>
      </header>

      {/* Windowed Demo Content */}
      <main className="flex-1 flex items-start justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-[1400px] rounded-2xl border border-white/[0.06] bg-[#0A0D14] shadow-2xl shadow-black/40 overflow-hidden relative"
          style={{ minHeight: "calc(100vh - 140px)" }}>

          {/* Fake browser chrome bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0D1117] border-b border-white/[0.04]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 px-4 py-1 bg-white/[0.04] rounded-md border border-white/[0.06] text-[10px] text-white/30 font-mono max-w-[320px] w-full justify-center">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-2.5 h-2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                localhost:5173
              </div>
            </div>
            <div className="w-[52px]" />
          </div>

          {/* Demo content area */}
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-40"
              >
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <p className="mt-4 text-sm tracking-widest text-muted uppercase">Loading Demo...</p>
              </motion.div>
            )}

            {!isLoading && isError && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center p-6 py-32"
              >
                <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center backdrop-blur-sm">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-500">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-red-500 mb-2">Simulated Error Encountered</h2>
                  <p className="text-sm text-foreground/70 mb-6">
                    The demo encountered a simulated error state. This demonstrates how the application handles failure modes.
                  </p>
                  <button
                    onClick={executeFetch}
                    className="rounded-lg bg-red-500/10 px-6 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
                  >
                    Retry Connection
                  </button>
                </div>
              </motion.div>
            )}

            {!isLoading && !isError && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full w-full"
              >
                {children(data, isLoading, isError)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
