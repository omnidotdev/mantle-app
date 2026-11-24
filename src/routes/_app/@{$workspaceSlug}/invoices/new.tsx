import { useQueryClient } from "@tanstack/react-query";
import {
  Link,
  createFileRoute,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { ReceiptIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import BackLink from "@/components/core/BackLink";
import EmptyState from "@/components/core/EmptyState";
import LoadingState from "@/components/core/LoadingState";
import PageContainer from "@/components/core/PageContainer";
import { buttonVariants } from "@/components/ui/button";
import InvoiceEditorLayout from "@/features/invoices/components/InvoiceEditorLayout";
import InvoiceForm from "@/features/invoices/components/InvoiceForm";
import InvoicePreview from "@/features/invoices/components/InvoicePreview";
import { derivePaidFields } from "@/features/invoices/types/invoice";
import {
  useCreateInvoiceLineItemMutation,
  useCreateInvoiceMutation,
  useCreatePaymentMutation,
  useGenerateDocumentNumberMutation,
} from "@/generated/graphql";

import type {
  Invoice,
  InvoiceLineItem,
  Payment,
} from "@/features/invoices/types/invoice";

const defaultInvoice: Partial<Invoice> = {
  invoiceNumber: "",
  companyId: null,
  contactId: null,
  billTo: null,
  status: "draft",
  issueDate: "",
  dueDate: null,
  notes: null,
  subtotal: "0",
  taxRate: null,
  taxAmount: "0",
  total: "0",
  currency: "USD",
  paidAt: null,
  paymentReference: null,
  paymentLinkUrl: null,
};

const NewInvoicePage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const locationState = useLocation().state as
    | {
        duplicateFrom?: {
          invoice: Partial<Invoice>;
          lineItems: Partial<InvoiceLineItem>[];
        };
      }
    | undefined;
  const duplicateFrom = locationState?.duplicateFrom;

  const [saving, setSaving] = useState(false);
  const [generatingNumber, setGeneratingNumber] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const [currentInvoice, setCurrentInvoice] = useState<Partial<Invoice>>({
    ...defaultInvoice,
    issueDate: today,
    ...(duplicateFrom?.invoice ?? {}),
    status: "draft",
  });
  const [currentLineItems, setCurrentLineItems] = useState<
    Partial<InvoiceLineItem>[]
  >(
    duplicateFrom?.lineItems?.length
      ? duplicateFrom.lineItems.map((li) => ({
          ...li,
          id: crypto.randomUUID(),
        }))
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

  const [currentPayments, setCurrentPayments] = useState<Partial<Payment>[]>(
    [],
  );

  const generateNumber = useGenerateDocumentNumberMutation();
  const hasGenerated = useRef(false);

  useEffect(() => {
    if (organizationId && !hasGenerated.current) {
      hasGenerated.current = true;
      setGeneratingNumber(true);
      generateNumber
        .mutateAsync({
          input: { organizationId, documentType: "invoice" },
        })
        .then((result) => {
          const num = result.generateDocumentNumber?.documentNumber;
          if (num) {
            setCurrentInvoice((prev) => ({ ...prev, invoiceNumber: num }));
          }
        })
        .finally(() => setGeneratingNumber(false));
    }
  }, [organizationId, generateNumber]);

  const invalidateInvoices = () => {
    queryClient.invalidateQueries({
      queryKey: ["AllInvoices"],
    });
  };

  const createMutation = useCreateInvoiceMutation();
  const createLineItemMutation = useCreateInvoiceLineItemMutation();
  const createPaymentMutation = useCreatePaymentMutation();

  const saveLineItems = async (invoiceId: string) => {
    const validItems = currentLineItems.filter((item) =>
      item.description?.trim(),
    );

    await Promise.all(
      validItems.map((item, index) =>
        createLineItemMutation.mutateAsync({
          input: {
            invoiceLineItem: {
              invoiceId,
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

  const savePayments = async (invoiceId: string) => {
    const validPayments = currentPayments.filter(
      (payment) =>
        Number.parseFloat(payment.amount ?? "0") > 0 && payment.paidAt,
    );

    await Promise.all(
      validPayments.map((payment) =>
        createPaymentMutation.mutateAsync({
          input: {
            payment: {
              invoiceId,
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

      const result = await createMutation.mutateAsync({
        input: {
          invoice: {
            organizationId: organizationId ?? "",
            invoiceNumber: currentInvoice.invoiceNumber ?? "",
            companyId: currentInvoice.companyId || undefined,
            contactId: currentInvoice.contactId,
            billTo: currentInvoice.billTo,
            status: paid.status,
            issueDate: currentInvoice.issueDate
              ? new Date(currentInvoice.issueDate)
              : new Date(),
            dueDate: currentInvoice.dueDate
              ? new Date(currentInvoice.dueDate)
              : null,
            notes: currentInvoice.notes,
            subtotal: currentInvoice.subtotal,
            taxRate: currentInvoice.taxRate,
            taxAmount: currentInvoice.taxAmount,
            total: currentInvoice.total,
            currency: currentInvoice.currency ?? "USD",
            paidAt: paid.paidAt ? new Date(paid.paidAt) : null,
          },
        },
      });

      const newId = result.createInvoice?.invoice?.rowId;
      if (newId) {
        await saveLineItems(newId);
        await savePayments(newId);
      }

      invalidateInvoices();
      toast.success("Invoice saved");

      if (newId) {
        navigate({
          to: "/@{$workspaceSlug}/invoices/$invoiceId/edit",
          params: { workspaceSlug, invoiceId: newId },
        });
      }
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
          description="Select a workspace to create invoices."
        />
      </PageContainer>
    );
  }

  if (generatingNumber) {
    return (
      <PageContainer>
        <LoadingState label="Preparing invoice" />
      </PageContainer>
    );
  }

  return (
    <InvoiceEditorLayout
      title={duplicateFrom ? "Duplicate invoice" : "New invoice"}
      back={
        <BackLink to="/@{$workspaceSlug}/invoices" params={{ workspaceSlug }}>
          Invoices
        </BackLink>
      }
      renderCancel={(className) => (
        <Link
          to="/@{$workspaceSlug}/invoices"
          params={{ workspaceSlug }}
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
          autoNumberOnClientSelect
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

export const Route = createFileRoute("/_app/@{$workspaceSlug}/invoices/new")({
  component: NewInvoicePage,
  staticData: { title: "New invoice" },
});
