"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DemoShell from "./DemoShell";
import { getMockData } from "@/lib/mockAPI";

// --- Types ---
type ProgressSegment = { color: string; value: number };

type FocusArea = {
  id: string;
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  alert?: boolean;
  tasks: string[];
  actionItems: string[];
  totalTasks: number;
  segments: ProgressSegment[];
};

type PlannerTask = {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  done: boolean;
};

type MockLifeOSData = {
  focusAreas: FocusArea[];
  plannerTasks: PlannerTask[];
};

type ChatMessage = {
  id: string;
  role: "user" | "agent";
  text: string;
  isTyping?: boolean;
};

// --- Agent response definitions ---
type AgentScenario = {
  keywords: string[];
  response: string;
  tasks: { title: string; category: string; focusAreaId: string }[];
};

const agentScenarios: AgentScenario[] = [
  {
    keywords: ["health", "healthy", "fit", "exercise", "gym", "weight", "diet"],
    response:
      "Great goal! I've broken this down into actionable steps across your Health focus area. I've added a morning workout routine, a meal prep task, and scheduled a checkup reminder. Let's build momentum!",
    tasks: [
      { title: "30-min morning jog", category: "Health", focusAreaId: "health" },
      { title: "Meal prep for the week", category: "Health", focusAreaId: "health" },
      { title: "Schedule annual physical", category: "Health", focusAreaId: "health" },
    ],
  },
  {
    keywords: ["job", "career", "interview", "promotion", "raise", "work", "hire", "resume"],
    response:
      "Let's level up your career! I've created tasks for networking, skill-building, and interview prep. Each one is assigned a priority and deadline so nothing slips through.",
    tasks: [
      { title: "Reach out to 3 contacts", category: "Career", focusAreaId: "career" },
      { title: "Practice system design", category: "Career", focusAreaId: "career" },
      { title: "Tailor resume for role", category: "Career", focusAreaId: "career" },
    ],
  },
  {
    keywords: ["save", "money", "budget", "invest", "finance", "spend", "debt"],
    response:
      "Smart thinking! I've set up a savings goal tracker, a weekly spending audit, and a research task for investment options. Small steps lead to big financial wins.",
    tasks: [
      { title: "Set monthly savings goal", category: "Finance", focusAreaId: "finance" },
      { title: "Audit weekly spending", category: "Finance", focusAreaId: "finance" },
      { title: "Research index funds", category: "Finance", focusAreaId: "finance" },
    ],
  },
  {
    keywords: ["learn", "course", "read", "book", "skill", "study", "grow", "growth"],
    response:
      "Love the growth mindset! I've added a daily reading habit, an online course milestone, and a journaling prompt to track your learning reflections.",
    tasks: [
      { title: "Read 20 pages daily", category: "Personal Growth", focusAreaId: "personal-growth" },
      { title: "Complete Module 3 of course", category: "Personal Growth", focusAreaId: "personal-growth" },
      { title: "Write weekly reflection", category: "Personal Growth", focusAreaId: "personal-growth" },
    ],
  },
  {
    keywords: ["friend", "family", "social", "relationship", "connect", "call", "visit"],
    response:
      "Relationships matter! I've scheduled a family check-in, a friend catch-up, and a thoughtful gesture to strengthen your connections.",
    tasks: [
      { title: "Call a family member", category: "Relationships", focusAreaId: "relationships" },
      { title: "Schedule coffee with a friend", category: "Relationships", focusAreaId: "relationships" },
      { title: "Send a thank-you note", category: "Relationships", focusAreaId: "relationships" },
    ],
  },
  {
    keywords: ["fun", "hobby", "relax", "travel", "trip", "hike", "game", "movie", "recreation"],
    response:
      "All work and no play? Not on my watch! I've added a weekend adventure, a new hobby exploration, and some dedicated downtime to your Recreation area.",
    tasks: [
      { title: "Plan a weekend outing", category: "Recreation", focusAreaId: "recreation" },
      { title: "Try a new hobby for 1 hour", category: "Recreation", focusAreaId: "recreation" },
      { title: "Schedule movie night", category: "Recreation", focusAreaId: "recreation" },
    ],
  },
];

