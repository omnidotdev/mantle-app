import { hubManageUrl, hubPlanUrl } from "@omnidotdev/providers/react";
import { Loader2Icon } from "lucide-react";

import SectionCard from "@/components/core/SectionCard";
import { buttonVariants } from "@/components/ui/button";
import { useWorkspacePlanQuery } from "@/generated/graphql";
import { ACCOUNT_URL, BASE_URL } from "@/lib/config/env.config";
import cn from "@/lib/utils";

interface WorkspacePlanCardProps {
  organizationId: string;
  workspaceSlug: string;
  /** Owners and admins can upgrade or manage the plan */
  canManage: boolean;
  /** Account hub base URL; defaults to the configured one */
  accountBaseUrl?: string;
  /** The signed-in account's subject, so the hub opens as it */
  loginHint?: string;
}

/** Limits shown as usage meters, in display order */
const METERS: { key: string; label: string }[] = [
  { key: "max_contacts", label: "Contacts" },
  { key: "max_invoices_per_month", label: "Invoices this month" },
];

const TIER_NAMES: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  team: "Team",
};

/** One usage meter: "12 of 50", or a plain count when unlimited */
const Meter = ({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) => {
  const unlimited = limit < 0;
  const ratio = unlimited || limit === 0 ? 0 : Math.min(used / limit, 1);
  const full = !unlimited && used >= limit;

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span>{label}</span>
        <span
          className={cn("tabular-nums", full && "font-medium text-destructive")}
        >
          {unlimited ? `${used} (unlimited)` : `${used} of ${limit}`}
        </span>
      </div>
      {!unlimited && (
        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={limit}
          aria-valuenow={Math.min(used, limit)}
        >
          <div
            className={cn(
              "h-full rounded-full",
              full ? "bg-destructive" : "bg-primary",
            )}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * The workspace's Mantle plan and its usage against the plan limits, with an
 * upgrade (or manage billing) link to the Omni account hub. The limits are
 * enforced by the API; this card only reports them
 */
const WorkspacePlanCard = ({
  organizationId,
  workspaceSlug,
  canManage,
  accountBaseUrl = ACCOUNT_URL,
  loginHint,
}: WorkspacePlanCardProps) => {
  const { data, isLoading, isError } = useWorkspacePlanQuery(
    { organizationId },
    { staleTime: 30_000 },
  );
  const plan = data?.workspacePlan;

  // No billing configured (self-hosted): no plan to show
  if (plan?.source === "unconfigured") return null;

  const returnUrl = `${BASE_URL}/@${workspaceSlug}/settings`;
  const isPaid = plan?.tier === "pro" || plan?.tier === "team";
  const billingLink = !canManage
    ? ""
    : isPaid
      ? hubManageUrl(accountBaseUrl, {
          product: "mantle",
          workspace: workspaceSlug,
          returnUrl,
          loginHint,
        })
      : hubPlanUrl(accountBaseUrl, {
          product: "mantle",
          plan: "pro",
          interval: "month",
          workspace: workspaceSlug,
          returnUrl,
          loginHint,
        });

  const tierName = !plan
    ? null
    : plan.source === "bypass"
      ? "Unlimited"
      : plan.source === "unavailable"
        ? null
        : (TIER_NAMES[plan.tier] ?? plan.tier);

  return (
    <SectionCard
      title="Plan"
      action={
        billingLink && plan?.source !== "bypass" ? (
          <a
            href={billingLink}
            className={buttonVariants({
              variant: isPaid ? "outline" : "solid",
              size: "sm",
            })}
          >
            {isPaid ? "Manage billing" : "Upgrade"}
          </a>
        ) : undefined
      }
    >
      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" aria-hidden />
          Loading your plan
        </div>
      ) : isError || !plan ? (
        <p className="text-sm text-muted-foreground">
          Your plan details could not be loaded right now. Nothing you have
          saved is affected.
        </p>
      ) : (
        <div className="space-y-4">
          {tierName && (
            <p className="text-sm">
              This workspace is on the{" "}
              <span className="font-semibold">{tierName}</span> plan.
            </p>
          )}

          {(plan.source === "cached" || plan.source === "unavailable") && (
            <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
              Billing is temporarily unreachable.{" "}
              {plan.source === "cached"
                ? "Your last known plan applies until it is back."
                : "Nothing is limited until it is back."}{" "}
              Your records stay available either way.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {METERS.map(({ key, label }) => {
              const limit = plan.limits.find((l) => l.key === key);
              if (!limit) return null;

              return (
                <Meter
                  key={key}
                  label={label}
                  used={limit.used ?? 0}
                  limit={limit.limit}
                />
              );
            })}
          </div>

          {!canManage && !isPaid && plan.source !== "bypass" && (
            <p className="text-xs text-muted-foreground">
              A workspace owner or admin can upgrade the plan.
            </p>
          )}

          {plan.source !== "bypass" && (
            <a
              href="/pricing"
              className="inline-block text-xs font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-300"
            >
              Compare plans
            </a>
          )}
        </div>
      )}
    </SectionCard>
  );
};

export default WorkspacePlanCard;
