import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Invoice } from "../types/invoice";

// TODO: Migrate to database persistence via GraphQL API
// See: https://github.com/omnidotdev/mantle/issues/XXX

type InvoiceStatus = "draft" | "sent" | "paid";

interface StoredInvoice extends Invoice {
  id: string;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceStore {
  invoices: StoredInvoice[];
  createInvoice: (invoice: Invoice) => StoredInvoice;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => StoredInvoice | undefined;
  updateStatus: (id: string, status: InvoiceStatus) => void;
}

const generateId = () => crypto.randomUUID();

const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: [],

      createInvoice: (invoice) => {
        const now = new Date().toISOString();
        const newInvoice: StoredInvoice = {
          ...invoice,
          id: generateId(),
          status: "draft",
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

      updateStatus: (id, status) => {
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id
              ? { ...inv, status, updatedAt: new Date().toISOString() }
              : inv,
          ),
        }));
      },
    }),
    {
      name: "mantle-invoices",
    },
  ),
);

export { useInvoiceStore };
export type { StoredInvoice, InvoiceStatus };
