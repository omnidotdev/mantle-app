import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Edit, Eye, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import ConfirmDialog from "@/components/ui/confirm-dialog";
import { formatCurrency } from "@/features/invoices/types/invoice";
import ContractPreview from "@/features/quotes/components/ContractPreview";
import QuoteForm from "@/features/quotes/components/QuoteForm";
import QuotePreview from "@/features/quotes/components/QuotePreview";
import { generateQuoteNumber } from "@/features/quotes/store/quoteStore";
import { QUOTE_STATUSES } from "@/features/quotes/types/quote";
import {
  useAllCompaniesQuery,
  useAllQuotesQuery,
  useCreateQuoteLineItemMutation,
  useCreateQuoteMutation,
  useDeleteQuoteLineItemMutation,
  useDeleteQuoteMutation,
  useUpdateQuoteMutation,
} from "@/generated/graphql";

import type { Quote, QuoteLineItem } from "@/features/quotes/types/quote";

type ViewMode = "list" | "create" | "edit" | "preview";
type PreviewType = "quote" | "contract";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
  expired: "bg-yellow-100 text-yellow-700",
  converted: "bg-purple-100 text-purple-700",
};

const defaultQuote: Partial<Quote> = {
  quoteNumber: "",
  companyId: "",
  contactId: null,
  title: "",
  description: null,
  status: "draft",
  validUntil: "",
  terms: null,
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
  clientName: null,
  clientEmail: null,
};

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
  <div className="mb-4 inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
    <button
      type="button"
      onClick={() => onChange("quote")}
      className={`rounded-md px-3 py-1.5 font-medium text-sm transition-colors ${
        value === "quote"
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      Quote
    </button>
    <button
      type="button"
      onClick={() => onChange("contract")}
      className={`rounded-md px-3 py-1.5 font-medium text-sm transition-colors ${
        value === "contract"
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      Contract
    </button>
  </div>
);

const QuotesPage = () => {
  const { organizationId } = Route.useRouteContext();
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
  }>({ open: false, id: "" });
  const [currentQuote, setCurrentQuote] =
    useState<Partial<Quote>>(defaultQuote);
  const [currentLineItems, setCurrentLineItems] = useState<
    Partial<QuoteLineItem>[]
  >([{ ...defaultLineItem, id: crypto.randomUUID() }]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<PreviewType>("quote");

  const { data, isLoading } = useAllQuotesQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const { data: companiesData } = useAllCompaniesQuery(
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

  const companies = useMemo(
    () =>
      (companiesData?.companies?.nodes ?? []).flatMap((node) => {
        if (!node) return [];
        return [{ id: node.rowId, name: node.name }];
      }),
    [companiesData],
  );

  const resolveCompanyName = useCallback(
    (companyId: string | undefined) =>
      companies.find((c) => c.id === companyId)?.name ?? null,
    [companies],
  );

  const filteredQuotes = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return quotes.filter((q) => {
      const companyName = resolveCompanyName(q.companyId) ?? "";
      const matchesSearch =
        !term ||
        q.quoteNumber.toLowerCase().includes(term) ||
        q.title.toLowerCase().includes(term) ||
        companyName.toLowerCase().includes(term);

      const matchesStatus = statusFilter === "all" || q.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quotes, resolveCompanyName, searchTerm, statusFilter]);

  const filteredTotal = useMemo(
    () =>
      filteredQuotes.reduce(
        (sum, q) => sum + (Number.parseFloat(q.total) || 0),
        0,
      ),
    [filteredQuotes],
  );

  const invalidateQuotes = () => {
    queryClient.invalidateQueries({
      queryKey: useAllQuotesQuery.getKey({
        organizationId: organizationId ?? "",
      }),
    });
  };

  const createMutation = useCreateQuoteMutation();
  const updateMutation = useUpdateQuoteMutation();
  const createLineItemMutation = useCreateQuoteLineItemMutation();
  const deleteLineItemMutation = useDeleteQuoteLineItemMutation();

  const deleteMutation = useDeleteQuoteMutation({
    onSuccess: invalidateQuotes,
  });

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Select an organization to view quotes</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2
          className="h-8 w-8 animate-spin text-gray-400"
          aria-label="Loading quotes"
        />
      </div>
    );
  }

  const handleCreateNew = () => {
    const quoteNumber = generateQuoteNumber(quotes);
    setCurrentQuote({ ...defaultQuote, quoteNumber });
    setCurrentLineItems([{ ...defaultLineItem, id: crypto.randomUUID() }]);
    setEditingId(null);
    setPreviewType("quote");
    setViewMode("create");
  };

  const handleEdit = (quote: (typeof quotes)[number]) => {
    setCurrentQuote(quote);
    setCurrentLineItems(
      quote.quoteLineItems.length > 0
        ? quote.quoteLineItems
        : [{ ...defaultLineItem, id: crypto.randomUUID() }],
    );
    setEditingId(quote.id);
    setViewMode("edit");
  };

  const handlePreview = (quote: (typeof quotes)[number]) => {
    setCurrentQuote(quote);
    setCurrentLineItems(quote.quoteLineItems);
    setEditingId(quote.id);
    setPreviewType("quote");
    setViewMode("preview");
  };

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
    const existing = quotes.find((q) => q.id === editingId);
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
    setSaving(true);
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          input: {
            rowId: editingId,
            patch: {
              quoteNumber: currentQuote.quoteNumber,
              companyId: currentQuote.companyId || null,
              contactId: currentQuote.contactId,
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
        await saveLineItems(editingId);
      } else {
        const result = await createMutation.mutateAsync({
          input: {
            quote: {
              organizationId: organizationId ?? "",
              quoteNumber: currentQuote.quoteNumber ?? "",
              companyId: currentQuote.companyId ?? "",
              contactId: currentQuote.contactId,
              title: currentQuote.title ?? "",
              description: currentQuote.description,
              status: currentQuote.status ?? "draft",
              validUntil: new Date(
                currentQuote.validUntil ||
                  new Date().toISOString().split("T")[0],
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
            },
          },
        });

        const quoteId = result.createQuote?.quote?.rowId;
        if (quoteId) {
          await saveLineItems(quoteId);
        }
      }

      invalidateQuotes();
      setViewMode("list");
      setEditingId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save quote");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleCancel = () => {
    setViewMode("list");
    setEditingId(null);
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

  // List view
  if (viewMode === "list") {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-semibold text-xl">Quotes</h1>
          <div className="flex items-center gap-3">
            <div className="rounded-md border border-gray-200 bg-white px-3 py-1.5">
              <p className="text-gray-500 text-xs">
                {filteredQuotes.length}{" "}
                {filteredQuotes.length === 1 ? "quote" : "quotes"}
              </p>
              <p className="font-semibold">
                {formatCurrency(filteredTotal.toFixed(2))}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCreateNew}
              className="flex items-center gap-1.5 rounded-md bg-teal-600 px-3 py-1.5 text-sm text-white hover:bg-teal-700"
            >
              <Plus size={16} />
              New Quote
            </button>
          </div>
        </div>

        {quotes.length === 0 ? (
          <div className="rounded-lg border-2 border-gray-200 border-dashed py-12 text-center">
            <p className="mb-4 text-gray-500">No quotes yet</p>
            <button
              type="button"
              onClick={handleCreateNew}
              className="text-teal-600 hover:text-teal-700"
            >
              Create your first quote
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="flex gap-4 border-gray-200 border-b p-4">
              <div className="relative flex-1">
                <Search
                  className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Search quotes..."
                  aria-label="Search quotes"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-9 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
                className="cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">All statuses</option>
                {QUOTE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {filteredQuotes.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">No quotes match your filters</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="mt-2 text-sm text-teal-600 hover:text-teal-700"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
                      Quote #
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700 text-sm">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
                      Valid Until
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700 text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="border-gray-100 border-t">
                      <td className="px-4 py-3 font-mono text-sm">
                        {quote.quoteNumber}
                      </td>
                      <td className="px-4 py-3 text-sm">{quote.title}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {resolveCompanyName(quote.companyId) || "\u2014"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs ${statusColors[quote.status] || statusColors.draft}`}
                        >
                          {quote.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-sm">
                        {formatCurrency(quote.total, quote.currency)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {quote.validUntil || "\u2014"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handlePreview(quote)}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Preview quote"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(quote)}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Edit quote"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(quote.id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Delete quote"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        <ConfirmDialog
          open={deleteConfirm.open}
          onOpenChange={(open) =>
            setDeleteConfirm((prev) => ({ ...prev, open }))
          }
          title="Delete Quote"
          description="Are you sure you want to delete this quote? This action cannot be undone."
          onConfirm={() =>
            deleteMutation.mutate({ input: { rowId: deleteConfirm.id } })
          }
        />
      </div>
    );
  }

  // Preview view
  if (viewMode === "preview") {
    return (
      <div className="p-6 print:p-0">
        <div className="print-hide mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className="text-gray-500 text-sm hover:text-gray-700"
          >
            &larr; Back to list
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                const originalTitle = document.title;
                const prefix =
                  previewType === "contract" ? "contract" : "quote";
                document.title = `${prefix}_${currentQuote.quoteNumber}`;
                window.print();
                document.title = originalTitle;
              }}
              className="rounded-md bg-teal-600 px-3 py-1.5 text-sm text-white hover:bg-teal-700"
            >
              Print
            </button>
          </div>
        </div>

        <div className="print-hide">
          <PreviewToggle value={previewType} onChange={setPreviewType} />
        </div>

        {renderPreview()}
      </div>
    );
  }

  // Create/edit view
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMode("list")}
          className="text-gray-500 text-sm hover:text-gray-700"
        >
          &larr; Back to list
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-teal-600 px-3 py-1.5 text-sm text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Save Changes" : "Create Quote"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-lg">
            {editingId ? "Edit Quote" : "New Quote"}
          </h2>
          <QuoteForm
            quote={currentQuote}
            onQuoteChange={setCurrentQuote}
            lineItems={currentLineItems}
            onLineItemsChange={setCurrentLineItems}
            onSave={handleSave}
            onCancel={handleCancel}
            organizationId={organizationId}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="mb-4 font-semibold text-lg">Preview</h2>
            <PreviewToggle value={previewType} onChange={setPreviewType} />
          </div>
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_auth/quotes/")({
  component: QuotesPage,
});
