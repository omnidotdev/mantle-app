import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Edit,
  Eye,
  Loader2,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdjustmentLog from "@/features/inventory/components/AdjustmentLog";
import ProductForm from "@/features/inventory/components/ProductForm";
import { formatCurrency } from "@/features/invoices/types/invoice";
import {
  useAllProductsQuery,
  useCreateInventoryAdjustmentMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useInventoryAdjustmentsQuery,
  useUpdateProductMutation,
} from "@/generated/graphql";

import type { Product } from "@/features/inventory/types/product";

type ViewMode = "list" | "create" | "edit" | "detail";

const defaultProduct: Partial<Product> = {
  name: "",
  description: null,
  sku: null,
  unitPrice: null,
  currentQuantity: 0,
  lowStockThreshold: null,
  isActive: true,
};

const InventoryPage = () => {
  const { organizationId } = Route.useRouteContext();
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentProduct, setCurrentProduct] =
    useState<Partial<Product>>(defaultProduct);
  const [saving, setSaving] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
  }>({ open: false, id: "" });

  // Adjustment inline form state
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

  const { data: adjustmentsData } = useInventoryAdjustmentsQuery(
    { productId: editingId ?? "" },
    { enabled: !!editingId && viewMode === "detail" },
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
    if (editingId) {
      queryClient.invalidateQueries({
        queryKey: useInventoryAdjustmentsQuery.getKey({
          productId: editingId,
        }),
      });
    }
  };

  const createProductMutation = useCreateProductMutation();
  const updateProductMutation = useUpdateProductMutation();
  const deleteProductMutation = useDeleteProductMutation({
    onSuccess: invalidateProducts,
  });
  const createAdjustmentMutation = useCreateInventoryAdjustmentMutation();

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

  // Product handlers
  const handleCreateProduct = () => {
    setCurrentProduct({ ...defaultProduct });
    setEditingId(null);
    setViewMode("create");
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setEditingId(product.id);
    setViewMode("edit");
  };

  const handleViewProduct = (product: Product) => {
    setEditingId(product.id);
    setViewMode("detail");
  };

  const handleSaveProduct = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await updateProductMutation.mutateAsync({
          input: {
            rowId: editingId,
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
      } else {
        const result = await createProductMutation.mutateAsync({
          input: {
            product: {
              organizationId,
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
        if (newId) {
          setEditingId(newId);
          setViewMode("edit");
        }
      }
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

  const handleDeleteProduct = (id: string) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleCancel = () => {
    setViewMode("list");
    setEditingId(null);
  };

  const handleBackToList = () => {
    setViewMode("list");
    setEditingId(null);
    setShowAdjustmentForm(false);
    setAdjustmentReason("");
    setAdjustmentQuantity("");
  };

  const handleAddAdjustment = async () => {
    if (!editingId || !adjustmentReason.trim() || !adjustmentQuantity) return;

    try {
      await createAdjustmentMutation.mutateAsync({
        input: {
          inventoryAdjustment: {
            productId: editingId,
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

  // Detail view
  if (viewMode === "detail" && editingId) {
    const product = products.find((p) => p.id === editingId);

    if (!product) {
      return (
        <div className="p-6">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            type="button"
            onClick={handleBackToList}
            className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back to list
          </button>
        </div>

        {/* Product info summary */}
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
            <p className="mb-4 text-foreground text-sm">
              {product.description}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="font-medium text-muted-foreground text-xs uppercase">
                Unit Price
              </p>
              <p className="font-medium text-lg">
                {product.unitPrice
                  ? formatCurrency(product.unitPrice)
                  : "\u2014"}
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

        {/* Adjustment log */}
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
  }

  // Create/edit views
  if (viewMode === "create" || viewMode === "edit") {
    const title = editingId ? "Edit Product" : "New Product";

    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back to list
          </button>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-6 font-semibold text-lg">{title}</h2>

          <ProductForm
            product={currentProduct}
            onProductChange={setCurrentProduct}
            onSave={handleSaveProduct}
            onCancel={handleCancel}
            saving={saving}
          />
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-xl">Inventory</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            {products.length}{" "}
            {products.length === 1 ? "product" : "products"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateProduct}
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-700"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <ProductsTable
        products={products}
        onView={handleViewProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onCreateNew={handleCreateProduct}
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

// Products table sub-component
const ProductsTable = ({
  products,
  onView,
  onEdit,
  onDelete,
  onCreateNew,
}: {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}) => {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border-2 border-border border-dashed py-12 text-center">
        <Package size={32} className="mx-auto mb-2 text-muted-foreground" />
        <p className="mb-4 text-muted-foreground">No products yet</p>
        <button
          type="button"
          onClick={onCreateNew}
          className="text-primary-600 hover:text-primary-700"
        >
          Add your first product
        </button>
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
                  <button
                    type="button"
                    onClick={() => onView(product)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="View product details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Edit product"
                  >
                    <Edit size={16} />
                  </button>
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

export const Route = createFileRoute("/_auth/inventory/")({
  component: InventoryPage,
});
