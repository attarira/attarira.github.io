"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import DemoShell from "./DemoShell";
import { getMockData } from "@/lib/mockAPI";

type DemoTab = "dashboard" | "documents" | "analysis" | "settings";
type DocumentStatus = "Ready" | "Indexing" | "Processing";
type ReviewState = "idle" | "loading" | "ready";

type Citation = {
  docId: string;
  label: string;
  page: string;
};

type ExcerptCard = {
  docId: string;
  title: string;
  page: string;
  excerpt: string;
};

type AnalysisContext = {
  feedbackCount: number;
  excerptCards: ExcerptCard[];
  citations: Citation[];
  reasoningSteps: string[];
};

type DemoDocument = {
  id: string;
  name: string;
  size: string;
  status: DocumentStatus;
  progress: number;
  pageCount: number;
  category: string;
  accentClass: string;
  excerptTitle: string;
  excerptPage: string;
  excerpt: string;
  reasoningSteps: string[];
  citations: Citation[];
};

type InsightBullet = {
  title: string;
  detail: string;
  citation: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  bullets?: InsightBullet[];
  analysis?: AnalysisContext;
};

type MockFinSearchData = {
  sessionId: string;
  documents: DemoDocument[];
  messages: ChatMessage[];
  activeTab: DemoTab;
  activeMessageId: string;
};

type ScenarioResponse = {
  text: string;
  bullets: InsightBullet[];
  analysis: AnalysisContext;
  primaryDocId: string;
};

type IconProps = {
  className?: string;
};

