import { create } from "zustand";

type ViewMode = "list" | "create" | "edit" | "preview";

interface InvoiceUIState {
  viewMode: ViewMode;
  editingId: string | null;
  setViewMode: (mode: ViewMode) => void;
  setEditingId: (id: string | null) => void;
  reset: () => void;
}

/**
 * Ephemeral UI state for the invoices module.
 * Data persistence is handled by TanStack Query + GraphQL.
 */
const useInvoiceUIStore = create<InvoiceUIState>((set) => ({
  viewMode: "list",
  editingId: null,
  setViewMode: (viewMode) => set({ viewMode }),
  setEditingId: (editingId) => set({ editingId }),
  reset: () => set({ viewMode: "list", editingId: null }),
}));

/**
 * Generate sequential invoice number from existing invoices.
 */
const generateInvoiceNumber = (
  invoices: { invoiceNumber: string }[],
): string => {
  const maxNum = invoices.reduce((max, inv) => {
    const match = inv.invoiceNumber.match(/^INV-(\d+)$/);
    return match ? Math.max(max, Number.parseInt(match[1], 10)) : max;
  }, 0);

  return `INV-${String(maxNum + 1).padStart(4, "0")}`;
};

export { useInvoiceUIStore, generateInvoiceNumber };
