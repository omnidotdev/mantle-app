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
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import ConfirmDialog from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency } from "@/features/invoices/types/invoice";
import { quoteListSearchSchema } from "@/features/quotes/searchParams";
import { QUOTE_STATUSES } from "@/features/quotes/types/quote";
import {
  useAllCompaniesQuery,
  useAllQuotesQuery,
  useDeleteQuoteMutation,
} from "@/generated/graphql";
import { useUrlSort } from "@/lib/hooks/util/useUrlSort";
import { formatStatus } from "@/lib/utils";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import type { Quote, QuoteLineItem } from "@/features/quotes/types/quote";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-primary-100 text-primary-700",
  accepted:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  declined: "bg-destructive/10 text-destructive",
  expired:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  converted: "bg-secondary-100 text-secondary-700",
};

const DEFAULT_SORTING: SortingState = [{ id: "validUntil", desc: true }];

const QuotesListPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug } = Route.useParams();
  const search = Route.useSearch();
  const { search: searchTerm, status: statusFilter } = search;
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
  }>({ open: false, id: "" });

  const [sorting, setSorting] = useUrlSort({
    search,
    defaultSorting: DEFAULT_SORTING,
    navigate,
  });

  const { data, isLoading } = useAllQuotesQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const { data: companiesData } = useAllCompaniesQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const quotes = useMemo(
    () =>
      (data?.quotes?.nodes ?? []).flatMap((node) => {
        if (!node) return [];
        return [
          {
            id: node.rowId,
            organizationId: node.organizationId,
            quoteNumber: node.quoteNumber,
            companyId: node.companyId ?? null,
            contactId: node.contactId ?? null,
            title: node.title,
            description: node.description ?? null,
            status: (node.status ?? "draft") as Quote["status"],
            validUntil: node.validUntil ?? "",
            terms: node.terms ?? null,
            notes: node.notes ?? null,
            subtotal: node.subtotal ?? "0",
            taxRate: node.taxRate ?? null,
            taxAmount: node.taxAmount ?? "0",
            total: node.total ?? "0",
            currency: node.currency ?? "USD",
            convertedInvoiceId: node.convertedInvoiceId ?? null,
            projectType: node.projectType ?? null,
            timeRange: node.timeRange ?? null,
            additionalTerms: (node.additionalTerms as string[]) ?? null,
            additionalItemsLabel: node.additionalItemsLabel ?? null,
            clientName: node.clientName ?? null,
            clientEmail: node.clientEmail ?? null,
            createdAt: node.createdAt ?? "",
            updatedAt: node.updatedAt ?? "",
            company: node.company ?? null,
            contact: node.contact ?? null,
            quoteLineItems: (node.quoteLineItems.nodes ?? []).flatMap((li) => {
              if (!li) return [];
              return [
                {
                  id: li.rowId,
                  quoteId: li.quoteId,
                  productId: li.productId ?? null,
                  description: li.description,
                  subtitle: li.subtitle ?? null,
                  quantity: li.quantity,
                  unitPrice: li.unitPrice,
                  amount: li.amount,
                  pricingType: (li.pricingType ??
                    "fixed") as QuoteLineItem["pricingType"],
                  estimatedHours: li.estimatedHours ?? null,
                  royaltyPercentage: li.royaltyPercentage ?? null,
                  hourlyRate: li.hourlyRate ?? null,
                  weeklyCapHours:
                    li.weeklyCapHours != null
                      ? String(li.weeklyCapHours)
                      : null,
                  monthlyCapHours:
                    li.monthlyCapHours != null
                      ? String(li.monthlyCapHours)
                      : null,
                  maxCapHours:
                    li.maxCapHours != null ? String(li.maxCapHours) : null,
                  minimumBillingMinutes:
                    li.minimumBillingMinutes != null
                      ? String(li.minimumBillingMinutes)
                      : null,
                  royaltyTimeframe:
                    li.royaltyTimeframe != null
                      ? String(li.royaltyTimeframe)
                      : null,
                  royaltyTimeframeUnit:
                    (li.royaltyTimeframeUnit as QuoteLineItem["royaltyTimeframeUnit"]) ??
                    null,
                  royaltyThreshold: li.royaltyThreshold ?? null,
                  royaltyBuyoutAmount: li.royaltyBuyoutAmount ?? null,
                  sortOrder: li.sortOrder ?? 0,
                },
              ];
            }),
          },
        ];
      }),
    [data],
  );

  const companies = useMemo(
    () =>
      (companiesData?.companies?.nodes ?? []).flatMap((node) => {
        if (!node) return [];
        return [{ id: node.rowId, name: node.name }];
      }),
    [companiesData],
  );

  const resolveCompanyName = useCallback(
    (companyId: string | null | undefined) =>
      companies.find((c) => c.id === companyId)?.name ?? null,
    [companies],
  );

  const filteredQuotes = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return quotes.filter((q) => {
      const companyName = resolveCompanyName(q.companyId) ?? "";
      const matchesSearch =
        !term ||
        q.quoteNumber.toLowerCase().includes(term) ||
        q.title.toLowerCase().includes(term) ||
        companyName.toLowerCase().includes(term);

      const matchesStatus = statusFilter === "all" || q.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quotes, resolveCompanyName, searchTerm, statusFilter]);

  const filteredTotal = useMemo(
    () =>
      filteredQuotes.reduce(
        (sum, q) => sum + (Number.parseFloat(q.total) || 0),
        0,
      ),
    [filteredQuotes],
  );

  const invalidateQuotes = () => {
    queryClient.invalidateQueries({
      queryKey: useAllQuotesQuery.getKey({
        organizationId: organizationId ?? "",
      }),
    });
  };

  const deleteMutation = useDeleteQuoteMutation({
    onSuccess: invalidateQuotes,
  });

  const columns = useMemo<ColumnDef<(typeof quotes)[number]>[]>(
    () => [
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const quote = row.original;
          return (
            <div className="flex gap-2">
              <Link
                to="/@{$workspaceSlug}/quotes/$quoteId"
                params={{ workspaceSlug, quoteId: quote.id }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Preview quote"
              >
                <Eye size={16} />
              </Link>
              <Link
                to="/@{$workspaceSlug}/quotes/$quoteId/edit"
                params={{ workspaceSlug, quoteId: quote.id }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Edit quote"
              >
                <Edit size={16} />
              </Link>
              <button
                type="button"
                onClick={() =>
                  navigate({
                    to: "/@{$workspaceSlug}/quotes/new",
                    params: { workspaceSlug },
                    state: {
                      duplicateFrom: {
                        quote: {
                          companyId: quote.companyId,
                          contactId: quote.contactId,
                          title: quote.title,
                          description: quote.description,
                          terms: quote.terms,
                          notes: quote.notes,
                          taxRate: quote.taxRate,
                          currency: quote.currency,
                          projectType: quote.projectType,
                          timeRange: quote.timeRange,
                          additionalTerms: quote.additionalTerms,
                          additionalItemsLabel: quote.additionalItemsLabel,
                          clientName: quote.clientName,
                          clientEmail: quote.clientEmail,
                        },
                        lineItems: quote.quoteLineItems.map((li) => ({
                          description: li.description,
                          subtitle: li.subtitle,
                          quantity: li.quantity,
                          unitPrice: li.unitPrice,
                          amount: li.amount,
                          pricingType: li.pricingType,
                          estimatedHours: li.estimatedHours,
                          royaltyPercentage: li.royaltyPercentage,
                          hourlyRate: li.hourlyRate,
                          weeklyCapHours: li.weeklyCapHours,
                          monthlyCapHours: li.monthlyCapHours,
                          maxCapHours: li.maxCapHours,
                          minimumBillingMinutes: li.minimumBillingMinutes,
                          royaltyTimeframe: li.royaltyTimeframe,
                          royaltyTimeframeUnit: li.royaltyTimeframeUnit,
                          royaltyThreshold: li.royaltyThreshold,
                          royaltyBuyoutAmount: li.royaltyBuyoutAmount,
                          sortOrder: li.sortOrder,
                        })),
                      },
                    },
                  })
                }
                className="text-muted-foreground hover:text-foreground"
                aria-label="Duplicate quote"
              >
                <Copy size={16} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm({ open: true, id: quote.id })}
                className="text-destructive hover:text-destructive/80"
                aria-label="Delete quote"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        },
      },
      {
        id: "quoteNumber",
        accessorKey: "quoteNumber",
        header: "Quote #",
        cell: ({ getValue }) => (
          <span className="font-mono">{getValue<string>()}</span>
        ),
      },
      {
        id: "title",
        accessorKey: "title",
        header: "Title",
      },
      {
        id: "company",
        accessorFn: (row) => resolveCompanyName(row.companyId) ?? "",
        header: "Company",
        cell: ({ row }) => resolveCompanyName(row.original.companyId) || "—",
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
        id: "validUntil",
        accessorKey: "validUntil",
        header: "Valid Until",
        cell: ({ getValue }) => getValue<string>() || "—",
      },
    ],
    [navigate, resolveCompanyName, workspaceSlug],
  );

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          Select an organization to view quotes
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2
          className="h-8 w-8 animate-spin text-muted-foreground"
          aria-label="Loading quotes"
        />
      </div>
    );
  }

  return (
    <div className="min-w-0 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-xl">Quotes</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            {filteredQuotes.length}{" "}
            {filteredQuotes.length === 1 ? "quote" : "quotes"}
            {" · "}
            {formatCurrency(filteredTotal.toFixed(2))}
          </p>
        </div>
        <Link
          to="/@{$workspaceSlug}/quotes/new"
          params={{ workspaceSlug }}
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-700"
        >
          <Plus size={16} />
          New Quote
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div className="rounded-lg border-2 border-border border-dashed py-12 text-center">
          <FileText size={32} className="mx-auto mb-2 text-muted-foreground" />
          <p className="mb-4 text-muted-foreground">No quotes yet</p>
          <Link
            to="/@{$workspaceSlug}/quotes/new"
            params={{ workspaceSlug }}
            className="text-primary-600 hover:text-primary-700"
          >
            Create your first quote
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
                placeholder="Search quotes..."
                aria-label="Search quotes"
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
              {QUOTE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
          </div>

          <DataTable
            data={filteredQuotes}
            columns={columns}
            sorting={sorting}
            onSortingChange={setSorting}
            minWidth="800px"
            emptyState={
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No quotes match your filters
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
        title="Delete Quote"
        description="Are you sure you want to delete this quote? This action cannot be undone."
        onConfirm={() =>
          deleteMutation.mutate(
            { input: { rowId: deleteConfirm.id } },
            {
              onError: (err) =>
                toast.error(
                  err instanceof Error ? err.message : "Failed to delete quote",
                ),
            },
          )
        }
      />
    </div>
  );
};

export const Route = createFileRoute("/_app/@{$workspaceSlug}/quotes/")({
  component: QuotesListPage,
  validateSearch: zodValidator(quoteListSearchSchema),
});
