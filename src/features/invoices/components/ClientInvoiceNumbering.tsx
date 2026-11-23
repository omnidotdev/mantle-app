import { Input } from "@omnidotdev/thornberry/input";
import { Label } from "@omnidotdev/thornberry/label";
import {
  SwitchControl,
  SwitchHiddenInput,
  SwitchRoot,
  SwitchThumb,
} from "@omnidotdev/thornberry/switch";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

const STRATEGIES = ["sequential", "random", "timestamp"] as const;
type Strategy = (typeof STRATEGIES)[number];

const coerceStrategy = (value?: string | null): Strategy =>
  STRATEGIES.includes(value as Strategy) ? (value as Strategy) : "sequential";

/**
 * Per-client invoice-number override. When off, the client uses the
 * workspace-wide numbering; when on, invoices for this client draw from their
 * own prefix and format. A new override inherits the workspace format (so a
 * timestamp workspace stays timestamp) and only the prefix and strategy differ
 */
const ClientInvoiceNumbering = ({
  organizationId,
  companyId,
}: ClientInvoiceNumberingProps) => {
  const queryClient = useQueryClient();

  const { data } = useDocumentNumberingConfigsQuery({ organizationId });

  const configs = data?.documentNumberingConfigs?.nodes;
  const existing = configs?.find(
    (node) => node?.documentType === "invoice" && node?.companyId === companyId,
  );
  const workspaceDefault = configs?.find(
    (node) => node?.documentType === "invoice" && !node?.companyId,
  );

  // Format fields inherited from the workspace default (only prefix and
  // strategy are overridable per client)
  const base = {
    globalPrefix: workspaceDefault?.globalPrefix ?? "",
    separator: workspaceDefault?.separator ?? "-",
    dateFormat: workspaceDefault?.dateFormat ?? null,
    sequentialPadding: workspaceDefault?.sequentialPadding ?? 4,
    randomLength: workspaceDefault?.randomLength ?? 8,
  };

  const [enabled, setEnabled] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [idStrategy, setIdStrategy] = useState<Strategy>("sequential");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized || !data) return;
    if (existing) {
      setEnabled(true);
      setPrefix(existing.prefix);
      setIdStrategy(coerceStrategy(existing.idStrategy));
    }
    setInitialized(true);
  }, [data, existing, initialized]);

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
    const fields = { prefix, idStrategy, ...base };
    try {
      if (existing?.rowId) {
        await updateMutation.mutateAsync({
          input: { rowId: existing.rowId, patch: fields },
        });
      } else {
        await createMutation.mutateAsync({
          input: {
            documentNumberingConfig: {
              organizationId,
              companyId,
              documentType: "invoice",
              ...fields,
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

    // A new override starts from the workspace format/strategy
    if (next && !existing) {
      setIdStrategy(coerceStrategy(workspaceDefault?.idStrategy));
    }

    // Turning it off removes the override so the client reverts to the
    // workspace default
    if (!next && existing?.rowId) {
      try {
        await deleteMutation.mutateAsync({ input: { rowId: existing.rowId } });
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

  const preview = formatPreview({ ...base, prefix, idStrategy });

  return (
    <div className="mt-6 space-y-4 rounded-lg border border-border bg-card p-6">
      <div className="space-y-1">
        <h3 className="font-medium text-foreground text-lg">
          Invoice Numbering
        </h3>
        <p className="text-muted-foreground text-sm">
          By default this client uses your workspace invoice numbering. Turn on
          a custom prefix and format to give this client its own invoice
          sequence.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <SwitchRoot
          ids={{ hiddenInput: "client-custom-numbering" }}
          checked={enabled}
          onCheckedChange={(details) => handleToggle(details.checked)}
        >
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchHiddenInput />
        </SwitchRoot>
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
              <Label>Format</Label>
              <div className="inline-flex rounded-lg border border-border bg-muted p-1">
                {STRATEGIES.map((strategy) => (
                  <button
                    key={strategy}
                    type="button"
                    onClick={() => setIdStrategy(strategy)}
                    aria-pressed={idStrategy === strategy}
                    className={`rounded-md px-3 py-1.5 font-medium text-sm capitalize transition-colors ${
                      idStrategy === strategy
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {strategy}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
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
