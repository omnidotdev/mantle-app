import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";

import {
  canConvertQuote,
  quoteToInvoiceDraft,
} from "@/features/quotes/lib/convertToInvoice";
import {
  useAllInvoicesQuery,
  useAllQuotesQuery,
  useCreateInvoiceLineItemMutation,
  useCreateInvoiceMutation,
  useDeleteInvoiceMutation,
  useGenerateDocumentNumberMutation,
  useUpdateQuoteMutation,
} from "@/generated/graphql";

import type { Quote, QuoteLineItem } from "@/features/quotes/types/quote";

type ConvertibleQuote = Quote & {
  company?: { name: string } | null;
  contact?: { firstName: string; lastName: string } | null;
};

interface Options {
  organizationId: string;
  workspaceSlug: string;
}

/**
 * Turn a sent or accepted quote into a draft invoice: create the invoice and
 * its lines, link the quote to it (status `converted`), then open the invoice
 * for editing. Guards against converting the same quote twice by re-reading
 * the quote right before writing
 */
const useConvertQuoteToInvoice = ({
  organizationId,
  workspaceSlug,
}: Options) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const generateNumber = useGenerateDocumentNumberMutation();
  const createInvoice = useCreateInvoiceMutation();
  const createLineItem = useCreateInvoiceLineItemMutation();
  const deleteInvoice = useDeleteInvoiceMutation();
  const updateQuote = useUpdateQuoteMutation();

  // A ref, not just state, so a fast double click cannot start two runs
  const inFlight = useRef(false);
  const [converting, setConverting] = useState(false);

  const quotesVariables = { organizationId };

  const openInvoice = (invoiceId: string) =>
    navigate({
      to: "/@{$workspaceSlug}/invoices/$invoiceId/edit",
      params: { workspaceSlug, invoiceId },
    });

  const convert = async (
    quote: ConvertibleQuote,
    lineItems: QuoteLineItem[],
  ) => {
    if (inFlight.current || !canConvertQuote(quote)) return;
    inFlight.current = true;
    setConverting(true);

    let createdInvoiceId: string | null = null;

    try {
      // Re-read the quote so a conversion made in another tab or by a
      // teammate is not repeated
      const fresh = await queryClient.fetchQuery({
        queryKey: useAllQuotesQuery.getKey(quotesVariables),
        queryFn: useAllQuotesQuery.fetcher(quotesVariables),
        staleTime: 0,
      });
      const latest = fresh.quotes?.nodes.find((q) => q?.rowId === quote.id);

      if (latest?.convertedInvoiceId) {
        toast.info("This quote already has an invoice");
        openInvoice(latest.convertedInvoiceId);
        return;
      }

      const draft = quoteToInvoiceDraft(quote, lineItems);

      const numberResult = await generateNumber.mutateAsync({
        input: {
          organizationId,
          documentType: "invoice",
          companyId: draft.invoice.companyId ?? undefined,
        },
      });
      const invoiceNumber =
        numberResult.generateDocumentNumber?.documentNumber ?? "";

      const created = await createInvoice.mutateAsync({
        input: {
          invoice: {
            ...draft.invoice,
            organizationId,
            invoiceNumber,
            status: "draft",
            issueDate: new Date(),
          },
        },
      });

      const invoiceId = created.createInvoice?.invoice?.rowId;
      if (!invoiceId) throw new Error("Invoice was not created");
      createdInvoiceId = invoiceId;

      await Promise.all(
        draft.lineItems.map((li) =>
          createLineItem.mutateAsync({
            input: { invoiceLineItem: { ...li, invoiceId } },
          }),
        ),
      );

      await updateQuote.mutateAsync({
        input: {
          rowId: quote.id,
          patch: { convertedInvoiceId: invoiceId, status: "converted" },
        },
      });
      createdInvoiceId = null;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["AllQuotes"] }),
        queryClient.invalidateQueries({
          queryKey: useAllInvoicesQuery.getKey({ organizationId }),
        }),
      ]);

      const skipped = draft.skipped.length;
      toast.success(
        skipped
          ? `Invoice ${invoiceNumber} created. ${skipped} royalty ${skipped === 1 ? "item was" : "items were"} left off; add ${skipped === 1 ? "it" : "them"} when the revenue is known.`
          : `Invoice ${invoiceNumber} created`,
      );

      openInvoice(invoiceId);
    } catch {
      // Remove a half-built invoice so a retry starts clean and the quote
      // stays convertible
      if (createdInvoiceId) {
        await deleteInvoice
          .mutateAsync({ input: { rowId: createdInvoiceId } })
          .catch(() => undefined);
      }

      toast.error("Could not create the invoice. Try again.");
    } finally {
      inFlight.current = false;
      setConverting(false);
    }
  };

  return { convert, converting };
};

export default useConvertQuoteToInvoice;
