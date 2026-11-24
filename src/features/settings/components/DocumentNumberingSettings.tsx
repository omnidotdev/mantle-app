import { Input } from "@omnidotdev/thornberry/input";
import { Label } from "@omnidotdev/thornberry/label";
import { OptionsSelect } from "@omnidotdev/thornberry/select";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import SectionCard from "@/components/core/SectionCard";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { formatPreview } from "@/features/settings/types/documentNumbering";
import {
  useCreateDocumentNumberingConfigMutation,
  useDocumentNumberingConfigsQuery,
  useUpdateDocumentNumberingConfigMutation,
} from "@/generated/graphql";

import type { DocumentNumberingPreview } from "@/features/settings/types/documentNumbering";

type DocumentType = "quote" | "invoice";

type IdStrategy = "sequential" | "random" | "timestamp";

type FormState = {
  globalPrefix: string;
  prefix: string;
  separator: string;
  dateFormat: string | null;
  idStrategy: IdStrategy;
  sequentialPadding: number;
  randomLength: number;
};

const defaultConfig: Record<DocumentType, FormState> = {
  quote: {
    globalPrefix: "",
    prefix: "QT",
    separator: "-",
    dateFormat: null,
    idStrategy: "sequential",
    sequentialPadding: 4,
    randomLength: 8,
  },
  invoice: {
    globalPrefix: "",
    prefix: "INV",
    separator: "-",
    dateFormat: null,
    idStrategy: "sequential",
    sequentialPadding: 4,
    randomLength: 8,
  },
};

// The select can't hold an empty value, so "no separator" uses a sentinel
const NO_SEPARATOR = "none";

const separatorOptions = [
  { label: "Dash (-)", value: "-" },
  { label: "Slash (/)", value: "/" },
  { label: "None", value: NO_SEPARATOR },
];

const dateFormatOptions = [
  { label: "None", value: "none" },
  { label: "YYYY", value: "YYYY" },
  { label: "YYMM", value: "YYMM" },
  { label: "YYYYMM", value: "YYYYMM" },
];

const strategyOptions: { value: IdStrategy; label: string }[] = [
  { value: "sequential", label: "Sequential" },
  { value: "random", label: "Random" },
  { value: "timestamp", label: "Timestamp" },
];

const documentTypeOptions: { value: DocumentType; label: string }[] = [
  { value: "quote", label: "Quotes" },
  { value: "invoice", label: "Invoices" },
];

const documentTypeNames: Record<DocumentType, string> = {
  quote: "Quote",
  invoice: "Invoice",
};

