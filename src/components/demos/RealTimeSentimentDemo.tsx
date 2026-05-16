"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import DemoShell from "./DemoShell";
import { getMockData } from "@/lib/mockAPI";

type Sentiment = "positive" | "neutral" | "negative";
type Channel = "chat" | "email" | "voice" | "social";
type Priority = "low" | "medium" | "high";

type SupportMessage = {
  id: string;
  customer: string;
  channel: Channel;
  text: string;
  sentiment: Sentiment;
  confidence: number;
  score: number;
  topic: string;
  priority: Priority;
  timestamp: string;
  latencyMs: number;
  tokens: number;
};

type SentimentDemoData = {
  streamId: string;
  modelVersion: string;
  sources: { id: Channel; label: string; volume: string }[];
  topics: { label: string; count: number; trend: number }[];
  messages: SupportMessage[];
};

const SENTIMENT_DATA: SentimentDemoData = {
  streamId: "support-stream-us-east-2",
  modelVersion: "ensemble-v3.8",
  sources: [
    { id: "chat", label: "Live Chat", volume: "1.8K/hr" },
    { id: "email", label: "Email", volume: "640/hr" },
    { id: "voice", label: "Voice Notes", volume: "420/hr" },
    { id: "social", label: "Social", volume: "980/hr" },
  ],
  topics: [
    { label: "Refund Delay", count: 94, trend: 18 },
    { label: "Login Failure", count: 62, trend: -7 },
    { label: "Delivery ETA", count: 48, trend: 11 },
    { label: "Billing Question", count: 41, trend: -3 },
  ],
  messages: [
    {
      id: "msg-001",
      customer: "Maya R.",
      channel: "chat",
      text: "The agent solved my account issue quickly and the handoff was smoother than last time.",
      sentiment: "positive",
      confidence: 96,
      score: 0.82,
      topic: "Account Recovery",
      priority: "low",
      timestamp: "10:42:13",
      latencyMs: 42,
      tokens: 18,
    },
    {
      id: "msg-002",
      customer: "Andre P.",
      channel: "email",
      text: "I have been waiting eight days for the refund and every update says something different.",
      sentiment: "negative",
      confidence: 94,
      score: -0.74,
      topic: "Refund Delay",
      priority: "high",
      timestamp: "10:42:16",
      latencyMs: 57,
      tokens: 17,
    },
    {
      id: "msg-003",
      customer: "Priya S.",
      channel: "voice",
      text: "The product is fine, but I need someone to confirm whether the replacement shipped today.",
      sentiment: "neutral",
      confidence: 88,
      score: 0.06,
      topic: "Delivery ETA",
      priority: "medium",
      timestamp: "10:42:21",
      latencyMs: 64,
      tokens: 16,
    },
    {
      id: "msg-004",
      customer: "Noah K.",
      channel: "social",
      text: "Second outage this month and the status page is still silent. This is getting expensive.",
      sentiment: "negative",
      confidence: 91,
      score: -0.68,
      topic: "Service Outage",
      priority: "high",
      timestamp: "10:42:27",
      latencyMs: 49,
      tokens: 17,
    },
    {
      id: "msg-005",
      customer: "Elena V.",
      channel: "chat",
      text: "The new workflow saves me several clicks. Please keep this version.",
      sentiment: "positive",
      confidence: 92,
      score: 0.71,
      topic: "Product Feedback",
      priority: "low",
      timestamp: "10:42:31",
      latencyMs: 39,
      tokens: 12,
    },
    {
      id: "msg-006",
      customer: "Marcus L.",
      channel: "email",
      text: "Can you explain why my invoice changed after the annual plan renewal?",
      sentiment: "neutral",
      confidence: 84,
      score: -0.04,
      topic: "Billing Question",
      priority: "medium",
      timestamp: "10:42:35",
      latencyMs: 52,
      tokens: 12,
    },
    {
      id: "msg-007",
      customer: "Hannah T.",
      channel: "social",
      text: "Support closed my ticket without fixing anything. I am done repeating the same issue.",
      sentiment: "negative",
      confidence: 97,
      score: -0.88,
      topic: "Ticket Escalation",
      priority: "high",
      timestamp: "10:42:40",
      latencyMs: 46,
      tokens: 15,
    },
    {
      id: "msg-008",
      customer: "Owen B.",
      channel: "chat",
      text: "The checkout error disappeared after clearing cache. Everything looks good now.",
      sentiment: "positive",
      confidence: 89,
      score: 0.63,
      topic: "Checkout Recovery",
      priority: "low",
      timestamp: "10:42:44",
      latencyMs: 36,
      tokens: 13,
    },
    {
      id: "msg-009",
      customer: "Jules M.",
      channel: "voice",
      text: "I am calling because the mobile login loop is still blocking my team.",
      sentiment: "negative",
      confidence: 90,
      score: -0.57,
      topic: "Login Failure",
      priority: "high",
      timestamp: "10:42:49",
      latencyMs: 68,
      tokens: 13,
    },
    {
      id: "msg-010",
      customer: "Sara D.",
      channel: "email",
      text: "Thanks for sending the export. The format matches what our finance team needed.",
      sentiment: "positive",
      confidence: 93,
      score: 0.76,
      topic: "Data Export",
      priority: "low",
      timestamp: "10:42:54",
      latencyMs: 44,
      tokens: 14,
    },
    {
      id: "msg-011",
      customer: "Ibrahim A.",
      channel: "social",
      text: "The delivery window moved again. I need an accurate ETA before tomorrow morning.",
      sentiment: "negative",
      confidence: 86,
      score: -0.48,
      topic: "Delivery ETA",
      priority: "medium",
      timestamp: "10:42:58",
      latencyMs: 51,
      tokens: 14,
    },
    {
      id: "msg-012",
      customer: "Claire W.",
      channel: "chat",
      text: "The representative was patient and explained the migration steps clearly.",
      sentiment: "positive",
      confidence: 95,
      score: 0.79,
      topic: "Onboarding",
      priority: "low",
      timestamp: "10:43:04",
      latencyMs: 38,
      tokens: 11,
    },
  ],
};

