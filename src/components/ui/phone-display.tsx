import * as Flags from "country-flag-icons/react/3x2";

import { formatPhone, getPhoneCountry } from "@/lib/phone";
import { cn } from "@/lib/utils";

type FlagKey = keyof typeof Flags;

interface PhoneDisplayProps {
  value: string | null | undefined;
  className?: string;
}

/**
 * Read-only phone number with a country flag. Stored values are E.164, so the
 * country resolves without a region hint; unparseable values render as-is.
 */
const PhoneDisplay = ({ value, className }: PhoneDisplayProps) => {
  if (!value) return <>—</>;

  const country = getPhoneCountry(value);
  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: the flag is chosen at runtime by country code; the full set is intentionally bundled
  const Flag = country ? (Flags[country as FlagKey] as typeof Flags.US) : null;

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {Flag ? (
        <Flag
          title={country ?? undefined}
          className="h-3 w-[18px] shrink-0 rounded-[2px] ring-1 ring-black/10"
        />
      ) : null}
      <span>{formatPhone(value)}</span>
    </span>
  );
};

export { PhoneDisplay };
