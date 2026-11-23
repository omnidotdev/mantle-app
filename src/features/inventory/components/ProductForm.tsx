import { Input } from "@omnidotdev/thornberry/input";
import { Label } from "@omnidotdev/thornberry/label";
import { Textarea } from "@omnidotdev/thornberry/textarea";

import type { Product } from "@/features/inventory/types/product";

interface ProductFormProps {
  product: Partial<Product>;
  onProductChange: (product: Partial<Product>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
}

const ProductForm = ({
  product,
  onProductChange,
  onSave,
  onCancel,
  saving,
}: ProductFormProps) => {
  const handleChange = (
    field: keyof Product,
    value: string | number | boolean | null,
  ) => {
    onProductChange({ ...product, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Basic information */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="product-name">Name *</Label>
            <Input
              id="product-name"
              value={product.name ?? ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Product name"
              required
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="product-description">Description</Label>
            <Textarea
              id="product-description"
              value={product.description ?? ""}
              onChange={(e) =>
                handleChange("description", e.target.value || null)
              }
              rows={3}
              placeholder="Product description"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="product-sku">SKU</Label>
            <Input
              id="product-sku"
              value={product.sku ?? ""}
              onChange={(e) => handleChange("sku", e.target.value || null)}
              placeholder="e.g. SKU-001"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">Pricing</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="product-unit-price">Unit Price</Label>
            <Input
              id="product-unit-price"
              type="number"
              min="0"
              step="0.01"
              value={product.unitPrice ?? ""}
              onChange={(e) =>
                handleChange("unitPrice", e.target.value || null)
              }
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Stock */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">Stock</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="product-quantity">Current Quantity</Label>
            <Input
              id="product-quantity"
              type="number"
              min="0"
              step="1"
              value={product.currentQuantity ?? 0}
              onChange={(e) =>
                handleChange(
                  "currentQuantity",
                  Number.parseInt(e.target.value, 10) || 0,
                )
              }
              placeholder="0"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="product-low-stock">Low Stock Threshold</Label>
            <Input
              id="product-low-stock"
              type="number"
              min="0"
              step="1"
              value={product.lowStockThreshold ?? ""}
              onChange={(e) =>
                handleChange(
                  "lowStockThreshold",
                  e.target.value ? Number.parseInt(e.target.value, 10) : null,
                )
              }
              placeholder="e.g. 10"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">Status</h3>

        <div className="flex items-center gap-2">
          <input
            id="product-active"
            type="checkbox"
            checked={product.isActive ?? true}
            onChange={(e) => handleChange("isActive", e.target.checked)}
            className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
          />
          <Label htmlFor="product-active">Active</Label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 border-border border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-input px-4 py-2 hover:bg-muted"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!product.name?.trim() || saving}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProductForm;
