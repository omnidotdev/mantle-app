import { useMemo } from "react";

import {
  DEFAULT_ACCENT,
  getAccentVariants,
} from "@/features/invoices/types/accentColor";
import { formatCurrency } from "@/features/invoices/types/invoice";
import { resolveDocumentLogo } from "@/features/settings/documentBranding";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useAllCompaniesQuery, useAllPeopleQuery } from "@/generated/graphql";
import { applyTermTokens } from "../types/quote";

import type { Quote, QuoteLineItem } from "../types/quote";

interface QuotePreviewProps {
  quote: Partial<Quote>;
  lineItems: Partial<QuoteLineItem>[];
  organizationId?: string;
}

const pricingLabels: Record<string, string> = {
  fixed: "Fixed Price",
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

const QuotePreview = ({
  quote,
  lineItems,
  organizationId,
}: QuotePreviewProps) => {
  const { getProfileForOrg } = useSettingsStore();
  const orgProfile = organizationId
    ? getProfileForOrg(organizationId)
    : undefined;
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
      priceDisplay = "FREE";
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

    const badgeClass = isComplimentary
      ? "inline-block rounded-full border border-emerald-300 bg-emerald-50 px-3 py-0.5 font-medium text-emerald-700 text-xs"
      : isIncluded
        ? "inline-block rounded-full border border-border bg-muted px-3 py-0.5 font-medium text-muted-foreground text-xs"
        : "inline-block rounded-full border px-3 py-0.5 font-medium text-xs";

    return (
      <div
        key={item.id}
        className="rounded-lg border border-border bg-card p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="font-medium text-foreground text-lg">
              {item.description}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className={badgeClass} style={badgeStyle}>
              {pricingLabels[item.pricingType || "fixed"]}
            </span>
            {priceDisplay && (
              <span className="font-semibold text-foreground text-xl">
                {priceDisplay}
              </span>
            )}
          </div>
        </div>
        {item.subtitle && (
          <p className="mt-2 text-muted-foreground text-sm italic">
            {item.subtitle}
          </p>
        )}
        {autoSubDescription && (
          <p className="mt-1 text-muted-foreground text-sm">
            {autoSubDescription}
          </p>
        )}
        {item.deliverables && item.deliverables.length > 0 && (
          <details className="group mt-2">
            <summary className="cursor-pointer text-muted-foreground text-xs hover:text-foreground">
              Deliverables ({item.deliverables.length})
            </summary>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted-foreground text-xs">
              {item.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </details>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-lg border border-border bg-white shadow-sm print:min-h-screen print:border-0 print:shadow-none">
      {/* Header banner */}
      <div
        className="flex items-center justify-between rounded-t-lg px-8 py-6 text-white print:rounded-none"
        style={{
          background: `linear-gradient(to right, ${accent.gradientFrom}, ${accent.gradientTo})`,
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm">
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="font-bold text-white text-xl leading-tight">
            {quote.title || "Quote"}
          </h1>
        </div>
        <div className="text-right text-sm">
          <p>Date prepared: {displayDate}</p>
          <p>Quote ID: {quote.quoteNumber || "—"}</p>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Prepared By / Prepared For */}
        <div className="grid grid-cols-2 gap-12">
          <div>
            <p className="mb-1 text-muted-foreground text-sm">Prepared By</p>
            <p className="font-semibold text-foreground">
              {orgProfile?.contactName || "—"}
            </p>
            <p className="text-foreground">
              {orgProfile?.companyName || "Your Company"}
            </p>
            {orgProfile?.email && (
              <p className="text-foreground text-sm">{orgProfile.email}</p>
            )}
          </div>
          <div>
            <p className="mb-1 text-muted-foreground text-sm">Prepared For</p>
            <p className="font-semibold text-foreground">
              {quote.clientName ||
                resolvedContactName ||
                "Client not specified"}
            </p>
            {resolvedCompanyName && (
              <p className="text-foreground">{resolvedCompanyName}</p>
            )}
            {quote.clientEmail && (
              <p className="text-foreground text-sm">{quote.clientEmail}</p>
            )}
            {contact && !quote.clientEmail && contact.emails?.[0] && (
              <p className="text-foreground text-sm">{contact.emails[0]}</p>
            )}
          </div>
        </div>

        <Divider color={accent.base} />

        {/* Project Overview */}
        {(quote.title || quote.description || quote.projectType) && (
          <>
            <h2 className="mb-4 font-bold text-foreground text-xl">
              Project Overview
            </h2>

            {(quote.title || quote.projectType) && (
              <div className="mb-4 grid grid-cols-2 gap-12">
                {quote.title && (
                  <div>
                    <p className="mb-1 text-muted-foreground text-sm">
                      Project Name
                    </p>
                    <p className="font-medium text-foreground text-lg">
                      {quote.title}
                    </p>
                  </div>
                )}
                {quote.projectType && (
                  <div>
                    <p className="mb-1 text-muted-foreground text-sm">
                      Project Type
                    </p>
                    <p className="font-medium text-foreground text-lg capitalize">
                      {quote.projectType}
                    </p>
                  </div>
                )}
              </div>
            )}

            {quote.description && (
              <div className="mb-4">
                <p className="mb-1 text-muted-foreground text-sm">
                  Description
                </p>
                <p className="text-foreground">{quote.description}</p>
              </div>
            )}

            {quote.timeRange && (
              <div className="mb-2">
                <p className="mb-0.5 text-muted-foreground text-sm">
                  Estimated Timeline
                </p>
                <p className="text-muted-foreground text-sm italic">
                  This is a rough estimate based on the current project scope
                  and requirements. The final time estimate may vary as the
                  project develops and requirements are refined.
                </p>
                <p className="mt-1 font-semibold text-foreground text-lg">
                  {quote.timeRange}
                </p>
              </div>
            )}

            <Divider color={accent.base} />
          </>
        )}

        {/* Cost Breakdown */}
        {validItems.length > 0 && (
          <>
            <h2 className="mb-5 font-bold text-foreground text-xl">
              Cost Breakdown
            </h2>

            <div className="space-y-4">
              {baseItem && renderLineItemCard(baseItem)}

              {additionalItems.length > 0 && (
                <>
                  <p className="mt-6 mb-3 font-medium text-muted-foreground text-sm">
                    {quote.additionalItemsLabel || "Additional Deliverables"}
                  </p>
                  {additionalItems.map((item) => renderLineItemCard(item))}
                </>
              )}
            </div>

            <Divider color={accent.base} />
          </>
        )}

        {/* Total Investment */}
        <div className="flex items-baseline justify-between">
          <h2 className="font-bold text-foreground text-xl">
            Total Investment
          </h2>
          <div className="text-right">
            <p className="font-bold text-3xl" style={{ color: accent.base }}>
              {formatCurrency(
                String(
                  taxRate > 0 ? total : fixedTotal > 0 ? fixedTotal : total,
                ),
                currency,
              )}
            </p>
            {hasHourly && (
              <p className="mt-1 text-muted-foreground text-sm">
                + hourly services
                {hourlyMaxMonthly > 0
                  ? ` (maximum ${formatCurrency(String(hourlyMaxMonthly), currency)}/mo)`
                  : ""}
              </p>
            )}
            {hasRoyalty && (
              <p className="mt-1 text-muted-foreground text-sm">
                + royalty-based services
              </p>
            )}
            {taxRate > 0 && (
              <p className="mt-1 text-muted-foreground text-sm">
                Includes {taxRate}% tax (
                {formatCurrency(String(taxAmount), currency)})
              </p>
            )}
          </div>
        </div>

        <Divider color={accent.base} />

        {/* Terms & Conditions */}
        {(quote.terms || quote.additionalTerms?.length) && (
          <>
            <h2 className="mb-3 font-bold text-foreground text-xl">
              Terms &amp; Conditions
            </h2>

            <p className="mb-4 text-foreground italic">
              This quote is not legally binding and is subject to a formal
              agreement. If the client accepts this quote, a separate contract
              governing all legally binding terms will be prepared for
              signature.
            </p>

            {quote.terms && (
              <ul className="mb-4 list-disc space-y-2 pl-5 text-foreground">
                {quote.terms.split("\n").map((rawLine) => {
                  const line = applyTermTokens(rawLine, {
                    companyName: orgProfile?.companyName,
                    timeRange: quote.timeRange,
                  }).trim();
                  if (!line) return null;
                  return (
                    <li key={line}>
                      {line.includes(":") ? (
                        <>
                          <strong>{line.split(":")[0]}:</strong>
                          {line.slice(line.indexOf(":") + 1)}
                        </>
                      ) : (
                        line
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {quote.additionalTerms && quote.additionalTerms.length > 0 && (
              <ul className="list-disc space-y-2 pl-5 text-foreground">
                {quote.additionalTerms.map((rawTerm) => {
                  const term = applyTermTokens(rawTerm, {
                    companyName: orgProfile?.companyName,
                    timeRange: quote.timeRange,
                  });
                  return (
                    <li key={term}>
                      {term.includes(":") ? (
                        <>
                          <strong>{term.split(":")[0]}:</strong>
                          {term.slice(term.indexOf(":") + 1)}
                        </>
                      ) : (
                        term
                      )}
                    </li>
                  );
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
              <h4 className="mb-2 font-bold text-foreground">Notes</h4>
              <div className="text-foreground">
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
          <p className="mb-4 text-foreground italic">
            We appreciate the opportunity to work with you and look forward to
            bringing your vision to life.
          </p>
          <div className="flex items-center justify-center gap-2">
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-6 w-6 object-contain"
            />
            <span className="font-bold text-foreground">
              {orgProfile?.companyName || "Your Company"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePreview;