const defaultAgentResponse: AgentScenario = {
  keywords: [],
  response:
    "I've analyzed your goal and broken it into manageable tasks! I've distributed them across your most relevant focus areas with priorities and deadlines. Check your planner for the full breakdown.",
  tasks: [
    { title: "Research & plan approach", category: "Personal Growth", focusAreaId: "personal-growth" },
    { title: "Set measurable milestone", category: "Career", focusAreaId: "career" },
    { title: "Schedule weekly review", category: "Health", focusAreaId: "health" },
  ],
};

const CATEGORY_COLORS: Record<string, string> = {
  Career: "text-blue-300 bg-blue-900/40",
  Finance: "text-emerald-300 bg-emerald-900/40",
  Health: "text-cyan-300 bg-cyan-900/40",
  "Personal Growth": "text-purple-300 bg-purple-900/40",
  Relationships: "text-red-300 bg-red-900/40",
  Recreation: "text-orange-300 bg-orange-900/40",
};

const SUGGESTED_PROMPTS = [
  "I want to get healthier this month",
  "Help me prepare for job interviews",
  "I need to save more money",
  "I want to learn something new",
];

// --- Initial mock data ---
function getInitialData(): MockLifeOSData {
  return {
    focusAreas: [
      {
        id: "career", title: "Career",
        icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
        bgColor: "bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20", alert: true,
        tasks: ["Update resume & portfolio", "Prep for interviews"], actionItems: ["Schedule mock interview"],
        totalTasks: 22, segments: [{ color: "#3B82F6", value: 50 }, { color: "#F97316", value: 30 }],
      },
      {
        id: "finance", title: "Finance",
        icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        bgColor: "bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20", alert: true,
        tasks: ["Review monthly budget", "File quarterly taxes"], actionItems: ["File quarterly taxes"],
        totalTasks: 7, segments: [{ color: "#22C55E", value: 60 }, { color: "#EAB308", value: 20 }],
      },
      {
        id: "health", title: "Health",
        icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
        bgColor: "bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20",
        tasks: ["Morning workout routine", "Order vitamins"], actionItems: ["Book annual checkup"],
        totalTasks: 7, segments: [{ color: "#06B6D4", value: 70 }, { color: "#6366F1", value: 15 }],
      },
      {
        id: "personal-growth", title: "Personal Growth",
        icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
        bgColor: "bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20",
        tasks: ["Complete online course", "Write journal entry"], actionItems: ["Read 20 pages"],
        totalTasks: 10, segments: [{ color: "#A855F7", value: 45 }, { color: "#EC4899", value: 35 }],
      },
      {
        id: "relationships", title: "Relationships",
        icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
        bgColor: "bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20",
        tasks: ["Catch up with family", "Plan group dinner"], actionItems: ["Send birthday gift"],
        totalTasks: 10, segments: [{ color: "#EF4444", value: 80 }, { color: "#3B82F6", value: 10 }],
      },
      {
        id: "recreation", title: "Recreation",
        icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
        bgColor: "bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20",
        tasks: ["Finish current book", "Plan weekend hike"], actionItems: ["Plan weekend hike"],
        totalTasks: 8, segments: [{ color: "#F97316", value: 65 }, { color: "#3B82F6", value: 20 }],
      },
    ],
    plannerTasks: [
      { id: "p1", title: "Review monthly budget", category: "Finance", categoryColor: "text-blue-300 bg-blue-900/40", done: false },
      { id: "p2", title: "Update resume", category: "Career", categoryColor: "text-blue-300 bg-blue-900/40", done: false },
      { id: "p3", title: "Order vitamins", category: "Health", categoryColor: "text-emerald-300 bg-emerald-900/40", done: false },
      { id: "p4", title: "Morning workout", category: "Health", categoryColor: "text-emerald-300 bg-emerald-900/40", done: false },
    ],
  };
}

// --- Sub-components ---

