import { useMemo } from "react";

import {
  DEFAULT_ACCENT,
  getAccentVariants,
} from "@/features/invoices/types/accentColor";
import { formatCurrency } from "@/features/invoices/types/invoice";
import DocumentBannerLogo from "@/features/settings/components/DocumentBannerLogo";
import { resolveDocumentLogo } from "@/features/settings/documentBranding";
import { useWorkspaceProfile } from "@/features/settings/hooks/useWorkspaceProfile";
import { useAllCompaniesQuery, useAllPeopleQuery } from "@/generated/graphql";
import cn from "@/lib/utils";
import { formatProjectType } from "../lib/projectType";
import { applyTermTokens } from "../types/quote";
import DocumentHint from "./DocumentHint";

import type { Quote, QuoteLineItem } from "../types/quote";

interface QuotePreviewProps {
  quote: Partial<Quote>;
  lineItems: Partial<QuoteLineItem>[];
  organizationId?: string;
}

const pricingLabels: Record<string, string> = {
  fixed: "Fixed price",
  hourly: "Hourly",
  royalty: "Royalty",
  complimentary: "Complimentary",
  included: "Included",
};

const pluralizeUnit = (value: string | null, unit: string | null): string => {
  if (!unit || unit === "perpetual") return "Perpetual";
  const num = Number.parseFloat(value || "0");
  const singular = unit.replace(/s$/, "");
  return `${value} ${num === 1 ? singular : unit}`;
};

