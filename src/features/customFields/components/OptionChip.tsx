import { getOptionChipClass } from "@/features/people/tagPalette";
import cn from "@/lib/utils";

interface OptionChipProps {
  label: string;
  /** The option's position in its field, which picks its color */
  index: number;
  /** Shown as an unselected choice (outlined, no color) */
  muted?: boolean;
}

/**
 * A select field's option as a pill. Its color follows its position in the
 * field, so a choice reads the same on every record and in every list
 */
const OptionChip = ({ label, index, muted }: OptionChipProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      muted
        ? "border border-border text-muted-foreground"
        : getOptionChipClass(index),
    )}
  >
    {label}
  </span>
);

export default OptionChip;
