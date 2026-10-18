import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Loader2, Printer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import InvoiceForm from "@/features/invoices/components/InvoiceForm";
import InvoicePreview from "@/features/invoices/components/InvoicePreview";
import { derivePaidFields } from "@/features/invoices/types/invoice";
import {
  useAllInvoicesQuery,
  useCreateInvoiceLineItemMutation,
  useCreatePaymentMutation,
  useDeleteInvoiceLineItemMutation,
  useDeletePaymentMutation,
  useUpdateInvoiceMutation,
} from "@/generated/graphql";

import type {
  Invoice,
  InvoiceLineItem,
  Payment,
} from "@/features/invoices/types/invoice";

const EditInvoicePage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug, invoiceId } = Route.useParams();
  const queryClient = useQueryClient();

  const [saving, setSaving] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Partial<Invoice>>({});
  const [currentLineItems, setCurrentLineItems] = useState<
    Partial<InvoiceLineItem>[]
  >([]);
  const [currentPayments, setCurrentPayments] = useState<Partial<Payment>[]>(
    [],
  );
  const [initialized, setInitialized] = useState(false);

  const { data, isLoading } = useAllInvoicesQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const invoices = useMemo(
    () =>
      (data?.invoices?.nodes ?? []).flatMap((node) => {
        if (!node) return [];

        return [
          {
            id: node.rowId,
            organizationId: node.organizationId,
            invoiceNumber: node.invoiceNumber,
            companyId: node.companyId ?? null,
            contactId: node.contactId ?? null,
            billTo: node.billTo ?? null,
            status: (node.status ?? "draft") as Invoice["status"],
            issueDate: node.issueDate,
            dueDate: node.dueDate ?? null,
            notes: node.notes ?? null,
            subtotal: node.subtotal ?? "0",
            taxRate: node.taxRate ?? null,
            taxAmount: node.taxAmount ?? "0",
            total: node.total ?? "0",
            currency: node.currency ?? "USD",
            paidAt: node.paidAt ?? null,
            paymentReference: node.paymentReference ?? null,
            paymentLinkUrl: node.paymentLinkUrl ?? null,
            createdAt: node.createdAt ?? "",
            updatedAt: node.updatedAt ?? "",
            company: node.company ?? null,
            contact: node.contact ?? null,
            invoiceLineItems: (node.invoiceLineItems.nodes ?? []).flatMap(
              (li) => {
                if (!li) return [];

                return [
                  {
                    id: li.rowId,
                    invoiceId: li.invoiceId,
                    productId: li.productId ?? null,
                    description: li.description,
                    quantity: li.quantity,
                    unitPrice: li.unitPrice,
                    amount: li.amount,
                    sortOrder: li.sortOrder ?? 0,
                  },
                ];
              },
            ),
            payments: (node.payments.nodes ?? []).flatMap((p) => {
              if (!p) return [];

              return [
                {
                  id: p.rowId,
                  invoiceId: p.invoiceId,
                  amount: p.amount,
                  paidAt: p.paidAt,
                  reference: p.reference ?? null,
                  method: p.method ?? null,
                },
              ];
            }),
          },
        ];
      }),
    [data],
  );

  const invoice = useMemo(
    () => invoices.find((inv) => inv.id === invoiceId),
    [invoices, invoiceId],
  );

  useEffect(() => {
    if (invoice && !initialized) {
      setCurrentInvoice(invoice);
      setCurrentLineItems(
        invoice.invoiceLineItems.length > 0
          ? invoice.invoiceLineItems
          : [
              {
                id: crypto.randomUUID(),
                description: "",
                quantity: "1",
                unitPrice: "0",
                amount: "0",
                sortOrder: 0,
              },
            ],
      );
      setCurrentPayments(invoice.payments);
      setInitialized(true);
    }
  }, [invoice, initialized]);

  const invalidateInvoices = () => {
    queryClient.invalidateQueries({
      queryKey: useAllInvoicesQuery.getKey({
        organizationId: organizationId ?? "",
      }),
    });
  };

  const updateMutation = useUpdateInvoiceMutation();
  const createLineItemMutation = useCreateInvoiceLineItemMutation();
  const deleteLineItemMutation = useDeleteInvoiceLineItemMutation();
  const createPaymentMutation = useCreatePaymentMutation();
  const deletePaymentMutation = useDeletePaymentMutation();

  const saveLineItems = async (id: string) => {
    const validItems = currentLineItems.filter((item) =>
      item.description?.trim(),
    );

    await Promise.all(
      validItems.map((item, index) =>
        createLineItemMutation.mutateAsync({
          input: {
            invoiceLineItem: {
              invoiceId: id,
              description: item.description ?? "",
              quantity: item.quantity ?? "1",
              unitPrice: item.unitPrice ?? "0",
              amount: item.amount ?? "0",
              sortOrder: index,
            },
          },
        }),
      ),
    );
  };

  const deleteExistingLineItems = async () => {
    const existing = invoices.find((inv) => inv.id === invoiceId);
    if (!existing?.invoiceLineItems.length) return;

    await Promise.all(
      existing.invoiceLineItems.map((item) =>
        deleteLineItemMutation.mutateAsync({
          input: { rowId: item.id },
        }),
      ),
    );
  };

  const savePayments = async (id: string) => {
    const validPayments = currentPayments.filter(
      (payment) =>
        Number.parseFloat(payment.amount ?? "0") > 0 && payment.paidAt,
    );

    await Promise.all(
      validPayments.map((payment) =>
        createPaymentMutation.mutateAsync({
          input: {
            payment: {
              invoiceId: id,
              amount: payment.amount ?? "0",
              paidAt: payment.paidAt ? new Date(payment.paidAt) : new Date(),
              reference: payment.reference ?? null,
              method: payment.method ?? null,
            },
          },
        }),
      ),
    );
  };

  const deleteExistingPayments = async () => {
    const existing = invoices.find((inv) => inv.id === invoiceId);
    if (!existing?.payments.length) return;

    await Promise.all(
      existing.payments.map((payment) =>
        deletePaymentMutation.mutateAsync({
          input: { rowId: payment.id },
        }),
      ),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const paid = derivePaidFields(
        currentInvoice.total ?? "0",
        currentInvoice.status ?? "draft",
        currentPayments.map((payment) => ({
          amount: payment.amount ?? "0",
          paidAt: payment.paidAt ?? "",
        })),
      );

      await updateMutation.mutateAsync({
        input: {
          rowId: invoiceId,
          patch: {
            invoiceNumber: currentInvoice.invoiceNumber,
            companyId: currentInvoice.companyId || null,
            contactId: currentInvoice.contactId,
            billTo: currentInvoice.billTo,
            status: paid.status,
            issueDate: currentInvoice.issueDate
              ? new Date(currentInvoice.issueDate)
              : undefined,
            dueDate: currentInvoice.dueDate
              ? new Date(currentInvoice.dueDate)
              : null,
            notes: currentInvoice.notes,
            subtotal: currentInvoice.subtotal,
            taxRate: currentInvoice.taxRate,
            taxAmount: currentInvoice.taxAmount,
            total: currentInvoice.total,
            currency: currentInvoice.currency,
            paidAt: paid.paidAt ? new Date(paid.paidAt) : null,
          },
        },
      });
      await deleteExistingLineItems();
      await saveLineItems(invoiceId);
      await deleteExistingPayments();
      await savePayments(invoiceId);

      invalidateInvoices();
      toast.success("Invoice saved");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save invoice";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          Select a workspace to edit invoices
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2
          className="h-8 w-8 animate-spin text-muted-foreground"
          aria-label="Loading invoice"
        />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6">
        <Link
          to="/@{$workspaceSlug}/invoices"
          params={{ workspaceSlug }}
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          &larr; Back to list
        </Link>
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">Invoice not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 print:p-0">
      <div className="print-hide sticky top-0 z-10 mb-6 flex items-center justify-between bg-background py-4">
        <Link
          to="/@{$workspaceSlug}/invoices"
          params={{ workspaceSlug }}
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          &larr; Back to list
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              const originalTitle = document.title;
              document.title = `invoice_${currentInvoice.invoiceNumber}`;
              window.print();
              document.title = originalTitle;
            }}
            className="flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
          >
            <Printer size={14} />
            Print
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2 print:block">
        <div className="rounded-lg border border-border bg-card p-6 print:hidden">
          <h2 className="mb-4 font-semibold text-lg">Edit Invoice</h2>
          <InvoiceForm
            invoice={currentInvoice}
            onInvoiceChange={setCurrentInvoice}
            lineItems={currentLineItems}
            onLineItemsChange={setCurrentLineItems}
            payments={currentPayments}
            onPaymentsChange={setCurrentPayments}
            onSave={handleSave}
            organizationId={organizationId}
          />
        </div>

        <div>
          <h2 className="mb-4 font-semibold text-lg print:hidden">Preview</h2>
          <InvoicePreview
            invoice={currentInvoice}
            lineItems={currentLineItems}
            payments={currentPayments}
            organizationId={organizationId}
          />
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute(
  "/_app/@{$workspaceSlug}/invoices/$invoiceId/edit",
)({
  component: EditInvoicePage,
});
