import SectionCard from "@/components/core/SectionCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import type { FormEvent } from "react";
import type { Product } from "@/features/inventory/types/product";

/** Form id, so Save buttons outside the form (page header, phone bar) submit it */
export const PRODUCT_FORM_ID = "product-form";

interface ProductFormProps {
  product: Partial<Product>;
  onProductChange: (product: Partial<Product>) => void;
  onSubmit: () => void;
}

/** Product fields grouped into section cards; the page owns the Save and Cancel actions */
const ProductForm = ({
  product,
  onProductChange,
  onSubmit,
}: ProductFormProps) => {
  const handleChange = (
    field: keyof Product,
    value: string | number | boolean | null,
  ) => {
    onProductChange({ ...product, [field]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product.name?.trim()) return;
    onSubmit();
  };

  return (
    <form
      id={PRODUCT_FORM_ID}
      method="post"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <SectionCard title="Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="product-name">Name</Label>
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
              placeholder="What this product is"
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

          <div className="space-y-1.5">
            <Label htmlFor="product-unit-price">Unit price</Label>
            <Input
              id="product-unit-price"
              type="number"
              inputMode="decimal"
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
      </SectionCard>

      <SectionCard title="Stock">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="product-quantity">Current quantity</Label>
            <Input
              id="product-quantity"
              type="number"
              inputMode="numeric"
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
            <Label htmlFor="product-low-stock">Low-stock threshold</Label>
            <Input
              id="product-low-stock"
              type="number"
              inputMode="numeric"
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
            <p className="text-muted-foreground text-xs">
              The product is flagged as low stock at or below this quantity
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Status">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Label htmlFor="product-active">Active</Label>
            <p className="mt-0.5 text-muted-foreground text-sm">
              Turn off for products you no longer stock. Inactive products stay
              in your records
            </p>
          </div>
          <Switch
            ids={{ hiddenInput: "product-active" }}
            checked={product.isActive ?? true}
            onCheckedChange={(checked) => handleChange("isActive", checked)}
          />
        </div>
      </SectionCard>
    </form>
  );
};

export default ProductForm;
