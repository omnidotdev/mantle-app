export const INVOICE_STATUSES = [
  "draft",
  "sent",
  "viewed",
  "paid",
  "overdue",
  "void",
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

/**
 * Statuses a user may set by hand. "paid" is owned by payments (an invoice is
 * paid when its payments cover the total), so it is not selectable manually
 */
export const MANUAL_INVOICE_STATUSES = INVOICE_STATUSES.filter(
  (status) => status !== "paid",
);

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

export interface Payment {
  id: string;
  invoiceId: string;
  /** Numeric string, e.g. "4500.00" */
  amount: string;
  /** Calendar date the payment landed ("YYYY-MM-DD") */
  paidAt: string;
  reference: string | null;
  method: string | null;
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
  payments?: Payment[];
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

/** Convert a calendar date ("YYYY-MM-DD") into a midnight-UTC paidAt timestamp */
export const toPaidAtTimestamp = (date: string): string | null =>
  date ? `${date}T00:00:00.000Z` : null;

/** Round a dollar amount to whole cents to avoid floating-point drift */
const toCents = (amount: number): number => Math.round(amount * 100);

/** Total of the given payment amounts, in dollars */
export const sumPayments = (payments: Pick<Payment, "amount">[]): number =>
  payments.reduce(
    (total, payment) => total + (Number.parseFloat(payment.amount) || 0),
    0,
  );

/** Outstanding balance: invoice total minus everything paid so far */
export const invoiceBalance = (
  total: string,
  payments: Pick<Payment, "amount">[],
): number => (Number.parseFloat(total) || 0) - sumPayments(payments);

/** Whether payments cover the invoice total (needs a positive total) */
export const isPaidInFull = (
  total: string,
  payments: Pick<Payment, "amount">[],
): boolean => {
  const totalCents = toCents(Number.parseFloat(total) || 0);

  return totalCents > 0 && toCents(sumPayments(payments)) >= totalCents;
};

/**
 * The date an invoice became fully settled (its latest payment date), or null
 * while a balance remains
 */
export const paidInFullDate = (
  total: string,
  payments: Pick<Payment, "amount" | "paidAt">[],
): string | null => {
  if (!isPaidInFull(total, payments)) return null;

  return payments.reduce<string | null>(
    (latest, payment) =>
      !latest || payment.paidAt > latest ? payment.paidAt : latest,
    null,
  );
};

/**
 * Derive an invoice's payment-owned fields from its payments: "paid" (with the
 * settlement date) once payments cover the total, otherwise the caller's status
 * with paidAt cleared. A stale "paid" is downgraded to "sent" when a balance
 * remains, since payments are the source of truth for being paid
 */
export const derivePaidFields = (
  total: string,
  status: InvoiceStatus,
  payments: Pick<Payment, "amount" | "paidAt">[],
): { status: InvoiceStatus; paidAt: string | null } => {
  if (isPaidInFull(total, payments)) {
    return {
      status: "paid",
      paidAt: toPaidAtTimestamp(paidInFullDate(total, payments) ?? ""),
    };
  }

  return { status: status === "paid" ? "sent" : status, paidAt: null };
};
