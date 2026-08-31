import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ClassValue } from "clsx";

/**
 * Merge Tailwind classes with clsx.
 */
const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Format a status enum for display (e.g. "past_due" -> "Past due").
 */
const formatStatus = (status: string): string => {
  const spaced = status.replace(/[_-]+/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

export { cn, formatStatus };
export default cn;
