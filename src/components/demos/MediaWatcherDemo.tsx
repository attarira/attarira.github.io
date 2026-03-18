"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import DemoShell from "./DemoShell";
import { getMockData } from "@/lib/mockAPI";

// --- Mock Data Types ---
type Company = {
  id: string;
  name: string;
  ticker: string;
  logoUrl?: string;
  logoColor: string;
  initials: string;
};

type Insight = {
  keyRiskDrivers: string[];
  entities: {
    people: string[];
    organizations: string[];
    locations: string[];
  };
  timeline: { date: string; title: string; color: string }[];
  reasoning: string;
  citations: string[];
};

type NewsArticle = {
  id: string;
  title: string;
  date: string;
  source: string;
  sourceLogoUrl?: string;
  sourceInitials: string;
  summary: string;
  badges: {
    sentiment: "Negative" | "Positive" | "Neutral";
    category: string;
    eventType: string;
    region: string;
    impactLevel: "High" | "Medium" | "Low";
  };
};

type MockMediaWatcherData = {
  company: Company;
  overallRiskScore: number;
  sentimentScore: number; // out of 10
  impactLevel: "Severe" | "Moderate" | "Minor";
  metadata: {
    region: string;
    industry: string;
    eventTypes: string;
  };
  newsFeed: NewsArticle[];
  insights: Insight;
  companiesList: Company[];
};

// --- Initial Data ---
function getInitialData(): MockMediaWatcherData {
  return {
    company: { id: "tesla", name: "Tesla Inc.", ticker: "TSLA", logoUrl: "https://icons.duckduckgo.com/ip3/tesla.com.ico", logoColor: "bg-red-500", initials: "T" },
    overallRiskScore: 72,
    sentimentScore: 3.5,
    impactLevel: "Severe",
    metadata: {
      region: "North America",
      industry: "Automotive",
      eventTypes: "Regulatory Inquiry, Product Recall",
    },
    companiesList: [
      { id: "tesla", name: "Tesla Inc.", ticker: "TSLA", logoUrl: "https://icons.duckduckgo.com/ip3/tesla.com.ico", logoColor: "bg-red-500", initials: "T" },
      { id: "msft", name: "Microsoft Corp.", ticker: "MSFT", logoUrl: "https://icons.duckduckgo.com/ip3/microsoft.com.ico", logoColor: "bg-blue-400", initials: "M" },
      { id: "googl", name: "Google", ticker: "GOOGL", logoUrl: "https://icons.duckduckgo.com/ip3/google.com.ico", logoColor: "bg-orange-500", initials: "G" },
    ],
    newsFeed: [
      {
        id: "news-1",
        title: "Tesla Faces New SEC Probe Over Autopilot Claims",
        date: "Oct 26, 2023, 10:15 AM",
        source: "Bloomberg",
        sourceLogoUrl: "https://icons.duckduckgo.com/ip3/bloomberg.com.ico",
        sourceInitials: "B",
        summary:
          "The SEC has launched an investigation into Tesla's Autopilot system, focusing on misleading statements regarding its full self-driving capabilities. This could lead to significant regulatory penalties and reputational damage.",
        badges: {
          sentiment: "Negative",
          category: "Regulatory",
          eventType: "Inquiry",
          region: "North America",
          impactLevel: "High",
        },
      },
      {
        id: "news-2",
        title: "NHTSA Expands Probe into Tesla Suspension Issues",
        date: "Oct 25, 2023, 2:30 PM",
        source: "Reuters",
        sourceLogoUrl: "https://icons.duckduckgo.com/ip3/reuters.com.ico",
        sourceInitials: "R",
        summary:
          "Safety regulators have expanded their review of potential suspension failures in Tesla Model S and Model X vehicles following numerous owner complaints.",
        badges: {
          sentiment: "Negative",
          category: "Product",
          eventType: "Investigation",
          region: "North America",
          impactLevel: "High",
        },
      },
    ],
    insights: {
      keyRiskDrivers: [
        "Increased Regulatory Scrutiny",
        "Potential Product Liability Claims",
        "Negative Media Coverage",
      ],
      entities: {
        people: ["Elon Musk"],
        organizations: ["SEC", "NHTSA"],
        locations: ["United States"],
      },
      timeline: [
        { date: "Sept 15", title: "Initial Report", color: "bg-gray-400" },
        { date: "Oct 28", title: "Multiple States", color: "bg-gray-400" },
        { date: "Oct 26", title: "SEC Probe Announced", color: "bg-red-500" },
      ],
      reasoning:
        "The AI model identified strong negative sentiment due to the severity of the SEC investigation and high-impact language in key news sources.",
      citations: ["Bloomberg", "Financial Times"],
    },
  };
}

