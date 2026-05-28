"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import DemoShell from "./DemoShell";
import { getMockData } from "@/lib/mockAPI";

type Severity = "Low" | "Medium" | "High" | "Critical";
type QueueStatus = "Ready" | "Needs Review" | "Escalated";

type Region = {
  name: string;
  confidence: number;
  acreage: string;
};

type PlantSample = {
  id: string;
  fieldId: string;
  crop: string;
  variety: string;
  location: string;
  capturedAt: string;
  diagnosis: string;
  confidence: number;
  severity: Severity;
  status: QueueStatus;
  spreadRisk: number;
  treatmentWindow: string;
  treatment: string;
  agronomistNote: string;
  cues: string[];
  color: string;
  texture: string;
  mask: { x: number; y: number; size: number; opacity: number }[];
  regions: Region[];
};

type PlantDemoData = {
  model: {
    name: string;
    version: string;
    accuracy: string;
    classes: number;
    latencyMs: number;
    drift: string;
    lastValidated: string;
  };
  operations: {
    scansToday: number;
    flagged: number;
    avgConfidence: string;
    reviewQueue: number;
  };
  samples: PlantSample[];
};

const PLANT_DEMO_DATA: PlantDemoData = {
  model: {
    name: "LeafVision CNN Ensemble",
    version: "v2.8.1",
    accuracy: "96.4%",
    classes: 38,
    latencyMs: 84,
    drift: "0.7%",
    lastValidated: "May 2026",
  },
  operations: {
    scansToday: 1248,
    flagged: 126,
    avgConfidence: "93.1%",
    reviewQueue: 18,
  },
  samples: [
    {
      id: "tomato-early-blight",
      fieldId: "N-17",
      crop: "Tomato",
      variety: "Roma VF",
      location: "Block 4, North Field",
      capturedAt: "09:42 AM",
      diagnosis: "Early Blight",
      confidence: 94,
      severity: "High",
      status: "Escalated",
      spreadRisk: 82,
      treatmentWindow: "24-36 hours",
      treatment:
        "Remove infected lower leaves, improve airflow, pause overhead irrigation, and schedule copper-based fungicide if new lesions appear.",
      agronomistNote:
        "Pattern is concentrated in the canopy base, which matches humidity-driven early blight progression.",
      cues: ["Concentric brown lesions", "Yellow haloing", "Lower canopy concentration"],
      color: "from-emerald-600 via-lime-500 to-yellow-300",
      texture:
        "radial-gradient(circle at 35% 34%, rgba(120,53,15,.72) 0 6%, transparent 7%), radial-gradient(circle at 62% 54%, rgba(113,63,18,.68) 0 7%, transparent 8%), radial-gradient(circle at 45% 70%, rgba(146,64,14,.64) 0 5%, transparent 6%)",
      mask: [
        { x: 35, y: 34, size: 18, opacity: 0.82 },
        { x: 62, y: 54, size: 22, opacity: 0.76 },
        { x: 45, y: 70, size: 14, opacity: 0.7 },
      ],
      regions: [
        { name: "Early Blight", confidence: 94, acreage: "4.2 ac" },
        { name: "Septoria Leaf Spot", confidence: 31, acreage: "0.8 ac" },
        { name: "Healthy", confidence: 9, acreage: "0.3 ac" },
      ],
    },
    {
      id: "pepper-healthy",
      fieldId: "G-08",
      crop: "Bell Pepper",
      variety: "California Wonder",
      location: "Greenhouse 2",
      capturedAt: "10:18 AM",
      diagnosis: "Healthy",
      confidence: 98,
      severity: "Low",
      status: "Ready",
      spreadRisk: 8,
      treatmentWindow: "Routine monitoring",
      treatment:
        "No disease detected. Continue standard watering, nutrient schedule, and weekly scouting for pests or discoloration.",
      agronomistNote:
        "Image quality and vein definition are strong; no review is required unless symptoms appear in adjacent plants.",
      cues: ["Even leaf tone", "Clean margins", "No lesion clusters"],
      color: "from-green-700 via-emerald-500 to-lime-400",
      texture:
        "linear-gradient(115deg, transparent 0 46%, rgba(255,255,255,.25) 47% 49%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255,255,255,.18), transparent 18%)",
      mask: [
        { x: 50, y: 50, size: 12, opacity: 0.18 },
        { x: 68, y: 33, size: 14, opacity: 0.16 },
      ],
      regions: [
        { name: "Healthy", confidence: 98, acreage: "1.6 ac" },
        { name: "Bacterial Spot", confidence: 6, acreage: "0.0 ac" },
        { name: "Mosaic Virus", confidence: 4, acreage: "0.0 ac" },
      ],
    },
    {
      id: "potato-late-blight",
      fieldId: "W-22",
      crop: "Potato",
      variety: "Yukon Gold",
      location: "West Ridge",
      capturedAt: "11:03 AM",
      diagnosis: "Late Blight",
      confidence: 91,
      severity: "Critical",
      status: "Escalated",
      spreadRisk: 93,
      treatmentWindow: "Same day",
      treatment:
        "Isolate affected rows, remove damaged foliage, avoid movement through wet canopy, and prioritize rapid fungicide intervention.",
      agronomistNote:
        "Wet boundary artifacts and necrotic edges indicate a high-spread condition. Field team should verify adjacent rows.",
      cues: ["Water-soaked patches", "Irregular necrotic edges", "High humidity signature"],
      color: "from-green-800 via-emerald-700 to-stone-500",
      texture:
        "radial-gradient(circle at 31% 42%, rgba(41,37,36,.78) 0 11%, transparent 12%), radial-gradient(circle at 66% 63%, rgba(68,64,60,.76) 0 13%, transparent 14%)",
      mask: [
        { x: 31, y: 42, size: 28, opacity: 0.84 },
        { x: 66, y: 63, size: 31, opacity: 0.8 },
      ],
      regions: [
        { name: "Late Blight", confidence: 91, acreage: "6.9 ac" },
        { name: "Early Blight", confidence: 27, acreage: "1.1 ac" },
        { name: "Healthy", confidence: 7, acreage: "0.2 ac" },
      ],
    },
    {
      id: "apple-rust",
      fieldId: "O-11",
      crop: "Apple",
      variety: "Honeycrisp",
      location: "Orchard Row C",
      capturedAt: "12:26 PM",
      diagnosis: "Cedar Apple Rust",
      confidence: 88,
      severity: "Medium",
      status: "Needs Review",
      spreadRisk: 57,
      treatmentWindow: "48-72 hours",
      treatment:
        "Prune nearby infected material, clear fallen leaves, and consider preventative fungicide during wet spring periods.",
      agronomistNote:
        "Rust markers are visible, but density is moderate. Human review can confirm whether treatment should cover the full row.",
      cues: ["Orange rust spots", "Circular lesions", "Surface clustering"],
      color: "from-lime-500 via-green-500 to-amber-300",
      texture:
        "radial-gradient(circle at 44% 38%, rgba(217,119,6,.86) 0 6%, transparent 7%), radial-gradient(circle at 58% 62%, rgba(245,158,11,.82) 0 5%, transparent 6%), radial-gradient(circle at 31% 65%, rgba(180,83,9,.72) 0 4%, transparent 5%)",
      mask: [
        { x: 44, y: 38, size: 17, opacity: 0.78 },
        { x: 58, y: 62, size: 15, opacity: 0.72 },
        { x: 31, y: 65, size: 12, opacity: 0.66 },
      ],
      regions: [
        { name: "Cedar Apple Rust", confidence: 88, acreage: "2.4 ac" },
        { name: "Apple Scab", confidence: 24, acreage: "0.6 ac" },
        { name: "Healthy", confidence: 18, acreage: "0.4 ac" },
      ],
    },
  ],
};

