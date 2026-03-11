import { Check, Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";

import PopulateButton from "@/components/core/PopulateButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ACCENT_PRESETS,
  DEFAULT_ACCENT,
} from "@/features/invoices/types/accentColor";
import { formatCurrency } from "@/features/invoices/types/invoice";
import CompanyPicker from "@/features/people/components/CompanyPicker";
import ContactPicker from "@/features/people/components/ContactPicker";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import AdditionalTermsEditor from "./AdditionalTermsEditor";

import type { Quote, QuoteLineItem } from "../types/quote";

type IdStrategy = "sequential" | "random";

interface QuoteFormProps {
  quote: Partial<Quote>;
  onQuoteChange: (quote: Partial<Quote>) => void;
  lineItems: Partial<QuoteLineItem>[];
  onLineItemsChange: (items: Partial<QuoteLineItem>[]) => void;
  onSave: () => void;
  onCancel: () => void;
  organizationId?: string;
  onRegenerateNumber?: (strategy: IdStrategy) => void;
  isRegenerating?: boolean;
}

const QuoteForm = ({
  quote,
  onQuoteChange,
  lineItems,
  onLineItemsChange,
  onSave,
  onCancel,
  organizationId,
  onRegenerateNumber,
  isRegenerating,
}: QuoteFormProps) => {
  const { getProfileForOrg, updateProfile, createProfile } = useSettingsStore();
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
        companyName: "",
        contactName: "",
        contactTitle: null,
        email: "",
        phone: null,
        website: null,
        addressLine1: null,
        addressLine2: null,
        city: null,
        state: null,
        postalCode: null,
        country: null,
        logoUrl: null,
        registrationState: null,
        accentColor: value,
      });
    }
  };

  const handleChange = (
    field: keyof Quote,
    value: string | string[] | null,
  ) => {
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

      // Clear previous type's fields and set defaults when pricing type changes
      if (field === "pricingType") {
        // Clear hourly fields
        updatedItem.hourlyRate = null;
        updatedItem.weeklyCapHours = null;
        updatedItem.monthlyCapHours = null;
        updatedItem.maxCapHours = null;
        updatedItem.estimatedHours = null;
        updatedItem.minimumBillingMinutes = null;

        // Clear royalty fields
        updatedItem.royaltyPercentage = null;
        updatedItem.royaltyTimeframe = null;
        updatedItem.royaltyTimeframeUnit = null;
        updatedItem.royaltyThreshold = null;
        updatedItem.royaltyBuyoutAmount = null;

        // Set sensible defaults for the new type
        if (value === "hourly") {
          updatedItem.hourlyRate = "150";
          updatedItem.weeklyCapHours = "10";
          updatedItem.monthlyCapHours = "40";
          updatedItem.minimumBillingMinutes = "30";
        } else if (value === "royalty") {
          updatedItem.royaltyPercentage = "5";
          updatedItem.royaltyTimeframe = "12";
          updatedItem.royaltyTimeframeUnit = "months";
        } else if (value === "complimentary") {
          updatedItem.quantity = "1";
          updatedItem.unitPrice = "0";
          updatedItem.amount = "0";
        }
      }

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
    const taxRate = Number.parseFloat(quote.taxRate || "0") || 0;
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
      (sum, item) => sum + (Number.parseFloat(item.amount || "0") || 0),
      0,
    );
    const taxRate = Number.parseFloat(value || "0") || 0;
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
      {/* Accent color */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">Quote Theme</h3>
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

      {/* Quote details */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">Quote Details</h3>

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
            <div className="flex gap-2">
              <Input
                id="quote-number"
                value={quote.quoteNumber ?? ""}
                readOnly
                className="bg-muted"
              />
              {onRegenerateNumber && (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => onRegenerateNumber("sequential")}
                    disabled={isRegenerating}
                    title="Generate sequential number"
                    className="flex h-9 items-center gap-1 rounded-md border border-input px-2 text-muted-foreground text-xs hover:bg-muted hover:text-foreground disabled:opacity-50"
                  >
                    {isRegenerating ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <RefreshCw size={14} />
                    )}
                    Seq
                  </button>
                  <button
                    type="button"
                    onClick={() => onRegenerateNumber("random")}
                    disabled={isRegenerating}
                    title="Generate random number"
                    className="flex h-9 items-center gap-1 rounded-md border border-input px-2 text-muted-foreground text-xs hover:bg-muted hover:text-foreground disabled:opacity-50"
                  >
                    {isRegenerating ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <RefreshCw size={14} />
                    )}
                    Rand
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-status">Status</Label>
            <Input
              id="quote-status"
              value={quote.status ?? "draft"}
              readOnly
              className="bg-muted capitalize"
            />
          </div>
        </div>
      </div>

      {/* Client */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground text-lg">Client</h3>
          <PopulateButton
            organizationId={organizationId}
            onPopulateClient={({
              companyId,
              contactId,
              contactName,
              contactEmail,
            }) => {
              onQuoteChange({
                ...quote,
                companyId,
                contactId: contactId ?? null,
                clientName: contactName ?? null,
                clientEmail: contactEmail ?? null,
              });
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Company</Label>
            <CompanyPicker
              value={quote.companyId ?? ""}
              onValueChange={(value) => handleChange("companyId", value)}
              organizationId={organizationId}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Contact</Label>
            <ContactPicker
              value={quote.contactId ?? ""}
              onValueChange={(value) =>
                handleChange("contactId", value || null)
              }
              organizationId={organizationId}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-client-name">Client Name</Label>
            <Input
              id="quote-client-name"
              value={quote.clientName ?? ""}
              onChange={(e) =>
                handleChange("clientName", e.target.value || null)
              }
              placeholder="Client full name"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-client-email">Client Email</Label>
            <Input
              id="quote-client-email"
              type="email"
              value={quote.clientEmail ?? ""}
              onChange={(e) =>
                handleChange("clientEmail", e.target.value || null)
              }
              placeholder="client@example.com"
            />
          </div>
        </div>
      </div>

      {/* Project details */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">Project Details</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="quote-project-type">Project Type</Label>
            <select
              id="quote-project-type"
              value={quote.projectType ?? ""}
              onChange={(e) =>
                handleChange("projectType", e.target.value || null)
              }
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:text-sm"
            >
              <option value="">Select type</option>
              <option value="web">Web Application</option>
              <option value="mobile">Mobile Application</option>
              <option value="desktop">Desktop Application</option>
              <option value="api">API / Backend</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-time-range">Timeline</Label>
            <Input
              id="quote-time-range"
              value={quote.timeRange ?? ""}
              onChange={(e) =>
                handleChange("timeRange", e.target.value || null)
              }
              placeholder="e.g. 3-6 months"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-valid-until">Valid Until</Label>
            <Input
              id="quote-valid-until"
              type="date"
              value={quote.validUntil ?? ""}
              onChange={(e) => handleChange("validUntil", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-additional-items-label">
              Additional Items Section Label
            </Label>
            <Input
              id="quote-additional-items-label"
              value={quote.additionalItemsLabel ?? ""}
              onChange={(e) =>
                handleChange("additionalItemsLabel", e.target.value || null)
              }
              placeholder="Additional Features"
            />
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">Line Items</h3>

        {lineItems.map((item, index) => (
          <div
            key={item.id}
            className="space-y-3 rounded-lg border border-border p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground text-sm">
                {index === 0 ? "Base Development Cost" : `Item ${index + 1}`}
              </span>
              {lineItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveLineItem(index)}
                  className="text-destructive hover:text-destructive"
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
                placeholder={
                  index === 0
                    ? "e.g. Base Development Cost"
                    : "Item description"
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`item-subtitle-${item.id}`}>
                Detail / Sub-description
              </Label>
              <Textarea
                id={`item-subtitle-${item.id}`}
                value={item.subtitle ?? ""}
                onChange={(e) =>
                  handleLineItemChange(
                    index,
                    "subtitle",
                    e.target.value || null,
                  )
                }
                rows={2}
                placeholder={
                  index === 0
                    ? "e.g. Includes project setup, core development, testing, deployment, and 30 days of as-needed post-launch maintenance and support."
                    : "Optional detail text shown below the item"
                }
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
                  className="bg-muted"
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
                  <option value="complimentary">Complimentary</option>
                </select>
              </div>
            </div>

            {/* Hourly fields */}
            {item.pricingType === "hourly" && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="space-y-1.5">
                  <Label htmlFor={`item-est-hrs-${item.id}`}>
                    Estimated Hours
                  </Label>
                  <Input
                    id={`item-est-hrs-${item.id}`}
                    type="number"
                    min="0"
                    step="1"
                    value={item.estimatedHours ?? ""}
                    onChange={(e) =>
                      handleLineItemChange(
                        index,
                        "estimatedHours",
                        e.target.value || null,
                      )
                    }
                    placeholder="e.g. 200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`item-rate-${item.id}`}>Hourly Rate</Label>
                  <Input
                    id={`item-rate-${item.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.hourlyRate ?? ""}
                    onChange={(e) =>
                      handleLineItemChange(
                        index,
                        "hourlyRate",
                        e.target.value || null,
                      )
                    }
                    placeholder="$/hr"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`item-weekly-${item.id}`}>
                    Weekly Cap (hrs)
                  </Label>
                  <Input
                    id={`item-weekly-${item.id}`}
                    type="number"
                    min="0"
                    value={item.weeklyCapHours ?? ""}
                    onChange={(e) =>
                      handleLineItemChange(
                        index,
                        "weeklyCapHours",
                        e.target.value || null,
                      )
                    }
                    placeholder="e.g. 40"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`item-monthly-${item.id}`}>
                    Monthly Cap (hrs)
                  </Label>
                  <Input
                    id={`item-monthly-${item.id}`}
                    type="number"
                    min="0"
                    value={item.monthlyCapHours ?? ""}
                    onChange={(e) =>
                      handleLineItemChange(
                        index,
                        "monthlyCapHours",
                        e.target.value || null,
                      )
                    }
                    placeholder="e.g. 160"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`item-max-${item.id}`}>Max Cap (hrs)</Label>
                  <Input
                    id={`item-max-${item.id}`}
                    type="number"
                    min="0"
                    value={item.maxCapHours ?? ""}
                    onChange={(e) =>
                      handleLineItemChange(
                        index,
                        "maxCapHours",
                        e.target.value || null,
                      )
                    }
                    placeholder="Total max"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`item-min-billing-${item.id}`}>
                    Min Billing (min)
                  </Label>
                  <Input
                    id={`item-min-billing-${item.id}`}
                    type="number"
                    min="0"
                    step="5"
                    value={item.minimumBillingMinutes ?? ""}
                    onChange={(e) =>
                      handleLineItemChange(
                        index,
                        "minimumBillingMinutes",
                        e.target.value || null,
                      )
                    }
                    placeholder="e.g. 30"
                  />
                </div>
              </div>
            )}

            {/* Royalty fields */}
            {item.pricingType === "royalty" && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="space-y-1.5">
                  <Label htmlFor={`item-royalty-${item.id}`}>Royalty %</Label>
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
                <div className="space-y-1.5">
                  <Label htmlFor={`item-rtf-${item.id}`}>Timeframe</Label>
                  <Input
                    id={`item-rtf-${item.id}`}
                    type="number"
                    min="0"
                    value={item.royaltyTimeframe ?? ""}
                    onChange={(e) =>
                      handleLineItemChange(
                        index,
                        "royaltyTimeframe",
                        e.target.value || null,
                      )
                    }
                    placeholder="Duration"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`item-rtfu-${item.id}`}>Unit</Label>
                  <select
                    id={`item-rtfu-${item.id}`}
                    value={item.royaltyTimeframeUnit ?? ""}
                    onChange={(e) =>
                      handleLineItemChange(
                        index,
                        "royaltyTimeframeUnit",
                        e.target.value || null,
                      )
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:text-sm"
                  >
                    <option value="">Select</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                    <option value="perpetual">Perpetual</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`item-threshold-${item.id}`}>Threshold</Label>
                  <Input
                    id={`item-threshold-${item.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.royaltyThreshold ?? ""}
                    onChange={(e) =>
                      handleLineItemChange(
                        index,
                        "royaltyThreshold",
                        e.target.value || null,
                      )
                    }
                    placeholder="Revenue threshold"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor={`item-buyout-${item.id}`}>
                    Buyout Amount
                  </Label>
                  <Input
                    id={`item-buyout-${item.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.royaltyBuyoutAmount ?? ""}
                    onChange={(e) =>
                      handleLineItemChange(
                        index,
                        "royaltyBuyoutAmount",
                        e.target.value || null,
                      )
                    }
                    placeholder="One-time buyout"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

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
            <Label htmlFor="quote-subtotal">Subtotal</Label>
            <Input
              id="quote-subtotal"
              value={formatCurrency(String(subtotal), quote.currency)}
              readOnly
              className="bg-muted"
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
              className="bg-muted"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-total">Total</Label>
            <Input
              id="quote-total"
              value={formatCurrency(quote.total || "0", quote.currency)}
              readOnly
              className="bg-muted font-medium"
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
        <h3 className="font-medium text-foreground text-lg">Terms & Notes</h3>

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
          <Label>Additional Terms</Label>
          <AdditionalTermsEditor
            terms={quote.additionalTerms ?? []}
            onChange={(terms) =>
              handleChange("additionalTerms", terms.length > 0 ? terms : null)
            }
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
      <div className="flex justify-end gap-2 border-border border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-input px-4 py-2 hover:bg-muted"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!quote.title?.trim()}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default QuoteForm;
