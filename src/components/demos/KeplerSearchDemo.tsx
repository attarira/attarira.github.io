"use client";

import { useState } from "react";

import DemoShell from "./DemoShell";
import { getMockData } from "@/lib/mockAPI";

type MatchSignal = {
  label: string;
  detail: string;
};

type ResultKind = "paper" | "dataset" | "catalog_object";

type KeplerResult = {
  id: string;
  title: string;
  provider: string;
  sourceUrl: string;
  date: string;
  description: string;
  recordKind: ResultKind;
  metadataLine: string;
  heroLabel: string;
  heroValue: string;
  tags: string[];
  matchSignals: MatchSignal[];
  palette: {
    primary: string;
    secondary: string;
    glow: string;
  };
};

type DemoCitation = {
  id: string;
  title: string;
  sourceUrl: string;
};

type DemoMessage = {
  role: "assistant" | "user";
  content: string;
  citations?: DemoCitation[];
};

type DemoResponse = {
  answer: string;
  citations: DemoCitation[];
  relatedResults: KeplerResult[];
  researchThreadSummary: string;
  threadConnections: string[];
  sourceBreakdown: {
    datasets: number;
    papers: number;
    catalogObjects: number;
    byProvider: Record<string, number>;
  };
};

type KeplerDemoData = {
  stats: {
    totalRecords: string;
    paperRecords: string;
    catalogRecords: string;
  };
  featured: KeplerResult[];
  library: KeplerResult[];
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<{
    0: {
      transcript: string;
    };
  }>;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

const KEPLER_LIBRARY: KeplerResult[] = [
  {
    id: "m87-eht",
    title: "Event Horizon Telescope Reconstruction of M87*",
    provider: "arXiv",
    sourceUrl: "https://arxiv.org/",
    date: "2025-04-10",
    description:
      "A multi-pipeline reconstruction study aligning interferometric observations, calibration passes, and morphology priors for black hole imaging.",
    recordKind: "paper",
    metadataLine: "EHT Collaboration · VLBI · Black hole imaging",
    heroLabel: "Angular Resolution",
    heroValue: "20 microarcsec",
    tags: ["black hole", "imaging", "event horizon", "m87", "vlbi", "radio"],
    matchSignals: [
      {
        label: "High-confidence retrieval",
        detail: "Strong overlap with imaging terminology and observational methods.",
      },
      {
        label: "Cross-source utility",
        detail: "Pairs cleanly with NASA observational archives and catalog context.",
      },
    ],
    palette: {
      primary: "#0f172a",
      secondary: "#0ea5e9",
      glow: "rgba(56, 189, 248, 0.34)",
    },
  },
  {
    id: "jwst-disk",
    title: "JWST NIRCam Mosaic of a Protoplanetary Disk Field",
    provider: "NASA",
    sourceUrl: "https://science.nasa.gov/mission/webb/",
    date: "2025-02-18",
    description:
      "A curated image and metadata package capturing disk asymmetries, scattered light structure, and follow-up spectroscopy targets in a young stellar nursery.",
    recordKind: "dataset",
    metadataLine: "JWST · NIRCam · Star formation archive",
    heroLabel: "Frames Indexed",
    heroValue: "4,218 assets",
    tags: ["jwst", "protoplanetary", "disk", "star formation", "nircam", "nebula"],
    matchSignals: [
      {
        label: "Rich observational context",
        detail: "Includes imaging products and descriptive archive metadata for follow-up.",
      },
      {
        label: "Visual relevance",
        detail: "Useful anchor source when a query starts from morphology or structure.",
      },
    ],
    palette: {
      primary: "#1e1b4b",
      secondary: "#a855f7",
      glow: "rgba(168, 85, 247, 0.32)",
    },
  },
  {
    id: "gaia-neighbors",
    title: "Gaia DR3 Sirius-like Neighbor Candidate Set",
    provider: "ESA Gaia",
    sourceUrl: "https://gea.esac.esa.int/archive/",
    date: "2024-11-03",
    description:
      "A filtered stellar neighborhood slice organized around spectral analogs, brightness bands, and parallax-derived distance features for similarity workflows.",
    recordKind: "catalog_object",
    metadataLine: "Gaia DR3 · A-type stars · Parallax / magnitude filters",
    heroLabel: "Objects Returned",
    heroValue: "1,364 matches",
    tags: ["sirius", "similar stars", "gaia", "catalog", "stellar neighborhood", "parallax"],
    matchSignals: [
      {
        label: "Similarity-friendly record",
        detail: "Catalog fields support near-neighbor exploration and ranking.",
      },
      {
        label: "Structured filters",
        detail: "Contains consistent stellar attributes for explainable comparisons.",
      },
    ],
    palette: {
      primary: "#082f49",
      secondary: "#22d3ee",
      glow: "rgba(34, 211, 238, 0.28)",
    },
  },
  {
    id: "tess-transits",
    title: "TESS Exoplanet Transit Candidate Atlas",
    provider: "NASA Exoplanet Archive",
    sourceUrl: "https://exoplanetarchive.ipac.caltech.edu/",
    date: "2025-01-28",
    description:
      "A blended transit candidate index with light-curve references, disposition notes, and linked stellar context to speed up exoplanet triage.",
    recordKind: "dataset",
    metadataLine: "TESS · Light curves · Exoplanet candidates",
    heroLabel: "Candidate Systems",
    heroValue: "9,041 records",
    tags: ["exoplanet", "transit", "tess", "light curve", "planet", "orbital"],
    matchSignals: [
      {
        label: "Signal coverage",
        detail: "Includes candidate status and light-curve context for rapid screening.",
      },
      {
        label: "Follow-up readiness",
        detail: "Works well with papers discussing confirmation pipelines and priors.",
      },
    ],
    palette: {
      primary: "#0f172a",
      secondary: "#ec4899",
      glow: "rgba(236, 72, 153, 0.3)",
    },
  },
  {
    id: "alma-dust",
    title: "ALMA Dust Ring Temperature Gradient Study",
    provider: "arXiv",
    sourceUrl: "https://arxiv.org/",
    date: "2024-09-14",
    description:
      "A paper examining ring morphology, dust temperature gradients, and chemistry priors across several planet-forming systems observed at millimeter wavelengths.",
    recordKind: "paper",
    metadataLine: "ALMA · Millimeter continuum · Planet-forming disks",
    heroLabel: "Sample Size",
    heroValue: "17 disk systems",
    tags: ["alma", "dust ring", "disk", "planet formation", "millimeter", "chemistry"],
    matchSignals: [
      {
        label: "Theoretical support",
        detail: "Adds interpretation around disk substructure seen in observation sets.",
      },
      {
        label: "Methodological bridge",
        detail: "Helpful when connecting imagery to physical explanations.",
      },
    ],
    palette: {
      primary: "#172554",
      secondary: "#818cf8",
      glow: "rgba(129, 140, 248, 0.3)",
    },
  },
  {
    id: "hubble-ionization",
    title: "Hubble Deep Field Ionization Archive",
    provider: "NASA",
    sourceUrl: "https://science.nasa.gov/mission/hubble/",
    date: "2024-08-01",
    description:
      "A deep archival bundle of calibrated images and observation notes spanning ionization fronts, emission structure, and instrument settings across several fields.",
    recordKind: "dataset",
    metadataLine: "Hubble · Wide-field imaging · Emission regions",
    heroLabel: "Observation Windows",
    heroValue: "138 sequences",
    tags: ["hubble", "deep field", "ionization", "emission", "nebula", "archive"],
    matchSignals: [
      {
        label: "Archive depth",
        detail: "Dense metadata makes it useful as a reference corpus for exploratory search.",
      },
      {
        label: "Complementary coverage",
        detail: "Pairs well with newer telescope imagery when comparing evolution or wavelength bands.",
      },
    ],
    palette: {
      primary: "#083344",
      secondary: "#38bdf8",
      glow: "rgba(56, 189, 248, 0.24)",
    },
  },
  {
    id: "kepler-resonance",
    title: "Kepler Multi-planet Resonance and Transit Timing Analysis",
    provider: "arXiv",
    sourceUrl: "https://arxiv.org/",
    date: "2025-03-04",
    description:
      "Transit timing variation analysis across compact systems, highlighting resonance chains, instability boundaries, and confirmation heuristics.",
    recordKind: "paper",
    metadataLine: "Kepler mission · Transit timing · Resonant chains",
    heroLabel: "Systems Analyzed",
    heroValue: "42 resonant systems",
    tags: ["kepler", "transit", "timing", "resonance", "exoplanet", "orbital"],
    matchSignals: [
      {
        label: "Analytical depth",
        detail: "Adds dynamical interpretation for catalog or archive transit results.",
      },
      {
        label: "High semantic overlap",
        detail: "Strong match on exoplanet transit and orbital reasoning language.",
      },
    ],
    palette: {
      primary: "#1f2937",
      secondary: "#f472b6",
      glow: "rgba(244, 114, 182, 0.28)",
    },
  },
  {
    id: "flare-monitor",
    title: "Nearby Red Dwarf Flare Monitor",
    provider: "SIMBAD",
    sourceUrl: "https://simbad.cds.unistra.fr/simbad/",
    date: "2024-12-12",
    description:
      "A catalog-oriented monitor aggregating flare frequency, spectral type, and distance features for active nearby red dwarf stars.",
    recordKind: "catalog_object",
    metadataLine: "SIMBAD · M dwarfs · Activity metrics",
    heroLabel: "Active Sources",
    heroValue: "612 catalog objects",
    tags: ["red dwarf", "flare", "catalog", "stellar activity", "simbad", "nearby stars"],
    matchSignals: [
      {
        label: "Catalog grounding",
        detail: "Structured stellar activity fields support precise filtered exploration.",
      },
      {
        label: "Neighbor analysis",
        detail: "Useful when users ask for similar nearby stars or flare-prone objects.",
      },
    ],
    palette: {
      primary: "#3f0d12",
      secondary: "#fb7185",
      glow: "rgba(251, 113, 133, 0.26)",
    },
  },
];

const KEPLER_DEMO_DATA: KeplerDemoData = {
  stats: {
    totalRecords: "4.8M",
    paperRecords: "620K",
    catalogRecords: "1.9M",
  },
  featured: KEPLER_LIBRARY.slice(0, 4),
  library: KEPLER_LIBRARY,
};

const INTRO_MESSAGE =
  "Ask across NASA datasets, arXiv papers, and star catalogs. The demo will ground answers in retrieved records and sketch a research thread across sources.";

const SUGGESTED_QUERIES = [
  "papers on black hole imaging",
  "NASA datasets related to star formation",
  "stars similar to Sirius",
  "cross-source thread on exoplanet transits",
];

function getRecordLabel(recordKind: ResultKind) {
  if (recordKind === "paper") {
    return "Paper";
  }

  if (recordKind === "catalog_object") {
    return "Catalog Object";
  }

  return "Dataset";
}

function buildSourceBreakdown(results: KeplerResult[]) {
  return results.reduce<DemoResponse["sourceBreakdown"]>(
    (accumulator, result) => {
      if (result.recordKind === "paper") {
        accumulator.papers += 1;
      } else if (result.recordKind === "catalog_object") {
        accumulator.catalogObjects += 1;
      } else {
        accumulator.datasets += 1;
      }

      accumulator.byProvider[result.provider] =
        (accumulator.byProvider[result.provider] ?? 0) + 1;

      return accumulator;
    },
    {
      datasets: 0,
      papers: 0,
      catalogObjects: 0,
      byProvider: {},
    }
  );
}

function scoreResult(result: KeplerResult, terms: string[]) {
  const haystack = [
    result.title,
    result.description,
    result.metadataLine,
    result.heroValue,
    result.provider,
    ...result.tags,
  ]
    .join(" ")
    .toLowerCase();

  const matchedTags = new Set<string>();
  let score = 0;

  for (const term of terms) {
    if (haystack.includes(term)) {
      score += 1;
    }

    for (const tag of result.tags) {
      if (tag.includes(term) || term.includes(tag)) {
        matchedTags.add(tag);
        score += 3;
      }
    }
  }

  return {
    score,
    matchedTags: Array.from(matchedTags),
  };
}

function buildMockResponse(question: string, library: KeplerResult[]): DemoResponse {
  const normalizedQuestion = question.trim().toLowerCase();
  const terms = normalizedQuestion.split(/[^a-z0-9*]+/).filter(Boolean);

  const ranked = library
    .map((result) => {
      const { score, matchedTags } = scoreResult(result, terms);

      return {
        result,
        score,
        matchedTags,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score);

  const fallback = library.slice(0, 4).map((result) => ({
    result,
    score: 0,
    matchedTags: result.tags.slice(0, 2),
  }));

  const relatedResults = (ranked.length ? ranked.slice(0, 4) : fallback).map(
    ({ result, matchedTags }) => ({
      ...result,
      matchSignals: [
        {
          label: "Query overlap",
          detail: matchedTags.length
            ? `Matched on ${matchedTags.slice(0, 3).join(", ")} across titles, metadata, and retrieval tags.`
            : "Matched on broader astronomy search intent and source diversity.",
        },
        ...result.matchSignals.slice(0, 1),
      ],
    })
  );

  const citations = relatedResults.map((result) => ({
    id: result.id,
    title: result.title,
    sourceUrl: result.sourceUrl,
  }));

  const sourceBreakdown = buildSourceBreakdown(relatedResults);
  const [anchor, support, context, extension] = relatedResults;
  const topic = question.trim().replace(/\?+$/, "");

  const answer = anchor
    ? `I found ${relatedResults.length} strong records for ${topic}. ${anchor.title} is the anchor result because it gives the clearest entry point, while ${
        support?.title ?? "the supporting records"
      } adds complementary context from ${support?.provider ?? "another source"}. ${
        context
          ? `${context.title} helps connect the search to a wider research thread instead of leaving it as a single-source lookup.`
          : "The retrieved mix stays grounded across multiple source types."
      }`
    : `I searched for ${topic}, but this demo did not retrieve any records.`;

  const researchThreadSummary = anchor
    ? `The strongest thread links ${anchor.provider} ${
        anchor.recordKind === "paper" ? "analysis" : "observational data"
      } with ${
        support?.provider ?? "a second source"
      } context, then uses ${
        context?.provider ?? "catalog evidence"
      } to give the query a broader discovery path. This is the core value of the blended Kepler Search workflow.`
    : "Ask a more specific astronomy question to generate a cross-source thread.";

  const threadConnections = [
    anchor && support
      ? `${anchor.title} establishes the primary signal, while ${support.title} adds a second source that can validate or expand the same topic.`
      : null,
    support && context
      ? `${support.provider} metadata narrows the search space before ${context.provider} supplies adjacent evidence or follow-up context.`
      : null,
    context && extension
      ? `${context.title} and ${extension.title} together suggest a next step for comparing observations, papers, and structured records in one session.`
      : null,
  ].filter((value): value is string => Boolean(value));

  return {
    answer,
    citations,
    relatedResults,
    researchThreadSummary,
    threadConnections,
    sourceBreakdown,
  };
}

function SearchSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-[30px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_20px_70px_rgba(2,6,23,0.45)] backdrop-blur-xl"
        >
          <div className="h-52 animate-pulse rounded-[26px] bg-white/8" />
          <div className="mt-5 h-6 w-3/4 animate-pulse rounded-full bg-white/8" />
          <div className="mt-4 h-20 animate-pulse rounded-3xl bg-white/8" />
          <div className="mt-4 h-14 animate-pulse rounded-3xl bg-white/8" />
        </div>
      ))}
    </div>
  );
}

