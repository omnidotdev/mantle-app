import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Printer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import ContractPreview from "@/features/quotes/components/ContractPreview";
import QuoteForm from "@/features/quotes/components/QuoteForm";
import QuotePreview from "@/features/quotes/components/QuotePreview";
import {
  useAllQuotesQuery,
  useCreateQuoteLineItemMutation,
  useDeleteQuoteLineItemMutation,
  useUpdateQuoteMutation,
} from "@/generated/graphql";

import type { Quote, QuoteLineItem } from "@/features/quotes/types/quote";

type PreviewType = "quote" | "contract";

const defaultLineItem: Omit<Partial<QuoteLineItem>, "id"> = {
  description: "",
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
  royaltyTimeframe: null,
  royaltyTimeframeUnit: null,
  royaltyThreshold: null,
  royaltyBuyoutAmount: null,
  sortOrder: 0,
};

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

const EditQuotePage = () => {
  const { organizationId } = Route.useRouteContext();
  const { quoteId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [saving, setSaving] = useState(false);
  const [previewType, setPreviewType] = useState<PreviewType>("quote");
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
          ? quote.quoteLineItems
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

  const saveLineItems = async (id: string) => {
    const validItems = currentLineItems.filter((item) =>
      item.description?.trim(),
    );

    await Promise.all(
      validItems.map((item, index) =>
        createLineItemMutation.mutateAsync({
          input: {
            quoteLineItem: {
              quoteId: id,
              description: item.description ?? "",
              quantity: item.quantity ?? "1",
              unitPrice: item.unitPrice ?? "0",
              amount: item.amount ?? "0",
              pricingType: item.pricingType ?? "fixed",
              estimatedHours: item.estimatedHours ?? null,
              royaltyPercentage: item.royaltyPercentage ?? null,
              hourlyRate: item.hourlyRate ?? null,
              weeklyCapHours: item.weeklyCapHours
                ? Number(item.weeklyCapHours)
                : null,
              monthlyCapHours: item.monthlyCapHours
                ? Number(item.monthlyCapHours)
                : null,
              maxCapHours: item.maxCapHours ? Number(item.maxCapHours) : null,
              royaltyTimeframe: item.royaltyTimeframe
                ? Number(item.royaltyTimeframe)
                : null,
              royaltyTimeframeUnit: item.royaltyTimeframeUnit ?? null,
              royaltyThreshold: item.royaltyThreshold ?? null,
              royaltyBuyoutAmount: item.royaltyBuyoutAmount ?? null,
              sortOrder: index,
            },
          },
        }),
      ),
    );
  };

  const deleteExistingLineItems = async () => {
    const existing = quotes.find((q) => q.id === quoteId);
    if (!existing?.quoteLineItems.length) return;

    await Promise.all(
      existing.quoteLineItems.map((item) =>
        deleteLineItemMutation.mutateAsync({
          input: { rowId: item.id },
        }),
      ),
    );
  };

  const handleSave = async () => {
    if (!currentQuote.companyId) {
      toast.error("Please select a company");
      return;
    }

    setSaving(true);
    try {
      await updateMutation.mutateAsync({
        input: {
          rowId: quoteId,
          patch: {
            quoteNumber: currentQuote.quoteNumber,
            companyId: currentQuote.companyId,
            contactId: currentQuote.contactId || null,
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
          },
        },
      });
      await deleteExistingLineItems();
      await saveLineItems(quoteId);

      invalidateQuotes();
      toast.success("Quote saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save quote");
    } finally {
      setSaving(false);
    }
  };

  const renderPreview = () => {
    if (previewType === "contract") {
      return (
        <ContractPreview
          quote={currentQuote}
          lineItems={currentLineItems}
          organizationId={organizationId}
        />
      );
    }
    return (
      <QuotePreview
        quote={currentQuote}
        lineItems={currentLineItems}
        organizationId={organizationId}
      />
    );
  };

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          Select an organization to edit quotes
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

  return (
    <div className="p-6 print:p-0">
      <div className="print-hide mb-6 flex items-center justify-between">
        <Link
          to="/quotes"
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          &larr; Back to list
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              const originalTitle = document.title;
              const prefix = previewType === "contract" ? "contract" : "quote";
              document.title = `${prefix}_${currentQuote.quoteNumber}`;
              window.print();
              document.title = originalTitle;
            }}
            className="flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
          >
            <Printer size={14} />
            Print
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2 print:block">
        <div className="rounded-lg border border-border bg-card p-6 print:hidden">
          <h2 className="mb-4 font-semibold text-lg">Edit Quote</h2>
          <QuoteForm
            quote={currentQuote}
            onQuoteChange={setCurrentQuote}
            lineItems={currentLineItems}
            onLineItemsChange={setCurrentLineItems}
            onSave={handleSave}
            onCancel={() => navigate({ to: "/quotes" })}
            organizationId={organizationId}
          />
        </div>

        <div>
          <div className="flex items-center justify-between print:hidden">
            <h2 className="mb-4 font-semibold text-lg">Preview</h2>
            <PreviewToggle value={previewType} onChange={setPreviewType} />
          </div>
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_app/quotes/$quoteId/edit")({
  component: EditQuotePage,
});
