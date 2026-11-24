import type { SegmentedOption } from "@/components/ui/segmented-control";

/** Which document a quote renders as: the quote itself or its contract */
type PreviewType = "quote" | "contract";

const PREVIEW_TYPE_OPTIONS: SegmentedOption<PreviewType>[] = [
  { value: "quote", label: "Quote" },
  { value: "contract", label: "Contract" },
];

/**
 * Open the print dialog with a file-friendly document title (e.g.
 * `contract_Q-0042`) so "Save as PDF" suggests a sensible file name
 */
const printQuoteDocument = (
  previewType: PreviewType,
  quoteNumber: string | null | undefined,
) => {
  const originalTitle = document.title;
  document.title = `${previewType}_${quoteNumber ?? ""}`;
  window.print();
  document.title = originalTitle;
};

export type { PreviewType };
export { PREVIEW_TYPE_OPTIONS, printQuoteDocument };
