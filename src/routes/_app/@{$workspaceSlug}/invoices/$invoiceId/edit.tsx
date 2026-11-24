import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { FileQuestionIcon, ReceiptIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import BackLink from "@/components/core/BackLink";
import EmptyState from "@/components/core/EmptyState";
import LoadingState from "@/components/core/LoadingState";
import PageContainer from "@/components/core/PageContainer";
import { buttonVariants } from "@/components/ui/button";
import InvoiceEditorLayout from "@/features/invoices/components/InvoiceEditorLayout";
import InvoiceForm from "@/features/invoices/components/InvoiceForm";
import InvoicePreview from "@/features/invoices/components/InvoicePreview";
import {
  derivePaidFields,
  paymentLinkError,
} from "@/features/invoices/types/invoice";
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
    const linkError = paymentLinkError(currentInvoice.paymentLinkUrl);
    if (linkError) {
      toast.error(`Payment link: ${linkError}`);
      return;
    }

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
            paymentLinkUrl: currentInvoice.paymentLinkUrl?.trim() || null,
          },
        },
      });
      await deleteExistingLineItems();
      await saveLineItems(invoiceId);
      await deleteExistingPayments();
      await savePayments(invoiceId);

      invalidateInvoices();
      toast.success("Invoice saved");
    } catch {
      toast.error("Could not save the invoice. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!organizationId) {
    return (
      <PageContainer>
        <EmptyState
          icon={ReceiptIcon}
          title="No workspace selected"
          description="Select a workspace to edit invoices."
        />
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState label="Loading invoice" />
      </PageContainer>
    );
  }

  if (!invoice) {
    return (
      <PageContainer>
        <EmptyState
          icon={FileQuestionIcon}
          title="Invoice not found"
          description="It may have been deleted, or the link is out of date."
          action={
            <Link
              to="/@{$workspaceSlug}/invoices"
              params={{ workspaceSlug }}
              className={buttonVariants({ variant: "outline" })}
            >
              Back to invoices
            </Link>
          }
        />
      </PageContainer>
    );
  }

  return (
    <InvoiceEditorLayout
      title={
        <>
          Edit <span className="tabular">{invoice.invoiceNumber}</span>
        </>
      }
      back={
        <BackLink
          to="/@{$workspaceSlug}/invoices/$invoiceId"
          params={{ workspaceSlug, invoiceId }}
        >
          {invoice.invoiceNumber}
        </BackLink>
      }
      renderCancel={(className) => (
        <Link
          to="/@{$workspaceSlug}/invoices/$invoiceId"
          params={{ workspaceSlug, invoiceId }}
          className={buttonVariants({ variant: "outline", className })}
        >
          Cancel
        </Link>
      )}
      onSave={handleSave}
      saving={saving}
      printTitle={`invoice_${currentInvoice.invoiceNumber}`}
      form={
        <InvoiceForm
          invoice={currentInvoice}
          onInvoiceChange={setCurrentInvoice}
          lineItems={currentLineItems}
          onLineItemsChange={setCurrentLineItems}
          payments={currentPayments}
          onPaymentsChange={setCurrentPayments}
          organizationId={organizationId}
        />
      }
      preview={
        <InvoicePreview
          invoice={currentInvoice}
          lineItems={currentLineItems}
          payments={currentPayments}
          organizationId={organizationId}
        />
      }
    />
  );
};

export const Route = createFileRoute(
  "/_app/@{$workspaceSlug}/invoices/$invoiceId/edit",
)({
  component: EditInvoicePage,
  staticData: { title: "Edit invoice" },
});
