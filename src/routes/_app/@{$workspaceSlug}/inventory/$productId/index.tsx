import { Badge } from "@omnidotdev/thornberry/badge";
import { Input } from "@omnidotdev/thornberry/input";
import { Label } from "@omnidotdev/thornberry/label";
import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Loader2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import AdjustmentLog from "@/features/inventory/components/AdjustmentLog";
import { formatCurrency } from "@/features/invoices/types/invoice";
import {
  useAllProductsQuery,
  useCreateInventoryAdjustmentMutation,
  useInventoryAdjustmentsQuery,
} from "@/generated/graphql";

const ProductDetailPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug, productId } = Route.useParams();
  const queryClient = useQueryClient();

  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("");
  const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);

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

  const product = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId],
  );

  const { data: adjustmentsData } = useInventoryAdjustmentsQuery(
    { productId },
    { enabled: !!productId },
  );

  const adjustments = useMemo(
    () =>
      (adjustmentsData?.inventoryAdjustments?.nodes ?? []).flatMap((node) => {
        if (!node) return [];
        return [
          {
            id: node.rowId,
            productId: node.productId,
            quantityChange: node.quantityChange,
            reason: node.reason,
            referenceId: node.referenceId ?? null,
            createdAt: node.createdAt ?? "",
          },
        ];
      }),
    [adjustmentsData],
  );

  const invalidateProducts = () => {
    queryClient.invalidateQueries({
      queryKey: useAllProductsQuery.getKey({
        organizationId: organizationId ?? "",
      }),
    });
  };

  const invalidateAdjustments = () => {
    queryClient.invalidateQueries({
      queryKey: useInventoryAdjustmentsQuery.getKey({ productId }),
    });
  };

  const createAdjustmentMutation = useCreateInventoryAdjustmentMutation();

  const handleAddAdjustment = async () => {
    if (!adjustmentReason.trim() || !adjustmentQuantity) return;

    try {
      await createAdjustmentMutation.mutateAsync({
        input: {
          inventoryAdjustment: {
            productId,
            quantityChange: Number.parseInt(adjustmentQuantity, 10),
            reason: adjustmentReason.trim(),
            referenceId: null,
          },
        },
      });

      invalidateProducts();
      invalidateAdjustments();

      setAdjustmentReason("");
      setAdjustmentQuantity("");
      setShowAdjustmentForm(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add adjustment",
      );
    }
  };

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          Select a workspace to view inventory
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2
          className="h-8 w-8 animate-spin text-muted-foreground"
          aria-label="Loading product"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <Link
          to="/@{$workspaceSlug}/inventory"
          params={{ workspaceSlug }}
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          &larr; Back to list
        </Link>
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/@{$workspaceSlug}/inventory"
          params={{ workspaceSlug }}
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          &larr; Back to list
        </Link>
        <Link
          to="/@{$workspaceSlug}/inventory/$productId/edit"
          params={{ workspaceSlug, productId }}
          className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
        >
          Edit
        </Link>
      </div>

      <div className="mb-6 rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-lg">{product.name}</h2>
            {product.sku && (
              <p className="text-muted-foreground text-sm">
                SKU: {product.sku}
              </p>
            )}
          </div>
          <Badge variant={product.isActive ? "solid" : "outline"}>
            {product.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {product.description && (
          <p className="mb-4 text-foreground text-sm">{product.description}</p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="font-medium text-muted-foreground text-xs uppercase">
              Unit Price
            </p>
            <p className="font-medium text-lg">
              {product.unitPrice ? formatCurrency(product.unitPrice) : "\u2014"}
            </p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground text-xs uppercase">
              Current Quantity
            </p>
            <p
              className={`font-medium text-lg ${
                product.lowStockThreshold != null &&
                product.currentQuantity <= product.lowStockThreshold
                  ? "text-destructive"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {product.currentQuantity}
            </p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground text-xs uppercase">
              Low Stock Threshold
            </p>
            <p className="font-medium text-lg">
              {product.lowStockThreshold ?? "\u2014"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-base">Adjustment History</h3>
        <button
          type="button"
          onClick={() => setShowAdjustmentForm(!showAdjustmentForm)}
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-700"
        >
          <Plus size={16} />
          Add Adjustment
        </button>
      </div>

      {showAdjustmentForm && (
        <div className="mb-4 rounded-lg border border-border bg-card p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="adjustment-reason">Reason</Label>
              <Input
                id="adjustment-reason"
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                placeholder="e.g. Restock, Sold, Damaged"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="adjustment-quantity">Quantity Change</Label>
              <Input
                id="adjustment-quantity"
                type="number"
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(e.target.value)}
                placeholder="e.g. 10 or -5"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddAdjustment}
                disabled={!adjustmentReason.trim() || !adjustmentQuantity}
                className="rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <AdjustmentLog adjustments={adjustments} />
    </div>
  );
};

export const Route = createFileRoute(
  "/_app/@{$workspaceSlug}/inventory/$productId/",
)({
  component: ProductDetailPage,
});
