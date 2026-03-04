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

export { generateInvoiceNumber };