// --- Main Component ---
export default function LifeOSDemo() {
  const [dashData, setDashData] = useState<MockLifeOSData | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "agent", text: "Hi! I'm your LifeOS planning agent. Tell me a goal and I'll break it down into tasks across your focus areas.\n\nTry something like: \"I want to get healthier this month\"" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const findScenario = useCallback((text: string): AgentScenario => {
    const lower = text.toLowerCase();
    const match = agentScenarios.find((s) => s.keywords.some((kw) => lower.includes(kw)));
    return match || defaultAgentResponse;
  }, []);

  const addAgentTasks = useCallback((scenario: AgentScenario) => {
    setDashData((prev) => {
      if (!prev) return prev;
      const newAreas = prev.focusAreas.map((area) => {
        const matched = scenario.tasks.filter((t) => t.focusAreaId === area.id);
        if (matched.length === 0) return area;
        return {
          ...area,
          tasks: [...area.tasks, ...matched.map((t) => t.title)],
          totalTasks: area.totalTasks + matched.length,
        };
      });
      const newPlanner = [
        ...prev.plannerTasks,
        ...scenario.tasks.map((t, i) => ({
          id: `agent-${Date.now()}-${i}`,
          title: t.title,
          category: t.category,
          categoryColor: CATEGORY_COLORS[t.category] || "text-white/60 bg-white/5",
          done: false,
        })),
      ];
      return { focusAreas: newAreas, plannerTasks: newPlanner };
    });
  }, []);

  const handleSend = useCallback((text?: string) => {
    const msg = (text || inputValue).trim();
    if (!msg || isAgentTyping) return;
    setInputValue("");

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setIsAgentTyping(true);

    const scenario = findScenario(msg);

    // Simulate typing delay
    setTimeout(() => {
      const thinkMsg: ChatMessage = { id: `a-${Date.now()}`, role: "agent", text: "🔍 Analyzing your goal and identifying relevant focus areas..." };
      setMessages((prev) => [...prev, thinkMsg]);

      setTimeout(() => {
        const taskList = scenario.tasks.map((t) => `• ${t.title} → ${t.category}`).join("\n");
        const agentMsg: ChatMessage = {
          id: `a2-${Date.now()}`,
          role: "agent",
          text: `${scenario.response}\n\nTasks created:\n${taskList}`,
        };
        setMessages((prev) => [...prev, agentMsg]);
        addAgentTasks(scenario);
        setIsAgentTyping(false);
      }, 1500);
    }, 800);
  }, [inputValue, isAgentTyping, findScenario, addAgentTasks]);

  const fetchDemoData = useCallback(async () => {
    return getMockData<MockLifeOSData>({
      id: "lifeos",
      mockResponse: getInitialData(),
      delayMs: 800,
    });
  }, []);

  return (
    <DemoShell title="LifeOS" fetchData={fetchDemoData}>
      {(data) => {
        return <LifeOSDashboard initialData={data} dashData={dashData} setDashData={setDashData}
          chatOpen={chatOpen} setChatOpen={setChatOpen} messages={messages}
          inputValue={inputValue} setInputValue={setInputValue} isAgentTyping={isAgentTyping}
          handleSend={handleSend} inputRef={inputRef} chatEndRef={chatEndRef} />;
      }}
    </DemoShell>
  );
}

