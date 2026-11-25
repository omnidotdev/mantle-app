import { hubPlanUrl } from "@omnidotdev/providers/react";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { CheckIcon, ServerIcon } from "lucide-react";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  PLANS,
  formatDollars,
  perMonth,
  yearlySavingsPercent,
} from "@/features/pricing/plans";
import signIn from "@/lib/auth/signIn";
import useHubLoginHint from "@/lib/auth/useHubLoginHint";
import appConfig from "@/lib/config/app.config";
import { ACCOUNT_URL, BASE_URL } from "@/lib/config/env.config";
import createMetaTags from "@/lib/util/createMetaTags";
import cn from "@/lib/utils";

import type { BillingInterval, Plan } from "@/features/pricing/plans";

export const Route = createFileRoute("/_public/pricing")({
  head: () => ({
    meta: createMetaTags({
      title: "Pricing",
      description:
        "Mantle pricing: a free plan, Pro at $8 and Team at $20 per workspace a month, with unlimited team members on every plan. Free to self-host.",
      url: `${BASE_URL}/pricing`,
    }),
  }),
  component: PricingPage,
});

const FAQ: { question: string; answer: string }[] = [
  {
    question: "Do I pay per person?",
    answer:
      "No. Every plan is priced per workspace and includes unlimited team members, so adding a colleague never changes the bill.",
  },
  {
    question: "Is the Free plan really free?",
    answer:
      "Yes, with no time limit and no card required. It includes up to 100 contacts and 10 invoices a month, plus quotes, contracts, and inventory.",
  },
  {
    question: "What happens when I reach a limit?",
    answer:
      "Creating new contacts or invoices pauses until you upgrade (the invoice count resets each month). Nothing is hidden or deleted, and you can keep viewing and editing everything you already have.",
  },
  {
    question: "Can I host Mantle myself?",
    answer:
      "Yes. Mantle is open source under the Apache 2.0 license, and a self-hosted install has no plan limits.",
  },
  {
    question: "How do I upgrade, change, or cancel a plan?",
    answer:
      "Plans are managed in your Omni account, where a workspace owner or admin can upgrade, switch between monthly and yearly, update payment details, or cancel at any time.",
  },
];

function PricingPage() {
  const { session } = useRouteContext({ from: "__root__" });
  const [interval, setInterval] = useState<BillingInterval>("month");
  const isAuthenticated = !!session?.user?.identityProviderId;
  const loginHint = useHubLoginHint();

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-20 sm:px-6 md:pt-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl">
          Pricing
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          One price per workspace, with unlimited team members on every plan.
          Start free and upgrade when you outgrow it.
        </p>
      </div>

      <IntervalToggle interval={interval} onChange={setInterval} />

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.tier}
            plan={plan}
            interval={interval}
            isAuthenticated={isAuthenticated}
            loginHint={loginHint}
          />
        ))}
      </div>

      <SelfHostCard />

      <section className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Questions
        </h2>
        <dl className="mt-8 divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-card dark:border dark:border-border/60 dark:shadow-none">
          {FAQ.map(({ question, answer }) => (
            <div key={question} className="p-5 sm:p-6">
              <dt className="font-semibold">{question}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

/** Monthly or yearly billing, with the yearly saving */
const IntervalToggle = ({
  interval,
  onChange,
}: {
  interval: BillingInterval;
  onChange: (interval: BillingInterval) => void;
}) => (
  <div className="mt-8 flex justify-center">
    <fieldset className="inline-flex rounded-full bg-card p-1 shadow-card dark:border dark:border-border/60 dark:shadow-none">
      <legend className="sr-only">Billing interval</legend>
      {(
        [
          ["month", "Monthly"],
          ["year", "Yearly"],
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          type="button"
          aria-pressed={interval === value}
          onClick={() => onChange(value)}
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors",
            interval === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
          {value === "year" && (
            <span
              className={cn(
                "text-xs",
                interval === "year"
                  ? "text-primary-foreground/85"
                  : "text-primary-600 dark:text-primary-300",
              )}
            >
              Save {yearlySavingsPercent()}%
            </span>
          )}
        </button>
      ))}
    </fieldset>
  </div>
);

/**
 * One plan. Paid plans are bought on the Omni account hub, the one place Omni
 * plans are sold: it signs the visitor in if needed, asks which workspace the
 * plan is for, runs checkout, and returns here. The free plan just signs in
 */
const PlanCard = ({
  plan,
  interval,
  isAuthenticated,
  loginHint,
}: {
  plan: Plan;
  interval: BillingInterval;
  isAuthenticated: boolean;
  /** The signed-in account's subject, so the hub opens as it */
  loginHint?: string;
}) => {
  const isFree = plan.monthlyPrice === 0;
  const price = perMonth(plan, interval);
  const upgradeHref = isFree
    ? ""
    : hubPlanUrl(ACCOUNT_URL, {
        product: "mantle",
        plan: plan.tier,
        interval,
        returnUrl: `${BASE_URL}/pricing`,
        loginHint,
      });

  const startFree = async () => {
    if (isAuthenticated) {
      window.location.href = "/";
      return;
    }

    try {
      await signIn({ redirectUrl: BASE_URL, providerId: "omni" });
    } catch (error) {
      console.error("[PlanCard] sign-in failed:", error);
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl bg-card p-6 shadow-card dark:border dark:border-border/60 dark:shadow-none",
        plan.recommended && "ring-2 ring-primary dark:border-transparent",
      )}
    >
      {plan.recommended && (
        <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
          Recommended
        </span>
      )}

      <h2 className="text-lg font-semibold">{plan.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

      <p className="mt-5 flex items-baseline gap-1.5">
        <span className="tabular text-4xl font-bold tracking-tight">
          {formatDollars(price)}
        </span>
        <span className="text-sm text-muted-foreground">
          {isFree ? "forever" : "per workspace / month"}
        </span>
      </p>
      <p className="mt-1 h-5 text-xs text-muted-foreground">
        {!isFree &&
          (interval === "year"
            ? `${formatDollars(plan.yearlyPrice)} billed yearly`
            : `or ${formatDollars(plan.yearlyPrice / 12)} a month billed yearly`)}
      </p>

      <ul className="mt-6 flex-1 space-y-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2.5 text-sm">
            <CheckIcon
              className="mt-0.5 size-4 shrink-0 text-primary-600 dark:text-primary-300"
              aria-hidden
            />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-7">
        {isFree ? (
          <Button variant="outline" className="w-full" onClick={startFree}>
            {isAuthenticated ? "Open Mantle" : "Get started free"}
          </Button>
        ) : upgradeHref ? (
          <a
            href={upgradeHref}
            className={cn(
              buttonVariants({
                variant: plan.recommended ? "solid" : "outline",
              }),
              "w-full",
            )}
          >
            Choose {plan.name}
          </a>
        ) : null}
      </div>
    </div>
  );
};

/** The self-hosting option, which has no plan limits */
const SelfHostCard = () => (
  <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-card p-6 shadow-card sm:flex-row sm:items-center dark:border dark:border-border/60 dark:shadow-none">
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-600 dark:text-primary-300">
      <ServerIcon className="size-5" aria-hidden />
    </span>
    <div className="flex-1">
      <h2 className="font-semibold">Self-hosted</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        Run Mantle on your own server for free. It is open source under the
        Apache 2.0 license, and a self-hosted install has no plan limits.
      </p>
    </div>
    <a
      href={`${appConfig.links.docs}/self-hosting`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
    >
      Self-hosting guide
    </a>
  </div>
);
