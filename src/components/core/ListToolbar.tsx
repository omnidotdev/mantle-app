import cn from "@/lib/utils";

import type { ReactNode } from "react";

/**
 * Filter row at the top of a list card: status tabs on the left, search on the
 * right. Stacks on phones. Lives outside any sideways-scrolling table
 */
const ListToolbar = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col gap-2.5 border-border border-b p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-4 print:hidden",
      className,
    )}
  >
    {children}
  </div>
);

export default ListToolbar;
