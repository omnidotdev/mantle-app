import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Edit, Eye, Package, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdjustmentLog from "@/features/inventory/components/AdjustmentLog";
import ProductForm from "@/features/inventory/components/ProductForm";
import { useInventoryStore } from "@/features/inventory/store/inventoryStore";
import { formatCurrency } from "@/features/invoices/types/invoice";

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
  const {
    products,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    addAdjustment,
    getAdjustmentsForProduct,
  } = useInventoryStore();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentProduct, setCurrentProduct] =
    useState<Partial<Product>>(defaultProduct);

  // Adjustment inline form state
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("");
  const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);

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

  const handleSaveProduct = () => {
    if (editingId) {
      updateProduct(editingId, currentProduct);
    } else {
      createProduct({
        name: currentProduct.name ?? "",
        description: currentProduct.description ?? null,
        sku: currentProduct.sku ?? null,
        unitPrice: currentProduct.unitPrice ?? null,
        currentQuantity: currentProduct.currentQuantity ?? 0,
        lowStockThreshold: currentProduct.lowStockThreshold ?? null,
        isActive: currentProduct.isActive ?? true,
      });
    }
    setViewMode("list");
    setEditingId(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Delete this product?")) {
      deleteProduct(id);
    }
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

  const handleAddAdjustment = () => {
    if (!editingId || !adjustmentReason.trim() || !adjustmentQuantity) return;

    addAdjustment({
      productId: editingId,
      quantityChange: Number.parseInt(adjustmentQuantity, 10),
      reason: adjustmentReason.trim(),
      referenceId: null,
    });

    setAdjustmentReason("");
    setAdjustmentQuantity("");
    setShowAdjustmentForm(false);
  };

  // Detail view
  if (viewMode === "detail" && editingId) {
    const product = getProduct(editingId);

    if (!product) {
      return (
        <div className="mx-auto max-w-6xl p-8">
          <p className="text-gray-500">Product not found</p>
        </div>
      );
    }

    const adjustments = getAdjustmentsForProduct(editingId);

    return (
      <div className="mx-auto max-w-6xl p-8">
        <div className="mb-6">
          <button
            type="button"
            onClick={handleBackToList}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={16} />
            Back to list
          </button>
        </div>

        {/* Product info summary */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="font-bold text-xl">{product.name}</h2>
              {product.sku && (
                <p className="text-gray-500 text-sm">SKU: {product.sku}</p>
              )}
            </div>
            <Badge variant={product.isActive ? "solid" : "outline"}>
              {product.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {product.description && (
            <p className="mb-4 text-gray-600 text-sm">{product.description}</p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="font-medium text-gray-500 text-xs uppercase">
                Unit Price
              </p>
              <p className="font-medium text-lg">
                {product.unitPrice
                  ? formatCurrency(product.unitPrice)
                  : "\u2014"}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-500 text-xs uppercase">
                Current Quantity
              </p>
              <p
                className={`font-medium text-lg ${
                  product.lowStockThreshold != null &&
                  product.currentQuantity <= product.lowStockThreshold
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {product.currentQuantity}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-500 text-xs uppercase">
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
          <h3 className="font-bold text-lg">Adjustment History</h3>
          <button
            type="button"
            onClick={() => setShowAdjustmentForm(!showAdjustmentForm)}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
          >
            <Plus size={18} />
            Add Adjustment
          </button>
        </div>

        {showAdjustmentForm && (
          <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
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
                  className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
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
      <div className="mx-auto max-w-6xl p-8">
        <div className="mb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={16} />
            Back to list
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-6 font-bold text-xl">{title}</h2>

          <ProductForm
            product={currentProduct}
            onProductChange={setCurrentProduct}
            onSave={handleSaveProduct}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to="/dashboard"
            className="text-gray-500 text-sm hover:text-gray-700"
          >
            &larr; Back
          </Link>
          <h1 className="font-bold text-2xl">Inventory</h1>
        </div>
        <button
          type="button"
          onClick={handleCreateProduct}
          className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
        >
          <Plus size={18} />
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
      <div className="rounded-lg border-2 border-gray-200 border-dashed py-12 text-center">
        <Package size={32} className="mx-auto mb-2 text-gray-400" />
        <p className="mb-4 text-gray-500">No products yet</p>
        <button
          type="button"
          onClick={onCreateNew}
          className="text-teal-600 hover:text-teal-700"
        >
          Add your first product
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
              Name
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
              SKU
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
              Unit Price
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
              Quantity
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
              Status
            </th>
            <th className="px-4 py-3 text-right font-medium text-gray-700 text-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-gray-100 border-t">
              <td className="px-4 py-3 font-medium text-sm">{product.name}</td>
              <td className="px-4 py-3 text-gray-600 text-sm">
                {product.sku ?? "\u2014"}
              </td>
              <td className="px-4 py-3 text-gray-600 text-sm">
                {product.unitPrice
                  ? formatCurrency(product.unitPrice)
                  : "\u2014"}
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={
                    product.lowStockThreshold != null &&
                    product.currentQuantity <= product.lowStockThreshold
                      ? "font-medium text-red-600"
                      : "font-medium text-green-600"
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
                    className="text-gray-500 hover:text-gray-700"
                    title="View details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="text-gray-500 hover:text-gray-700"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
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
