import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { BoxesIcon, Building2Icon, PlusIcon, SearchXIcon } from "lucide-react";
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
import ProductRowMenu from "@/features/inventory/components/ProductRowMenu";
import StockBadge from "@/features/inventory/components/StockBadge";
import { inventoryListSearchSchema } from "@/features/inventory/searchParams";
import {
  getStockLevel,
  productsFromQuery,
} from "@/features/inventory/types/product";
import { formatCurrency } from "@/features/invoices/types/invoice";
import {
  useAllProductsQuery,
  useDeleteProductMutation,
} from "@/generated/graphql";
import { useUrlSort } from "@/lib/hooks/util/useUrlSort";
import { useWorkspaceSlug } from "@/lib/hooks/util/useWorkspaceSlug";

import type { SortingState } from "@tanstack/react-table";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import type { ProductRowAction } from "@/features/inventory/components/ProductRowMenu";
import type { InventoryFilter } from "@/features/inventory/searchParams";
import type { Product } from "@/features/inventory/types/product";

const DEFAULT_SORTING: SortingState = [{ id: "name", desc: false }];

const matchesFilter = (product: Product, filter: InventoryFilter) => {
  switch (filter) {
    case "low":
      return getStockLevel(product) === "low";
    case "out":
      return getStockLevel(product) === "out";
    case "inactive":
      return !product.isActive;
    default:
      return true;
  }
};

const InventoryPage = () => {
  const { organizationId } = Route.useRouteContext();
  const workspaceSlug = useWorkspaceSlug();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();

  const { search: searchTerm, status: statusFilter } = search;

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
    name: string;
  }>({ open: false, id: "", name: "" });

  const [sorting, setSorting] = useUrlSort({
    search,
    defaultSorting: DEFAULT_SORTING,
    navigate,
  });

  const { data: productsData, isLoading } = useAllProductsQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const products = useMemo(
    () => productsFromQuery(productsData),
    [productsData],
  );

  const counts = useMemo(
    () => ({
      all: products.length,
      low: products.filter((p) => matchesFilter(p, "low")).length,
      out: products.filter((p) => matchesFilter(p, "out")).length,
      inactive: products.filter((p) => matchesFilter(p, "inactive")).length,
    }),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return products.filter(
      (product) =>
        matchesFilter(product, statusFilter) &&
        (!term ||
          product.name.toLowerCase().includes(term) ||
          (product.sku ?? "").toLowerCase().includes(term)),
    );
  }, [products, searchTerm, statusFilter]);

  const invalidateProducts = () => {
    queryClient.invalidateQueries({
      queryKey: useAllProductsQuery.getKey({
        organizationId: organizationId ?? "",
      }),
    });
  };

  const deleteProductMutation = useDeleteProductMutation({
    onSuccess: invalidateProducts,
  });

  const openProduct = (product: Product) =>
    navigate({
      to: "/@{$workspaceSlug}/inventory/$productId",
      params: { workspaceSlug, productId: product.id },
    });

  const handleRowAction = (product: Product, action: ProductRowAction) => {
    if (action === "view") openProduct(product);

    if (action === "edit")
      navigate({
        to: "/@{$workspaceSlug}/inventory/$productId/edit",
        params: { workspaceSlug, productId: product.id },
      });

    if (action === "delete")
      setDeleteConfirm({ open: true, id: product.id, name: product.name });
  };

  const clearFilters = () =>
    navigate({
      search: (prev) => ({ ...prev, search: "", status: "all" }),
    });

  if (!organizationId) {
    return (
      <PageContainer>
        <EmptyState
          icon={Building2Icon}
          title="No workspace selected"
          description="Select a workspace to view its inventory."
        />
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState label="Loading inventory" />
      </PageContainer>
    );
  }

  const stockSummary = [
    counts.low > 0 && `${counts.low} low`,
    counts.out > 0 && `${counts.out} out of stock`,
  ].filter(Boolean);

  return (
    <PageContainer>
      <PageHeader
        title="Inventory"
        description={
          <>
            <span className="tabular">{products.length}</span>{" "}
            {products.length === 1 ? "product" : "products"}
            {stockSummary.length > 0 && (
              <span className="tabular">, {stockSummary.join(", ")}</span>
            )}
          </>
        }
        actions={
          <Link
            to="/@{$workspaceSlug}/inventory/new"
            params={{ workspaceSlug }}
            className={buttonVariants({
              variant: "solid",
              className: "max-md:hidden",
            })}
          >
            <PlusIcon />
            New product
          </Link>
        }
      />

      <SectionCard flush>
        {products.length === 0 ? (
          <EmptyState
            icon={BoxesIcon}
            title="No products yet"
            description="Add the products you sell to track stock levels and every adjustment."
            action={
              <Link
                to="/@{$workspaceSlug}/inventory/new"
                params={{ workspaceSlug }}
                className={buttonVariants({ variant: "solid" })}
              >
                <PlusIcon />
                New product
              </Link>
            }
          />
        ) : (
          <>
            <ListToolbar>
              <SegmentedControl
                label="Filter by stock"
                size="sm"
                value={statusFilter}
                onValueChange={(status) =>
                  navigate({ search: (prev) => ({ ...prev, status }) })
                }
                options={[
                  { value: "all", label: "All", count: counts.all },
                  { value: "low", label: "Low stock", count: counts.low },
                  { value: "out", label: "Out of stock", count: counts.out },
                  {
                    value: "inactive",
                    label: "Inactive",
                    count: counts.inactive,
                  },
                ]}
              />
              <SearchInput
                label="Search products"
                placeholder="Search by name or SKU"
                value={searchTerm}
                onChange={(e) =>
                  navigate({
                    search: (prev) => ({ ...prev, search: e.target.value }),
                    replace: true,
                  })
                }
              />
            </ListToolbar>

            <ProductsTable
              products={filteredProducts}
              sorting={sorting}
              onSortingChange={setSorting}
              onRowClick={openProduct}
              onAction={handleRowAction}
              onClearFilters={clearFilters}
            />
          </>
        )}
      </SectionCard>

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
        title={`Delete product "${deleteConfirm.name}"?`}
        description="This permanently deletes the product. This cannot be undone."
        onConfirm={() =>
          deleteProductMutation.mutate(
            { input: { rowId: deleteConfirm.id } },
            {
              onError: () => toast.error("Could not delete the product"),
            },
          )
        }
      />
    </PageContainer>
  );
};

