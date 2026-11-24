import SectionCard from "@/components/core/SectionCard";
import { TAG_LEGEND, TONE_DOT_CLASSES } from "@/features/people/tagPalette";
import cn from "@/lib/utils";
import NetworkGraph from "./NetworkGraph";

import type { Person } from "@/features/people/types";

interface NetworkSectionProps {
  people: Person[];
}

const NetworkSection = ({ people }: NetworkSectionProps) => (
  <SectionCard flush>
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-border border-b px-4 py-3 sm:px-5">
      <h2 className="font-semibold text-sm">Network graph</h2>
      <ul
        aria-label="Legend"
        className="flex flex-wrap gap-x-3 gap-y-1 sm:ml-auto"
      >
        {TAG_LEGEND.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-block size-2.5 rounded-full",
                TONE_DOT_CLASSES[item.tone],
              )}
            />
            <span className="text-muted-foreground text-xs">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>

    <NetworkGraph people={people} />
  </SectionCard>
);

export default NetworkSection;
