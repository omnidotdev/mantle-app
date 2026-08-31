import { Check, Plus, RefreshCw, Trash2 } from "lucide-react";

import PopulateButton from "@/components/core/PopulateButton";
import SortableList from "@/components/core/SortableList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import {
  ACCENT_PRESETS,
  DEFAULT_ACCENT,
} from "@/features/invoices/types/accentColor";
import {
  MANUAL_INVOICE_STATUSES,
  formatCurrency,
  invoiceBalance,
  isPaidInFull,
} from "@/features/invoices/types/invoice";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useGenerateDocumentNumberMutation } from "@/generated/graphql";
import { resolveRegion } from "@/lib/phone";

import type {
  Invoice,
  InvoiceLineItem,
  Payment,
} from "@/features/invoices/types/invoice";

interface InvoiceFormProps {
  invoice: Partial<Invoice>;
  onInvoiceChange: (invoice: Partial<Invoice>) => void;
  lineItems: Partial<InvoiceLineItem>[];
  onLineItemsChange: (items: Partial<InvoiceLineItem>[]) => void;
  payments: Partial<Payment>[];
  onPaymentsChange: (payments: Partial<Payment>[]) => void;
  onSave: () => void;
  organizationId?: string;
}

const InvoiceForm = ({
  invoice,
  onInvoiceChange,
  lineItems,
  onLineItemsChange,
  payments,
  onPaymentsChange,
  onSave,
  organizationId,
}: InvoiceFormProps) => {
  const handleChange = (field: keyof Invoice, value: string | null) => {
    onInvoiceChange({ ...invoice, [field]: value });
  };

  const handlePaymentChange = (
    index: number,
    field: keyof Payment,
    value: string | null,
  ) => {
    onPaymentsChange(
      payments.map((payment, i) =>
        i === index ? { ...payment, [field]: value } : payment,
      ),
    );
  };

  const handleAddPayment = () => {
    const today = new Date().toISOString().slice(0, 10);
    onPaymentsChange([
      ...payments,
      {
        id: crypto.randomUUID(),
        amount: "0",
        paidAt: today,
        reference: null,
        method: null,
      },
    ]);
  };

  const handleRemovePayment = (index: number) => {
    onPaymentsChange(payments.filter((_, i) => i !== index));
  };

  const recordedPayments = payments.map((payment) => ({
    amount: payment.amount ?? "0",
    paidAt: payment.paidAt ?? "",
  }));

  const generateNumberMutation = useGenerateDocumentNumberMutation();

  // Pull the next number from the org's document-numbering config (same source
  // as the eager auto-fill on new invoices), e.g. INV-0001, rather than a
  // client-side timestamp
  const generateInvoiceNumber = async () => {
    if (!organizationId) return;

    const result = await generateNumberMutation.mutateAsync({
      input: { organizationId, documentType: "invoice" },
    });
    const number = result.generateDocumentNumber?.documentNumber;
    if (number) handleChange("invoiceNumber", number);
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
    const taxRate = Number.parseFloat(invoice.taxRate || "0") || 0;
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
      (sum, item) => sum + (Number.parseFloat(item.amount || "0") || 0),
      0,
    );
    const taxRate = Number.parseFloat(value || "0") || 0;
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

  const { getProfileForOrg, createProfile, updateProfile } = useSettingsStore();
  const orgProfile = organizationId
    ? getProfileForOrg(organizationId)
    : undefined;

  const handleProfileChange = (field: string, value: string | null) => {
    if (!organizationId) return;

    if (orgProfile) {
      updateProfile(orgProfile.id, { [field]: value });
    } else {
      createProfile({
        organizationId,
        companyName: field === "companyName" ? (value ?? "") : "",
        contactName: field === "contactName" ? (value ?? "") : "",
        contactTitle: field === "contactTitle" ? value : null,
        email: field === "email" ? (value ?? "") : "",
        phone: field === "phone" ? value : null,
        website: null,
        addressLine1: field === "addressLine1" ? value : null,
        addressLine2: null,
        city: field === "city" ? value : null,
        state: field === "state" ? value : null,
        postalCode: field === "postalCode" ? value : null,
        country: null,
        logoUrl: null,
        registrationState: null,
        accentColor: null,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* From (your company) */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">From</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="from-company-name">Company Name</Label>
            <Input
              id="from-company-name"
              value={orgProfile?.companyName ?? ""}
              onChange={(e) =>
                handleProfileChange("companyName", e.target.value)
              }
              placeholder="Your company name"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="from-contact-name">Contact Name</Label>
            <Input
              id="from-contact-name"
              value={orgProfile?.contactName ?? ""}
              onChange={(e) =>
                handleProfileChange("contactName", e.target.value)
              }
              placeholder="Your name"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="from-email">Email</Label>
            <Input
              id="from-email"
              type="email"
              value={orgProfile?.email ?? ""}
              onChange={(e) => handleProfileChange("email", e.target.value)}
              placeholder="billing@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="from-phone">Phone</Label>
            <PhoneInput
              id="from-phone"
              value={orgProfile?.phone ?? null}
              onChange={(phone) => handleProfileChange("phone", phone)}
              region={resolveRegion(orgProfile?.country)}
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="from-address">Address</Label>
            <Input
              id="from-address"
              value={orgProfile?.addressLine1 ?? ""}
              onChange={(e) =>
                handleProfileChange("addressLine1", e.target.value || null)
              }
              placeholder="123 Main St"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="from-city">City</Label>
            <Input
              id="from-city"
              value={orgProfile?.city ?? ""}
              onChange={(e) =>
                handleProfileChange("city", e.target.value || null)
              }
              placeholder="City"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="from-state">State</Label>
              <Input
                id="from-state"
                value={orgProfile?.state ?? ""}
                onChange={(e) =>
                  handleProfileChange("state", e.target.value || null)
                }
                placeholder="State"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="from-postal">Postal Code</Label>
              <Input
                id="from-postal"
                value={orgProfile?.postalCode ?? ""}
                onChange={(e) =>
                  handleProfileChange("postalCode", e.target.value || null)
                }
                placeholder="12345"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Accent color */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">Invoice Theme</h3>
        <div className="flex flex-wrap items-center gap-2">
          {ACCENT_PRESETS.map((preset) => {
            const isActive =
              (orgProfile?.accentColor ?? DEFAULT_ACCENT) === preset.value;

            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => handleProfileChange("accentColor", preset.value)}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: preset.value,
                  borderColor: isActive ? "var(--foreground)" : "transparent",
                }}
                aria-label={preset.label}
                title={preset.label}
              >
                {isActive && <Check size={14} className="text-white" />}
              </button>
            );
          })}
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={orgProfile?.accentColor ?? DEFAULT_ACCENT}
              onChange={(e) =>
                handleProfileChange("accentColor", e.target.value)
              }
              className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
              aria-label="Custom accent color"
              title="Custom color"
            />
            <span className="font-mono text-muted-foreground text-xs">
              {orgProfile?.accentColor ?? DEFAULT_ACCENT}
            </span>
          </div>
        </div>
      </div>

      {/* Invoice details */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">Invoice Details</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="invoice-number">Invoice Number</Label>
            <div className="flex gap-2">
              <Input
                id="invoice-number"
                value={invoice.invoiceNumber ?? ""}
                onChange={(e) => handleChange("invoiceNumber", e.target.value)}
                placeholder="INV-0001"
              />
              <button
                type="button"
                onClick={generateInvoiceNumber}
                disabled={!organizationId || generateNumberMutation.isPending}
                className="flex shrink-0 items-center gap-1 rounded-md border border-input px-3 text-muted-foreground text-sm shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Generate invoice number"
              >
                <RefreshCw size={14} />
                Generate
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice-status">Status</Label>
            <select
              id="invoice-status"
              value={
                invoice.status === "paid" ? "paid" : (invoice.status ?? "draft")
              }
              onChange={(e) => handleChange("status", e.target.value)}
              disabled={invoice.status === "paid"}
              className="flex h-9 w-full cursor-pointer appearance-none rounded-md border border-input bg-transparent px-3 py-1 text-sm capitalize shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
            >
              {MANUAL_INVOICE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
              {invoice.status === "paid" && <option value="paid">Paid</option>}
            </select>
            {invoice.status === "paid" && (
              <p className="text-muted-foreground text-xs">
                Set automatically once payments cover the total. Remove a
                payment to change it.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground text-lg">Bill To</h3>
          <PopulateButton
            organizationId={organizationId}
            onPopulateClient={({
              companyId,
              contactId,
              companyName,
              contactName,
              contactEmail,
            }) => {
              const lines = [contactName, companyName, contactEmail].filter(
                Boolean,
              );
              onInvoiceChange({
                ...invoice,
                companyId,
                contactId: contactId ?? null,
                billTo: lines.join("\n") || null,
              });
            }}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="invoice-bill-to">Recipient name and address</Label>
          <Textarea
            id="invoice-bill-to"
            value={invoice.billTo ?? ""}
            onChange={(e) => handleChange("billTo", e.target.value || null)}
            rows={4}
            placeholder={
              "Company Name\nContact Name\n123 Main St\nCity, State ZIP"
            }
          />
        </div>
      </div>

      {/* Dates */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">Dates</h3>

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
              onChange={(e) => handleChange("dueDate", e.target.value || null)}
            />
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">Line Items</h3>

        <SortableList
          items={lineItems}
          onReorder={onLineItemsChange}
          renderItem={(item, index) => (
            <div className="space-y-3 rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground text-sm">
                  Item {index + 1}
                </span>
                {lineItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLineItem(index)}
                    className="text-destructive hover:text-destructive/80"
                    aria-label="Remove item"
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
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>
          )}
        />

        <button
          type="button"
          onClick={handleAddLineItem}
          className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
        >
          <Plus size={18} />
          <span>Add Line Item</span>
        </button>
      </div>

      {/* Financials */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">Financials</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="invoice-subtotal">Subtotal</Label>
            <Input
              id="invoice-subtotal"
              value={formatCurrency(String(subtotal), invoice.currency)}
              readOnly
              className="bg-muted"
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
              className="bg-muted"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice-total">Total</Label>
            <Input
              id="invoice-total"
              value={formatCurrency(invoice.total || "0", invoice.currency)}
              readOnly
              className="bg-muted font-medium"
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

      {/* Payments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground text-lg">Payments</h3>
          <span className="text-muted-foreground text-sm">
            {isPaidInFull(invoice.total ?? "0", recordedPayments)
              ? "Paid in full"
              : `Balance ${formatCurrency(
                  String(
                    invoiceBalance(invoice.total ?? "0", recordedPayments),
                  ),
                  invoice.currency,
                )}`}
          </span>
        </div>

        {payments.map((payment, index) => (
          <div
            key={payment.id}
            className="space-y-3 rounded-lg border border-border p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground text-sm">
                Payment {index + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemovePayment(index)}
                className="text-destructive hover:text-destructive/80"
                aria-label="Remove payment"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`payment-date-${payment.id}`}>Date</Label>
                <Input
                  id={`payment-date-${payment.id}`}
                  type="date"
                  value={payment.paidAt ?? ""}
                  onChange={(e) =>
                    handlePaymentChange(index, "paidAt", e.target.value)
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`payment-amount-${payment.id}`}>Amount</Label>
                <Input
                  id={`payment-amount-${payment.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={payment.amount ?? ""}
                  onChange={(e) =>
                    handlePaymentChange(index, "amount", e.target.value)
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`payment-reference-${payment.id}`}>
                  Reference
                </Label>
                <Input
                  id={`payment-reference-${payment.id}`}
                  value={payment.reference ?? ""}
                  onChange={(e) =>
                    handlePaymentChange(
                      index,
                      "reference",
                      e.target.value || null,
                    )
                  }
                  placeholder="Check #, transfer ID, etc."
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`payment-method-${payment.id}`}>Method</Label>
                <Input
                  id={`payment-method-${payment.id}`}
                  value={payment.method ?? ""}
                  onChange={(e) =>
                    handlePaymentChange(index, "method", e.target.value || null)
                  }
                  placeholder="Check, wire, card, cash"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddPayment}
          className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
        >
          <Plus size={18} />
          <span>Add Payment</span>
        </button>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <Label
          htmlFor="invoice-notes"
          className="font-medium text-foreground text-lg"
        >
          Notes
        </Label>

        <Textarea
          id="invoice-notes"
          value={invoice.notes ?? ""}
          onChange={(e) => handleChange("notes", e.target.value || null)}
          rows={3}
          placeholder="Additional notes"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end border-border border-t pt-4">
        <button
          type="button"
          onClick={onSave}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm;
