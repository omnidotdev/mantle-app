import NetworkGraph from "./NetworkGraph";

import type { Person } from "@/features/people/types";

interface NetworkSectionProps {
  people: Person[];
}

const LEGEND_ITEMS = [
  { label: "Employee", color: "#3b82f6" },
  { label: "Client", color: "#a855f7" },
  { label: "Prospect", color: "#eab308" },
  { label: "Contractor", color: "#f97316" },
  { label: "Other", color: "#9ca3af" },
];

const NetworkSection = ({ people }: NetworkSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground text-lg">Network Graph</h3>
        <div className="flex gap-3">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground text-xs">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <NetworkGraph people={people} />
    </div>
  );
};

export default NetworkSection;
