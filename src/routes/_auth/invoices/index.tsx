import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import {
  Download,
  Edit,
  Eye,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import ConfirmDialog from "@/components/ui/confirm-dialog";
import InvoiceForm from "@/features/invoices/components/InvoiceForm";
import InvoicePreview from "@/features/invoices/components/InvoicePreview";
import {
  generateInvoiceNumber,
  useInvoiceUIStore,
} from "@/features/invoices/store/invoiceStore";
import {
  INVOICE_STATUSES,
  formatCurrency,
  formatDate,
} from "@/features/invoices/types/invoice";
import {
  useAllInvoicesQuery,
  useCreateInvoiceLineItemMutation,
  useCreateInvoiceMutation,
  useDeleteInvoiceLineItemMutation,
  useDeleteInvoiceMutation,
  useUpdateInvoiceMutation,
} from "@/generated/graphql";

import type {
  Invoice,
  InvoiceLineItem,
} from "@/features/invoices/types/invoice";

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

const InvoicesPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { viewMode, editingId, setViewMode, setEditingId, reset } =
    useInvoiceUIStore();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
  }>({ open: false, id: "" });

  const previewRef = useRef<HTMLDivElement>(null);

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
          },
        ];
      }),
    [data],
  );

  const filteredInvoices = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return invoices.filter((inv) => {
      const matchesSearch =
        !term ||
        inv.invoiceNumber.toLowerCase().includes(term) ||
        (inv.company?.name ?? "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" || inv.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const filteredTotal = useMemo(
    () =>
      filteredInvoices.reduce(
        (sum, inv) => sum + (Number.parseFloat(inv.total) || 0),
        0,
      ),
    [filteredInvoices],
  );

  const invalidateInvoices = () => {
    queryClient.invalidateQueries({
      queryKey: useAllInvoicesQuery.getKey({
        organizationId: organizationId ?? "",
      }),
    });
  };

  const createMutation = useCreateInvoiceMutation();
  const updateMutation = useUpdateInvoiceMutation();
  const createLineItemMutation = useCreateInvoiceLineItemMutation();
  const deleteLineItemMutation = useDeleteInvoiceLineItemMutation();

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

  const deleteExistingLineItems = async () => {
    const existing = invoices.find((inv) => inv.id === editingId);
    if (!existing?.invoiceLineItems.length) return;

    await Promise.all(
      existing.invoiceLineItems.map((item) =>
        deleteLineItemMutation.mutateAsync({
          input: { rowId: item.id },
        }),
      ),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let newId: string | undefined;

      if (editingId) {
        await updateMutation.mutateAsync({
          input: {
            rowId: editingId,
            patch: {
              invoiceNumber: currentInvoice.invoiceNumber,
              companyId: currentInvoice.companyId || null,
              contactId: currentInvoice.contactId,
              billTo: currentInvoice.billTo,
              status: currentInvoice.status,
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
            },
          },
        });
        await deleteExistingLineItems();
        await saveLineItems(editingId);
      } else {
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

        newId = result.createInvoice?.invoice?.rowId;
        if (newId) {
          await saveLineItems(newId);
        }
      }

      invalidateInvoices();
      toast.success("Invoice saved");

      if (newId) {
        setEditingId(newId);
        setViewMode("edit");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save invoice";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    const el = previewRef.current;
    if (!el) return;

    toast.info("Generating PDF...");

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`invoice_${currentInvoice.invoiceNumber || "draft"}.pdf`);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleCancel = () => {
    reset();
  };

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Select an organization to view invoices</p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2
          className="h-8 w-8 animate-spin text-gray-400"
          aria-label="Loading invoices"
        />
      </div>
    );
  }

  // List view
  if (viewMode === "list") {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-semibold text-xl">Invoices</h1>
          <div className="flex items-center gap-3">
            <div className="rounded-md border border-gray-200 bg-white px-3 py-1.5">
              <p className="text-gray-500 text-xs">
                {filteredInvoices.length}{" "}
                {filteredInvoices.length === 1 ? "invoice" : "invoices"}
              </p>
              <p className="font-semibold">
                {formatCurrency(filteredTotal.toFixed(2))}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCreateNew}
              className="flex items-center gap-1.5 rounded-md bg-teal-600 px-3 py-1.5 text-sm text-white hover:bg-teal-700"
            >
              <Plus size={16} />
              New Invoice
            </button>
          </div>
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
            <div className="flex gap-4 border-gray-200 border-b p-4">
              <div className="relative flex-1">
                <Search
                  className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  aria-label="Search invoices"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-9 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
                className="cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">All statuses</option>
                {INVOICE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {filteredInvoices.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">No invoices match your filters</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="mt-2 text-sm text-teal-600 hover:text-teal-700"
                >
                  Clear filters
                </button>
              </div>
            ) : (
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
                    <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
                      Due Date
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
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-gray-100 border-t">
                      <td className="px-4 py-3 font-mono text-sm">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {invoice.company?.name ?? "\u2014"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {invoice.issueDate
                          ? formatDate(invoice.issueDate)
                          : "\u2014"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {invoice.dueDate
                          ? formatDate(invoice.dueDate)
                          : "\u2014"}
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
                            aria-label="Preview invoice"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(invoice)}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Edit invoice"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(invoice.id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Delete invoice"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        <ConfirmDialog
          open={deleteConfirm.open}
          onOpenChange={(open) =>
            setDeleteConfirm((prev) => ({ ...prev, open }))
          }
          title="Delete Invoice"
          description="Are you sure you want to delete this invoice? This action cannot be undone."
          onConfirm={() =>
            deleteMutation.mutate({ input: { rowId: deleteConfirm.id } })
          }
        />
      </div>
    );
  }

  // Preview view
  if (viewMode === "preview") {
    return (
      <div className="p-6 print:p-0">
        <div className="print-hide mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className="text-gray-500 text-sm hover:text-gray-700"
          >
            &larr; Back to list
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              <Download size={14} />
              Download PDF
            </button>
            <button
              type="button"
              onClick={() => {
                const originalTitle = document.title;
                document.title = `invoice_${currentInvoice.invoiceNumber}`;
                window.print();
                document.title = originalTitle;
              }}
              className="rounded-md bg-teal-600 px-3 py-1.5 text-sm text-white hover:bg-teal-700"
            >
              Print
            </button>
          </div>
        </div>

        <div ref={previewRef}>
          <InvoicePreview
            invoice={currentInvoice}
            lineItems={currentLineItems}
            organizationId={organizationId}
          />
        </div>
      </div>
    );
  }

  // Create/edit view
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMode("list")}
          className="text-gray-500 text-sm hover:text-gray-700"
        >
          &larr; Back to list
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-teal-600 px-3 py-1.5 text-sm text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Save Changes"
                : "Create Invoice"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-lg">
            {editingId ? "Edit Invoice" : "New Invoice"}
          </h2>
          <InvoiceForm
            invoice={currentInvoice}
            onInvoiceChange={setCurrentInvoice}
            lineItems={currentLineItems}
            onLineItemsChange={setCurrentLineItems}
            onSave={handleSave}
            onCancel={handleCancel}
            organizationId={organizationId}
          />
        </div>

        <div>
          <h2 className="mb-4 font-semibold text-lg">Preview</h2>
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

export const Route = createFileRoute("/_auth/invoices/")({
  component: InvoicesPage,
});
