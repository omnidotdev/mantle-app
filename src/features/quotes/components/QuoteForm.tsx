import { Input } from "@omnidotdev/thornberry/input";
import { Label } from "@omnidotdev/thornberry/label";
import { NativeSelect } from "@omnidotdev/thornberry/native-select";
import { Textarea } from "@omnidotdev/thornberry/textarea";
import {
  CheckIcon,
  Loader2Icon,
  PlusIcon,
  RefreshCwIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import PopulateButton from "@/components/core/PopulateButton";
import SectionCard from "@/components/core/SectionCard";
import SortableList from "@/components/core/SortableList";
import { Button } from "@/components/ui/button";
import {
  ACCENT_PRESETS,
  DEFAULT_ACCENT,
} from "@/features/invoices/types/accentColor";
import { formatCurrency } from "@/features/invoices/types/invoice";
import CompanyPicker from "@/features/people/components/CompanyPicker";
import ContactPicker from "@/features/people/components/ContactPicker";
import { useWorkspaceProfile } from "@/features/settings/hooks/useWorkspaceProfile";
import { useGenerateDocumentNumberMutation } from "@/generated/graphql";
import { profileSaveErrorMessage } from "@/lib/graphql/errors";
import cn, { formatStatus } from "@/lib/utils";
import { QUOTE_STATUSES, SOW_DEFAULTS } from "../types/quote";
import ListItemEditor from "./ListItemEditor";

import type { Quote, QuoteLineItem } from "../types/quote";

type IdStrategy = "sequential" | "random";

interface QuoteFormProps {
  quote: Partial<Quote>;
  onQuoteChange: (quote: Partial<Quote>) => void;
  lineItems: Partial<QuoteLineItem>[];
  onLineItemsChange: (items: Partial<QuoteLineItem>[]) => void;
  organizationId?: string;
  onRegenerateNumber?: (strategy: IdStrategy) => void;
  isRegenerating?: boolean;
  /**
   * When true, selecting a client regenerates the quote number from that
   * client's numbering scheme. Only enabled while creating (a draft not yet
   * saved), so editing an existing quote never silently renumbers it or
   * consumes a sequence number on every client change.
   */
  autoNumberOnClientSelect?: boolean;
}

/** Read-only computed field (amounts, totals) */
const readOnlyClass = "bg-muted tabular";

/**
 * Quote editor form. Saving and cancelling live in the page header (and the
 * phone action bar), so the form itself has no footer actions
 */
const QuoteForm = ({
  quote,
  onQuoteChange,
  lineItems,
  onLineItemsChange,
  organizationId,
  onRegenerateNumber,
  isRegenerating,
  autoNumberOnClientSelect = false,
}: QuoteFormProps) => {
  const generateNumberMutation = useGenerateDocumentNumberMutation();

  // Set the client company (and any related fields) and, on a new quote, pull
  // the number from that client's numbering scheme (server falls back to the
  // workspace default when the client has no override). Shared by the client
  // picker and the company dropdown so either path applies the scheme. Build on
  // nextQuote so the second update never drops the fields set by the first
  const applyCompany = async (companyId: string, extra: Partial<Quote>) => {
    const nextQuote = { ...quote, companyId, ...extra };
    onQuoteChange(nextQuote);

    if (autoNumberOnClientSelect && organizationId && companyId) {
      const result = await generateNumberMutation.mutateAsync({
        input: { organizationId, documentType: "quote", companyId },
      });
      const number = result.generateDocumentNumber?.documentNumber;
      if (number) {
        onQuoteChange({ ...nextQuote, quoteNumber: number });
      }
    }
  };
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

  const handleChange = (
    field: keyof Quote,
    value: string | string[] | null,
  ) => {
    onQuoteChange({ ...quote, [field]: value });
  };

  const handleLineItemChange = (
    index: number,
    field: keyof QuoteLineItem,
    value: string | number | string[] | null,
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
        } else if (value === "complimentary" || value === "included") {
          updatedItem.quantity = "1";
          updatedItem.unitPrice = "0";
          updatedItem.amount = "0";
        }

        // Populate SoW defaults for the new pricing type
        const sowDefaults = SOW_DEFAULTS[value as keyof typeof SOW_DEFAULTS];
        if (sowDefaults) {
          updatedItem.deliverables = sowDefaults.deliverables;
          updatedItem.acceptanceCriteria = sowDefaults.acceptanceCriteria;
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
        deliverables: SOW_DEFAULTS.fixed.deliverables,
        acceptanceCriteria: SOW_DEFAULTS.fixed.acceptanceCriteria,
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

  const activeAccent = orgProfile?.accentColor ?? DEFAULT_ACCENT;

  return (
    <div className="space-y-5">
      {/* Accent color */}
      <SectionCard title="Theme">
        <p className="mb-3 text-muted-foreground text-sm">
          Accent color for quotes and contracts in this workspace
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {ACCENT_PRESETS.map((preset) => {
            const isActive = activeAccent === preset.value;

            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => handleProfileChange("accentColor", preset.value)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                  isActive &&
                    "ring-2 ring-foreground ring-offset-2 ring-offset-card",
                )}
                style={{ backgroundColor: preset.value }}
                aria-label={preset.label}
                aria-pressed={isActive}
                title={preset.label}
              >
                {isActive && <CheckIcon className="size-3.5 text-base-50" />}
              </button>
            );
          })}
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={activeAccent}
              onChange={(e) =>
                handleProfileChange("accentColor", e.target.value)
              }
              className="size-8 cursor-pointer rounded-full border-0 bg-transparent p-0"
              aria-label="Custom accent color"
              title="Custom color"
            />
            <span className="font-mono text-muted-foreground text-xs">
              {activeAccent}
            </span>
          </div>
        </div>
      </SectionCard>

      {/* Quote details */}
      <SectionCard title="Quote details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="quote-title">Title (required)</Label>
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
            <Label htmlFor="quote-number">Quote number</Label>
            <div className="flex flex-wrap gap-2">
              <Input
                id="quote-number"
                value={quote.quoteNumber ?? ""}
                readOnly
                className="min-w-0 flex-1 basis-32 bg-muted font-mono"
              />
              {onRegenerateNumber && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => onRegenerateNumber("sequential")}
                    disabled={isRegenerating}
                    title="Generate sequential number"
                    aria-label="Generate sequential number"
                  >
                    {isRegenerating ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <RefreshCwIcon />
                    )}
                    Seq
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onRegenerateNumber("random")}
                    disabled={isRegenerating}
                    title="Generate random number"
                    aria-label="Generate random number"
                  >
                    {isRegenerating ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <RefreshCwIcon />
                    )}
                    Rand
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-status">Status</Label>
            <NativeSelect
              id="quote-status"
              value={quote.status ?? "draft"}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full"
            >
              {QUOTE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </NativeSelect>
          </div>
        </div>
      </SectionCard>

      {/* Client */}
      <SectionCard
        title="Client"
        action={
          <PopulateButton
            organizationId={organizationId}
            onPopulateClient={({
              companyId,
              contactId,
              contactName,
              contactEmail,
            }) =>
              applyCompany(companyId, {
                contactId: contactId ?? null,
                clientName: contactName ?? null,
                clientEmail: contactEmail ?? null,
              })
            }
          />
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Company</Label>
            <CompanyPicker
              value={quote.companyId ?? ""}
              onValueChange={(value) => applyCompany(value, {})}
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
            <Label htmlFor="quote-client-name">Client name</Label>
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
            <Label htmlFor="quote-client-email">Client email</Label>
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
      </SectionCard>

      {/* Project details */}
      <SectionCard title="Project details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="quote-project-type">Project type</Label>
            <NativeSelect
              id="quote-project-type"
              value={quote.projectType ?? ""}
              onChange={(e) =>
                handleChange("projectType", e.target.value || null)
              }
              className="w-full"
            >
              <option value="">Select type</option>
              <option value="web">Web application</option>
              <option value="mobile">Mobile application</option>
              <option value="desktop">Desktop application</option>
              <option value="api">API / backend</option>
              <option value="other">Other</option>
            </NativeSelect>
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
            <Label htmlFor="quote-valid-until">Valid until</Label>
            <Input
              id="quote-valid-until"
              type="date"
              value={quote.validUntil ?? ""}
              onChange={(e) => handleChange("validUntil", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-additional-items-label">
              Additional items section label
            </Label>
            <Input
              id="quote-additional-items-label"
              value={quote.additionalItemsLabel ?? ""}
              onChange={(e) =>
                handleChange("additionalItemsLabel", e.target.value || null)
              }
              placeholder="Additional deliverables"
            />
          </div>
        </div>
      </SectionCard>

      {/* Line items */}
      <SectionCard title="Line items">
        <div className="space-y-4">
          <SortableList
            items={lineItems}
            onReorder={onLineItemsChange}
            renderItem={(item, index) => (
              <div className="space-y-3 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm">
                    {index === 0
                      ? "Base development cost"
                      : `Item ${index + 1}`}
                  </span>
                  {lineItems.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleRemoveLineItem(index)}
                      className="text-muted-foreground hover:text-destructive"
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
                    placeholder={
                      index === 0
                        ? "e.g. Base development cost"
                        : "Item description"
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`item-subtitle-${item.id}`}>Detail</Label>
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
                      className="tabular"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`item-price-${item.id}`}>Unit price</Label>
                    <Input
                      id={`item-price-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice ?? "0"}
                      onChange={(e) =>
                        handleLineItemChange(index, "unitPrice", e.target.value)
                      }
                      className="tabular"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`item-amount-${item.id}`}>Amount</Label>
                    <Input
                      id={`item-amount-${item.id}`}
                      value={formatCurrency(item.amount || "0", quote.currency)}
                      readOnly
                      className={readOnlyClass}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`item-pricing-${item.id}`}>
                      Pricing type
                    </Label>
                    <NativeSelect
                      id={`item-pricing-${item.id}`}
                      value={item.pricingType ?? "fixed"}
                      onChange={(e) =>
                        handleLineItemChange(
                          index,
                          "pricingType",
                          e.target.value,
                        )
                      }
                      className="w-full"
                    >
                      <option value="fixed">Fixed</option>
                      <option value="hourly">Hourly</option>
                      <option value="royalty">Royalty</option>
                      <option value="complimentary">Complimentary</option>
                      <option value="included">Included</option>
                    </NativeSelect>
                  </div>
                </div>

                {/* Hourly fields */}
                {item.pricingType === "hourly" && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="space-y-1.5">
                      <Label htmlFor={`item-est-hrs-${item.id}`}>
                        Estimated hours
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
                        className="tabular"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`item-rate-${item.id}`}>
                        Hourly rate
                      </Label>
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
                        className="tabular"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`item-weekly-${item.id}`}>
                        Weekly cap (hrs)
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
                        className="tabular"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`item-monthly-${item.id}`}>
                        Monthly cap (hrs)
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
                        className="tabular"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`item-max-${item.id}`}>
                        Max cap (hrs)
                      </Label>
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
                        className="tabular"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`item-min-billing-${item.id}`}>
                        Min billing (min)
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
                        className="tabular"
                      />
                    </div>
                  </div>
                )}

                {/* Royalty fields */}
                {item.pricingType === "royalty" && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="space-y-1.5">
                      <Label htmlFor={`item-royalty-${item.id}`}>
                        Royalty %
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
                        className="tabular"
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
                        className="tabular"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`item-rtfu-${item.id}`}>Unit</Label>
                      <NativeSelect
                        id={`item-rtfu-${item.id}`}
                        value={item.royaltyTimeframeUnit ?? ""}
                        onChange={(e) =>
                          handleLineItemChange(
                            index,
                            "royaltyTimeframeUnit",
                            e.target.value || null,
                          )
                        }
                        className="w-full"
                      >
                        <option value="">Select</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                        <option value="perpetual">Perpetual</option>
                      </NativeSelect>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`item-threshold-${item.id}`}>
                        Threshold
                      </Label>
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
                        className="tabular"
                      />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <Label htmlFor={`item-buyout-${item.id}`}>
                        Buyout amount
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
                        className="tabular"
                      />
                    </div>
                  </div>
                )}

                {/* Scope of work */}
                <details className="group rounded-lg bg-muted/60 px-3 py-2">
                  <summary className="cursor-pointer font-medium text-muted-foreground text-sm hover:text-foreground">
                    Scope of work (
                    <span className="tabular">
                      {(item.deliverables?.length ?? 0) +
                        (item.acceptanceCriteria?.length ?? 0)}
                    </span>{" "}
                    items)
                  </summary>
                  <div className="mt-3 space-y-3 pb-1">
                    <div className="space-y-1.5">
                      <Label>Deliverables</Label>
                      <ListItemEditor
                        items={item.deliverables ?? []}
                        onChange={(items) =>
                          handleLineItemChange(
                            index,
                            "deliverables" as keyof QuoteLineItem,
                            items.length > 0 ? items : null,
                          )
                        }
                        placeholder="Add a deliverable"
                        removeLabel="Remove deliverable"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Acceptance criteria</Label>
                      <ListItemEditor
                        items={item.acceptanceCriteria ?? []}
                        onChange={(items) =>
                          handleLineItemChange(
                            index,
                            "acceptanceCriteria" as keyof QuoteLineItem,
                            items.length > 0 ? items : null,
                          )
                        }
                        placeholder="Add an acceptance criterion"
                        removeLabel="Remove criterion"
                      />
                    </div>
                  </div>
                </details>
              </div>
            )}
          />

          <Button variant="outline" size="sm" onClick={handleAddLineItem}>
            <PlusIcon />
            Add line item
          </Button>
        </div>
      </SectionCard>

      {/* Financials */}
      <SectionCard title="Financials">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="quote-subtotal">Subtotal</Label>
            <Input
              id="quote-subtotal"
              value={formatCurrency(String(subtotal), quote.currency)}
              readOnly
              className={readOnlyClass}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-tax-rate">Tax rate (%)</Label>
            <Input
              id="quote-tax-rate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={quote.taxRate ?? ""}
              onChange={(e) => handleTaxRateChange(e.target.value)}
              placeholder="0"
              className="tabular"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-tax-amount">Tax amount</Label>
            <Input
              id="quote-tax-amount"
              value={formatCurrency(quote.taxAmount || "0", quote.currency)}
              readOnly
              className={readOnlyClass}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quote-total">Total</Label>
            <Input
              id="quote-total"
              value={formatCurrency(quote.total || "0", quote.currency)}
              readOnly
              className={cn(readOnlyClass, "font-semibold")}
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
      </SectionCard>

      {/* Terms and notes */}
      <SectionCard title="Terms and notes">
        <div className="space-y-4">
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
            <Label>Additional terms</Label>
            <ListItemEditor
              items={quote.additionalTerms ?? []}
              onChange={(terms) =>
                handleChange("additionalTerms", terms.length > 0 ? terms : null)
              }
              placeholder="Add a term or condition"
              inputLabel="Add additional term"
              removeLabel="Remove term"
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
      </SectionCard>
    </div>
  );
};

export default QuoteForm;
