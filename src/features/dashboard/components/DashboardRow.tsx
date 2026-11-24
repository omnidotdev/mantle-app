import cn from "@/lib/utils";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Shared look for a dashboard list row that is a link */
const dashboardRowClass =
  "flex min-h-14 items-center gap-3 px-4 py-2.5 transition-colors hover:bg-accent/60 focus-visible:bg-accent/60 focus-visible:outline-none sm:px-5";

/** Soft-tinted icon chips, keyed by tone */
const chipTones = {
  danger: "bg-destructive/10 text-destructive",
  warning: "bg-warning/14 text-warning",
  info: "bg-info/12 text-info",
  brand: "bg-primary/10 text-primary-600 dark:text-primary-300",
  rose: "bg-secondary/12 text-secondary",
  neutral: "bg-muted text-muted-foreground",
} as const;

type ChipTone = keyof typeof chipTones;

const IconChip = ({
  icon: Icon,
  tone,
  className,
}: {
  icon: LucideIcon;
  tone: ChipTone;
  className?: string;
}) => (
  <span
    aria-hidden
    className={cn(
      "flex size-8 shrink-0 items-center justify-center rounded-lg",
      chipTones[tone],
      className,
    )}
  >
    <Icon className="size-4" />
  </span>
);

/** Two-line text block: a strong first line and a muted second line */
const RowText = ({ title, sub }: { title: ReactNode; sub?: ReactNode }) => (
  <span className="min-w-0 flex-1 leading-tight">
    <span className="block truncate text-sm font-medium">{title}</span>
    {sub && (
      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
        {sub}
      </span>
    )}
  </span>
);

export type { ChipTone };
export { IconChip, RowText, dashboardRowClass };
