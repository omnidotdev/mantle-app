import { Suspense, lazy, useCallback, useMemo } from "react";

import type { Person } from "@/features/people/types";

const ForceGraph2D = lazy(() => import("react-force-graph-2d"));

interface NetworkGraphProps {
  people: Person[];
}

const TAG_COLORS: Record<string, string> = {
  employee: "#3b82f6",
  client: "#a855f7",
  prospect: "#eab308",
  active: "#22c55e",
  contractor: "#f97316",
  leadership: "#6366f1",
  engineering: "#06b6d4",
  design: "#ec4899",
  research: "#10b981",
};

const getNodeColor = (tags: string[] | null): string => {
  if (!tags?.length) return "#9ca3af";
  for (const tag of tags) {
    if (TAG_COLORS[tag]) return TAG_COLORS[tag];
  }
  return "#9ca3af";
};

const NetworkGraph = ({ people }: NetworkGraphProps) => {
  const graphData = useMemo(() => {
    const nodes = people.map((p) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      color: getNodeColor(p.tags),
      tags: p.tags ?? [],
    }));

    // Create links between people who share tags
    const links: { source: string; target: string }[] = [];
    for (let i = 0; i < people.length; i++) {
      for (let j = i + 1; j < people.length; j++) {
        const tagsA = people[i].tags ?? [];
        const tagsB = people[j].tags ?? [];
        const shared = tagsA.some((t) => tagsB.includes(t));
        if (shared) {
          links.push({ source: people[i].id, target: people[j].id });
        }
      }
    }

    return { nodes, links };
  }, [people]);

  const paintNode = useCallback(
    (
      node: { x?: number; y?: number; name?: string; color?: string },
      ctx: CanvasRenderingContext2D,
    ) => {
      const x = node.x ?? 0;
      const y = node.y ?? 0;
      const label = node.name ?? "";
      const color = node.color ?? "#9ca3af";

      // Draw node circle
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      // Draw label with background
      ctx.font = "4px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fillRect(x - textWidth / 2 - 1, y + 7, textWidth + 2, 6);
      ctx.fillStyle = "#374151";
      ctx.fillText(label, x, y + 8);
    },
    [],
  );

  if (people.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-gray-200 border-dashed text-gray-400">
        Add people to see the network graph
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-gray-400">
          Loading graph...
        </div>
      }
    >
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <ForceGraph2D
          graphData={graphData}
          nodeCanvasObject={paintNode}
          nodePointerAreaPaint={(node, color, ctx) => {
            ctx.beginPath();
            ctx.arc(node.x ?? 0, node.y ?? 0, 6, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }}
          width={600}
          height={400}
          linkColor={() => "#d1d5db"}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleColor={() => "#9ca3af"}
          backgroundColor="#ffffff"
        />
      </div>
    </Suspense>
  );
};

export default NetworkGraph;
