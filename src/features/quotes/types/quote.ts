export const QUOTE_STATUSES = [
  "draft",
  "sent",
  "accepted",
  "declined",
  "expired",
  "converted",
] as const;

export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const PRICING_TYPES = ["fixed", "hourly", "royalty"] as const;

export type PricingType = (typeof PRICING_TYPES)[number];

export interface QuoteLineItem {
  id: string;
  quoteId: string;
  productId: string | null;
  description: string;
  quantity: string;
  unitPrice: string;
  amount: string;
  pricingType: PricingType;
  estimatedHours: string | null;
  royaltyPercentage: string | null;
  sortOrder: number;
}

export interface Quote {
  id: string;
  organizationId: string;
  quoteNumber: string;
  companyId: string;
  contactId: string | null;
  title: string;
  description: string | null;
  status: QuoteStatus;
  validUntil: string;
  terms: string | null;
  notes: string | null;
  subtotal: string;
  taxRate: string | null;
  taxAmount: string;
  total: string;
  currency: string;
  convertedInvoiceId: string | null;
  createdAt: string;
  updatedAt: string;
  quoteLineItems?: QuoteLineItem[];
}
