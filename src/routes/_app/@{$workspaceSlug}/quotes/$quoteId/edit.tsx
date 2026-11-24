import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { FileTextIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import EmptyState from "@/components/core/EmptyState";
import LoadingState from "@/components/core/LoadingState";
import PageContainer from "@/components/core/PageContainer";
import { buttonVariants } from "@/components/ui/button";
import QuoteEditorLayout from "@/features/quotes/components/QuoteEditorLayout";
import {
  buildQuoteLineItemInput,
  sortLineItemsByOrder,
} from "@/features/quotes/lib/lineItems";
import {
  useAllQuotesQuery,
  useCreateQuoteLineItemMutation,
  useDeleteQuoteLineItemMutation,
  useGenerateDocumentNumberMutation,
  useUpdateQuoteMutation,
} from "@/generated/graphql";

import type { Quote, QuoteLineItem } from "@/features/quotes/types/quote";

const defaultLineItem: Omit<Partial<QuoteLineItem>, "id"> = {
  description: "",
  subtitle: null,
  quantity: "1",
  unitPrice: "0",
  amount: "0",
  pricingType: "fixed",
  estimatedHours: null,
  royaltyPercentage: null,
  hourlyRate: null,
  weeklyCapHours: null,
  monthlyCapHours: null,
  maxCapHours: null,
  minimumBillingMinutes: null,
  royaltyTimeframe: null,
  royaltyTimeframeUnit: null,
  royaltyThreshold: null,
  royaltyBuyoutAmount: null,
  sortOrder: 0,
  deliverables: ["Delivery of described work", "Source code and assets"],
  acceptanceCriteria: ["Client review and sign-off"],
};

const EditQuotePage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug, quoteId } = Route.useParams();
  const queryClient = useQueryClient();

  const [saving, setSaving] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Partial<Quote>>({});
  const [currentLineItems, setCurrentLineItems] = useState<
    Partial<QuoteLineItem>[]
  >([]);
  const [initialized, setInitialized] = useState(false);

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
            companyId: node.companyId ?? null,
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

  useEffect(() => {
    if (quote && !initialized) {
      setCurrentQuote(quote);
      setCurrentLineItems(
        quote.quoteLineItems.length > 0
          ? sortLineItemsByOrder(quote.quoteLineItems)
          : [{ ...defaultLineItem, id: crypto.randomUUID() }],
      );
      setInitialized(true);
    }
  }, [quote, initialized]);

  const invalidateQuotes = () => {
    queryClient.invalidateQueries({
      queryKey: useAllQuotesQuery.getKey({
        organizationId: organizationId ?? "",
      }),
    });
  };

  const updateMutation = useUpdateQuoteMutation();
  const createLineItemMutation = useCreateQuoteLineItemMutation();
  const deleteLineItemMutation = useDeleteQuoteLineItemMutation();
  const generateNumber = useGenerateDocumentNumberMutation();
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerateNumber = async (strategy: "sequential" | "random") => {
    if (!organizationId) return;
    setRegenerating(true);
    try {
      const result = await generateNumber.mutateAsync({
        input: {
          organizationId,
          documentType: "quote",
          idStrategy: strategy,
          companyId: currentQuote.companyId ?? undefined,
        },
      });
      const num = result.generateDocumentNumber?.documentNumber;
      if (num) {
        setCurrentQuote((prev) => ({ ...prev, quoteNumber: num }));
      }
    } finally {
      setRegenerating(false);
    }
  };

  const createLineItems = async (id: string): Promise<string[]> => {
    const validItems = currentLineItems.filter((item) =>
      item.description?.trim(),
    );

    const settled = await Promise.allSettled(
      validItems.map((item, index) =>
        createLineItemMutation.mutateAsync({
          input: { quoteLineItem: buildQuoteLineItemInput(item, index, id) },
        }),
      ),
    );

    const createdIds = settled.flatMap((result) =>
      result.status === "fulfilled" &&
      result.value.createQuoteLineItem?.quoteLineItem?.rowId
        ? [result.value.createQuoteLineItem.quoteLineItem.rowId]
        : [],
    );

    const failure = settled.find((result) => result.status === "rejected");
    if (failure) {
      // Roll back the items we just created so a partial failure leaves no orphans
      await Promise.allSettled(
        createdIds.map((rowId) =>
          deleteLineItemMutation.mutateAsync({ input: { rowId } }),
        ),
      );
      throw (failure as PromiseRejectedResult).reason;
    }

    return createdIds;
  };

  const deleteLineItems = async (rowIds: string[]) => {
    await Promise.all(
      rowIds.map((rowId) =>
        deleteLineItemMutation.mutateAsync({ input: { rowId } }),
      ),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMutation.mutateAsync({
        input: {
          rowId: quoteId,
          patch: {
            quoteNumber: currentQuote.quoteNumber,
            companyId: currentQuote.companyId || undefined,
            contactId: currentQuote.contactId || null,
            clientName: currentQuote.clientName,
            clientEmail: currentQuote.clientEmail,
            title: currentQuote.title,
            description: currentQuote.description,
            status: currentQuote.status,
            validUntil: currentQuote.validUntil
              ? new Date(currentQuote.validUntil)
              : undefined,
            terms: currentQuote.terms,
            notes: currentQuote.notes,
            subtotal: currentQuote.subtotal,
            taxRate: currentQuote.taxRate,
            taxAmount: currentQuote.taxAmount,
            total: currentQuote.total,
            currency: currentQuote.currency,
            projectType: currentQuote.projectType,
            timeRange: currentQuote.timeRange,
            additionalTerms: currentQuote.additionalTerms,
            additionalItemsLabel: currentQuote.additionalItemsLabel,
          },
        },
      });
      // Read the current line items straight from the server (not the possibly
      // stale React Query cache) so a concurrent or not-yet-refetched edit can
      // never leave old rows behind as duplicates
      const fresh = await useAllQuotesQuery.fetcher({
        organizationId: organizationId ?? "",
      })();
      const existingIds = (fresh.quotes?.nodes ?? []).flatMap((node) =>
        node?.rowId === quoteId
          ? (node.quoteLineItems?.nodes ?? []).flatMap((li) =>
              li?.rowId ? [li.rowId] : [],
            )
          : [],
      );
      // Create the replacement items first, and only remove the previous ones
      // once that fully succeeds, so a failed save can never drop line items
      await createLineItems(quoteId);
      await deleteLineItems(existingIds);

      invalidateQuotes();
      toast.success("Quote saved");
    } catch (err) {
      console.error("Failed to save quote", err);
      toast.error("Could not save the quote. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!organizationId) {
    return (
      <PageContainer>
        <EmptyState
          icon={FileTextIcon}
          title="No workspace selected"
          description="Select a workspace from the sidebar to edit quotes."
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

  return (
    <QuoteEditorLayout
      title={
        <>
          Edit <span className="tabular">{quote.quoteNumber}</span>
        </>
      }
      workspaceSlug={workspaceSlug}
      organizationId={organizationId}
      onSave={handleSave}
      saving={saving}
      quote={currentQuote}
      onQuoteChange={setCurrentQuote}
      lineItems={currentLineItems}
      onLineItemsChange={setCurrentLineItems}
      onRegenerateNumber={handleRegenerateNumber}
      isRegenerating={regenerating}
    />
  );
};

export const Route = createFileRoute(
  "/_app/@{$workspaceSlug}/quotes/$quoteId/edit",
)({
  component: EditQuotePage,
  staticData: { title: "Edit quote" },
});
