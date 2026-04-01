import { Link, createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

import ContractPreview from "@/features/quotes/components/ContractPreview";
import QuotePreview from "@/features/quotes/components/QuotePreview";
import { quotePreviewSearchSchema } from "@/features/quotes/searchParams";
import { useAllQuotesQuery } from "@/generated/graphql";

import type { Quote, QuoteLineItem } from "@/features/quotes/types/quote";

type PreviewType = "quote" | "contract";

const PreviewToggle = ({
  value,
  onChange,
}: {
  value: PreviewType;
  onChange: (v: PreviewType) => void;
}) => (
  <div className="mb-4 inline-flex rounded-lg border border-border bg-muted p-1">
    <button
      type="button"
      onClick={() => onChange("quote")}
      aria-pressed={value === "quote"}
      className={`rounded-md px-3 py-1.5 font-medium text-sm transition-colors ${
        value === "quote"
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      Quote
    </button>
    <button
      type="button"
      onClick={() => onChange("contract")}
      aria-pressed={value === "contract"}
      className={`rounded-md px-3 py-1.5 font-medium text-sm transition-colors ${
        value === "contract"
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      Contract
    </button>
  </div>
);

const QuotePreviewPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { quoteId } = Route.useParams();
  const { previewType } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data, isLoading } = useAllQuotesQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const quotes = useMemo(
    () =>
      (data?.quotes?.nodes ?? []).flatMap((node) => {
        if (!node) return [];
        return [
          {
            id: node.rowId,
            organizationId: node.organizationId,
            quoteNumber: node.quoteNumber,
            companyId: node.companyId ?? "",
            contactId: node.contactId ?? null,
            title: node.title,
            description: node.description ?? null,
            status: (node.status ?? "draft") as Quote["status"],
            validUntil: node.validUntil ?? "",
            terms: node.terms ?? null,
            notes: node.notes ?? null,
            subtotal: node.subtotal ?? "0",
            taxRate: node.taxRate ?? null,
            taxAmount: node.taxAmount ?? "0",
            total: node.total ?? "0",
            currency: node.currency ?? "USD",
            convertedInvoiceId: node.convertedInvoiceId ?? null,
            projectType: node.projectType ?? null,
            timeRange: node.timeRange ?? null,
            additionalTerms: (node.additionalTerms as string[]) ?? null,
            clientName: null,
            clientEmail: null,
            additionalItemsLabel:
              ((node as Record<string, unknown>)
                .additionalItemsLabel as string) ?? null,
            createdAt: node.createdAt ?? "",
            updatedAt: node.updatedAt ?? "",
            company: node.company ?? null,
            contact: node.contact ?? null,
            quoteLineItems: (node.quoteLineItems.nodes ?? []).flatMap((li) => {
              if (!li) return [];
              return [
                {
                  id: li.rowId,
                  quoteId: li.quoteId,
                  productId: li.productId ?? null,
                  description: li.description,
                  subtitle:
                    ((li as Record<string, unknown>).subtitle as string) ??
                    null,
                  quantity: li.quantity,
                  unitPrice: li.unitPrice,
                  amount: li.amount,
                  pricingType: (li.pricingType ??
                    "fixed") as QuoteLineItem["pricingType"],
                  estimatedHours: li.estimatedHours ?? null,
                  royaltyPercentage: li.royaltyPercentage ?? null,
                  hourlyRate: li.hourlyRate ?? null,
                  weeklyCapHours:
                    li.weeklyCapHours != null
                      ? String(li.weeklyCapHours)
                      : null,
                  monthlyCapHours:
                    li.monthlyCapHours != null
                      ? String(li.monthlyCapHours)
                      : null,
                  maxCapHours:
                    li.maxCapHours != null ? String(li.maxCapHours) : null,
                  minimumBillingMinutes:
                    li.minimumBillingMinutes != null
                      ? String(li.minimumBillingMinutes)
                      : null,
                  royaltyTimeframe:
                    li.royaltyTimeframe != null
                      ? String(li.royaltyTimeframe)
                      : null,
                  royaltyTimeframeUnit:
                    (li.royaltyTimeframeUnit as QuoteLineItem["royaltyTimeframeUnit"]) ??
                    null,
                  royaltyThreshold: li.royaltyThreshold ?? null,
                  royaltyBuyoutAmount: li.royaltyBuyoutAmount ?? null,
                  sortOrder: li.sortOrder ?? 0,
                  deliverables:
                    ((li as Record<string, unknown>)
                      .deliverables as string[]) ?? null,
                  acceptanceCriteria:
                    ((li as Record<string, unknown>)
                      .acceptanceCriteria as string[]) ?? null,
                },
              ];
            }),
          },
        ];
      }),
    [data],
  );

  const quote = useMemo(
    () => quotes.find((q) => q.id === quoteId),
    [quotes, quoteId],
  );

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          Select an organization to view quotes
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2
          className="h-8 w-8 animate-spin text-muted-foreground"
          aria-label="Loading quote"
        />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="p-6">
        <Link
          to="/quotes"
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          &larr; Back to list
        </Link>
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">Quote not found</p>
        </div>
      </div>
    );
  }

  const renderPreview = () => {
    if (previewType === "contract") {
      return (
        <ContractPreview
          quote={quote}
          lineItems={quote.quoteLineItems}
          organizationId={organizationId}
        />
      );
    }
    return (
      <QuotePreview
        quote={quote}
        lineItems={quote.quoteLineItems}
        organizationId={organizationId}
      />
    );
  };

  return (
    <div className="p-6 print:p-0">
      <div className="print-hide sticky top-0 z-10 mb-6 flex items-center justify-between bg-background py-4">
        <Link
          to="/quotes"
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          &larr; Back to list
        </Link>
        <div className="flex gap-2">
          <Link
            to="/quotes/$quoteId/edit"
            params={{ quoteId }}
            className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => {
              const originalTitle = document.title;
              const prefix = previewType === "contract" ? "contract" : "quote";
              document.title = `${prefix}_${quote.quoteNumber}`;
              window.print();
              document.title = originalTitle;
            }}
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-700"
          >
            Print
          </button>
        </div>
      </div>

      <div className="print-hide">
        <PreviewToggle
          value={previewType}
          onChange={(v) => navigate({ search: { previewType: v } })}
        />
      </div>

      {renderPreview()}
    </div>
  );
};

export const Route = createFileRoute("/_app/quotes/$quoteId/")({
  component: QuotePreviewPage,
  validateSearch: zodValidator(quotePreviewSearchSchema),
});
