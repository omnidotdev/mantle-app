import { Input } from "@omnidotdev/thornberry/input";
import { Label } from "@omnidotdev/thornberry/label";
import { NativeSelect } from "@omnidotdev/thornberry/native-select";
import { Textarea } from "@omnidotdev/thornberry/textarea";
import { CheckIcon, PlusIcon, RefreshCwIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import PopulateButton from "@/components/core/PopulateButton";
import SectionCard from "@/components/core/SectionCard";
import SortableList from "@/components/core/SortableList";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  ACCENT_PRESETS,
  DEFAULT_ACCENT,
} from "@/features/invoices/types/accentColor";
import {
  MANUAL_INVOICE_STATUSES,
  formatCurrency,
  invoiceBalance,
  isPaidInFull,
  paymentLinkError,
} from "@/features/invoices/types/invoice";
import { useWorkspaceProfile } from "@/features/settings/hooks/useWorkspaceProfile";
import { useGenerateDocumentNumberMutation } from "@/generated/graphql";
import { profileSaveErrorMessage } from "@/lib/graphql/errors";
import { resolveRegion } from "@/lib/phone";
import cn, { formatStatus } from "@/lib/utils";

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
  organizationId?: string;
  /**
   * When true, selecting a client regenerates the invoice number from that
   * client's numbering scheme. Only enabled while creating (a draft not yet
   * saved), so editing an existing invoice never silently renumbers it or
   * consumes a sequence number on every client change.
   */
  autoNumberOnClientSelect?: boolean;
}

