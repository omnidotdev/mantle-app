import type {
  AllProductsQuery,
  InventoryAdjustmentsQuery,
} from "@/generated/graphql";

export interface Product {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  sku: string | null;
  unitPrice: string | null;
  currentQuantity: number;
  lowStockThreshold: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryAdjustment {
  id: string;
  productId: string;
  quantityChange: number;
  reason: string;
  referenceId: string | null;
  createdAt: string;
}

/** How much of a product is left relative to its low-stock threshold */
export type StockLevel = "ok" | "low" | "out";

/**
 * Out when nothing is left, low when at or below the product's threshold
 * (products without a threshold are only ever ok or out)
 */
export const getStockLevel = ({
  currentQuantity,
  lowStockThreshold,
}: Pick<Product, "currentQuantity" | "lowStockThreshold">): StockLevel => {
  if (currentQuantity <= 0) return "out";
  if (lowStockThreshold != null && currentQuantity <= lowStockThreshold)
    return "low";

  return "ok";
};

/** Map the `AllProducts` query result to products, dropping null nodes */
export const productsFromQuery = (data: AllProductsQuery | undefined) =>
  (data?.products?.nodes ?? []).flatMap((node): Product[] => {
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
  });

/** Map the `InventoryAdjustments` query result, dropping null nodes */
export const adjustmentsFromQuery = (
  data: InventoryAdjustmentsQuery | undefined,
) =>
  (data?.inventoryAdjustments?.nodes ?? []).flatMap(
    (node): InventoryAdjustment[] => {
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
    },
  );