const severityStyles: Record<Severity, string> = {
  Low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  High: "border-rose-200 bg-rose-50 text-rose-700",
  Critical: "border-red-300 bg-red-50 text-red-700",
};

const statusStyles: Record<QueueStatus, string> = {
  Ready: "bg-emerald-100 text-emerald-800",
  "Needs Review": "bg-amber-100 text-amber-800",
  Escalated: "bg-red-100 text-red-800",
};

function LeafPreview({
  sample,
  uploadedImage,
}: {
  sample: PlantSample;
  uploadedImage: string | null;
}) {
  return (
    <div className="relative aspect-[16/11] overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
      {uploadedImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt="Uploaded leaf preview" className="h-full w-full object-cover" src={uploadedImage} />
      ) : (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#eef2f7,#dbeafe_52%,#f4f1e8)]" />
          <div
            className={`absolute left-1/2 top-1/2 h-[76%] w-[42%] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-[58%_8%_58%_8%] bg-gradient-to-br ${sample.color} shadow-2xl`}
            style={{ backgroundImage: sample.texture }}
          />
          <div className="absolute left-1/2 top-[18%] h-[64%] w-1 -translate-x-1/2 rotate-[-18deg] rounded-full bg-white/35" />
        </>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_48%,transparent_0_29%,rgba(15,23,42,.06)_30%,rgba(15,23,42,.28)_100%)]" />
      {sample.mask.map((spot) => (
        <motion.span
          animate={{ opacity: [spot.opacity * 0.45, spot.opacity, spot.opacity * 0.6] }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/70 bg-cyan-300/55 blur-[2px]"
          key={`${spot.x}-${spot.y}`}
          style={{
            height: `${spot.size}%`,
            left: `${spot.x}%`,
            top: `${spot.y}%`,
            width: `${spot.size}%`,
          }}
          transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse" }}
        />
      ))}
      <div className="absolute left-4 top-4 rounded-md border border-white/70 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
        {uploadedImage ? "Uploaded leaf image" : `${sample.crop} leaf scan`}
      </div>
      <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
        {["RGB", "Grad-CAM", "QA pass"].map((label) => (
          <div className="rounded-md border border-white/60 bg-white/75 px-3 py-2 text-[11px] font-semibold text-slate-600 backdrop-blur" key={label}>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function ProgressBar({
  value,
  className = "bg-slate-800",
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
      <motion.div
        animate={{ width: `${value}%` }}
        className={`h-full rounded-full ${className}`}
        initial={{ width: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      />
    </div>
  );
}

function PlantDetectionExperience({ snapshot }: { snapshot: PlantDemoData }) {
  const [selectedId, setSelectedId] = useState(snapshot.samples[0].id);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<"sample" | "upload">("sample");

  const selectedSample =
    snapshot.samples.find((sample) => sample.id === selectedId) ?? snapshot.samples[0];

  const batchRisk = useMemo(() => {
    const risk = Math.round(
      snapshot.samples.reduce((sum, sample) => sum + sample.spreadRisk, 0) /
        snapshot.samples.length,
    );

    return risk;
  }, [snapshot.samples]);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(String(reader.result));
      setScanMode("upload");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-full bg-[#f6f8f3] text-slate-900">
      <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
              LV
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Plant Disease Detection
              </p>
              <h2 className="text-2xl font-semibold text-slate-950">Field diagnosis command center</h2>
              <p className="mt-1 text-sm text-slate-500">
                Mock production workflow for image triage, explainability, and treatment planning.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <MetricCard label="Scans today" value={snapshot.operations.scansToday.toLocaleString()} detail="Across active fields" />
            <MetricCard label="Flagged" value={String(snapshot.operations.flagged)} detail="Disease candidates" />
            <MetricCard label="Avg confidence" value={snapshot.operations.avgConfidence} detail="Last 24 hours" />
            <MetricCard label="Review queue" value={String(snapshot.operations.reviewQueue)} detail="Awaiting agronomist" />
          </div>
        </div>
      </header>

      <main className="grid gap-5 p-5 sm:p-7 xl:grid-cols-[310px_minmax(0,1fr)_360px]">
        <aside className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-950">Intake Queue</h3>
                <p className="mt-1 text-xs text-slate-500">Select a mock sample or upload a local image.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {snapshot.samples.length} cases
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  scanMode === "sample"
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
                onClick={() => {
                  setScanMode("sample");
                  setUploadedImage(null);
                }}
                type="button"
              >
                Samples
              </button>
              <label
                className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-semibold transition ${
                  scanMode === "upload"
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                Upload
                <input accept="image/*" className="sr-only" onChange={handleUpload} type="file" />
              </label>
            </div>

            <div className="mt-4 space-y-3">
              {snapshot.samples.map((sample) => (
                <button
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    sample.id === selectedId
                      ? "border-slate-900 bg-slate-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                  key={sample.id}
                  onClick={() => {
                    setSelectedId(sample.id);
                    if (scanMode === "sample") setUploadedImage(null);
                  }}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-sm font-semibold text-slate-900">
                        {sample.fieldId} · {sample.crop}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">{sample.location}</span>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusStyles[sample.status]}`}>
                      {sample.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{sample.diagnosis}</span>
                    <span>{sample.confidence}%</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-950">Model Governance</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["Model", snapshot.model.name],
                ["Version", snapshot.model.version],
                ["Validation", `${snapshot.model.accuracy} accuracy`],
                ["Latency", `${snapshot.model.latencyMs} ms p50`],
                ["Data drift", snapshot.model.drift],
                ["Last validated", snapshot.model.lastValidated],
              ].map(([label, value]) => (
                <div className="flex items-center justify-between gap-3" key={label}>
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="font-semibold text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </aside>

        <section className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Active scan</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-950">
                  {uploadedImage
                    ? "Uploaded image analysis"
                    : `${selectedSample.crop} ${selectedSample.variety} · Field ${selectedSample.fieldId}`}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Captured {selectedSample.capturedAt} · {selectedSample.location}
                </p>
              </div>
              <span className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${severityStyles[selectedSample.severity]}`}>
                {selectedSample.severity} severity
              </span>
            </div>

            <div className="mt-5">
              <LeafPreview sample={selectedSample} uploadedImage={uploadedImage} />
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-950">Explainability Signals</h3>
              <div className="mt-4 space-y-3">
                {selectedSample.cues.map((cue, index) => (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3" key={cue}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-slate-800">{cue}</span>
                      <span className="text-slate-500">{Math.max(54, selectedSample.confidence - index * 9)}%</span>
                    </div>
                    <div className="mt-2">
                      <ProgressBar value={Math.max(54, selectedSample.confidence - index * 9)} className="bg-cyan-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-950">Quality Checks</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  ["Blur", "Pass"],
                  ["Exposure", "Pass"],
                  ["Leaf coverage", "92%"],
                  ["Duplicate", "None"],
                ].map(([label, value]) => (
                  <div className="rounded-lg bg-slate-50 p-3" key={label}>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Batch risk</p>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-2xl font-semibold text-slate-950">{batchRisk}%</span>
                  <span className="text-xs font-semibold text-slate-500">Mock fleet average</span>
                </div>
                <div className="mt-3">
                  <ProgressBar value={batchRisk} className="bg-amber-500" />
                </div>
              </div>
            </div>
          </section>
        </section>

        <aside className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Prediction</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">{selectedSample.diagnosis}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{selectedSample.agronomistNote}</p>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Model confidence</span>
                <span>{selectedSample.confidence}%</span>
              </div>
              <div className="mt-2">
                <ProgressBar value={selectedSample.confidence} className="bg-emerald-600" />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {selectedSample.regions.map((result) => (
                <div className="rounded-lg bg-slate-50 p-3" key={result.name}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-slate-800">{result.name}</span>
                    <span className="text-slate-500">{result.confidence}%</span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={result.confidence} />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Estimated exposure: {result.acreage}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-950">Response Plan</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Spread risk</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{selectedSample.spreadRisk}%</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Action window</p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{selectedSample.treatmentWindow}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{selectedSample.treatment}</p>
            <button
              className="mt-5 w-full rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              type="button"
            >
              Create field task
            </button>
          </section>
        </aside>
      </main>
    </div>
  );
}

export default function PlantDiseaseDetectionDemo() {
  const fetchDemoData = async () => {
    return getMockData<PlantDemoData>({
      id: "plant-disease-detection-demo",
      delayMs: 800,
      mockResponse: PLANT_DEMO_DATA,
    });
  };

  return (
    <DemoShell title="Plant Disease Detection System" fetchData={fetchDemoData}>
      {(data) => (data ? <PlantDetectionExperience snapshot={data} /> : null)}
    </DemoShell>
  );
}
