import FinSearchAIDemo from "@/components/demos/FinSearchAIDemo";
import LifeOSDemo from "@/components/demos/LifeOSDemo";
import MediaWatcherDemo from "@/components/demos/MediaWatcherDemo";
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

// Map project IDs to their specific demo components
const demoRegistry: Record<string, React.ReactNode> = {
  "template": <TemplateDemo />,
  "finsearchai": <FinSearchAIDemo />,
  "lifeos": <LifeOSDemo />,
  "media-watcher": <MediaWatcherDemo />,
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
