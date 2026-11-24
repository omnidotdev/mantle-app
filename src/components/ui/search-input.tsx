import { SearchIcon } from "lucide-react";

import cn from "@/lib/utils";

import type { ComponentProps } from "react";

interface SearchInputProps extends Omit<ComponentProps<"input">, "type"> {
  /** Accessible name (also the placeholder when none is given) */
  label: string;
  containerClassName?: string;
}

/** Pill search field with a leading icon, used in list toolbars */
const SearchInput = ({
  label,
  placeholder,
  className,
  containerClassName,
  ...rest
}: SearchInputProps) => (
  <div className={cn("relative w-full sm:max-w-xs", containerClassName)}>
    <SearchIcon
      className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
      aria-hidden
    />
    <input
      type="search"
      aria-label={label}
      placeholder={placeholder ?? label}
      className={cn(
        "h-9 w-full rounded-full border border-input bg-card pr-4 pl-10 text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none md:text-sm",
        className,
      )}
      {...rest}
    />
  </div>
);

export { SearchInput };