/** Format a date as "DD Month YYYY" (e.g. "11 February 2025") */
const formatQuoteDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(
    dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`,
  );
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const Divider = ({ color }: { color: string }) => (
  <div className="my-6 border-t border-dashed" style={{ borderColor: color }} />
);

/**
 * Printable quote document. The paper surface stays light in dark mode (it
 * previews a printed page), so it uses the fixed `base-*` scale rather than
 * the themed foreground tokens
 */
const QuotePreview = ({
  quote,
  lineItems,
  organizationId,
}: QuotePreviewProps) => {
  const { profile: orgProfile } = useWorkspaceProfile(organizationId);
  const logo = resolveDocumentLogo(orgProfile);

  const accent = useMemo(
    () => getAccentVariants(orgProfile?.accentColor ?? DEFAULT_ACCENT),
    [orgProfile?.accentColor],
  );

  const { data: companiesData } = useAllCompaniesQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const { data: peopleData } = useAllPeopleQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const company = useMemo(() => {
    if (!quote.companyId) return null;
    return (
      companiesData?.companies?.nodes?.find(
        (n) => n?.rowId === quote.companyId,
      ) ?? null
    );
  }, [companiesData, quote.companyId]);

  const contact = useMemo(() => {
    if (!quote.contactId) return null;
    return (
      peopleData?.people?.nodes?.find((n) => n?.rowId === quote.contactId) ??
      null
    );
  }, [peopleData, quote.contactId]);

  const resolvedCompanyName = company?.name || "";
  const resolvedContactName = contact
    ? `${contact.firstName} ${contact.lastName}`
    : "";

  const currency = quote.currency || "USD";

  const fixedTotal = lineItems
    .filter((li) => li.pricingType === "fixed")
    .reduce(
      (sum, item) => sum + (Number.parseFloat(item.amount || "0") || 0),
      0,
    );

  const hasHourly = lineItems.some((li) => li.pricingType === "hourly");
  const hasRoyalty = lineItems.some((li) => li.pricingType === "royalty");

  const hourlyMaxMonthly = lineItems
    .filter(
      (li) => li.pricingType === "hourly" && Number(li.monthlyCapHours) > 0,
    )
    .reduce((sum, li) => {
      const rate = Number.parseFloat(li.hourlyRate || "0") || 0;
      const monthlyHrs = Number.parseFloat(li.monthlyCapHours || "0") || 0;
      return sum + rate * monthlyHrs;
    }, 0);

  const subtotal = lineItems.reduce(
    (sum, item) => sum + (Number.parseFloat(item.amount || "0") || 0),
    0,
  );
  const taxRate = Number.parseFloat(quote.taxRate || "0") || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const displayDate = formatQuoteDate(
    quote.createdAt || new Date().toISOString().split("T")[0],
  );

  // Split line items: first item is base cost, rest are additional features
  const validItems = lineItems.filter((li) => li.description?.trim());
  const baseItem = validItems[0];
  const additionalItems = validItems.slice(1);

  const renderLineItemCard = (item: Partial<QuoteLineItem>) => {
    const isHourly = item.pricingType === "hourly";
    const isRoyalty = item.pricingType === "royalty";
    const isComplimentary = item.pricingType === "complimentary";
    const isIncluded = item.pricingType === "included";

    // Determine the displayed price
    let priceDisplay: string;
    if (isComplimentary) {
      priceDisplay = "Free";
    } else if (isIncluded) {
      priceDisplay = "";
    } else if (isHourly && item.hourlyRate) {
      priceDisplay = `${formatCurrency(item.hourlyRate, currency)}/hr`;
    } else if (isRoyalty && item.royaltyPercentage) {
      priceDisplay = `${item.royaltyPercentage}%`;
    } else {
      priceDisplay = formatCurrency(item.amount || "0", currency);
    }

    // Build auto sub-description for hourly/royalty items
    let autoSubDescription: string | null = null;
    if (isHourly) {
      const parts: string[] = [];
      if (item.hourlyRate) {
        parts.push(`Rate: ${formatCurrency(item.hourlyRate, currency)}/hr`);
      }
      if (Number(item.monthlyCapHours) > 0) {
        const maxMonthly =
          (Number.parseFloat(item.hourlyRate || "0") || 0) *
          (Number.parseFloat(item.monthlyCapHours || "0") || 0);
        parts.push(
          `up to ${item.monthlyCapHours} hours per month (max ${formatCurrency(String(maxMonthly), currency)})`,
        );
      }
      if (Number(item.weeklyCapHours) > 0) {
        parts.push(`Weekly cap: ${item.weeklyCapHours}hrs`);
      }
      if (Number(item.maxCapHours) > 0) {
        parts.push(`Max: ${item.maxCapHours}hrs`);
      }
      if (item.estimatedHours) {
        parts.push(`Est: ${item.estimatedHours}hrs`);
      }
      if (Number(item.minimumBillingMinutes) > 0) {
        parts.push(`Min: ${item.minimumBillingMinutes}min`);
      }
      autoSubDescription = parts.join(" ");
    } else if (isRoyalty) {
      const parts: string[] = [];
      if (item.royaltyPercentage) {
        parts.push(`${item.royaltyPercentage}% royalty`);
      }
      if (item.royaltyTimeframeUnit) {
        parts.push(
          pluralizeUnit(
            item.royaltyTimeframe ?? null,
            item.royaltyTimeframeUnit ?? null,
          ),
        );
      }
      if (item.royaltyBuyoutAmount) {
        parts.push(
          `Buyout: ${formatCurrency(item.royaltyBuyoutAmount, currency)}`,
        );
      }
      autoSubDescription = parts.join(" \u2022 ");
    }

    // Badge style varies for complimentary/included items
    const badgeStyle =
      isComplimentary || isIncluded
        ? undefined
        : {
            borderColor: accent.light,
            backgroundColor: accent.light,
            color: accent.gradientFrom,
          };

    const badgeClass = cn(
      "inline-block whitespace-nowrap rounded-full border px-3 py-0.5 font-medium text-xs",
      isComplimentary &&
        "border-success/30 bg-success/12 text-success dark:text-base-800",
      isIncluded && "border-base-200 bg-base-50 text-base-600",
    );

    return (
      <div
        key={item.id}
        className="break-inside-avoid rounded-xl border border-base-200 bg-white p-4 sm:p-5 print:p-5"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4 print:flex-row print:items-start print:justify-between print:gap-4">
          <p className="min-w-0 flex-1 font-medium text-lg">
            {item.description}
          </p>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <span className={badgeClass} style={badgeStyle}>
              {pricingLabels[item.pricingType || "fixed"]}
            </span>
            {priceDisplay && (
              <span className="tabular font-semibold text-xl">
                {priceDisplay}
              </span>
            )}
          </div>
        </div>
        {item.subtitle && (
          <p className="mt-2 text-base-600 text-sm italic">{item.subtitle}</p>
        )}
        {autoSubDescription && (
          <p className="mt-1 text-base-600 text-sm">{autoSubDescription}</p>
        )}
        {item.deliverables && item.deliverables.length > 0 && (
          <details className="group mt-2">
            <summary className="cursor-pointer text-base-500 text-xs hover:text-base-900">
              Deliverables ({item.deliverables.length})
            </summary>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-base-600 text-xs">
              {item.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </details>
        )}
      </div>
    );
  };

  const renderTerm = (term: string) =>
    term.includes(":") ? (
      <>
        <strong>{term.split(":")[0]}:</strong>
        {term.slice(term.indexOf(":") + 1)}
      </>
    ) : (
      term
    );

  const clientDisplayName = quote.clientName || resolvedContactName;

  return (
    <div className="overflow-hidden rounded-2xl border border-base-200 bg-white text-base-900 shadow-card print:min-h-screen print:overflow-visible print:rounded-none print:border-0 print:shadow-none">
      {/* Header banner */}
      <div
        className="flex flex-col gap-4 px-4 py-6 text-base-50 sm:flex-row sm:items-center sm:justify-between sm:px-8 print:flex-row print:items-center print:justify-between print:px-8"
        style={{
          background: `linear-gradient(to right, ${accent.gradientFrom}, ${accent.gradientTo})`,
        }}
      >
        <div className="flex min-w-0 items-center gap-4">
          <DocumentBannerLogo logo={logo} size="h-10 w-10" />
          <h1 className="min-w-0 break-words font-bold text-xl leading-tight">
            {quote.title?.trim() || "Quote"}
          </h1>
        </div>
        <div className="shrink-0 text-sm sm:text-right print:text-right">
          <p>Date prepared: {displayDate}</p>
          {quote.quoteNumber ? (
            <p>
              Quote ID: <span className="tabular">{quote.quoteNumber}</span>
            </p>
          ) : (
            <p className="italic opacity-80 print:hidden">
              No quote number yet
            </p>
          )}
        </div>
      </div>

      <div className="px-4 py-8 sm:px-8 print:px-8">
        {/* Prepared by / prepared for */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-12 print:grid-cols-2 print:gap-12">
          <div>
            <p className="mb-1 text-base-500 text-sm">Prepared by</p>
            <p className="font-semibold">
              {orgProfile?.contactName || (
                <DocumentHint>Add your name in settings</DocumentHint>
              )}
            </p>
            <p>
              {orgProfile?.companyName || (
                <DocumentHint className="text-sm">
                  Add your company name in settings
                </DocumentHint>
              )}
            </p>
            {orgProfile?.email && <p className="text-sm">{orgProfile.email}</p>}
          </div>
          <div>
            <p className="mb-1 text-base-500 text-sm">Prepared for</p>
            <p className="font-semibold">
              {clientDisplayName || <DocumentHint>No client yet</DocumentHint>}
            </p>
            {resolvedCompanyName && <p>{resolvedCompanyName}</p>}
            {quote.clientEmail && (
              <p className="text-sm">{quote.clientEmail}</p>
            )}
            {contact && !quote.clientEmail && contact.emails?.[0] && (
              <p className="text-sm">{contact.emails[0]}</p>
            )}
          </div>
        </div>

        <Divider color={accent.base} />

        {/* Project overview */}
        {(quote.title || quote.description || quote.projectType) && (
          <>
            <h2 className="mb-4 font-bold text-xl">Project overview</h2>

            {(quote.title || quote.projectType) && (
              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-12 print:grid-cols-2 print:gap-12">
                {quote.title && (
                  <div>
                    <p className="mb-1 text-base-500 text-sm">Project name</p>
                    <p className="font-medium text-lg">{quote.title}</p>
                  </div>
                )}
                {quote.projectType && (
                  <div>
                    <p className="mb-1 text-base-500 text-sm">Project type</p>
                    <p className="font-medium text-lg">
                      {formatProjectType(quote.projectType)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {quote.description && (
              <div className="mb-4">
                <p className="mb-1 text-base-500 text-sm">Description</p>
                <p>{quote.description}</p>
              </div>
            )}

            {quote.timeRange && (
              <div className="mb-2">
                <p className="mb-0.5 text-base-500 text-sm">
                  Estimated timeline
                </p>
                <p className="text-base-500 text-sm italic">
                  This is a rough estimate based on the current project scope
                  and requirements. The final time estimate may vary as the
                  project develops and requirements are refined.
                </p>
                <p className="mt-1 font-semibold text-lg">{quote.timeRange}</p>
              </div>
            )}

            <Divider color={accent.base} />
          </>
        )}

        {/* Cost breakdown */}
        {validItems.length > 0 && (
          <>
            <h2 className="mb-5 font-bold text-xl">Cost breakdown</h2>

            <div className="space-y-4">
              {baseItem && renderLineItemCard(baseItem)}

              {additionalItems.length > 0 && (
                <>
                  <p className="mt-6 mb-3 font-medium text-base-500 text-sm">
                    {quote.additionalItemsLabel || "Additional deliverables"}
                  </p>
                  {additionalItems.map((item) => renderLineItemCard(item))}
                </>
              )}
            </div>

            <Divider color={accent.base} />
          </>
        )}

        {/* Total investment */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 print:flex-row print:items-baseline print:justify-between print:gap-4">
          <h2 className="font-bold text-xl">Total investment</h2>
          <div className="sm:text-right print:text-right">
            <p
              className="tabular font-bold text-3xl"
              style={{ color: accent.base }}
            >
              {formatCurrency(
                String(
                  taxRate > 0 ? total : fixedTotal > 0 ? fixedTotal : total,
                ),
                currency,
              )}
            </p>
            {hasHourly && (
              <p className="mt-1 text-base-500 text-sm">
                + hourly services
                {hourlyMaxMonthly > 0
                  ? ` (maximum ${formatCurrency(String(hourlyMaxMonthly), currency)}/mo)`
                  : ""}
              </p>
            )}
            {hasRoyalty && (
              <p className="mt-1 text-base-500 text-sm">
                + royalty-based services
              </p>
            )}
            {taxRate > 0 && (
              <p className="tabular mt-1 text-base-500 text-sm">
                Includes {taxRate}% tax (
                {formatCurrency(String(taxAmount), currency)})
              </p>
            )}
          </div>
        </div>

        <Divider color={accent.base} />

        {/* Terms and conditions */}
        {(!!quote.terms || !!quote.additionalTerms?.length) && (
          <>
            <h2 className="mb-3 font-bold text-xl">Terms and conditions</h2>

            <p className="mb-4 italic">
              This quote is not legally binding and is subject to a formal
              agreement. If the client accepts this quote, a separate contract
              governing all legally binding terms will be prepared for
              signature.
            </p>

            {quote.terms && (
              <ul className="mb-4 list-disc space-y-2 pl-5">
                {quote.terms.split("\n").map((rawLine) => {
                  const line = applyTermTokens(rawLine, {
                    companyName: orgProfile?.companyName,
                    timeRange: quote.timeRange,
                  }).trim();
                  if (!line) return null;
                  return <li key={line}>{renderTerm(line)}</li>;
                })}
              </ul>
            )}

            {quote.additionalTerms && quote.additionalTerms.length > 0 && (
              <ul className="list-disc space-y-2 pl-5">
                {quote.additionalTerms.map((rawTerm) => {
                  const term = applyTermTokens(rawTerm, {
                    companyName: orgProfile?.companyName,
                    timeRange: quote.timeRange,
                  });
                  return <li key={term}>{renderTerm(term)}</li>;
                })}
              </ul>
            )}

            <Divider color={accent.base} />
          </>
        )}

        {/* Notes */}
        {quote.notes && (
          <>
            <div className="mb-4">
              <h4 className="mb-2 font-bold">Notes</h4>
              <div>
                {quote.notes.split("\n").map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            <Divider color={accent.base} />
          </>
        )}

        {/* Footer */}
        <div className="pt-2 text-center">
          <p className="mb-4 italic">
            We appreciate the opportunity to work with you and look forward to
            bringing your vision to life.
          </p>
          <div className="flex items-center justify-center gap-2">
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-6 w-6 object-contain"
            />
            {orgProfile?.companyName ? (
              <span className="font-bold">{orgProfile.companyName}</span>
            ) : (
              <DocumentHint className="text-sm">
                Add your company name in settings
              </DocumentHint>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePreview;
