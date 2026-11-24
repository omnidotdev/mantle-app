import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import BackLink from "@/components/core/BackLink";
import EmptyState from "@/components/core/EmptyState";
import MobileActionBar from "@/components/core/MobileActionBar";
import PageContainer from "@/components/core/PageContainer";
import PageHeader from "@/components/core/PageHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import ProductForm, {
  PRODUCT_FORM_ID,
} from "@/features/inventory/components/ProductForm";
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
    if (saving) return;
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
          description="Select a workspace to add products."
        />
      </PageContainer>
    );
  }

  const canSave = !!currentProduct.name?.trim() && !saving;

  const cancelLinkProps = {
    to: "/@{$workspaceSlug}/inventory",
    params: { workspaceSlug },
  } as const;

  return (
    <PageContainer width="narrow">
      <PageHeader
        back={<BackLink {...cancelLinkProps}>Inventory</BackLink>}
        title="New product"
        actions={
          <div className="hidden md:flex md:flex-wrap md:gap-2">
            <Link
              {...cancelLinkProps}
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
          {...cancelLinkProps}
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

export const Route = createFileRoute("/_app/@{$workspaceSlug}/inventory/new")({
  staticData: { title: "New product" },
  component: NewProductPage,
});