const InvoiceForm = ({
  invoice,
  onInvoiceChange,
  lineItems,
  onLineItemsChange,
  payments,
  onPaymentsChange,
  organizationId,
  autoNumberOnClientSelect = false,
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

  const linkError = paymentLinkError(invoice.paymentLinkUrl);

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
      input: {
        organizationId,
        documentType: "invoice",
        companyId: invoice.companyId ?? undefined,
      },
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

  const { profile: orgProfile, updateField } =
    useWorkspaceProfile(organizationId);

  // The profile is the workspace's own, shared with Settings: edits here save
  // to it after a short pause
  const handleProfileChange = (
    field: Parameters<typeof updateField>[0],
    value: string | null,
  ) =>
    updateField(field, value, (err) =>
      toast.error(profileSaveErrorMessage(err), { id: "workspace-profile" }),
    );

  const balanceLabel = isPaidInFull(invoice.total ?? "0", recordedPayments)
    ? "Paid in full"
    : `Balance ${formatCurrency(
        String(invoiceBalance(invoice.total ?? "0", recordedPayments)),
        invoice.currency,
      )}`;

  const activeAccent = orgProfile?.accentColor ?? DEFAULT_ACCENT;

  return (
    <div className="space-y-5">
      {/* From (your business) */}
      <SectionCard title="From">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="from-company-name">Business name</Label>
            <Input
              id="from-company-name"
              value={orgProfile?.companyName ?? ""}
              onChange={(e) =>
                handleProfileChange("companyName", e.target.value)
              }
              placeholder="Your business name"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="from-contact-name">Contact name</Label>
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
              <Label htmlFor="from-postal">Postal code</Label>
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
      </SectionCard>

      {/* Accent color */}
      <SectionCard title="Invoice theme">
        <fieldset className="flex flex-wrap items-center gap-2.5">
          <legend className="sr-only">Accent color</legend>
          {ACCENT_PRESETS.map((preset) => {
            const isActive = activeAccent === preset.value;

            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => handleProfileChange("accentColor", preset.value)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full ring-offset-2 ring-offset-card transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive && "ring-2 ring-foreground",
                )}
                // User-chosen brand colors, not UI tokens
                style={{ backgroundColor: preset.value }}
                aria-label={preset.label}
                aria-pressed={isActive}
                title={preset.label}
              >
                {isActive && <CheckIcon className="size-3.5 text-white" />}
              </button>
            );
          })}

          <span aria-hidden className="mx-1 h-6 w-px bg-border" />

          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-input bg-card py-1 pr-3 pl-1 text-sm shadow-xs hover:bg-accent">
            <input
              type="color"
              value={activeAccent}
              onChange={(e) =>
                handleProfileChange("accentColor", e.target.value)
              }
              className="size-6 cursor-pointer rounded-full border-0 bg-transparent p-0 [&::-moz-color-swatch]:rounded-full [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0"
              aria-label="Custom accent color"
            />
            <span className="font-mono text-muted-foreground text-xs uppercase">
              {activeAccent}
            </span>
          </label>
        </fieldset>
      </SectionCard>

      {/* Invoice details */}
      <SectionCard title="Invoice details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="invoice-number">Invoice number</Label>
            <div className="flex gap-2">
              <Input
                id="invoice-number"
                value={invoice.invoiceNumber ?? ""}
                onChange={(e) => handleChange("invoiceNumber", e.target.value)}
                placeholder="e.g. INV-0001"
                className="tabular"
              />
              <Button
                variant="outline"
                onClick={generateInvoiceNumber}
                disabled={!organizationId || generateNumberMutation.isPending}
                aria-label="Generate invoice number"
                title={
                  invoice.companyId
                    ? "Generate the next number from this client's numbering scheme"
                    : "Generate the next number from the workspace numbering scheme"
                }
              >
                <RefreshCwIcon />
                <span className="max-sm:sr-only">Generate</span>
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice-status">Status</Label>
            <NativeSelect
              id="invoice-status"
              value={
                invoice.status === "paid" ? "paid" : (invoice.status ?? "draft")
              }
              onChange={(e) => handleChange("status", e.target.value)}
              disabled={invoice.status === "paid"}
              className="w-full"
              selectClassName="capitalize"
            >
              {MANUAL_INVOICE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
              {invoice.status === "paid" && <option value="paid">Paid</option>}
            </NativeSelect>
            <p className="text-muted-foreground text-xs">
              {invoice.status === "paid"
                ? "Set automatically once payments cover the total. Remove a payment to change it."
                : '"Paid" is set automatically once payments cover the total. Record one in Payments below.'}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice-issue-date">Issue date</Label>
            <Input
              id="invoice-issue-date"
              type="date"
              value={invoice.issueDate ?? ""}
              onChange={(e) => handleChange("issueDate", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice-due-date">Due date</Label>
            <Input
              id="invoice-due-date"
              type="date"
              value={invoice.dueDate ?? ""}
              onChange={(e) => handleChange("dueDate", e.target.value || null)}
            />
          </div>
        </div>
      </SectionCard>

      {/* Bill to; overflow stays visible so the client picker popover is not clipped */}
      <SectionCard
        title="Bill to"
        className="overflow-visible"
        action={
          <PopulateButton
            organizationId={organizationId}
            onPopulateClient={async ({
              companyId,
              contactId,
              companyName,
              contactName,
              contactEmail,
            }) => {
              const lines = [contactName, companyName, contactEmail].filter(
                Boolean,
              );
              const nextInvoice = {
                ...invoice,
                companyId,
                contactId: contactId ?? null,
                billTo: lines.join("\n") || null,
              };
              onInvoiceChange(nextInvoice);

              // On a new invoice, pull the number from the selected client's
              // numbering scheme (falls back to the workspace default server-side
              // when the client has no override). Build on nextInvoice so the
              // client fields are not lost by this second update
              if (autoNumberOnClientSelect && organizationId && companyId) {
                const result = await generateNumberMutation.mutateAsync({
                  input: { organizationId, documentType: "invoice", companyId },
                });
                const number = result.generateDocumentNumber?.documentNumber;
                if (number) {
                  onInvoiceChange({ ...nextInvoice, invoiceNumber: number });
                }
              }
            }}
          />
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="invoice-bill-to">Recipient name and address</Label>
          <Textarea
            id="invoice-bill-to"
            value={invoice.billTo ?? ""}
            onChange={(e) => handleChange("billTo", e.target.value || null)}
            rows={4}
            placeholder={
              "Company name\nContact name\n123 Main St\nCity, State ZIP"
            }
          />
        </div>
      </SectionCard>

      {/* Line items */}
      <SectionCard
        title="Line items"
        action={
          <span className="tabular text-muted-foreground text-sm">
            {formatCurrency(String(subtotal), invoice.currency)}
          </span>
        }
      >
        <div className="space-y-3">
          <SortableList
            items={lineItems}
            onReorder={onLineItemsChange}
            renderItem={(item, index) => (
              <div className="space-y-3 rounded-xl border border-border p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm">Item {index + 1}</span>
                  {lineItems.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleRemoveLineItem(index)}
                      className="text-destructive hover:text-destructive"
                      aria-label={`Remove item ${index + 1}`}
                    >
                      <Trash2Icon />
                    </Button>
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

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor={`item-qty-${item.id}`}>Quantity</Label>
                    <Input
                      id={`item-qty-${item.id}`}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="1"
                      value={item.quantity ?? "1"}
                      onChange={(e) =>
                        handleLineItemChange(index, "quantity", e.target.value)
                      }
                      className="tabular"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`item-price-${item.id}`}>Unit price</Label>
                    <Input
                      id={`item-price-${item.id}`}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      value={item.unitPrice ?? "0"}
                      onChange={(e) =>
                        handleLineItemChange(index, "unitPrice", e.target.value)
                      }
                      className="tabular"
                    />
                  </div>

                  <div className="col-span-2 space-y-1.5 sm:col-span-1">
                    <Label htmlFor={`item-amount-${item.id}`}>Amount</Label>
                    <Input
                      id={`item-amount-${item.id}`}
                      value={formatCurrency(
                        item.amount || "0",
                        invoice.currency,
                      )}
                      readOnly
                      className="tabular bg-muted font-medium"
                    />
                  </div>
                </div>
              </div>
            )}
          />

          <Button variant="outline" size="sm" onClick={handleAddLineItem}>
            <PlusIcon />
            Add line item
          </Button>
        </div>
      </SectionCard>

      {/* Totals */}
      <SectionCard title="Totals">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="invoice-subtotal">Subtotal</Label>
            <Input
              id="invoice-subtotal"
              value={formatCurrency(String(subtotal), invoice.currency)}
              readOnly
              className="tabular bg-muted"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice-tax-rate">Tax rate (%)</Label>
            <Input
              id="invoice-tax-rate"
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              step="0.01"
              value={invoice.taxRate ?? ""}
              onChange={(e) => handleTaxRateChange(e.target.value)}
              placeholder="0"
              className="tabular"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice-tax-amount">Tax amount</Label>
            <Input
              id="invoice-tax-amount"
              value={formatCurrency(invoice.taxAmount || "0", invoice.currency)}
              readOnly
              className="tabular bg-muted"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice-total">Total</Label>
            <Input
              id="invoice-total"
              value={formatCurrency(invoice.total || "0", invoice.currency)}
              readOnly
              className="tabular bg-muted font-semibold"
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
      </SectionCard>

      {/* Payments */}
      <SectionCard
        title="Payments"
        action={
          <span className="tabular text-muted-foreground text-sm">
            {balanceLabel}
          </span>
        }
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="invoice-payment-link">Payment link</Label>
            <Input
              id="invoice-payment-link"
              type="url"
              inputMode="url"
              autoComplete="off"
              value={invoice.paymentLinkUrl ?? ""}
              onChange={(e) =>
                handleChange("paymentLinkUrl", e.target.value || null)
              }
              placeholder="https://"
              aria-invalid={!!linkError}
              aria-describedby="invoice-payment-link-hint"
            />
            <p
              id="invoice-payment-link-hint"
              className={cn(
                "text-xs",
                linkError ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {linkError ??
                "Optional. Paste a checkout link from your payment provider, then copy it from the invoice page to share with your client."}
            </p>
          </div>

          {payments.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No payments recorded yet.
            </p>
          )}

          {payments.map((payment, index) => (
            <div
              key={payment.id}
              className="space-y-3 rounded-xl border border-border p-3 sm:p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-sm">Payment {index + 1}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleRemovePayment(index)}
                  className="text-destructive hover:text-destructive"
                  aria-label={`Remove payment ${index + 1}`}
                >
                  <Trash2Icon />
                </Button>
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
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={payment.amount ?? ""}
                    onChange={(e) =>
                      handlePaymentChange(index, "amount", e.target.value)
                    }
                    className="tabular"
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
                    placeholder="Check number, transfer ID"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`payment-method-${payment.id}`}>Method</Label>
                  <Input
                    id={`payment-method-${payment.id}`}
                    value={payment.method ?? ""}
                    onChange={(e) =>
                      handlePaymentChange(
                        index,
                        "method",
                        e.target.value || null,
                      )
                    }
                    placeholder="Check, wire, card, cash"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" size="sm" onClick={handleAddPayment}>
            <PlusIcon />
            Add payment
          </Button>
        </div>
      </SectionCard>

      {/* Notes */}
      <SectionCard title="Notes">
        <Label htmlFor="invoice-notes" className="sr-only">
          Notes
        </Label>
        <Textarea
          id="invoice-notes"
          value={invoice.notes ?? ""}
          onChange={(e) => handleChange("notes", e.target.value || null)}
          rows={3}
          placeholder="Payment terms, thank-you note, or anything else for the client"
        />
      </SectionCard>
    </div>
  );
};

export default InvoiceForm;
