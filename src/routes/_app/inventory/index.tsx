import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Edit, Eye, Loader2, Package, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { formatCurrency } from "@/features/invoices/types/invoice";
import {
  useAllProductsQuery,
  useDeleteProductMutation,
} from "@/generated/graphql";

import type { Product } from "@/features/inventory/types/product";

const InventoryPage = () => {
  const { organizationId } = Route.useRouteContext();
  const queryClient = useQueryClient();

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
  }>({ open: false, id: "" });

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
  onDelete,
}: {
  products: Product[];
  onDelete: (id: string) => void;
}) => {
  if (products.length === 0) {
    return (
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
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full min-w-[700px]">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-foreground text-sm">
              Name
            </th>
            <th className="px-4 py-3 text-left font-medium text-foreground text-sm">
              SKU
            </th>
            <th className="px-4 py-3 text-left font-medium text-foreground text-sm">
              Unit Price
            </th>
            <th className="px-4 py-3 text-left font-medium text-foreground text-sm">
              Quantity
            </th>
            <th className="px-4 py-3 text-left font-medium text-foreground text-sm">
              Status
            </th>
            <th className="px-4 py-3 text-right font-medium text-foreground text-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-border border-t">
              <td className="px-4 py-3 font-medium text-sm">{product.name}</td>
              <td className="px-4 py-3 text-foreground text-sm">
                {product.sku ?? "\u2014"}
              </td>
              <td className="px-4 py-3 text-foreground text-sm">
                {product.unitPrice
                  ? formatCurrency(product.unitPrice)
                  : "\u2014"}
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={
                    product.lowStockThreshold != null &&
                    product.currentQuantity <= product.lowStockThreshold
                      ? "font-medium text-destructive"
                      : "font-medium text-emerald-600 dark:text-emerald-400"
                  }
                >
                  {product.currentQuantity}
                </span>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={product.isActive ? "solid" : "outline"}
                  className="text-xs"
                >
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const Route = createFileRoute("/_app/inventory/")({
  component: InventoryPage,
});
