import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Invoice, InvoiceLineItem } from "../types/invoice";

// TODO: Migrate to database persistence via GraphQL API
// Once codegen runs, replace this store with generated React Query hooks.
// Zustand remains only for ephemeral UI state.

interface StoredInvoice extends Invoice {}

interface InvoiceStore {
  invoices: StoredInvoice[];
  createInvoice: (
    invoice: Omit<
      Invoice,
      "id" | "createdAt" | "updatedAt" | "organizationId"
    >,
  ) => StoredInvoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => StoredInvoice | undefined;
}

/**
 * Generate sequential invoice number.
 */
const generateInvoiceNumber = (invoices: StoredInvoice[]): string => {
  const maxNum = invoices.reduce((max, inv) => {
    const match = inv.invoiceNumber.match(/^INV-(\d+)$/);
    return match ? Math.max(max, Number.parseInt(match[1], 10)) : max;
  }, 0);

  return `INV-${String(maxNum + 1).padStart(4, "0")}`;
};

const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: [],

      createInvoice: (invoice) => {
        const now = new Date().toISOString();
        const newInvoice: StoredInvoice = {
          ...invoice,
          id: crypto.randomUUID(),
          organizationId: "",
          invoiceNumber:
            invoice.invoiceNumber || generateInvoiceNumber(get().invoices),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          invoices: [...state.invoices, newInvoice],
        }));

        return newInvoice;
      },

      updateInvoice: (id, updates) => {
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id
              ? { ...inv, ...updates, updatedAt: new Date().toISOString() }
              : inv,
          ),
        }));
      },

      deleteInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id),
        }));
      },

      getInvoice: (id) => {
        return get().invoices.find((inv) => inv.id === id);
      },
    }),
    {
      name: "mantle-invoices",
      partialize: (state) => ({
        invoices: state.invoices,
      }),
    },
  ),
);

export { useInvoiceStore, generateInvoiceNumber };
export type { StoredInvoice };
