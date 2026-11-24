import { Link } from "@tanstack/react-router";

import { moduleNav } from "@/components/core/moduleNav";
import SectionCard from "@/components/core/SectionCard";
import { IconChip } from "@/features/dashboard/components/DashboardRow";

import type { ModuleNavItem } from "@/components/core/moduleNav";
import type { ChipTone } from "@/features/dashboard/components/DashboardRow";

/** Each module keeps its own soft tint so the grid scans at a glance */
const moduleTones: Record<ModuleNavItem["key"], ChipTone> = {
  dashboard: "brand",
  people: "rose",
  invoices: "brand",
  quotes: "warning",
  inventory: "neutral",
};

interface ModulesCardProps {
  workspaceSlug: string;
  /** One summary line per module key, e.g. "46 invoices · 6 open" */
  summaries: Partial<Record<ModuleNavItem["key"], string>>;
}

/** Two-by-two grid linking to every enabled module, with a count line each */
const ModulesCard = ({ workspaceSlug, summaries }: ModulesCardProps) => (
  <SectionCard title="Modules" flush>
    <ul className="grid grid-cols-2 gap-px bg-border">
      {moduleNav.map((item) => (
        <li key={item.key} className="bg-card">
          <Link
            to={item.to}
            params={{ workspaceSlug }}
            className="flex h-full flex-col items-start gap-2.5 px-4 py-3.5 transition-colors hover:bg-accent/60 focus-visible:bg-accent/60 focus-visible:outline-none sm:flex-row sm:items-center sm:gap-3 sm:px-5"
          >
            <IconChip icon={item.icon} tone={moduleTones[item.key]} />
            <span className="min-w-0 leading-tight">
              <span className="block text-sm font-medium">{item.label}</span>
              {summaries[item.key] && (
                <span className="tabular mt-0.5 block text-xs text-muted-foreground">
                  {summaries[item.key]}
                </span>
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </SectionCard>
);

export default ModulesCard;
