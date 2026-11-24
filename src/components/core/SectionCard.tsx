import cn from "@/lib/utils";

import type { ReactNode } from "react";

interface SectionCardProps {
  /** Card heading; omit for a plain raised card */
  title?: ReactNode;
  /** Right side of the heading row (a "View all" link, a small button) */
  action?: ReactNode;
  /** Remove the body padding (for lists and tables that run edge to edge) */
  flush?: boolean;
  className?: string;
  bodyClassName?: string;
  children?: ReactNode;
}

/**
 * The raised white card that every Strata surface sits on. Pass `flush` when the
 * body is a list or table that should run to the card edges
 */
const SectionCard = ({
  title,
  action,
  flush,
  className,
  bodyClassName,
  children,
}: SectionCardProps) => (
  <section
    className={cn(
      "min-w-0 overflow-hidden rounded-2xl bg-card text-card-foreground shadow-card dark:border dark:border-border/60 dark:shadow-none",
      className,
    )}
  >
    {(title || action) && (
      <div className="flex min-h-13 flex-wrap items-center gap-x-3 gap-y-2 border-border border-b px-4 py-3 sm:px-5">
        {title && <h2 className="font-semibold text-sm">{title}</h2>}
        {action && (
          <div className="ml-auto flex items-center gap-2">{action}</div>
        )}
      </div>
    )}
    <div className={cn(!flush && "p-4 sm:p-5", bodyClassName)}>{children}</div>
  </section>
);

export default SectionCard;
