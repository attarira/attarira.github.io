"use client";

import DemoShell from "./DemoShell";
import App from "./pipeline-builder/App";
import "./pipeline-builder/index.css";

// 1. Define the specific shape of the data for this demo
interface PipelineData {
  status: string;
}

// 2. Define the hardcoded mock payload
const MOCK_DATA: PipelineData = {
  status: "success",
};

export default function PipelineBuilderDemo() {
  // 3. Define the fetcher function
  const fetchDemoData = async () => {
    return new Promise<PipelineData>((resolve) => {
      setTimeout(() => resolve(MOCK_DATA), 500);
    });
  };

  // 4. Wrap your UI in the DemoShell
  return (
    <DemoShell title="AI Workflow Builder" fetchData={fetchDemoData}>
      {(data, isLoading, isError) => {
        if (isLoading || isError) return null;
        
        return (
          <div className="w-full h-[800px] bg-white relative rounded-b-2xl overflow-hidden">
            <App />
          </div>
        );
      }}
    </DemoShell>
  );
}