const DocumentNumberingForm = ({
  organizationId,
  documentType,
  existingConfig,
}: {
  organizationId: string;
  documentType: DocumentType;
  existingConfig?: {
    rowId: string;
    globalPrefix?: string | null;
    prefix: string;
    separator: string;
    dateFormat?: string | null;
    idStrategy: string;
    sequentialPadding: number;
    randomLength: number;
  } | null;
}) => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<FormState>(defaultConfig[documentType]);

  useEffect(() => {
    if (existingConfig) {
      setForm({
        globalPrefix: existingConfig.globalPrefix ?? "",
        prefix: existingConfig.prefix,
        separator: existingConfig.separator,
        dateFormat: existingConfig.dateFormat ?? null,
        idStrategy: (["sequential", "random", "timestamp"] as const).includes(
          existingConfig.idStrategy as IdStrategy,
        )
          ? (existingConfig.idStrategy as IdStrategy)
          : "sequential",
        sequentialPadding: existingConfig.sequentialPadding,
        randomLength: existingConfig.randomLength,
      });
    }
  }, [existingConfig]);

  const createMutation = useCreateDocumentNumberingConfigMutation();
  const updateMutation = useUpdateDocumentNumberingConfigMutation();

  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const patch = {
      globalPrefix: form.globalPrefix,
      prefix: form.prefix,
      separator: form.separator,
      dateFormat: form.dateFormat,
      idStrategy: form.idStrategy,
      sequentialPadding: form.sequentialPadding,
      randomLength: form.randomLength,
    };

    try {
      if (existingConfig?.rowId) {
        await updateMutation.mutateAsync({
          input: {
            rowId: existingConfig.rowId,
            patch,
          },
        });
      } else {
        await createMutation.mutateAsync({
          input: {
            documentNumberingConfig: {
              organizationId,
              documentType,
              ...patch,
            },
          },
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ["DocumentNumberingConfigs"],
      });
      toast.success(`${documentTypeNames[documentType]} numbering saved`);
    } catch {
      toast.error("Could not save numbering. Please try again.");
    }
  };

  const preview = formatPreview(form as DocumentNumberingPreview);
  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${documentType}-global-prefix`}>
            Company prefix
          </Label>
          <Input
            id={`${documentType}-global-prefix`}
            value={form.globalPrefix}
            onChange={(e) => handleChange("globalPrefix", e.target.value)}
            placeholder="e.g. ACME"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${documentType}-prefix`}>Prefix</Label>
          <Input
            id={`${documentType}-prefix`}
            value={form.prefix}
            onChange={(e) => handleChange("prefix", e.target.value)}
            placeholder="e.g. QT"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${documentType}-separator`}>Separator</Label>
          <OptionsSelect
            id={`${documentType}-separator`}
            value={form.separator || NO_SEPARATOR}
            options={separatorOptions}
            onValueChange={(v) =>
              handleChange("separator", v === NO_SEPARATOR ? "" : v)
            }
            placeholder="Select separator"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${documentType}-date-format`}>Date segment</Label>
          <OptionsSelect
            id={`${documentType}-date-format`}
            value={form.dateFormat ?? "none"}
            options={dateFormatOptions}
            onValueChange={(v) =>
              handleChange("dateFormat", v === "none" ? null : v)
            }
            placeholder="Select date format"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <span className="block font-medium text-sm leading-none">
            ID strategy
          </span>
          <SegmentedControl
            label="ID strategy"
            options={strategyOptions}
            value={form.idStrategy}
            onValueChange={(v) => handleChange("idStrategy", v)}
            className="w-fit"
          />
        </div>

        {form.idStrategy === "sequential" && (
          <div className="space-y-1.5">
            <Label htmlFor={`${documentType}-padding`}>
              Sequential padding
            </Label>
            <Input
              id={`${documentType}-padding`}
              type="number"
              min={1}
              max={10}
              value={form.sequentialPadding}
              onChange={(e) =>
                handleChange("sequentialPadding", Number(e.target.value))
              }
            />
          </div>
        )}

        {form.idStrategy === "random" && (
          <div className="space-y-1.5">
            <Label htmlFor={`${documentType}-random-length`}>
              Random length
            </Label>
            <Input
              id={`${documentType}-random-length`}
              type="number"
              min={4}
              max={12}
              value={form.randomLength}
              onChange={(e) =>
                handleChange("randomLength", Number(e.target.value))
              }
            />
          </div>
        )}

        {form.idStrategy === "timestamp" && (
          <div className="space-y-1.5">
            <span className="block font-medium text-sm leading-none">
              Timestamp
            </span>
            <p className="text-muted-foreground text-sm">
              Uses the date and time each number is generated, e.g. 20260203
              {form.separator}115447.
            </p>
          </div>
        )}
      </div>

      {/* Live preview */}
      <div className="space-y-1.5">
        <span className="block font-medium text-sm leading-none">Preview</span>
        <output
          aria-live="polite"
          className="block rounded-lg bg-muted px-4 py-3"
        >
          <code className="break-all font-mono text-sm">{preview}</code>
        </output>
      </div>

      <div className="flex justify-end border-border border-t pt-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="max-sm:w-full"
        >
          {isSaving
            ? "Saving"
            : `Save ${documentTypeNames[documentType].toLowerCase()} numbering`}
        </Button>
      </div>
    </div>
  );
};

const DocumentNumberingSettings = ({
  organizationId,
}: {
  organizationId: string;
}) => {
  const { data } = useDocumentNumberingConfigsQuery({ organizationId });

  const [documentType, setDocumentType] = useState<DocumentType>("quote");

  const configs = data?.documentNumberingConfigs?.nodes ?? [];
  const quoteConfig = configs.find((c) => c?.documentType === "quote");
  const invoiceConfig = configs.find((c) => c?.documentType === "invoice");

  return (
    <SectionCard title="Document numbering">
      <p className="text-muted-foreground text-sm">
        Choose how new quote and invoice numbers are built.
      </p>

      <SegmentedControl
        label="Document type"
        options={documentTypeOptions}
        value={documentType}
        onValueChange={setDocumentType}
        className="mt-4 mb-5 w-fit"
      />

      {/* Both forms stay mounted so unsaved edits survive switching */}
      <div hidden={documentType !== "quote"}>
        <DocumentNumberingForm
          organizationId={organizationId}
          documentType="quote"
          existingConfig={quoteConfig}
        />
      </div>
      <div hidden={documentType !== "invoice"}>
        <DocumentNumberingForm
          organizationId={organizationId}
          documentType="invoice"
          existingConfig={invoiceConfig}
        />
      </div>
    </SectionCard>
  );
};

export default DocumentNumberingSettings;