// Inner dashboard component that safely hydrates via useEffect
function LifeOSDashboard({ initialData, dashData, setDashData, chatOpen, setChatOpen, messages,
  inputValue, setInputValue, isAgentTyping, handleSend, inputRef, chatEndRef }: {
  initialData: MockLifeOSData | null; dashData: MockLifeOSData | null; setDashData: (d: MockLifeOSData) => void;
  chatOpen: boolean; setChatOpen: (v: boolean) => void; messages: ChatMessage[];
  inputValue: string; setInputValue: (v: string) => void; isAgentTyping: boolean;
  handleSend: (text?: string) => void; inputRef: React.RefObject<HTMLInputElement | null>; chatEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  useEffect(() => {
    if (initialData && !dashData) {
      setDashData(initialData);
    }
  }, [initialData, dashData, setDashData]);

  if (!dashData) return null;

  const completedPlanner = dashData.plannerTasks.filter((t) => t.done).length;
  
  const AREA_GRADIENTS: Record<string, { gradient: string; iconBg: string; ringTrack: string; titleColor?: string; subtitleColor?: string; ringEmptyColor?: string; ringTextColor?: string }> = {
    career: { gradient: 'linear-gradient(135deg, #1a3a6b 0%, #0c1f3d 100%)', iconBg: 'bg-blue-500/25', ringTrack: 'rgba(59,130,246,0.25)' },
    health: { gradient: 'linear-gradient(135deg, #0e7490 0%, #164e63 100%)', iconBg: 'bg-cyan-400/25', ringTrack: 'rgba(6,182,212,0.25)' },
    finance: { gradient: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)', iconBg: 'bg-green-500/25', ringTrack: 'rgba(34,197,94,0.25)' },
    relationships: { gradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', iconBg: 'bg-red-400/25', ringTrack: 'rgba(248,113,113,0.35)' },
    "personal-growth": { gradient: 'linear-gradient(135deg, #701a75 0%, #4a044e 100%)', iconBg: 'bg-fuchsia-500/25', ringTrack: 'rgba(217,70,239,0.25)' },
    recreation: { gradient: 'linear-gradient(135deg, #c2410c 0%, #7c2d12 100%)', iconBg: 'bg-orange-500/25', ringTrack: 'rgba(249,115,22,0.25)' },
  };

  const getGrad = (id: string) => AREA_GRADIENTS[id] || { gradient: 'linear-gradient(135deg, #253040 0%, #141c28 100%)', iconBg: 'bg-slate-400/20', ringTrack: 'rgba(148,163,184,0.2)' };

  const leftPad = chatOpen ? 'xl:pl-[440px]' : 'xl:pl-[56px]';
  const rightPad = 'xl:pr-[56px]';

  return (
    <div className="flex flex-col h-full bg-slate-950 font-sans" style={{ minHeight: "calc(100vh - 200px)" }}>
      {/* Header */}
      <header className="flex-shrink-0 bg-slate-950 border-b border-slate-800 px-6 py-4 z-10 relative">
        <div className={`flex flex-1 items-center justify-between mx-auto transition-all ${leftPad} ${rightPad}`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span className="font-semibold text-white">LifeOS</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">Home</span>
            </div>
            <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
            <div className="text-sm font-medium text-slate-400 hidden sm:flex items-center gap-1.5 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800/60">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
          <div className="flex items-center gap-4 text-white/50">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 hover:text-white cursor-pointer transition-colors"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 hover:text-white cursor-pointer transition-colors"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 hover:text-white cursor-pointer transition-colors"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Chat Toggle */}
        <button
          onClick={() => { setChatOpen(!chatOpen); setTimeout(() => inputRef.current?.focus(), 100); }}
          className={`w-12 border-r border-slate-800 flex flex-col items-center py-6 shrink-0 relative cursor-pointer transition-colors ${chatOpen ? "bg-indigo-500/10 border-indigo-500/20" : "hover:bg-white/[0.02]"}`}
        >
          <div className="rotate-[-90deg] origin-center text-[9px] font-bold tracking-[0.2em] text-slate-500 whitespace-nowrap absolute top-20 flex items-center gap-2">
            <span className={`w-3 h-3 border rounded-sm flex items-center justify-center transition-colors ${chatOpen ? "border-indigo-400 text-indigo-400" : "border-slate-600"}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-2 h-2"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
            </span>
            CHAT
          </div>
          {!chatOpen && (
            <div className="absolute bottom-6 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
          )}
        </button>

        {/* Chat Panel */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="border-r border-slate-800 bg-slate-950 flex flex-col overflow-hidden shrink-0"
            >
              <div className="p-4 border-b border-slate-800/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Planning Agent</h3>
                  <p className="text-[10px] text-indigo-400/80">Online • Ready to plan</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                      msg.role === "user" ? "bg-indigo-500/20 text-indigo-100 rounded-br-sm" : "bg-slate-800/40 text-slate-300 border border-slate-700/50 rounded-bl-sm"
                    }`}>{msg.text}</div>
                  </motion.div>
                ))}
                {isAgentTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggested prompts */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button key={p} onClick={() => handleSend(p)}
                      className="px-2.5 py-1.5 text-[10px] bg-slate-800/30 border border-slate-700/50 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors">
                      {p}
                    </button>
                  ))}
                </div>
              )}

              <div className="p-3 border-t border-slate-800/60">
                <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 focus-within:border-indigo-500/50 transition-colors">
                  <input ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Tell me your goal..." disabled={isAgentTyping}
                    className="flex-1 bg-transparent text-xs text-slate-200 placeholder:text-slate-500 outline-none disabled:opacity-50" />
                  <button onClick={() => handleSend()} disabled={isAgentTyping || !inputValue.trim()}
                    className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Dashboard section */}
        <main className="flex-1 overflow-auto bg-slate-950">
          <div className={`p-8 w-full max-w-[1400px] mx-auto transition-all`}>
            
            <div className="mb-8">
              <h1 className="text-[22px] font-semibold text-white tracking-tight">
                {(() => {
                  const hour = new Date().getHours();
                  if (hour < 12) return 'Good morning, Rayaan';
                  if (hour < 17) return 'Good afternoon, Rayaan';
                  return 'Good evening, Rayaan';
                })()}
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
              {/* LEFT: Focus Areas */}
              <div className="space-y-6">
                
                {/* Aggregate Statistics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5 flex flex-col justify-center">
                    <span className="text-3xl font-bold text-white">
                      {dashData.focusAreas.reduce((a, b) => a + b.totalTasks, 0)}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-1.5">Total Active</span>
                  </div>
                  <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5 flex flex-col justify-center">
                    <span className="text-3xl font-bold text-amber-400">12</span>
                    <span className="text-[11px] font-medium text-amber-500/70 uppercase tracking-wider mt-1.5">In Progress</span>
                  </div>
                  <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5 flex flex-col justify-center">
                    <span className="text-3xl font-bold text-blue-400">4</span>
                    <span className="text-[11px] font-medium text-blue-500/70 uppercase tracking-wider mt-1.5">On Hold</span>
                  </div>
                  <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5 flex flex-col justify-center">
                    <span className="text-3xl font-bold text-emerald-400">18</span>
                    <span className="text-[11px] font-medium text-emerald-500/70 uppercase tracking-wider mt-1.5">Completed</span>
                  </div>
                </div>

                {/* Focus Areas Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashData.focusAreas.map((area, idx) => {
                    const grad = getGrad(area.id);
                    return (
                      <motion.div key={area.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative overflow-hidden flex flex-col rounded-2xl text-left transition-all select-none hover:shadow-xl hover:-translate-y-0.5 cursor-pointer ring-1 ring-white/5"
                        style={{ background: grad.gradient, minHeight: '190px' }}
                      >
                        {/* Top row */}
                        <div className="flex items-start justify-between p-5 pb-0">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0 ${grad.iconBg} ${!grad.iconBg.includes('text-') ? 'text-white/80' : ''}`}>
                              {area.icon}
                            </div>
                            <h3 className={`text-[16px] font-semibold leading-tight ${grad.titleColor || 'text-white'}`}>{area.title}</h3>
                            {area.alert && (
                              <span className="inline-flex items-center rounded-full bg-red-500/10 text-red-400 p-1.5 shrink-0" title="Due soon">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2a1 1 0 01.894.553l9 18A1 1 0 0121 22H3a1 1 0 01-.894-1.447l9-18A1 1 0 0112 2zm0 6a1 1 0 00-1 1v4a1 1 0 001 1h.01a1 1 0 001-1V9a1 1 0 00-1.01-1zM12 17a1.25 1.25 0 100-2.5A1.25 1.25 0 0012 17z" />
                                </svg>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Middle */}
                        <div className="flex-1 px-5 pt-4 pb-2 flex flex-col justify-center">
                          {area.tasks.length > 0 ? (
                            <div className="flex flex-col gap-1.5">
                              {area.tasks.slice(0, 3).map((item: string, i: number) => (
                                <div key={i} className={`text-[13px] leading-snug truncate ${grad.subtitleColor || 'text-white/70'}`}>{item}</div>
                              ))}
                            </div>
                          ) : (
                            <p className={`text-[13px] ${grad.ringEmptyColor || 'text-white/30'}`}>No active focus.</p>
                          )}
                        </div>

                        {/* Bottom */}
                        <div className="flex items-end justify-between p-5 pt-0 mt-2">
                          <div className="min-w-0 flex-1 flex flex-col items-start gap-1.5 pr-4">
                            {area.actionItems.length > 0 && (
                              <button
                                type="button"
                                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] max-w-full truncate transition-colors border ${grad.titleColor ? 'bg-slate-100/50 text-slate-500 hover:bg-slate-200/50 border-transparent' : 'bg-white/[0.07] backdrop-blur-sm text-white/50 hover:bg-white/[0.12] hover:text-white border-white/5'}`}
                              >
                                <span className={`flex-shrink-0 ${grad.titleColor ? 'text-slate-500' : 'text-white/60'}`}>
                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                  </svg>
                                </span>
                                <span className="truncate">{area.actionItems[0]}</span>
                              </button>
                            )}
                          </div>

                          <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 72, height: 72 }}>
                            <svg width={72} height={72} viewBox="0 0 72 72" className="absolute inset-0 pointer-events-none transform -rotate-90">
                              <circle cx={36} cy={36} r={33} stroke={grad.ringTrack} strokeWidth={6} fill="none" />
                              {(() => {
                                let currentOffset = 0;
                                const circumference = 2 * Math.PI * 33;
                                return area.segments.map((seg, i) => {
                                  const off = -currentOffset;
                                  const da = `${(seg.value / 100) * circumference} ${circumference}`;
                                  currentOffset += (seg.value / 100) * circumference;
                                  return (
                                    <circle key={i} cx="36" cy="36" r={33} fill="none" stroke={seg.color} strokeWidth="6" strokeDasharray={da} strokeDashoffset={off} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                                  );
                                });
                              })()}
                            </svg>
                            <div className="absolute inset-[8px] rounded-full pointer-events-none bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-center z-20">
                              <div className={`text-[15px] font-bold ${grad.ringTextColor || 'text-white'}`}>{area.totalTasks}</div>
                              <div className={`text-[8px] uppercase tracking-[0.2em] font-medium ${grad.ringEmptyColor || 'text-white/50'}`}>Tasks</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT: Planner & Upcoming */}
              <div className="space-y-6 lg:sticky lg:top-8 w-full">
                
                {/* Planner */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden shrink-0">
                  <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold tracking-[0.15em] uppercase">
                       Planner
                    </div>
                    <span className="text-slate-500 text-[11px] font-medium">{completedPlanner}/{dashData.plannerTasks.length} Done</span>
                  </div>
                  <div className="p-2 space-y-0.5">
                    {dashData.plannerTasks.map((pt) => (
                      <div key={pt.id} className="flex items-center justify-between group p-2 hover:bg-slate-800/40 rounded-xl transition-colors">
                        <label className="flex items-center gap-3 cursor-pointer select-none truncate"
                          onClick={() => setDashData({ ...dashData, plannerTasks: dashData.plannerTasks.map((t) => t.id === pt.id ? { ...t, done: !t.done } : t) })}>
                          <div className={`flex-shrink-0 w-4 h-4 rounded-md border-[1.5px] flex items-center justify-center transition-colors ${pt.done ? "bg-slate-600 border-slate-600" : "border-slate-500 group-hover:border-slate-400"}`}>
                            {pt.done && <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5"><path d="M2.5 6l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                          <span className={`text-[13px] truncate transition-colors ${pt.done ? "text-slate-500 line-through" : "text-slate-200 group-hover:text-white"}`}>{pt.title}</span>
                        </label>
                        <span className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-md font-medium ${pt.categoryColor.replace('900/40', '500/10').replace('500/20', '600/20').replace('text-', 'text-opacity-80 text-')}`}>{pt.category}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-slate-800/60 flex items-center">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-bold">Upcoming</p>
                  </div>
                  <div className="px-4 py-8 flex flex-col items-center justify-center text-center">
                    <svg className="w-8 h-8 text-slate-700/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-[13px] text-slate-500 font-medium">No upcoming tasks<br/>in the next week</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </main>

        {/* Right decorative sidebar */}
        <div className="w-12 border-l border-slate-800 flex-col items-center py-6 shrink-0 relative hidden lg:flex">
          <div className="rotate-[-90deg] origin-center text-[9px] font-bold tracking-[0.2em] text-slate-500 whitespace-nowrap absolute top-20 flex items-center gap-2 cursor-pointer hover:text-slate-300">
            <span className="w-3 h-3 border border-slate-600 rounded-sm flex items-center justify-center">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-2 h-2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
            </span>
            FILES
          </div>
        </div>
      </div>
    </div>
  );
}