const SemiCircleGauge = ({ value, max, label, type = "risk" }: { value: number, max: number, label: string, type?: "risk" | "sentiment" }) => {
  const rotation = (value / max) * 180 - 90;
  const sweepDeg = (value / max) * 180;
  
  return (
    <div className="relative flex flex-col items-center justify-center pt-4">
      <div className="relative w-40 h-20 overflow-hidden">
        {/* Track */}
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[16px] border-slate-200" />
        
        {/* Colorful Fill with Sweep Mask */}
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full"
             style={{
               maskImage: `conic-gradient(from 270deg, black 0deg, black ${sweepDeg}deg, transparent ${sweepDeg}deg)`,
               WebkitMaskImage: `conic-gradient(from 270deg, black 0deg, black ${sweepDeg}deg, transparent ${sweepDeg}deg)`
             }}
        >
          {type === "risk" ? (
            <div className="w-full h-full rounded-full" 
                 style={{ 
                   background: "conic-gradient(from 270deg, #22c55e 0deg, #eab308 90deg, #ef4444 180deg, transparent 180deg)",
                   WebkitMaskImage: "radial-gradient(circle, transparent 60px, black 61px)",
                   maskImage: "radial-gradient(circle, transparent 60px, black 61px)"
                 }} 
            />
          ) : (
            <div className="w-full h-full rounded-full" 
                 style={{ 
                   background: "conic-gradient(from 270deg, #ef4444 0deg, #94a3b8 90deg, #22c55e 180deg, transparent 180deg)",
                   WebkitMaskImage: "radial-gradient(circle, transparent 60px, black 61px)",
                   maskImage: "radial-gradient(circle, transparent 60px, black 61px)"
                 }} 
            />
          )}
        </div>
        
        {/* Inner shadow over track */}
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[16px] border-black/5 mix-blend-multiply" />
        
        {/* Needle */}
        <motion.div 
          className="absolute top-[80px] left-[80px] origin-[center_top] z-10"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.5 }}
        >
          <div className="w-1.5 h-16 bg-slate-800 rounded-full absolute bottom-0 -left-[3px] shadow-sm flex items-end">
             <div className="w-1.5 h-6 bg-red-500 rounded-t-full" />
          </div>
          <div className="w-4 h-4 bg-slate-800 rounded-full absolute -left-2 -bottom-2 shadow-md border-2 border-white" />
        </motion.div>
      </div>
      
      <div className="flex flex-col items-center -mt-1 relative z-20">
        <span className="text-3xl font-bold text-slate-800 tracking-tight leading-none">{value}</span>
        <span className="text-[11px] font-semibold text-red-600 mt-1 uppercase tracking-wide">{label}</span>
      </div>
    </div>
  );
};