const ProductsTable = ({
  products,
  sorting,
  onSortingChange,
  onRowClick,
  onAction,
  onClearFilters,
}: {
  products: Product[];
  sorting: SortingState;
  onSortingChange: ReturnType<typeof useUrlSort>[1];
  onRowClick: (product: Product) => void;
  onAction: (product: Product, action: ProductRowAction) => void;
  onClearFilters: () => void;
}) => {
  const columns = useMemo<DataTableColumnDef<Product>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Product",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate font-medium">{row.original.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {row.original.sku ?? <EmptyValue>No SKU</EmptyValue>}
            </p>
          </div>
        ),
      },
      {
        id: "unitPrice",
        accessorFn: (row) =>
          row.unitPrice ? Number.parseFloat(row.unitPrice) : 0,
        header: "Unit price",
        meta: { align: "right" },
        cell: ({ row }) =>
          row.original.unitPrice ? (
            <span className="tabular">
              {formatCurrency(row.original.unitPrice)}
            </span>
          ) : (
            <EmptyValue />
          ),
      },
      {
        id: "currentQuantity",
        accessorKey: "currentQuantity",
        header: "In stock",
        meta: { align: "right" },
        cell: ({ row }) => (
          <span className="inline-flex items-center justify-end gap-2">
            <StockBadge product={row.original} />
            <span className="tabular font-medium">
              {row.original.currentQuantity}
            </span>
          </span>
        ),
      },
      {
        id: "isActive",
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge status={row.original.isActive ? "active" : "inactive"} />
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        enableSorting: false,
        cell: ({ row }) => (
          <ProductRowMenu
            productName={row.original.name}
            onAction={(action) => onAction(row.original, action)}
          />
        ),
      },
    ],
    [onAction],
  );

  return (
    <DataTable
      data={products}
      columns={columns}
      sorting={sorting}
      onSortingChange={onSortingChange}
      minWidth="680px"
      onRowClick={onRowClick}
      rowLabel={(product) => `Open product ${product.name}`}
      renderMobileRow={(product) => (
        <span className="grid gap-1">
          <span className="flex items-baseline justify-between gap-3">
            <span className="truncate font-medium">{product.name}</span>
            <span className="tabular shrink-0 font-semibold">
              {product.currentQuantity}
              <span className="text-xs font-normal text-muted-foreground">
                {" "}
                in stock
              </span>
            </span>
          </span>
          <span className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span className="truncate">
              {product.sku ?? "No SKU"}
              {product.unitPrice && ` · ${formatCurrency(product.unitPrice)}`}
            </span>
            <span className="flex shrink-0 items-center gap-1.5">
              <StockBadge product={product} />
              {!product.isActive && <StatusBadge status="inactive" />}
            </span>
          </span>
        </span>
      )}
      emptyState={
        <EmptyState
          icon={SearchXIcon}
          title="No products match your filters"
          description="Try a different search or stock filter."
          action={
            <Button variant="outline" onClick={onClearFilters}>
              Clear filters
            </Button>
          }
        />
      }
    />
  );
};

export const Route = createFileRoute("/_app/@{$workspaceSlug}/inventory/")({
  staticData: { title: "Inventory" },
  component: InventoryPage,
  validateSearch: zodValidator(inventoryListSearchSchema),
});
