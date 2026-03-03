/**
 * Generate sequential quote number from existing quotes.
 */
const generateQuoteNumber = (quotes: { quoteNumber: string }[]): string => {
  const maxNum = quotes.reduce((max, q) => {
    const match = q.quoteNumber.match(/^QT-(\d+)$/);
    return match ? Math.max(max, Number.parseInt(match[1], 10)) : max;
  }, 0);

  return `QT-${String(maxNum + 1).padStart(4, "0")}`;
};

export { generateQuoteNumber };
