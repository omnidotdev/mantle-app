import { Input } from "@omnidotdev/thornberry/input";
import { Label } from "@omnidotdev/thornberry/label";
import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BellRingIcon,
  BoxesIcon,
  Building2Icon,
  PackageXIcon,
  PencilIcon,
  PlusIcon,
  TagIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import BackLink from "@/components/core/BackLink";
import EmptyState from "@/components/core/EmptyState";
import EmptyValue from "@/components/core/EmptyValue";
import LoadingState from "@/components/core/LoadingState";
import MobileActionBar from "@/components/core/MobileActionBar";
import PageContainer from "@/components/core/PageContainer";
import PageHeader from "@/components/core/PageHeader";
import SectionCard from "@/components/core/SectionCard";
import StatCard from "@/components/core/StatCard";
import StatusBadge from "@/components/core/StatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import AdjustmentLog from "@/features/inventory/components/AdjustmentLog";
import StockBadge from "@/features/inventory/components/StockBadge";
import {
  adjustmentsFromQuery,
  productsFromQuery,
} from "@/features/inventory/types/product";
import { formatCurrency } from "@/features/invoices/types/invoice";
import {
  useAllProductsQuery,
  useCreateInventoryAdjustmentMutation,
  useInventoryAdjustmentsQuery,
} from "@/generated/graphql";

import type { FormEvent } from "react";

const ProductDetailPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug, productId } = Route.useParams();
  const queryClient = useQueryClient();

  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("");
  const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
  const historyRef = useRef<HTMLElement>(null);
  const reasonInputRef = useRef<HTMLInputElement>(null);
  // Bumped on every "Adjust stock" press so focus moves even when the form is already open
  const [focusRequest, setFocusRequest] = useState(0);

  const { data: productsData, isLoading } = useAllProductsQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const product = useMemo(
    () => productsFromQuery(productsData).find((p) => p.id === productId),
    [productsData, productId],
  );

  const { data: adjustmentsData } = useInventoryAdjustmentsQuery(
    { productId },
    { enabled: !!productId },
  );

  // Newest first
  const adjustments = useMemo(
    () =>
      adjustmentsFromQuery(adjustmentsData).sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      ),
    [adjustmentsData],
  );

  useEffect(() => {
    if (!focusRequest) return;

    historyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    reasonInputRef.current?.focus({ preventScroll: true });
  }, [focusRequest]);

  const openAdjustmentForm = () => {
    setShowAdjustmentForm(true);
    setFocusRequest((n) => n + 1);
  };

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

  const canSubmitAdjustment =
    !!adjustmentReason.trim() &&
    !!adjustmentQuantity &&
    !createAdjustmentMutation.isPending;

  const handleAddAdjustment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    } catch {
      toast.error("Could not add the adjustment");
    }
  };

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
        <LoadingState label="Loading product" />
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer>
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

  const editLinkProps = {
    to: "/@{$workspaceSlug}/inventory/$productId/edit",
    params: { workspaceSlug, productId },
  } as const;

  return (
    <PageContainer>
      <PageHeader
        back={
          <BackLink
            to="/@{$workspaceSlug}/inventory"
            params={{ workspaceSlug }}
          >
            Inventory
          </BackLink>
        }
        title={product.name}
        badge={
          <StatusBadge status={product.isActive ? "active" : "inactive"} />
        }
        description={
          <>
            {product.sku ?? "No SKU"}
            {" · "}
            {product.unitPrice ? (
              <span className="tabular">
                {formatCurrency(product.unitPrice)} per unit
              </span>
            ) : (
              "No unit price"
            )}
          </>
        }
        actions={
          <div className="hidden md:flex md:flex-wrap md:gap-2">
            <Link
              {...editLinkProps}
              className={buttonVariants({ variant: "outline" })}
            >
              <PencilIcon />
              Edit
            </Link>
            <Button onClick={openAdjustmentForm}>
              <PlusIcon />
              Adjust stock
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <StatCard
          icon={BoxesIcon}
          label="In stock"
          value={
            <span className="inline-flex items-center gap-2.5">
              {product.currentQuantity}
              <StockBadge product={product} />
            </span>
          }
        />
        <StatCard
          icon={TagIcon}
          label="Unit price"
          value={
            product.unitPrice ? (
              formatCurrency(product.unitPrice)
            ) : (
              <EmptyValue />
            )
          }
        />
        <StatCard
          icon={BellRingIcon}
          label="Low-stock threshold"
          value={product.lowStockThreshold ?? <EmptyValue />}
          className="max-lg:col-span-2"
        />
      </div>

      {product.description && (
        <SectionCard title="Description" className="mt-6">
          <p className="text-sm whitespace-pre-line">{product.description}</p>
        </SectionCard>
      )}

      <section
        ref={historyRef}
        aria-labelledby="adjustment-history-heading"
        className="mt-6 min-w-0 scroll-mt-20 overflow-hidden rounded-2xl bg-card text-card-foreground shadow-card dark:border dark:border-border/60 dark:shadow-none"
      >
        <div className="flex min-h-13 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-border px-4 py-3 sm:px-5">
          <h2 id="adjustment-history-heading" className="text-sm font-semibold">
            Adjustment history
          </h2>
          {adjustments.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                showAdjustmentForm
                  ? setShowAdjustmentForm(false)
                  : openAdjustmentForm()
              }
              aria-expanded={showAdjustmentForm}
            >
              <PlusIcon />
              Add adjustment
            </Button>
          )}
        </div>

        {showAdjustmentForm && (
          <form
            method="post"
            onSubmit={handleAddAdjustment}
            className="grid grid-cols-1 gap-4 border-b border-border bg-muted/60 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] lg:items-end"
          >
            <div className="space-y-1.5">
              <Label htmlFor="adjustment-reason">Reason</Label>
              <Input
                ref={reasonInputRef}
                id="adjustment-reason"
                className="bg-card"
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                placeholder="e.g. Restock, Sold, Damaged"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="adjustment-quantity">Quantity change</Label>
              <Input
                id="adjustment-quantity"
                className="bg-card"
                type="number"
                inputMode="numeric"
                step="1"
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(e.target.value)}
                placeholder="e.g. 10 or -5"
              />
            </div>
            <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end lg:col-span-1">
              <Button
                variant="ghost"
                onClick={() => setShowAdjustmentForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmitAdjustment}>
                Save adjustment
              </Button>
            </div>
          </form>
        )}

        <AdjustmentLog adjustments={adjustments} onAdd={openAdjustmentForm} />
      </section>

      <MobileActionBar>
        <Link
          {...editLinkProps}
          className={buttonVariants({
            variant: "outline",
            className: "flex-1",
          })}
        >
          <PencilIcon />
          Edit
        </Link>
        <Button onClick={openAdjustmentForm} className="flex-1">
          <PlusIcon />
          Adjust stock
        </Button>
      </MobileActionBar>
    </PageContainer>
  );
};

export const Route = createFileRoute(
  "/_app/@{$workspaceSlug}/inventory/$productId/",
)({
  staticData: { title: "Product" },
  component: ProductDetailPage,
});
