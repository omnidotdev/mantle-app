import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import ProductForm from "@/features/inventory/components/ProductForm";
import {
  useAllProductsQuery,
  useUpdateProductMutation,
} from "@/generated/graphql";

import type { Product } from "@/features/inventory/types/product";

const EditProductPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { productId } = Route.useParams();
  const queryClient = useQueryClient();

  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

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

  useEffect(() => {
    if (product && !initialized) {
      setCurrentProduct(product);
      setInitialized(true);
    }
  }, [product, initialized]);

  const invalidateProducts = () => {
    queryClient.invalidateQueries({
      queryKey: useAllProductsQuery.getKey({
        organizationId: organizationId ?? "",
      }),
    });
  };

  const updateProductMutation = useUpdateProductMutation();

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProductMutation.mutateAsync({
        input: {
          rowId: productId,
          patch: {
            name: currentProduct.name,
            description: currentProduct.description,
            sku: currentProduct.sku,
            unitPrice: currentProduct.unitPrice,
            currentQuantity: currentProduct.currentQuantity,
            lowStockThreshold: currentProduct.lowStockThreshold,
            isActive: currentProduct.isActive,
          },
        },
      });
      invalidateProducts();
      toast.success("Product saved");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save product",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (product) {
      setCurrentProduct(product);
    }
  };

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          Select an organization to edit products
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
          to="/inventory"
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
      <div className="mb-6">
        <Link
          to="/inventory"
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          &larr; Back to list
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 font-semibold text-lg">Edit Product</h2>

        <ProductForm
          product={currentProduct}
          onProductChange={setCurrentProduct}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
        />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_app/inventory/$productId/edit")({
  component: EditProductPage,
});
