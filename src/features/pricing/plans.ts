/**
 * Mantle's plans as shown on the pricing page. These mirror the Mantle tiers in
 * omni-api's product catalog (planConfigs.ts), the source of truth for prices,
 * features, and limits: edit the catalog first, then this. Checkout itself
 * runs on the Omni account hub, which reads live prices from Aether
 */

export type PlanTier = "free" | "pro" | "team";

export type BillingInterval = "month" | "year";

export interface Plan {
  tier: PlanTier;
  name: string;
  description: string;
  /** Price in cents per month */
  monthlyPrice: number;
  /** Price in cents per year */
  yearlyPrice: number;
  features: string[];
  /** Highlighted as the plan most workspaces want */
  recommended?: boolean;
}

export const PLANS: Plan[] = [
  {
    tier: "free",
    name: "Free",
    description: "Run your front office on a budget",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "Unlimited team members",
      "Up to 100 contacts",
      "Up to 10 invoices per month",
      "Quotes, contracts, and inventory",
    ],
  },
  {
    tier: "pro",
    name: "Pro",
    description: "Unlimited business operations for small teams",
    monthlyPrice: 800,
    yearlyPrice: 7200,
    features: [
      "Everything in Free",
      "Unlimited contacts",
      "Unlimited invoices",
    ],
    recommended: true,
  },
  {
    tier: "team",
    name: "Team",
    description: "Unlimited business operations with priority support",
    monthlyPrice: 2000,
    yearlyPrice: 18000,
    features: ["Everything in Pro", "Priority support"],
  },
];

/** Whole dollars, e.g. 800 cents -> "$8" */
export const formatDollars = (cents: number): string =>
  `$${Math.round(cents / 100)}`;

/**
 * What a plan costs per month on the chosen interval: the monthly price, or
 * the yearly price spread over 12 months
 */
export const perMonth = (plan: Plan, interval: BillingInterval): number =>
  interval === "month" ? plan.monthlyPrice : plan.yearlyPrice / 12;

/** Largest yearly saving across the paid plans, as a whole percent */
export const yearlySavingsPercent = (): number =>
  Math.max(
    ...PLANS.filter((plan) => plan.monthlyPrice > 0).map((plan) =>
      Math.round((1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100),
    ),
  );
