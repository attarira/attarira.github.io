"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import DemoShell from "./DemoShell";
import { getMockData } from "@/lib/mockAPI";

type Severity = "Low" | "Medium" | "High";

type PlantSample = {
  id: string;
  crop: string;
  label: string;
  diagnosis: string;
  confidence: number;
  severity: Severity;
  treatment: string;
  cues: string[];
  color: string;
  texture: string;
  mask: { x: number; y: number; size: number; opacity: number }[];
};

type PlantDemoData = {
  model: {
    name: string;
    accuracy: string;
    classes: number;
    latencyMs: number;
  };
  samples: PlantSample[];
};

const PLANT_DEMO_DATA: PlantDemoData = {
  model: {
    name: "CNN leaf classifier",
    accuracy: "96.4%",
    classes: 38,
    latencyMs: 84,
  },
  samples: [
    {
      id: "tomato-early-blight",
      crop: "Tomato",
      label: "Sample A",
      diagnosis: "Early Blight",
      confidence: 94,
      severity: "High",
      treatment:
        "Remove infected lower leaves, improve airflow, and apply a copper-based fungicide if spread continues.",
      cues: ["Concentric brown lesions", "Yellowing around spots", "Lower-leaf concentration"],
      color: "from-emerald-500 via-lime-500 to-yellow-300",
      texture:
        "radial-gradient(circle at 35% 34%, rgba(120, 53, 15, 0.72) 0 6%, transparent 7%), radial-gradient(circle at 62% 54%, rgba(113, 63, 18, 0.68) 0 7%, transparent 8%), radial-gradient(circle at 45% 70%, rgba(146, 64, 14, 0.64) 0 5%, transparent 6%)",
      mask: [
        { x: 35, y: 34, size: 18, opacity: 0.82 },
        { x: 62, y: 54, size: 22, opacity: 0.76 },
        { x: 45, y: 70, size: 14, opacity: 0.7 },
      ],
    },
    {
      id: "pepper-healthy",
      crop: "Bell Pepper",
      label: "Sample B",
      diagnosis: "Healthy",
      confidence: 98,
      severity: "Low",
      treatment:
        "No disease detected. Continue routine watering and inspect weekly for pests or leaf discoloration.",
      cues: ["Even leaf tone", "No visible lesions", "Healthy vein structure"],
      color: "from-green-700 via-emerald-500 to-lime-400",
      texture:
        "linear-gradient(115deg, transparent 0 46%, rgba(255,255,255,0.25) 47% 49%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.18), transparent 18%)",
      mask: [
        { x: 50, y: 50, size: 12, opacity: 0.18 },
        { x: 68, y: 33, size: 14, opacity: 0.16 },
      ],
    },
    {
      id: "potato-late-blight",
      crop: "Potato",
      label: "Sample C",
      diagnosis: "Late Blight",
      confidence: 91,
      severity: "High",
      treatment:
        "Isolate affected plants, remove damaged foliage, and treat quickly because late blight can spread rapidly in wet conditions.",
      cues: ["Dark water-soaked patches", "Irregular necrotic edges", "High spread risk"],
      color: "from-green-800 via-emerald-700 to-stone-500",
      texture:
        "radial-gradient(circle at 31% 42%, rgba(41, 37, 36, 0.78) 0 11%, transparent 12%), radial-gradient(circle at 66% 63%, rgba(68, 64, 60, 0.76) 0 13%, transparent 14%)",
      mask: [
        { x: 31, y: 42, size: 28, opacity: 0.84 },
        { x: 66, y: 63, size: 31, opacity: 0.8 },
      ],
    },
    {
      id: "apple-rust",
      crop: "Apple",
      label: "Sample D",
      diagnosis: "Cedar Apple Rust",
      confidence: 88,
      severity: "Medium",
      treatment:
        "Prune nearby infected material, clear fallen leaves, and consider preventative fungicide during wet spring periods.",
      cues: ["Orange rust spots", "Circular lesion pattern", "Leaf surface clustering"],
      color: "from-lime-500 via-green-500 to-amber-300",
      texture:
        "radial-gradient(circle at 44% 38%, rgba(217, 119, 6, 0.86) 0 6%, transparent 7%), radial-gradient(circle at 58% 62%, rgba(245, 158, 11, 0.82) 0 5%, transparent 6%), radial-gradient(circle at 31% 65%, rgba(180, 83, 9, 0.72) 0 4%, transparent 5%)",
      mask: [
        { x: 44, y: 38, size: 17, opacity: 0.78 },
        { x: 58, y: 62, size: 15, opacity: 0.72 },
        { x: 31, y: 65, size: 12, opacity: 0.66 },
      ],
    },
  ],
};

const severityStyles: Record<Severity, string> = {
  Low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  High: "border-rose-200 bg-rose-50 text-rose-700",
};

