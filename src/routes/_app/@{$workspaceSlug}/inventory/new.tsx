import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import ProductForm from "@/features/inventory/components/ProductForm";
import {
  useAllProductsQuery,
  useCreateProductMutation,
} from "@/generated/graphql";

import type { Product } from "@/features/inventory/types/product";

const defaultProduct: Partial<Product> = {
  name: "",
  description: null,
  sku: null,
  unitPrice: null,
  currentQuantity: 0,
  lowStockThreshold: null,
  isActive: true,
};

const NewProductPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentProduct, setCurrentProduct] =
    useState<Partial<Product>>(defaultProduct);
  const [saving, setSaving] = useState(false);

  const invalidateProducts = () => {
    queryClient.invalidateQueries({
      queryKey: useAllProductsQuery.getKey({
        organizationId: organizationId ?? "",
      }),
    });
  };

  const createProductMutation = useCreateProductMutation();

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await createProductMutation.mutateAsync({
        input: {
          product: {
            organizationId: organizationId ?? "",
            name: currentProduct.name ?? "",
            description: currentProduct.description ?? null,
            sku: currentProduct.sku ?? null,
            unitPrice: currentProduct.unitPrice ?? null,
            currentQuantity: currentProduct.currentQuantity ?? 0,
            lowStockThreshold: currentProduct.lowStockThreshold ?? null,
            isActive: currentProduct.isActive ?? true,
          },
        },
      });

      const newId = result.createProduct?.product?.rowId;
      invalidateProducts();
      toast.success("Product saved");

      if (newId) {
        navigate({
          to: "/@{$workspaceSlug}/inventory/$productId/edit",
          params: { workspaceSlug, productId: newId },
        });
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save product",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate({ to: "/@{$workspaceSlug}/inventory", params: { workspaceSlug } });
  };

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          Select a workspace to create products
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/@{$workspaceSlug}/inventory"
          params={{ workspaceSlug }}
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          &larr; Back to list
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 font-semibold text-lg">New Product</h2>

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

export const Route = createFileRoute("/_app/@{$workspaceSlug}/inventory/new")({
  component: NewProductPage,
});
