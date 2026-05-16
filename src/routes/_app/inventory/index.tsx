import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Edit, Eye, Loader2, Package, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/ui/data-table";
import { inventoryListSearchSchema } from "@/features/inventory/searchParams";
import { formatCurrency } from "@/features/invoices/types/invoice";
import {
  useAllProductsQuery,
  useDeleteProductMutation,
} from "@/generated/graphql";
import { useUrlSort } from "@/lib/hooks/util/useUrlSort";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import type { Product } from "@/features/inventory/types/product";

const DEFAULT_SORTING: SortingState = [{ id: "name", desc: false }];

const InventoryPage = () => {
  const { organizationId } = Route.useRouteContext();
  const search = Route.useSearch();
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

  const { data: productsData, isLoading } = useAllProductsQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const products = useMemo(
    () =>
      (productsData?.products?.nodes ?? []).flatMap((node) => {
        if (!node) return [];
        return [
          {
            id: node.rowId,
            organizationId: node.organizationId,
            name: node.name,
            description: node.description ?? null,
            sku: node.sku ?? null,
            unitPrice: node.unitPrice ?? null,
            currentQuantity: node.currentQuantity ?? 0,
            lowStockThreshold: node.lowStockThreshold ?? null,
            isActive: node.isActive ?? true,
            createdAt: node.createdAt ?? "",
            updatedAt: node.updatedAt ?? "",
          },
        ];
      }),
    [productsData],
  );

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

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          Select an organization to view inventory
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2
          className="h-8 w-8 animate-spin text-muted-foreground"
          aria-label="Loading inventory"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-xl">Inventory</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
        <Link
          to="/inventory/new"
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-700"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <ProductsTable
        products={products}
        sorting={sorting}
        onSortingChange={setSorting}
        onDelete={(id) => setDeleteConfirm({ open: true, id })}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={() =>
          deleteProductMutation.mutate(
            { input: { rowId: deleteConfirm.id } },
            {
              onError: (err) =>
                toast.error(
                  err instanceof Error
                    ? err.message
                    : "Failed to delete product",
                ),
            },
          )
        }
      />
    </div>
  );
};

const ProductsTable = ({
  products,
  sorting,
  onSortingChange,
  onDelete,
}: {
  products: Product[];
  sorting: SortingState;
  onSortingChange: ReturnType<typeof useUrlSort>[1];
  onDelete: (id: string) => void;
}) => {
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex gap-2">
              <Link
                to="/inventory/$productId"
                params={{ productId: product.id }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="View product details"
              >
                <Eye size={16} />
              </Link>
              <Link
                to="/inventory/$productId/edit"
                params={{ productId: product.id }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Edit product"
              >
                <Edit size={16} />
              </Link>
              <button
                type="button"
                onClick={() => onDelete(product.id)}
                className="text-destructive hover:text-destructive/80"
                aria-label="Delete product"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        },
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue<string>()}</span>
        ),
      },
      {
        id: "sku",
        accessorKey: "sku",
        header: "SKU",
        cell: ({ getValue }) => getValue<string | null>() ?? "—",
      },
      {
        id: "unitPrice",
        accessorFn: (row) =>
          row.unitPrice ? Number.parseFloat(row.unitPrice) : 0,
        header: "Unit Price",
        cell: ({ row }) =>
          row.original.unitPrice ? formatCurrency(row.original.unitPrice) : "—",
      },
      {
        id: "currentQuantity",
        accessorKey: "currentQuantity",
        header: "Quantity",
        cell: ({ row }) => {
          const product = row.original;
          const lowStock =
            product.lowStockThreshold != null &&
            product.currentQuantity <= product.lowStockThreshold;
          return (
            <span
              className={
                lowStock
                  ? "font-medium text-destructive"
                  : "font-medium text-emerald-600 dark:text-emerald-400"
              }
            >
              {product.currentQuantity}
            </span>
          );
        },
      },
      {
        id: "isActive",
        accessorKey: "isActive",
        header: "Status",
        cell: ({ getValue }) => {
          const isActive = getValue<boolean>();
          return (
            <Badge variant={isActive ? "solid" : "outline"} className="text-xs">
              {isActive ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
    ],
    [onDelete],
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <DataTable
        data={products}
        columns={columns}
        sorting={sorting}
        onSortingChange={onSortingChange}
        minWidth="700px"
        emptyState={
          <div className="rounded-lg border-2 border-border border-dashed py-12 text-center">
            <Package size={32} className="mx-auto mb-2 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground">No products yet</p>
            <Link
              to="/inventory/new"
              className="text-primary-600 hover:text-primary-700"
            >
              Add your first product
            </Link>
          </div>
        }
      />
    </div>
  );
};

export const Route = createFileRoute("/_app/inventory/")({
  component: InventoryPage,
  validateSearch: zodValidator(inventoryListSearchSchema),
});
