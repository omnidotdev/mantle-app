import { Plus, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/features/invoices/types/invoice";

import type {
  Invoice,
  InvoiceLineItem,
} from "@/features/invoices/types/invoice";

interface InvoiceFormProps {
  invoice: Partial<Invoice>;
  onInvoiceChange: (invoice: Partial<Invoice>) => void;
  lineItems: Partial<InvoiceLineItem>[];
  onLineItemsChange: (items: Partial<InvoiceLineItem>[]) => void;
  onSave: () => void;
  onCancel: () => void;
}

const InvoiceForm = ({
  invoice,
  onInvoiceChange,
  lineItems,
  onLineItemsChange,
  onSave,
  onCancel,
}: InvoiceFormProps) => {
  const handleChange = (field: keyof Invoice, value: string | null) => {
    onInvoiceChange({ ...invoice, [field]: value });
  };

  const handleLineItemChange = (
    index: number,
    field: keyof InvoiceLineItem,
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

  const recalculateTotals = (items: Partial<InvoiceLineItem>[]) => {
    const subtotal = items.reduce(
      (sum, item) => sum + Number.parseFloat(item.amount || "0"),
      0,
    );
    const taxRate = Number.parseFloat(invoice.taxRate || "0");
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    onInvoiceChange({
      ...invoice,
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

    onInvoiceChange({
      ...invoice,
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
      {/* Invoice details */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700 text-lg">Invoice Details</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="invoice-number">Invoice Number</Label>
            <Input
              id="invoice-number"
              value={invoice.invoiceNumber ?? ""}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice-status">Status</Label>
            <Input
              id="invoice-status"
              value={invoice.status ?? "draft"}
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
            <Label htmlFor="invoice-company">Company ID</Label>
            <Input
              id="invoice-company"
              value={invoice.companyId ?? ""}
              onChange={(e) => handleChange("companyId", e.target.value)}
              placeholder="Company identifier"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice-contact">Contact ID</Label>
            <Input
              id="invoice-contact"
              value={invoice.contactId ?? ""}
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
            <Label htmlFor="invoice-issue-date">Issue Date</Label>
            <Input
              id="invoice-issue-date"
              type="date"
              value={invoice.issueDate ?? ""}
              onChange={(e) => handleChange("issueDate", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice-due-date">Due Date</Label>
            <Input
              id="invoice-due-date"
              type="date"
              value={invoice.dueDate ?? ""}
              onChange={(e) => handleChange("dueDate", e.target.value)}
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

            <div className="grid grid-cols-3 gap-3">
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
                  value={formatCurrency(item.amount || "0", invoice.currency)}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
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
            <Label htmlFor="invoice-subtotal">Subtotal</Label>
            <Input
              id="invoice-subtotal"
              value={formatCurrency(String(subtotal), invoice.currency)}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice-tax-rate">Tax Rate (%)</Label>
            <Input
              id="invoice-tax-rate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={invoice.taxRate ?? ""}
              onChange={(e) => handleTaxRateChange(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice-tax-amount">Tax Amount</Label>
            <Input
              id="invoice-tax-amount"
              value={formatCurrency(invoice.taxAmount || "0", invoice.currency)}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice-total">Total</Label>
            <Input
              id="invoice-total"
              value={formatCurrency(invoice.total || "0", invoice.currency)}
              readOnly
              className="bg-gray-50 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice-currency">Currency</Label>
            <Input
              id="invoice-currency"
              value={invoice.currency ?? "USD"}
              onChange={(e) => handleChange("currency", e.target.value)}
              placeholder="USD"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700 text-lg">Notes</h3>

        <Textarea
          value={invoice.notes ?? ""}
          onChange={(e) => handleChange("notes", e.target.value || null)}
          rows={3}
          placeholder="Additional notes"
        />
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
          disabled={!invoice.companyId?.trim()}
          className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm;
