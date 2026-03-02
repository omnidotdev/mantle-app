import { Link, createFileRoute } from "@tanstack/react-router";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import InvoiceForm from "@/features/invoices/components/InvoiceForm";
import InvoicePreview from "@/features/invoices/components/InvoicePreview";
import {
  generateInvoiceNumber,
  useInvoiceStore,
} from "@/features/invoices/store/invoiceStore";
import { formatCurrency } from "@/features/invoices/types/invoice";

import type { StoredInvoice } from "@/features/invoices/store/invoiceStore";
import type {
  Invoice,
  InvoiceLineItem,
} from "@/features/invoices/types/invoice";

type ViewMode = "list" | "create" | "edit" | "preview";

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
  const { invoices, createInvoice, updateInvoice, deleteInvoice } =
    useInvoiceStore();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
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
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreateNew = () => {
    const invoiceNumber = generateInvoiceNumber(invoices as StoredInvoice[]);
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

  const handleEdit = (invoice: StoredInvoice) => {
    setCurrentInvoice(invoice);
    setCurrentLineItems(
      invoice.invoiceLineItems ?? [
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

  const handlePreview = (invoice: StoredInvoice) => {
    setCurrentInvoice(invoice);
    setCurrentLineItems(invoice.invoiceLineItems ?? []);
    setEditingId(invoice.id);
    setViewMode("preview");
  };

  const handleSave = () => {
    const invoiceData = {
      ...currentInvoice,
      invoiceNumber: currentInvoice.invoiceNumber ?? "",
      companyId: currentInvoice.companyId ?? "",
      status: currentInvoice.status ?? "draft",
      issueDate: currentInvoice.issueDate ?? "",
      dueDate: currentInvoice.dueDate ?? "",
      subtotal: currentInvoice.subtotal ?? "0",
      taxAmount: currentInvoice.taxAmount ?? "0",
      total: currentInvoice.total ?? "0",
      currency: currentInvoice.currency ?? "USD",
      invoiceLineItems: currentLineItems as InvoiceLineItem[],
    };

    if (editingId) {
      updateInvoice(editingId, invoiceData);
    } else {
      createInvoice(
        invoiceData as Omit<
          Invoice,
          "id" | "createdAt" | "updatedAt" | "organizationId"
        >,
      );
    }

    setViewMode("list");
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this invoice?")) {
      deleteInvoice(id);
    }
  };

  const handleCancel = () => {
    setViewMode("list");
    setEditingId(null);
  };

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
                      {invoice.companyId || "\u2014"}
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
            className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
          >
            {editingId ? "Save Changes" : "Create Invoice"}
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
