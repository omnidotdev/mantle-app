import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { InventoryAdjustment, Product } from "../types/product";

// TODO: Migrate to database persistence via GraphQL API

interface InventoryStore {
  products: Product[];
  adjustments: InventoryAdjustment[];

  // Product CRUD
  createProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt" | "organizationId">,
  ) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;

  // Adjustments
  addAdjustment: (
    adjustment: Omit<InventoryAdjustment, "id" | "createdAt">,
  ) => InventoryAdjustment;
  getAdjustmentsForProduct: (productId: string) => InventoryAdjustment[];
}

const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      products: [],
      adjustments: [],

      createProduct: (product) => {
        const now = new Date().toISOString();
        const newProduct: Product = {
          ...product,
          id: crypto.randomUUID(),
          organizationId: "",
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          products: [...state.products, newProduct],
        }));

        return newProduct;
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p,
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          adjustments: state.adjustments.filter((a) => a.productId !== id),
        }));
      },

      getProduct: (id) => {
        return get().products.find((p) => p.id === id);
      },

      addAdjustment: (adjustment) => {
        const newAdjustment: InventoryAdjustment = {
          ...adjustment,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          adjustments: [...state.adjustments, newAdjustment],
          products: state.products.map((p) =>
            p.id === adjustment.productId
              ? {
                  ...p,
                  currentQuantity:
                    p.currentQuantity + adjustment.quantityChange,
                  updatedAt: new Date().toISOString(),
                }
              : p,
          ),
        }));

        return newAdjustment;
      },

      getAdjustmentsForProduct: (productId) => {
        return get().adjustments.filter((a) => a.productId === productId);
      },
    }),
    {
      name: "mantle-inventory",
      // Only persist data, not UI state
      partialize: (state) => ({
        products: state.products,
        adjustments: state.adjustments,
      }),
    },
  ),
);

export { useInventoryStore };
