import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@omnidotdev/thornberry/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const separatorOptions = [
  { label: "Dash (-)", value: "-" },
  { label: "Slash (/)", value: "/" },
  { label: "None", value: "" },
];

const dateFormatOptions = [
  { label: "None", value: "none" },
  { label: "YYYY", value: "YYYY" },
  { label: "YYMM", value: "YYMM" },
  { label: "YYYYMM", value: "YYYYMM" },
];

const strategyLabels: Record<IdStrategy, string> = {
  sequential: "Sequential",
  random: "Random",
  timestamp: "Timestamp",
};

const StrategyToggle = ({
  value,
  onChange,
}: {
  value: IdStrategy;
  onChange: (v: IdStrategy) => void;
}) => (
  <div className="inline-flex rounded-lg border border-border bg-muted p-1">
    {(Object.keys(strategyLabels) as IdStrategy[]).map((strategy) => (
      <button
        key={strategy}
        type="button"
        onClick={() => onChange(strategy)}
        aria-pressed={value === strategy}
        className={`rounded-md px-3 py-1.5 font-medium text-sm transition-colors ${
          value === strategy
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {strategyLabels[strategy]}
      </button>
    ))}
  </div>
);

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
  const [saved, setSaved] = useState(false);

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
    setSaved(false);
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
    setSaved(true);
  };

  const preview = formatPreview(form as DocumentNumberingPreview);
  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${documentType}-global-prefix`}>
            Company Prefix
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
          <Select
            items={separatorOptions}
            value={form.separator}
            onValueChange={(v) => handleChange("separator", v)}
            itemToString={(item) => item.label}
            itemToValue={(item) => item.value}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select separator" />
            </SelectTrigger>
            <SelectContent>
              {separatorOptions.map((opt) => (
                <SelectItem key={opt.value || "none"} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${documentType}-date-format`}>Date Segment</Label>
          <Select
            items={dateFormatOptions}
            value={form.dateFormat ?? "none"}
            onValueChange={(v) =>
              handleChange("dateFormat", v === "none" ? null : v)
            }
            itemToString={(item) => item.label}
            itemToValue={(item) => item.value}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select date format" />
            </SelectTrigger>
            <SelectContent>
              {dateFormatOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>ID Strategy</Label>
          <StrategyToggle
            value={form.idStrategy}
            onChange={(v) => handleChange("idStrategy", v)}
          />
        </div>

        {form.idStrategy === "sequential" && (
          <div className="space-y-1.5">
            <Label htmlFor={`${documentType}-padding`}>
              Sequential Padding
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
              Random Length
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
            <Label>Timestamp</Label>
            <p className="text-muted-foreground text-sm">
              Uses the date and time each number is generated, e.g. 20260203
              {form.separator}115447.
            </p>
          </div>
        )}
      </div>

      {/* Live preview */}
      <div className="space-y-1.5">
        <Label>Preview</Label>
        <div className="rounded-md border border-border bg-muted/50 px-4 py-3">
          <code className="font-mono text-sm">{preview}</code>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-md bg-primary px-4 py-1.5 text-sm text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        {saved && (
          <span className="text-emerald-600 text-sm dark:text-emerald-400">
            Saved successfully
          </span>
        )}
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

  const configs = data?.documentNumberingConfigs?.nodes ?? [];
  const quoteConfig = configs.find((c) => c?.documentType === "quote");
  const invoiceConfig = configs.find((c) => c?.documentType === "invoice");

  return (
    <div className="mt-6 space-y-6 rounded-lg border border-border bg-card p-6">
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">
          Document Numbering
        </h3>
        <p className="text-muted-foreground text-sm">
          Configure the numbering format for quotes and invoices
        </p>
      </div>

      <TabsRoot defaultValue="quote">
        <TabsList>
          <TabsTrigger value="quote">Quotes</TabsTrigger>
          <TabsTrigger value="invoice">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="quote">
          <DocumentNumberingForm
            organizationId={organizationId}
            documentType="quote"
            existingConfig={quoteConfig}
          />
        </TabsContent>

        <TabsContent value="invoice">
          <DocumentNumberingForm
            organizationId={organizationId}
            documentType="invoice"
            existingConfig={invoiceConfig}
          />
        </TabsContent>
      </TabsRoot>
    </div>
  );
};

export default DocumentNumberingSettings;