const channelLabels: Record<Channel, string> = {
  chat: "Chat",
  email: "Email",
  voice: "Voice",
  social: "Social",
};

function sentimentClasses(sentiment: Sentiment) {
  if (sentiment === "positive") {
    return {
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
      bar: "bg-emerald-500",
      soft: "bg-emerald-500/10 text-emerald-700",
    };
  }

  if (sentiment === "negative") {
    return {
      badge: "border-rose-200 bg-rose-50 text-rose-700",
      dot: "bg-rose-500",
      bar: "bg-rose-500",
      soft: "bg-rose-500/10 text-rose-700",
    };
  }

  return {
    badge: "border-sky-200 bg-sky-50 text-sky-700",
    dot: "bg-sky-500",
    bar: "bg-sky-500",
    soft: "bg-sky-500/10 text-sky-700",
  };
}

function channelClasses(channel: Channel) {
  if (channel === "chat") return "bg-cyan-50 text-cyan-700 border-cyan-200";
  if (channel === "email") return "bg-indigo-50 text-indigo-700 border-indigo-200";
  if (channel === "voice") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200";
}

function priorityClasses(priority: Priority) {
  if (priority === "high") return "bg-rose-600 text-white";
  if (priority === "medium") return "bg-amber-400 text-slate-950";
  return "bg-slate-200 text-slate-700";
}

function formatScore(score: number) {
  return `${score > 0 ? "+" : ""}${score.toFixed(2)}`;
}

function MetricCard({
  label,
  value,
  detail,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  accent: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </span>
        <span className={`h-2.5 w-2.5 rounded-full ${accent}`} />
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
        {value}
      </div>
      <div className="mt-1 text-xs text-slate-500">{detail}</div>
    </div>
  );
}

function PipelineStep({
  label,
  detail,
  active,
}: {
  label: string;
  detail: string;
  active?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`mt-1 h-3 w-3 rounded-full border-2 ${
            active ? "border-emerald-400 bg-emerald-400" : "border-slate-300 bg-white"
          }`}
        />
        <div className="mt-1 h-full w-px bg-slate-200" />
      </div>
      <div className="pb-4">
        <div className="text-sm font-semibold text-slate-900">{label}</div>
        <div className="mt-1 text-xs leading-5 text-slate-500">{detail}</div>
      </div>
    </div>
  );
}