function LogoGlyph({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="finsearch-lens" x1="9" y1="8" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1D4ED8" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="finsearch-core" x1="15" y1="12" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#818CF8" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="13" stroke="url(#finsearch-lens)" strokeWidth="3.2" />
      <path
        d="M29.5 30L38.5 39"
        stroke="#0F172A"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="20" r="7.25" fill="url(#finsearch-core)" fillOpacity="0.18" />
      <circle cx="20" cy="20" r="2.4" fill="#2563EB" />
      <circle cx="15" cy="16" r="1.7" fill="#38BDF8" />
      <circle cx="26" cy="15.5" r="1.7" fill="#60A5FA" />
      <circle cx="25.5" cy="25.5" r="1.7" fill="#818CF8" />
      <path
        d="M16 16.8L19 19.2M21.4 19L24.3 16.2M21.1 21.5L24.4 24.6"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashboardGlyph({ className = "h-[17px] w-[17px]" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <rect x="2" y="2" width="6" height="6" rx="1.4" opacity="0.9" />
      <rect x="12" y="2" width="6" height="4.2" rx="1.4" opacity="0.72" />
      <rect x="12" y="8.4" width="6" height="9.6" rx="1.4" opacity="0.92" />
      <rect x="2" y="10" width="6" height="8" rx="1.4" opacity="0.64" />
    </svg>
  );
}

function DocumentGlyph({ className = "h-[17px] w-[17px]" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M5.4 2.25h5.75l4.1 4.1v9.2A2.2 2.2 0 0113.05 17.75H5.4a2.2 2.2 0 01-2.2-2.2v-11.1a2.2 2.2 0 012.2-2.2z" opacity="0.9" />
      <path d="M11.15 2.25v3.2a1.4 1.4 0 001.4 1.4h2.7" fill="#F8FAFC" opacity="0.95" />
    </svg>
  );
}

function AnalysisGlyph({ className = "h-[17px] w-[17px]" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M3 16.5h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5.25 13.4l3.2-3.1 2.25 2.15 4.1-5.2" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 3.5v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.72" />
    </svg>
  );
}

function SettingsGlyph({ className = "h-[17px] w-[17px]" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M8.31 2.26a1.2 1.2 0 013.38 0l.2.73c.1.34.35.61.67.72.32.12.67.08.96-.1l.64-.4a1.2 1.2 0 011.5.17l.86.86a1.2 1.2 0 01.17 1.5l-.4.63c-.18.3-.22.65-.1.97.12.32.39.57.73.66l.72.2a1.2 1.2 0 010 3.38l-.72.2c-.34.1-.61.34-.73.66-.12.32-.08.68.1.97l.4.63a1.2 1.2 0 01-.17 1.5l-.86.86a1.2 1.2 0 01-1.5.17l-.64-.4a1.2 1.2 0 00-.96-.1c-.32.11-.57.38-.67.72l-.2.73a1.2 1.2 0 01-3.38 0l-.2-.73a1.2 1.2 0 00-.67-.72 1.2 1.2 0 00-.96.1l-.64.4a1.2 1.2 0 01-1.5-.17l-.86-.86a1.2 1.2 0 01-.17-1.5l.4-.63c.18-.3.22-.65.1-.97a1.2 1.2 0 00-.73-.66l-.72-.2a1.2 1.2 0 010-3.38l.72-.2c.34-.1.61-.34.73-.66.12-.32.08-.68-.1-.97l-.4-.63a1.2 1.2 0 01.17-1.5l.86-.86a1.2 1.2 0 011.5-.17l.64.4c.29.18.64.22.96.1.32-.11.57-.38.67-.72l.2-.73z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="10" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function UploadGlyph({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 16.5V7.25" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M8.5 10.5L12 7l3.5 3.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M7 18.5h9.5a4 4 0 10-.65-7.95A5.5 5.5 0 005.7 8.4 3.75 3.75 0 007 18.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchGlyph({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="8.2" cy="8.2" r="4.8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M11.9 11.9L16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FilterGlyph({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M4 5h12M6.5 10h7M8.5 15h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="4" cy="5" r="1.3" fill="currentColor" />
      <circle cx="6.5" cy="10" r="1.3" fill="currentColor" />
      <circle cx="8.5" cy="15" r="1.3" fill="currentColor" />
    </svg>
  );
}

function SparkGlyph({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M8.2 2.5l1.25 4.05 4.05 1.25-4.05 1.25L8.2 13.1 6.95 9.05 2.9 7.8l4.05-1.25L8.2 2.5z" fill="currentColor" opacity="0.9" />
      <path d="M14.7 11.2l.7 2.2 2.2.7-2.2.7-.7 2.2-.7-2.2-2.2-.7 2.2-.7.7-2.2z" fill="currentColor" opacity="0.72" />
    </svg>
  );
}

function UserGlyph({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M10 10.25a3.6 3.6 0 100-7.2 3.6 3.6 0 000 7.2z" opacity="0.88" />
      <path d="M3.35 17.1a6.65 6.65 0 0113.3 0v.6H3.35v-.6z" opacity="0.65" />
    </svg>
  );
}

function ChevronDownGlyph({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KebabGlyph({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="10" cy="4" r="1.6" />
      <circle cx="10" cy="10" r="1.6" />
      <circle cx="10" cy="16" r="1.6" />
    </svg>
  );
}

function FeedbackGlyph({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M4.2 4.2h11.6v8.1H9.6l-3.4 2.9v-2.9H4.2V4.2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M7 7.6h6M7 10h3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function SendGlyph({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 11.5L20 4 13.5 20l-2.4-6.1L4 11.5z" fill="currentColor" opacity="0.22" />
      <path d="M20 4L11.1 13.9M4 11.5L20 4 13.5 20l-2.4-6.1L4 11.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadGlyph({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 4.5v10m0 0l4-4m-4 4l-4-4M5 17.5v1A1.5 1.5 0 006.5 20h11a1.5 1.5 0 001.5-1.5v-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const NAV_ITEMS: { id: DemoTab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <DashboardGlyph /> },
  { id: "documents", label: "Documents", icon: <DocumentGlyph /> },
  { id: "analysis", label: "Analysis", icon: <AnalysisGlyph /> },
  { id: "settings", label: "Settings", icon: <SettingsGlyph /> },
];

const DEFAULT_PROMPTS = [
  "Summarize the key compliance risks in this filing.",
  "Compare ESMA and FCA updates for reporting conflicts.",
  "What is the capital impact under Basel IV?",
];

function getInitialData(): MockFinSearchData {
  const documents: DemoDocument[] = [
    {
      id: "sec-10k",
      name: "SEC_Form_10K_2023.pdf",
      size: "2.5MB",
      status: "Ready",
      progress: 100,
      pageCount: 164,
      category: "Filing",
      accentClass: "bg-rose-100 text-rose-600",
      excerptTitle: "Retrieved Document Excerpts",
      excerptPage: "Page 5",
      excerpt:
        "...significant risk related to cybersecurity incidents, which could lead to data breaches, financial loss, and reputational damage. Our current systems...",
      reasoningSteps: [
        "Identified document type: 10-K filing.",
        "Extracted sections related to risk factors, compliance, and regulatory matters.",
        "Ranked passages by impact on cybersecurity, climate, and enforcement exposure.",
      ],
      citations: [
        { docId: "sec-10k", label: "SEC_Form_10K_2023.pdf", page: "Page 5" },
        { docId: "sec-10k", label: "SEC_Form_10K_2023.pdf", page: "Page 12" },
        { docId: "sec-10k", label: "SEC_Form_10K_2023.pdf", page: "Page 28" },
      ],
    },
    {
      id: "esma-mifid",
      name: "ESMA_Consultation_Paper_MiFID_II.pdf",
      size: "1.8MB",
      status: "Indexing",
      progress: 74,
      pageCount: 89,
      category: "Consultation",
      accentClass: "bg-sky-100 text-sky-600",
      excerptTitle: "Cross-Border Reporting Notes",
      excerptPage: "Page 12",
      excerpt:
        "...ESMA proposes enhanced pre-trade transparency and tighter data retention windows for transaction reporting across investment firms operating in multiple jurisdictions...",
      reasoningSteps: [
        "Parsed consultation paper sections on post-trade reporting and pre-trade transparency.",
        "Matched policy language against FCA reporting thresholds.",
        "Flagged timing and retention mismatches for compliance review.",
      ],
      citations: [
        { docId: "esma-mifid", label: "ESMA_Consultation_Paper_MiFID_II.pdf", page: "Page 12" },
        { docId: "esma-mifid", label: "ESMA_Consultation_Paper_MiFID_II.pdf", page: "Page 19" },
      ],
    },
    {
      id: "basel-iv",
      name: "Basel_IV_Framework.pdf",
      size: "3.1MB",
      status: "Ready",
      progress: 100,
      pageCount: 212,
      category: "Framework",
      accentClass: "bg-violet-100 text-violet-600",
      excerptTitle: "Capital Buffer Guidance",
      excerptPage: "Page 41",
      excerpt:
        "...the revised output floor constrains the extent to which internal models can reduce risk-weighted assets, increasing minimum capital requirements for selected portfolios...",
      reasoningSteps: [
        "Located Basel IV sections on output floor and operational risk capital.",
        "Mapped impacted capital ratios to high-risk product lines.",
        "Summarized buffer pressure for downstream management review.",
      ],
      citations: [
        { docId: "basel-iv", label: "Basel_IV_Framework.pdf", page: "Page 41" },
        { docId: "basel-iv", label: "Basel_IV_Framework.pdf", page: "Page 63" },
      ],
    },
    {
      id: "fca-q4",
      name: "FCA_Market_Update_Q4.pdf",
      size: "950KB",
      status: "Processing",
      progress: 58,
      pageCount: 47,
      category: "Market Update",
      accentClass: "bg-amber-100 text-amber-600",
      excerptTitle: "Supervisory Update",
      excerptPage: "Page 5",
      excerpt:
        "...the FCA expects firms to accelerate suspicious transaction reporting and maintain more frequent evidence packs for market conduct reviews in Q4 supervisory cycles...",
      reasoningSteps: [
        "Extracted FCA supervisory expectations for reporting cadence.",
        "Compared review cadence to existing internal evidence collection timelines.",
        "Identified operating model gaps against European reporting obligations.",
      ],
      citations: [
        { docId: "fca-q4", label: "FCA_Market_Update_Q4.pdf", page: "Page 5" },
        { docId: "fca-q4", label: "FCA_Market_Update_Q4.pdf", page: "Page 18" },
      ],
    },
  ];

  const firstAnalysis: AnalysisContext = {
    feedbackCount: 1,
    excerptCards: [
      {
        docId: "sec-10k",
        title: "SEC_Form_10K_2023.pdf",
        page: "Page 5",
        excerpt:
          "...significant risk related to cybersecurity incidents, which could lead to data breaches, financial loss, and reputational damage. Our current systems...",
      },
    ],
    citations: documents[0].citations,
    reasoningSteps: documents[0].reasoningSteps,
  };

  const secondAnalysis: AnalysisContext = {
    feedbackCount: 2,
    excerptCards: [
      {
        docId: "esma-mifid",
        title: "ESMA_Consultation_Paper_MiFID_II.pdf",
        page: "Page 12",
        excerpt:
          "...enhanced pre-trade transparency and tighter data retention windows for transaction reporting across investment firms...",
      },
      {
        docId: "fca-q4",
        title: "FCA_Market_Update_Q4.pdf",
        page: "Page 5",
        excerpt:
          "...accelerate suspicious transaction reporting and maintain more frequent evidence packs for market conduct reviews...",
      },
    ],
    citations: [...documents[1].citations, ...documents[3].citations],
    reasoningSteps: [
      "Aligned ESMA and FCA passages around reporting deadlines and evidence retention.",
      "Clustered overlapping obligations into disclosure, surveillance, and escalation themes.",
      "Surfaced conflicts where firms would need jurisdiction-specific operating rules.",
    ],
  };

  const messages: ChatMessage[] = [
    {
      id: "msg-user-1",
      role: "user",
      text: "Summarize the key compliance risks in this filing.",
    },
    {
      id: "msg-assistant-1",
      role: "assistant",
      text: "Based on the SEC_Form_10K_2023.pdf filing, the key compliance risks include:",
      bullets: [
        {
          title: "Cybersecurity Vulnerabilities",
          detail: "Increased threats to data security and operational resilience.",
          citation: "[Doc 1, Pg 5]",
        },
        {
          title: "Climate-Related Disclosures",
          detail: "New reporting requirements regarding environmental impact and governance controls.",
          citation: "[Doc 1, Pg 12]",
        },
        {
          title: "Regulatory Enforcement",
          detail: "Heightened scrutiny in the areas of consumer protection and market integrity.",
          citation: "[Doc 1, Pg 28]",
        },
      ],
      analysis: firstAnalysis,
    },
    {
      id: "msg-user-2",
      role: "user",
      text: "Compare these two regulations and highlight conflicts between ESMA and FCA updates.",
    },
    {
      id: "msg-assistant-2",
      role: "assistant",
      text: "Comparing the ESMA Consultation Paper and the FCA Market Update, here are potential conflicts:",
      bullets: [
        {
          title: "Disclosure Timing",
          detail: "ESMA proposes tighter transparency windows while FCA guidance prioritizes accelerated incident escalation.",
          citation: "[Doc 2, Pg 12]",
        },
        {
          title: "Market Surveillance Thresholds",
          detail: "The regimes use different materiality triggers for supervisory follow-up and exception handling.",
          citation: "[Doc 4, Pg 5]",
        },
        {
          title: "Evidence Retention",
          detail: "Cross-border teams may need separate documentation workflows to satisfy both retention standards.",
          citation: "[Doc 2, Pg 19]",
        },
      ],
      analysis: secondAnalysis,
    },
  ];

  return {
    sessionId: Math.random().toString(36).slice(2),
    documents,
    messages,
    activeTab: "dashboard",
    activeMessageId: "msg-assistant-1",
  };
}

function buildDocumentAnalysis(document: DemoDocument): AnalysisContext {
  return {
    feedbackCount: 1,
    excerptCards: [
      {
        docId: document.id,
        title: document.name,
        page: document.excerptPage,
        excerpt: document.excerpt,
      },
    ],
    citations: document.citations,
    reasoningSteps: document.reasoningSteps,
  };
}

function getScenarioResponse(query: string): ScenarioResponse {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("compare") || lowerQuery.includes("esma") || lowerQuery.includes("fca")) {
    return {
      primaryDocId: "esma-mifid",
      text: "I compared the ESMA consultation language with the latest FCA market update and isolated the operating conflicts most likely to affect compliance workflows.",
      bullets: [
        {
          title: "Reporting Cadence Mismatch",
          detail: "ESMA expects tighter transaction disclosure windows while the FCA update emphasizes faster supervisory escalation packs.",
          citation: "[Doc 2, Pg 12]",
        },
        {
          title: "Different Materiality Thresholds",
          detail: "The two regimes define trigger points differently, which can create false positives or delayed filing decisions.",
          citation: "[Doc 4, Pg 18]",
        },
        {
          title: "Evidence Pack Divergence",
          detail: "Teams may need split retention and attestation workflows to satisfy both regulators at audit time.",
          citation: "[Doc 2, Pg 19]",
        },
      ],
      analysis: {
        feedbackCount: 2,
        excerptCards: [
          {
            docId: "esma-mifid",
            title: "ESMA_Consultation_Paper_MiFID_II.pdf",
            page: "Page 12",
            excerpt:
              "...enhanced pre-trade transparency and tighter data retention windows for transaction reporting across investment firms...",
          },
          {
            docId: "fca-q4",
            title: "FCA_Market_Update_Q4.pdf",
            page: "Page 18",
            excerpt:
              "...firms should maintain evidence packs that support rapid supervisory review and immediate escalation when anomalies are detected...",
          },
        ],
        citations: [
          { docId: "esma-mifid", label: "ESMA_Consultation_Paper_MiFID_II.pdf", page: "Page 12" },
          { docId: "esma-mifid", label: "ESMA_Consultation_Paper_MiFID_II.pdf", page: "Page 19" },
          { docId: "fca-q4", label: "FCA_Market_Update_Q4.pdf", page: "Page 18" },
        ],
        reasoningSteps: [
          "Compared passages tagged for disclosure deadlines and surveillance escalation.",
          "Normalized obligations into operating-policy themes across both documents.",
          "Flagged areas that would require jurisdiction-specific controls in production.",
        ],
      },
    };
  }

  if (lowerQuery.includes("capital") || lowerQuery.includes("basel") || lowerQuery.includes("liquidity")) {
    return {
      primaryDocId: "basel-iv",
      text: "The Basel IV framework points to a capital planning impact concentrated around output floor pressure and operational risk treatment.",
      bullets: [
        {
          title: "Output Floor Increase",
          detail: "Internal models have less room to reduce risk-weighted assets, pushing capital minimums upward.",
          citation: "[Doc 3, Pg 41]",
        },
        {
          title: "Portfolio Repricing Pressure",
          detail: "Higher capital intensity can force repricing for lower-margin products and structured books.",
          citation: "[Doc 3, Pg 63]",
        },
        {
          title: "Buffer Management Risk",
          detail: "Treasury and finance teams may need earlier capital allocation decisions before quarter close.",
          citation: "[Doc 3, Pg 41]",
        },
      ],
      analysis: {
        feedbackCount: 1,
        excerptCards: [
          {
            docId: "basel-iv",
            title: "Basel_IV_Framework.pdf",
            page: "Page 41",
            excerpt:
              "...the revised output floor constrains the extent to which internal models can reduce risk-weighted assets, increasing minimum capital requirements...",
          },
        ],
        citations: [
          { docId: "basel-iv", label: "Basel_IV_Framework.pdf", page: "Page 41" },
          { docId: "basel-iv", label: "Basel_IV_Framework.pdf", page: "Page 63" },
        ],
        reasoningSteps: [
          "Identified Basel IV sections tied to capital adequacy and model constraints.",
          "Mapped those passages to treasury and product pricing impacts.",
          "Prioritized the clauses with near-term operational consequences.",
        ],
      },
    };
  }

  if (
    lowerQuery.includes("cyber") ||
    lowerQuery.includes("compliance") ||
    lowerQuery.includes("filing") ||
    lowerQuery.includes("10-k")
  ) {
    return {
      primaryDocId: "sec-10k",
      text: "The filing concentrates risk in cybersecurity, disclosure governance, and regulatory enforcement exposure.",
      bullets: [
        {
          title: "Cybersecurity Vulnerabilities",
          detail: "The filing describes data breach and operational resilience concerns with direct compliance impact.",
          citation: "[Doc 1, Pg 5]",
        },
        {
          title: "Climate Disclosure Exposure",
          detail: "Environmental reporting obligations create expanded governance and attestation requirements.",
          citation: "[Doc 1, Pg 12]",
        },
        {
          title: "Enforcement Sensitivity",
          detail: "The company flags growing scrutiny around market conduct and consumer protection controls.",
          citation: "[Doc 1, Pg 28]",
        },
      ],
      analysis: {
        feedbackCount: 1,
        excerptCards: [
          {
            docId: "sec-10k",
            title: "SEC_Form_10K_2023.pdf",
            page: "Page 5",
            excerpt:
              "...significant risk related to cybersecurity incidents, which could lead to data breaches, financial loss, and reputational damage...",
          },
        ],
        citations: [
          { docId: "sec-10k", label: "SEC_Form_10K_2023.pdf", page: "Page 5" },
          { docId: "sec-10k", label: "SEC_Form_10K_2023.pdf", page: "Page 12" },
          { docId: "sec-10k", label: "SEC_Form_10K_2023.pdf", page: "Page 28" },
        ],
        reasoningSteps: [
          "Parsed risk factor sections and extracted compliance-heavy passages.",
          "Ranked exposure types by likely downstream regulatory burden.",
          "Returned the clauses with the clearest operational and enforcement implications.",
        ],
      },
    };
  }

  return {
    primaryDocId: "sec-10k",
    text: "I synthesized the loaded regulatory corpus and focused on the passages most likely to affect compliance operations, documentation, and supervisory response.",
    bullets: [
      {
        title: "Cross-Document Risk Clusters",
        detail: "The corpus points to concentrated pressure in reporting, governance evidence, and supervisory escalation workflows.",
        citation: "[Doc 1, Pg 12]",
      },
      {
        title: "Operational Hotspots",
        detail: "The most exposed teams are compliance operations, treasury, and market surveillance analysts.",
        citation: "[Doc 4, Pg 5]",
      },
      {
        title: "Recommended Next Step",
        detail: "Create jurisdiction-specific controls and a reusable evidence pack before the next reporting cycle.",
        citation: "[Doc 2, Pg 19]",
      },
    ],
    analysis: {
      feedbackCount: 3,
      excerptCards: [
        {
          docId: "sec-10k",
          title: "SEC_Form_10K_2023.pdf",
          page: "Page 12",
          excerpt:
            "...new disclosure expectations require enhanced board oversight, control testing, and documentation of climate-related risks...",
        },
        {
          docId: "fca-q4",
          title: "FCA_Market_Update_Q4.pdf",
          page: "Page 5",
          excerpt:
            "...firms should accelerate suspicious transaction reporting and maintain more frequent evidence packs...",
        },
      ],
      citations: [
        { docId: "sec-10k", label: "SEC_Form_10K_2023.pdf", page: "Page 12" },
        { docId: "esma-mifid", label: "ESMA_Consultation_Paper_MiFID_II.pdf", page: "Page 19" },
        { docId: "fca-q4", label: "FCA_Market_Update_Q4.pdf", page: "Page 5" },
      ],
      reasoningSteps: [
        "Searched across all indexed documents for recurring compliance themes.",
        "Grouped passages into reporting, governance, and escalation categories.",
        "Prioritized the excerpts with direct operating model impact.",
      ],
    },
  };
}

function getStatusMeta(status: DocumentStatus) {
  if (status === "Ready") {
    return { dotClass: "bg-emerald-500", textClass: "text-emerald-700", label: "Ready" };
  }

  if (status === "Indexing") {
    return { dotClass: "bg-sky-500", textClass: "text-sky-700", label: "Indexing..." };
  }

  return { dotClass: "bg-amber-500", textClass: "text-amber-700", label: "Processing..." };
}

function createPreloadDocument(document: DemoDocument): DemoDocument {
  if (document.id === "esma-mifid") {
    return { ...document, status: "Indexing", progress: 12 };
  }

  if (document.id === "fca-q4") {
    return { ...document, status: "Processing", progress: 8 };
  }

  if (document.id === "basel-iv") {
    return { ...document, status: "Processing", progress: 32 };
  }

  return { ...document, status: "Processing", progress: 28 };
}

function advanceDocument(document: DemoDocument): DemoDocument {
  if (document.status === "Ready") {
    return document;
  }

  if (document.status === "Processing") {
    const nextProgress = Math.min(document.progress + 18, 76);

    if (nextProgress >= 76) {
      return {
        ...document,
        status: "Indexing",
        progress: document.id === "sec-10k" ? 82 : nextProgress,
      };
    }

    return { ...document, progress: nextProgress };
  }

  const nextProgress = Math.min(document.progress + 12, 100);

  if (nextProgress >= 100) {
    return { ...document, status: "Ready", progress: 100 };
  }

  return { ...document, progress: nextProgress };
}

function FinSearchWorkspace({ data }: { data: MockFinSearchData }) {
  const [documents, setDocuments] = useState<DemoDocument[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisContext | null>(null);
  const [activeTab, setActiveTab] = useState<DemoTab>(data.activeTab);
  const [activeMessageId, setActiveMessageId] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [reviewState, setReviewState] = useState<ReviewState>("idle");
  const [reviewFeed, setReviewFeed] = useState<string[]>([
    "Regulatory packet ready for review.",
    "Click Review Packet to load filings, reports, and indexing updates.",
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageCounterRef = useRef(10);
  const reviewTimeoutsRef = useRef<number[]>([]);
  const reviewIntervalRef = useRef<number | null>(null);

  const clearReviewTimers = useCallback(() => {
    reviewTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    reviewTimeoutsRef.current = [];

    if (reviewIntervalRef.current !== null) {
      window.clearInterval(reviewIntervalRef.current);
      reviewIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearReviewTimers();
    };
  }, [clearReviewTimers]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    messageCounterRef.current = data.messages.length + 10;
  }, [data.messages.length]);

  const beginReviewFlow = useCallback(() => {
    if (reviewState !== "idle") return;

    clearReviewTimers();
    setActiveTab("documents");
    setDocuments([]);
    setSelectedDocumentId("");
    setReviewState("loading");
    setReviewFeed([
      "Initializing regulatory packet...",
      "Loading source files into the workspace...",
    ]);

    data.documents.forEach((document, index) => {
      const timeoutId = window.setTimeout(() => {
        setDocuments((currentDocuments) => {
          if (currentDocuments.some((currentDocument) => currentDocument.id === document.id)) {
            return currentDocuments;
          }

          return [...currentDocuments, createPreloadDocument(document)];
        });

        setReviewFeed((currentFeed) => {
          const nextEntry =
            index === 0
              ? `Imported ${document.name} and started preprocessing.`
              : `Queued ${document.name} for vector indexing.`;
          return [...currentFeed.slice(-3), nextEntry];
        });

        if (index === 0) {
          setSelectedDocumentId(document.id);
        }
      }, index * 380);

      reviewTimeoutsRef.current.push(timeoutId);
    });

    const intervalId = window.setInterval(() => {
      setDocuments((currentDocuments) => {
        const nextDocuments = currentDocuments.map((document) => {
          const nextDocument = advanceDocument(document);

          if (
            nextDocument.status !== document.status ||
            Math.floor(nextDocument.progress / 10) !== Math.floor(document.progress / 10)
          ) {
            setReviewFeed((currentFeed) => {
              const verb =
                nextDocument.status === "Ready"
                  ? "is ready for review."
                  : nextDocument.status === "Indexing"
                    ? "is indexing passages..."
                    : "is preprocessing pages...";

              return [...currentFeed.slice(-3), `${document.name} ${verb}`];
            });
          }

          return nextDocument;
        });

        if (
          nextDocuments.length === data.documents.length &&
          nextDocuments.every((document) => document.status === "Ready")
        ) {
          clearReviewTimers();
          setReviewState("ready");
          setReviewFeed((currentFeed) => {
            if (currentFeed[currentFeed.length - 1] === "All documents indexed and available for analysis.") {
              return currentFeed;
            }

            return [...currentFeed.slice(-3), "All documents indexed and available for analysis."];
          });
        }

        return nextDocuments;
      });
    }, 650);

    reviewIntervalRef.current = intervalId;
  }, [clearReviewTimers, data.documents, reviewState]);

  const handleSelectDocument = useCallback((document: DemoDocument) => {
    setSelectedDocumentId(document.id);
    setAnalysis(buildDocumentAnalysis(document));
    setActiveTab("documents");
  }, []);

  const handleActivateMessage = useCallback((message: ChatMessage) => {
    if (!message.analysis) return;

    setActiveMessageId(message.id);
    setAnalysis(message.analysis);
    setActiveTab("analysis");
  }, []);

  const handlePromptSubmit = useCallback(
    (prompt: string) => {
      const trimmedPrompt = prompt.trim();
      if (!trimmedPrompt) return;

      if (reviewState === "idle") {
        beginReviewFlow();
      }

      const scenario = getScenarioResponse(trimmedPrompt);
      const userMessage: ChatMessage = {
        id: `msg-user-${messageCounterRef.current++}`,
        role: "user",
        text: trimmedPrompt,
      };
      const assistantMessage: ChatMessage = {
        id: `msg-assistant-${messageCounterRef.current++}`,
        role: "assistant",
        text: scenario.text,
        bullets: scenario.bullets,
        analysis: scenario.analysis,
      };

      setMessages((currentMessages) => [...currentMessages, userMessage, assistantMessage]);
      setActiveMessageId(assistantMessage.id);
      setAnalysis(scenario.analysis);
      setSelectedDocumentId(scenario.primaryDocId);
      setActiveTab("analysis");
      setInputValue("");
    },
    [beginReviewFlow, reviewState]
  );

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const searchTarget = `${document.name} ${document.category}`.toLowerCase();
      return searchTarget.includes(searchQuery.toLowerCase());
    });
  }, [documents, searchQuery]);

  const selectedDocument =
    documents.find((document) => document.id === selectedDocumentId) ?? documents[0] ?? null;
  const preloadPercent = documents.length === 0
    ? 0
    : Math.round(documents.reduce((total, document) => total + document.progress, 0) / (data?.documents.length ?? documents.length) / 1);

  const preloadSummary = data.documents.map((document) => document.name.replace(".pdf", ""));

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(229,238,247,0.96)_44%,_rgba(214,229,244,0.92)_100%)] p-4 text-slate-900 md:p-6">
      <div className="mx-auto overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 shadow-[0_30px_80px_rgba(100,118,145,0.2)] backdrop-blur-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200/80 bg-white/90 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-[linear-gradient(145deg,#ffffff,#edf5ff)] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_14px_30px_rgba(59,130,246,0.12)]">
              <LogoGlyph />
            </div>
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.24em] text-sky-600">Regulatory AI Workspace</div>
              <div className="text-3xl font-semibold tracking-tight text-slate-900">
                FinSearch<span className="text-sky-500">AI</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "border-sky-200 bg-sky-50 text-sky-700 shadow-[inset_0_-2px_0_0_rgba(14,165,233,0.45)]"
                      : "border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className={isActive ? "text-sky-600" : "text-slate-500"}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}

            <div className="ml-2 flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                <UserGlyph />
              </div>
              <ChevronDownGlyph className="h-4 w-4 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 bg-transparent p-4 xl:grid-cols-[320px,minmax(0,1fr),296px]">
          <section className={`rounded-2xl border border-slate-200 bg-white/80 shadow-[0_15px_40px_rgba(148,163,184,0.12)] ${activeTab === "analysis" ? "xl:opacity-85" : ""}`}>
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-[1.35rem] font-semibold tracking-tight text-slate-900">
                Document Upload &amp; Management Panel
              </h2>
            </div>

            <div className="space-y-5 p-5">
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-[linear-gradient(180deg,rgba(247,250,253,0.98),rgba(241,246,251,0.9))] px-5 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_14px_30px_rgba(148,163,184,0.16)]">
                  <UploadGlyph />
                </div>
                <p className="text-[1.08rem] font-semibold text-slate-900">Regulatory Review Packet</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Drag new PDFs here or start with the packet below. The review flow will populate the library
                  and process each source through preprocessing, indexing, and retrieval readiness.
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {preloadSummary.map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
                    >
                      {label}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-col items-center gap-3">
                  <button
                    onClick={beginReviewFlow}
                    disabled={reviewState !== "idle"}
                    className="rounded-2xl bg-[linear-gradient(135deg,#2563eb,#4f8ff0)] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(59,130,246,0.25)] transition-transform hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-60"
                  >
                    {reviewState === "idle" ? "Review Packet" : reviewState === "loading" ? "Review In Progress" : "Packet Ready"}
                  </button>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    {reviewState === "idle"
                      ? "4 documents ready for review"
                      : reviewState === "loading"
                        ? "Live ingestion is running"
                        : "All sources are analysis-ready"}
                  </p>
                </div>

                {reviewState !== "idle" && (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white/80 p-4 text-left shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">Pipeline Status</span>
                      <span className="text-sm font-medium text-slate-500">{preloadPercent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <motion.div
                        animate={{ width: `${preloadPercent}%` }}
                        className="h-full rounded-full bg-[linear-gradient(90deg,#38bdf8,#2563eb)]"
                      />
                    </div>
                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      {reviewFeed.map((entry) => (
                        <div key={entry} className="flex items-start gap-2">
                          <span className="mt-1.5 h-2 w-2 rounded-full bg-sky-500" />
                          <span>{entry}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Document Library</h3>
                  <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {filteredDocuments.length} docs
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <SearchGlyph className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        disabled={documents.length === 0}
                        placeholder="Search Documents"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                      />
                    </div>
                    <button
                      disabled={documents.length === 0}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
                    >
                      <FilterGlyph />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["Date", "Type", "Status"].map((filter) => (
                      <button
                        key={filter}
                        disabled={documents.length === 0}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
                      >
                        {filter}
                        <ChevronDownGlyph className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>

                  {documents.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,249,252,0.94))] p-5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                          <DocumentGlyph className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-[1.02rem] font-semibold text-slate-900">Click Review Packet to populate the library</div>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            FinSearchAI will run document ingestion, status updates, and indexing progress before the
                            sources become selectable.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredDocuments.map((document) => {
                        const statusMeta = getStatusMeta(document.status);
                        const isSelected = document.id === selectedDocument?.id;

                        return (
                          <button
                            key={document.id}
                            onClick={() => handleSelectDocument(document)}
                            className={`w-full rounded-2xl border p-4 text-left shadow-[0_12px_30px_rgba(148,163,184,0.08)] transition-all ${
                              isSelected
                                ? "border-sky-200 bg-sky-50/80"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${document.accentClass}`}>
                                <DocumentGlyph className="h-5 w-5" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="truncate text-[1.04rem] font-semibold text-slate-900">{document.name}</div>
                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                      <span>{document.size}</span>
                                      <span>&bull;</span>
                                      <span>{document.pageCount} pages</span>
                                      <span>&bull;</span>
                                      <span>{document.category}</span>
                                    </div>
                                  </div>
                                  <KebabGlyph className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                                </div>

                                <div className={`mt-2 flex items-center gap-2 text-sm font-medium ${statusMeta.textClass}`}>
                                  <span className={`h-2.5 w-2.5 rounded-full ${statusMeta.dotClass}`} />
                                  {statusMeta.label}
                                </div>

                                {document.progress < 100 && (
                                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                                    <motion.div
                                      animate={{ width: `${document.progress}%` }}
                                      className={`h-full rounded-full ${document.status === "Indexing" ? "bg-sky-500" : "bg-amber-500"}`}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white/85 shadow-[0_15px_40px_rgba(148,163,184,0.12)]">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                  <SparkGlyph />
                </div>
                <div>
                  <h2 className="text-[1.35rem] font-semibold tracking-tight text-slate-900">Regulatory Analysis Assistant</h2>
                  <p className="text-sm text-slate-500">
                    Conversational RAG workflow for financial filings, consultations, and regulatory updates.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex min-h-[720px] flex-col bg-[linear-gradient(180deg,rgba(249,251,255,0.75),rgba(244,247,252,0.9))]">
              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
                {messages.length === 0 ? (
                  <div className="rounded-[22px] border border-dashed border-slate-200 bg-white/70 px-5 py-6 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                      <SparkGlyph className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-[1.02rem] font-semibold text-slate-900">Analysis assistant is standing by</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Run the review packet to load source material, then ask a question to generate cited analysis.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isAssistant = message.role === "assistant";
                    const isActive = isAssistant && activeMessageId === message.id;

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                      >
                        <div className={`max-w-[86%] ${isAssistant ? "w-full" : ""}`}>
                          {!isAssistant ? (
                            <button
                              onClick={() => setInputValue(message.text)}
                              className="ml-auto block rounded-[18px] bg-[linear-gradient(135deg,#4f93e6,#2f6fdd)] px-5 py-4 text-left text-[1.02rem] font-medium text-white shadow-[0_20px_45px_rgba(59,130,246,0.28)] transition-transform hover:-translate-y-0.5"
                            >
                              {message.text}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateMessage(message)}
                              className={`flex w-full gap-3 rounded-[22px] border px-4 py-4 text-left transition-all ${
                                isActive
                                  ? "border-sky-200 bg-white shadow-[0_18px_40px_rgba(125,151,182,0.18)] ring-2 ring-sky-100"
                                  : "border-slate-200 bg-white/85 shadow-[0_14px_32px_rgba(148,163,184,0.1)] hover:border-slate-300"
                              }`}
                            >
                              <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                                <SparkGlyph />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[1.02rem] leading-8 text-slate-800">{message.text}</p>

                                {message.bullets && (
                                  <ol className="mt-3 space-y-3 text-[1.01rem] leading-7 text-slate-800">
                                    {message.bullets.map((bullet, index) => (
                                      <li key={`${message.id}-${index}`} className="flex gap-3">
                                        <span className="pt-0.5 font-semibold text-slate-500">{index + 1}.</span>
                                        <div>
                                          <span className="font-semibold text-slate-900">{bullet.title}</span>{" "}
                                          <span className="text-slate-700">{bullet.detail}</span>{" "}
                                          <span className="font-medium text-sky-700">{bullet.citation}</span>
                                        </div>
                                      </li>
                                    ))}
                                  </ol>
                                )}
                              </div>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}

                <div className="flex flex-wrap gap-2">
                  {DEFAULT_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setInputValue(prompt)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <div ref={chatEndRef} />
              </div>

              <div className="border-t border-slate-200 bg-white/80 px-4 py-4">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_12px_30px_rgba(148,163,184,0.12)]">
                  <input
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handlePromptSubmit(inputValue);
                      }
                    }}
                    placeholder="Ask FinSearchAI a regulatory question..."
                    className="min-w-0 flex-1 bg-transparent text-[1.02rem] text-slate-700 outline-none placeholder:text-slate-400"
                  />
                  <button
                    onClick={() => handlePromptSubmit(inputValue)}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3b82f6,#6787db)] text-white shadow-[0_16px_35px_rgba(59,130,246,0.3)] transition-transform hover:-translate-y-0.5"
                  >
                    <SendGlyph />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-2xl border border-slate-200 bg-white/85 shadow-[0_15px_40px_rgba(148,163,184,0.12)]">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-[1.35rem] font-semibold tracking-tight text-slate-900">Analysis &amp; Context</h2>
              <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50">
                <FeedbackGlyph />
                Feedback
              </button>
            </div>

            <div className="space-y-6 p-5">
              {analysis ? (
                <>
                  <div>
                    <h3 className="mb-3 text-lg font-semibold tracking-tight text-slate-900">Retrieved Document Excerpts</h3>
                    <div className="space-y-3">
                      {analysis.excerptCards.map((card) => (
                        <div key={`${card.docId}-${card.page}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="text-[1.02rem] font-semibold text-slate-900">{card.title}</div>
                          <div className="mt-1 text-sm text-slate-500">{card.page}</div>
                          <p className="mt-3 text-[0.98rem] leading-7 text-slate-700">{card.excerpt}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold tracking-tight text-slate-900">Source Citations</h3>
                    <div className="space-y-3">
                      {analysis.citations.map((citation, index) => {
                        const sourceDocument = documents.find((document) => document.id === citation.docId);

                        return (
                          <div
                            key={`${citation.docId}-${citation.page}-${index}`}
                            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm shadow-sm"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${sourceDocument?.accentClass ?? "bg-slate-100 text-slate-500"}`}>
                                <DocumentGlyph className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="truncate font-medium text-slate-800">{citation.label}</div>
                                <div className="text-slate-500">{sourceDocument?.category ?? "Regulatory Source"}</div>
                              </div>
                            </div>
                            <span className="shrink-0 text-sm font-medium text-slate-500">{citation.page}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,249,252,0.92))] p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-semibold tracking-tight text-slate-900">Model Reasoning Steps</h3>
                      <ChevronDownGlyph className="h-4 w-4 text-slate-400" />
                    </div>
                    <ol className="space-y-2 text-[0.98rem] leading-7 text-slate-700">
                      {analysis.reasoningSteps.map((step, index) => (
                        <li key={`${step}-${index}`} className="flex gap-3">
                          <span className="font-semibold text-slate-500">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,249,252,0.92))] p-5 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <DocumentGlyph className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">No analysis yet</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Review the packet and submit a question to see excerpts, citations, and reasoning steps here.
                  </p>
                </div>
              )}

              <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[1.02rem] font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
                <DownloadGlyph />
                Download Report
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function FinSearchAIDemo() {
  const fetchDemoData = useCallback(async () => {
    return getMockData<MockFinSearchData>({
      id: "finsearchai-demo",
      delayMs: 900,
      mockResponse: getInitialData(),
    });
  }, []);

  return (
    <DemoShell title="FinSearch AI" fetchData={fetchDemoData}>
      {(data) => (data ? <FinSearchWorkspace key={data.sessionId} data={data} /> : null)}
    </DemoShell>
  );
}
