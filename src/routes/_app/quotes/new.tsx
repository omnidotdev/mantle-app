import { useQueryClient } from "@tanstack/react-query";
import {
  Link,
  createFileRoute,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { Loader2, Printer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import ContractPreview from "@/features/quotes/components/ContractPreview";
import QuoteForm from "@/features/quotes/components/QuoteForm";
import QuotePreview from "@/features/quotes/components/QuotePreview";
import { DEFAULT_QUOTE_TERMS } from "@/features/quotes/types/quote";
import {
  useCreateQuoteLineItemMutation,
  useCreateQuoteMutation,
  useGenerateDocumentNumberMutation,
} from "@/generated/graphql";

import type { Quote, QuoteLineItem } from "@/features/quotes/types/quote";

type PreviewType = "quote" | "contract";

const defaultQuote: Partial<Quote> = {
  quoteNumber: "",
  companyId: null,
  contactId: null,
  title: "",
  description: null,
  status: "draft",
  validUntil: "",
  terms: DEFAULT_QUOTE_TERMS,
  notes: null,
  subtotal: "0",
  taxRate: null,
  taxAmount: "0",
  total: "0",
  currency: "USD",
  convertedInvoiceId: null,
  projectType: null,
  timeRange: null,
  additionalTerms: null,
  additionalItemsLabel: null,
  clientName: null,
  clientEmail: null,
};

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

const NewQuotePage = () => {
  const { organizationId } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const locationState = useLocation().state as
    | {
        duplicateFrom?: {
          quote: Partial<Quote>;
          lineItems: Partial<QuoteLineItem>[];
        };
      }
    | undefined;
  const duplicateFrom = locationState?.duplicateFrom;

  const [saving, setSaving] = useState(false);
  const [generatingNumber, setGeneratingNumber] = useState(false);
  const [previewType, setPreviewType] = useState<PreviewType>("quote");

  const [currentQuote, setCurrentQuote] = useState<Partial<Quote>>({
    ...defaultQuote,
    ...(duplicateFrom?.quote ?? {}),
    status: "draft",
    convertedInvoiceId: null,
  });
  const [currentLineItems, setCurrentLineItems] = useState<
    Partial<QuoteLineItem>[]
  >(
    duplicateFrom?.lineItems?.length
      ? duplicateFrom.lineItems.map((li) => ({
          ...li,
          id: crypto.randomUUID(),
        }))
      : [{ ...defaultLineItem, id: crypto.randomUUID() }],
  );

  const generateNumber = useGenerateDocumentNumberMutation();
  const hasGenerated = useRef(false);

  useEffect(() => {
    if (organizationId && !hasGenerated.current) {
      hasGenerated.current = true;
      setGeneratingNumber(true);
      generateNumber
        .mutateAsync({
          input: { organizationId, documentType: "quote" },
        })
        .then((result) => {
          const num = result.generateDocumentNumber?.documentNumber;
          if (num) {
            setCurrentQuote((prev) => ({ ...prev, quoteNumber: num }));
          }
        })
        .finally(() => setGeneratingNumber(false));
    }
  }, [organizationId, generateNumber]);

  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerateNumber = async (strategy: "sequential" | "random") => {
    if (!organizationId) return;
    setRegenerating(true);
    try {
      const result = await generateNumber.mutateAsync({
        input: { organizationId, documentType: "quote", idStrategy: strategy },
      });
      const num = result.generateDocumentNumber?.documentNumber;
      if (num) {
        setCurrentQuote((prev) => ({ ...prev, quoteNumber: num }));
      }
    } finally {
      setRegenerating(false);
    }
  };

  const invalidateQuotes = () => {
    queryClient.invalidateQueries({
      queryKey: ["AllQuotes"],
    });
  };

  const createMutation = useCreateQuoteMutation();
  const createLineItemMutation = useCreateQuoteLineItemMutation();

  const saveLineItems = async (quoteId: string) => {
    const validItems = currentLineItems.filter((item) =>
      item.description?.trim(),
    );

    await Promise.all(
      validItems.map((item, index) =>
        createLineItemMutation.mutateAsync({
          input: {
            quoteLineItem: {
              quoteId,
              description: item.description ?? "",
              subtitle: item.subtitle ?? null,
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
              minimumBillingMinutes: item.minimumBillingMinutes
                ? Number(item.minimumBillingMinutes)
                : null,
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await createMutation.mutateAsync({
        input: {
          quote: {
            organizationId: organizationId ?? "",
            quoteNumber: currentQuote.quoteNumber ?? "",
            companyId: currentQuote.companyId || undefined,
            contactId: currentQuote.contactId || null,
            clientName: currentQuote.clientName,
            clientEmail: currentQuote.clientEmail,
            title: currentQuote.title ?? "",
            description: currentQuote.description,
            status: currentQuote.status ?? "draft",
            validUntil: new Date(
              currentQuote.validUntil || new Date().toISOString().split("T")[0],
            ),
            terms: currentQuote.terms,
            notes: currentQuote.notes,
            subtotal: currentQuote.subtotal,
            taxRate: currentQuote.taxRate,
            taxAmount: currentQuote.taxAmount,
            total: currentQuote.total,
            currency: currentQuote.currency ?? "USD",
            projectType: currentQuote.projectType,
            timeRange: currentQuote.timeRange,
            additionalTerms: currentQuote.additionalTerms,
            additionalItemsLabel: currentQuote.additionalItemsLabel,
          },
        },
      });

      const newId = result.createQuote?.quote?.rowId;
      if (newId) {
        await saveLineItems(newId);
      }

      invalidateQuotes();
      toast.success("Quote saved");

      if (newId) {
        navigate({
          to: "/quotes/$quoteId/edit",
          params: { quoteId: newId },
        });
      }
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
          Select an organization to create quotes
        </p>
      </div>
    );
  }

  if (generatingNumber) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2
          className="h-8 w-8 animate-spin text-muted-foreground"
          aria-label="Loading"
        />
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
            {saving ? "Saving..." : "Create Quote"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2 print:block">
        <div className="rounded-lg border border-border bg-card p-6 print:hidden">
          <h2 className="mb-4 font-semibold text-lg">
            {duplicateFrom ? "Duplicate Quote" : "New Quote"}
          </h2>
          <QuoteForm
            quote={currentQuote}
            onQuoteChange={setCurrentQuote}
            lineItems={currentLineItems}
            onLineItemsChange={setCurrentLineItems}
            onSave={handleSave}
            onCancel={() => navigate({ to: "/quotes" })}
            organizationId={organizationId}
            onRegenerateNumber={handleRegenerateNumber}
            isRegenerating={regenerating}
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

export const Route = createFileRoute("/_app/quotes/new")({
  component: NewQuotePage,
});
