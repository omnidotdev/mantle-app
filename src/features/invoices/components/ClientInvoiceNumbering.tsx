import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatPreview } from "@/features/settings/types/documentNumbering";
import {
  useCreateDocumentNumberingConfigMutation,
  useDeleteDocumentNumberingConfigMutation,
  useDocumentNumberingConfigsQuery,
  useUpdateDocumentNumberingConfigMutation,
} from "@/generated/graphql";

interface ClientInvoiceNumberingProps {
  organizationId: string;
  companyId: string;
}

/**
 * Per-client invoice-number override. When off, the client uses the
 * workspace-wide numbering; when on, invoices for this client draw from their
 * own prefix and sequence
 */
const ClientInvoiceNumbering = ({
  organizationId,
  companyId,
}: ClientInvoiceNumberingProps) => {
  const queryClient = useQueryClient();

  const { data } = useDocumentNumberingConfigsQuery({ organizationId });

  const existing = data?.documentNumberingConfigs?.nodes?.find(
    (node) => node?.documentType === "invoice" && node?.companyId === companyId,
  );

  const [enabled, setEnabled] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    if (existing) {
      setEnabled(true);
      setPrefix(existing.prefix);
    }
    setInitialized(true);
  }, [existing, initialized]);

  const createMutation = useCreateDocumentNumberingConfigMutation();
  const updateMutation = useUpdateDocumentNumberingConfigMutation();
  const deleteMutation = useDeleteDocumentNumberingConfigMutation();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: useDocumentNumberingConfigsQuery.getKey({ organizationId }),
    });

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleSave = async () => {
    try {
      if (existing?.rowId) {
        await updateMutation.mutateAsync({
          input: { rowId: existing.rowId, patch: { prefix } },
        });
      } else {
        await createMutation.mutateAsync({
          input: {
            documentNumberingConfig: {
              organizationId,
              companyId,
              documentType: "invoice",
              prefix,
            },
          },
        });
      }
      await invalidate();
      toast.success("Client invoice numbering saved");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save numbering",
      );
    }
  };

  const handleToggle = async (next: boolean) => {
    setEnabled(next);

    // Turning it off removes the override so the client reverts to the
    // workspace default
    if (!next && existing?.rowId) {
      try {
        await deleteMutation.mutateAsync({
          input: { rowId: existing.rowId },
        });
        setPrefix("");
        await invalidate();
        toast.success("Reverted to workspace numbering");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to remove numbering",
        );
      }
    }
  };

  const preview = formatPreview({
    globalPrefix: "",
    prefix,
    separator: "-",
    dateFormat: null,
    idStrategy: "sequential",
    sequentialPadding: 4,
    randomLength: 8,
  });

  return (
    <div className="mt-6 space-y-4 rounded-lg border border-border bg-card p-6">
      <div className="space-y-1">
        <h3 className="font-medium text-foreground text-lg">
          Invoice Numbering
        </h3>
        <p className="text-muted-foreground text-sm">
          By default this client uses your workspace invoice numbering. Turn on
          a custom prefix to give this client its own invoice sequence.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="client-custom-numbering"
          checked={enabled}
          onCheckedChange={handleToggle}
        />
        <Label htmlFor="client-custom-numbering">
          Custom invoice numbering for this client
        </Label>
      </div>

      {enabled && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="client-invoice-prefix">Prefix</Label>
              <Input
                id="client-invoice-prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="e.g. TDTS"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Preview</Label>
              <div className="rounded-md border border-border bg-muted/50 px-4 py-2">
                <code className="font-mono text-sm">{preview}</code>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !prefix.trim()}
            className="rounded-md bg-primary px-4 py-1.5 text-sm text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientInvoiceNumbering;
