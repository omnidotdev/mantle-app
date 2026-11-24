import { Users } from "lucide-react";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import EmptyState from "@/components/core/EmptyState";
import LoadingState from "@/components/core/LoadingState";
import { TONE_CSS_VARS, getPeopleTone } from "@/features/people/tagPalette";
import { useTheme } from "@/providers/ThemeProvider";

import type { TagTone } from "@/features/people/tagPalette";
import type { Person } from "@/features/people/types";

const ForceGraph2D = lazy(() => import("react-force-graph-2d"));

interface NetworkGraphProps {
  people: Person[];
}

interface GraphColors {
  background: string;
  link: string;
  label: string;
  labelBackground: string;
  tones: Record<TagTone, string>;
}

const NODE_RADIUS = 6;

/** Graph height: most of the viewport on phones, capped on large screens */
const GRAPH_HEIGHT = "min(60vh, 520px)";

/** Read the theme tokens the canvas paints with (canvas cannot use CSS classes) */
const readGraphColors = (): GraphColors => {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) =>
    styles.getPropertyValue(name).trim() || fallback;

  const tones = Object.fromEntries(
    Object.entries(TONE_CSS_VARS).map(([tone, cssVar]) => [
      tone,
      read(cssVar, "gray"),
    ]),
  ) as Record<TagTone, string>;

  return {
    background: read("--card", "white"),
    link: read("--border", "lightgray"),
    label: read("--foreground", "black"),
    labelBackground: read("--card", "white"),
    tones,
  };
};

const NetworkGraph = ({ people }: NetworkGraphProps) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [colors, setColors] = useState<GraphColors | null>(null);

  // Re-read the palette whenever the theme flips
  // biome-ignore lint/correctness/useExhaustiveDependencies: `theme` is the trigger, the colors come from the DOM
  useEffect(() => {
    setColors(readGraphColors());
  }, [theme]);

  const hasPeople = people.length > 0;

  // Size the canvas to its container (mounted only once there are people)
  useEffect(() => {
    if (!hasPeople) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ width: Math.floor(width), height: Math.floor(height) });
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [hasPeople]);

  const graphData = useMemo(() => {
    const nodes = people.map((p) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      tone: getPeopleTone(p.tags),
    }));

    // Link people who share at least one tag
    const links: { source: string; target: string }[] = [];
    for (let i = 0; i < people.length; i++) {
      for (let j = i + 1; j < people.length; j++) {
        const tagsA = people[i]?.tags ?? [];
        const tagsB = people[j]?.tags ?? [];
        if (tagsA.some((t) => tagsB.includes(t))) {
          links.push({ source: people[i].id, target: people[j].id });
        }
      }
    }

    return { nodes, links };
  }, [people]);

  const paintNode = useCallback(
    (
      node: { x?: number; y?: number; name?: string; tone?: TagTone },
      ctx: CanvasRenderingContext2D,
    ) => {
      if (!colors) return;

      const x = node.x ?? 0;
      const y = node.y ?? 0;
      const label = node.name ?? "";

      ctx.beginPath();
      ctx.arc(x, y, NODE_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = colors.tones[node.tone ?? "neutral"];
      ctx.fill();

      // Label on a card-colored plate so it stays legible over links
      ctx.font = "4px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const textWidth = ctx.measureText(label).width;
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = colors.labelBackground;
      ctx.fillRect(x - textWidth / 2 - 1, y + 7, textWidth + 2, 6);
      ctx.globalAlpha = 1;
      ctx.fillStyle = colors.label;
      ctx.fillText(label, x, y + 8);
    },
    [colors],
  );

  if (!hasPeople) {
    return (
      <EmptyState
        icon={Users}
        title="No network yet"
        description="Add contacts and tag them to see how they connect."
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden"
      style={{ height: GRAPH_HEIGHT }}
    >
      {colors && size.width > 0 && (
        <Suspense fallback={<LoadingState label="Loading network graph" />}>
          <ForceGraph2D
            graphData={graphData}
            nodeCanvasObject={paintNode}
            nodePointerAreaPaint={(node, color, ctx) => {
              ctx.beginPath();
              ctx.arc(node.x ?? 0, node.y ?? 0, NODE_RADIUS, 0, 2 * Math.PI);
              ctx.fillStyle = color;
              ctx.fill();
            }}
            width={size.width}
            height={size.height}
            linkColor={() => colors.link}
            linkDirectionalParticles={2}
            linkDirectionalParticleWidth={2}
            linkDirectionalParticleColor={() => colors.tones.neutral}
            backgroundColor={colors.background}
          />
        </Suspense>
      )}
    </div>
  );
};

export default NetworkGraph;
