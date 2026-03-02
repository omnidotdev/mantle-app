import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Edit, Eye, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import InvoiceForm from "@/features/invoices/components/InvoiceForm";
import InvoicePreview from "@/features/invoices/components/InvoicePreview";
import {
  generateInvoiceNumber,
  useInvoiceUIStore,
} from "@/features/invoices/store/invoiceStore";
import { formatCurrency } from "@/features/invoices/types/invoice";
import {
  useAllInvoicesQuery,
  useCreateInvoiceMutation,
  useDeleteInvoiceMutation,
  useUpdateInvoiceMutation,
} from "@/generated/graphql";

import type {
  Invoice,
  InvoiceLineItem,
} from "@/features/invoices/types/invoice";

// TODO: Replace with actual organization ID from auth context
const ORGANIZATION_ID = "default";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  viewed: "bg-indigo-100 text-indigo-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
  void: "bg-gray-100 text-gray-500",
};

const defaultInvoice: Partial<Invoice> = {
  invoiceNumber: "",
  companyId: "",
  contactId: null,
  status: "draft",
  issueDate: "",
  dueDate: "",
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

const InvoicesPage = () => {
  const { viewMode, editingId, setViewMode, setEditingId, reset } =
    useInvoiceUIStore();
  const queryClient = useQueryClient();

  const [currentInvoice, setCurrentInvoice] =
    useState<Partial<Invoice>>(defaultInvoice);
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

  const { data, isLoading } = useAllInvoicesQuery({
    organizationId: ORGANIZATION_ID,
  });

  const invoices = (data?.invoices?.nodes ?? []).flatMap((node) => {
    if (!node) return [];

    return [
      {
        id: node.rowId,
        organizationId: node.organizationId,
        invoiceNumber: node.invoiceNumber,
        companyId: node.companyId,
        contactId: node.contactId ?? null,
        status: (node.status ?? "draft") as Invoice["status"],
        issueDate: node.issueDate,
        dueDate: node.dueDate,
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
        invoiceLineItems: (node.invoiceLineItems.nodes ?? []).flatMap((li) => {
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
        }),
      },
    ];
  });

  const invalidateInvoices = () => {
    queryClient.invalidateQueries({
      queryKey: useAllInvoicesQuery.getKey({
        organizationId: ORGANIZATION_ID,
      }),
    });
  };

  const createMutation = useCreateInvoiceMutation({
    onSuccess: () => {
      invalidateInvoices();
      reset();
    },
  });

  const updateMutation = useUpdateInvoiceMutation({
    onSuccess: () => {
      invalidateInvoices();
      reset();
    },
  });

  const deleteMutation = useDeleteInvoiceMutation({
    onSuccess: invalidateInvoices,
  });

  const handleCreateNew = () => {
    const invoiceNumber = generateInvoiceNumber(invoices);
    const today = new Date().toISOString().split("T")[0];
    setCurrentInvoice({ ...defaultInvoice, invoiceNumber, issueDate: today });
    setCurrentLineItems([
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: "1",
        unitPrice: "0",
        amount: "0",
        sortOrder: 0,
      },
    ]);
    setEditingId(null);
    setViewMode("create");
  };

  const handleEdit = (invoice: (typeof invoices)[number]) => {
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
    setEditingId(invoice.id);
    setViewMode("edit");
  };

  const handlePreview = (invoice: (typeof invoices)[number]) => {
    setCurrentInvoice(invoice);
    setCurrentLineItems(invoice.invoiceLineItems);
    setEditingId(invoice.id);
    setViewMode("preview");
  };

  const handleSave = () => {
    if (editingId) {
      updateMutation.mutate({
        input: {
          rowId: editingId,
          patch: {
            invoiceNumber: currentInvoice.invoiceNumber,
            companyId: currentInvoice.companyId,
            contactId: currentInvoice.contactId,
            status: currentInvoice.status,
            issueDate: currentInvoice.issueDate
              ? new Date(currentInvoice.issueDate)
              : undefined,
            dueDate: currentInvoice.dueDate
              ? new Date(currentInvoice.dueDate)
              : undefined,
            notes: currentInvoice.notes,
            subtotal: currentInvoice.subtotal,
            taxRate: currentInvoice.taxRate,
            taxAmount: currentInvoice.taxAmount,
            total: currentInvoice.total,
            currency: currentInvoice.currency,
          },
        },
      });
    } else {
      createMutation.mutate({
        input: {
          invoice: {
            organizationId: ORGANIZATION_ID,
            invoiceNumber: currentInvoice.invoiceNumber ?? "",
            companyId: currentInvoice.companyId ?? "",
            status: currentInvoice.status ?? "draft",
            issueDate: currentInvoice.issueDate
              ? new Date(currentInvoice.issueDate)
              : new Date(),
            dueDate: currentInvoice.dueDate
              ? new Date(currentInvoice.dueDate)
              : new Date(),
            notes: currentInvoice.notes,
            subtotal: currentInvoice.subtotal,
            taxRate: currentInvoice.taxRate,
            taxAmount: currentInvoice.taxAmount,
            total: currentInvoice.total,
            currency: currentInvoice.currency ?? "USD",
          },
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this invoice?")) {
      deleteMutation.mutate({ input: { rowId: id } });
    }
  };

  const handleCancel = () => {
    reset();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-6xl items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // List view
  if (viewMode === "list") {
    return (
      <div className="mx-auto max-w-6xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link to="/" className="text-gray-500 text-sm hover:text-gray-700">
              &larr; Back
            </Link>
            <h1 className="font-bold text-2xl">Invoices</h1>
          </div>
          <button
            type="button"
            onClick={handleCreateNew}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
          >
            <Plus size={18} />
            New Invoice
          </button>
        </div>

        {invoices.length === 0 ? (
          <div className="rounded-lg border-2 border-gray-200 border-dashed py-12 text-center">
            <p className="mb-4 text-gray-500">No invoices yet</p>
            <button
              type="button"
              onClick={handleCreateNew}
              className="text-teal-600 hover:text-teal-700"
            >
              Create your first invoice
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
                    Invoice #
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
                    Issue Date
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700 text-sm">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-gray-100 border-t">
                    <td className="px-4 py-3 font-mono text-sm">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {invoice.company?.name ?? invoice.companyId ?? "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {invoice.issueDate}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-sm">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs ${
                          statusColors[invoice.status] || statusColors.draft
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handlePreview(invoice)}
                          className="text-gray-500 hover:text-gray-700"
                          title="Preview"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(invoice)}
                          className="text-gray-500 hover:text-gray-700"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(invoice.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // Preview view
  if (viewMode === "preview") {
    return (
      <div className="mx-auto max-w-4xl p-8 print:max-w-none print:p-0">
        <div className="print-hide mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className="text-gray-500 hover:text-gray-700"
          >
            &larr; Back to list
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                const originalTitle = document.title;
                document.title = `invoice_${currentInvoice.invoiceNumber}`;
                window.print();
                document.title = originalTitle;
              }}
              className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
            >
              Print
            </button>
          </div>
        </div>

        <InvoicePreview invoice={currentInvoice} lineItems={currentLineItems} />
      </div>
    );
  }

  // Create/edit view
  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMode("list")}
          className="text-gray-500 hover:text-gray-700"
        >
          &larr; Back to list
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={createMutation.isPending || updateMutation.isPending}
            className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : editingId
                ? "Save Changes"
                : "Create Invoice"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-xl">
            {editingId ? "Edit Invoice" : "New Invoice"}
          </h2>
          <InvoiceForm
            invoice={currentInvoice}
            onInvoiceChange={setCurrentInvoice}
            lineItems={currentLineItems}
            onLineItemsChange={setCurrentLineItems}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>

        <div>
          <h2 className="mb-4 font-bold text-xl">Preview</h2>
          <InvoicePreview
            invoice={currentInvoice}
            lineItems={currentLineItems}
          />
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/invoices/")({
  component: InvoicesPage,
});
