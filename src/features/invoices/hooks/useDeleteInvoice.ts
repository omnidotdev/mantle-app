import { useQueryClient } from "@tanstack/react-query";

import {
  useAllInvoicesQuery,
  useDeleteInvoiceMutation,
} from "@/generated/graphql";

/**
 * Delete an invoice. An invoice created from a quote releases that quote: the
 * API unlinks it and puts it back to `accepted`, ready to invoice again, in
 * the same step as the delete
 */
const useDeleteInvoice = (organizationId: string) => {
  const queryClient = useQueryClient();
  const deleteInvoice = useDeleteInvoiceMutation();

  const remove = async (invoiceId: string) => {
    try {
      await deleteInvoice.mutateAsync({ input: { rowId: invoiceId } });
    } finally {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: useAllInvoicesQuery.getKey({ organizationId }),
        }),
        queryClient.invalidateQueries({ queryKey: ["AllQuotes"] }),
      ]);
    }
  };

  return { remove, deleting: deleteInvoice.isPending };
};

export default useDeleteInvoice;
