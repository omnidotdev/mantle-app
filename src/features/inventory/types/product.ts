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
