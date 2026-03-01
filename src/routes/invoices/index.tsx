import { Link, createFileRoute } from "@tanstack/react-router";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import InvoiceForm from "@/features/invoices/components/InvoiceForm";
import InvoicePreview from "@/features/invoices/components/InvoicePreview";
import { useInvoiceStore } from "@/features/invoices/store/invoiceStore";
import {
  defaultInvoice,
  formatNumber,
  generateInvoiceId,
  getCurrentDate,
} from "@/features/invoices/types/invoice";

import type { StoredInvoice } from "@/features/invoices/store/invoiceStore";
import type { Invoice, InvoiceItem } from "@/features/invoices/types/invoice";

type ViewMode = "list" | "create" | "edit" | "preview";

const InvoicesPage = () => {
  const { invoices, createInvoice, updateInvoice, deleteInvoice } =
    useInvoiceStore();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>(defaultInvoice);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showHoursAndRate, setShowHoursAndRate] = useState(true);

  const handleCreateNew = () => {
    setCurrentInvoice({
      ...defaultInvoice,
      invoiceNumber: generateInvoiceId(),
      invoiceDate: getCurrentDate(),
    });
    setEditingId(null);
    setViewMode("create");
  };

  const handlePopulateOmni = () => {
    setCurrentInvoice({
      ...currentInvoice,
      company: {
        name: "Omni LLC",
        address: "Ste 1 202 N Cedar Ave",
        cityStateZip: "Owatonna, MN 55060-2306",
      },
    });
  };

  const handleEdit = (invoice: StoredInvoice) => {
    setCurrentInvoice(invoice);
    setEditingId(invoice.id);
    setViewMode("edit");
  };

  const handlePreview = (invoice: StoredInvoice) => {
    setCurrentInvoice(invoice);
    setEditingId(invoice.id);
    setViewMode("preview");
  };

  const handleSave = () => {
    if (editingId) {
      updateInvoice(editingId, currentInvoice);
    } else {
      createInvoice(currentInvoice);
    }
    setViewMode("list");
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this invoice?")) {
      deleteInvoice(id);
    }
  };

  const handleAddLineItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      description: "",
      hours: 1,
      rate: 0,
      amount: 0,
    };
    setCurrentInvoice({
      ...currentInvoice,
      items: [...currentInvoice.items, newItem],
    });
  };

  const calculateTotal = () => {
    return currentInvoice.items.reduce((sum, item) => sum + item.amount, 0);
  };

  if (viewMode === "list") {
    return (
      <div className="mx-auto max-w-6xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link to="/" className="text-gray-500 text-sm hover:text-gray-700">
              ← Back
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
                    Client
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700 text-sm">
                    Amount
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
                {invoices.map((invoice) => {
                  const total = invoice.items.reduce(
                    (sum, item) => sum + item.amount,
                    0,
                  );
                  const clientName =
                    invoice.client.billTo.split("\n")[0] || "—";

                  return (
                    <tr key={invoice.id} className="border-gray-100 border-t">
                      <td className="px-4 py-3 font-mono text-sm">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-4 py-3 text-sm">{clientName}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {invoice.invoiceDate}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-sm">
                        ${formatNumber(total)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs ${
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : invoice.status === "sent"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  if (viewMode === "preview") {
    return (
      <div className="mx-auto max-w-4xl p-8 print:max-w-none print:p-0">
        <div className="print-hide mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to list
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

        <InvoicePreview
          invoice={currentInvoice}
          total={calculateTotal()}
          onAddLineItem={handleAddLineItem}
          showHoursAndRate={showHoursAndRate}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMode("list")}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back to list
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode("list")}
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
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-xl">
              {editingId ? "Edit Invoice" : "New Invoice"}
            </h2>
            <button
              type="button"
              onClick={handlePopulateOmni}
              className="rounded border border-teal-600 px-3 py-1 text-sm text-teal-600 hover:bg-teal-50"
            >
              Populate with Omni
            </button>
          </div>
          <InvoiceForm
            invoice={currentInvoice}
            onInvoiceChange={setCurrentInvoice}
            onAddLineItem={handleAddLineItem}
            calculateTotal={calculateTotal}
          />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-xl">Preview</h2>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showHoursAndRate}
                onChange={(e) => setShowHoursAndRate(e.target.checked)}
                className="rounded"
              />
              Show hours/rate
            </label>
          </div>
          <InvoicePreview
            invoice={currentInvoice}
            total={calculateTotal()}
            onAddLineItem={handleAddLineItem}
            showHoursAndRate={showHoursAndRate}
          />
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/invoices/")({
  component: InvoicesPage,
});
