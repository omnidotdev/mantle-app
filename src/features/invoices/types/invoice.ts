export const INVOICE_STATUSES = [
  "draft",
  "sent",
  "viewed",
  "paid",
  "overdue",
  "void",
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  productId: string | null;
  description: string;
  quantity: string;
  unitPrice: string;
  amount: string;
  sortOrder: number;
}

export interface Invoice {
  id: string;
  organizationId: string;
  invoiceNumber: string;
  companyId: string | null;
  contactId: string | null;
  billTo: string | null;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string | null;
  notes: string | null;
  subtotal: string;
  taxRate: string | null;
  taxAmount: string;
  total: string;
  currency: string;
  paidAt: string | null;
  paymentReference: string | null;
  paymentLinkUrl: string | null;
  createdAt: string;
  updatedAt: string;
  invoiceLineItems?: InvoiceLineItem[];
}

/** Format an ISO date string as "Month Day, Year" (e.g. "February 3, 2026") */
export const formatDate = (iso: string): string => {
  const date = new Date(`${iso}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format a numeric string as currency
 */
export const formatCurrency = (amount: string, currency = "USD"): string => {
  const num = Number.parseFloat(amount);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number.isNaN(num) ? 0 : num);
};

/** Calendar date ("YYYY-MM-DD") for a date input, derived from a paidAt timestamp */
export const paidDateInputValue = (paidAt: string | null): string =>
  paidAt ? paidAt.slice(0, 10) : "";

/** Convert a calendar date ("YYYY-MM-DD") into a midnight-UTC paidAt timestamp */
export const toPaidAtTimestamp = (date: string): string | null =>
  date ? `${date}T00:00:00.000Z` : null;

/** Format a paidAt timestamp as "Month Day, Year" (e.g. "August 31, 2026") */
export const formatPaidDate = (paidAt: string | null): string =>
  paidAt ? formatDate(paidAt.slice(0, 10)) : "";

/**
 * Enforce the paid-tracking invariant against an invoice's status: a paid
 * invoice must carry a paidAt (defaulting to now when unset), and any invoice
 * that is not paid must not carry paid-tracking fields
 */
export const normalizePaidFields = <
  T extends Pick<Invoice, "status" | "paidAt" | "paymentReference">,
>(
  invoice: T,
  now: () => string = () =>
    `${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`,
): T => {
  if (invoice.status === "paid") {
    return { ...invoice, paidAt: invoice.paidAt ?? now() };
  }

  return { ...invoice, paidAt: null, paymentReference: null };
};