export default function MediaWatcherDemo() {
  const [dashData, setDashData] = useState<MockMediaWatcherData | null>(null);

  const fetchDemoData = useCallback(async () => {
    return getMockData<MockMediaWatcherData>({
      id: "media-watcher",
      mockResponse: getInitialData(),
      delayMs: 800,
    });
  }, []);

  return (
    <DemoShell title="Media Watcher" fetchData={fetchDemoData}>
      {(data) => {
        if (!dashData && data) setDashData(data);
        if (!dashData) return null;
        
        return (
          <div className="bg-[#F8FAFC] text-slate-800 flex flex-col font-sans" style={{ minHeight: "calc(100vh - 200px)" }}>
            {/* Top Navigation */}
            <div className="bg-[#0f172a] text-white flex items-center justify-between px-6 py-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-bold text-xl tracking-tight">Media <span className="text-white">Watcher</span></span>
              </div>
              
              <div className="flex items-center gap-1 text-sm font-medium">
                <button className="px-4 py-2 rounded-md bg-white/10 text-white flex items-center gap-2 transition-colors">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-blue-400"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                  Dashboard
                </button>
                <button className="px-4 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                  Companies
                </button>
                <button className="px-4 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                  Reports
                </button>
                <button className="px-4 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                  Alerts
                </button>
                <button className="px-4 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Settings
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-sm shadow-inner">
                  JS
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-tight">John Smith</span>
                  <span className="text-[10px] text-white/50 leading-tight">Risk Analyst</span>
                </div>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Left Sidebar */}
              <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto hidden md:flex">
                <div className="p-4 border-b border-slate-100">
                  <div className="relative">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                    <input type="text" placeholder="Search Companies..." className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400" />
                  </div>
                </div>

                <div className="p-4 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Recent Companies</h4>
                  <div className="space-y-1">
                    {dashData.companiesList.map(comp => (
                      <div key={comp.id} 
                           onClick={() => setDashData({ 
                              ...dashData, 
                              company: comp,
                              overallRiskScore: Math.floor(Math.random() * 40) + 40,
                              sentimentScore: Number((Math.random() * 3 + 4).toFixed(1)),
                              impactLevel: Math.random() > 0.6 ? "Severe" : "Moderate"
                           })}
                           className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${comp.id === dashData.company.id ? 'bg-slate-100/50 ring-1 ring-slate-200' : 'hover:bg-slate-50'}`}>
                        {comp.logoUrl ? (
                          <div className={`w-7 h-7 rounded bg-white flex items-center justify-center p-1 overflow-hidden shrink-0 border ${comp.id === dashData.company.id ? 'border-slate-300 shadow-sm' : 'border-slate-200 shadow-sm'}`}>
                            <img src={comp.logoUrl} alt={comp.name} className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 text-white ${comp.logoColor}`}>
                            {comp.initials}
                          </div>
                        )}
                        <span className={`text-[13px] ${comp.id === dashData.company.id ? 'text-slate-900 font-semibold' : 'text-slate-600 font-medium'}`}>{comp.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 flex-1 space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filters</h4>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Date Range</label>
                    <select className="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>Custom Range</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Sentiment</label>
                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" /> Positive</label>
                      <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" /> Neutral</label>
                      <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" defaultChecked /> Negative</label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Risk Category</label>
                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" defaultChecked /> Regulatory</label>
                      <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" /> Financial</label>
                      <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" /> Reputational</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Feed Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
                {/* Company Analysis Panel */}
                <h2 className="text-lg font-bold text-slate-800 mb-3 tracking-tight">Company Analysis Panel</h2>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
                  <div className="flex items-center gap-3 mb-6">
                    {dashData.company.logoUrl ? (
                      <div className="w-9 h-9 rounded bg-white border border-slate-200 flex items-center justify-center p-1.5 shadow-sm overflow-hidden shrink-0">
                        <img src={dashData.company.logoUrl} alt={dashData.company.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
                      </div>
                    )}
                    <span className="text-xl font-bold text-slate-900">{dashData.company.name} ({dashData.company.ticker})</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                    <div className="flex flex-col items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 w-full justify-center relative">
                        Overall Risk Score
                        <svg className="w-4 h-4 text-slate-400 absolute right-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                      </div>
                      <SemiCircleGauge value={dashData.overallRiskScore} max={100} label="High Risk" type="risk" />
                    </div>
                    
                    <div className="flex flex-col items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 w-full justify-center">
                        Sentiment Gauge
                      </div>
                      <SemiCircleGauge value={dashData.sentimentScore} max={10} label="Negative" type="sentiment" />
                      <div className="mt-1 text-xs text-slate-500 font-medium">{dashData.sentimentScore} / 10</div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 relative min-h-[160px]">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 w-full justify-center absolute top-4">
                        Impact Level
                      </div>
                      <div className="flex flex-col items-center mt-6 gap-2 w-full">
                        <div className="relative">
                          {dashData.impactLevel === "Severe" && (
                            <div className="absolute -inset-1 rounded-full bg-red-400/20 blur-sm animate-pulse" />
                          )}
                          <div className={`bg-red-50/80 backdrop-blur-sm text-red-600 px-6 py-2 rounded-full font-bold flex items-center gap-2 border border-red-500/30 relative shadow-sm ring-1 ring-inset ring-white/50`}>
                            {dashData.impactLevel === "Severe" && (
                              <span className="relative flex h-2.5 w-2.5 mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                              </span>
                            )}
                            <span className="tracking-[0.15em] uppercase text-sm font-bold text-red-600 drop-shadow-sm">{dashData.impactLevel}</span>
                          </div>
                        </div>
                        {dashData.impactLevel === "Severe" && (
                          <span className="text-[10px] text-red-500/80 font-bold tracking-widest uppercase mt-0.5 animate-pulse">Critical Event</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 mt-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">Region: {dashData.metadata.region}</span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">Industry: {dashData.metadata.industry}</span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">Event Types: {dashData.metadata.eventTypes}</span>
                  </div>
                </div>

                {/* News Intelligence Feed */}
                <h2 className="text-lg font-bold text-slate-800 mb-3 tracking-tight">News Intelligence Feed</h2>
                <div className="space-y-4">
                  {dashData.newsFeed.map((news) => (
                    <motion.div key={news.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-slate-900 text-base">{news.title}</h3>
                        <button className="text-slate-400 hover:text-slate-600">
                           <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                        </button>
                      </div>
                      <div className="text-xs text-slate-500 font-medium mb-3">{news.date}</div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {news.sourceLogoUrl ? (
                          <div className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center border border-slate-200 p-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden shrink-0">
                            <img src={news.sourceLogoUrl} alt={news.source} className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-indigo-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                            {news.sourceInitials}
                          </div>
                        )}
                        <span className="text-sm font-bold text-slate-800">{news.source}</span>
                      </div>
                      
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                        <p className="text-sm text-slate-700 leading-relaxed">{news.summary}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-semibold">
                          <div className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center text-white text-[8px]">-</div> Sentiment {news.badges.sentiment}
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-100 rounded-full text-xs font-semibold">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                          Risk Category {news.badges.category}
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-xs font-semibold">
                          <div className="w-3 h-3 rounded-full bg-purple-500 flex items-center justify-center text-white text-[8px]">P</div>
                          Event Type {news.badges.eventType}
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-semibold">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                          Region {news.badges.region}
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-bold">
                          <div className="w-3 h-3 rounded-full bg-red-600 flex items-center justify-center text-white text-[8px]">!</div>
                          Impact Level {news.badges.impactLevel}
                        </span>
                      </div>
                      
                      <div className="bg-slate-50 border-t border-slate-100 -mx-5 -mb-5 px-5 py-3 rounded-b-xl flex items-center">
                         <a href="#" className="flex items-center gap-2 text-sm text-slate-600 font-semibold hover:text-blue-600 transition-colors">
                           <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                           View Source
                         </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Sidebar - Insights */}
              <div className="w-80 bg-white shadow-[-4px_0_15px_-5px_rgba(0,0,0,0.05)] border-l border-slate-200 shrink-0 overflow-y-auto z-10 hidden xl:block">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4 tracking-tight">AI Insights & Explainability</h3>
                  
                  <div className="mb-5">
                    <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Key Risk Drivers</h4>
                    <ol className="list-decimal pl-4 space-y-1 text-sm text-slate-700 font-medium">
                      {dashData.insights.keyRiskDrivers.map((driver, i) => (
                        <li key={i}>{driver}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="mb-5">
                    <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Detected Entities</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-semibold text-slate-800">People: </span><span className="text-slate-600">{dashData.insights.entities.people.join(", ")}</span></div>
                      <div><span className="font-semibold text-slate-800">Organizations: </span><span className="text-slate-600">{dashData.insights.entities.organizations.join(", ")}</span></div>
                      <div><span className="font-semibold text-slate-800">Locations: </span><span className="text-slate-600">{dashData.insights.entities.locations.join(", ")}</span></div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <h4 className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-[0.15em]">Timeline of Events</h4>
                    <div className="relative pl-3 space-y-5 py-2">
                       {/* Vertical line connecting timeline events */}
                       <div className="absolute top-3 bottom-4 left-[17px] w-px bg-slate-200 z-0"></div>
                       
                       {dashData.insights.timeline.map((item, i) => (
                         <div key={i} className="flex relative z-10 gap-4 group items-start">
                           <div className="flex-shrink-0 mt-0.5 relative z-10">
                             <div className={`w-2.5 h-2.5 rounded-full ${item.color === 'bg-red-500' ? 'bg-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.15)] ring-1 ring-red-500/30' : 'bg-slate-300 ring-4 ring-white'}`}></div>
                           </div>
                           <div className="flex flex-col -mt-1">
                             <span className={`text-[12px] font-semibold tracking-tight ${item.color === 'bg-red-500' ? 'text-red-600' : 'text-slate-800'}`}>{item.date}</span>
                             <span className="text-[11px] font-medium text-slate-500 mt-0.5">{item.title}</span>
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Model Reasoning & Evidence</h4>
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed mb-2">{dashData.insights.reasoning}</p>
                    <div className="text-xs">
                      <span className="font-semibold text-slate-500">Citations: </span>
                      <span className="text-blue-600 font-medium">{dashData.insights.citations.join(", ")}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 h-full">
                  <h3 className="font-bold text-slate-900 mb-4 tracking-tight">Reports & Export</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button className="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold py-2 px-3 rounded-md transition-colors text-center whitespace-nowrap shadow-sm">
                      Generate PDF Report
                    </button>
                    <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold py-2 px-3 rounded-md transition-colors text-center shadow-sm">
                      Export CSV
                    </button>
                    <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold py-2 px-3 rounded-md transition-colors text-center shadow-sm">
                      Share Link
                    </button>
                  </div>
                  
                  {/* Fake Report Preview Document */}
                  <div className="aspect-[1/1.414] w-[140px] bg-white border border-slate-200 rounded shadow-sm mx-auto p-3 flex flex-col gap-2 relative overflow-hidden transform rotate-2">
                     <div className="w-full flex items-center justify-between pb-1 border-b border-slate-100">
                       <span className="text-[6px] font-bold text-blue-600">Media Watcher</span>
                       <span className="text-[5px] text-slate-400">Risk Report: {dashData.company.name}</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-200 rounded-sm w-3/4"></div>
                     <div className="flex gap-1.5 mb-1">
                        <div className="flex-1 bg-slate-50 border border-slate-100 h-10 rounded text-center pt-1"><div className="w-4 h-4 rounded-full border-[1.5px] border-red-500 mx-auto"></div></div>
                        <div className="flex-1 bg-slate-50 border border-slate-100 h-10 rounded px-1 pt-1 flex items-end gap-0.5 justify-center pb-1">
                           <div className="w-1.5 bg-blue-300 h-[60%] rounded-t-sm"></div>
                           <div className="w-1.5 bg-orange-400 h-[80%] rounded-t-sm"></div>
                           <div className="w-1.5 bg-green-400 h-[40%] rounded-t-sm"></div>
                        </div>
                     </div>
                     <div className="w-full h-1 bg-slate-100 rounded-sm"></div>
                     <div className="w-full h-1 bg-slate-100 rounded-sm w-5/6"></div>
                     <div className="w-full h-1 bg-slate-100 rounded-sm w-4/6"></div>
                     
                     <div className="flex gap-1 mt-auto">
                        <div className="w-full bg-slate-50 border border-slate-100 h-6 rounded flex items-end justify-between px-2 pb-1 gap-1">
                          <div className="w-full h-1 bg-orange-400 rounded-sm mb-1"></div>
                          <div className="w-full h-1 bg-yellow-400 rounded-sm mb-1"></div>
                          <div className="w-full h-1 bg-green-400 rounded-sm mb-1"></div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </DemoShell>
  );
}