function MessageCard({ message }: { message: SupportMessage }) {
  const sentiment = sentimentClasses(message.sentiment);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white">
            {message.customer.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-950">{message.customer}</h3>
              <span className="text-xs text-slate-400">{message.timestamp}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${channelClasses(message.channel)}`}>
                {channelLabels[message.channel]}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${priorityClasses(message.priority)}`}>
                {message.priority}
              </span>
              <span className="text-[11px] font-medium text-slate-500">{message.topic}</span>
            </div>
          </div>
        </div>
        <div className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${sentiment.badge}`}>
          {message.sentiment} {message.confidence}%
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700">{message.text}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-center">
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>Sentiment score</span>
            <span>{formatScore(message.score)}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div
              className={`h-2 rounded-full ${sentiment.bar}`}
              style={{ width: `${Math.max(8, Math.abs(message.score) * 100)}%` }}
            />
          </div>
        </div>
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {message.latencyMs}ms
        </span>
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {message.tokens} tokens
        </span>
      </div>
    </motion.article>
  );
}

export default function RealTimeSentimentDemo() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [cursor, setCursor] = useState(0);
  const [isStreaming, setIsStreaming] = useState(true);
  const [sourceFilter, setSourceFilter] = useState<Channel | "all">("all");

  const fetchDemoData = useCallback(async () => {
    return getMockData<SentimentDemoData>({
      id: "real-time-sentiment-analysis",
      delayMs: 900,
      mockResponse: SENTIMENT_DATA,
    });
  }, []);

  const ingestNext = useCallback((corpus: SupportMessage[]) => {
    if (corpus.length === 0) return;

    setMessages((current) => {
      const nextMessage = corpus[cursor % corpus.length];
      return [nextMessage, ...current.filter((message) => message.id !== nextMessage.id)].slice(0, 8);
    });
    setCursor((value) => value + 1);
  }, [cursor]);

  return (
    <DemoShell title="Real-Time Sentiment Analysis Engine" fetchData={fetchDemoData}>
      {(data) => {
        const corpus = data
          ? data.messages.filter((message) => sourceFilter === "all" || message.channel === sourceFilter)
          : [];

        return (
          <SentimentWorkspace
            data={data}
            corpus={corpus}
            messages={messages}
            setMessages={setMessages}
            cursor={cursor}
            setCursor={setCursor}
            ingestNext={ingestNext}
            isStreaming={isStreaming}
            setIsStreaming={setIsStreaming}
            sourceFilter={sourceFilter}
            setSourceFilter={setSourceFilter}
          />
        );
      }}
    </DemoShell>
  );
}

function SentimentWorkspace({
  data,
  corpus,
  messages,
  setMessages,
  cursor,
  setCursor,
  ingestNext,
  isStreaming,
  setIsStreaming,
  sourceFilter,
  setSourceFilter,
}: {
  data: SentimentDemoData | null;
  corpus: SupportMessage[];
  messages: SupportMessage[];
  setMessages: (messages: SupportMessage[]) => void;
  cursor: number;
  setCursor: (cursor: number) => void;
  ingestNext: (corpus: SupportMessage[]) => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  sourceFilter: Channel | "all";
  setSourceFilter: (source: Channel | "all") => void;
}) {
  useEffect(() => {
    if (!data) return;

    const initialCorpus = data.messages.filter(
      (message) => sourceFilter === "all" || message.channel === sourceFilter,
    );
    setMessages(initialCorpus.slice(0, 6));
    setCursor(6);
  }, [data, setCursor, setMessages, sourceFilter]);

  useEffect(() => {
    if (!isStreaming || corpus.length === 0) return;

    const intervalId = window.setInterval(() => {
      ingestNext(corpus);
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, [corpus, ingestNext, isStreaming]);

  const stats = useMemo(() => {
    const total = messages.length || 1;
    const positive = messages.filter((message) => message.sentiment === "positive").length;
    const neutral = messages.filter((message) => message.sentiment === "neutral").length;
    const negative = messages.filter((message) => message.sentiment === "negative").length;
    const avgScore = messages.reduce((sum, message) => sum + message.score, 0) / total;
    const avgLatency = Math.round(
      messages.reduce((sum, message) => sum + message.latencyMs, 0) / total,
    );
    const highPriority = messages.filter((message) => message.priority === "high").length;
    const avgConfidence = Math.round(
      messages.reduce((sum, message) => sum + message.confidence, 0) / total,
    );

    return { total, positive, neutral, negative, avgScore, avgLatency, highPriority, avgConfidence };
  }, [messages]);

  if (!data) return null;

  const topAlert = messages.find(
    (message) => message.sentiment === "negative" && message.priority === "high",
  );

  return (
    <div className="min-h-[calc(100vh-200px)] bg-[#eef3f5] text-slate-900">
      <div className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
                <span className="h-4 w-4 rounded-full border-2 border-emerald-400 bg-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.75)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                  Sentiment Stream Console
                </h2>
                <p className="text-sm text-slate-500">
                  {data.streamId} · {data.modelVersion}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsStreaming(!isStreaming)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              {isStreaming ? "Pause Stream" : "Resume Stream"}
            </button>
            <button
              type="button"
              onClick={() => ingestNext(corpus)}
              className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Ingest Next
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 xl:grid-cols-[260px_1fr_340px]">
        <aside className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Sources
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setSourceFilter("all")}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  sourceFilter === "all"
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>All Channels</span>
                <span className="text-xs opacity-70">3.8K/hr</span>
              </button>
              {data.sources.map((source) => (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => setSourceFilter(source.id)}
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    sourceFilter === source.id
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{source.label}</span>
                  <span className="text-xs opacity-70">{source.volume}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Pipeline
            </div>
            <PipelineStep active label="Normalize" detail="Clean text, redact PII, dedupe events." />
            <PipelineStep active label="Embed" detail="Batch tokenization with Spark micro-batches." />
            <PipelineStep active label="Classify" detail="PyTorch ensemble assigns polarity and confidence." />
            <PipelineStep label="Route" detail="High-risk conversations are queued for review." />
          </section>
        </aside>

        <main className="space-y-5">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              label="Messages"
              value={`${stats.total}`}
              detail={`Cursor ${cursor % Math.max(corpus.length, 1)} of ${corpus.length}`}
              accent="bg-cyan-500"
            />
            <MetricCard
              label="Avg Latency"
              value={`${stats.avgLatency}ms`}
              detail="P50 simulated inference"
              accent="bg-emerald-500"
            />
            <MetricCard
              label="Confidence"
              value={`${stats.avgConfidence}%`}
              detail="Mean classifier certainty"
              accent="bg-indigo-500"
            />
            <MetricCard
              label="Escalations"
              value={`${stats.highPriority}`}
              detail="High-priority negative cases"
              accent="bg-rose-500"
            />
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-950">Live Classification Feed</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Streaming customer text through the sentiment pipeline.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                <span className={`h-2 w-2 rounded-full ${isStreaming ? "bg-emerald-500" : "bg-amber-500"}`} />
                {isStreaming ? "Streaming" : "Paused"}
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {messages.map((message) => (
                <MessageCard key={message.id} message={message} />
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-950">Sentiment Mix</h3>
              <span className="text-xs font-semibold text-slate-500">
                Index {formatScore(stats.avgScore)}
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {(["positive", "neutral", "negative"] as Sentiment[]).map((sentiment) => {
                const count = stats[sentiment];
                const width = Math.max(4, (count / Math.max(stats.total, 1)) * 100);
                const classes = sentimentClasses(sentiment);

                return (
                  <div key={sentiment}>
                    <div className="mb-1 flex items-center justify-between text-xs font-semibold capitalize text-slate-600">
                      <span className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${classes.dot}`} />
                        {sentiment}
                      </span>
                      <span>{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className={`h-2 rounded-full ${classes.bar}`} style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-950">Topic Drift</h3>
            <div className="mt-4 space-y-3">
              {data.topics.map((topic) => (
                <div key={topic.label} className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{topic.label}</div>
                    <div className="text-xs text-slate-500">{topic.count} conversations</div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      topic.trend > 0 ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {topic.trend > 0 ? "+" : ""}
                    {topic.trend}%
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-950">Alert Routing</h3>
            {topAlert ? (
              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-rose-600 px-2 py-1 text-xs font-semibold text-white">
                    Escalate
                  </span>
                  <span className="text-xs font-semibold text-rose-700">
                    {topAlert.confidence}% confidence
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-rose-950">{topAlert.topic}</p>
                <p className="mt-2 text-sm leading-6 text-rose-800">{topAlert.text}</p>
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                No high-priority negative messages in the visible stream.
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
