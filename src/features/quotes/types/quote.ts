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
  minimumBillingMinutes: string | null;
  // Royalty details
  royaltyTimeframe: string | null;
  royaltyTimeframeUnit: "months" | "years" | "perpetual" | null;
  royaltyThreshold: string | null;
  royaltyBuyoutAmount: string | null;
  // Scope of work
  deliverables: string[] | null;
  acceptanceCriteria: string[] | null;
}

// TODO: AI-assisted SoW generation from line item descriptions
// TODO: SoW templates reusable across quotes
// TODO: Per-deliverable milestones/dates
// TODO: Standalone SoW export separate from full contract
export const SOW_DEFAULTS: Record<
  PricingType,
  { deliverables: string[]; acceptanceCriteria: string[] }
> = {
  fixed: {
    deliverables: ["Delivery of described work", "Source code and assets"],
    acceptanceCriteria: ["Client review and sign-off"],
  },
  hourly: {
    deliverables: ["Tracked hours for described work"],
    acceptanceCriteria: [
      "Hours tracked and reported weekly",
      "Work reviewed in regular check-ins",
    ],
  },
  royalty: {
    deliverables: ["Ongoing revenue share per agreement"],
    acceptanceCriteria: ["Royalty reports provided monthly"],
  },
  complimentary: {
    deliverables: ["Included at no charge"],
    acceptanceCriteria: ["Delivered alongside primary work"],
  },
};

export const DEFAULT_QUOTE_TERMS = [
  "Validity: This quote is valid for 30 days from the date of issue.",
  "Payment Terms: $0 upfront, per-item invoices sent as they are completed. Invoices may bundle completed items. Invoices to be paid by the client within 30 days of the invoice date. Late payments will incur a 5% late fee per month, and all work will be paused until outstanding invoices are settled. All prices are in USD and exclude any applicable taxes.",
  "Timeline: Estimated delivery within {timeRange} from project kickoff.",
  "External Provider Costs: The client is expected to pay for external platform costs, such as web hosting and domain name registration. Omni LLC will assist in the setup of these platforms.",
  "Maintenance: Includes bug fixes and security patches for 30 days post-launch. New features, enhancements, or integrations require a separate quote and agreement. A separate maintenance contract can be established for further bug fix and patch needs.",
  "Monthly Hour Caps: For hourly rate services with monthly caps, the available hours reset on the first day of each calendar month. Unused hours from the previous month do not roll over.",
  "Scope: The items outlined in this quote are strictly defined. Any additional work beyond these can be quoted separately and appended to a separate working contract.",
].join("\n");

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
