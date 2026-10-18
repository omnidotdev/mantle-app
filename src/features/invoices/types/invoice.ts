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

/** Kinds of workspace credit movement, mirroring the API `credit_transaction.kind` */
export const CREDIT_TRANSACTION_KINDS = [
  "overpayment",
  "creditNote",
  "application",
  "adjustment",
  "void",
] as const;

export type CreditTransactionKind = (typeof CREDIT_TRANSACTION_KINDS)[number];

export interface CreditTransaction {
  id: string;
  organizationId: string;
  currency: string;
  /**
   * Numeric string, signed. Positive adds to the workspace balance
   * (overpayment, creditNote); `application` rows are negative, drawing the
   * balance down onto an invoice
   */
  amount: string;
  kind: CreditTransactionKind;
  invoiceId: string | null;
  paymentId: string | null;
  note: string | null;
  createdAt: string;
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

/** Signed total of credit-transaction amounts, in dollars */
export const sumCredits = (
  credits: Pick<CreditTransaction, "amount">[],
): number =>
  credits.reduce(
    (total, credit) => total + (Number.parseFloat(credit.amount) || 0),
    0,
  );

/**
 * The workspace's available credit balance for a currency: the signed sum of
 * every transaction in that currency (applications already net it down)
 */
export const creditBalance = (
  credits: Pick<CreditTransaction, "amount" | "currency">[],
  currency: string,
): number =>
  sumCredits(credits.filter((credit) => credit.currency === currency));

/**
 * Credit applied to a single invoice, in dollars as a positive amount.
 * `application` rows carry a negative amount (the balance drawn down onto the
 * invoice), so the amount applied is the negation of their sum
 */
export const appliedCredit = (
  credits: Pick<CreditTransaction, "amount" | "kind" | "invoiceId">[],
  invoiceId: string,
): number =>
  -sumCredits(
    credits.filter(
      (credit) =>
        credit.kind === "application" && credit.invoiceId === invoiceId,
    ),
  ) || 0;

/**
 * Outstanding balance: invoice total minus everything paid so far and any
 * workspace credit already applied to it
 */
export const invoiceBalance = (
  total: string,
  payments: Pick<Payment, "amount">[],
  appliedCredits = 0,
): number =>
  (Number.parseFloat(total) || 0) - sumPayments(payments) - appliedCredits;

/**
 * Whether payments plus applied workspace credit cover the invoice total (needs
 * a positive total)
 */
export const isPaidInFull = (
  total: string,
  payments: Pick<Payment, "amount">[],
  appliedCredits = 0,
): boolean => {
  const totalCents = toCents(Number.parseFloat(total) || 0);

  return (
    totalCents > 0 &&
    toCents(sumPayments(payments) + appliedCredits) >= totalCents
  );
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
  appliedCredits = 0,
): { status: InvoiceStatus; paidAt: string | null } => {
  if (isPaidInFull(total, payments, appliedCredits)) {
    // Attribute settlement to the latest payment date; credit can settle an
    // invoice that has no payment to date it to, leaving paidAt null
    const latestPayment = payments.reduce<string | null>(
      (latest, payment) =>
        !latest || payment.paidAt > latest ? payment.paidAt : latest,
      null,
    );

    return {
      status: "paid",
      paidAt: toPaidAtTimestamp(latestPayment ?? ""),
    };
  }

  return { status: status === "paid" ? "sent" : status, paidAt: null };
};
