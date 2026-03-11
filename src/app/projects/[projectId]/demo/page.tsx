import { notFound } from "next/navigation";
import TemplateDemo from "@/components/demos/TemplateDemo";
import { projects } from "@/data/projects";

// Generate static routes for any projects that have a defined 'id' and 'demoUrl'
export function generateStaticParams() {
  return projects
    .filter((project) => project.id && project.demoUrl)
    .map((project) => ({
      projectId: project.id,
    }));
}

import LifeOSDemo from "@/components/demos/LifeOSDemo";

// Map project IDs to their specific demo components
const demoRegistry: Record<string, React.ReactNode> = {
  // Add future demos here when created, e.g. "media-watcher": <MediaWatcherDemo />
  "template": <TemplateDemo />,
  "lifeos": <LifeOSDemo />
};

export default async function ProjectDemoPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  // If we don't have a specific demo built yet, we fallback to the TemplateDemo 
  // so the links on the portfolio don't break while under development.
  const demoComponent = demoRegistry[projectId] || <TemplateDemo />;

  return (
    <div className="w-full min-h-screen">
      {demoComponent}
    </div>
  );
}
