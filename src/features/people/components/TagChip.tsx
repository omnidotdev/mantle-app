import { getTagChipClass } from "@/features/people/tagPalette";
import cn from "@/lib/utils";

import type { ReactNode } from "react";

interface TagChipProps {
  tag: string;
  /** Trailing content, e.g. a remove button */
  children?: ReactNode;
  className?: string;
}

/** Soft colored pill for a contact tag, colored from the shared tag palette */
const TagChip = ({ tag, children, className }: TagChipProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium text-xs",
      getTagChipClass(tag),
      className,
    )}
  >
    {tag}
    {children}
  </span>
);

export default TagChip;
