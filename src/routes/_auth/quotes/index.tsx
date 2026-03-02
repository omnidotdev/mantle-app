import { Link, createFileRoute } from "@tanstack/react-router";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { formatCurrency } from "@/features/invoices/types/invoice";
import ContractPreview from "@/features/quotes/components/ContractPreview";
import QuoteForm from "@/features/quotes/components/QuoteForm";
import QuotePreview from "@/features/quotes/components/QuotePreview";
import {
  generateQuoteNumber,
  useQuoteStore,
} from "@/features/quotes/store/quoteStore";

import type { StoredQuote } from "@/features/quotes/store/quoteStore";
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

const defaultLineItem: Partial<QuoteLineItem> = {
  id: crypto.randomUUID(),
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
  const { quotes, createQuote, updateQuote, deleteQuote } = useQuoteStore();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentQuote, setCurrentQuote] =
    useState<Partial<Quote>>(defaultQuote);
  const [currentLineItems, setCurrentLineItems] = useState<
    Partial<QuoteLineItem>[]
  >([{ ...defaultLineItem, id: crypto.randomUUID() }]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<PreviewType>("quote");

  const handleCreateNew = () => {
    const quoteNumber = generateQuoteNumber(quotes as StoredQuote[]);
    setCurrentQuote({ ...defaultQuote, quoteNumber });
    setCurrentLineItems([{ ...defaultLineItem, id: crypto.randomUUID() }]);
    setEditingId(null);
    setPreviewType("quote");
    setViewMode("create");
  };

  const handleEdit = (quote: StoredQuote) => {
    setCurrentQuote(quote);
    setCurrentLineItems(
      quote.quoteLineItems ?? [{ ...defaultLineItem, id: crypto.randomUUID() }],
    );
    setEditingId(quote.id);
    setViewMode("edit");
  };

  const handlePreview = (quote: StoredQuote) => {
    setCurrentQuote(quote);
    setCurrentLineItems(quote.quoteLineItems ?? []);
    setEditingId(quote.id);
    setPreviewType("quote");
    setViewMode("preview");
  };

  const handleSave = () => {
    const quoteData = {
      ...currentQuote,
      quoteNumber: currentQuote.quoteNumber ?? "",
      companyId: currentQuote.companyId ?? "",
      title: currentQuote.title ?? "",
      status: currentQuote.status ?? "draft",
      validUntil: currentQuote.validUntil ?? "",
      subtotal: currentQuote.subtotal ?? "0",
      taxAmount: currentQuote.taxAmount ?? "0",
      total: currentQuote.total ?? "0",
      currency: currentQuote.currency ?? "USD",
      quoteLineItems: currentLineItems as QuoteLineItem[],
    };

    if (editingId) {
      updateQuote(editingId, quoteData);
    } else {
      createQuote(
        quoteData as Omit<
          Quote,
          "id" | "createdAt" | "updatedAt" | "organizationId"
        >,
      );
    }

    setViewMode("list");
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this quote?")) {
      deleteQuote(id);
    }
  };

  const handleCancel = () => {
    setViewMode("list");
    setEditingId(null);
  };

  const renderPreview = () => {
    if (previewType === "contract") {
      return (
        <ContractPreview quote={currentQuote} lineItems={currentLineItems} />
      );
    }
    return <QuotePreview quote={currentQuote} lineItems={currentLineItems} />;
  };

  // List view
  if (viewMode === "list") {
    return (
      <div className="mx-auto max-w-6xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              to="/dashboard"
              className="text-gray-500 text-sm hover:text-gray-700"
            >
              &larr; Back
            </Link>
            <h1 className="font-bold text-2xl">Quotes</h1>
          </div>
          <button
            type="button"
            onClick={handleCreateNew}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
          >
            <Plus size={18} />
            New Quote
          </button>
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
                {quotes.map((quote) => (
                  <tr key={quote.id} className="border-gray-100 border-t">
                    <td className="px-4 py-3 font-mono text-sm">
                      {quote.quoteNumber}
                    </td>
                    <td className="px-4 py-3 text-sm">{quote.title}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {quote.companyId || "\u2014"}
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
                          title="Preview"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(quote)}
                          className="text-gray-500 hover:text-gray-700"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(quote.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // Preview view
  if (viewMode === "preview") {
    return (
      <div className="mx-auto max-w-4xl p-8 print:max-w-none print:p-0">
        <div className="print-hide mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className="text-gray-500 hover:text-gray-700"
          >
            &larr; Back to list
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
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
              className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
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
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMode("list")}
          className="text-gray-500 hover:text-gray-700"
        >
          &larr; Back to list
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
          >
            {editingId ? "Save Changes" : "Create Quote"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-xl">
            {editingId ? "Edit Quote" : "New Quote"}
          </h2>
          <QuoteForm
            quote={currentQuote}
            onQuoteChange={setCurrentQuote}
            lineItems={currentLineItems}
            onLineItemsChange={setCurrentLineItems}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="mb-4 font-bold text-xl">Preview</h2>
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
