import type { ReactNode } from "react";

/**
 * Muted placeholder for a field with no value ("Not set", "No client yet"),
 * used instead of a bare dash so an empty cell still reads as words
 */
const EmptyValue = ({ children = "Not set" }: { children?: ReactNode }) => (
  <span className="text-muted-foreground italic">{children}</span>
);

export default EmptyValue;
