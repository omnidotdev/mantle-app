import { Portal } from "@ark-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@omnidotdev/thornberry/menu";
import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  CopyIcon,
  FileQuestionIcon,
  LinkIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  PrinterIcon,
  ReceiptIcon,
  Trash2Icon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import BackLink from "@/components/core/BackLink";
import EmptyState from "@/components/core/EmptyState";
import EmptyValue from "@/components/core/EmptyValue";
import LoadingState from "@/components/core/LoadingState";
import MobileActionBar from "@/components/core/MobileActionBar";
import PageContainer from "@/components/core/PageContainer";
import PageHeader from "@/components/core/PageHeader";
import SectionCard from "@/components/core/SectionCard";
import StatusBadge from "@/components/core/StatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import InvoiceCreditPanel from "@/features/invoices/components/InvoiceCreditPanel";
import InvoicePreview from "@/features/invoices/components/InvoicePreview";
import {
  appliedCredit,
  formatCurrency,
  formatShortDate,
  invoiceClientName,
  paidPercent,
  sumPayments,
  toDuplicateDraft,
} from "@/features/invoices/types/invoice";
import {
  useAllInvoicesQuery,
  useDeleteInvoiceMutation,
  useWorkspaceCreditsQuery,
} from "@/generated/graphql";
import { formatStatus } from "@/lib/utils";

import type {
  CreditTransactionKind,
  Invoice,
} from "@/features/invoices/types/invoice";

const InvoicePreviewPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug, invoiceId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isLoading } = useAllInvoicesQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  // Same query the credit panel uses, so this is served from the cache
  const { data: creditsData } = useWorkspaceCreditsQuery(
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

  const creditApplied = useMemo(
    () =>
      appliedCredit(
        (creditsData?.creditTransactions?.nodes ?? []).flatMap((node) =>
          node
            ? [
                {
                  amount: node.amount,
                  kind: node.kind as CreditTransactionKind,
                  invoiceId: node.invoiceId ?? null,
                },
              ]
            : [],
        ),
        invoiceId,
      ),
    [creditsData, invoiceId],
  );

  const deleteMutation = useDeleteInvoiceMutation();

  const handlePrint = () => {
    if (!invoice) return;
    const originalTitle = document.title;
    document.title = `invoice_${invoice.invoiceNumber}`;
    window.print();
    document.title = originalTitle;
  };

  const handleDuplicate = () => {
    if (!invoice) return;
    navigate({
      to: "/@{$workspaceSlug}/invoices/new",
      params: { workspaceSlug },
      state: { duplicateFrom: toDuplicateDraft(invoice) },
    });
  };

  const handleCopyPaymentLink = async () => {
    if (!invoice?.paymentLinkUrl) return;
    try {
      await navigator.clipboard.writeText(invoice.paymentLinkUrl);
      toast.success("Payment link copied");
    } catch {
      toast.error("Could not copy the payment link");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ input: { rowId: invoiceId } });
      await queryClient.invalidateQueries({
        queryKey: useAllInvoicesQuery.getKey({
          organizationId: organizationId ?? "",
        }),
      });
      toast.success("Invoice deleted");
      navigate({
        to: "/@{$workspaceSlug}/invoices",
        params: { workspaceSlug },
      });
    } catch {
      toast.error("Could not delete the invoice. Try again.");
    }
  };

  const backLink = (
    <BackLink to="/@{$workspaceSlug}/invoices" params={{ workspaceSlug }}>
      Invoices
    </BackLink>
  );

  if (!organizationId) {
    return (
      <PageContainer>
        <EmptyState
          icon={ReceiptIcon}
          title="No workspace selected"
          description="Select a workspace to view its invoices."
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

  const clientName = invoiceClientName(invoice);
  const contactName = [invoice.contact?.firstName, invoice.contact?.lastName]
    .filter(Boolean)
    .join(" ");
  const currency = invoice.currency || "USD";
  const total = Number.parseFloat(invoice.total) || 0;
  const paid = sumPayments(invoice.payments) + creditApplied;
  const balance = Math.max(total - paid, 0);
  const percent = paidPercent(total, paid);
  const taxRate = Number.parseFloat(invoice.taxRate ?? "");

  return (
    <PageContainer>
      <PageHeader
        back={backLink}
        title={<span className="tabular">{invoice.invoiceNumber}</span>}
        badge={<StatusBadge status={invoice.status} />}
        description={
          <>
            {clientName ?? "No client yet"}
            {" · "}
            {invoice.dueDate
              ? `due ${formatShortDate(invoice.dueDate)}`
              : "no due date"}
          </>
        }
        actions={
          <div className="hidden md:flex md:flex-wrap md:items-center md:gap-2">
            <Link
              to="/@{$workspaceSlug}/invoices/$invoiceId/edit"
              params={{ workspaceSlug, invoiceId }}
              className={buttonVariants({ variant: "outline" })}
            >
              <PencilIcon />
              Edit
            </Link>
            <Button variant="outline" onClick={handleDuplicate}>
              <CopyIcon />
              Duplicate
            </Button>
            {invoice.paymentLinkUrl && (
              <Button variant="outline" onClick={handleCopyPaymentLink}>
                <LinkIcon />
                Copy payment link
              </Button>
            )}
            <Button onClick={handlePrint}>
              <PrinterIcon />
              Print or save PDF
            </Button>
          </div>
        }
      />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_20rem] print:block">
        <InvoicePreview
          invoice={invoice}
          lineItems={invoice.invoiceLineItems}
          payments={invoice.payments}
          organizationId={organizationId}
        />

        <aside className="grid gap-5 md:grid-cols-2 xl:grid-cols-1 print:hidden">
          <SectionCard>
            <p className="text-muted-foreground text-sm">
              {balance > 0 ? "Balance due" : "Balance"}
            </p>
            <p className="tabular mt-1 font-bold text-[1.75rem] leading-9 tracking-tight">
              {formatCurrency(String(balance), currency)}
            </p>
            <div
              role="meter"
              aria-label="Amount paid"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-valuetext={`${percent}% paid`}
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-success transition-[width]"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-1.5 text-muted-foreground text-xs">
              <span className="tabular">
                {formatCurrency(String(paid), currency)}
              </span>{" "}
              of{" "}
              <span className="tabular">
                {formatCurrency(String(total), currency)}
              </span>{" "}
              paid
              {creditApplied > 0 && " (includes workspace credit)"}
            </p>
            {balance > 0 && (
              <Link
                to="/@{$workspaceSlug}/invoices/$invoiceId/edit"
                params={{ workspaceSlug, invoiceId }}
                className={buttonVariants({
                  variant: "outline",
                  className: "mt-4 w-full",
                })}
              >
                <PlusIcon />
                Record payment
              </Link>
            )}
          </SectionCard>

          <SectionCard title="Payments" flush>
            {invoice.payments.length === 0 ? (
              <p className="px-4 py-4 text-muted-foreground text-sm sm:px-5">
                No payments recorded yet
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {invoice.payments.map((payment) => (
                  <li
                    key={payment.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-sm">
                        {payment.method
                          ? formatStatus(payment.method)
                          : "Payment"}
                      </p>
                      <p className="truncate text-muted-foreground text-xs">
                        {[formatShortDate(payment.paidAt), payment.reference]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <span className="tabular shrink-0 font-medium text-sm">
                      {formatCurrency(payment.amount, currency)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <InvoiceCreditPanel
            invoice={invoice}
            organizationId={organizationId}
          />

          <SectionCard title="Details" flush>
            <dl className="grid gap-2.5 px-4 py-4 text-sm sm:px-5">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Client contact</dt>
                <dd className="truncate text-right">
                  {contactName || <EmptyValue />}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Issued</dt>
                <dd>{formatShortDate(invoice.issueDate)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Currency</dt>
                <dd>{currency}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Tax rate</dt>
                <dd className="tabular">
                  {Number.isFinite(taxRate) && taxRate > 0 ? (
                    `${taxRate}%`
                  ) : (
                    <EmptyValue />
                  )}
                </dd>
              </div>
            </dl>
          </SectionCard>
        </aside>
      </div>

      <MobileActionBar>
        <MenuRoot
          positioning={{ placement: "top-start", gutter: 8 }}
          onSelect={({ value }) => {
            if (value === "duplicate") handleDuplicate();
            if (value === "copy-link") handleCopyPaymentLink();
            if (value === "delete") setDeleteOpen(true);
          }}
        >
          <MenuTrigger
            aria-label="More actions"
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <MoreHorizontalIcon />
          </MenuTrigger>
          <Portal>
            <MenuPositioner>
              <MenuContent className="min-w-48">
                <MenuItem value="duplicate">
                  <CopyIcon />
                  Duplicate
                </MenuItem>
                {invoice.paymentLinkUrl && (
                  <MenuItem value="copy-link">
                    <LinkIcon />
                    Copy payment link
                  </MenuItem>
                )}
                <MenuSeparator />
                <MenuItem value="delete" variant="destructive">
                  <Trash2Icon />
                  Delete invoice
                </MenuItem>
              </MenuContent>
            </MenuPositioner>
          </Portal>
        </MenuRoot>
        <Link
          to="/@{$workspaceSlug}/invoices/$invoiceId/edit"
          params={{ workspaceSlug, invoiceId }}
          className={buttonVariants({
            variant: "outline",
            className: "flex-1",
          })}
        >
          <PencilIcon />
          Edit
        </Link>
        <Button className="flex-1" onClick={handlePrint}>
          <PrinterIcon />
          Save PDF
        </Button>
      </MobileActionBar>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete invoice ${invoice.invoiceNumber}?`}
        description="This permanently deletes the invoice. This cannot be undone."
        confirmLabel="Delete invoice"
        loadingLabel="Deleting..."
        closeOnConfirm={false}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </PageContainer>
  );
};

export const Route = createFileRoute(
  "/_app/@{$workspaceSlug}/invoices/$invoiceId/",
)({
  component: InvoicePreviewPage,
  staticData: { title: "Invoice" },
});
