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
        bgColor: "bg-[#1E3354]", alert: true,
        tasks: ["Update resume & portfolio", "Prep for interviews"], actionItems: ["Schedule mock interview"],
        totalTasks: 22, segments: [{ color: "#3B82F6", value: 50 }, { color: "#F97316", value: 30 }],
      },
      {
        id: "finance", title: "Finance",
        icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        bgColor: "bg-[#1B432C]", alert: true,
        tasks: ["Review monthly budget", "File quarterly taxes"], actionItems: ["File quarterly taxes"],
        totalTasks: 7, segments: [{ color: "#22C55E", value: 60 }, { color: "#EAB308", value: 20 }],
      },
      {
        id: "health", title: "Health",
        icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
        bgColor: "bg-[#255C69]",
        tasks: ["Morning workout routine", "Order vitamins"], actionItems: ["Book annual checkup"],
        totalTasks: 7, segments: [{ color: "#06B6D4", value: 70 }, { color: "#6366F1", value: 15 }],
      },
      {
        id: "personal-growth", title: "Personal Growth",
        icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
        bgColor: "bg-[#651A6A]",
        tasks: ["Complete online course", "Write journal entry"], actionItems: ["Read 20 pages"],
        totalTasks: 10, segments: [{ color: "#A855F7", value: 45 }, { color: "#EC4899", value: 35 }],
      },
      {
        id: "relationships", title: "Relationships",
        icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
        bgColor: "bg-[#BC2B25]",
        tasks: ["Catch up with family", "Plan group dinner"], actionItems: ["Send birthday gift"],
        totalTasks: 10, segments: [{ color: "#EF4444", value: 80 }, { color: "#3B82F6", value: 10 }],
      },
      {
        id: "recreation", title: "Recreation",
        icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
        bgColor: "bg-[#A74112]",
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

const TaskStatusRing = ({ tasks, segments }: { tasks: number; segments: ProgressSegment[] }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const parsed = segments.reduce(
    (acc, seg) => {
      acc.items.push({ ...seg, da: `${(seg.value / 100) * circumference} ${circumference}`, off: -acc.o });
      acc.o += (seg.value / 100) * circumference;
      return acc;
    },
    { o: 0, items: [] as (ProgressSegment & { da: string; off: number })[] }
  ).items;

  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
        {parsed.map((s, i) => (
          <circle key={i} cx="24" cy="24" r={radius} fill="none" stroke={s.color} strokeWidth="3"
            strokeDasharray={s.da} strokeDashoffset={s.off} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
        ))}
      </svg>
      <div className="absolute flex flex-col items-center justify-center pt-[2px]">
        <span className="text-[10px] font-bold leading-none text-white">{tasks}</span>
        <span className="text-[5px] font-bold tracking-widest text-white/70 uppercase scale-75 mt-[1px]">TASKS</span>
      </div>
    </div>
  );
};

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
          chatOpen={chatOpen} setChatOpen={setChatOpen} messages={messages} setMessages={setMessages}
          inputValue={inputValue} setInputValue={setInputValue} isAgentTyping={isAgentTyping}
          setIsAgentTyping={setIsAgentTyping} handleSend={handleSend} inputRef={inputRef} chatEndRef={chatEndRef} />;
      }}
    </DemoShell>
  );
}

