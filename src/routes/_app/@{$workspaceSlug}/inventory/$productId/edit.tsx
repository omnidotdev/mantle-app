import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Building2Icon, PackageXIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import BackLink from "@/components/core/BackLink";
import EmptyState from "@/components/core/EmptyState";
import LoadingState from "@/components/core/LoadingState";
import MobileActionBar from "@/components/core/MobileActionBar";
import PageContainer from "@/components/core/PageContainer";
import PageHeader from "@/components/core/PageHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import ProductForm, {
  PRODUCT_FORM_ID,
} from "@/features/inventory/components/ProductForm";
import { productsFromQuery } from "@/features/inventory/types/product";
import {
  useAllProductsQuery,
  useUpdateProductMutation,
} from "@/generated/graphql";

import type { Product } from "@/features/inventory/types/product";

const EditProductPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug, productId } = Route.useParams();
  const queryClient = useQueryClient();

  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const { data: productsData, isLoading } = useAllProductsQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const product = useMemo(
    () => productsFromQuery(productsData).find((p) => p.id === productId),
    [productsData, productId],
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
    if (saving) return;
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
    } catch {
      toast.error("Could not save the product");
    } finally {
      setSaving(false);
    }
  };

  if (!organizationId) {
    return (
      <PageContainer width="narrow">
        <EmptyState
          icon={Building2Icon}
          title="No workspace selected"
          description="Select a workspace to edit products."
        />
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer width="narrow">
        <LoadingState label="Loading product" />
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer width="narrow">
        <EmptyState
          icon={PackageXIcon}
          title="Product not found"
          description="It may have been deleted, or the link is wrong."
          action={
            <Link
              to="/@{$workspaceSlug}/inventory"
              params={{ workspaceSlug }}
              className={buttonVariants({ variant: "outline" })}
            >
              Back to inventory
            </Link>
          }
        />
      </PageContainer>
    );
  }

  const canSave = !!currentProduct.name?.trim() && !saving;

  // Cancel leaves without saving and returns to the product
  const productLinkProps = {
    to: "/@{$workspaceSlug}/inventory/$productId",
    params: { workspaceSlug, productId },
  } as const;

  return (
    <PageContainer width="narrow">
      <PageHeader
        back={<BackLink {...productLinkProps}>{product.name}</BackLink>}
        title={`Edit ${product.name}`}
        actions={
          <div className="hidden md:flex md:flex-wrap md:gap-2">
            <Link
              {...productLinkProps}
              className={buttonVariants({ variant: "outline" })}
            >
              Cancel
            </Link>
            <Button type="submit" form={PRODUCT_FORM_ID} disabled={!canSave}>
              {saving ? "Saving" : "Save"}
            </Button>
          </div>
        }
      />

      <ProductForm
        product={currentProduct}
        onProductChange={setCurrentProduct}
        onSubmit={handleSave}
      />

      <MobileActionBar>
        <Link
          {...productLinkProps}
          className={buttonVariants({
            variant: "outline",
            className: "flex-1",
          })}
        >
          Cancel
        </Link>
        <Button
          type="submit"
          form={PRODUCT_FORM_ID}
          disabled={!canSave}
          className="flex-1"
        >
          {saving ? "Saving" : "Save"}
        </Button>
      </MobileActionBar>
    </PageContainer>
  );
};

export const Route = createFileRoute(
  "/_app/@{$workspaceSlug}/inventory/$productId/edit",
)({
  staticData: { title: "Edit product" },
  component: EditProductPage,
});
