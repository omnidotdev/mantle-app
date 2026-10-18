import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import {
  Copy,
  Edit,
  Eye,
  FileText,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

import ConfirmDialog from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/ui/data-table";
import { invoiceListSearchSchema } from "@/features/invoices/searchParams";
import {
  INVOICE_STATUSES,
  formatCurrency,
  formatDate,
} from "@/features/invoices/types/invoice";
import {
  useAllInvoicesQuery,
  useDeleteInvoiceMutation,
} from "@/generated/graphql";
import { useUrlSort } from "@/lib/hooks/util/useUrlSort";
import { formatStatus } from "@/lib/utils";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import type { Invoice } from "@/features/invoices/types/invoice";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-primary-100 text-primary-700",
  viewed: "bg-indigo-100 text-indigo-700",
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  overdue: "bg-destructive/10 text-destructive",
  void: "bg-muted text-muted-foreground",
};

const DEFAULT_SORTING: SortingState = [{ id: "issueDate", desc: true }];

const InvoicesListPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug } = Route.useParams();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();

  const { search: searchTerm, status: statusFilter } = search;

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
  }>({ open: false, id: "" });

  const [sorting, setSorting] = useUrlSort({
    search,
    defaultSorting: DEFAULT_SORTING,
    navigate,
  });

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

  const deleteMutation = useDeleteInvoiceMutation({
    onSuccess: invalidateInvoices,
  });

  const columns = useMemo<ColumnDef<(typeof invoices)[number]>[]>(
    () => [
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const invoice = row.original;
          return (
            <div className="flex gap-2">
              <Link
                to="/@{$workspaceSlug}/invoices/$invoiceId"
                params={{ workspaceSlug, invoiceId: invoice.id }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Preview invoice"
              >
                <Eye size={16} />
              </Link>
              <Link
                to="/@{$workspaceSlug}/invoices/$invoiceId/edit"
                params={{ workspaceSlug, invoiceId: invoice.id }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Edit invoice"
              >
                <Edit size={16} />
              </Link>
              <button
                type="button"
                onClick={() =>
                  navigate({
                    to: "/@{$workspaceSlug}/invoices/new",
                    params: { workspaceSlug },
                    state: {
                      duplicateFrom: {
                        invoice: {
                          companyId: invoice.companyId,
                          contactId: invoice.contactId,
                          billTo: invoice.billTo,
                          notes: invoice.notes,
                          taxRate: invoice.taxRate,
                          currency: invoice.currency,
                        },
                        lineItems: invoice.invoiceLineItems.map((li) => ({
                          description: li.description,
                          quantity: li.quantity,
                          unitPrice: li.unitPrice,
                          amount: li.amount,
                          sortOrder: li.sortOrder,
                        })),
                      },
                    },
                  })
                }
                className="text-muted-foreground hover:text-foreground"
                aria-label="Duplicate invoice"
              >
                <Copy size={16} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm({ open: true, id: invoice.id })}
                className="text-destructive hover:text-destructive/80"
                aria-label="Delete invoice"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        },
      },
      {
        id: "invoiceNumber",
        accessorKey: "invoiceNumber",
        header: "Invoice #",
        cell: ({ getValue }) => (
          <span className="font-mono">{getValue<string>()}</span>
        ),
      },
      {
        id: "company",
        accessorFn: (row) => row.company?.name ?? "",
        header: "Company",
        cell: ({ row }) => row.original.company?.name ?? "—",
      },
      {
        id: "issueDate",
        accessorKey: "issueDate",
        header: "Issue Date",
        cell: ({ getValue }) => {
          const v = getValue<string | null>();
          return v ? formatDate(v) : "—";
        },
      },
      {
        id: "dueDate",
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ getValue }) => {
          const v = getValue<string | null>();
          return v ? formatDate(v) : "—";
        },
      },
      {
        id: "total",
        accessorFn: (row) => Number.parseFloat(row.total) || 0,
        header: "Total",
        meta: { align: "right" },
        cell: ({ row }) => (
          <span className="font-medium">
            {formatCurrency(row.original.total, row.original.currency)}
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <span
              className={`inline-block rounded-full px-2 py-1 text-xs ${statusColors[status] || statusColors.draft}`}
            >
              {formatStatus(status)}
            </span>
          );
        },
      },
    ],
    [navigate, workspaceSlug],
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
          aria-label="Loading invoices"
        />
      </div>
    );
  }

  return (
    <div className="min-w-0 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-xl">Invoices</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            {filteredInvoices.length}{" "}
            {filteredInvoices.length === 1 ? "invoice" : "invoices"}
            {" · "}
            {formatCurrency(filteredTotal.toFixed(2))}
          </p>
        </div>
        <Link
          to="/@{$workspaceSlug}/invoices/new"
          params={{ workspaceSlug }}
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-700"
        >
          <Plus size={16} />
          New Invoice
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-lg border-2 border-border border-dashed py-12 text-center">
          <FileText size={32} className="mx-auto mb-2 text-muted-foreground" />
          <p className="mb-4 text-muted-foreground">No invoices yet</p>
          <Link
            to="/@{$workspaceSlug}/invoices/new"
            params={{ workspaceSlug }}
            className="text-primary-600 hover:text-primary-700"
          >
            Create your first invoice
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <div className="flex min-w-[800px] gap-4 border-border border-b p-4">
            <div className="relative flex-1">
              <Search
                className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search invoices..."
                aria-label="Search invoices"
                value={searchTerm}
                onChange={(e) =>
                  navigate({
                    search: (prev) => ({ ...prev, search: e.target.value }),
                  })
                }
                className="w-full rounded-lg border border-input py-2 pr-4 pl-9 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) =>
                navigate({
                  search: (prev) => ({ ...prev, status: e.target.value }),
                })
              }
              aria-label="Filter by status"
              className="cursor-pointer appearance-none rounded-lg border border-input bg-card px-3 py-2 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All statuses</option>
              {INVOICE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
          </div>

          <DataTable
            data={filteredInvoices}
            columns={columns}
            sorting={sorting}
            onSortingChange={setSorting}
            minWidth="800px"
            emptyState={
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No invoices match your filters
                </p>
                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      search: {
                        search: "",
                        status: "all",
                        sortBy: undefined,
                        sortDir: undefined,
                      },
                    })
                  }
                  className="mt-2 text-primary-600 text-sm hover:text-primary-700"
                >
                  Clear filters
                </button>
              </div>
            }
          />
        </div>
      )}

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
        onConfirm={() =>
          deleteMutation.mutate({ input: { rowId: deleteConfirm.id } })
        }
      />
    </div>
  );
};

export const Route = createFileRoute("/_app/@{$workspaceSlug}/invoices/")({
  component: InvoicesListPage,
  validateSearch: zodValidator(invoiceListSearchSchema),
});