// Inner dashboard component that safely hydrates via useEffect
function LifeOSDashboard({ initialData, dashData, setDashData, chatOpen, setChatOpen, messages, setMessages,
  inputValue, setInputValue, isAgentTyping, setIsAgentTyping, handleSend, inputRef, chatEndRef }: {
  initialData: MockLifeOSData | null; dashData: MockLifeOSData | null; setDashData: (d: MockLifeOSData) => void;
  chatOpen: boolean; setChatOpen: (v: boolean) => void; messages: ChatMessage[]; setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  inputValue: string; setInputValue: (v: string) => void; isAgentTyping: boolean; setIsAgentTyping: (v: boolean) => void;
  handleSend: (text?: string) => void; inputRef: React.RefObject<HTMLInputElement | null>; chatEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  useEffect(() => {
    if (initialData && !dashData) {
      setDashData(initialData);
    }
  }, [initialData, dashData, setDashData]);

  if (!dashData) return null;

  const completedPlanner = dashData.plannerTasks.filter((t) => t.done).length;

  return (
    <div className="bg-[#0A0D14] text-white flex flex-col font-sans" style={{ minHeight: "calc(100vh - 200px)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] bg-[#0A0D14]">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-white/90">LifeOS <span className="text-white/40">/ Home</span></div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-xs text-white/60">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            Wednesday, Mar 11
          </div>
        </div>
        <div className="flex items-center gap-4 text-white/50">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 hover:text-white cursor-pointer transition-colors"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 hover:text-white cursor-pointer transition-colors"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 hover:text-white cursor-pointer transition-colors"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Chat Toggle */}
        <button
          onClick={() => { setChatOpen(!chatOpen); setTimeout(() => inputRef.current?.focus(), 100); }}
          className={`w-12 border-r border-white/5 flex flex-col items-center py-6 shrink-0 relative cursor-pointer transition-colors ${chatOpen ? "bg-accent/10 border-accent/20" : "hover:bg-white/[0.02]"}`}
        >
          <div className="rotate-[-90deg] origin-center text-[9px] font-bold tracking-[0.2em] text-white/30 whitespace-nowrap absolute top-20 flex items-center gap-2">
            <span className={`w-3 h-3 border rounded-sm flex items-center justify-center transition-colors ${chatOpen ? "border-accent text-accent" : "border-white/30"}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-2 h-2"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
            </span>
            CHAT
          </div>
          {!chatOpen && (
            <div className="absolute bottom-6 w-2 h-2 bg-accent rounded-full animate-pulse" />
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
              className="border-r border-white/5 bg-[#0C1019] flex flex-col overflow-hidden shrink-0"
            >
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white/90">Planning Agent</h3>
                  <p className="text-[10px] text-accent/70">Online • Ready to plan</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                      msg.role === "user" ? "bg-accent/20 text-white/90 rounded-br-sm" : "bg-white/[0.04] text-white/80 border border-white/5 rounded-bl-sm"
                    }`}>{msg.text}</div>
                  </motion.div>
                ))}
                {isAgentTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/[0.04] border border-white/5 rounded-xl px-4 py-3 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
                      className="px-2.5 py-1.5 text-[10px] bg-white/[0.04] border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors">
                      {p}
                    </button>
                  ))}
                </div>
              )}

              <div className="p-3 border-t border-white/5">
                <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 focus-within:border-accent/30 transition-colors">
                  <input ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Tell me your goal..." disabled={isAgentTyping}
                    className="flex-1 bg-transparent text-xs text-white/90 placeholder:text-white/30 outline-none disabled:opacity-50" />
                  <button onClick={() => handleSend()} disabled={isAgentTyping || !inputValue.trim()}
                    className="p-1.5 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Dashboard */}
        <div className="flex-1 overflow-y-auto p-8 flex gap-8">
          <div className="flex-1 max-w-4xl">
            <h2 className="text-sm font-semibold text-white mb-4 tracking-wide">Focus Areas</h2>
            <div className="grid grid-cols-2 gap-4">
              {dashData.focusAreas.map((area, idx) => (
                <motion.div key={area.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`${area.bgColor} relative overflow-hidden rounded-xl p-5 border border-white/5 shadow-lg group hover:ring-1 hover:ring-white/20 transition-all`}
                  style={{ minHeight: "160px" }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white/10 rounded-lg text-white/90">{area.icon}</div>
                      <h3 className="font-semibold text-white/90 text-sm flex items-center gap-2">
                        {area.title}
                        {area.alert && <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22M12 6l7.5 13h-15M11 10h2v4h-2M11 16h2v2h-2"/></svg>}
                      </h3>
                    </div>
                    <button className="text-white/20 hover:text-white/60 transition-colors">
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                    </button>
                  </div>
                  <div className="space-y-1 mb-6">
                    {area.tasks.map((task, i) => (
                      <p key={i} className="text-xs text-white/70 truncate">{task}</p>
                    ))}
                  </div>
                  <div className="absolute bottom-5 flex flex-col items-start gap-1">
                    {area.actionItems.map((item, i) => (
                      <button key={i} className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-[10px] font-medium text-white/80 transition-colors">
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                        {item}
                      </button>
                    ))}
                  </div>
                  <div className="absolute bottom-4 right-5">
                    <TaskStatusRing tasks={area.totalTasks} segments={area.segments} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-[320px] flex flex-col shrink-0 gap-6">
            <h2 className="text-sm font-semibold text-white tracking-wide">Planner & Upcoming</h2>
            <div className="bg-[#141A29] border border-white/5 rounded-xl p-4 shadow-lg shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-white/50 text-xs font-bold tracking-widest">
                  <div className="p-1.5 bg-white/5 rounded-md"><svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></div>
                  PLANNER
                </div>
                <span className="text-white/30 text-xs font-mono">{completedPlanner}/{dashData.plannerTasks.length}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg mb-4 text-xs text-white/50 cursor-pointer hover:bg-white/10 transition-colors">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Add task or search...
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {dashData.plannerTasks.map((pt) => (
                  <div key={pt.id} className="flex items-center justify-between group">
                    <label className="flex items-center gap-3 cursor-pointer"
                      onClick={() => setDashData({ ...dashData, plannerTasks: dashData.plannerTasks.map((t) => t.id === pt.id ? { ...t, done: !t.done } : t) })}>
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${pt.done ? "bg-accent border-accent" : "border-white/20 group-hover:border-white/50"}`}>
                        {pt.done && <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5"><path d="M2.5 6l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span className={`text-xs transition-colors ${pt.done ? "text-white/40 line-through" : "text-white/80 group-hover:text-white"}`}>{pt.title}</span>
                    </label>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium tracking-wide ${pt.categoryColor}`}>{pt.category}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#141A29] border border-white/5 rounded-xl p-4 shadow-lg flex-1 min-h-[120px]">
              <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-6">UPCOMING</h3>
              <div className="flex items-center justify-center h-full">
                <p className="text-xs text-white/30 pb-4">No upcoming tasks in the next week.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right decorative sidebar */}
        <div className="w-12 border-l border-white/5 flex-col items-center py-6 shrink-0 relative hidden lg:flex">
          <div className="rotate-[-90deg] origin-center text-[9px] font-bold tracking-[0.2em] text-white/30 whitespace-nowrap absolute top-20 flex items-center gap-2">
            <span className="w-3 h-3 border border-white/30 rounded-sm flex items-center justify-center">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-2 h-2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
            </span>
            FILES
          </div>
        </div>
      </div>
    </div>
  );
}
