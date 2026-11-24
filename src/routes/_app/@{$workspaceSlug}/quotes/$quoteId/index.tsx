import { Link, createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import {
  FileTextIcon,
  PencilIcon,
  PrinterIcon,
  ReceiptIcon,
} from "lucide-react";
import { useMemo } from "react";

import BackLink from "@/components/core/BackLink";
import EmptyState from "@/components/core/EmptyState";
import LoadingState from "@/components/core/LoadingState";
import MobileActionBar from "@/components/core/MobileActionBar";
import PageContainer from "@/components/core/PageContainer";
import PageHeader from "@/components/core/PageHeader";
import StatusBadge from "@/components/core/StatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { formatDate } from "@/features/invoices/types/invoice";
import ContractPreview from "@/features/quotes/components/ContractPreview";
import QuotePreview from "@/features/quotes/components/QuotePreview";
import useConvertQuoteToInvoice from "@/features/quotes/hooks/useConvertQuoteToInvoice";
import { canConvertQuote } from "@/features/quotes/lib/convertToInvoice";
import { sortLineItemsByOrder } from "@/features/quotes/lib/lineItems";
import {
  PREVIEW_TYPE_OPTIONS,
  printQuoteDocument,
} from "@/features/quotes/lib/previewType";
import { quotePreviewSearchSchema } from "@/features/quotes/searchParams";
import { useAllQuotesQuery } from "@/generated/graphql";
import cn from "@/lib/utils";

import type { Quote, QuoteLineItem } from "@/features/quotes/types/quote";

const QuotePreviewPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug, quoteId } = Route.useParams();
  const { previewType } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { convert, converting } = useConvertQuoteToInvoice({
    organizationId: organizationId ?? "",
    workspaceSlug,
  });

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
            clientName: node.clientName ?? null,
            clientEmail: node.clientEmail ?? null,
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

  const backLink = (
    <BackLink to="/@{$workspaceSlug}/quotes" params={{ workspaceSlug }}>
      Quotes
    </BackLink>
  );

  if (!organizationId) {
    return (
      <PageContainer>
        <EmptyState
          icon={FileTextIcon}
          title="No workspace selected"
          description="Select a workspace from the sidebar to view its quotes."
        />
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState label="Loading quote" />
      </PageContainer>
    );
  }

  if (!quote) {
    return (
      <PageContainer>
        <EmptyState
          icon={FileTextIcon}
          title="Quote not found"
          description="It may have been deleted, or the link is out of date."
          action={
            <Link
              to="/@{$workspaceSlug}/quotes"
              params={{ workspaceSlug }}
              className={buttonVariants({ variant: "outline" })}
            >
              Back to quotes
            </Link>
          }
        />
      </PageContainer>
    );
  }

  const orderedLineItems = sortLineItemsByOrder(quote.quoteLineItems);
  const clientLabel = quote.company?.name || quote.clientName;
  const handlePrint = () => printQuoteDocument(previewType, quote.quoteNumber);

  const invoiceAction = (className?: string) => {
    if (quote.convertedInvoiceId) {
      return (
        <Link
          to="/@{$workspaceSlug}/invoices/$invoiceId"
          params={{ workspaceSlug, invoiceId: quote.convertedInvoiceId }}
          className={cn(buttonVariants({ variant: "outline" }), className)}
        >
          <ReceiptIcon />
          View invoice
        </Link>
      );
    }

    if (!canConvertQuote(quote)) return null;

    return (
      <Button
        variant="outline"
        className={className}
        disabled={converting}
        onClick={() => convert(quote, orderedLineItems)}
      >
        <ReceiptIcon />
        {converting ? "Creating..." : "Create invoice"}
      </Button>
    );
  };

  const editLink = (className?: string) => (
    <Link
      to="/@{$workspaceSlug}/quotes/$quoteId/edit"
      params={{ workspaceSlug, quoteId }}
      className={cn(buttonVariants({ variant: "outline" }), className)}
    >
      <PencilIcon />
      Edit
    </Link>
  );

  return (
    <PageContainer>
      <PageHeader
        back={backLink}
        title={<span className="tabular">{quote.quoteNumber}</span>}
        badge={<StatusBadge status={quote.status} />}
        description={
          <>
            {clientLabel || "No client yet"}
            {" · "}
            {quote.validUntil
              ? `valid until ${formatDate(quote.validUntil.slice(0, 10))}`
              : "no expiry"}
          </>
        }
        actions={
          <div className="hidden md:flex md:flex-wrap md:gap-2">
            {invoiceAction()}
            {editLink()}
            <Button onClick={handlePrint}>
              <PrinterIcon />
              Print or save PDF
            </Button>
          </div>
        }
      />

      <SegmentedControl
        label="Document view"
        className="mb-4 w-fit"
        options={PREVIEW_TYPE_OPTIONS}
        value={previewType}
        onValueChange={(value) => navigate({ search: { previewType: value } })}
      />

      {previewType === "contract" ? (
        <ContractPreview
          quote={quote}
          lineItems={orderedLineItems}
          organizationId={organizationId}
        />
      ) : (
        <QuotePreview
          quote={quote}
          lineItems={orderedLineItems}
          organizationId={organizationId}
        />
      )}

      <MobileActionBar>
        {invoiceAction("flex-1")}
        {editLink("flex-1")}
        <Button className="flex-1" onClick={handlePrint}>
          <PrinterIcon />
          Save PDF
        </Button>
      </MobileActionBar>
    </PageContainer>
  );
};

export const Route = createFileRoute(
  "/_app/@{$workspaceSlug}/quotes/$quoteId/",
)({
  component: QuotePreviewPage,
  validateSearch: zodValidator(quotePreviewSearchSchema),
  staticData: { title: "Quote" },
});
