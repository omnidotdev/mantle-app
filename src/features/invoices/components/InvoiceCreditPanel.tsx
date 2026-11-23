import { ConfirmDialog } from "@omnidotdev/thornberry/confirm-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  appliedCredit,
  creditBalance,
  formatCurrency,
  invoiceBalance,
} from "@/features/invoices/types/invoice";
import {
  useAllInvoicesQuery,
  useApplyInvoiceCreditMutation,
  useWorkspaceCreditsQuery,
} from "@/generated/graphql";

import type {
  CreditTransactionKind,
  Invoice,
} from "@/features/invoices/types/invoice";

interface InvoiceCreditPanelProps {
  invoice: Invoice;
  organizationId: string;
}

/** Round a dollar amount to whole cents, avoiding floating-point drift */
const roundCents = (amount: number): number => Math.round(amount * 100) / 100;

/**
 * Workspace-credit panel on the invoice detail view: shows the available
 * balance and, when the invoice still has an outstanding balance and credit is
 * available, offers a confirmation-guarded action to draw it down
 */
const InvoiceCreditPanel = ({
  invoice,
  organizationId,
}: InvoiceCreditPanelProps) => {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data, isLoading } = useWorkspaceCreditsQuery(
    { organizationId },
    { enabled: !!organizationId },
  );

  const applyMutation = useApplyInvoiceCreditMutation();

  const currency = invoice.currency || "USD";

  const credits = useMemo(
    () =>
      (data?.creditTransactions?.nodes ?? []).flatMap((node) =>
        node
          ? [
              {
                amount: node.amount,
                currency: node.currency,
                kind: node.kind as CreditTransactionKind,
                invoiceId: node.invoiceId ?? null,
              },
            ]
          : [],
      ),
    [data],
  );

  const payments = useMemo(
    () =>
      (invoice.payments ?? []).map((payment) => ({ amount: payment.amount })),
    [invoice.payments],
  );

  const available = creditBalance(credits, currency);
  const applied = appliedCredit(credits, invoice.id);
  const outstanding = invoiceBalance(invoice.total, payments, applied);
  const applicable = roundCents(Math.min(available, Math.max(outstanding, 0)));

  const canApply = Math.round(applicable * 100) > 0 && !applyMutation.isPending;

  // Nothing to surface when the workspace has no credit and none was applied here
  if (isLoading || (available <= 0 && applied <= 0)) return null;

  const handleApply = async () => {
    try {
      await applyMutation.mutateAsync({
        input: { invoiceId: invoice.id, amount: applicable.toFixed(2) },
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: useWorkspaceCreditsQuery.getKey({ organizationId }),
        }),
        queryClient.invalidateQueries({
          queryKey: useAllInvoicesQuery.getKey({ organizationId }),
        }),
      ]);

      toast.success(
        `Applied ${formatCurrency(applicable.toFixed(2), currency)} of workspace credit`,
      );
      setConfirmOpen(false);
    } catch {
      toast.error("Could not apply workspace credit. Please try again.");
    }
  };

  return (
    <div className="mb-6 rounded-lg border border-border bg-card p-4 print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">Workspace credit</p>
          <p className="font-semibold text-foreground text-lg">
            {formatCurrency(String(available), currency)}
          </p>
          {applied > 0 && (
            <p className="text-muted-foreground text-sm">
              {formatCurrency(String(applied), currency)} applied to this
              invoice
            </p>
          )}
        </div>

        <div className="space-y-1 text-right">
          <p className="text-muted-foreground text-sm">Outstanding</p>
          <p className="font-semibold text-foreground text-lg">
            {formatCurrency(String(Math.max(outstanding, 0)), currency)}
          </p>
        </div>
      </div>

      {canApply && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-700"
          >
            Apply {formatCurrency(applicable.toFixed(2), currency)} credit
          </button>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        confirmVariant="solid"
        title="Apply workspace credit"
        description={`Apply ${formatCurrency(applicable.toFixed(2), currency)} of workspace credit to invoice ${invoice.invoiceNumber}? This cannot be undone.`}
        confirmLabel="Apply credit"
        pendingLabel="Applying..."
        isPending={applyMutation.isPending}
        onConfirm={handleApply}
      />
    </div>
  );
};

export default InvoiceCreditPanel;
