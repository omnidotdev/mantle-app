import cn from "@/lib/utils";

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  /** Optional count shown after the label (e.g. invoices per status) */
  count?: number;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  /** Accessible name for the group */
  label: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Pill segmented control for switching a view or filter (status tabs, Form /
 * Preview, Internal / External). Scrolls sideways on narrow screens instead
 * of wrapping or overflowing
 */
const SegmentedControl = <T extends string>({
  options,
  value,
  onValueChange,
  label,
  size = "md",
  className,
}: SegmentedControlProps<T>) => (
  <div
    role="radiogroup"
    aria-label={label}
    className={cn(
      "no-scrollbar flex max-w-full gap-0.5 overflow-x-auto rounded-full bg-muted p-1 print:hidden",
      className,
    )}
  >
    {options.map((option) => {
      const selected = option.value === value;

      return (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onValueChange(option.value)}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            size === "sm" ? "h-7 px-3 text-xs" : "h-8 px-3.5 text-sm",
            selected
              ? "bg-card text-foreground shadow-raised"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
          {option.count !== undefined && (
            <span className="tabular text-muted-foreground text-xs">
              {option.count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export { SegmentedControl };
export type { SegmentedOption };
