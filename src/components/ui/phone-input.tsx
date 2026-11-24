import { Input } from "@omnidotdev/thornberry/input";
import * as Flags from "country-flag-icons/react/3x2";
import { AsYouType } from "libphonenumber-js";
import { useEffect, useRef, useState } from "react";

import { DEFAULT_REGION, getPhoneCountry, toE164 } from "@/lib/phone";
import { cn } from "@/lib/utils";

import type { CountryCode } from "libphonenumber-js";
import type { ComponentProps } from "react";

type FlagKey = keyof typeof Flags;

interface PhoneInputProps
  extends Omit<ComponentProps<typeof Input>, "value" | "onChange" | "type"> {
  /** Canonical stored value (E.164 when valid), or null. */
  value: string | null;
  /** Called with the canonical value (E.164 when valid) or null when empty. */
  onChange: (value: string | null) => void;
  /** Region used to parse numbers typed without a country code. */
  region?: CountryCode;
}

/** Format a stored value into a friendly editable string for the input. */
const toDisplay = (value: string | null, region: CountryCode): string => {
  if (!value) return "";
  // Reformat valid stored numbers as-you-type so editing continues cleanly.
  const asYouType = new AsYouType(region);
  return asYouType.input(value) || value;
};

/**
 * Phone number field with a live country flag and as-you-type formatting.
 * The parent always receives a canonical value: E.164 for valid numbers, the
 * trimmed input otherwise (so partials and notes are never discarded).
 */
const PhoneInput = ({
  value,
  onChange,
  region = DEFAULT_REGION,
  className,
  ...rest
}: PhoneInputProps) => {
  const [display, setDisplay] = useState(() => toDisplay(value, region));
  // Track the last value we emitted so external changes re-hydrate the input
  // without clobbering what the user is actively typing.
  const lastEmitted = useRef(value);

  useEffect(() => {
    if (value !== lastEmitted.current) {
      lastEmitted.current = value;
      setDisplay(toDisplay(value, region));
    }
  }, [value, region]);

  const handleChange = (raw: string) => {
    setDisplay(new AsYouType(region).input(raw));
    const canonical = toE164(raw, region);
    lastEmitted.current = canonical;
    onChange(canonical);
  };

  const country =
    getPhoneCountry(value, region) ??
    (display.trim().startsWith("+") ? undefined : region);
  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: the flag is chosen at runtime by country code; the full set is intentionally bundled
  const Flag = country ? (Flags[country as FlagKey] as typeof Flags.US) : null;

  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 items-center">
        {Flag ? (
          <Flag
            title={country ?? undefined}
            className="h-3.5 w-5 rounded-[2px] shadow-sm ring-1 ring-foreground/10"
          />
        ) : (
          // Neutral placeholder keeps the text aligned before a country resolves
          <span className="h-3.5 w-5 rounded-[2px] bg-muted" aria-hidden />
        )}
      </span>
      <Input
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={display}
        onChange={(e) => handleChange(e.target.value)}
        className={cn("pl-10", className)}
        {...rest}
      />
    </div>
  );
};

export { PhoneInput };
