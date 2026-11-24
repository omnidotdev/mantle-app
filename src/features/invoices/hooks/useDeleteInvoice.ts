import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  RELEASED_QUOTE_STATUS,
  findSourceQuote,
} from "@/features/quotes/lib/convertToInvoice";
import {
  useAllInvoicesQuery,
  useAllQuotesQuery,
  useDeleteInvoiceMutation,
  useUpdateQuoteMutation,
} from "@/generated/graphql";

/**
 * Delete an invoice. An invoice created from a quote is referenced by that
 * quote, so the quote is unlinked first (back to `accepted`, ready to invoice
 * again); without this the delete is refused. If the delete still fails, the
 * link is restored
 */
const useDeleteInvoice = (organizationId: string) => {
  const queryClient = useQueryClient();
  const deleteInvoice = useDeleteInvoiceMutation();
  const updateQuote = useUpdateQuoteMutation();
  const [deleting, setDeleting] = useState(false);

  const quotesVariables = { organizationId };

  const remove = async (invoiceId: string) => {
    setDeleting(true);

    try {
      const quotes = await queryClient.fetchQuery({
        queryKey: useAllQuotesQuery.getKey(quotesVariables),
        queryFn: useAllQuotesQuery.fetcher(quotesVariables),
        staleTime: 0,
      });
      const source = findSourceQuote(
        (quotes.quotes?.nodes ?? []).flatMap((q) => (q ? [q] : [])),
        invoiceId,
      );

      if (source) {
        await updateQuote.mutateAsync({
          input: {
            rowId: source.rowId,
            patch: { convertedInvoiceId: null, status: RELEASED_QUOTE_STATUS },
          },
        });
      }

      try {
        await deleteInvoice.mutateAsync({ input: { rowId: invoiceId } });
      } catch (err) {
        if (source) {
          await updateQuote
            .mutateAsync({
              input: {
                rowId: source.rowId,
                patch: {
                  convertedInvoiceId: invoiceId,
                  status: source.status,
                },
              },
            })
            .catch(() => undefined);
        }
        throw err;
      }
    } finally {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: useAllInvoicesQuery.getKey({ organizationId }),
        }),
        queryClient.invalidateQueries({ queryKey: ["AllQuotes"] }),
      ]);
      setDeleting(false);
    }
  };

  return { remove, deleting };
};

export default useDeleteInvoice;
