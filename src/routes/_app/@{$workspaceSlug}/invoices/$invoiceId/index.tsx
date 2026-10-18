import { Link, createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

import InvoiceCreditPanel from "@/features/invoices/components/InvoiceCreditPanel";
import InvoicePreview from "@/features/invoices/components/InvoicePreview";
import { useAllInvoicesQuery } from "@/generated/graphql";

import type { Invoice } from "@/features/invoices/types/invoice";

const InvoicePreviewPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug, invoiceId } = Route.useParams();

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

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          Select a workspace to view invoices
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
          <Link
            to="/@{$workspaceSlug}/invoices/$invoiceId/edit"
            params={{ workspaceSlug, invoiceId }}
            className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => {
              const originalTitle = document.title;
              document.title = `invoice_${invoice.invoiceNumber}`;
              window.print();
              document.title = originalTitle;
            }}
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-700"
          >
            Print
          </button>
        </div>
      </div>

      <InvoiceCreditPanel invoice={invoice} organizationId={organizationId} />

      <div>
        <InvoicePreview
          invoice={invoice}
          lineItems={invoice.invoiceLineItems}
          payments={invoice.payments}
          organizationId={organizationId}
        />
      </div>
    </div>
  );
};

export const Route = createFileRoute(
  "/_app/@{$workspaceSlug}/invoices/$invoiceId/",
)({
  component: InvoicePreviewPage,
});
