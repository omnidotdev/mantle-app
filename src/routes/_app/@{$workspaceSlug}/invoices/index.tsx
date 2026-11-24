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
import { Link, createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import {
  CopyIcon,
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  ReceiptIcon,
  SearchXIcon,
  Trash2Icon,
} from "lucide-react";
import { useMemo, useState } from "react";
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
import { invoiceListSearchSchema } from "@/features/invoices/searchParams";
import {
  INVOICE_STATUSES,
  countByStatus,
  formatCurrency,
  formatShortDate,
  invoiceClientName,
  toDuplicateDraft,
} from "@/features/invoices/types/invoice";
import {
  useAllInvoicesQuery,
  useDeleteInvoiceMutation,
} from "@/generated/graphql";
import { useUrlSort } from "@/lib/hooks/util/useUrlSort";
import { formatStatus } from "@/lib/utils";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import type { Invoice } from "@/features/invoices/types/invoice";

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
    invoiceNumber: string;
  }>({ open: false, id: "", invoiceNumber: "" });

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

        const invoice = {
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
        };

        return [{ ...invoice, clientName: invoiceClientName(invoice) }];
      }),
    [data],
  );

  type Row = (typeof invoices)[number];

  // Search narrows the list first so the status tab counts reflect it
  const searchedInvoices = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return invoices;

    return invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(term) ||
        (inv.company?.name ?? "").toLowerCase().includes(term) ||
        (inv.clientName ?? "").toLowerCase().includes(term),
    );
  }, [invoices, searchTerm]);

  const filteredInvoices = useMemo(
    () =>
      statusFilter === "all"
        ? searchedInvoices
        : searchedInvoices.filter((inv) => inv.status === statusFilter),
    [searchedInvoices, statusFilter],
  );

  const statusCounts = useMemo(
    () => countByStatus(searchedInvoices),
    [searchedInvoices],
  );

  const statusOptions = useMemo(
    () => [
      { value: "all", label: "All", count: statusCounts.all },
      ...INVOICE_STATUSES.map((status) => ({
        value: status as string,
        label: formatStatus(status),
        count: statusCounts[status],
      })),
    ],
    [statusCounts],
  );

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
    onSuccess: () => {
      invalidateInvoices();
      toast.success("Invoice deleted");
    },
    onError: () => toast.error("Could not delete the invoice. Try again."),
  });

  const openInvoice = (invoice: Row) =>
    navigate({
      to: "/@{$workspaceSlug}/invoices/$invoiceId",
      params: { workspaceSlug, invoiceId: invoice.id },
    });

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      {
        id: "invoiceNumber",
        accessorKey: "invoiceNumber",
        header: "Number",
        cell: ({ getValue }) => (
          <span className="tabular font-medium">{getValue<string>()}</span>
        ),
      },
      {
        // Column id kept as "company" so existing sort URLs keep working
        id: "company",
        accessorFn: (row) => row.clientName ?? "",
        header: "Client",
        cell: ({ row }) =>
          row.original.clientName ? (
            <span className="font-medium">{row.original.clientName}</span>
          ) : (
            <EmptyValue>No client yet</EmptyValue>
          ),
      },
      {
        id: "issueDate",
        accessorKey: "issueDate",
        header: "Issued",
        cell: ({ getValue }) => {
          const v = getValue<string | null>();
          return (
            <span className="text-muted-foreground">
              {v ? formatShortDate(v) : <EmptyValue />}
            </span>
          );
        },
      },
      {
        id: "dueDate",
        accessorKey: "dueDate",
        header: "Due",
        cell: ({ getValue }) => {
          const v = getValue<string | null>();
          return v ? (
            <span className="text-muted-foreground">{formatShortDate(v)}</span>
          ) : (
            <EmptyValue />
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
          const invoice = row.original;

          return (
            // Keep menu clicks (including the portalled menu) off the row
            <div
              className="flex justify-end"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <MenuRoot
                positioning={{ placement: "bottom-end" }}
                onSelect={({ value }) => {
                  if (value === "preview")
                    navigate({
                      to: "/@{$workspaceSlug}/invoices/$invoiceId",
                      params: { workspaceSlug, invoiceId: invoice.id },
                    });

                  if (value === "edit")
                    navigate({
                      to: "/@{$workspaceSlug}/invoices/$invoiceId/edit",
                      params: { workspaceSlug, invoiceId: invoice.id },
                    });

                  if (value === "duplicate")
                    navigate({
                      to: "/@{$workspaceSlug}/invoices/new",
                      params: { workspaceSlug },
                      state: { duplicateFrom: toDuplicateDraft(invoice) },
                    });

                  if (value === "delete")
                    setDeleteConfirm({
                      open: true,
                      id: invoice.id,
                      invoiceNumber: invoice.invoiceNumber,
                    });
                }}
              >
                <MenuTrigger
                  aria-label={`Actions for ${invoice.invoiceNumber}`}
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon-sm",
                  })}
                >
                  <MoreHorizontalIcon />
                </MenuTrigger>
                <Portal>
                  <MenuPositioner>
                    <MenuContent className="min-w-40">
                      <MenuItem value="preview">
                        <EyeIcon />
                        Preview
                      </MenuItem>
                      <MenuItem value="edit">
                        <PencilIcon />
                        Edit
                      </MenuItem>
                      <MenuItem value="duplicate">
                        <CopyIcon />
                        Duplicate
                      </MenuItem>
                      <MenuSeparator />
                      <MenuItem value="delete" variant="destructive">
                        <Trash2Icon />
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
        <LoadingState label="Loading invoices" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Invoices"
        description={
          <>
            <span className="tabular">{filteredInvoices.length}</span>{" "}
            {filteredInvoices.length === 1 ? "invoice" : "invoices"}
            {" · "}
            <span className="tabular">
              {formatCurrency(filteredTotal.toFixed(2))}
            </span>{" "}
            billed
          </>
        }
        actions={
          <Link
            to="/@{$workspaceSlug}/invoices/new"
            params={{ workspaceSlug }}
            className={buttonVariants({
              variant: "solid",
              className: "max-md:hidden",
            })}
          >
            <PlusIcon />
            New invoice
          </Link>
        }
      />

      <SectionCard flush>
        {invoices.length === 0 ? (
          <EmptyState
            icon={ReceiptIcon}
            title="No invoices yet"
            description="Create an invoice to bill a client and track what they owe."
            action={
              <Link
                to="/@{$workspaceSlug}/invoices/new"
                params={{ workspaceSlug }}
                className={buttonVariants({ variant: "solid" })}
              >
                <PlusIcon />
                Create your first invoice
              </Link>
            }
          />
        ) : (
          <>
            <ListToolbar>
              <SegmentedControl
                label="Filter by status"
                size="sm"
                options={statusOptions}
                value={statusFilter}
                onValueChange={(status) =>
                  navigate({ search: (prev) => ({ ...prev, status }) })
                }
              />
              <SearchInput
                label="Search invoices"
                value={searchTerm}
                onChange={(e) =>
                  navigate({
                    search: (prev) => ({ ...prev, search: e.target.value }),
                  })
                }
              />
            </ListToolbar>

            <DataTable
              data={filteredInvoices}
              columns={columns}
              sorting={sorting}
              onSortingChange={setSorting}
              minWidth="760px"
              onRowClick={openInvoice}
              rowLabel={(invoice) => `Open invoice ${invoice.invoiceNumber}`}
              renderMobileRow={(invoice) => (
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5">
                  <span className="truncate font-medium text-sm">
                    {invoice.clientName ?? (
                      <EmptyValue>No client yet</EmptyValue>
                    )}
                  </span>
                  <span className="tabular font-semibold text-sm">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </span>
                  <span className="truncate text-muted-foreground text-xs">
                    <span className="tabular">{invoice.invoiceNumber}</span>
                    {" · due "}
                    {invoice.dueDate
                      ? formatShortDate(invoice.dueDate)
                      : "not set"}
                  </span>
                  <StatusBadge
                    status={invoice.status}
                    className="justify-self-end"
                  />
                </div>
              )}
              emptyState={
                <EmptyState
                  icon={SearchXIcon}
                  title="No invoices match your filters"
                  description="Try a different status or search term."
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
        title={`Delete invoice ${deleteConfirm.invoiceNumber}?`}
        description="This permanently deletes the invoice. This cannot be undone."
        confirmLabel="Delete invoice"
        onConfirm={() =>
          deleteMutation.mutate({ input: { rowId: deleteConfirm.id } })
        }
      />
    </PageContainer>
  );
};

export const Route = createFileRoute("/_app/@{$workspaceSlug}/invoices/")({
  component: InvoicesListPage,
  validateSearch: zodValidator(invoiceListSearchSchema),
  staticData: { title: "Invoices" },
});
