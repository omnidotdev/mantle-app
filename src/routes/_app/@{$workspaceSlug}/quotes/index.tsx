import { Portal } from "@ark-ui/react/portal";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@omnidotdev/thornberry/menu";
import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import {
  CopyIcon,
  EyeIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SearchXIcon,
  Trash2Icon,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import EmptyState from "@/components/core/EmptyState";
import EmptyValue from "@/components/core/EmptyValue";
import ListToolbar from "@/components/core/ListToolbar";
import LoadingState from "@/components/core/LoadingState";
import PageContainer from "@/components/core/PageContainer";
import PageHeader from "@/components/core/PageHeader";
import SectionCard from "@/components/core/SectionCard";
import StatusBadge from "@/components/core/StatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/ui/data-table";
import { SearchInput } from "@/components/ui/search-input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { formatCurrency, formatDate } from "@/features/invoices/types/invoice";
import { quoteListSearchSchema } from "@/features/quotes/searchParams";
import { QUOTE_STATUSES } from "@/features/quotes/types/quote";
import {
  useAllCompaniesQuery,
  useAllQuotesQuery,
  useDeleteQuoteMutation,
} from "@/generated/graphql";
import { useUrlSort } from "@/lib/hooks/util/useUrlSort";
import cn, { formatStatus } from "@/lib/utils";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import type { Quote, QuoteLineItem } from "@/features/quotes/types/quote";

const DEFAULT_SORTING: SortingState = [{ id: "validUntil", desc: true }];

/** Format a `validUntil` date (date-only or full ISO) for display */
const formatValidUntil = (value: string) => formatDate(value.slice(0, 10));

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
    quoteNumber: string;
  }>({ open: false, id: "", quoteNumber: "" });

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

  // Quotes matching the search term, before the status filter, so the status
  // tabs can show how many quotes each status holds
  const searchedQuotes = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return quotes.filter((q) => {
      const companyName = resolveCompanyName(q.companyId) ?? "";
      return (
        !term ||
        q.quoteNumber.toLowerCase().includes(term) ||
        q.title.toLowerCase().includes(term) ||
        companyName.toLowerCase().includes(term)
      );
    });
  }, [quotes, resolveCompanyName, searchTerm]);

  const filteredQuotes = useMemo(
    () =>
      searchedQuotes.filter(
        (q) => statusFilter === "all" || q.status === statusFilter,
      ),
    [searchedQuotes, statusFilter],
  );

  const statusOptions = useMemo(
    () => [
      { value: "all", label: "All", count: searchedQuotes.length },
      ...QUOTE_STATUSES.map((status) => ({
        value: status as string,
        label: formatStatus(status),
        count: searchedQuotes.filter((q) => q.status === status).length,
      })),
    ],
    [searchedQuotes],
  );

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

  const openQuote = useCallback(
    (quoteId: string) =>
      navigate({
        to: "/@{$workspaceSlug}/quotes/$quoteId",
        params: { workspaceSlug, quoteId },
      }),
    [navigate, workspaceSlug],
  );

  const duplicateQuote = useCallback(
    (quote: (typeof quotes)[number]) =>
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
      }),
    [navigate, workspaceSlug],
  );

  const clearFilters = () =>
    navigate({
      search: {
        search: "",
        status: "all",
        sortBy: undefined,
        sortDir: undefined,
      },
    });

  const columns = useMemo<ColumnDef<(typeof quotes)[number]>[]>(
    () => [
      {
        id: "quoteNumber",
        accessorKey: "quoteNumber",
        header: "Number",
        cell: ({ getValue }) => (
          <span className="tabular font-medium">{getValue<string>()}</span>
        ),
      },
      {
        id: "title",
        accessorKey: "title",
        header: "Title",
        cell: ({ getValue }) => (
          <span className="block max-w-[16rem] truncate">
            {getValue<string>()}
          </span>
        ),
      },
      {
        id: "company",
        accessorFn: (row) => resolveCompanyName(row.companyId) ?? "",
        header: "Client",
        cell: ({ row }) =>
          resolveCompanyName(row.original.companyId) || (
            <EmptyValue>No client yet</EmptyValue>
          ),
      },
      {
        id: "validUntil",
        accessorKey: "validUntil",
        header: "Valid until",
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return value ? (
            <span className="text-muted-foreground">
              {formatValidUntil(value)}
            </span>
          ) : (
            <EmptyValue>No expiry</EmptyValue>
          );
        },
      },
      {
        id: "total",
        accessorFn: (row) => Number.parseFloat(row.total) || 0,
        header: "Amount",
        meta: { align: "right" },
        cell: ({ row }) => (
          <span className="tabular font-medium">
            {formatCurrency(row.original.total, row.original.currency)}
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => <StatusBadge status={getValue<string>()} />,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        enableSorting: false,
        meta: { align: "right" },
        cell: ({ row }) => {
          const quote = row.original;

          return (
            // Keep menu clicks from opening the row
            <div
              className="flex justify-end"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <MenuRoot
                positioning={{ placement: "bottom-end" }}
                onSelect={({ value }) => {
                  if (value === "view") openQuote(quote.id);
                  if (value === "edit")
                    navigate({
                      to: "/@{$workspaceSlug}/quotes/$quoteId/edit",
                      params: { workspaceSlug, quoteId: quote.id },
                    });
                  if (value === "duplicate") duplicateQuote(quote);
                  if (value === "delete")
                    setDeleteConfirm({
                      open: true,
                      id: quote.id,
                      quoteNumber: quote.quoteNumber,
                    });
                }}
              >
                <MenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Actions for ${quote.quoteNumber}`}
                  >
                    <MoreHorizontalIcon />
                  </Button>
                </MenuTrigger>
                <Portal>
                  <MenuPositioner>
                    <MenuContent className="min-w-44">
                      <MenuItem value="view">
                        <EyeIcon className="size-4" />
                        View
                      </MenuItem>
                      <MenuItem value="edit">
                        <PencilIcon className="size-4" />
                        Edit
                      </MenuItem>
                      <MenuItem value="duplicate">
                        <CopyIcon className="size-4" />
                        Duplicate
                      </MenuItem>
                      <MenuSeparator />
                      <MenuItem value="delete" variant="destructive">
                        <Trash2Icon className="size-4" />
                        Delete
                      </MenuItem>
                    </MenuContent>
                  </MenuPositioner>
                </Portal>
              </MenuRoot>
            </div>
          );
        },
      },
    ],
    [duplicateQuote, navigate, openQuote, resolveCompanyName, workspaceSlug],
  );

  if (!organizationId) {
    return (
      <PageContainer>
        <EmptyState
          icon={FileTextIcon}
          title="No workspace selected"
          description="Select a workspace from the sidebar to view its quotes."
        />
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState label="Loading quotes" />
      </PageContainer>
    );
  }

  const newQuoteLink = (
    <Link
      to="/@{$workspaceSlug}/quotes/new"
      params={{ workspaceSlug }}
      className={buttonVariants({ variant: "solid" })}
    >
      <PlusIcon />
      New quote
    </Link>
  );

  return (
    <PageContainer>
      <PageHeader
        title="Quotes & Contracts"
        description={
          <>
            <span className="tabular">{filteredQuotes.length}</span>{" "}
            {filteredQuotes.length === 1 ? "quote" : "quotes"}
            {" · "}
            <span className="tabular">
              {formatCurrency(filteredTotal.toFixed(2))}
            </span>{" "}
            quoted
          </>
        }
        actions={
          <Link
            to="/@{$workspaceSlug}/quotes/new"
            params={{ workspaceSlug }}
            className={cn(
              buttonVariants({ variant: "solid" }),
              "max-md:hidden",
            )}
          >
            <PlusIcon />
            New quote
          </Link>
        }
      />

      <SectionCard flush>
        {quotes.length === 0 ? (
          <EmptyState
            icon={FileTextIcon}
            title="No quotes yet"
            description="Draft a quote with a live preview, then print it as a quote or as a contract ready to sign."
            action={newQuoteLink}
          />
        ) : (
          <>
            <ListToolbar>
              <SegmentedControl
                label="Filter by status"
                size="sm"
                options={statusOptions}
                value={statusFilter}
                onValueChange={(value) =>
                  navigate({
                    search: (prev) => ({ ...prev, status: value }),
                  })
                }
              />
              <SearchInput
                label="Search quotes"
                value={searchTerm}
                onChange={(e) =>
                  navigate({
                    search: (prev) => ({ ...prev, search: e.target.value }),
                  })
                }
              />
            </ListToolbar>

            <DataTable
              data={filteredQuotes}
              columns={columns}
              sorting={sorting}
              onSortingChange={setSorting}
              minWidth="760px"
              onRowClick={(quote) => openQuote(quote.id)}
              rowLabel={(quote) => `Open quote ${quote.quoteNumber}`}
              renderMobileRow={(quote) => {
                const companyName = resolveCompanyName(quote.companyId);

                return (
                  <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5">
                    <span className="truncate font-medium">{quote.title}</span>
                    <span className="tabular font-semibold">
                      {formatCurrency(quote.total, quote.currency)}
                    </span>
                    <span className="truncate text-muted-foreground text-sm">
                      <span className="tabular">{quote.quoteNumber}</span>
                      {" · "}
                      {companyName ?? "No client yet"}
                    </span>
                    <StatusBadge status={quote.status} />
                  </div>
                );
              }}
              emptyState={
                <EmptyState
                  icon={SearchXIcon}
                  title="No quotes match your filters"
                  description="Try a different search or status."
                  action={
                    <Button variant="outline" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  }
                />
              }
            />
          </>
        )}
      </SectionCard>

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
        title={`Delete quote ${deleteConfirm.quoteNumber}?`}
        description="This quote will be permanently deleted. This cannot be undone."
        onConfirm={() =>
          deleteMutation.mutate(
            { input: { rowId: deleteConfirm.id } },
            {
              onError: () => toast.error("Could not delete the quote"),
            },
          )
        }
      />
    </PageContainer>
  );
};

export const Route = createFileRoute("/_app/@{$workspaceSlug}/quotes/")({
  component: QuotesListPage,
  validateSearch: zodValidator(quoteListSearchSchema),
  staticData: { title: "Quotes" },
});
