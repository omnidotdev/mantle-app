import type { QuoteLineItemInput } from "@/generated/graphql";
import type { QuoteLineItem } from "../types/quote";

/**
 * Coerce an optional numeric-string field: a blank value becomes null so it is
 * never sent as "" to a numeric column (which the database rejects)
 */
const optionalNumeric = (value: string | null | undefined): string | null =>
  value?.trim() ? value.trim() : null;

/** Coerce a required numeric-string field, falling back when the value is blank */
const requiredNumeric = (
  value: string | null | undefined,
  fallback: string,
): string => (value?.trim() ? value.trim() : fallback);

/** Coerce an optional integer field from a numeric string, blank becomes null */
const optionalInteger = (
  value: string | number | null | undefined,
): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Build the GraphQL input for a quote line item, coercing blank numeric inputs
 * to safe values. Without this, an emptied numeric field is sent as "" and the
 * create mutation fails, which previously dropped the item on save.
 */
const buildQuoteLineItemInput = (
  item: Partial<QuoteLineItem>,
  index: number,
  quoteId: string,
): QuoteLineItemInput => ({
  quoteId,
  description: item.description?.trim() ?? "",
  subtitle: item.subtitle ?? null,
  quantity: requiredNumeric(item.quantity, "1"),
  unitPrice: requiredNumeric(item.unitPrice, "0"),
  amount: requiredNumeric(item.amount, "0"),
  pricingType: item.pricingType ?? "fixed",
  estimatedHours: optionalNumeric(item.estimatedHours),
  royaltyPercentage: optionalNumeric(item.royaltyPercentage),
  hourlyRate: optionalNumeric(item.hourlyRate),
  weeklyCapHours: optionalInteger(item.weeklyCapHours),
  monthlyCapHours: optionalInteger(item.monthlyCapHours),
  maxCapHours: optionalInteger(item.maxCapHours),
  minimumBillingMinutes: optionalInteger(item.minimumBillingMinutes),
  royaltyTimeframe: optionalInteger(item.royaltyTimeframe),
  royaltyTimeframeUnit: item.royaltyTimeframeUnit ?? null,
  royaltyThreshold: optionalNumeric(item.royaltyThreshold),
  royaltyBuyoutAmount: optionalNumeric(item.royaltyBuyoutAmount),
  sortOrder: index,
});

/**
 * Return a copy of the line items ordered by sortOrder. The GraphQL connection
 * cannot order by sort_order (no index, so no orderBy enum value), so ordering
 * is applied on read here; the sort is stable, preserving insertion order on ties
 */
const sortLineItemsByOrder = <T extends { sortOrder?: number | null }>(
  items: T[],
): T[] => [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

export { buildQuoteLineItemInput, sortLineItemsByOrder };
