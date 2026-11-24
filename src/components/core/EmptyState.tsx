import cn from "@/lib/utils";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: ReactNode;
  /** A way forward (usually a `Button` or a `Link` styled with `buttonVariants`) */
  action?: ReactNode;
  className?: string;
}

/**
 * Centered message for an empty list, a filtered-out list, a missing record,
 * or a missing workspace. Always offer an `action` when there is a next step
 */
const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center px-6 py-14 text-center",
      className,
    )}
  >
    {Icon && (
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary-600 dark:text-primary-300">
        <Icon className="size-6" />
      </div>
    )}
    <p className="font-semibold text-base">{title}</p>
    {description && (
      <p className="mt-1 max-w-sm text-muted-foreground text-sm">
        {description}
      </p>
    )}
    {action && (
      <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>
    )}
  </div>
);

export default EmptyState;
