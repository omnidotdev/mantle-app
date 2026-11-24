import { Loader2Icon } from "lucide-react";

import cn from "@/lib/utils";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: ReactNode;
  /** Small line under the value (context, a delta) */
  sub?: ReactNode;
  /** Full value for a tooltip when the visible one may truncate */
  title?: string;
  loading?: boolean;
  className?: string;
}

/** Headline number on a raised card, used for dashboard and record summaries */
const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
  title,
  loading,
  className,
}: StatCardProps) => (
  <div
    className={cn(
      "min-w-0 rounded-2xl bg-card p-4 shadow-card sm:p-5 dark:border dark:border-border/60 dark:shadow-none",
      className,
    )}
  >
    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
      {Icon && (
        <span className="hidden size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-600 sm:flex dark:text-primary-300">
          <Icon className="size-4" />
        </span>
      )}
      <span className="truncate">{label}</span>
    </div>
    {loading ? (
      <Loader2Icon
        className="mt-3 size-6 animate-spin text-muted-foreground"
        aria-label="Loading"
      />
    ) : (
      <p
        className="tabular mt-2 truncate text-xl font-bold tracking-tight sm:mt-3 sm:text-[1.75rem] sm:leading-9"
        title={title}
      >
        {value}
      </p>
    )}
    {sub && !loading && (
      <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-[0.8125rem]">
        {sub}
      </p>
    )}
  </div>
);

export default StatCard;