function LeafPreview({
  sample,
  uploadedImage,
}: {
  sample: PlantSample;
  uploadedImage: string | null;
}) {
  if (uploadedImage) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
        <img
          alt="Uploaded leaf preview"
          className="h-full w-full object-cover"
          src={uploadedImage}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_54%_46%,transparent_0_28%,rgba(14,165,233,0.22)_29%,transparent_44%)]" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#eef2f7,#dbeafe)]" />
      <div
        className={`absolute left-1/2 top-1/2 h-[72%] w-[48%] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-[58%_8%_58%_8%] bg-gradient-to-br ${sample.color} shadow-2xl`}
        style={{ backgroundImage: sample.texture }}
      />
      <div className="absolute left-1/2 top-[20%] h-[62%] w-1 -translate-x-1/2 rotate-[-18deg] rounded-full bg-white/35" />
      <div className="absolute inset-x-6 bottom-5 rounded-lg border border-white/60 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
        {sample.crop} leaf scan
      </div>
    </div>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <span>Model confidence</span>
        <span>{value}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          animate={{ width: `${value}%` }}
          className="h-full rounded-full bg-teal-500"
          initial={{ width: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function PlantDetectionExperience({ snapshot }: { snapshot: PlantDemoData }) {
  const [selectedId, setSelectedId] = useState(snapshot.samples[0].id);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<"sample" | "upload">("sample");

  const selectedSample =
    snapshot.samples.find((sample) => sample.id === selectedId) ?? snapshot.samples[0];

  const rankedClasses = useMemo(() => {
    const alternatives = snapshot.samples
      .filter((sample) => sample.id !== selectedSample.id)
      .slice(0, 3)
      .map((sample, index) => ({
        diagnosis: sample.diagnosis,
        confidence: Math.max(4, selectedSample.confidence - 22 - index * 9),
      }));

    return [
      { diagnosis: selectedSample.diagnosis, confidence: selectedSample.confidence },
      ...alternatives,
    ];
  }, [selectedSample, snapshot.samples]);

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
    <div className="min-h-full bg-[#f8faf6] text-slate-900">
      <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-sm font-bold text-white">
                PD
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                  Plant Disease Detection
                </p>
                <h2 className="text-2xl font-semibold text-slate-950">
                  Leaf diagnosis workbench
                </h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              ["Model", snapshot.model.name],
              ["Accuracy", snapshot.model.accuracy],
              ["Latency", `${snapshot.model.latencyMs}ms`],
            ].map(([label, value]) => (
              <div
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-right"
                key={label}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="grid gap-5 p-5 sm:p-7 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
        <aside className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-950">Input Leaf</h3>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  scanMode === "sample"
                    ? "border-teal-300 bg-teal-50 text-teal-800"
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
                    ? "border-teal-300 bg-teal-50 text-teal-800"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                Upload
                <input
                  accept="image/*"
                  className="sr-only"
                  onChange={handleUpload}
                  type="file"
                />
              </label>
            </div>

            <div className="mt-4 space-y-3">
              {snapshot.samples.map((sample) => (
                <button
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    sample.id === selectedId
                      ? "border-teal-300 bg-teal-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                  key={sample.id}
                  onClick={() => {
                    setSelectedId(sample.id);
                    if (scanMode === "sample") setUploadedImage(null);
                  }}
                  type="button"
                >
                  <span className="text-sm font-semibold text-slate-900">
                    {sample.label}: {sample.crop}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {sample.diagnosis}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Active scan
              </p>
              <h3 className="mt-1 text-xl font-semibold text-slate-950">
                {uploadedImage ? "Uploaded image" : `${selectedSample.crop} ${selectedSample.label}`}
              </h3>
            </div>
            <span
              className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${severityStyles[selectedSample.severity]}`}
            >
              {selectedSample.severity} severity
            </span>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
            <LeafPreview sample={selectedSample} uploadedImage={uploadedImage} />

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Heatmap overlay
              </p>
              <div className="relative mt-4 aspect-square rounded-lg bg-slate-900">
                {selectedSample.mask.map((spot) => (
                  <motion.span
                    animate={{ scale: [0.9, 1.08, 1] }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 blur-sm"
                    key={`${spot.x}-${spot.y}`}
                    style={{
                      height: `${spot.size}%`,
                      left: `${spot.x}%`,
                      opacity: spot.opacity,
                      top: `${spot.y}%`,
                      width: `${spot.size}%`,
                    }}
                    transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse" }}
                  />
                ))}
                <div className="absolute inset-4 rounded-lg border border-white/20" />
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Highlighted regions represent the visual cues driving the simulated classifier output.
              </p>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Prediction
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">
              {selectedSample.diagnosis}
            </h3>
            <div className="mt-5">
              <ConfidenceBar value={selectedSample.confidence} />
            </div>

            <div className="mt-5 space-y-3">
              {rankedClasses.map((result) => (
                <div className="rounded-lg bg-slate-50 p-3" key={result.diagnosis}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-slate-800">{result.diagnosis}</span>
                    <span className="text-slate-500">{result.confidence}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-700"
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-950">Detected Cues</h3>
            <div className="mt-4 space-y-2">
              {selectedSample.cues.map((cue) => (
                <div className="flex items-center gap-2 text-sm text-slate-700" key={cue}>
                  <span className="h-2 w-2 rounded-full bg-teal-500" />
                  {cue}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-teal-200 bg-teal-50 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-teal-950">Recommended Action</h3>
            <p className="mt-3 text-sm leading-6 text-teal-900">{selectedSample.treatment}</p>
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
