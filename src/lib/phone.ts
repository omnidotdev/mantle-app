import { getCountries, parsePhoneNumberFromString } from "libphonenumber-js";

import type { CountryCode } from "libphonenumber-js";

/**
 * Region assumed when a phone number is entered without an international
 * country code and no better hint (e.g. a company's own country) is available.
 */
export const DEFAULT_REGION: CountryCode = "US";

const SUPPORTED_REGIONS = new Set<string>(getCountries());

/**
 * Best-effort map of common free-text country values to an ISO 3166-1 alpha-2
 * region. Address fields are free text, so we only need to cover the spellings
 * people actually type; anything unmatched falls back to {@link DEFAULT_REGION}.
 */
const COUNTRY_ALIASES: Record<string, CountryCode> = {
  usa: "US",
  us: "US",
  "united states": "US",
  "united states of america": "US",
  america: "US",
  uk: "GB",
  gb: "GB",
  "united kingdom": "GB",
  "great britain": "GB",
  england: "GB",
  canada: "CA",
  ca: "CA",
  australia: "AU",
  au: "AU",
  "new zealand": "NZ",
  ireland: "IE",
  germany: "DE",
  france: "FR",
  spain: "ES",
  italy: "IT",
  mexico: "MX",
  india: "IN",
  japan: "JP",
};

/**
 * Resolve a free-text country value (ISO code or country name) to a region
 * usable by the phone parser. Falls back to {@link DEFAULT_REGION}.
 */
export const resolveRegion = (country?: string | null): CountryCode => {
  if (!country) return DEFAULT_REGION;

  const trimmed = country.trim();
  const upper = trimmed.toUpperCase();
  if (upper.length === 2 && SUPPORTED_REGIONS.has(upper))
    return upper as CountryCode;

  return COUNTRY_ALIASES[trimmed.toLowerCase()] ?? DEFAULT_REGION;
};

/**
 * Parse a value into a valid phone number, or return undefined. Normalizes the
 * ITU `00` international prefix to `+` first (region defaults such as the US IDD
 * `011` would otherwise leave `0044...` unparsed).
 */
const parseValid = (value: string, region: CountryCode) => {
  const normalized = /^00\d/.test(value) ? `+${value.slice(2)}` : value;
  const parsed = parsePhoneNumberFromString(normalized, region);
  return parsed?.isValid() ? parsed : undefined;
};

/**
 * Normalize a phone number to canonical E.164 form (e.g. `+14155552671`) for
 * storage. Returns `null` for empty input. Values that cannot be parsed into a
 * valid number (extensions, notes, partials) are returned trimmed but otherwise
 * untouched, so no data is destroyed.
 */
export const toE164 = (
  input?: string | null,
  region: CountryCode = DEFAULT_REGION,
): string | null => {
  if (input == null) return null;

  const trimmed = input.trim();
  if (!trimmed) return null;

  return parseValid(trimmed, region)?.number ?? trimmed;
};

/**
 * Format a stored value for display. Valid numbers render in readable
 * international form (`+1 415 555 2671`); anything else passes through as-is.
 */
export const formatPhone = (
  value?: string | null,
  region: CountryCode = DEFAULT_REGION,
): string => {
  if (!value) return "";

  return parseValid(value.trim(), region)?.formatInternational() ?? value;
};

/**
 * Derive the ISO country of a stored number, for rendering a flag. Returns
 * `undefined` when the number is not a valid, geographically-attributable one.
 */
export const getPhoneCountry = (
  value?: string | null,
  region: CountryCode = DEFAULT_REGION,
): CountryCode | undefined => {
  if (!value) return undefined;

  return parseValid(value.trim(), region)?.country;
};
