import { Portal } from "@ark-ui/react/portal";
import {
  Select,
  SelectContent,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPositioner,
  SelectTrigger,
  SelectValueText,
  createListCollection,
} from "@omnidotdev/thornberry/select";
import { ChevronDown } from "lucide-react";
import { useMemo } from "react";

export interface FieldSelectOption {
  value: string;
  label: string;
}

interface FieldSelectProps {
  value: string;
  options: FieldSelectOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  /** Id for the trigger, so a `Label` can point at it via `htmlFor` */
  id?: string;
}

/**
 * Options-driven single-choice form field built on the Thornberry select. The
 * trigger fills its container like an input, and the list matches its width
 */
const FieldSelect = ({
  value,
  options,
  onValueChange,
  placeholder,
  id,
}: FieldSelectProps) => {
  const collection = useMemo(
    () => createListCollection({ items: options }),
    [options],
  );

  return (
    <Select
      collection={collection}
      value={options.some((option) => option.value === value) ? [value] : []}
      onValueChange={(details) => {
        const next = details.value[0];

        if (next !== undefined) onValueChange(next);
      }}
      positioning={{ sameWidth: true }}
      loopFocus
      ids={id ? { trigger: id } : undefined}
    >
      <SelectControl>
        <SelectTrigger className="h-9 w-full border border-input bg-background">
          <SelectValueText placeholder={placeholder} className="min-w-0" />
          <SelectIndicator className="text-muted-foreground">
            <ChevronDown aria-hidden="true" />
          </SelectIndicator>
        </SelectTrigger>
      </SelectControl>
      <Portal>
        <SelectPositioner>
          <SelectContent className="max-h-96 w-(--reference-width) p-1">
            {options.map((option) => (
              <SelectItem key={option.value || "none"} item={option}>
                <SelectItemText>{option.label}</SelectItemText>
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectContent>
        </SelectPositioner>
      </Portal>
    </Select>
  );
};

export default FieldSelect;
