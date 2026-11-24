import cn from "@/lib/utils";

import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  /** One line under the title (counts, client, due date) */
  description?: ReactNode;
  /** Rendered beside the title, e.g. a status badge */
  badge?: ReactNode;
  /** Back link rendered above the title (pass a `<BackLink>`) */
  back?: ReactNode;
  /** Buttons on the right; they wrap under the title on phones */
  actions?: ReactNode;
  className?: string;
}

/**
 * Title row shared by every page: optional back link, title with an optional
 * badge, a description line, and actions that sit on the right on wide screens
 * and drop below the title on phones. Never printed
 */
const PageHeader = ({
  title,
  description,
  badge,
  back,
  actions,
  className,
}: PageHeaderProps) => (
  <header className={cn("mb-6 print:hidden", className)}>
    {back && <div className="mb-2.5">{back}</div>}
    <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="font-bold text-2xl tracking-tight md:text-[1.75rem] md:leading-9">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="mt-1 text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      {actions && (
        <div
          className={cn(
            "flex w-full flex-wrap items-center gap-2 sm:w-auto",
            // On phones, drop the row when every action inside is phone-hidden
            // (moved to the bottom bar or covered by the create button)
            "max-md:[&:not(:has(>:not(.hidden,[class*='max-md:hidden'])))]:hidden",
          )}
        >
          {actions}
        </div>
      )}
    </div>
  </header>
);

export default PageHeader;
