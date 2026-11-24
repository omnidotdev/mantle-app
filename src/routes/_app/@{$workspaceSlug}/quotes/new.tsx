import { useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { FileTextIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import EmptyState from "@/components/core/EmptyState";
import LoadingState from "@/components/core/LoadingState";
import PageContainer from "@/components/core/PageContainer";
import QuoteEditorLayout from "@/features/quotes/components/QuoteEditorLayout";
import { buildQuoteLineItemInput } from "@/features/quotes/lib/lineItems";
import { DEFAULT_QUOTE_TERMS } from "@/features/quotes/types/quote";
import {
  useCreateQuoteLineItemMutation,
  useCreateQuoteMutation,
  useGenerateDocumentNumberMutation,
} from "@/generated/graphql";

import type { Quote, QuoteLineItem } from "@/features/quotes/types/quote";

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

const NewQuotePage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug } = Route.useParams();
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
            quoteLineItem: buildQuoteLineItemInput(item, index, quoteId),
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
          to: "/@{$workspaceSlug}/quotes/$quoteId/edit",
          params: { workspaceSlug, quoteId: newId },
        });
      }
    } catch (err) {
      console.error("Failed to create quote", err);
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
          description="Select a workspace from the sidebar to create quotes."
        />
      </PageContainer>
    );
  }

  if (generatingNumber) {
    return (
      <PageContainer>
        <LoadingState label="Preparing quote" />
      </PageContainer>
    );
  }

  return (
    <QuoteEditorLayout
      title={duplicateFrom ? "Duplicate quote" : "New quote"}
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
      autoNumberOnClientSelect
    />
  );
};

export const Route = createFileRoute("/_app/@{$workspaceSlug}/quotes/new")({
  component: NewQuotePage,
  staticData: { title: "New quote" },
});
