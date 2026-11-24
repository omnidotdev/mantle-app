import cn from "@/lib/utils";

import type { ReactNode } from "react";

/**
 * On-screen hint for a value missing from a printable document ("No client
 * yet"). Muted and never printed, so the paper copy stays clean
 */
const DocumentHint = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <span
    className={cn("font-normal text-base-500 italic print:hidden", className)}
  >
    {children}
  </span>
);

export default DocumentHint;
