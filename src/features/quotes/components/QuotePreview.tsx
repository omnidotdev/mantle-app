import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/features/invoices/types/invoice";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useAllCompaniesQuery, useAllPeopleQuery } from "@/generated/graphql";

import type { Quote, QuoteLineItem } from "../types/quote";

interface QuotePreviewProps {
  quote: Partial<Quote>;
  lineItems: Partial<QuoteLineItem>[];
  organizationId?: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-primary-100 text-primary-700",
  accepted:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  declined: "bg-destructive/10 text-destructive",
  expired:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  converted: "bg-secondary-100 text-secondary-700",
};

const pricingColors: Record<string, string> = {
  fixed: "bg-primary-100 text-primary-700",
  hourly: "bg-primary-200 text-primary-800",
  royalty: "bg-secondary-100 text-secondary-700",
};

const pluralizeUnit = (value: string | null, unit: string | null): string => {
  if (!unit || unit === "perpetual") return "Perpetual";
  const num = Number.parseFloat(value || "0");
  const singular = unit.replace(/s$/, "");
  return `${value} ${num === 1 ? singular : unit}`;
};

const QuotePreview = ({
  quote,
  lineItems,
  organizationId,
}: QuotePreviewProps) => {
  const { getProfileForOrg } = useSettingsStore();
  const orgProfile = organizationId
    ? getProfileForOrg(organizationId)
    : undefined;

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

  const subtotal = lineItems.reduce(
    (sum, item) => sum + (Number.parseFloat(item.amount || "0") || 0),
    0,
  );
  const taxRate = Number.parseFloat(quote.taxRate || "0") || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;
  const currency = quote.currency || "USD";

  const hasHourly = lineItems.some((li) => li.pricingType === "hourly");
  const hasRoyalty = lineItems.some((li) => li.pricingType === "royalty");

  // Smart calculations
  const hourlyMaxTotal = lineItems
    .filter((li) => li.pricingType === "hourly")
    .reduce((sum, li) => {
      const rate = Number.parseFloat(li.hourlyRate || "0") || 0;
      const maxHrs =
        Number.parseFloat(li.maxCapHours || li.monthlyCapHours || "0") || 0;
      return sum + rate * maxHrs;
    }, 0);

  const royaltyBuyoutTotal = lineItems
    .filter((li) => li.pricingType === "royalty" && li.royaltyBuyoutAmount)
    .reduce(
      (sum, li) => sum + Number.parseFloat(li.royaltyBuyoutAmount || "0"),
      0,
    );

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm print:mx-auto print:min-h-screen print:w-[210mm] print:border-0 print:shadow-none">
      {/* Gradient header */}
      <div className="rounded-t-lg bg-linear-to-r from-primary-700 to-primary-500 p-6 text-white print:rounded-none">
        <div className="mb-2 flex justify-between">
          <div className="flex items-start gap-3">
            <img
              src="/omni-logo.svg"
              alt="Omni Logo"
              className="h-12 w-12 object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <div>
              <h3 className="font-bold text-white text-xl">
                {orgProfile?.companyName || "Your Company"}
              </h3>
              {orgProfile?.email && (
                <p className="text-primary-100 text-sm">{orgProfile.email}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <h1 className="font-bold text-4xl text-white">QUOTE</h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Two-column: Prepared By / Prepared For */}
        <div className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h4 className="mb-2 font-bold text-foreground">Prepared By</h4>
            <p className="text-foreground">
              {orgProfile?.companyName || "Your Company"}
            </p>
            {orgProfile?.email && (
              <p className="text-foreground text-sm">{orgProfile.email}</p>
            )}
            {orgProfile?.phone && (
              <p className="text-foreground text-sm">{orgProfile.phone}</p>
            )}
            {orgProfile?.addressLine1 && (
              <p className="text-foreground text-sm">
                {orgProfile.addressLine1}
                {orgProfile.city && `, ${orgProfile.city}`}
                {orgProfile.state && `, ${orgProfile.state}`}
                {orgProfile.postalCode && ` ${orgProfile.postalCode}`}
              </p>
            )}
          </div>
          <div>
            <h4 className="mb-2 font-bold text-foreground">Prepared For</h4>
            <p className="text-foreground">
              {quote.clientName ||
                resolvedContactName ||
                resolvedCompanyName ||
                "Client not specified"}
            </p>
            {quote.clientEmail && (
              <p className="text-foreground text-sm">{quote.clientEmail}</p>
            )}
            {resolvedCompanyName && !quote.clientName && (
              <p className="text-foreground">{resolvedCompanyName}</p>
            )}
          </div>
        </div>

        {/* Quote metadata */}
        <div className="mb-8 flex justify-end">
          <div className="w-1/3">
            <div className="mb-1 flex justify-between">
              <span className="font-bold text-foreground">Quote #:</span>
              <span className="text-foreground">
                {quote.quoteNumber || "QT-0001"}
              </span>
            </div>
            {quote.validUntil && (
              <div className="mb-1 flex justify-between">
                <span className="font-bold text-foreground">Valid Until:</span>
                <span className="text-foreground">{quote.validUntil}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-bold text-foreground">Status:</span>
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs ${statusColors[quote.status || "draft"] || statusColors.draft}`}
              >
                {quote.status || "draft"}
              </span>
            </div>
          </div>
        </div>

        {/* Project overview */}
        {(quote.title || quote.description || quote.projectType) && (
          <div className="mb-6">
            {quote.title && (
              <h3 className="mb-1 font-bold text-foreground text-lg">
                {quote.title}
              </h3>
            )}
            {quote.projectType && (
              <p className="mb-1 text-muted-foreground text-sm capitalize">
                {quote.projectType} project
                {quote.timeRange && ` \u2022 ${quote.timeRange}`}
              </p>
            )}
            {quote.description && (
              <p className="text-foreground">{quote.description}</p>
            )}
          </div>
        )}

        {/* Line items table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Pricing</th>
                <th className="px-4 py-2 text-right">Qty</th>
                <th className="px-4 py-2 text-right">Unit Price</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map(
                (item) =>
                  item.description && (
                    <tr key={item.id} className="border-border border-b">
                      <td className="px-4 py-3 text-foreground">
                        <div>{item.description}</div>
                        {item.pricingType === "hourly" && (
                          <div className="mt-1 space-y-0.5 text-muted-foreground text-xs">
                            {item.hourlyRate && (
                              <span>
                                {formatCurrency(item.hourlyRate, currency)}/hr
                              </span>
                            )}
                            {item.estimatedHours && (
                              <span> \u2022 Est: {item.estimatedHours}hrs</span>
                            )}
                            {item.weeklyCapHours && (
                              <span>
                                {" "}
                                \u2022 Weekly: {item.weeklyCapHours}hrs
                              </span>
                            )}
                            {item.monthlyCapHours && (
                              <span>
                                {" "}
                                \u2022 Monthly: {item.monthlyCapHours}hrs
                              </span>
                            )}
                            {item.maxCapHours && (
                              <span> \u2022 Max: {item.maxCapHours}hrs</span>
                            )}
                          </div>
                        )}
                        {item.pricingType === "royalty" && (
                          <div className="mt-1 space-y-0.5 text-muted-foreground text-xs">
                            {item.royaltyPercentage && (
                              <span>{item.royaltyPercentage}% royalty</span>
                            )}
                            {item.royaltyTimeframeUnit && (
                              <span>
                                {" "}
                                \u2022{" "}
                                {pluralizeUnit(
                                  item.royaltyTimeframe ?? null,
                                  item.royaltyTimeframeUnit ?? null,
                                )}
                              </span>
                            )}
                            {item.royaltyBuyoutAmount && (
                              <span>
                                {" "}
                                \u2022 Buyout:{" "}
                                {formatCurrency(
                                  item.royaltyBuyoutAmount,
                                  currency,
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`text-xs ${pricingColors[item.pricingType || "fixed"]}`}
                        >
                          {item.pricingType || "fixed"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right text-foreground">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground">
                        {formatCurrency(item.unitPrice || "0", currency)}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground">
                        {formatCurrency(item.amount || "0", currency)}
                      </td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-1/3 rounded bg-primary-100 p-3">
              <div className="mb-1 flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(String(subtotal), currency)}</span>
              </div>
              {taxRate > 0 && (
                <div className="mb-1 flex justify-between text-sm">
                  <span>Tax ({taxRate}%)</span>
                  <span>{formatCurrency(String(taxAmount), currency)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <span>TOTAL</span>
                <span>{formatCurrency(String(total), currency)}</span>
              </div>
            </div>
          </div>

          {/* Smart pricing summaries */}
          {(hourlyMaxTotal > 0 || royaltyBuyoutTotal > 0) && (
            <div className="mt-4 rounded border border-border bg-muted p-3 text-foreground text-sm">
              {hourlyMaxTotal > 0 && (
                <p>
                  \u2022 Hourly items max cost (at cap):{" "}
                  <span className="font-medium">
                    {formatCurrency(String(hourlyMaxTotal), currency)}
                  </span>
                </p>
              )}
              {royaltyBuyoutTotal > 0 && (
                <p>
                  \u2022 Royalty buyout option available:{" "}
                  <span className="font-medium">
                    {formatCurrency(String(royaltyBuyoutTotal), currency)}
                  </span>{" "}
                  (one-time)
                </p>
              )}
            </div>
          )}
        </div>

        {/* Terms */}
        {quote.terms && (
          <div className="mb-4">
            <h4 className="mb-2 font-bold text-foreground">Terms:</h4>
            <div className="text-foreground">
              {quote.terms.split("\n").map((line, i) => (
                <p key={`term-${i}`}>{line}</p>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic pricing terms */}
        {(hasHourly || hasRoyalty) && (
          <div className="mb-4">
            <h4 className="mb-2 font-bold text-foreground">
              Pricing-Specific Terms:
            </h4>
            <ul className="list-disc pl-5 text-foreground text-sm">
              {hasHourly && (
                <>
                  <li>
                    Hourly work will be tracked and reported on a weekly basis
                  </li>
                  <li>
                    Work will pause when hourly caps are reached unless
                    additional hours are authorized in writing
                  </li>
                </>
              )}
              {hasRoyalty && (
                <>
                  <li>
                    Royalty payments are due within 30 days of each reporting
                    period
                  </li>
                  <li>
                    Maintenance is included for the duration of the royalty
                    period
                  </li>
                  {royaltyBuyoutTotal > 0 && (
                    <li>
                      Client may exercise the buyout option at any time to
                      terminate royalty obligations
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>
        )}

        {/* Additional terms */}
        {quote.additionalTerms && quote.additionalTerms.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 font-bold text-foreground">
              Additional Terms:
            </h4>
            <ul className="list-disc pl-5 text-foreground">
              {quote.additionalTerms.map((term) => (
                <li key={term}>{term}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {quote.notes && (
          <div>
            <h4 className="mb-2 font-bold text-foreground">Notes:</h4>
            <div className="text-foreground">
              {quote.notes.split("\n").map((line, i) => (
                <p key={`note-${i}`}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotePreview;
