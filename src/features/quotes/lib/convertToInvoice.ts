import type { Quote, QuoteStatus } from "@/features/quotes/types/quote";

/**
 * Quote statuses that can be turned into an invoice. The API makes the
 * invoice (convertQuoteToInvoice) and enforces the same rule; this only
 * decides whether to offer it
 */
const CONVERTIBLE_QUOTE_STATUSES: readonly QuoteStatus[] = ["sent", "accepted"];

/**
 * Whether a quote can be turned into an invoice: it was sent or accepted and
 * is not already linked to an invoice
 */
const canConvertQuote = (
  quote: Pick<Quote, "status" | "convertedInvoiceId">,
): boolean =>
  !quote.convertedInvoiceId &&
  CONVERTIBLE_QUOTE_STATUSES.includes(quote.status);

/** The quote an invoice was created from, if any */
const findSourceQuote = <T extends { convertedInvoiceId?: string | null }>(
  quotes: T[],
  invoiceId: string,
): T | undefined => quotes.find((q) => q.convertedInvoiceId === invoiceId);

export { canConvertQuote, findSourceQuote };
