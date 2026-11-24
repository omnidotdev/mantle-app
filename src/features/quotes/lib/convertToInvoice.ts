import type {
  Quote,
  QuoteLineItem,
  QuoteStatus,
} from "@/features/quotes/types/quote";

/** Quote statuses that can be turned into an invoice */
const CONVERTIBLE_QUOTE_STATUSES: readonly QuoteStatus[] = ["sent", "accepted"];

/** Status a quote returns to when its invoice is deleted */
const RELEASED_QUOTE_STATUS: QuoteStatus = "accepted";

/** Line item fields carried onto the invoice (the invoice id is added on save) */
interface InvoiceLineDraft {
  description: string;
  quantity: string;
  unitPrice: string;
  amount: string;
  productId: string | null;
  sortOrder: number;
}

/** Invoice fields seeded from the quote */
interface InvoiceDraft {
  companyId: string | null;
  contactId: string | null;
  billTo: string | null;
  notes: string | null;
  currency: string;
  taxRate: string | null;
  subtotal: string;
  taxAmount: string;
  total: string;
}

interface QuoteConversion {
  invoice: InvoiceDraft;
  lineItems: InvoiceLineDraft[];
  /** Quote lines left off the invoice (royalty terms with no fixed amount) */
  skipped: Pick<QuoteLineItem, "id" | "description" | "pricingType">[];
}

type ConvertibleQuote = Pick<
  Quote,
  | "companyId"
  | "contactId"
  | "clientName"
  | "clientEmail"
  | "notes"
  | "currency"
  | "taxRate"
> & {
  company?: { name: string } | null;
  contact?: { firstName: string; lastName: string } | null;
};

type ConvertibleLine = Pick<
  QuoteLineItem,
  | "id"
  | "description"
  | "quantity"
  | "unitPrice"
  | "amount"
  | "pricingType"
  | "hourlyRate"
  | "estimatedHours"
  | "productId"
>;

/** Parse a numeric string, treating blanks and garbage as 0 */
const toNumber = (value: string | null | undefined): number => {
  const parsed = Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) ? parsed : 0;
};

/** Round to whole cents and render as a plain decimal string */
const toMoney = (value: number): string =>
  (Math.round(value * 100) / 100).toFixed(2);

/**
 * Render a quantity to the 2 decimal places the API stores, without trailing
 * zeros (e.g. 12.5, not 12.500000001)
 */
const toQuantity = (value: number): string =>
  String(Math.round(value * 100) / 100);

/**
 * Whether a quote can be turned into an invoice: it was sent or accepted and
 * is not already linked to an invoice
 */
const canConvertQuote = (
  quote: Pick<Quote, "status" | "convertedInvoiceId">,
): boolean =>
  !quote.convertedInvoiceId &&
  CONVERTIBLE_QUOTE_STATUSES.includes(quote.status);

/**
 * Map one quote line onto an invoice line, or null when it has nothing to bill
 * up front. Invoice lines are plain quantity times unit price (the API
 * recomputes amounts that way), so each pricing type is flattened:
 * - fixed: quantity and unit price as quoted
 * - hourly: estimated hours at the hourly rate (0 hours when there is no
 *   estimate, ready to fill in with tracked time)
 * - complimentary and included: listed at no charge so the client sees them
 * - royalty: a share of future revenue, so it is skipped unless the quote gave
 *   it a fixed amount
 */
const toInvoiceLine = (
  item: ConvertibleLine,
): Omit<InvoiceLineDraft, "sortOrder"> | null => {
  const description = item.description.trim();
  if (!description) return null;

  const productId = item.productId ?? null;
  const quantity = toNumber(item.quantity) || 1;
  const unitPrice = toNumber(item.unitPrice);

  const line = (
    label: string,
    qty: number,
    price: number,
  ): Omit<InvoiceLineDraft, "sortOrder"> => ({
    description: label,
    quantity: toQuantity(qty),
    unitPrice: toMoney(price),
    amount: toMoney(qty * price),
    productId,
  });

  switch (item.pricingType) {
    case "hourly": {
      const rate = toNumber(item.hourlyRate);
      if (rate <= 0) return line(description, quantity, unitPrice);
      return line(
        `${description} (hourly)`,
        Math.max(toNumber(item.estimatedHours), 0),
        rate,
      );
    }
    case "royalty":
      return toNumber(item.amount) > 0
        ? line(description, quantity, unitPrice)
        : null;
    case "complimentary":
      return line(`${description} (complimentary)`, quantity, 0);
    case "included":
      return line(`${description} (included)`, quantity, 0);
    default:
      return line(description, quantity, unitPrice);
  }
};

/** Recipient block for the invoice, matching the invoice form's client picker */
const toBillTo = (quote: ConvertibleQuote): string | null => {
  const contactName = [quote.contact?.firstName, quote.contact?.lastName]
    .filter(Boolean)
    .join(" ");
  const lines = [
    contactName,
    quote.company?.name || quote.clientName,
    quote.clientEmail,
  ].filter((line): line is string => !!line?.trim());

  return lines.length ? lines.join("\n") : null;
};

/**
 * Build a draft invoice from a quote: same client, currency, tax rate, and
 * notes, with each quote line flattened onto a billable invoice line
 */
const quoteToInvoiceDraft = (
  quote: ConvertibleQuote,
  lineItems: ConvertibleLine[],
): QuoteConversion => {
  const mapped: InvoiceLineDraft[] = [];
  const skipped: QuoteConversion["skipped"] = [];

  for (const item of lineItems) {
    const line = toInvoiceLine(item);
    if (line) {
      mapped.push({ ...line, sortOrder: mapped.length });
    } else if (item.description.trim()) {
      skipped.push({
        id: item.id,
        description: item.description,
        pricingType: item.pricingType,
      });
    }
  }

  const subtotal = mapped.reduce((sum, li) => sum + toNumber(li.amount), 0);
  const taxRate = toNumber(quote.taxRate);
  const taxAmount = (subtotal * taxRate) / 100;

  return {
    invoice: {
      companyId: quote.companyId || null,
      contactId: quote.contactId || null,
      billTo: toBillTo(quote),
      notes: quote.notes?.trim() ? quote.notes : null,
      currency: quote.currency || "USD",
      taxRate: quote.taxRate?.trim() ? quote.taxRate : null,
      subtotal: toMoney(subtotal),
      taxAmount: toMoney(taxAmount),
      total: toMoney(subtotal + taxAmount),
    },
    lineItems: mapped,
    skipped,
  };
};

/** The quote an invoice was created from, if any */
const findSourceQuote = <T extends { convertedInvoiceId?: string | null }>(
  quotes: T[],
  invoiceId: string,
): T | undefined => quotes.find((q) => q.convertedInvoiceId === invoiceId);

export {
  RELEASED_QUOTE_STATUS,
  canConvertQuote,
  findSourceQuote,
  quoteToInvoiceDraft,
};
