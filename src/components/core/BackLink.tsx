import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

import type { LinkComponentProps } from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * Small "← Parent" link used above a page title. Accepts any TanStack `Link`
 * props so the destination stays type-checked
 */
const BackLink = ({
  children,
  ...rest
}: Omit<LinkComponentProps, "children"> & { children: ReactNode }) => (
  <Link
    {...rest}
    className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
  >
    <ArrowLeftIcon className="size-4" />
    {children}
  </Link>
);

export default BackLink;
