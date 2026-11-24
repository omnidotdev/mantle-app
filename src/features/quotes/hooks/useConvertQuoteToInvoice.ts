import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import { toast } from "sonner";

import { canConvertQuote } from "@/features/quotes/lib/convertToInvoice";
import {
  useAllInvoicesQuery,
  useConvertQuoteToInvoiceMutation,
} from "@/generated/graphql";
import {
  alreadyConvertedInvoiceId,
  planLimitMessage,
} from "@/lib/graphql/errors";

import type { Quote } from "@/features/quotes/types/quote";

interface Options {
  organizationId: string;
  workspaceSlug: string;
}

/**
 * Turn a sent or accepted quote into a draft invoice, then open it for
 * editing. The API does it in one step (invoice, line items and the quote's
 * converted status together, or none of it) and refuses a quote that already
 * has an invoice, so a double click or a second tab cannot create two
 */
const useConvertQuoteToInvoice = ({
  organizationId,
  workspaceSlug,
}: Options) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const convertQuote = useConvertQuoteToInvoiceMutation();

  // A ref, not just mutation state, so a fast double click cannot start two runs
  const inFlight = useRef(false);

  const openInvoice = (invoiceId: string) =>
    navigate({
      to: "/@{$workspaceSlug}/invoices/$invoiceId/edit",
      params: { workspaceSlug, invoiceId },
    });

  // Refetch cached lists even when no mounted page is using them, so the
  // invoice editor never opens on a stale list that lacks the new invoice
  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["AllQuotes"],
        refetchType: "all",
      }),
      queryClient.invalidateQueries({
        queryKey: useAllInvoicesQuery.getKey({ organizationId }),
        refetchType: "all",
      }),
    ]);

  const convert = async (
    quote: Pick<Quote, "id" | "status" | "convertedInvoiceId">,
  ) => {
    if (inFlight.current || !canConvertQuote(quote)) return;
    inFlight.current = true;

    try {
      const result = await convertQuote.mutateAsync({
        input: { quoteId: quote.id },
      });
      const converted = result.convertQuoteToInvoice;
      if (!converted) throw new Error("Invoice was not created");

      await refresh();

      const skipped = converted.skippedLineItems.length;
      toast.success(
        skipped
          ? `Invoice ${converted.invoiceNumber} created. ${skipped} royalty ${skipped === 1 ? "item was" : "items were"} left off; add ${skipped === 1 ? "it" : "them"} when the revenue is known.`
          : `Invoice ${converted.invoiceNumber} created`,
      );

      openInvoice(converted.invoiceId);
    } catch (err) {
      const existing = alreadyConvertedInvoiceId(err);
      if (existing) {
        await refresh();
        toast.info("This quote already has an invoice");
        openInvoice(existing);
        return;
      }

      toast.error(
        planLimitMessage(err) ?? "Could not create the invoice. Try again.",
      );
    } finally {
      inFlight.current = false;
    }
  };

  return { convert, converting: convertQuote.isPending };
};

export default useConvertQuoteToInvoice;
