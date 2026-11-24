import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import SectionCard from "@/components/core/SectionCard";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
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
    <SectionCard title="Workspace credit" className="print:hidden">
      <dl className="grid grid-cols-2 gap-4">
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Available</dt>
          <dd className="tabular mt-0.5 truncate text-lg font-semibold">
            {formatCurrency(String(available), currency)}
          </dd>
        </div>
        <div className="min-w-0 text-right">
          <dt className="text-xs text-muted-foreground">Outstanding</dt>
          <dd className="tabular mt-0.5 truncate text-lg font-semibold">
            {formatCurrency(String(Math.max(outstanding, 0)), currency)}
          </dd>
        </div>
      </dl>

      {applied > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          <span className="tabular">
            {formatCurrency(String(applied), currency)}
          </span>{" "}
          applied to this invoice
        </p>
      )}

      {canApply && (
        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={() => setConfirmOpen(true)}
        >
          Apply {formatCurrency(applicable.toFixed(2), currency)} credit
        </Button>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="default"
        title="Apply workspace credit"
        description={`Apply ${formatCurrency(applicable.toFixed(2), currency)} of workspace credit to invoice ${invoice.invoiceNumber}? This cannot be undone.`}
        confirmLabel="Apply credit"
        loadingLabel="Applying..."
        closeOnConfirm={false}
        loading={applyMutation.isPending}
        onConfirm={handleApply}
      />
    </SectionCard>
  );
};

export default InvoiceCreditPanel;
