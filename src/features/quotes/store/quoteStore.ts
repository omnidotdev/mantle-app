import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Quote } from "../types/quote";

// TODO: Migrate to database persistence via GraphQL API

type ViewMode = "list" | "create" | "edit" | "preview";

interface StoredQuote extends Quote {}

interface QuoteStore {
  quotes: StoredQuote[];
  createQuote: (
    quote: Omit<Quote, "id" | "createdAt" | "updatedAt" | "organizationId">,
    organizationId: string,
  ) => StoredQuote;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  getQuote: (id: string) => StoredQuote | undefined;
  getQuotesForOrg: (orgId: string) => StoredQuote[];
}

const generateQuoteNumber = (quotes: StoredQuote[]): string => {
  const maxNum = quotes.reduce((max, q) => {
    const match = q.quoteNumber.match(/^QT-(\d+)$/);
    return match ? Math.max(max, Number.parseInt(match[1], 10)) : max;
  }, 0);

  return `QT-${String(maxNum + 1).padStart(4, "0")}`;
};

const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      quotes: [],

      createQuote: (quote, organizationId) => {
        const now = new Date().toISOString();
        const newQuote: StoredQuote = {
          ...quote,
          id: crypto.randomUUID(),
          organizationId,
          quoteNumber: quote.quoteNumber || generateQuoteNumber(get().quotes),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          quotes: [...state.quotes, newQuote],
        }));

        return newQuote;
      },

      updateQuote: (id, updates) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === id
              ? { ...q, ...updates, updatedAt: new Date().toISOString() }
              : q,
          ),
        }));
      },

      deleteQuote: (id) => {
        set((state) => ({
          quotes: state.quotes.filter((q) => q.id !== id),
        }));
      },

      getQuote: (id) => {
        return get().quotes.find((q) => q.id === id);
      },

      getQuotesForOrg: (orgId) =>
        get().quotes.filter((q) => q.organizationId === orgId),
    }),
    {
      name: "mantle-quotes",
      version: 1,
      migrate: (persisted, version) => {
        const state = persisted as Record<string, unknown>;

        // v0 → v1: add new contract and pricing fields
        if (version === 0) {
          const quotes = (state.quotes as Record<string, unknown>[]) ?? [];
          state.quotes = quotes.map((q) => {
            const lineItems =
              (q.quoteLineItems as Record<string, unknown>[]) ?? [];
            return {
              ...q,
              projectType: null,
              timeRange: null,
              additionalTerms: null,
              clientName: null,
              clientEmail: null,
              quoteLineItems: lineItems.map((li) => ({
                ...li,
                hourlyRate: null,
                weeklyCapHours: null,
                monthlyCapHours: null,
                maxCapHours: null,
                royaltyTimeframe: null,
                royaltyTimeframeUnit: null,
                royaltyThreshold: null,
                royaltyBuyoutAmount: null,
              })),
            };
          });
        }

        return state as unknown as QuoteStore;
      },
      // Only persist data, not UI state
      partialize: (state) => ({
        quotes: state.quotes,
      }),
    },
  ),
);

export { useQuoteStore, generateQuoteNumber };
export type { StoredQuote, ViewMode };
