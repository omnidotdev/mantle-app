import { Plus, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/features/invoices/types/invoice";

import type { Quote, QuoteLineItem } from "../types/quote";

interface QuoteFormProps {
  quote: Partial<Quote>;
  onQuoteChange: (quote: Partial<Quote>) => void;
  lineItems: Partial<QuoteLineItem>[];
  onLineItemsChange: (items: Partial<QuoteLineItem>[]) => void;
  onSave: () => void;
  onCancel: () => void;
}

const QuoteForm = ({
  quote,
  onQuoteChange,
  lineItems,
  onLineItemsChange,
  onSave,
  onCancel,
}: QuoteFormProps) => {
  const handleChange = (field: keyof Quote, value: string | null) => {
    onQuoteChange({ ...quote, [field]: value });
  };

  const handleLineItemChange = (
    index: number,
    field: keyof QuoteLineItem,
    value: string | number | null,
  ) => {
    const updated = lineItems.map((item, i) => {
      if (i !== index) return item;

      const updatedItem = { ...item, [field]: value };

      // Recompute amount when quantity or unitPrice change
      if (field === "quantity" || field === "unitPrice") {
        const qty = Number.parseFloat(
          String(field === "quantity" ? value : updatedItem.quantity) || "0",
        );
        const price = Number.parseFloat(
          String(field === "unitPrice" ? value : updatedItem.unitPrice) || "0",
        );
        updatedItem.amount = String(qty * price);
      }

      return updatedItem;
    });

    onLineItemsChange(updated);
    recalculateTotals(updated);
  };

  const recalculateTotals = (items: Partial<QuoteLineItem>[]) => {
    const subtotal = items.reduce(
      (sum, item) => sum + Number.parseFloat(item.amount || "0"),
      0,
    );
    const taxRate = Number.parseFloat(quote.taxRate || "0");
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    onQuoteChange({
      ...quote,
      subtotal: String(subtotal),
      taxAmount: String(taxAmount),
      total: String(total),
    });
  };

  const handleTaxRateChange = (value: string) => {
    const subtotal = lineItems.reduce(
      (sum, item) => sum + Number.parseFloat(item.amount || "0"),
      0,
    );
    const taxRate = Number.parseFloat(value || "0");
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    onQuoteChange({
      ...quote,
      taxRate: value || null,
      taxAmount: String(taxAmount),
      total: String(total),
    });
  };

  const handleAddLineItem = () => {
    onLineItemsChange([
      ...lineItems,
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: "1",
        unitPrice: "0",
        amount: "0",
        pricingType: "fixed",
        estimatedHours: null,
        royaltyPercentage: null,
        sortOrder: lineItems.length,
      },
    ]);
  };

  const handleRemoveLineItem = (index: number) => {
    const updated = lineItems.filter((_, i) => i !== index);
    onLineItemsChange(updated);
    recalculateTotals(updated);
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + Number.parseFloat(item.amount || "0"),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Quote details */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700 text-lg">Quote Details</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="quote-title">Title *</Label>
            <Input
              id="quote-title"
              value={quote.title ?? ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Quote title"
              required
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="quote-description">Description</Label>
            <Textarea
              id="quote-description"
              value={quote.description ?? ""}
              onChange={(e) =>
                handleChange("description", e.target.value || null)
              }
              rows={2}
              placeholder="Brief description of the quote"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-number">Quote Number</Label>
            <Input
              id="quote-number"
              value={quote.quoteNumber ?? ""}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-status">Status</Label>
            <Input
              id="quote-status"
              value={quote.status ?? "draft"}
              readOnly
              className="bg-gray-50 capitalize"
            />
          </div>
        </div>
      </div>

      {/* Client */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700 text-lg">Client</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="quote-company">Company ID</Label>
            <Input
              id="quote-company"
              value={quote.companyId ?? ""}
              onChange={(e) => handleChange("companyId", e.target.value)}
              placeholder="Company identifier"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-contact">Contact ID</Label>
            <Input
              id="quote-contact"
              value={quote.contactId ?? ""}
              onChange={(e) =>
                handleChange("contactId", e.target.value || null)
              }
              placeholder="Contact identifier"
            />
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700 text-lg">Dates</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="quote-valid-until">Valid Until</Label>
            <Input
              id="quote-valid-until"
              type="date"
              value={quote.validUntil ?? ""}
              onChange={(e) => handleChange("validUntil", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700 text-lg">Line Items</h3>

        {lineItems.map((item, index) => (
          <div
            key={item.id}
            className="space-y-3 rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600 text-sm">
                Item {index + 1}
              </span>
              {lineItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveLineItem(index)}
                  className="text-red-500 hover:text-red-700"
                  title="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`item-desc-${item.id}`}>Description</Label>
              <Input
                id={`item-desc-${item.id}`}
                value={item.description ?? ""}
                onChange={(e) =>
                  handleLineItemChange(index, "description", e.target.value)
                }
                placeholder="Item description"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="space-y-1.5">
                <Label htmlFor={`item-qty-${item.id}`}>Quantity</Label>
                <Input
                  id={`item-qty-${item.id}`}
                  type="number"
                  min="0"
                  step="1"
                  value={item.quantity ?? "1"}
                  onChange={(e) =>
                    handleLineItemChange(index, "quantity", e.target.value)
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`item-price-${item.id}`}>Unit Price</Label>
                <Input
                  id={`item-price-${item.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice ?? "0"}
                  onChange={(e) =>
                    handleLineItemChange(index, "unitPrice", e.target.value)
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`item-amount-${item.id}`}>Amount</Label>
                <Input
                  id={`item-amount-${item.id}`}
                  value={formatCurrency(item.amount || "0", quote.currency)}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`item-pricing-${item.id}`}>Pricing Type</Label>
                <select
                  id={`item-pricing-${item.id}`}
                  value={item.pricingType ?? "fixed"}
                  onChange={(e) =>
                    handleLineItemChange(index, "pricingType", e.target.value)
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:text-sm"
                >
                  <option value="fixed">Fixed</option>
                  <option value="hourly">Hourly</option>
                  <option value="royalty">Royalty</option>
                </select>
              </div>
            </div>

            {/* Conditional fields based on pricing type */}
            {item.pricingType === "hourly" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor={`item-hours-${item.id}`}>
                    Estimated Hours
                  </Label>
                  <Input
                    id={`item-hours-${item.id}`}
                    type="number"
                    min="0"
                    step="0.5"
                    value={item.estimatedHours ?? ""}
                    onChange={(e) =>
                      handleLineItemChange(
                        index,
                        "estimatedHours",
                        e.target.value || null,
                      )
                    }
                    placeholder="e.g. 40"
                  />
                </div>
              </div>
            )}

            {item.pricingType === "royalty" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor={`item-royalty-${item.id}`}>
                    Royalty Percentage
                  </Label>
                  <Input
                    id={`item-royalty-${item.id}`}
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={item.royaltyPercentage ?? ""}
                    onChange={(e) =>
                      handleLineItemChange(
                        index,
                        "royaltyPercentage",
                        e.target.value || null,
                      )
                    }
                    placeholder="e.g. 5"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor={`item-sort-${item.id}`}>Sort Order</Label>
              <Input
                id={`item-sort-${item.id}`}
                type="number"
                min="0"
                value={item.sortOrder ?? 0}
                onChange={(e) =>
                  handleLineItemChange(
                    index,
                    "sortOrder",
                    Number.parseInt(e.target.value, 10) || 0,
                  )
                }
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddLineItem}
          className="flex items-center gap-1 text-teal-600 hover:text-teal-700"
        >
          <Plus size={18} />
          <span>Add Line Item</span>
        </button>
      </div>

      {/* Financials */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700 text-lg">Financials</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="quote-subtotal">Subtotal</Label>
            <Input
              id="quote-subtotal"
              value={formatCurrency(String(subtotal), quote.currency)}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-tax-rate">Tax Rate (%)</Label>
            <Input
              id="quote-tax-rate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={quote.taxRate ?? ""}
              onChange={(e) => handleTaxRateChange(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-tax-amount">Tax Amount</Label>
            <Input
              id="quote-tax-amount"
              value={formatCurrency(quote.taxAmount || "0", quote.currency)}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-total">Total</Label>
            <Input
              id="quote-total"
              value={formatCurrency(quote.total || "0", quote.currency)}
              readOnly
              className="bg-gray-50 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-currency">Currency</Label>
            <Input
              id="quote-currency"
              value={quote.currency ?? "USD"}
              onChange={(e) => handleChange("currency", e.target.value)}
              placeholder="USD"
            />
          </div>
        </div>
      </div>

      {/* Terms & notes */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700 text-lg">Terms & Notes</h3>

        <div className="space-y-1.5">
          <Label htmlFor="quote-terms">Terms</Label>
          <Textarea
            id="quote-terms"
            value={quote.terms ?? ""}
            onChange={(e) => handleChange("terms", e.target.value || null)}
            rows={3}
            placeholder="Payment terms and conditions"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="quote-notes">Notes</Label>
          <Textarea
            id="quote-notes"
            value={quote.notes ?? ""}
            onChange={(e) => handleChange("notes", e.target.value || null)}
            rows={3}
            placeholder="Additional notes"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 border-gray-200 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!quote.title?.trim()}
          className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default QuoteForm;
