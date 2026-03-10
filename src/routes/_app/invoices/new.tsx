import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Printer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import InvoiceForm from "@/features/invoices/components/InvoiceForm";
import InvoicePreview from "@/features/invoices/components/InvoicePreview";
import {
  useCreateInvoiceLineItemMutation,
  useCreateInvoiceMutation,
  useGenerateDocumentNumberMutation,
} from "@/generated/graphql";

import type {
  Invoice,
  InvoiceLineItem,
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [saving, setSaving] = useState(false);
  const [generatingNumber, setGeneratingNumber] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const [currentInvoice, setCurrentInvoice] = useState<Partial<Invoice>>({
    ...defaultInvoice,
    issueDate: today,
  });
  const [currentLineItems, setCurrentLineItems] = useState<
    Partial<InvoiceLineItem>[]
  >([
    {
      id: crypto.randomUUID(),
      description: "",
      quantity: "1",
      unitPrice: "0",
      amount: "0",
      sortOrder: 0,
    },
  ]);

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

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await createMutation.mutateAsync({
        input: {
          invoice: {
            organizationId: organizationId ?? "",
            invoiceNumber: currentInvoice.invoiceNumber ?? "",
            companyId: currentInvoice.companyId || undefined,
            contactId: currentInvoice.contactId,
            billTo: currentInvoice.billTo,
            status: currentInvoice.status ?? "draft",
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
          },
        },
      });

      const newId = result.createInvoice?.invoice?.rowId;
      if (newId) {
        await saveLineItems(newId);
      }

      invalidateInvoices();
      toast.success("Invoice saved");

      if (newId) {
        navigate({
          to: "/invoices/$invoiceId/edit",
          params: { invoiceId: newId },
        });
      }
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
          Select an organization to create invoices
        </p>
      </div>
    );
  }

  if (generatingNumber) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2
          className="h-8 w-8 animate-spin text-muted-foreground"
          aria-label="Loading"
        />
      </div>
    );
  }

  return (
    <div className="p-6 print:p-0">
      <div className="print-hide mb-6 flex items-center justify-between">
        <Link
          to="/invoices"
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
            {saving ? "Saving..." : "Create Invoice"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2 print:block">
        <div className="rounded-lg border border-border bg-card p-6 print:hidden">
          <h2 className="mb-4 font-semibold text-lg">New Invoice</h2>
          <InvoiceForm
            invoice={currentInvoice}
            onInvoiceChange={setCurrentInvoice}
            lineItems={currentLineItems}
            onLineItemsChange={setCurrentLineItems}
            onSave={handleSave}
            organizationId={organizationId}
          />
        </div>

        <div>
          <h2 className="mb-4 font-semibold text-lg print:hidden">Preview</h2>
          <InvoicePreview
            invoice={currentInvoice}
            lineItems={currentLineItems}
            organizationId={organizationId}
          />
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_app/invoices/new")({
  component: NewInvoicePage,
});
