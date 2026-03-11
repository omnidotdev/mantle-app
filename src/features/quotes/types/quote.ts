export const QUOTE_STATUSES = [
  "draft",
  "sent",
  "accepted",
  "declined",
  "expired",
  "converted",
] as const;

export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const PRICING_TYPES = [
  "fixed",
  "hourly",
  "royalty",
  "complimentary",
] as const;

export type PricingType = (typeof PRICING_TYPES)[number];

export interface QuoteLineItem {
  id: string;
  quoteId: string;
  productId: string | null;
  description: string;
  subtitle: string | null;
  quantity: string;
  unitPrice: string;
  amount: string;
  pricingType: PricingType;
  estimatedHours: string | null;
  royaltyPercentage: string | null;
  sortOrder: number;
  // Hourly caps
  hourlyRate: string | null;
  weeklyCapHours: string | null;
  monthlyCapHours: string | null;
  maxCapHours: string | null;
  // Royalty details
  royaltyTimeframe: string | null;
  royaltyTimeframeUnit: "months" | "years" | "perpetual" | null;
  royaltyThreshold: string | null;
  royaltyBuyoutAmount: string | null;
}

export interface Quote {
  id: string;
  organizationId: string;
  quoteNumber: string;
  companyId: string | null;
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
  // Contract fields
  projectType: string | null;
  timeRange: string | null;
  additionalTerms: string[] | null;
  clientName: string | null;
  clientEmail: string | null;
  additionalItemsLabel: string | null;
}