function DemoResultCard({ result }: { result: KeplerResult }) {
  const recordLabel = getRecordLabel(result.recordKind);

  return (
    <a
      className="group block h-full outline-none"
      href={result.sourceUrl}
      rel="noreferrer"
      target="_blank"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_70px_rgba(2,6,23,0.45)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-sky-300/20">
        <div className="relative h-52 overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/80">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, ${result.palette.glow}, transparent 34%), linear-gradient(135deg, ${result.palette.primary} 0%, ${result.palette.secondary} 100%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08)_0%,rgba(2,6,23,0.2)_48%,rgba(2,6,23,0.8)_100%)]" />
          <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="absolute right-5 top-5 h-20 w-20 rounded-full border border-white/25" />
          <div className="absolute bottom-8 left-8 h-2 w-2 rounded-full bg-white/80 shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
          <div className="absolute bottom-16 left-14 h-1.5 w-1.5 rounded-full bg-white/70" />
          <div className="absolute bottom-12 left-20 h-1 w-1 rounded-full bg-sky-200/80" />

          <div className="relative flex h-full flex-col justify-between p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex items-center rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-100/80">
                {recordLabel}
              </span>
              <span className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-200">
                {result.provider}
              </span>
            </div>

            <div className="max-w-[78%] rounded-[22px] border border-white/12 bg-slate-950/35 px-4 py-3 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-300/70">
                {result.heroLabel}
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {result.heroValue}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
            <span>{result.provider}</span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span>{new Date(result.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>

          <h3 className="mt-3 text-xl font-semibold text-white">
            {result.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {result.description}
          </p>
          <p className="mt-3 text-sm text-slate-400">{result.metadataLine}</p>

          <div className="mt-5 rounded-3xl border border-sky-300/15 bg-sky-300/5 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-100/70">
              Why This Matched
            </p>
            <ul className="mt-3 space-y-2">
              {result.matchSignals.map((signal) => (
                <li key={`${result.id}-${signal.label}`} className="text-sm text-slate-200">
                  <span className="font-medium text-white">{signal.label}:</span>{" "}
                  {signal.detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </a>
  );
}

function KeplerSearchExperience({ snapshot }: { snapshot: KeplerDemoData }) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<DemoResponse | null>(null);
  const [messages, setMessages] = useState<DemoMessage[]>([
    {
      role: "assistant",
      content: INTRO_MESSAGE,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const relatedResults = response?.relatedResults ?? [];
  const queryCount = messages.filter((message) => message.role === "user").length;
  const showConversation = messages.length > 1 || isLoading || Boolean(error);

  async function sendQuestion(nextQuestion = query) {
    const trimmedQuestion = nextQuestion.trim();

    if (!trimmedQuestion || isLoading) {
      return;
    }

    setError(null);
    setIsLoading(true);
    setQuery("");
    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: trimmedQuestion,
      },
    ]);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 850);
    });

    try {
      const payload = buildMockResponse(trimmedQuestion, snapshot.library);

      setResponse(payload);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: payload.answer,
          citations: payload.citations,
        },
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Research chat request failed"
      );
    } finally {
      setIsLoading(false);
    }
  }

  function clearConversation() {
    setQuery("");
    setResponse(null);
    setError(null);
    setMessages([
      {
        role: "assistant",
        content: INTRO_MESSAGE,
      },
    ]);
  }

  function handleDictation() {
    const SpeechRecognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Dictation is not available in this browser.");
      return;
    }

    setError(null);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();

      if (transcript) {
        setQuery((current) =>
          `${current}${current ? " " : ""}${transcript}`.trim()
        );
      }
    };

    recognition.onerror = () => {
      setError("Dictation failed. Try typing the query instead.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    setIsListening(true);
    recognition.start();
  }

  return (
    <div className="relative min-h-full overflow-hidden bg-[linear-gradient(180deg,#020617_0%,#040b16_36%,#020617_100%)] text-slate-200">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(192,132,252,0.14),transparent_24%),radial-gradient(circle_at_20%_90%,rgba(251,113,133,0.12),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_14%_18%,rgba(255,255,255,0.9)_0_1px,transparent_1px),radial-gradient(circle_at_82%_24%,rgba(255,255,255,0.75)_0_1px,transparent_1px),radial-gradient(circle_at_63%_68%,rgba(255,255,255,0.7)_0_1px,transparent_1px),radial-gradient(circle_at_35%_82%,rgba(125,211,252,0.8)_0_1px,transparent_1px),radial-gradient(circle_at_56%_35%,rgba(192,132,252,0.8)_0_1px,transparent_1px)] [background-size:280px_280px,240px_240px,320px_320px,220px_220px,300px_300px]" />

      <div className="relative flex min-h-full flex-col">
        <header className="border-b border-white/10 px-4 py-4 sm:px-6">
          <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-10">
              <div className="flex items-center gap-3 text-xl font-semibold tracking-[-0.05em] text-white sm:text-2xl">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.07] shadow-[0_0_0_1px_rgba(125,211,252,0.1),0_18px_48px_rgba(2,6,23,0.45)]">
                  K
                </span>
                <span>Kepler Search</span>
              </div>

              <nav className="flex items-center gap-6">
                <button className="border-b border-transparent px-0 text-sm font-medium text-slate-400 transition hover:border-white/35 hover:text-white">
                  About
                </button>
                <button className="border-b border-transparent px-0 text-sm font-medium text-slate-400 transition hover:border-white/35 hover:text-white">
                  Pricing
                </button>
              </nav>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex h-10 items-center rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm text-slate-400">
                Demo mode
              </span>
              <button className="inline-flex h-10 items-center rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-slate-300 transition hover:text-white">
                Sign In
              </button>
              <button className="inline-flex h-10 items-center rounded-full border border-sky-300/20 bg-sky-300/10 px-4 text-sm font-semibold text-white transition hover:text-sky-200">
                Observer Pro
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 xl:px-8">
          <section className="rounded-[34px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_70px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="max-w-4xl">
                <span className="inline-flex items-center rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-100/80">
                  Astronomy Research Copilot
                </span>
                <h2 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight text-white sm:text-5xl xl:text-6xl">
                  Search the astronomy research graph in one place.
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                  Dark, cinematic search UI for blending NASA datasets, arXiv
                  papers, and star catalogs into one research workflow.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["NASA Datasets", "arXiv Papers", "Gaia DR3", "Exoplanet Archive"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid min-w-[280px] gap-3 sm:grid-cols-3">
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Indexed Records
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    {snapshot.stats.totalRecords}
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    arXiv Papers
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    {snapshot.stats.paperRecords}
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Catalog Objects
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    {snapshot.stats.catalogRecords}
                  </p>
                </div>
              </div>
            </div>

            <form
              className="mt-8 space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                void sendQuestion();
              }}
            >
              <div className="rounded-[32px] border border-white/10 bg-slate-950/70 p-3">
                <div className="flex gap-3">
                  <textarea
                    className="min-h-[120px] w-full resize-none rounded-3xl border-0 bg-transparent px-4 py-4 text-lg leading-8 text-slate-100 outline-none placeholder:text-slate-400"
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void sendQuestion();
                      }
                    }}
                    placeholder="Ask for papers on black hole imaging, NASA datasets related to star formation, stars similar to Sirius, or a cross-source research thread on exoplanet transits..."
                    value={query}
                  />

                  <div className="flex shrink-0 flex-col justify-end gap-3 pb-2">
                    <button
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-slate-200 transition ${
                        isListening
                          ? "border-rose-300/40 bg-rose-300/10 text-rose-100"
                          : "border-white/10 bg-white/5 hover:border-sky-300/30 hover:bg-sky-300/10 hover:text-white"
                      }`}
                      onClick={handleDictation}
                      type="button"
                    >
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 15.5C14.2091 15.5 16 13.7091 16 11.5V7.5C16 5.29086 14.2091 3.5 12 3.5C9.79086 3.5 8 5.29086 8 7.5V11.5C8 13.7091 9.79086 15.5 12 15.5Z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                        <path
                          d="M5.5 11.5C5.5 15.0899 8.41015 18 12 18C15.5899 18 18.5 15.0899 18.5 11.5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                        <path d="M12 18V21" stroke="currentColor" strokeWidth="1.7" />
                      </svg>
                      <span className="sr-only">Start dictation</span>
                    </button>
                    <button
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-sky-300/30 hover:bg-sky-300/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!query.trim() || isLoading}
                      type="submit"
                    >
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4 20L20 12L4 4L7 12L4 20Z" fill="currentColor" />
                      </svg>
                      <span className="sr-only">Send message</span>
                    </button>
                  </div>
                </div>

                {showConversation ? (
                  <div className="mt-3 flex px-2 pb-1">
                    <button
                      className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-rose-300/30 hover:bg-rose-300/10"
                      onClick={clearConversation}
                      type="button"
                    >
                      Clear
                    </button>
                  </div>
                ) : null}
              </div>

              {!showConversation ? (
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUERIES.map((suggestion) => (
                    <button
                      key={suggestion}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-sky-300/20 hover:bg-sky-300/8"
                      onClick={() => setQuery(suggestion)}
                      type="button"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : null}
            </form>
          </section>

          {showConversation ? (
            <section className="space-y-6">
              <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_70px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h3 className="text-3xl font-semibold text-white">
                      {queryCount} research {queryCount === 1 ? "query" : "queries"} in this
                      session
                    </h3>
                  </div>
                  {response ? (
                    <div className="flex flex-wrap gap-2">
                      <div className="rounded-full border border-sky-300/15 bg-sky-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
                        {response.relatedResults.length} ranked results
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                        {response.sourceBreakdown.datasets} datasets ·{" "}
                        {response.sourceBreakdown.papers} papers ·{" "}
                        {response.sourceBreakdown.catalogObjects} catalog
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={
                        message.role === "assistant"
                          ? "rounded-[28px] border border-white/10 bg-white/[0.04] p-5"
                          : "ml-auto max-w-4xl rounded-[28px] bg-sky-300 px-5 py-4 text-slate-950"
                      }
                    >
                      <p
                        className={`text-[11px] uppercase tracking-[0.2em] ${
                          message.role === "assistant"
                            ? "text-slate-500"
                            : "text-slate-900/70"
                        }`}
                      >
                        {message.role === "assistant" ? "Research Copilot" : "You"}
                      </p>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-8">
                        {message.content}
                      </p>
                      {message.citations?.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {message.citations.map((citation, citationIndex) => (
                            <a
                              key={`${citation.id}-${citationIndex}`}
                              className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs text-slate-200 transition hover:border-sky-300/25 hover:text-white"
                              href={citation.sourceUrl}
                              rel="noreferrer"
                              target="_blank"
                            >
                              {citationIndex + 1}. {citation.title}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}

                  {isLoading ? (
                    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                        Research Copilot
                      </p>
                      <div className="mt-3 h-24 animate-pulse rounded-2xl bg-white/8" />
                    </div>
                  ) : null}

                  {error ? (
                    <div className="rounded-[28px] border border-rose-400/20 bg-rose-400/10 p-5 text-sm text-rose-100">
                      {error}
                    </div>
                  ) : null}
                </div>
              </div>

              <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <article className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_70px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-8">
                  <h3 className="text-2xl font-semibold text-white">
                    Research Thread
                  </h3>
                  <p className="mt-5 text-base leading-8 text-slate-200">
                    {response?.researchThreadSummary ??
                      "Ask a more specific question to generate a cross-source research thread."}
                  </p>
                  {response?.threadConnections.length ? (
                    <div className="mt-6 space-y-3">
                      {response.threadConnections.map((connection) => (
                        <div
                          key={connection}
                          className="rounded-3xl border border-white/10 bg-slate-950/50 p-4 text-sm leading-7 text-slate-200"
                        >
                          {connection}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>

                <article className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_70px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-8">
                  <h3 className="text-2xl font-semibold text-white">Source Mix</h3>
                  <div className="mt-6 grid gap-3">
                    {Object.entries(response?.sourceBreakdown.byProvider ?? {}).map(
                      ([provider, count]) => (
                        <div
                          key={provider}
                          className="rounded-3xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-200"
                        >
                          {provider}: {count}
                        </div>
                      )
                    )}
                  </div>
                </article>
              </section>

              <div className="space-y-5">
                <div>
                  <h3 className="text-3xl font-semibold text-white">Results</h3>
                </div>

                {isLoading ? (
                  <SearchSkeleton />
                ) : relatedResults.length ? (
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {relatedResults.map((result) => (
                      <DemoResultCard key={result.id} result={result} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_18px_70px_rgba(2,6,23,0.45)] backdrop-blur-xl">
                    <h3 className="text-2xl font-semibold text-white">
                      The assistant did not retrieve any supporting records for the
                      last message.
                    </h3>
                  </div>
                )}
              </div>
            </section>
          ) : (
            <section className="space-y-5">
              <div>
                <h3 className="text-3xl font-semibold text-white">Featured</h3>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {snapshot.featured.map((item) => (
                  <DemoResultCard key={item.id} result={item} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default function KeplerSearchDemo() {
  async function fetchDemoData() {
    return getMockData<KeplerDemoData>({
      id: "kepler-search-demo",
      delayMs: 900,
      mockResponse: KEPLER_DEMO_DATA,
    });
  }

  return (
    <DemoShell title="Kepler Search" fetchData={fetchDemoData}>
      {(data) => (data ? <KeplerSearchExperience snapshot={data} /> : null)}
    </DemoShell>
  );
}
