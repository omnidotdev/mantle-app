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
  dueDate: string;
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
